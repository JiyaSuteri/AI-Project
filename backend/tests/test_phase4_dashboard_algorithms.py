import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import SessionLocal
from app.models import RestaurantTable, Waiter, CustomerGroup, Allocation
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO
from app.algorithms.rule_based import run_rule_based_allocation
from app.algorithms.greedy import run_greedy_allocation
from app.algorithms.bfs import run_bfs_allocation
from app.algorithms.dfs import run_dfs_allocation
from app.algorithms.a_star import run_a_star_allocation
from app.algorithms.comparator import compare_all_algorithms

client = TestClient(app)

def test_five_search_algorithms_on_identical_scenario():
    """Verify Rule-Based, Greedy, BFS, DFS, and A* all execute on identical inputs without violation."""
    customers = [
        CustomerDTO(1, "Family Group", 4, 2, 10.0, "Window"),
        CustomerDTO(2, "Couple Dinner", 2, 1, 4.0, "Patio"),
        CustomerDTO(3, "VIP Party", 6, 3, 20.0, "Booth")
    ]
    tables = [
        TableDTO(1, "T01", 2, "Patio", "AVAILABLE", True),
        TableDTO(2, "T02", 4, "Window", "AVAILABLE", True),
        TableDTO(3, "T03", 6, "Main", "AVAILABLE", True)
    ]
    waiters = [
        WaiterDTO(1, "Server A", True, 4, 1, 0.25),
        WaiterDTO(2, "Server B", True, 4, 0, 0.0)
    ]

    # Test all 5 algorithms
    res_rb = run_rule_based_allocation(customers, tables, waiters)
    res_gr = run_greedy_allocation(customers, tables, waiters)
    res_bfs = run_bfs_allocation(customers, tables, waiters)
    res_dfs = run_dfs_allocation(customers, tables, waiters)
    res_astar = run_a_star_allocation(customers, tables, waiters)

    for res in [res_rb, res_gr, res_bfs, res_dfs, res_astar]:
        assert len(res.assignments) == 3, f"{res.algorithm} failed to assign all 3 parties"
        for a in res.assignments:
            # Check capacity validity
            matched_c = next(c for c in customers if c.id == a.group_id)
            matched_t = next(t for t in tables if t.id == a.table_id)
            assert matched_t.capacity >= matched_c.group_size, f"Capacity violated in {res.algorithm}"

    # Verify A* explored nodes and has optimal/lowest or equal cost
    assert res_astar.nodes_explored > 0
    assert res_astar.total_cost <= res_dfs.total_cost or res_astar.total_cost <= res_rb.total_cost

def test_algorithm_comparator_runs_five_algorithms():
    customers = [CustomerDTO(10, "Test Group", 4, 1, 5.0, None)]
    tables = [TableDTO(10, "T10", 4, "Main", "AVAILABLE", True)]
    waiters = [WaiterDTO(10, "Server C", True, 4, 0, 0.0)]

    results = compare_all_algorithms(customers, tables, waiters)
    assert len(results) == 5
    algos = {r.algorithm for r in results}
    assert algos == {"RULE_BASED", "GREEDY", "BFS", "DFS", "A_STAR"}

def test_two_step_ai_table_allocation_workflow():
    """Verify Step 1 (Preview with auto_commit=False) does not alter DB, and Step 2 commits safely."""
    # Authenticate via dev demo login
    auth_res = client.post("/api/auth/dev-demo-login")
    assert auth_res.status_code == 200
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    db = SessionLocal()
    # Create test table, waiter, customer
    test_table = RestaurantTable(
        table_number="T_TEST_P4",
        capacity=4,
        location="Window",
        status="AVAILABLE",
        is_active=True
    )
    test_waiter = Waiter(
        name="Phase4 Waiter",
        availability=True,
        max_tables=4,
        assigned_tables=0,
        workload_score=0.0
    )
    test_customer = CustomerGroup(
        group_name="Phase4 Preview Party",
        group_size=4,
        priority=2,
        status="WAITING",
        special_requirements="Window"
    )
    db.add_all([test_table, test_waiter, test_customer])
    db.commit()
    db.refresh(test_table)
    db.refresh(test_waiter)
    db.refresh(test_customer)

    try:
        # Step 1: Request recommendation with auto_commit=False
        preview_res = client.post(
            "/api/allocations/run",
            json={
                "algorithm": "A_STAR",
                "group_ids": [test_customer.id],
                "auto_commit": False
            },
            headers=headers
        )
        assert preview_res.status_code == 200
        preview_data = preview_res.json()
        assert preview_data["successful_allocations"] == 1
        dec = preview_data["decisions"][0]
        assert dec["success"] is True
        assert dec["table_id"] is not None
        assert dec["waiter_id"] is not None
        assert "A_STAR" in preview_data["algorithm"]

        # Verify DB has NOT been altered
        db.refresh(test_table)
        db.refresh(test_customer)
        assert test_table.status == "AVAILABLE"
        assert test_customer.status == "WAITING"

        # Step 2: Confirm allocation with auto_commit=True
        confirm_res = client.post(
            "/api/allocations/run",
            json={
                "algorithm": "A_STAR",
                "group_ids": [test_customer.id],
                "auto_commit": True
            },
            headers=headers
        )
        assert confirm_res.status_code == 200

        # Verify DB HAS been committed and state updated
        db.refresh(test_customer)
        assert test_customer.status == "SEATED"

        # Check Allocation record saved
        alloc = db.query(Allocation).filter(Allocation.customer_group_id == test_customer.id).first()
        assert alloc is not None
        assert alloc.table_id is not None
        assert alloc.waiter_id is not None

    finally:
        # Cleanup
        db.query(Allocation).filter(Allocation.customer_group_id == test_customer.id).delete()
        db.query(CustomerGroup).filter(CustomerGroup.id == test_customer.id).delete()
        db.query(RestaurantTable).filter(RestaurantTable.id == test_table.id).delete()
        db.query(Waiter).filter(Waiter.id == test_waiter.id).delete()
        db.commit()
        db.close()

def test_simulation_controls_lifecycle():
    """Verify Start, Step, Pause, Resume, Reset controls for Multi-Agent Simulation."""
    # Step simulation
    step_res = client.post("/api/simulation/step?delta_seconds=1.0")
    assert step_res.status_code == 200
    assert "current_time_sec" in step_res.json()

    # Pause simulation
    pause_res = client.post("/api/simulation/pause")
    assert pause_res.status_code == 200
    assert pause_res.json()["is_paused"] is True

    # Resume simulation
    resume_res = client.post("/api/simulation/resume")
    assert resume_res.status_code == 200
    assert resume_res.json()["is_paused"] is False

    # Reset simulation
    reset_res = client.post("/api/simulation/reset")
    assert reset_res.status_code == 200
    assert reset_res.json()["current_time_sec"] == 0.0

    # Start discrete simulation run
    start_res = client.post(
        "/api/simulation/start",
        json={
            "customer_count": 6,
            "algorithm": "A_STAR",
            "arrival_interval_seconds": 2.0,
            "service_duration_seconds": 6.0,
            "cleaning_duration_seconds": 2.0,
            "random_seed": 42
        }
    )
    assert start_res.status_code == 200
    assert start_res.json()["completed_customers"] >= 0
