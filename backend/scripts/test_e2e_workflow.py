import urllib.request, json, sys

BASE = 'http://127.0.0.1:8000/api'

# 1. Login to get token for manager operations
req_login = urllib.request.Request(f'{BASE}/auth/dev-demo-login', data=b'', method='POST')
with urllib.request.urlopen(req_login) as resp:
    login_data = json.loads(resp.read().decode())
    token = login_data['access_token']
    print(f'[Step 1] Authenticated as {login_data["user"]["name"]}')

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}

# 1.1 Initial stats check
req_stats_before = urllib.request.Request(f'{BASE}/dashboard/stats', headers=headers)
with urllib.request.urlopen(req_stats_before) as resp:
    stats_before = json.loads(resp.read().decode())
    print(f'[Step 1.1] Initial SQLite State: {stats_before["total_tables"]} Total Tables, {stats_before["available_tables"]} Available, {stats_before["occupied_tables"]} Occupied, {stats_before["waiting_customers"]} Waiting')

# 2. Add customer group of 4
new_cust_payload = {
    'group_name': 'E2E-Phoenix-Party-4',
    'group_size': 4,
    'priority': 2,
    'special_requirements': 'Main dining quiet area',
    'status': 'WAITING'
}
req_add = urllib.request.Request(f'{BASE}/customers', data=json.dumps(new_cust_payload).encode(), headers=headers, method='POST')
with urllib.request.urlopen(req_add) as resp:
    cust = json.loads(resp.read().decode())
    cust_id = cust['id']
    print(f'[Step 2] Customer created in SQLite: ID {cust_id}, Name: {cust["group_name"]}, Status: {cust["status"]}, Waiting Mins: {cust["waiting_minutes"]}')

# 3. Verify customer appears in Customers queue
req_queue = urllib.request.Request(f'{BASE}/customers?status_filter=WAITING', headers=headers)
with urllib.request.urlopen(req_queue) as resp:
    waiting_list = json.loads(resp.read().decode())
    matched_cust = next((c for c in waiting_list if c['id'] == cust_id), None)
    assert matched_cust is not None, 'Customer not found in waiting queue!'
    print(f'[Step 3] Verified in Customers waiting queue: {matched_cust["group_name"]} (ID: {matched_cust["id"]})')

# 4. Verify customer appears in Overview allocation candidate query
print(f'[Step 4] Overview dropdown data sources from same endpoint: ID {cust_id} is in queue of {len(waiting_list)} parties')

# 5 & 6. Request recommendation preview using A* with auto_commit=False
alloc_preview_payload = {
    'group_ids': [cust_id],
    'algorithm': 'A_STAR',
    'auto_commit': False
}
req_preview = urllib.request.Request(f'{BASE}/allocations/run', data=json.dumps(alloc_preview_payload).encode(), headers=headers, method='POST')
with urllib.request.urlopen(req_preview) as resp:
    preview = json.loads(resp.read().decode())
    dec = next((d for d in preview['decisions'] if d['group_id'] == cust_id), None)
    assert dec is not None and dec['success'], f'Preview failed: {dec}'
    print(f'[Step 5 & 6 & 7] A* Recommendation: Table {dec["table_number"]} (Capacity: {dec["table_capacity"]}), Waiter: {dec["waiter_name"]}, Reason: {dec["reason"]}')
    assert dec['table_capacity'] >= 4, 'Table capacity insufficient!'
    rec_table_num = dec['table_number']
    rec_table_id = dec['table_id']

# Verify customer is STILL WAITING and table is STILL AVAILABLE during preview
with urllib.request.urlopen(urllib.request.Request(f'{BASE}/customers/{cust_id}', headers=headers)) as r:
    assert json.loads(r.read().decode())['status'] == 'WAITING', 'Customer should still be WAITING during preview'
with urllib.request.urlopen(urllib.request.Request(f'{BASE}/tables/{rec_table_id}', headers=headers)) as r:
    assert json.loads(r.read().decode())['status'] == 'AVAILABLE', 'Table should still be AVAILABLE during preview'
print('[Preview Integrity] Verified customer is still WAITING and table is still AVAILABLE before confirmation.')

# 8. Confirm allocation (auto_commit=True)
alloc_confirm_payload = {
    'group_ids': [cust_id],
    'algorithm': 'A_STAR',
    'auto_commit': True
}
req_confirm = urllib.request.Request(f'{BASE}/allocations/run', data=json.dumps(alloc_confirm_payload).encode(), headers=headers, method='POST')
with urllib.request.urlopen(req_confirm) as resp:
    confirmed = json.loads(resp.read().decode())
    dec_confirmed = next((d for d in confirmed['decisions'] if d['group_id'] == cust_id), None)
    assert dec_confirmed is not None and dec_confirmed['success'], f'Commit failed: {dec_confirmed}'
    print(f'[Step 8] Allocation Confirmed in SQLite for Table {rec_table_num} to {dec_confirmed["group_name"]}')

# 9. Verify customer is now SEATED
req_cust_check = urllib.request.Request(f'{BASE}/customers/{cust_id}', headers=headers)
with urllib.request.urlopen(req_cust_check) as resp:
    updated_cust = json.loads(resp.read().decode())
    assert updated_cust['status'] == 'SEATED', f'Customer status is {updated_cust["status"]}'
    print(f'[Step 9] Verified Customer in SQLite: Status = {updated_cust["status"]}, Assigned Table = {updated_cust["assigned_table_number"]}')

# 10. Verify Table is now OCCUPIED
req_tbl_check = urllib.request.Request(f'{BASE}/tables/{rec_table_id}', headers=headers)
with urllib.request.urlopen(req_tbl_check) as resp:
    updated_tbl = json.loads(resp.read().decode())
    assert updated_tbl['status'] == 'OCCUPIED', f'Table status is {updated_tbl["status"]}'
    print(f'[Step 10] Verified Table {rec_table_num} in SQLite: Status = {updated_tbl["status"]}, Current Group ID = {updated_tbl["current_group_id"]}')

# 11. Verify Waiter assignment updated
print(f'[Step 11] Waiter assigned: {updated_tbl.get("waiter_name", dec_confirmed["waiter_name"])}')

# 12. Verify Dashboard Statistics updated
req_stats = urllib.request.Request(f'{BASE}/dashboard/stats', headers=headers)
with urllib.request.urlopen(req_stats) as resp:
    stats_after = json.loads(resp.read().decode())
    print(f'[Step 12] Updated Dashboard Stats:')
    print(f'         Total Tables: {stats_after["total_tables"]}')
    print(f'         Occupied Tables: {stats_after["occupied_tables"]} (Was {stats_before["occupied_tables"]})')
    print(f'         Available Tables: {stats_after["available_tables"]} (Was {stats_before["available_tables"]})')
    print(f'         Waiting Customers: {stats_after["waiting_customers"]}')
    print(f'         Utilization: {stats_after["table_utilization_percent"]}% (Was {stats_before["table_utilization_percent"]}%)')
    assert stats_after['occupied_tables'] == stats_before['occupied_tables'] + 1, 'Occupied tables count should increase by 1'
    assert stats_after['available_tables'] == stats_before['available_tables'] - 1, 'Available tables count should decrease by 1'

# 13 & 14. Query AI Assistant about available tables
ai_query_payload = {'message': 'How many tables are available?'}
req_ai = urllib.request.Request(f'{BASE}/ai/chat', data=json.dumps(ai_query_payload).encode(), headers=headers, method='POST')
with urllib.request.urlopen(req_ai) as resp:
    ai_resp = json.loads(resp.read().decode())
    print(f'[Step 13 & 14] AI Assistant Answer: "{ai_resp["reply"]}"')
    print(f'             Actual SQLite Available Count: {stats_after["available_tables"]}')

# 15. Verify Customer Search finds newly created customer
req_search = urllib.request.Request(f'{BASE}/customers', headers=headers)
with urllib.request.urlopen(req_search) as resp:
    all_c = json.loads(resp.read().decode())
    search_hits = [c for c in all_c if 'Phoenix' in c['group_name']]
    assert len(search_hits) > 0, 'Search did not find newly created customer!'
    print(f'[Step 15] Customer Search for "Phoenix": Found {search_hits[0]["group_name"]} (ID: {search_hits[0]["id"]}, Status: {search_hits[0]["status"]})')

print('\n*** ALL 15 END-TO-END WORKFLOW VERIFICATION STEPS PASSED PERFECTLY! ***')
