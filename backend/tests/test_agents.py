import pytest
from app.agents.customer_agent import CustomerAgent
from app.agents.table_agent import TableAgent
from app.agents.waiter_agent import WaiterAgent
from app.agents.manager_agent import ManagerAgent

def test_customer_agent_lifecycle():
    c = CustomerAgent(
        group_id=1,
        group_name="Test Party",
        group_size=4,
        arrival_time_sec=10.0,
        max_patience_sec=20.0
    )
    assert c.status == "ARRIVED"
    c.status = "WAITING"
    assert not c.has_reneged(25.0)
    # Waited 22 seconds (32 - 10) > 20s patience
    assert c.has_reneged(32.0)
    c.mark_reneged()
    assert c.status == "RENEGED"

def test_table_agent_lifecycle():
    t = TableAgent(table_id=1, table_number="T01", capacity=4)
    assert t.is_available()
    assert t.status == "AVAILABLE"

    # Seating
    t.seat_group(group_id=10, waiter_id=2, service_end_time_sec=50.0)
    assert not t.is_available()
    assert t.status == "OCCUPIED"

    # Finish dining -> cleaning
    t.start_cleaning(cleaning_end_time_sec=65.0)
    assert t.status == "CLEANING"

    # Finish cleaning -> available
    t.finish_cleaning()
    assert t.status == "AVAILABLE"
    assert t.is_available()

def test_waiter_agent_workload():
    w = WaiterAgent(waiter_id=1, name="Elena", max_tables=2)
    assert w.can_accept_table()
    assert w.current_load == 0

    w.assign_table(table_id=101)
    assert w.current_load == 1
    assert w.can_accept_table()

    w.assign_table(table_id=102)
    assert w.current_load == 2
    assert not w.can_accept_table() # Max reached

    w.release_table(table_id=101)
    assert w.current_load == 1
    assert w.completed_services_count == 1
    assert w.can_accept_table()

def test_manager_agent_allocation():
    manager = ManagerAgent(algorithm="A_STAR")
    c = CustomerAgent(1, "Smiths", 2, 0.0)
    t = TableAgent(1, "T01", 2, "Window")
    w = WaiterAgent(1, "David", 4)

    pairings = manager.allocate_pending_queue([c], [t], [w], current_time_sec=10.0)
    assert len(pairings) == 1
    cust, tbl, wtr, reason = pairings[0]
    assert cust.group_id == 1
    assert tbl.table_id == 1
    assert wtr.waiter_id == 1
