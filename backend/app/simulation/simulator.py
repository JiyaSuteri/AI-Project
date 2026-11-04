import random
import time
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.agents.customer_agent import CustomerAgent
from app.agents.table_agent import TableAgent
from app.agents.waiter_agent import WaiterAgent
from app.agents.manager_agent import ManagerAgent
from app.schemas import SimulationEvent, SimulationStatusOut
from app.models import SimulationRecord, RestaurantTable, Waiter

class RestaurantSimulator:
    """
    Multi-Agent Event-Driven Restaurant Simulator.
    Simulates real-world arrivals, dining durations, table turnover,
    waiter workloads, and allocation algorithm performance.
    """
    def __init__(self):
        self.reset()

    def reset(self):
        self.is_running = False
        self.is_paused = False
        self.current_time_sec = 0.0
        self.algorithm = "A_STAR"
        self.customer_agents: List[CustomerAgent] = []
        self.table_agents: List[TableAgent] = []
        self.waiter_agents: List[WaiterAgent] = []
        self.manager_agent = ManagerAgent(algorithm="A_STAR")
        self.events: List[SimulationEvent] = []
        self.total_target_customers = 0
        self.service_duration_sec = 8.0
        self.cleaning_duration_sec = 4.0
        self.random_seed = 42

    def initialize_from_db(
        self,
        db: Session,
        customer_count: int = 12,
        algorithm: str = "A_STAR",
        service_duration_sec: float = 8.0,
        cleaning_duration_sec: float = 4.0,
        arrival_interval_sec: float = 2.0,
        random_seed: int = 42
    ):
        self.reset()
        self.algorithm = algorithm.upper()
        self.manager_agent.set_algorithm(self.algorithm)
        self.total_target_customers = customer_count
        self.service_duration_sec = service_duration_sec
        self.cleaning_duration_sec = cleaning_duration_sec
        self.random_seed = random_seed

        random.seed(random_seed)

        # 1. Load active tables from DB
        db_tables = db.query(RestaurantTable).filter(RestaurantTable.is_active == True).all()
        if not db_tables:
            # Fallback if DB empty
            self.table_agents = [
                TableAgent(i, f"T{i:02d}", 4, "Main Dining") for i in range(1, 13)
            ]
        else:
            self.table_agents = [
                TableAgent(t.id, t.table_number, t.capacity, t.location)
                for t in db_tables
            ]

        # 2. Load active waiters from DB
        db_waiters = db.query(Waiter).filter(Waiter.availability == True).all()
        if not db_waiters:
            self.waiter_agents = [
                WaiterAgent(i, f"Staff {i}", 4) for i in range(1, 6)
            ]
        else:
            self.waiter_agents = [
                WaiterAgent(w.id, w.name, w.max_tables)
                for w in db_waiters
            ]

        # 3. Synthesize customer arrival schedule with varied party sizes and preferences
        sample_names = [
            "Sterling Family", "Watson Duo", "OmniCorp Tech Group", "Dr. Vance",
            "Claire & Chris", "Morrison Trio", "Harding Banquet", "Alvarez Party",
            "Nakamura", "Greenwood Brunch", "Baker Duo", "Chen & Associates",
            "Kowalski", "Dupont Family", "Somerset Club"
        ]
        sample_requests = [None, "Window seat preferred", "Quiet booth", "Patio if sunny", "High chair needed"]

        self.customer_agents = []
        for i in range(customer_count):
            name = sample_names[i % len(sample_names)] if i < len(sample_names) else f"Guest Party {i+1}"
            group_size = random.choice([2, 2, 4, 4, 4, 6, 8])
            arrival_sec = round(i * arrival_interval_sec + random.uniform(0.1, 1.0), 1)
            priority = random.choice([1, 1, 1, 2, 3])
            request = random.choice(sample_requests)
            patience = random.uniform(30.0, 60.0)

            c_agent = CustomerAgent(
                group_id=i + 1,
                group_name=name,
                group_size=group_size,
                arrival_time_sec=arrival_sec,
                priority=priority,
                special_request=request,
                max_patience_sec=patience
            )
            self.customer_agents.append(c_agent)

        self.log_event(
            event_type="INIT",
            description=f"Simulation scenario initialized with {customer_count} parties, {len(self.table_agents)} tables, {len(self.waiter_agents)} waiters using {self.algorithm}."
        )

    def log_event(
        self,
        event_type: str,
        description: str,
        group_name: Optional[str] = None,
        table_number: Optional[str] = None,
        waiter_name: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        event = SimulationEvent(
            timestamp_sec=round(self.current_time_sec, 1),
            event_type=event_type,
            description=description,
            group_name=group_name,
            table_number=table_number,
            waiter_name=waiter_name,
            details=details or {}
        )
        self.events.append(event)

    def step(self, delta_sec: float = 1.0):
        """Advances simulation by delta_sec, handling arrivals, allocations, dining, turnover."""
        self.current_time_sec += delta_sec

        # 1. Process customer arrivals
        for cust in self.customer_agents:
            if cust.status == "ARRIVED" and self.current_time_sec >= cust.arrival_time_sec:
                cust.status = "WAITING"
                self.log_event(
                    event_type="ARRIVAL",
                    description=f"{cust.group_name} ({cust.group_size} guests) arrived and entered queue.",
                    group_name=cust.group_name,
                    details={"group_size": cust.group_size, "priority": cust.priority}
                )

        # 2. Check for reneging customers who waited too long
        for cust in self.customer_agents:
            if cust.has_reneged(self.current_time_sec):
                cust.mark_reneged()
                self.log_event(
                    event_type="RENEGED",
                    description=f"{cust.group_name} left the waiting queue after waiting {cust.get_wait_time_sec(self.current_time_sec):.1f}s without seating.",
                    group_name=cust.group_name
                )

        # 3. Check dining completion on occupied tables
        for tbl in self.table_agents:
            if tbl.status == "OCCUPIED" and tbl.service_end_time_sec is not None:
                if self.current_time_sec >= tbl.service_end_time_sec:
                    # Dining completed
                    seated_cust = next((c for c in self.customer_agents if c.group_id == tbl.occupied_by_group_id), None)
                    assigned_waiter = next((w for w in self.waiter_agents if w.waiter_id == tbl.assigned_waiter_id), None)

                    if seated_cust:
                        seated_cust.mark_completed(self.current_time_sec)
                    if assigned_waiter:
                        assigned_waiter.release_table(tbl.table_id)

                    tbl.start_cleaning(self.current_time_sec + self.cleaning_duration_sec)

                    self.log_event(
                        event_type="SERVICE_DONE",
                        description=f"Dining concluded at Table {tbl.table_number}. Table is now in CLEANING turnover for {self.cleaning_duration_sec:.0f}s.",
                        table_number=tbl.table_number,
                        group_name=seated_cust.group_name if seated_cust else None,
                        waiter_name=assigned_waiter.name if assigned_waiter else None
                    )

        # 4. Check cleaning completion on tables
        for tbl in self.table_agents:
            if tbl.status == "CLEANING" and tbl.cleaning_end_time_sec is not None:
                if self.current_time_sec >= tbl.cleaning_end_time_sec:
                    tbl.finish_cleaning()
                    self.log_event(
                        event_type="CLEANING_DONE",
                        description=f"Table {tbl.table_number} ({tbl.capacity}-top, {tbl.location}) sanitized and returned to AVAILABLE pool.",
                        table_number=tbl.table_number
                    )

        # 5. Manager Agent allocates waiting queue to available tables
        waiting_pool = [c for c in self.customer_agents if c.status == "WAITING"]
        if waiting_pool:
            pairings = self.manager_agent.allocate_pending_queue(
                waiting_customers=waiting_pool,
                tables=self.table_agents,
                waiters=self.waiter_agents,
                current_time_sec=self.current_time_sec
            )

            for cust, tbl, wtr, reason in pairings:
                service_end = self.current_time_sec + self.service_duration_sec
                tbl.seat_group(cust.group_id, wtr.waiter_id, service_end)
                wtr.assign_table(tbl.table_id)
                cust.mark_seated(self.current_time_sec, tbl.table_id, wtr.waiter_id)

                self.log_event(
                    event_type="ALLOCATED",
                    description=f"{cust.group_name} seated at Table {tbl.table_number} ({tbl.capacity} seats). Assigned Waiter: {wtr.name}.",
                    group_name=cust.group_name,
                    table_number=tbl.table_number,
                    waiter_name=wtr.name,
                    details={"reason": reason}
                )

    def run_full(self, max_seconds: float = 120.0, step_size: float = 0.5):
        """Runs the entire simulation synchronously until completion or time limit."""
        self.is_running = True
        self.is_paused = False
        while self.current_time_sec < max_seconds:
            # Check if all customers completed or reneged
            active_or_waiting = any(
                c.status in ["ARRIVED", "WAITING", "SEATED"] for c in self.customer_agents
            )
            any_cleaning = any(t.status == "CLEANING" for t in self.table_agents)
            if not active_or_waiting and not any_cleaning and self.current_time_sec > 10.0:
                break
            self.step(step_size)

        self.is_running = False

    def save_record_to_db(self, db: Session, execution_time_ms: float) -> SimulationRecord:
        completed = [c for c in self.customer_agents if c.status == "COMPLETED"]
        allocated = [c for c in self.customer_agents if c.status in ["SEATED", "COMPLETED"]]
        
        waits = [c.get_wait_time_sec(c.seated_time_sec or self.current_time_sec) for c in allocated]
        avg_wait = sum(waits) / len(waits) if waits else 0.0

        seated_caps = sum(
            next((t.capacity for t in self.table_agents if t.table_id == c.assigned_table_id), 0)
            for c in allocated
        )
        total_caps = sum(t.capacity for t in self.table_agents)
        utilization = round((seated_caps / max(1, total_caps)) * 100.0, 1)

        record = SimulationRecord(
            simulation_name=f"Sim-{self.algorithm}-{datetime.now(timezone.utc).strftime('%H%M%S')}",
            algorithm=self.algorithm,
            total_customers=len(self.customer_agents),
            successful_allocations=len(allocated),
            average_waiting_time=round(avg_wait, 1),
            execution_time=round(execution_time_ms, 2),
            utilization=utilization
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    def get_status(self) -> SimulationStatusOut:
        total = len(self.customer_agents)
        allocated = len([c for c in self.customer_agents if c.status in ["SEATED", "COMPLETED"]])
        waiting = len([c for c in self.customer_agents if c.status == "WAITING"])
        completed = len([c for c in self.customer_agents if c.status == "COMPLETED"])
        reneged = len([c for c in self.customer_agents if c.status == "RENEGED"])
        
        progress = (completed + reneged) / max(1, total) * 100.0

        return SimulationStatusOut(
            is_running=self.is_running,
            is_paused=self.is_paused,
            current_time_sec=round(self.current_time_sec, 1),
            progress_percent=round(progress, 1),
            algorithm=self.algorithm,
            total_customers=total,
            allocated_customers=allocated,
            waiting_customers=waiting,
            completed_customers=completed,
            reneged_customers=reneged,
            events=self.events[-60:] # Return recent 60 events for fast frontend rendering
        )

# Global singleton simulator instance for live API control
global_simulator = RestaurantSimulator()
