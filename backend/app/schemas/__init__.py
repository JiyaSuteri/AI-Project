from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# ==================== TABLE SCHEMAS ====================
class TableBase(BaseModel):
    table_number: str = Field(..., example="T01")
    capacity: int = Field(..., ge=1, le=20, example=4)
    location: str = Field(default="Main Dining", example="Window")
    status: str = Field(default="AVAILABLE", example="AVAILABLE")
    is_active: bool = Field(default=True)

class TableCreate(TableBase):
    pass

class TableUpdate(BaseModel):
    table_number: Optional[str] = None
    capacity: Optional[int] = None
    location: Optional[str] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None
    current_waiter_id: Optional[int] = None
    current_group_id: Optional[int] = None

class TableStatusUpdate(BaseModel):
    status: str = Field(..., example="AVAILABLE")

class TableOut(TableBase):
    id: int
    current_waiter_id: Optional[int] = None
    current_group_id: Optional[int] = None
    waiter_name: Optional[str] = None
    group_name: Optional[str] = None
    group_size: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


# ==================== CUSTOMER SCHEMAS ====================
class CustomerBase(BaseModel):
    group_name: str = Field(..., example="Johnson Party")
    group_size: int = Field(..., ge=1, le=20, example=4)
    priority: int = Field(default=1, ge=1, le=4, example=1)
    special_requirements: Optional[str] = Field(default=None, example="Window seat, High chair")
    status: str = Field(default="WAITING", example="WAITING")

class CustomerCreate(CustomerBase):
    reservation_time: Optional[datetime] = None

class CustomerUpdate(BaseModel):
    group_name: Optional[str] = None
    group_size: Optional[int] = None
    priority: Optional[int] = None
    special_requirements: Optional[str] = None
    status: Optional[str] = None

class CustomerOut(CustomerBase):
    id: int
    arrival_time: datetime
    reservation_time: Optional[datetime] = None
    assigned_table_number: Optional[str] = None
    waiting_minutes: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


# ==================== WAITER SCHEMAS ====================
class WaiterBase(BaseModel):
    name: str = Field(..., example="Marco Rossi")
    availability: bool = Field(default=True)
    max_tables: int = Field(default=4, ge=1, le=10)

class WaiterCreate(WaiterBase):
    pass

class WaiterUpdate(BaseModel):
    name: Optional[str] = None
    availability: Optional[bool] = None
    max_tables: Optional[int] = None
    assigned_tables: Optional[int] = None
    completed_orders: Optional[int] = None
    workload_score: Optional[float] = None

class WaiterOut(WaiterBase):
    id: int
    assigned_tables: int
    completed_orders: int
    workload_score: float

    model_config = ConfigDict(from_attributes=True)


# ==================== RESERVATION SCHEMAS ====================
class ReservationBase(BaseModel):
    customer_name: str = Field(..., example="Sarah Jenkins")
    group_size: int = Field(..., ge=1, le=20, example=4)
    reservation_date: str = Field(..., example="2026-11-05")
    reservation_time: str = Field(..., example="19:30")
    special_requests: Optional[str] = Field(default=None, example="Quiet booth")
    status: str = Field(default="CONFIRMED", example="CONFIRMED")
    table_id: Optional[int] = None

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    customer_name: Optional[str] = None
    group_size: Optional[int] = None
    reservation_date: Optional[str] = None
    reservation_time: Optional[str] = None
    special_requests: Optional[str] = None
    status: Optional[str] = None
    table_id: Optional[int] = None

class ReservationOut(ReservationBase):
    id: int
    table_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# ==================== ALLOCATION SCHEMAS ====================
class AllocationDecision(BaseModel):
    group_id: int
    group_name: str
    group_size: int
    table_id: Optional[int]
    table_number: Optional[str]
    table_capacity: Optional[int]
    waiter_id: Optional[int]
    waiter_name: Optional[str]
    success: bool
    reason: str
    rejected_alternatives: List[str] = []
    cost: float = 0.0

class AllocationRunRequest(BaseModel):
    algorithm: str = Field(default="A_STAR", example="A_STAR") # RULE_BASED, GREEDY, BFS, DFS, A_STAR
    group_ids: Optional[List[int]] = None
    auto_commit: bool = Field(default=True, description="Whether to commit assignments to database tables")

class AllocationRunResponse(BaseModel):
    algorithm: str
    execution_time_ms: float
    nodes_explored: int
    total_requested: int
    successful_allocations: int
    unallocated_count: int
    table_utilization_percent: float
    average_wait_minutes: float
    total_cost: float
    decisions: List[AllocationDecision]

class AllocationOut(BaseModel):
    id: int
    customer_group_id: int
    table_id: int
    waiter_id: int
    allocation_time: datetime
    algorithm_used: str
    allocation_reason: str
    group_name: Optional[str] = None
    table_number: Optional[str] = None
    waiter_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# ==================== POLICY SCHEMAS ====================
class PolicyBase(BaseModel):
    policy_name: str = Field(..., example="Capacity Fit Principle")
    description: str = Field(..., example="Groups must be seated at tables with equal or greater capacity.")
    category: str = Field(..., example="ALLOCATION")
    is_active: bool = Field(default=True)

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    policy_name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None

class PolicyOut(PolicyBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# ==================== SIMULATION SCHEMAS ====================
class SimulationStartRequest(BaseModel):
    customer_count: int = Field(default=12, ge=2, le=50)
    algorithm: str = Field(default="A_STAR")
    arrival_interval_seconds: float = Field(default=2.0, ge=0.5, le=10.0)
    service_duration_seconds: float = Field(default=8.0, ge=2.0, le=30.0)
    cleaning_duration_seconds: float = Field(default=4.0, ge=1.0, le=15.0)
    random_seed: Optional[int] = Field(default=42)

class SimulationEvent(BaseModel):
    timestamp_sec: float
    event_type: str  # ARRIVAL, ALLOCATED, SERVICE_START, SERVICE_DONE, CLEANING_START, CLEANING_DONE, RENEGED
    description: str
    group_name: Optional[str] = None
    table_number: Optional[str] = None
    waiter_name: Optional[str] = None
    details: Dict[str, Any] = {}

class SimulationStatusOut(BaseModel):
    is_running: bool
    is_paused: bool
    current_time_sec: float
    progress_percent: float
    algorithm: str
    total_customers: int
    allocated_customers: int
    waiting_customers: int
    completed_customers: int
    reneged_customers: int
    events: List[SimulationEvent] = []

class SimulationRecordOut(BaseModel):
    id: int
    simulation_name: str
    algorithm: str
    total_customers: int
    successful_allocations: int
    average_waiting_time: float
    execution_time: float
    utilization: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==================== DASHBOARD & ANALYTICS SCHEMAS ====================
class DashboardStats(BaseModel):
    total_tables: int
    occupied_tables: int
    available_tables: int
    reserved_tables: int
    cleaning_tables: int
    waiting_customers: int
    active_waiters: int
    average_waiting_time_minutes: float
    table_utilization_percent: float

class ActivityItem(BaseModel):
    id: str
    timestamp: datetime
    type: str  # ALLOCATION, RESERVATION, RELEASE, SYSTEM
    title: str
    description: str

class AlgorithmComparisonItem(BaseModel):
    algorithm: str
    execution_time_ms: float
    nodes_explored: int
    successful_allocations: int
    average_waiting_time_min: float
    table_utilization_percent: float
    total_cost: float
    is_optimal_claimed: bool
    optimality_explanation: str

# ==================== AI SCHEMAS ====================
class AIChatRequest(BaseModel):
    message: str = Field(..., example="Which tables are currently available?")

class AIChatResponse(BaseModel):
    reply: str
    relevant_info: List[str] = []
    sources: List[str] = []
    explanation: str
    suggested_action: str
    is_fallback: bool
