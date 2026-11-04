from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Set, Any
import time

@dataclass
class CustomerDTO:
    id: int
    group_name: str
    group_size: int
    priority: int
    waiting_minutes: float
    special_requirements: Optional[str] = None

@dataclass
class TableDTO:
    id: int
    table_number: str
    capacity: int
    location: str
    status: str
    is_active: bool

@dataclass
class WaiterDTO:
    id: int
    name: str
    availability: bool
    max_tables: int
    assigned_tables: int
    workload_score: float

@dataclass
class AllocationAssignment:
    group_id: int
    table_id: int
    waiter_id: int
    cost: float
    reason: str
    rejected_alternatives: List[str] = field(default_factory=list)

@dataclass
class AllocationResult:
    algorithm: str
    success: bool
    assignments: List[AllocationAssignment]
    unallocated_group_ids: List[int]
    execution_time_ms: float
    nodes_explored: int
    total_cost: float
    table_utilization_percent: float
    average_wait_minutes: float
    explanation_summary: str
    is_optimal_claimed: bool = False
    optimality_explanation: str = ""

def generate_decision_explanation(
    group: CustomerDTO,
    table: TableDTO,
    waiter: WaiterDTO,
    cost: float,
    rejected: List[str],
    algorithm_name: str
) -> str:
    capacity_diff = table.capacity - group.group_size
    seat_msg = "exact capacity fit" if capacity_diff == 0 else f"{capacity_diff} unused seat(s)"
    req_msg = f" Satisfied requirement: '{group.special_requirements}'." if group.special_requirements and any(
        kw in table.location.lower() for kw in ["window", "patio", "booth"] if kw in group.special_requirements.lower()
    ) else ""

    return (
        f"[{algorithm_name}] Group '{group.group_name}' ({group.group_size} guests) assigned to Table {table.table_number} "
        f"({table.capacity}-top in {table.location}, {seat_msg}). Assigned Waiter {waiter.name} "
        f"(current workload: {waiter.assigned_tables}/{waiter.max_tables} tables). Total allocation cost score: {cost:.2f}.{req_msg}"
    )
