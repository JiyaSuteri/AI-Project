import time
import heapq
from typing import List, Dict, Optional, Tuple, Set
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO, AllocationAssignment, AllocationResult, generate_decision_explanation
from app.algorithms.cost_function import calculate_single_allocation_cost, CostWeights

def compute_admissible_heuristic(
    group_idx: int,
    customers: List[CustomerDTO],
    used_tables: frozenset,
    tables: List[TableDTO],
    weights: CostWeights
) -> float:
    """
    Admissible Heuristic h(n):
    Underestimates the remaining cost by calculating the theoretical minimum capacity waste
    and base wait time penalty for remaining unallocated groups, assuming best-case table matches.
    Because true costs also include waiter workloads and location mismatches, h(n) <= h*(n).
    """
    if group_idx >= len(customers):
        return 0.0

    available_caps = [t.capacity for t in tables if t.id not in used_tables]
    if not available_caps:
        return (len(customers) - group_idx) * weights.unallocated_penalty

    h_cost = 0.0
    for i in range(group_idx, len(customers)):
        grp = customers[i]
        # Find minimum theoretical capacity difference
        valid_caps = [cap for cap in available_caps if cap >= grp.group_size]
        if valid_caps:
            min_waste = min(cap - grp.group_size for cap in valid_caps)
            h_cost += min_waste * weights.capacity_waste_weight
            h_cost += (grp.waiting_minutes / 10.0) * weights.wait_time_weight * (1.0 / max(1, grp.priority))
        else:
            h_cost += weights.unallocated_penalty

    return h_cost

def run_a_star_allocation(
    customers: List[CustomerDTO],
    tables: List[TableDTO],
    waiters: List[WaiterDTO],
    weights: Optional[CostWeights] = None,
    max_nodes: int = 6000
) -> AllocationResult:
    start_time = time.perf_counter()
    if weights is None:
        weights = CostWeights()

    nodes_explored = 0
    available_tables = [t for t in tables if t.status == "AVAILABLE" and t.is_active]
    available_waiters = [w for w in waiters if w.availability]

    if not customers:
        return AllocationResult(
            algorithm="A_STAR",
            success=True,
            assignments=[],
            unallocated_group_ids=[],
            execution_time_ms=0.0,
            nodes_explored=0,
            total_cost=0.0,
            table_utilization_percent=0.0,
            average_wait_minutes=0.0,
            explanation_summary="No customer groups to allocate.",
            is_optimal_claimed=True,
            optimality_explanation="Trivial optimal solution: 0 customer groups."
        )

    # Priority queue stores tuples: (f_cost, counter, g_cost, group_idx, used_tables, waiter_loads, assignments)
    counter = 0
    initial_loads = tuple((w.id, w.assigned_tables) for w in available_waiters)
    initial_h = compute_admissible_heuristic(0, customers, frozenset(), available_tables, weights)
    pq = [(initial_h, counter, 0.0, 0, frozenset(), initial_loads, [])]
    
    best_solution: Optional[Tuple[float, List[AllocationAssignment]]] = None
    best_partial: Tuple[int, float, List[AllocationAssignment]] = (0, float('inf'), [])
    visited: Dict[Tuple[int, frozenset], float] = {}

    while pq and nodes_explored < max_nodes:
        f_cost, _, g_cost, group_idx, used_tables, waiter_loads, current_assignments = heapq.heappop(pq)
        nodes_explored += 1

        state_key = (group_idx, used_tables)
        if state_key in visited and visited[state_key] <= g_cost:
            continue
        visited[state_key] = g_cost

        # Track best partial allocations
        if len(current_assignments) > best_partial[0] or (
            len(current_assignments) == best_partial[0] and g_cost < best_partial[1]
        ):
            best_partial = (len(current_assignments), g_cost, current_assignments)

        # Goal check
        if group_idx >= len(customers):
            best_solution = (g_cost, current_assignments)
            break

        group = customers[group_idx]

        # Branch 1: Try allocating group to each compatible table & waiter
        for table in available_tables:
            if table.id in used_tables:
                continue
            if table.capacity < group.group_size:
                continue

            for w_idx, (w_id, load) in enumerate(waiter_loads):
                waiter_obj = next(w for w in available_waiters if w.id == w_id)
                if load >= waiter_obj.max_tables:
                    continue

                new_load = load + 1
                new_waiter_loads = list(waiter_loads)
                new_waiter_loads[w_idx] = (w_id, new_load)

                step_cost = calculate_single_allocation_cost(
                    group_size=group.group_size,
                    table_capacity=table.capacity,
                    waiting_minutes=group.waiting_minutes,
                    waiter_workload=new_load / waiter_obj.max_tables,
                    priority=group.priority,
                    special_request=group.special_requirements,
                    table_location=table.location,
                    weights=weights
                )

                new_g = g_cost + step_cost
                new_used = used_tables | {table.id}
                new_h = compute_admissible_heuristic(group_idx + 1, customers, new_used, available_tables, weights)
                new_f = new_g + new_h

                counter += 1
                new_assignment = AllocationAssignment(
                    group_id=group.id,
                    table_id=table.id,
                    waiter_id=w_id,
                    cost=step_cost,
                    reason=f"[A*] Table {table.table_number} ({table.capacity} seats, {table.location}) matched with Waiter {waiter_obj.name}.",
                    rejected_alternatives=[]
                )

                heapq.heappush(pq, (
                    new_f,
                    counter,
                    new_g,
                    group_idx + 1,
                    new_used,
                    tuple(new_waiter_loads),
                    current_assignments + [new_assignment]
                ))

        # Branch 2: Skip group (unallocated penalty)
        counter += 1
        skip_g = g_cost + weights.unallocated_penalty
        skip_h = compute_admissible_heuristic(group_idx + 1, customers, used_tables, available_tables, weights)
        heapq.heappush(pq, (
            skip_g + skip_h,
            counter,
            skip_g,
            group_idx + 1,
            used_tables,
            waiter_loads,
            current_assignments
        ))

    if best_solution:
        chosen_cost, chosen_assignments = best_solution
        is_optimal = nodes_explored < max_nodes
        opt_explanation = (
            "A* explored states guided by an admissible lower-bound heuristic h(n) <= h*(n). "
            "Because the goal state was reached with minimal f(n) prior to exhausting search boundaries, "
            "the resulting allocation minimizes total service cost."
            if is_optimal else
            "Search budget reached; solution represents best discovered heuristic state."
        )
    else:
        chosen_cost = best_partial[1]
        chosen_assignments = best_partial[2]
        is_optimal = False
        opt_explanation = "Partial heuristic allocation returned after searching priority queue."

    allocated_group_ids = {a.group_id for a in chosen_assignments}
    unallocated = [c.id for c in customers if c.id not in allocated_group_ids]

    exec_time = (time.perf_counter() - start_time) * 1000.0
    seated_capacity = sum(
        next(t.capacity for t in tables if t.id == a.table_id)
        for a in chosen_assignments
    )
    total_active_capacity = sum(t.capacity for t in tables if t.is_active)
    utilization = round((seated_capacity / total_active_capacity * 100.0), 1) if total_active_capacity > 0 else 0.0
    avg_wait = sum(c.waiting_minutes for c in customers) / len(customers) if customers else 0.0

    return AllocationResult(
        algorithm="A_STAR",
        success=len(unallocated) == 0,
        assignments=chosen_assignments,
        unallocated_group_ids=unallocated,
        execution_time_ms=round(exec_time, 2),
        nodes_explored=nodes_explored,
        total_cost=round(chosen_cost, 2),
        table_utilization_percent=utilization,
        average_wait_minutes=round(avg_wait, 1),
        explanation_summary=f"A* evaluated {nodes_explored} priority nodes using admissible capacity-waste heuristic, reaching total cost {chosen_cost:.1f}.",
        is_optimal_claimed=is_optimal,
        optimality_explanation=opt_explanation
    )
