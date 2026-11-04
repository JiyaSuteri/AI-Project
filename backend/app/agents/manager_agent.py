from typing import List, Dict, Optional, Tuple
from app.agents.customer_agent import CustomerAgent
from app.agents.table_agent import TableAgent
from app.agents.waiter_agent import WaiterAgent
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO
from app.algorithms.rule_based import run_rule_based_allocation
from app.algorithms.greedy import run_greedy_allocation
from app.algorithms.bfs import run_bfs_allocation
from app.algorithms.dfs import run_dfs_allocation
from app.algorithms.a_star import run_a_star_allocation

class ManagerAgent:
    """
    Manager Agent:
    High-level orchestrator agent in the restaurant multi-agent hierarchy.
    Coordinates customer queues, inspects table states, queries waiter workloads,
    and invokes designated AI search algorithms to execute conflict-free allocations.
    """
    def __init__(self, algorithm: str = "A_STAR"):
        self.algorithm = algorithm.upper()

    def set_algorithm(self, algorithm: str):
        self.algorithm = algorithm.upper()

    def allocate_pending_queue(
        self,
        waiting_customers: List[CustomerAgent],
        tables: List[TableAgent],
        waiters: List[WaiterAgent],
        current_time_sec: float
    ) -> List[Tuple[CustomerAgent, TableAgent, WaiterAgent, str]]:
        """
        Coordinates agents and invokes selected AI search algorithm
        to determine best matching pairs. Returns list of successful allocations.
        """
        if not waiting_customers:
            return []

        # Convert agent states to algorithm DTOs
        customer_dtos = [
            CustomerDTO(
                id=c.group_id,
                group_name=c.group_name,
                group_size=c.group_size,
                priority=c.priority,
                waiting_minutes=(current_time_sec - c.arrival_time_sec) / 60.0,
                special_requirements=c.special_request
            )
            for c in waiting_customers
        ]

        table_dtos = [
            TableDTO(
                id=t.table_id,
                table_number=t.table_number,
                capacity=t.capacity,
                location=t.location,
                status=t.status,
                is_active=True
            )
            for t in tables
        ]

        waiter_dtos = [
            WaiterDTO(
                id=w.waiter_id,
                name=w.name,
                availability=w.is_active,
                max_tables=w.max_tables,
                assigned_tables=w.current_load,
                workload_score=w.workload_score
            )
            for w in waiters
        ]

        # Dispatch to selected AI search algorithm
        if self.algorithm == "RULE_BASED":
            res = run_rule_based_allocation(customer_dtos, table_dtos, waiter_dtos)
        elif self.algorithm == "GREEDY":
            res = run_greedy_allocation(customer_dtos, table_dtos, waiter_dtos)
        elif self.algorithm == "BFS":
            res = run_bfs_allocation(customer_dtos, table_dtos, waiter_dtos)
        elif self.algorithm == "DFS":
            res = run_dfs_allocation(customer_dtos, table_dtos, waiter_dtos)
        else: # Default A*
            res = run_a_star_allocation(customer_dtos, table_dtos, waiter_dtos)

        # Map back to live agents
        successful_pairings = []
        c_map = {c.group_id: c for c in waiting_customers}
        t_map = {t.table_id: t for t in tables}
        w_map = {w.waiter_id: w for w in waiters}

        for assignment in res.assignments:
            cust = c_map.get(assignment.group_id)
            tbl = t_map.get(assignment.table_id)
            wtr = w_map.get(assignment.waiter_id)
            if cust and tbl and wtr:
                successful_pairings.append((cust, tbl, wtr, assignment.reason))

        return successful_pairings
