import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_dashboard_stats(client):
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_tables" in data
    assert "occupied_tables" in data
    assert "available_tables" in data
    assert "waiting_customers" in data
    assert data["total_tables"] >= 12

def test_tables_crud(client):
    # 1. Get all tables
    res = client.get("/api/tables")
    assert res.status_code == 200
    tables = res.json()
    assert len(tables) >= 12

    # 2. Create new table
    uid = uuid.uuid4().hex[:4].upper()
    t_num = f"T{uid}"
    new_t = {
        "table_number": t_num,
        "capacity": 4,
        "location": "Patio",
        "status": "AVAILABLE",
        "is_active": True
    }
    create_res = client.post("/api/tables", json=new_t)
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    # 3. Update table
    update_res = client.put(f"/api/tables/{created_id}", json={"capacity": 6})
    assert update_res.status_code == 200
    assert update_res.json()["capacity"] == 6

    # 4. Status update
    status_res = client.put(f"/api/tables/{created_id}/status", json={"status": "CLEANING"})
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "CLEANING"

    # 5. Delete table
    del_res = client.delete(f"/api/tables/{created_id}")
    assert del_res.status_code == 200

def test_duplicate_reservation_prevention(client):
    unique_name = f"Test Guest {uuid.uuid4().hex[:6]}"
    res_data = {
        "customer_name": unique_name,
        "group_size": 2,
        "reservation_date": "2026-12-25",
        "reservation_time": "20:00",
        "special_requests": "Window",
        "status": "CONFIRMED"
    }
    # First booking succeeds
    res1 = client.post("/api/reservations", json=res_data)
    assert res1.status_code == 201
    created_id = res1.json()["id"]

    # Duplicate booking at exact same date & time with same name must fail with 400
    res2 = client.post("/api/reservations", json=res_data)
    assert res2.status_code == 400

    # Cleanup
    client.delete(f"/api/reservations/{created_id}")

def test_ai_chat_grounded(client):
    res = client.post("/api/ai/chat", json={"message": "Which tables are currently available?"})
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "sources" in data
    assert len(data["reply"]) > 0

def test_algorithm_comparison_api(client):
    res = client.get("/api/allocations/compare")
    assert res.status_code == 200
    comparisons = res.json()
    assert len(comparisons) == 5
    algos = [c["algorithm"] for c in comparisons]
    assert "A_STAR" in algos
    assert "BFS" in algos
