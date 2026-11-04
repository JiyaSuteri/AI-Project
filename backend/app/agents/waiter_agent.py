from typing import Set

class WaiterAgent:
    """
    Waiter Agent:
    Tracks active table assignments, service workloads, and task completions.
    """
    def __init__(
        self,
        waiter_id: int,
        name: str,
        max_tables: int = 4
    ):
        self.waiter_id = waiter_id
        self.name = name
        self.max_tables = max_tables
        self.assigned_table_ids: Set[int] = set()
        self.completed_services_count: int = 0
        self.is_active: bool = True

    @property
    def current_load(self) -> int:
        return len(self.assigned_table_ids)

    @property
    def workload_score(self) -> float:
        return self.current_load / max(1, self.max_tables)

    def can_accept_table(self) -> bool:
        return self.is_active and self.current_load < self.max_tables

    def assign_table(self, table_id: int):
        self.assigned_table_ids.add(table_id)

    def release_table(self, table_id: int):
        if table_id in self.assigned_table_ids:
            self.assigned_table_ids.remove(table_id)
            self.completed_services_count += 1
