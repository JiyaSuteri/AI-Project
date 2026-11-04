import random
from typing import Dict, Any, Optional

class CustomerAgent:
    """
    Customer Agent:
    Represents a dining party arriving at the restaurant.
    Maintains patience, party size, priority, and request preferences.
    """
    def __init__(
        self,
        group_id: int,
        group_name: str,
        group_size: int,
        arrival_time_sec: float,
        priority: int = 1,
        special_request: Optional[str] = None,
        max_patience_sec: float = 60.0
    ):
        self.group_id = group_id
        self.group_name = group_name
        self.group_size = group_size
        self.arrival_time_sec = arrival_time_sec
        self.priority = priority
        self.special_request = special_request
        self.max_patience_sec = max_patience_sec
        self.status = "ARRIVED"  # ARRIVED, WAITING, SEATED, COMPLETED, RENEGED
        self.seated_time_sec: Optional[float] = None
        self.finish_time_sec: Optional[float] = None
        self.assigned_table_id: Optional[int] = None
        self.assigned_waiter_id: Optional[int] = None

    def has_reneged(self, current_time_sec: float) -> bool:
        """Determines if the customer ran out of patience while waiting in queue."""
        if self.status == "WAITING":
            waited = current_time_sec - self.arrival_time_sec
            return waited > self.max_patience_sec
        return False

    def mark_seated(self, current_time_sec: float, table_id: int, waiter_id: int):
        self.status = "SEATED"
        self.seated_time_sec = current_time_sec
        self.assigned_table_id = table_id
        self.assigned_waiter_id = waiter_id

    def mark_completed(self, current_time_sec: float):
        self.status = "COMPLETED"
        self.finish_time_sec = current_time_sec

    def mark_reneged(self):
        self.status = "RENEGED"

    def get_wait_time_sec(self, current_time_sec: float) -> float:
        if self.seated_time_sec is not None:
            return self.seated_time_sec - self.arrival_time_sec
        return current_time_sec - self.arrival_time_sec
