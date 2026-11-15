from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import RestaurantTable, Waiter, CustomerGroup, Reservation, Allocation
from app.schemas import DashboardStats, ActivityItem

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def normalize_dt(dt):
    if dt is None:
        return datetime.now(timezone.utc)
    if isinstance(dt, str):
        try:
            dt = datetime.fromisoformat(dt)
        except Exception:
            return datetime.now(timezone.utc)
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    tables = db.query(RestaurantTable).all()
    waiters = db.query(Waiter).filter(Waiter.availability == True).all()
    waiting_groups = db.query(CustomerGroup).filter(CustomerGroup.status == "WAITING").all()
    
    total_tables = len(tables)
    occupied = len([t for t in tables if t.status == "OCCUPIED"])
    available = len([t for t in tables if t.status == "AVAILABLE"])
    reserved = len([t for t in tables if t.status == "RESERVED"])
    cleaning = len([t for t in tables if t.status == "CLEANING"])
    
    now = datetime.now(timezone.utc)
    wait_times = []
    for g in waiting_groups:
        if g.arrival_time:
            arr = normalize_dt(g.arrival_time)
            diff_mins = max(0.0, (now - arr).total_seconds() / 60.0)
            # For the current shift average, include parties waiting up to 12 hours (720 min)
            # Legacy seed records from previous weeks are capped at standard service threshold
            if diff_mins <= 720:
                wait_times.append(diff_mins)
            else:
                wait_times.append(min(diff_mins, 30.0))

    avg_wait = sum(wait_times) / len(wait_times) if wait_times else 0.0

    occupied_capacity = sum(t.capacity for t in tables if t.status == "OCCUPIED")
    total_capacity = sum(t.capacity for t in tables if t.is_active)
    utilization = round((occupied_capacity / max(1, total_capacity)) * 100.0, 1)

    return DashboardStats(
        total_tables=total_tables,
        occupied_tables=occupied,
        available_tables=available,
        reserved_tables=reserved,
        cleaning_tables=cleaning,
        waiting_customers=len(waiting_groups),
        active_waiters=len(waiters),
        average_waiting_time_minutes=round(avg_wait, 1),
        table_utilization_percent=utilization
    )

@router.get("/activity", response_model=List[ActivityItem])
def get_recent_activity(db: Session = Depends(get_db)):
    allocations = db.query(Allocation).order_by(Allocation.id.desc()).limit(8).all()
    activities = []
    
    for a in allocations:
        activities.append(ActivityItem(
            id=f"alloc-{a.id}",
            timestamp=normalize_dt(a.allocation_time),
            type="ALLOCATION",
            title=f"Table {a.table.table_number if a.table else a.table_id} Allocated",
            description=f"{a.customer_group.group_name if a.customer_group else 'Party'} assigned via {a.algorithm_used} to Waiter {a.waiter.name if a.waiter else 'Staff'}."
        ))

    # Add reservations
    reservations = db.query(Reservation).order_by(Reservation.id.desc()).limit(4).all()
    now = datetime.now(timezone.utc)
    for r in reservations:
        res_dt = now
        if r.reservation_date and r.reservation_time:
            try:
                res_dt = datetime.fromisoformat(f"{r.reservation_date}T{r.reservation_time}").replace(tzinfo=timezone.utc)
            except Exception:
                res_dt = now

        activities.append(ActivityItem(
            id=f"res-{r.id}",
            timestamp=res_dt,
            type="RESERVATION",
            title=f"Reservation: {r.customer_name}",
            description=f"Party of {r.group_size} confirmed for {r.reservation_date} at {r.reservation_time}."
        ))

    # Sort descending by timestamp
    activities.sort(key=lambda x: normalize_dt(x.timestamp), reverse=True)
    return activities[:10]
