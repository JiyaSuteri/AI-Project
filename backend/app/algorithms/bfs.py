import time
from collections import deque
from typing import List, Dict, Optional, Tuple, Set
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO, AllocationAssignment, AllocationResult, generate_decision_explanation
from app.algorithms.cost_function import calculate_single_allocation_cost, CostWeights

def run_bfs_allocation(
    customers: List[CustomerDTO],
    tables: List[TableDTO],
    waiters: List[WaiterDTO],
    weights: Optional[CostWeights] = None,
    max_nodes: int = 5000
) -> AllocationResult:
    start_time = time.perf_counter()
    nodes_explored = 0

    available_tables = [t for t in tables if t.status == "AVAILABLE" and t.is_active]
    available_waiters = [w for w in waiters if w.availability]

    if not customers:
        return AllocationResult(
            algorithm="BFS",
            success=True,
            assignments=[],
            unallocated_group_ids=[],
            execution_time_ms=0.0,
            nodes_explored=0,
            total_cost=0.0,
            table_utilization_percent=0.0,
            average_wait_minutes=0.0,
            explanation_summary="No customer groups to allocate.",
            is_optimal_claimed=False,
            optimality_explanation="BFS finds shortest path in terms of steps, but not minimum weighted cost."
        )

    # Queue element: (group_index, frozenset(used_table_ids), tuple_waiter_loads, cost, list_assignments)
    initial_loads = tuple((w.id, w.assigned_tables) for w in available_waiters)
    queue = deque([(0, frozenset(), initial_loads, 0.0, [])])
    visited: Set[Tuple[int, frozenset]] = set()

    best_complete_path: Optional[Tuple[float, List[AllocationAssignment]]] = None
    best_partial_path: Tuple[int, float, List[AllocationAssignment]] = (0, float('inf'), [])

    while queue and nodes_explored < max_nodes:
        group_idx, used_tables, waiter_loads, current_cost, current_assignments = queue.popleft()
        nodes_explored += 1

        state_key = (group_idx, used_tables)
        if state_key in visited:
            continue
        visited.add(state_key)

        # Track best partial progress
        if len(current_assignments) > best_partial_path[0] or (
            len(current_assignments) == best_partial_path[0] and current_cost < best_partial_path[1]
        ):
            best_partial_path = (len(current_assignments), current_cost, current_assignments)

        # Check goal condition: all groups processed
        if group_idx >= len(customers):
            if best_complete_path is None or current_cost < best_complete_path[0]:
                best_complete_path = (current_cost, current_assignments)
            continue

        group = customers[group_idx]
        found_branch = False

        # Generate successor states: allocate group to any valid table and eligible waiter
        for table in available_tables:
            if table.id in used_tables:
                continue
            if table.capacity < group.group_size:
                continue

            for w_idx, (w_id, load) in enumerate(waiter_loads):
                waiter_obj = next(w for w in available_waiters if w.id == w_id)
                if load >= waiter_obj.max_tables:
                    continue

                found_branch = True
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

                new_assignment = AllocationAssignment(
                    group_id=group.id,
                    table_id=table.id,
                    waiter_id=w_id,
                    cost=step_cost,
                    reason=f"[BFS] Level {group_idx + 1}: Table {table.table_number} assigned to {group.group_name} with Waiter {waiter_obj.name}.",
                    rejected_alternatives=[]
                )

                queue.append((
                    group_idx + 1,
                    used_tables | {table.id},
                    tuple(new_waiter_loads),
                    current_cost + step_cost,
                    current_assignments + [new_assignment]
                ))

        # Also permit skip branch (unallocated) to avoid dead ends
        penalty = weights.unallocated_penalty if weights else 100.0
        queue.append((
            group_idx + 1,
            used_tables,
            waiter_loads,
            current_cost + penalty,
            current_assignments
        ))

    # Select best solution
    if best_complete_path and len(best_complete_path[1]) > 0:
        chosen_cost, chosen_assignments = best_complete_path
    else:
        chosen_cost = best_partial_path[1]
        chosen_assignments = best_partial_path[2]

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
        algorithm="BFS",
        success=len(unallocated) == 0,
        assignments=chosen_assignments,
        unallocated_group_ids=unallocated,
        execution_time_ms=round(exec_time, 2),
        nodes_explored=nodes_explored,
        total_cost=round(chosen_cost, 2),
        table_utilization_percent=utilization,
        average_wait_minutes=round(avg_wait, 1),
        explanation_summary=f"BFS explored {nodes_explored} search nodes level-by-level, successfully seating {len(chosen_assignments)} groups.",
        is_optimal_claimed=False,
        optimality_explanation="BFS guarantees fewest unallocated transitions (unweighted shortest path), but does not guarantee minimal weighted cost."
    )
