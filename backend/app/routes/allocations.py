from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import RestaurantTable, Waiter, CustomerGroup, Allocation
from app.schemas import AllocationRunRequest, AllocationRunResponse, AllocationDecision, AllocationOut, AlgorithmComparisonItem
from app.algorithms.base import CustomerDTO, TableDTO, WaiterDTO
from app.algorithms.rule_based import run_rule_based_allocation
from app.algorithms.greedy import run_greedy_allocation
from app.algorithms.bfs import run_bfs_allocation
from app.algorithms.dfs import run_dfs_allocation
from app.algorithms.a_star import run_a_star_allocation
from app.algorithms.comparator import compare_all_algorithms

router = APIRouter(prefix="/allocations", tags=["Allocations"])

def load_algorithm_dtos(db: Session, group_ids: Optional[List[int]] = None):
    # Customer groups
    c_query = db.query(CustomerGroup).filter(CustomerGroup.status == "WAITING")
    if group_ids:
        c_query = c_query.filter(CustomerGroup.id.in_(group_ids))
    customers_db = c_query.order_by(CustomerGroup.priority.desc(), CustomerGroup.arrival_time.asc()).all()

    now = datetime.now(timezone.utc)
    customer_dtos = []
    for c in customers_db:
        arr = c.arrival_time
        if arr and arr.tzinfo is None:
            arr = arr.replace(tzinfo=timezone.utc)
        wait_mins = (now - arr).total_seconds() / 60.0 if arr else 0.0
        customer_dtos.append(CustomerDTO(
            id=c.id,
            group_name=c.group_name,
            group_size=c.group_size,
            priority=c.priority,
            waiting_minutes=max(0.0, wait_mins),
            special_requirements=c.special_requirements
        ))

    # Tables
    tables_db = db.query(RestaurantTable).filter(
        RestaurantTable.status == "AVAILABLE",
        RestaurantTable.is_active == True
    ).all()
    table_dtos = [
        TableDTO(
            id=t.id,
            table_number=t.table_number,
            capacity=t.capacity,
            location=t.location,
            status=t.status,
            is_active=t.is_active
        )
        for t in tables_db
    ]

    # Waiters
    waiters_db = db.query(Waiter).filter(Waiter.availability == True).all()
    waiter_dtos = [
        WaiterDTO(
            id=w.id,
            name=w.name,
            availability=w.availability,
            max_tables=w.max_tables,
            assigned_tables=w.assigned_tables,
            workload_score=w.workload_score
        )
        for w in waiters_db
    ]

    return customer_dtos, table_dtos, waiter_dtos, customers_db, tables_db, waiters_db

@router.post("/run", response_model=AllocationRunResponse)
def run_allocation(payload: AllocationRunRequest, db: Session = Depends(get_db)):
    algo = payload.algorithm.upper()
    c_dtos, t_dtos, w_dtos, customers_db, tables_db, waiters_db = load_algorithm_dtos(db, payload.group_ids)

    if not c_dtos:
        raise HTTPException(status_code=400, detail="No waiting customer groups found to allocate.")
    if not t_dtos:
        raise HTTPException(status_code=400, detail="No available tables currently in the restaurant.")
    if not w_dtos:
        raise HTTPException(status_code=400, detail="No active waiters currently available.")

    # Execute selected algorithm
    if algo == "RULE_BASED":
        result = run_rule_based_allocation(c_dtos, t_dtos, w_dtos)
    elif algo == "GREEDY":
        result = run_greedy_allocation(c_dtos, t_dtos, w_dtos)
    elif algo == "BFS":
        result = run_bfs_allocation(c_dtos, t_dtos, w_dtos)
    elif algo == "DFS":
        result = run_dfs_allocation(c_dtos, t_dtos, w_dtos)
    elif algo == "A_STAR":
        result = run_a_star_allocation(c_dtos, t_dtos, w_dtos)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown algorithm '{payload.algorithm}'. Choose from: RULE_BASED, GREEDY, BFS, DFS, A_STAR.")

    t_map = {t.id: t for t in tables_db}
    w_map = {w.id: w for w in waiters_db}
    c_map = {c.id: c for c in customers_db}

    decisions: List[AllocationDecision] = []
    
    # Process assignments
    for a in result.assignments:
        table_obj = t_map.get(a.table_id)
        waiter_obj = w_map.get(a.waiter_id)
        cust_obj = c_map.get(a.group_id)

        decisions.append(AllocationDecision(
            group_id=a.group_id,
            group_name=cust_obj.group_name if cust_obj else f"Group #{a.group_id}",
            group_size=cust_obj.group_size if cust_obj else 0,
            table_id=a.table_id,
            table_number=table_obj.table_number if table_obj else None,
            table_capacity=table_obj.capacity if table_obj else None,
            waiter_id=a.waiter_id,
            waiter_name=waiter_obj.name if waiter_obj else None,
            success=True,
            reason=a.reason,
            rejected_alternatives=a.rejected_alternatives,
            cost=a.cost
        ))

        # Commit to real database if auto_commit is True
        if payload.auto_commit and table_obj and waiter_obj and cust_obj:
            table_obj.status = "OCCUPIED"
            table_obj.current_group_id = cust_obj.id
            table_obj.current_waiter_id = waiter_obj.id

            cust_obj.status = "SEATED"

            waiter_obj.assigned_tables += 1
            waiter_obj.workload_score = round(waiter_obj.assigned_tables / waiter_obj.max_tables, 2)

            db_alloc = Allocation(
                customer_group_id=cust_obj.id,
                table_id=table_obj.id,
                waiter_id=waiter_obj.id,
                allocation_time=datetime.now(timezone.utc),
                algorithm_used=algo,
                allocation_reason=a.reason
            )
            db.add(db_alloc)

    # Process unallocated
    for u_id in result.unallocated_group_ids:
        cust_obj = c_map.get(u_id)
        decisions.append(AllocationDecision(
            group_id=u_id,
            group_name=cust_obj.group_name if cust_obj else f"Group #{u_id}",
            group_size=cust_obj.group_size if cust_obj else 0,
            table_id=None,
            table_number=None,
            table_capacity=None,
            waiter_id=None,
            waiter_name=None,
            success=False,
            reason="Insufficient table capacity or no available waiter within workload thresholds.",
            rejected_alternatives=[],
            cost=100.0
        ))

    if payload.auto_commit:
        db.commit()

    return AllocationRunResponse(
        algorithm=algo,
        execution_time_ms=result.execution_time_ms,
        nodes_explored=result.nodes_explored,
        total_requested=len(c_dtos),
        successful_allocations=len(result.assignments),
        unallocated_count=len(result.unallocated_group_ids),
        table_utilization_percent=result.table_utilization_percent,
        average_wait_minutes=result.average_wait_minutes,
        total_cost=result.total_cost,
        decisions=decisions
    )

@router.get("/compare", response_model=List[AlgorithmComparisonItem])
def compare_algorithms_endpoint(db: Session = Depends(get_db)):
    c_dtos, t_dtos, w_dtos, _, _, _ = load_algorithm_dtos(db)
    if not c_dtos:
        # Create a synthetic benchmark test batch if live queue is currently empty
        c_dtos = [
            CustomerDTO(101, "Benchmark Duo", 2, 1, 5.0, "Window"),
            CustomerDTO(102, "Family Feast", 4, 2, 12.0, "High chair"),
            CustomerDTO(103, "Tech Execs", 6, 3, 20.0, "Quiet booth"),
            CustomerDTO(104, "Birthday Squad", 8, 1, 8.0, None),
            CustomerDTO(105, "Couple Evening", 2, 1, 15.0, "Patio"),
            CustomerDTO(106, "Lunch Group", 4, 1, 3.0, None),
        ]

    # Tables fallback if no tables free in DB
    if not t_dtos:
        all_tables = db.query(RestaurantTable).all()
        t_dtos = [
            TableDTO(t.id, t.table_number, t.capacity, t.location, "AVAILABLE", True)
            for t in all_tables
        ]

    results = compare_all_algorithms(c_dtos, t_dtos, w_dtos)
    
    comparisons = []
    for r in results:
        comparisons.append(AlgorithmComparisonItem(
            algorithm=r.algorithm,
            execution_time_ms=r.execution_time_ms,
            nodes_explored=r.nodes_explored,
            successful_allocations=len(r.assignments),
            average_waiting_time_min=r.average_wait_minutes,
            table_utilization_percent=r.table_utilization_percent,
            total_cost=r.total_cost,
            is_optimal_claimed=r.is_optimal_claimed,
            optimality_explanation=r.optimality_explanation
        ))
    return comparisons

@router.get("", response_model=List[AllocationOut])
def get_allocations(limit: int = 50, db: Session = Depends(get_db)):
    allocations = db.query(Allocation).order_by(Allocation.id.desc()).limit(limit).all()
    out = []
    for a in allocations:
        out.append(AllocationOut(
            id=a.id,
            customer_group_id=a.customer_group_id,
            table_id=a.table_id,
            waiter_id=a.waiter_id,
            allocation_time=a.allocation_time,
            algorithm_used=a.algorithm_used,
            allocation_reason=a.allocation_reason,
            group_name=a.customer_group.group_name if a.customer_group else None,
            table_number=a.table.table_number if a.table else None,
            waiter_name=a.waiter.name if a.waiter else None
        ))
    return out

@router.get("/{allocation_id}", response_model=AllocationOut)
def get_allocation(allocation_id: int, db: Session = Depends(get_db)):
    a = db.query(Allocation).filter(Allocation.id == allocation_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Allocation record not found")
    return AllocationOut(
        id=a.id,
        customer_group_id=a.customer_group_id,
        table_id=a.table_id,
        waiter_id=a.waiter_id,
        allocation_time=a.allocation_time,
        algorithm_used=a.algorithm_used,
        allocation_reason=a.allocation_reason,
        group_name=a.customer_group.group_name if a.customer_group else None,
        table_number=a.table.table_number if a.table else None,
        waiter_name=a.waiter.name if a.waiter else None
    )
