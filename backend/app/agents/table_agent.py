from typing import Optional

class TableAgent:
    """
    Table Agent:
    Maintains physical table state, capacity, location, and turnover lifecycle.
    States: AVAILABLE -> OCCUPIED -> CLEANING -> AVAILABLE.
    """
    def __init__(
        self,
        table_id: int,
        table_number: str,
        capacity: int,
        location: str = "Main Dining"
    ):
        self.table_id = table_id
        self.table_number = table_number
        self.capacity = capacity
        self.location = location
        self.status = "AVAILABLE"  # AVAILABLE, OCCUPIED, CLEANING, RESERVED, UNAVAILABLE
        self.occupied_by_group_id: Optional[int] = None
        self.assigned_waiter_id: Optional[int] = None
        self.service_end_time_sec: Optional[float] = None
        self.cleaning_end_time_sec: Optional[float] = None

    def is_available(self) -> bool:
        return self.status == "AVAILABLE"

    def seat_group(self, group_id: int, waiter_id: int, service_end_time_sec: float):
        self.status = "OCCUPIED"
        self.occupied_by_group_id = group_id
        self.assigned_waiter_id = waiter_id
        self.service_end_time_sec = service_end_time_sec

    def start_cleaning(self, cleaning_end_time_sec: float):
        self.status = "CLEANING"
        self.occupied_by_group_id = None
        self.service_end_time_sec = None
        self.cleaning_end_time_sec = cleaning_end_time_sec

    def finish_cleaning(self):
        self.status = "AVAILABLE"
        self.cleaning_end_time_sec = None
        self.assigned_waiter_id = None
