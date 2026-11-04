import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import SimulationRecord
from app.schemas import SimulationStartRequest, SimulationStatusOut, SimulationRecordOut
from app.simulation.simulator import global_simulator

router = APIRouter(prefix="/simulation", tags=["Simulation"])

@router.post("/start", response_model=SimulationStatusOut)
def start_simulation(payload: SimulationStartRequest, db: Session = Depends(get_db)):
    t0 = time.perf_counter()
    global_simulator.initialize_from_db(
        db=db,
        customer_count=payload.customer_count,
        algorithm=payload.algorithm,
        service_duration_sec=payload.service_duration_seconds,
        cleaning_duration_sec=payload.cleaning_duration_seconds,
        arrival_interval_sec=payload.arrival_interval_seconds,
        random_seed=payload.random_seed or 42
    )

    # Run the simulation cycle
    global_simulator.run_full(max_seconds=180.0, step_size=0.5)
    exec_time_ms = (time.perf_counter() - t0) * 1000.0

    # Persist record in database
    global_simulator.save_record_to_db(db, exec_time_ms)

    return global_simulator.get_status()

@router.post("/step", response_model=SimulationStatusOut)
def step_simulation(delta_seconds: float = 1.0, db: Session = Depends(get_db)):
    if not global_simulator.customer_agents:
        global_simulator.initialize_from_db(db)
    global_simulator.step(delta_seconds)
    return global_simulator.get_status()

@router.post("/pause", response_model=SimulationStatusOut)
def pause_simulation():
    global_simulator.is_paused = True
    global_simulator.is_running = False
    return global_simulator.get_status()

@router.post("/resume", response_model=SimulationStatusOut)
def resume_simulation():
    global_simulator.is_paused = False
    global_simulator.is_running = True
    return global_simulator.get_status()

@router.post("/reset", response_model=SimulationStatusOut)
def reset_simulation():
    global_simulator.reset()
    return global_simulator.get_status()

@router.get("/status", response_model=SimulationStatusOut)
def get_simulation_status():
    return global_simulator.get_status()

@router.get("/history", response_model=List[SimulationRecordOut])
def get_simulation_history(db: Session = Depends(get_db)):
    records = db.query(SimulationRecord).order_by(SimulationRecord.id.desc()).limit(20).all()
    return records
