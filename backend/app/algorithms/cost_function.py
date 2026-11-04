from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class CostWeights:
    capacity_waste_weight: float = 12.0      # Penalty per empty seat at allocated table
    wait_time_weight: float = 0.5           # Penalty per minute waited
    waiter_workload_weight: float = 25.0     # Penalty for waiter workload ratio
    priority_mismatch_weight: float = 15.0   # Penalty for leaving high priority waiting
    special_request_miss_weight: float = 20.0# Penalty if special request is unfulfilled
    unallocated_penalty: float = 100.0       # Penalty for each group left unallocated

def calculate_single_allocation_cost(
    group_size: int,
    table_capacity: int,
    waiting_minutes: float,
    waiter_workload: float,
    priority: int,
    special_request: Optional[str] = None,
    table_location: Optional[str] = None,
    weights: Optional[CostWeights] = None
) -> float:
    """
    Calculates cost for allocating a specific group to a specific table & waiter.
    Lower cost = better allocation.
    """
    if weights is None:
        weights = CostWeights()

    # 1. Capacity waste cost: unused seats
    unused_seats = max(0, table_capacity - group_size)
    capacity_cost = unused_seats * weights.capacity_waste_weight

    # 2. Waiter workload penalty
    workload_cost = waiter_workload * weights.waiter_workload_weight

    # 3. Waiting time weighted by priority
    wait_cost = (waiting_minutes / 10.0) * weights.wait_time_weight * (1.0 / max(1, priority))

    # 4. Special request matching penalty
    req_cost = 0.0
    if special_request and table_location:
        req_lower = special_request.lower()
        loc_lower = table_location.lower()
        if "window" in req_lower and "window" not in loc_lower:
            req_cost += weights.special_request_miss_weight
        elif "booth" in req_lower and "booth" not in loc_lower:
            req_cost += weights.special_request_miss_weight
        elif "patio" in req_lower and "patio" not in loc_lower:
            req_cost += weights.special_request_miss_weight

    return round(capacity_cost + workload_cost + wait_cost + req_cost, 2)
