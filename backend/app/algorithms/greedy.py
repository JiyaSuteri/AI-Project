import time
from typing import List, Dict, Optional, Tuple
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO, AllocationAssignment, AllocationResult, generate_decision_explanation
from app.algorithms.cost_function import calculate_single_allocation_cost, CostWeights

def run_greedy_allocation(
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

    available_tables = {t.id: t for t in tables if t.status == "AVAILABLE" and t.is_active}
    waiter_loads = {w.id: dict(w=w, assigned=w.assigned_tables) for w in waiters if w.availability}

    # Prioritize higher priority groups with longer wait times
    sorted_customers = sorted(customers, key=lambda c: (-c.priority, -c.waiting_minutes))

    for group in sorted_customers:
        nodes_explored += 1
        best_candidate: Optional[Tuple[TableDTO, WaiterDTO, float]] = None
        candidate_evaluations = []

        # Evaluate all available tables with sufficient capacity
        for table in available_tables.values():
            if table.capacity < group.group_size:
                continue

            # Evaluate each eligible waiter
            for wl in waiter_loads.values():
                if wl["assigned"] >= wl["w"].max_tables:
                    continue

                nodes_explored += 1
                ratio = (wl["assigned"] + 1) / wl["w"].max_tables
                cost = calculate_single_allocation_cost(
                    group_size=group.group_size,
                    table_capacity=table.capacity,
                    waiting_minutes=group.waiting_minutes,
                    waiter_workload=ratio,
                    priority=group.priority,
                    special_request=group.special_requirements,
                    table_location=table.location,
                    weights=weights
                )

                candidate_evaluations.append((table, wl["w"], cost))

                if best_candidate is None or cost < best_candidate[2]:
                    best_candidate = (table, wl["w"], cost)

        if best_candidate is None:
            unallocated.append(group.id)
            total_cost += weights.unallocated_penalty if weights else 100.0
            continue

        selected_table, selected_waiter, best_cost = best_candidate
        
        # Identify rejected alternatives for transparency
        candidate_evaluations.sort(key=lambda x: x[2])
        rejected = [
            f"Table {t.table_number} + Waiter {w.name} (cost: {c:.1f})"
            for t, w, c in candidate_evaluations[1:4]
        ]

        reason = generate_decision_explanation(
            group=group,
            table=selected_table,
            waiter=selected_waiter,
            cost=best_cost,
            rejected=rejected,
            algorithm_name="Greedy Search"
        )

        assignments.append(AllocationAssignment(
            group_id=group.id,
            table_id=selected_table.id,
            waiter_id=selected_waiter.id,
            cost=best_cost,
            reason=reason,
            rejected_alternatives=rejected
        ))

        total_cost += best_cost
        del available_tables[selected_table.id]
        waiter_loads[selected_waiter.id]["assigned"] += 1

    exec_time = (time.perf_counter() - start_time) * 1000.0
    seated_capacity = sum(
        next(t.capacity for t in tables if t.id == a.table_id)
        for a in assignments
    )
    total_active_capacity = sum(t.capacity for t in tables if t.is_active)
    utilization = round((seated_capacity / total_active_capacity * 100.0), 1) if total_active_capacity > 0 else 0.0
    avg_wait = sum(c.waiting_minutes for c in customers) / len(customers) if customers else 0.0

    return AllocationResult(
        algorithm="GREEDY",
        success=len(unallocated) == 0,
        assignments=assignments,
        unallocated_group_ids=unallocated,
        execution_time_ms=round(exec_time, 2),
        nodes_explored=nodes_explored,
        total_cost=round(total_cost, 2),
        table_utilization_percent=utilization,
        average_wait_minutes=round(avg_wait, 1),
        explanation_summary=f"Greedy allocated {len(assignments)}/{len(customers)} groups by picking minimal local cost transitions.",
        is_optimal_claimed=False,
        optimality_explanation="Greedy makes myopic step-by-step decisions without backtracking; local optima do not guarantee overall minimum cost."
    )
