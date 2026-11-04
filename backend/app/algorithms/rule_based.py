import time
from typing import List, Dict, Optional
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO, AllocationAssignment, AllocationResult, generate_decision_explanation
from app.algorithms.cost_function import calculate_single_allocation_cost, CostWeights

def run_rule_based_allocation(
    customers: List[CustomerDTO],
    tables: List[TableDTO],
    waiters: List[WaiterDTO],
    weights: Optional[CostWeights] = None
) -> AllocationResult:
    start_time = time.perf_counter()
    nodes_explored = 0
    assignments: List[AllocationAssignment] = []
    unallocated: List[int] = []
    total_cost = 0.0

    # Local mutable state tracking
    available_tables = {t.id: t for t in tables if t.status == "AVAILABLE" and t.is_active}
    waiter_loads = {w.id: dict(w=w, assigned=w.assigned_tables) for w in waiters if w.availability}

    # Sort customers by arrival FIFO order
    sorted_customers = sorted(customers, key=lambda c: -c.waiting_minutes)

    for group in sorted_customers:
        nodes_explored += 1
        # Step 1: Find candidate tables with capacity >= group_size
        candidate_tables = [
            t for t in available_tables.values()
            if t.capacity >= group.group_size
        ]

        if not candidate_tables:
            unallocated.append(group.id)
            total_cost += weights.unallocated_penalty if weights else 100.0
            continue

        # Step 2: Preference rule check (location requests)
        preferred_tables = []
        if group.special_requirements:
            req_l = group.special_requirements.lower()
            for t in candidate_tables:
                if any(loc in req_l and loc in t.location.lower() for loc in ["window", "booth", "patio"]):
                    preferred_tables.append(t)

        target_pool = preferred_tables if preferred_tables else candidate_tables

        # Step 3: Pick smallest suitable table (minimal wasted capacity)
        target_pool.sort(key=lambda t: (t.capacity - group.group_size, t.capacity))
        selected_table = target_pool[0]

        # Step 4: Pick available waiter with lowest load under limit
        eligible_waiters = [
            wl for wl in waiter_loads.values()
            if wl["assigned"] < wl["w"].max_tables
        ]

        if not eligible_waiters:
            # No waiter available
            unallocated.append(group.id)
            total_cost += weights.unallocated_penalty if weights else 100.0
            continue

        eligible_waiters.sort(key=lambda item: (item["assigned"] / item["w"].max_tables, item["assigned"]))
        selected_waiter_item = eligible_waiters[0]
        selected_waiter = selected_waiter_item["w"]

        # Calculate cost
        waiter_ratio = (selected_waiter_item["assigned"] + 1) / selected_waiter.max_tables
        cost = calculate_single_allocation_cost(
            group_size=group.group_size,
            table_capacity=selected_table.capacity,
            waiting_minutes=group.waiting_minutes,
            waiter_workload=waiter_ratio,
            priority=group.priority,
            special_request=group.special_requirements,
            table_location=selected_table.location,
            weights=weights
        )

        rejected = [
            f"Table {t.table_number} ({t.capacity}-top): larger capacity gap"
            for t in candidate_tables if t.id != selected_table.id
        ][:3]

        reason = generate_decision_explanation(
            group=group,
            table=selected_table,
            waiter=selected_waiter,
            cost=cost,
            rejected=rejected,
            algorithm_name="Rule-Based"
        )

        assignments.append(AllocationAssignment(
            group_id=group.id,
            table_id=selected_table.id,
            waiter_id=selected_waiter.id,
            cost=cost,
            reason=reason,
            rejected_alternatives=rejected
        ))

        total_cost += cost
        # Commit local state
        del available_tables[selected_table.id]
        selected_waiter_item["assigned"] += 1

    exec_time = (time.perf_counter() - start_time) * 1000.0
    seated_capacity = sum(
        next(t.capacity for t in tables if t.id == a.table_id)
        for a in assignments
    )
    total_active_capacity = sum(t.capacity for t in tables if t.is_active)
    utilization = round((seated_capacity / total_active_capacity * 100.0), 1) if total_active_capacity > 0 else 0.0

    avg_wait = sum(c.waiting_minutes for c in customers) / len(customers) if customers else 0.0

    return AllocationResult(
        algorithm="RULE_BASED",
        success=len(unallocated) == 0,
        assignments=assignments,
        unallocated_group_ids=unallocated,
        execution_time_ms=round(exec_time, 2),
        nodes_explored=nodes_explored,
        total_cost=round(total_cost, 2),
        table_utilization_percent=utilization,
        average_wait_minutes=round(avg_wait, 1),
        explanation_summary=f"Rule-Based assigned {len(assignments)}/{len(customers)} groups using strict priority & capacity rules.",
        is_optimal_claimed=False,
        optimality_explanation="Rule-Based applies greedy heuristic rules without evaluating global search spaces; it does not guarantee global optimality."
    )
