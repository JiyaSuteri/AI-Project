import sqlite3

def run_cleanup():
    conn = sqlite3.connect('backend/restaurant_planner.db')
    c = conn.cursor()

    try:
        print('Starting cleanup transaction on restaurant_planner.db...')
        
        # 1. Clean Allocations 1-3 (and 9 which referenced demo customer 6)
        c.execute('DELETE FROM allocations WHERE id IN (1, 2, 3, 9)')
        alloc_deleted = c.rowcount
        print(f'Deleted {alloc_deleted} demo allocation records.')

        # 2. Clean Reservations 1-6
        c.execute('DELETE FROM reservations WHERE id IN (1, 2, 3, 4, 5, 6)')
        res_deleted = c.rowcount
        print(f'Deleted {res_deleted} demo reservation records.')

        # 3. Clean Customer Groups 1-12
        c.execute('DELETE FROM customer_groups WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)')
        cust_deleted = c.rowcount
        print(f'Deleted {cust_deleted} demo customer group records.')

        # 4. Clean Table references: Reset tables that pointed to demo customers or had NULL group
        c.execute("""
            UPDATE restaurant_tables
            SET status = 'AVAILABLE',
                current_group_id = NULL,
                current_waiter_id = NULL
            WHERE id IN (1, 2, 3, 6, 7, 12)
        """)
        tables_freed = c.rowcount
        print(f'Reset {tables_freed} tables to AVAILABLE (T01, T02, T03, T06, T07, T12).')

        # 5. Recalculate waiter workloads
        c.execute('SELECT id, max_tables, name FROM waiters')
        waiters = c.fetchall()
        for w_id, max_t, name in waiters:
            c.execute("SELECT COUNT(*) FROM restaurant_tables WHERE current_waiter_id = ? AND status = 'OCCUPIED'", (w_id,))
            assigned = c.fetchone()[0]
            score = round(assigned / max(1, max_t), 2)
            c.execute('UPDATE waiters SET assigned_tables = ?, workload_score = ? WHERE id = ?', (assigned, score, w_id))
            print(f'Waiter {name}: assigned = {assigned}/{max_t}, score = {score}')

        conn.commit()
        print('\nCleanup transaction successfully committed to SQLite database!')
    except Exception as e:
        conn.rollback()
        print('ERROR - rolled back transaction:', e)
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    run_cleanup()
