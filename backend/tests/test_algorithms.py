import pytest
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO
from app.algorithms.rule_based import run_rule_based_allocation
from app.algorithms.greedy import run_greedy_allocation
from app.algorithms.bfs import run_bfs_allocation
from app.algorithms.dfs import run_dfs_allocation
from app.algorithms.a_star import run_a_star_allocation
from app.algorithms.comparator import compare_all_algorithms

@pytest.fixture
def test_scenario():
    customers = [
        CustomerDTO(1, "Small Party", 2, 1, 5.0, "Window"),
        CustomerDTO(2, "Medium Party", 4, 2, 10.0, None),
        CustomerDTO(3, "Large Party", 6, 3, 15.0, "Booth"),
    ]
    tables = [
        TableDTO(1, "T01", 2, "Window", "AVAILABLE", True),
        TableDTO(2, "T02", 4, "Main Dining", "AVAILABLE", True),
        TableDTO(3, "T03", 6, "Booth Zone", "AVAILABLE", True),
        TableDTO(4, "T04", 8, "Main Dining", "AVAILABLE", True),
    ]
    waiters = [
        WaiterDTO(1, "Alice", True, 4, 0, 0.0),
        WaiterDTO(2, "Bob", True, 4, 1, 0.25),
    ]
    return customers, tables, waiters

def test_rule_based_allocation(test_scenario):
    c, t, w = test_scenario
    result = run_rule_based_allocation(c, t, w)
    assert result.algorithm == "RULE_BASED"
    assert len(result.assignments) == 3
    assert len(result.unallocated_group_ids) == 0
    # Verify no table is assigned more than once
    assigned_tables = [a.table_id for a in result.assignments]
    assert len(assigned_tables) == len(set(assigned_tables))

def test_greedy_allocation(test_scenario):
    c, t, w = test_scenario
    result = run_greedy_allocation(c, t, w)
    assert result.algorithm == "GREEDY"
    assert len(result.assignments) == 3
    assert result.total_cost >= 0.0

def test_bfs_allocation(test_scenario):
    c, t, w = test_scenario
    result = run_bfs_allocation(c, t, w)
    assert result.algorithm == "BFS"
    assert len(result.assignments) == 3
    assert result.nodes_explored > 0

def test_dfs_allocation(test_scenario):
    c, t, w = test_scenario
    result = run_dfs_allocation(c, t, w)
    assert result.algorithm == "DFS"
    assert len(result.assignments) == 3
    assert result.nodes_explored > 0

def test_a_star_allocation(test_scenario):
    c, t, w = test_scenario
    result = run_a_star_allocation(c, t, w)
    assert result.algorithm == "A_STAR"
    assert len(result.assignments) == 3
    # A* should achieve lowest or tied-lowest cost
    assert result.total_cost <= run_dfs_allocation(c, t, w).total_cost + 0.01

def test_insufficient_capacity_constraint():
    # Large party of 10 with only 4-top tables available
    customers = [CustomerDTO(1, "Massive Group", 10, 1, 2.0)]
    tables = [TableDTO(1, "T01", 4, "Main Dining", "AVAILABLE", True)]
    waiters = [WaiterDTO(1, "Staff", True, 4, 0, 0.0)]
    
    result = run_a_star_allocation(customers, tables, waiters)
    assert len(result.assignments) == 0
    assert 1 in result.unallocated_group_ids

def test_algorithm_comparator(test_scenario):
    c, t, w = test_scenario
    results = compare_all_algorithms(c, t, w)
    assert len(results) == 5
    algos = [r.algorithm for r in results]
    assert "RULE_BASED" in algos
    assert "GREEDY" in algos
    assert "BFS" in algos
    assert "DFS" in algos
    assert "A_STAR" in algos
