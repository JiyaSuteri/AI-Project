import urllib.request
import urllib.error
import json
import sqlite3
import sys

BASE_URL = "http://127.0.0.1:8000/api"
DB_PATH = "backend/restaurant_planner.db"

def run_tests():
    print("=" * 65)
    print("TEST B & C & D — RESERVATION SEATING & DUPLICATE PREVENTION")
    print("=" * 65)

    # 1. Create one temporary test reservation
    res_payload = {
        "customer_name": "TEST-SEAT-PARTY-VIP",
        "group_size": 4,
        "reservation_date": "2026-11-20",
        "reservation_time": "19:00",
        "special_requests": "VIP Corner Booth",
        "status": "CONFIRMED"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/reservations",
        data=json.dumps(res_payload).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        res_data = json.loads(resp.read().decode())
        res_id = res_data["id"]
        print(f"1. Created test reservation: ID={res_id}, Guest='{res_data['customer_name']}' ({res_data['group_size']} guests)")

    table_id = None
    cust_id = None
    alloc_id = None
    waiter_id = None

    try:
        # 2. Call Seat Party endpoint (/api/reservations/{id}/seat)
        print("2. Calling Seat Party endpoint...")
        req = urllib.request.Request(
            f"{BASE_URL}/reservations/{res_id}/seat",
            data=b"",
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            seat_res = json.loads(resp.read().decode())
            print(f"   Seat Party response: {seat_res}")
            assert seat_res["success"] == True
            table_id = seat_res["table_id"]
            cust_id = seat_res["customer_id"]
            alloc_id = seat_res["allocation_id"]
            waiter_id = seat_res["waiter_id"]
            print(f"   Seated at Table {seat_res['table_number']} by Server {seat_res['waiter_name']}")

        # 3. Verify in SQLite that Table is OCCUPIED with correct customer name and waiter
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, table_number, status, current_group_id, current_waiter_id FROM restaurant_tables WHERE id = ?", (table_id,))
        t_row = c.fetchone()
        c.execute("SELECT id, group_name, status FROM customer_groups WHERE id = ?", (cust_id,))
        cust_row = c.fetchone()
        c.execute("SELECT id, status, table_id FROM reservations WHERE id = ?", (res_id,))
        r_row = c.fetchone()
        c.execute("SELECT id, customer_group_id, table_id, waiter_id, algorithm_used FROM allocations WHERE id = ?", (alloc_id,))
        a_row = c.fetchone()
        conn.close()

        print(f"   SQLite Table: ID={t_row[0]}, Num={t_row[1]}, Status='{t_row[2]}', GroupID={t_row[3]}, WaiterID={t_row[4]}")
        print(f"   SQLite Customer: ID={cust_row[0]}, Name='{cust_row[1]}', Status='{cust_row[2]}'")
        print(f"   SQLite Reservation: ID={r_row[0]}, Status='{r_row[1]}', TableID={r_row[2]}")
        print(f"   SQLite Allocation: ID={a_row[0]}, CustID={a_row[1]}, TableID={a_row[2]}, WaiterID={a_row[3]}, Algo='{a_row[4]}'")

        assert t_row[2] == "OCCUPIED", "Table status must be OCCUPIED"
        assert t_row[3] == cust_id, "Table current_group_id must match customer"
        assert cust_row[2] == "SEATED", "Customer status must be SEATED"
        assert r_row[1] == "SEATED", "Reservation status must be SEATED"
        assert a_row is not None, "Allocation record must exist"

        # 4. Verify /api/tables returns the table with group_name and waiter_name
        req = urllib.request.Request(f"{BASE_URL}/tables")
        with urllib.request.urlopen(req) as resp:
            tables = json.loads(resp.read().decode())
            target_table_api = next((t for t in tables if t["id"] == table_id), None)
            assert target_table_api is not None
            print(f"   API /api/tables check for Table {target_table_api['table_number']}:")
            print(f"     Status: {target_table_api['status']}")
            print(f"     Group Name: {target_table_api['group_name']}")
            print(f"     Waiter Name: {target_table_api['waiter_name']}")
            assert target_table_api["status"] == "OCCUPIED"
            assert target_table_api["group_name"] == "TEST-SEAT-PARTY-VIP"
            assert target_table_api["waiter_name"] is not None

        # 5. TEST C: Attempt duplicate seating
        print("\n3. Testing Duplicate Seating Prevention...")
        dup_rejected = False
        try:
            req_dup = urllib.request.Request(
                f"{BASE_URL}/reservations/{res_id}/seat",
                data=b"",
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req_dup) as resp:
                print("ERROR: Duplicate seating succeeded unexpectedly!")
        except urllib.error.HTTPError as he:
            dup_rejected = True
            body = json.loads(he.read().decode())
            print(f"   Duplicate seating rejected as expected! HTTP {he.code}: '{body.get('detail')}'")
            assert he.code == 409
            assert "This reservation has already been seated." in body.get("detail", "")

        assert dup_rejected, "Duplicate seating must be rejected"

        # Confirm no duplicate customer or allocation was created
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM customer_groups WHERE group_name = 'TEST-SEAT-PARTY-VIP'")
        cust_count = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM allocations WHERE customer_group_id = ?", (cust_id,))
        alloc_count = c.fetchone()[0]
        conn.close()
        print(f"   Integrity check: Customer count={cust_count}, Allocation count={alloc_count}")
        assert cust_count == 1, "Must not create duplicate customer records"
        assert alloc_count == 1, "Must not create duplicate allocation records"

        print(">> TEST B & C PASSED!\n")

    finally:
        # CLEANUP: Safely restore table & waiter, and clean up test fixtures
        print("Cleaning up temporary test records...")
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        if table_id:
            c.execute("UPDATE restaurant_tables SET status = 'AVAILABLE', current_group_id = NULL, current_waiter_id = NULL WHERE id = ?", (table_id,))
        if waiter_id:
            c.execute("UPDATE waiters SET assigned_tables = MAX(0, assigned_tables - 1), workload_score = ROUND(MAX(0.0, (assigned_tables - 1) * 1.0 / max_tables), 2) WHERE id = ?", (waiter_id,))
        if alloc_id:
            c.execute("DELETE FROM allocations WHERE id = ?", (alloc_id,))
        if cust_id:
            c.execute("DELETE FROM customer_groups WHERE id = ?", (cust_id,))
        if res_id:
            c.execute("DELETE FROM reservations WHERE id = ?", (res_id,))
        conn.commit()
        conn.close()
        print("Cleaned up temporary reservation, customer, and allocation fixtures cleanly.\n")

if __name__ == "__main__":
    run_tests()
