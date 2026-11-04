from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models import RestaurantTable, Waiter, CustomerGroup, Reservation, ServicePolicy, Allocation, SimulationRecord

SAMPLE_TABLES = [
    {"table_number": "T01", "capacity": 2, "location": "Window", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T02", "capacity": 2, "location": "Window", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T03", "capacity": 4, "location": "Main Dining", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T04", "capacity": 4, "location": "Main Dining", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T05", "capacity": 4, "location": "Main Dining", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T06", "capacity": 6, "location": "Booth Zone", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T07", "capacity": 6, "location": "Booth Zone", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T08", "capacity": 8, "location": "Main Dining", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T09", "capacity": 2, "location": "Patio", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T10", "capacity": 4, "location": "Patio", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T11", "capacity": 8, "location": "Banquet Alcove", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T12", "capacity": 10, "location": "Private Dining", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T13", "capacity": 2, "location": "Window", "status": "AVAILABLE", "is_active": True},
    {"table_number": "T14", "capacity": 4, "location": "Main Dining", "status": "AVAILABLE", "is_active": True},
]

SAMPLE_WAITERS = [
    {"name": "Elena Rostova", "availability": True, "max_tables": 4, "assigned_tables": 0, "completed_orders": 14, "workload_score": 0.15},
    {"name": "Marco Rossi", "availability": True, "max_tables": 4, "assigned_tables": 0, "completed_orders": 19, "workload_score": 0.20},
    {"name": "Chloe Dupont", "availability": True, "max_tables": 3, "assigned_tables": 0, "completed_orders": 11, "workload_score": 0.10},
    {"name": "David Kim", "availability": True, "max_tables": 5, "assigned_tables": 0, "completed_orders": 24, "workload_score": 0.25},
    {"name": "Amina Al-Mansoor", "availability": True, "max_tables": 4, "assigned_tables": 0, "completed_orders": 16, "workload_score": 0.18},
    {"name": "Liam O'Connor", "availability": True, "max_tables": 4, "assigned_tables": 0, "completed_orders": 8, "workload_score": 0.05},
]

SAMPLE_CUSTOMERS = [
    {"group_name": "Miller Family", "group_size": 4, "priority": 1, "special_requirements": "High chair needed", "status": "WAITING"},
    {"group_name": "Dr. Aris & Guest", "group_size": 2, "priority": 2, "special_requirements": "Window seat preferred", "status": "WAITING"},
    {"group_name": "Apex Tech Corporate", "group_size": 8, "priority": 2, "special_requirements": "Quiet corner for meeting", "status": "WAITING"},
    {"group_name": "Sophie Martin", "group_size": 2, "priority": 1, "special_requirements": None, "status": "WAITING"},
    {"group_name": "The Henderson Party", "group_size": 6, "priority": 1, "special_requirements": "Booth seating", "status": "WAITING"},
    {"group_name": "Kumar Anniversary", "group_size": 2, "priority": 3, "special_requirements": "Romantic window table", "status": "WAITING"},
    {"group_name": "Lucas & Friends", "group_size": 4, "priority": 1, "special_requirements": "Patio if sunny", "status": "WAITING"},
    {"group_name": "Goldman Investment Lunch", "group_size": 5, "priority": 2, "special_requirements": "Fast service requested", "status": "WAITING"},
    {"group_name": "Elena Rivera", "group_size": 1, "priority": 1, "special_requirements": "Near power outlet", "status": "WAITING"},
    {"group_name": "Grand Birthday Celebration", "group_size": 10, "priority": 3, "special_requirements": "Private dining room", "status": "WAITING"},
    {"group_name": "Zhang Dinner Party", "group_size": 3, "priority": 1, "special_requirements": None, "status": "WAITING"},
    {"group_name": "Vaughn Duo", "group_size": 2, "priority": 1, "special_requirements": "Wheelchair accessibility", "status": "WAITING"},
]

SAMPLE_RESERVATIONS = [
    {"customer_name": "Senator Collins", "group_size": 6, "reservation_date": "2026-11-05", "reservation_time": "19:00", "special_requests": "Window booth, discreet service", "status": "CONFIRMED"},
    {"customer_name": "Claire Redfield", "group_size": 2, "reservation_date": "2026-11-05", "reservation_time": "19:30", "special_requests": "Quiet table for date night", "status": "CONFIRMED"},
    {"customer_name": "Nexus Systems Team", "group_size": 8, "reservation_date": "2026-11-05", "reservation_time": "20:00", "special_requests": "Banquet table, presentation support", "status": "CONFIRMED"},
    {"customer_name": "Gabriel Thorne", "group_size": 4, "reservation_date": "2026-11-05", "reservation_time": "20:30", "special_requests": "Booth table near wine display", "status": "CONFIRMED"},
    {"customer_name": "Amira Patel", "group_size": 2, "reservation_date": "2026-11-06", "reservation_time": "18:30", "special_requests": "Patio outdoor view", "status": "CONFIRMED"},
    {"customer_name": "David Foster", "group_size": 4, "reservation_date": "2026-11-06", "reservation_time": "19:15", "special_requests": "High chair for toddler", "status": "CONFIRMED"},
]

SAMPLE_POLICIES = [
    {
        "policy_name": "Capacity Fit Principle",
        "category": "ALLOCATION",
        "description": "Customer groups must only be assigned to tables whose capacity equals or exceeds the party size. The smallest suitable table is always prioritized to minimize wasted capacity.",
        "is_active": True
    },
    {
        "policy_name": "No Double Allocation",
        "category": "ALLOCATION",
        "description": "A table can strictly host one customer group at a time. Tables in OCCUPIED, RESERVED, or CLEANING status cannot receive walk-in assignments.",
        "is_active": True
    },
    {
        "policy_name": "Waiter Workload Balancing",
        "category": "WAITER",
        "description": "Waiters have a maximum concurrent table threshold (default 4). New table allocations must prioritize available waiters with the lowest current workload score.",
        "is_active": True
    },
    {
        "policy_name": "Reservation Hold Window",
        "category": "RESERVATION",
        "description": "Reserved tables are held starting 30 minutes prior to booking time. A grace period of 15 minutes applies before a reservation is marked NO_SHOW and released.",
        "is_active": True
    },
    {
        "policy_name": "FIFO Queue with Priority Multipliers",
        "category": "QUEUE",
        "description": "Walk-in customers are served in arrival order, modulated by priority scores (1=Standard, 2=VIP, 3=Delayed Reservation, 4=Emergency/Special).",
        "is_active": True
    },
    {
        "policy_name": "Table Sanitation Turnover",
        "category": "ALLOCATION",
        "description": "Upon guest departure, tables automatically transition to CLEANING status for a mandatory reset window before returning to the AVAILABLE pool.",
        "is_active": True
    },
    {
        "policy_name": "Large Group Seating Protocol",
        "category": "ALLOCATION",
        "description": "Parties of 6 or more require designated banquet/large tables. If unavailable, adjacent tables may be linked under a single senior waiter.",
        "is_active": True
    },
    {
        "policy_name": "Wheelchair Accessibility Mandate",
        "category": "ACCESSIBILITY",
        "description": "Guests with mobility requirements must be seated at ground-level tables with a minimum aisle clearance of 36 inches (T01-T04).",
        "is_active": True
    },
    {
        "policy_name": "Customer Wait Tolerance & Renege Prevention",
        "category": "QUEUE",
        "description": "Standard wait tolerance is 30 minutes. If expected wait exceeds 25 minutes, staff must offer complimentary appetizers or seating updates.",
        "is_active": True
    },
    {
        "policy_name": "Advance Reservation Cancellation",
        "category": "RESERVATION",
        "description": "Cancellations must be communicated at least 2 hours prior to scheduled time without charge. Same-day late cancellations are tracked in customer records.",
        "is_active": True
    },
    {
        "policy_name": "Section Continuity Protocol",
        "category": "WAITER",
        "description": "Waiters should be assigned tables within their designated floor zone (Main Dining, Patio, Booth) to minimize travel latency.",
        "is_active": True
    }
]

def seed_database(db: Session, force_reset: bool = False):
    """Seed initial data if database is empty or if force_reset is True."""
    if force_reset:
        db.query(Allocation).delete()
        db.query(SimulationRecord).delete()
        db.query(CustomerGroup).delete()
        db.query(Reservation).delete()
        db.query(RestaurantTable).delete()
        db.query(Waiter).delete()
        db.query(ServicePolicy).delete()
        db.commit()

    # Check if data already exists
    if db.query(RestaurantTable).count() > 0:
        return {"status": "skipped", "message": "Database already seeded"}

    # Insert Tables
    table_objs = []
    for t_data in SAMPLE_TABLES:
        table_objs.append(RestaurantTable(**t_data))
    db.add_all(table_objs)
    db.commit()

    # Insert Waiters
    waiter_objs = []
    for w_data in SAMPLE_WAITERS:
        waiter_objs.append(Waiter(**w_data))
    db.add_all(waiter_objs)
    db.commit()

    # Insert Policies
    policy_objs = []
    for p_data in SAMPLE_POLICIES:
        policy_objs.append(ServicePolicy(**p_data))
    db.add_all(policy_objs)
    db.commit()

    # Insert Reservations
    res_objs = []
    for r_data in SAMPLE_RESERVATIONS:
        res_objs.append(Reservation(**r_data))
    db.add_all(res_objs)
    db.commit()

    # Insert Customers with slightly staggered arrival times
    now = datetime.now(timezone.utc)
    customer_objs = []
    for i, c_data in enumerate(SAMPLE_CUSTOMERS):
        c_copy = dict(c_data)
        c_copy["arrival_time"] = now - timedelta(minutes=(15 - i) * 3)
        customer_objs.append(CustomerGroup(**c_copy))
    db.add_all(customer_objs)
    db.commit()

    # Let's seed an initial active state: seat 3 groups to make the dashboard alive immediately
    # Group 1 -> Table 3, Waiter 1
    # Group 2 -> Table 1, Waiter 2
    # Group 5 -> Table 6, Waiter 4
    t3 = db.query(RestaurantTable).filter(RestaurantTable.table_number == "T03").first()
    t1 = db.query(RestaurantTable).filter(RestaurantTable.table_number == "T01").first()
    t6 = db.query(RestaurantTable).filter(RestaurantTable.table_number == "T06").first()
    
    w1 = db.query(Waiter).filter(Waiter.name == "Elena Rostova").first()
    w2 = db.query(Waiter).filter(Waiter.name == "Marco Rossi").first()
    w4 = db.query(Waiter).filter(Waiter.name == "David Kim").first()

    c1 = db.query(CustomerGroup).filter(CustomerGroup.group_name == "Miller Family").first()
    c2 = db.query(CustomerGroup).filter(CustomerGroup.group_name == "Dr. Aris & Guest").first()
    c5 = db.query(CustomerGroup).filter(CustomerGroup.group_name == "The Henderson Party").first()

    if t3 and w1 and c1:
        t3.status = "OCCUPIED"
        t3.current_group_id = c1.id
        t3.current_waiter_id = w1.id
        c1.status = "SEATED"
        w1.assigned_tables = 1
        w1.workload_score = 0.35
        db.add(Allocation(
            customer_group_id=c1.id,
            table_id=t3.id,
            waiter_id=w1.id,
            algorithm_used="A_STAR",
            allocation_reason="Initial seating: Exact capacity match 4 seats, lowest waiter workload."
        ))

    if t1 and w2 and c2:
        t1.status = "OCCUPIED"
        t1.current_group_id = c2.id
        t1.current_waiter_id = w2.id
        c2.status = "SEATED"
        w2.assigned_tables = 1
        w2.workload_score = 0.30
        db.add(Allocation(
            customer_group_id=c2.id,
            table_id=t1.id,
            waiter_id=w2.id,
            algorithm_used="GREEDY",
            allocation_reason="Initial seating: Requested window seat, capacity 2 match."
        ))

    if t6 and w4 and c5:
        t6.status = "OCCUPIED"
        t6.current_group_id = c5.id
        t6.current_waiter_id = w4.id
        c5.status = "SEATED"
        w4.assigned_tables = 1
        w4.workload_score = 0.40
        db.add(Allocation(
            customer_group_id=c5.id,
            table_id=t6.id,
            waiter_id=w4.id,
            algorithm_used="A_STAR",
            allocation_reason="Initial seating: Booth seating preferred, 6 seats accommodated."
        ))

    # Mark Table T09 as CLEANING and Table T11 as RESERVED to showcase rich visual states on floor plan
    t9 = db.query(RestaurantTable).filter(RestaurantTable.table_number == "T09").first()
    if t9:
        t9.status = "CLEANING"

    t11 = db.query(RestaurantTable).filter(RestaurantTable.table_number == "T11").first()
    if t11:
        t11.status = "RESERVED"

    db.commit()
    return {"status": "success", "message": "Database successfully seeded with rich initial scenario"}
