# Table Allocation Policy

## 1. Capacity Fit Principle
- Customer groups must be allocated to tables that have a seating capacity equal to or greater than the group size.
- To prevent capacity waste, the system selects the smallest table capable of accommodating the group (e.g., a party of 2 should be assigned a 2-top or 4-top, never an 8-top unless no other table exists).
- Under-seating (placing more customers at a table than its designated capacity) is strictly prohibited due to dining comfort and fire safety regulations.

## 2. Table Status Requirements
- Tables eligible for immediate allocation must be in `AVAILABLE` status.
- Tables currently in `OCCUPIED`, `RESERVED`, or `CLEANING` status cannot be allocated to walk-in customer groups.
- A table transitioning from `OCCUPIED` enters `CLEANING` status for a standard duration (typically 5 to 10 minutes) before becoming `AVAILABLE`.

## 3. Simultaneous Seating Rule
- Each table can only serve one customer group at any given time. Multi-party shared seating is not permitted without explicit customer authorization.

## 4. Location Preferences
- Window, patio, and booth seating should be honored when requested, provided suitable tables in those zones are available and match party capacity.
