import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.database.session import SessionLocal
from app.models import User, RestaurantTable, CustomerGroup, Reservation

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_auth_status_default(client):
    """Verify that unauthenticated visitors are identified as guest mode by default."""
    response = client.get("/api/auth/status")
    assert response.status_code == 200
    data = response.json()
    assert data["is_authenticated"] is False
    assert data["is_guest"] is True
    assert data["user"] is None

def test_dev_demo_login_and_me(client):
    """Verify developer login issues valid JWT token and /me returns user profile."""
    # 1. Login via dev demo endpoint
    login_res = client.post("/api/auth/dev-demo-login")
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert token_data["user"]["email"] == "demo.manager@saffronandsage.com"

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Access /api/auth/me with Bearer token
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "demo.manager@saffronandsage.com"
    assert me_data["role"] == "MANAGER"

    # 3. Access /api/auth/status with Bearer token
    status_res = client.get("/api/auth/status", headers=headers)
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["is_authenticated"] is True
    assert status_data["is_guest"] is False
    assert status_data["user"]["email"] == "demo.manager@saffronandsage.com"

def test_auth_me_unauthorized(client):
    """Verify /api/auth/me rejects unauthenticated requests with 401."""
    res = client.get("/api/auth/me")
    assert res.status_code == 401

def test_guest_mode_blocks_database_mutation(client):
    """Verify that Guest Mode cannot alter persistent restaurant records."""
    guest_headers = {"X-Guest-Mode": "true"}

    # Attempt to create a table in Guest Mode
    res = client.post("/api/tables", json={
        "table_number": "T999_GUEST",
        "capacity": 4,
        "location": "Main Dining"
    }, headers=guest_headers)
    assert res.status_code == 403
    assert "Guest Mode Sandbox" in res.json()["detail"]

    # Attempt to create customer in Guest Mode
    res_cust = client.post("/api/customers", json={
        "group_name": "Unauthorized Guest Party",
        "group_size": 4
    }, headers=guest_headers)
    assert res_cust.status_code == 403

    # Attempt to create reservation in Guest Mode
    res_booking = client.post("/api/reservations", json={
        "customer_name": "Guest Booking",
        "group_size": 2,
        "reservation_date": "2026-12-31",
        "reservation_time": "18:00"
    }, headers=guest_headers)
    assert res_booking.status_code == 403

def test_guest_mode_allocation_isolation(client):
    """Verify that in Guest Mode, allocation runs algorithms without altering table/customer states."""
    guest_headers = {"X-Guest-Mode": "true"}

    # Execute allocation with auto_commit=True in Guest Mode
    res = client.post("/api/allocations/run", json={
        "algorithm": "A_STAR",
        "auto_commit": True
    }, headers=guest_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["algorithm"] == "A_STAR"
    assert len(data["decisions"]) > 0

    # Verify that in database, customers remain WAITING (not marked SEATED by guest)
    db = SessionLocal()
    try:
        waiting_count = db.query(CustomerGroup).filter(CustomerGroup.status == "WAITING").count()
        assert waiting_count > 0
    finally:
        db.close()

def test_authenticated_mutation_and_persistence(client):
    """Verify that an authenticated manager can modify records and changes persist in SQLite."""
    # Obtain manager token
    login_res = client.post("/api/auth/dev-demo-login")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    unique_num = f"T_{uuid.uuid4().hex[:5].upper()}"

    # 1. Create table with manager token
    create_res = client.post("/api/tables", json={
        "table_number": unique_num,
        "capacity": 6,
        "location": "VIP Lounge",
        "status": "AVAILABLE",
        "is_active": True
    }, headers=headers)
    assert create_res.status_code == 201
    table_id = create_res.json()["id"]

    # 2. Verify direct persistence in SQLite via separate DB session
    fresh_db = SessionLocal()
    try:
        persisted_t = fresh_db.query(RestaurantTable).filter(RestaurantTable.id == table_id).first()
        assert persisted_t is not None
        assert persisted_t.table_number == unique_num
        assert persisted_t.capacity == 6
    finally:
        fresh_db.close()

    # 3. Cleanup table
    del_res = client.delete(f"/api/tables/{table_id}", headers=headers)
    assert del_res.status_code == 200

def test_invalid_google_token_rejection(client):
    """Verify that fake or invalid Google credentials are securely rejected by backend."""
    res = client.post("/api/auth/google", json={"credential": "invalid-bogus-token.eyJhbGci.eyJzdWIi"})
    assert res.status_code == 401
    assert "verification failed" in res.json()["detail"].lower() or "error" in res.json()["detail"].lower()
