from typing import List, Dict, Any, Optional
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO, AllocationResult
from app.algorithms.cost_function import CostWeights
from app.algorithms.rule_based import run_rule_based_allocation
from app.algorithms.greedy import run_greedy_allocation
from app.algorithms.bfs import run_bfs_allocation
from app.algorithms.dfs import run_dfs_allocation
from app.algorithms.a_star import run_a_star_allocation

def compare_all_algorithms(
    customers: List[CustomerDTO],
    tables: List[TableDTO],
    waiters: List[WaiterDTO],
    weights: Optional[CostWeights] = None
) -> List[AllocationResult]:
    """
    Executes all 5 allocation search algorithms under identical conditions
    and returns a structured list of results for academic comparison.
    """
    results: List[AllocationResult] = []

    # 1. Rule-Based
    res_rule = run_rule_based_allocation(customers, tables, waiters, weights)
    results.append(res_rule)

    # 2. Greedy Search
    res_greedy = run_greedy_allocation(customers, tables, waiters, weights)
    results.append(res_greedy)

    # 3. BFS
    res_bfs = run_bfs_allocation(customers, tables, waiters, weights)
    results.append(res_bfs)

    # 4. DFS
    res_dfs = run_dfs_allocation(customers, tables, waiters, weights)
    results.append(res_dfs)

    # 5. A* Search
    res_astar = run_a_star_allocation(customers, tables, waiters, weights)
    results.append(res_astar)

    return results
