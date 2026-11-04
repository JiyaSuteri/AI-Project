# Waiter Assignment & Workload Policy

## 1. Capacity Limits & Fair Workload Distribution
- Each service waiter is assigned a maximum concurrent table threshold (default: 4 tables per waiter).
- Waiters must be in `AVAILABLE` status to receive new table assignments.
- The manager agent and allocation algorithms prioritize the available waiter with the lowest current workload score.
- Workload score is determined by:
  `workload = (currently_assigned_tables / max_tables) * 0.7 + (active_seated_guests / 16) * 0.3`

## 2. Waiter Station Boundaries
- If section-based zoning is enforced, waiters are preferentially assigned to tables within their primary station (Main Dining, Patio, Booth Zone).
- In cross-station spillover scenarios, a waiter from an adjacent station may be assigned if their workload is below 60%.

## 3. Turnover & Relief
- When all tables of a waiter complete service, the waiter undergoes a 5-minute station review or reset before taking high-density rush groups.
