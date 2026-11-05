// Complete interactive in-browser simulation engine for GitHub Pages & standalone mode
// Guarantees all buttons, modals, allocations, state transitions, and AI features work seamlessly.

const INITIAL_TABLES = [
  { id: 1, table_number: "T01", capacity: 2, location: "Window", status: "AVAILABLE", is_active: true },
  { id: 2, table_number: "T02", capacity: 2, location: "Window", status: "OCCUPIED", is_active: true, group_name: "Miller Duo", group_size: 2, waiter_name: "Elena Rostova" },
  { id: 3, table_number: "T03", capacity: 4, location: "Main Dining", status: "AVAILABLE", is_active: true },
  { id: 4, table_number: "T04", capacity: 4, location: "Main Dining", status: "OCCUPIED", is_active: true, group_name: "Davis Family", group_size: 4, waiter_name: "Marcus Vance" },
  { id: 5, table_number: "T05", capacity: 4, location: "Booth", status: "RESERVED", is_active: true, group_name: "Victoria Sterling", group_size: 4 },
  { id: 6, table_number: "T06", capacity: 6, location: "Main Dining", status: "AVAILABLE", is_active: true },
  { id: 7, table_number: "T07", capacity: 6, location: "Patio", status: "OCCUPIED", is_active: true, group_name: "Tech Team Lunch", group_size: 5, waiter_name: "Priya Sharma" },
  { id: 8, table_number: "T08", capacity: 8, location: "VIP Lounge", status: "AVAILABLE", is_active: true },
  { id: 9, table_number: "T09", capacity: 2, location: "Patio", status: "CLEANING", is_active: true },
  { id: 10, table_number: "T10", capacity: 4, location: "Booth", status: "AVAILABLE", is_active: true },
  { id: 11, table_number: "T11", capacity: 4, location: "Main Dining", status: "OCCUPIED", is_active: true, group_name: "Chen Party", group_size: 3, waiter_name: "Carlos Gomez" },
  { id: 12, table_number: "T12", capacity: 6, location: "Window", status: "AVAILABLE", is_active: true },
  { id: 13, table_number: "T13", capacity: 2, location: "Bar Area", status: "AVAILABLE", is_active: true },
  { id: 14, table_number: "T14", capacity: 4, location: "Patio", status: "AVAILABLE", is_active: true }
];

const INITIAL_WAITERS = [
  { id: 1, name: "Elena Rostova", availability: true, max_tables: 4, assigned_tables: 2, completed_orders: 14, workload_score: 0.50 },
  { id: 2, name: "Marcus Vance", availability: true, max_tables: 4, assigned_tables: 3, completed_orders: 18, workload_score: 0.75 },
  { id: 3, name: "Priya Sharma", availability: true, max_tables: 4, assigned_tables: 1, completed_orders: 12, workload_score: 0.25 },
  { id: 4, name: "David Kim", availability: true, max_tables: 4, assigned_tables: 0, completed_orders: 9, workload_score: 0.00 },
  { id: 5, name: "Carlos Gomez", availability: true, max_tables: 5, assigned_tables: 2, completed_orders: 16, workload_score: 0.40 },
  { id: 6, name: "Sophia Taylor", availability: true, max_tables: 4, assigned_tables: 1, completed_orders: 11, workload_score: 0.25 }
];

const INITIAL_CUSTOMERS = [
  { id: 1, group_name: "Henderson Group", group_size: 4, arrival_time: "19:15", waiting_minutes: 14, priority: 2, special_requirements: "Booth preferred", status: "WAITING" },
  { id: 2, group_name: "Dr. Aris Thorne", group_size: 2, arrival_time: "19:20", waiting_minutes: 9, priority: 1, special_requirements: "Window seat", status: "WAITING" },
  { id: 3, group_name: "Banquet Celebration", group_size: 6, arrival_time: "19:24", waiting_minutes: 5, priority: 3, special_requirements: "Quiet area", status: "WAITING" },
  { id: 4, group_name: "Wong Walk-in", group_size: 2, arrival_time: "19:27", waiting_minutes: 2, priority: 1, special_requirements: null, status: "WAITING" }
];

const INITIAL_RESERVATIONS = [
  { id: 1, customer_name: "Victoria Sterling", group_size: 4, reservation_date: "2026-11-05", reservation_time: "19:30", special_requests: "Quiet corner", status: "CONFIRMED" },
  { id: 2, customer_name: "Ambassador Rossi", group_size: 6, reservation_date: "2026-11-05", reservation_time: "20:00", special_requests: "VIP Lounge", status: "CONFIRMED" },
  { id: 3, customer_name: "Liam O'Connor", group_size: 2, reservation_date: "2026-11-05", reservation_time: "20:15", special_requests: "Window view", status: "CONFIRMED" },
  { id: 4, customer_name: "Harper Business Dinner", group_size: 8, reservation_date: "2026-11-05", reservation_time: "20:30", special_requests: "Wine pairing service", status: "CONFIRMED" }
];

const INITIAL_POLICIES = [
  { id: 1, policy_name: "Capacity Fit Principle", description: "Groups must be seated at tables where capacity >= group_size, minimizing wasted seats.", category: "ALLOCATION", is_active: true },
  { id: 2, policy_name: "Workload Balancing Policy", description: "Waiters must not exceed their max table limit. Allocation selects waiter with lowest workload score.", category: "WAITER", is_active: true },
  { id: 3, policy_name: "FIFO Queue with Priority Boost", description: "Parties are served in arrival order, with high-priority walk-ins and VIP reservations prioritized.", category: "QUEUE", is_active: true },
  { id: 4, policy_name: "Reservation 15-Minute Grace Window", description: "Reserved tables are held for up to 15 minutes past scheduled time before release.", category: "RESERVATION", is_active: true },
  { id: 5, policy_name: "Sanitation Turnover Protocol", description: "Vacated tables transition to CLEANING state for 5 minutes before becoming AVAILABLE.", category: "ALLOCATION", is_active: true },
  { id: 6, policy_name: "Accessibility First Rule", description: "Guests requiring wheelchair access must be placed at ground-floor tables without steps.", category: "ACCESSIBILITY", is_active: true }
];

// In-memory persistent state across user clicks
let mockTables = JSON.parse(JSON.stringify(INITIAL_TABLES));
let mockWaiters = JSON.parse(JSON.stringify(INITIAL_WAITERS));
let mockCustomers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
let mockReservations = JSON.parse(JSON.stringify(INITIAL_RESERVATIONS));
let mockPolicies = JSON.parse(JSON.stringify(INITIAL_POLICIES));

let mockAllocations = [
  {
    id: 101,
    algorithm: "A_STAR",
    customer_group_id: 1,
    customer_group_name: "Miller Duo",
    table_id: 2,
    allocated_table_number: "T02",
    waiter_id: 1,
    assigned_waiter_name: "Elena Rostova",
    execution_time_ms: 1.4,
    nodes_explored: 8,
    total_cost: 4.0,
    is_optimal: true,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 102,
    algorithm: "A_STAR",
    customer_group_id: 2,
    customer_group_name: "Davis Family",
    table_id: 4,
    allocated_table_number: "T04",
    waiter_id: 2,
    assigned_waiter_name: "Marcus Vance",
    execution_time_ms: 1.2,
    nodes_explored: 7,
    total_cost: 6.5,
    is_optimal: true,
    created_at: new Date(Date.now() - 2400000).toISOString()
  }
];

let mockActivity = [
  { id: 1, title: "A* Allocation: Henderson Party seated at T03", description: "Optimal capacity fit with 0 wasted seats. Waiter Elena assigned.", time: "2m ago" },
  { id: 2, title: "Table T09 Vacated & Cleared", description: "Table transitioned to CLEANING state for sanitation turnover.", time: "6m ago" },
  { id: 3, title: "Party Seated at T07 (Patio)", description: "Tech Team Lunch (5 guests) seated. Server Priya Sharma assigned.", time: "11m ago" },
  { id: 4, title: "Reservation Holding Window Active", description: "Table T05 locked for Victoria Sterling (4 guests).", time: "15m ago" }
];

let mockSimulationHistory = [
  {
    id: 1,
    algorithm: "A_STAR",
    customer_count: 12,
    total_events: 36,
    average_waiting_time: 3.8,
    utilization_percent: 91.5,
    completed_at: "19:45"
  },
  {
    id: 2,
    algorithm: "GREEDY",
    customer_count: 12,
    total_events: 36,
    average_waiting_time: 6.9,
    utilization_percent: 78.0,
    completed_at: "19:15"
  }
];

let simState = {
  state: "IDLE",
  current_time_minutes: 0,
  total_events_processed: 0,
  active_customers_in_system: 4,
  seated_groups_count: 5,
  completed_dining_parties: 12
};

export function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // 1. Health
  if (endpoint.startsWith('/health')) {
    return {
      status: "healthy",
      project: "AI-Based Restaurant Table Allocation and Service Planner",
      version: "1.0.0",
      ai_provider: "In-Browser Multi-Agent Simulation Engine (GitHub Pages)",
      groq_active: true,
      claude_active: false
    };
  }

  // 2. Dashboard Stats
  if (endpoint.startsWith('/dashboard/stats')) {
    const total = mockTables.length;
    const occupied = mockTables.filter(t => t.status === 'OCCUPIED').length;
    const available = mockTables.filter(t => t.status === 'AVAILABLE').length;
    const reserved = mockTables.filter(t => t.status === 'RESERVED').length;
    const cleaning = mockTables.filter(t => t.status === 'CLEANING').length;
    const waiting = mockCustomers.filter(c => c.status === 'WAITING').length;
    const activeWaiters = mockWaiters.filter(w => w.availability).length;
    const utilization = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return {
      total_tables: total,
      occupied_tables: occupied,
      available_tables: available,
      reserved_tables: reserved,
      cleaning_tables: cleaning,
      waiting_customers: waiting,
      active_waiters: activeWaiters,
      average_waiting_time_minutes: 8,
      table_utilization_percent: utilization
    };
  }

  // 3. Dashboard Activity
  if (endpoint.startsWith('/dashboard/activity')) {
    return [...mockActivity];
  }

  // 4. Tables CRUD & State Actions
  // Check reset table: POST /tables/:id/reset
  const resetMatch = endpoint.match(/\/tables\/(\d+)\/reset/);
  if (resetMatch && method === 'POST') {
    const tid = Number(resetMatch[1]);
    const tbl = mockTables.find(t => t.id === tid);
    if (tbl) {
      tbl.status = 'AVAILABLE';
      delete tbl.group_name;
      delete tbl.group_size;
      delete tbl.waiter_name;
      mockActivity.unshift({
        id: Date.now(),
        title: `Table ${tbl.table_number} Reset to AVAILABLE`,
        description: `Sanitation completed. Table ready for immediate seating.`,
        time: "Just now"
      });
      return tbl;
    }
    return { success: true };
  }

  // Check update status: PUT /tables/:id/status
  const statusMatch = endpoint.match(/\/tables\/(\d+)\/status/);
  if (statusMatch && method === 'PUT') {
    const tid = Number(statusMatch[1]);
    const tbl = mockTables.find(t => t.id === tid);
    if (tbl) {
      tbl.status = body.status;
      if (body.status === 'AVAILABLE' || body.status === 'CLEANING') {
        delete tbl.group_name;
        delete tbl.group_size;
        delete tbl.waiter_name;
      }
      mockActivity.unshift({
        id: Date.now(),
        title: `Table ${tbl.table_number} &rarr; ${tbl.status}`,
        description: `Operational state transitioned by floor coordinator.`,
        time: "Just now"
      });
      return tbl;
    }
    return { success: true };
  }

  // General /tables endpoint
  if (endpoint.startsWith('/tables')) {
    const singleMatch = endpoint.match(/\/tables\/(\d+)$/);
    if (singleMatch) {
      const tid = Number(singleMatch[1]);
      if (method === 'GET') {
        const tbl = mockTables.find(t => t.id === tid);
        return tbl || { error: 'Table not found' };
      }
      if (method === 'PUT') {
        const idx = mockTables.findIndex(t => t.id === tid);
        if (idx !== -1) {
          mockTables[idx] = { ...mockTables[idx], ...body };
          return mockTables[idx];
        }
      }
      if (method === 'DELETE') {
        mockTables = mockTables.filter(t => t.id !== tid);
        return { success: true, message: `Table ${tid} removed` };
      }
    }

    if (method === 'GET') {
      const filterMatch = endpoint.match(/status_filter=([^&]+)/);
      if (filterMatch) {
        const stat = decodeURIComponent(filterMatch[1]);
        return mockTables.filter(t => t.status === stat);
      }
      return [...mockTables];
    }

    if (method === 'POST') {
      const newT = {
        id: Date.now(),
        table_number: body.table_number || `T${String(mockTables.length + 1).padStart(2, '0')}`,
        capacity: Number(body.capacity) || 4,
        location: body.location || "Main Dining",
        status: body.status || "AVAILABLE",
        is_active: true
      };
      mockTables.push(newT);
      mockActivity.unshift({
        id: Date.now(),
        title: `New Table ${newT.table_number} Registered`,
        description: `${newT.capacity} seats in ${newT.location}.`,
        time: "Just now"
      });
      return newT;
    }
  }

  // 5. Customers CRUD & Actions
  if (endpoint.startsWith('/customers')) {
    const singleMatch = endpoint.match(/\/customers\/(\d+)$/);
    if (singleMatch) {
      const cid = Number(singleMatch[1]);
      if (method === 'GET') {
        return mockCustomers.find(c => c.id === cid) || {};
      }
      if (method === 'PUT') {
        const idx = mockCustomers.findIndex(c => c.id === cid);
        if (idx !== -1) {
          mockCustomers[idx] = { ...mockCustomers[idx], ...body };
          return mockCustomers[idx];
        }
      }
      if (method === 'DELETE') {
        mockCustomers = mockCustomers.filter(c => c.id !== cid);
        return { success: true, message: `Customer removed` };
      }
    }

    if (method === 'GET') {
      const filterMatch = endpoint.match(/status_filter=([^&]+)/);
      if (filterMatch) {
        const stat = decodeURIComponent(filterMatch[1]);
        return mockCustomers.filter(c => c.status === stat);
      }
      return [...mockCustomers];
    }

    if (method === 'POST') {
      const newC = {
        id: Date.now(),
        group_name: body.group_name || "New Guest Party",
        group_size: Number(body.group_size) || 2,
        arrival_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        waiting_minutes: 0,
        priority: Number(body.priority) || 1,
        special_requirements: body.special_requirements || null,
        status: "WAITING"
      };
      mockCustomers.unshift(newC);
      mockActivity.unshift({
        id: Date.now(),
        title: `Party Arrived: ${newC.group_name}`,
        description: `${newC.group_size} guests placed in waiting queue.`,
        time: "Just now"
      });
      return newC;
    }
  }

  // 6. Waiters CRUD & Actions
  if (endpoint.startsWith('/waiters')) {
    const singleMatch = endpoint.match(/\/waiters\/(\d+)$/);
    if (singleMatch) {
      const wid = Number(singleMatch[1]);
      if (method === 'GET') {
        return mockWaiters.find(w => w.id === wid) || {};
      }
      if (method === 'PUT') {
        const idx = mockWaiters.findIndex(w => w.id === wid);
        if (idx !== -1) {
          mockWaiters[idx] = { ...mockWaiters[idx], ...body };
          return mockWaiters[idx];
        }
      }
      if (method === 'DELETE') {
        mockWaiters = mockWaiters.filter(w => w.id !== wid);
        return { success: true };
      }
    }

    if (method === 'GET') {
      const availMatch = endpoint.match(/available_only=([^&]+)/);
      if (availMatch && availMatch[1] === 'true') {
        return mockWaiters.filter(w => w.availability);
      }
      return [...mockWaiters];
    }

    if (method === 'POST') {
      const newW = {
        id: Date.now(),
        name: body.name || "New Staff Member",
        max_tables: Number(body.max_tables) || 4,
        availability: true,
        assigned_tables: 0,
        completed_orders: 0,
        workload_score: 0.0
      };
      mockWaiters.push(newW);
      return newW;
    }
  }

  // 7. Reservations CRUD & Actions
  if (endpoint.startsWith('/reservations')) {
    const singleMatch = endpoint.match(/\/reservations\/(\d+)$/);
    if (singleMatch) {
      const rid = Number(singleMatch[1]);
      if (method === 'GET') return mockReservations.find(r => r.id === rid) || {};
      if (method === 'PUT') {
        const idx = mockReservations.findIndex(r => r.id === rid);
        if (idx !== -1) {
          mockReservations[idx] = { ...mockReservations[idx], ...body };
          return mockReservations[idx];
        }
      }
      if (method === 'DELETE') {
        mockReservations = mockReservations.filter(r => r.id !== rid);
        return { success: true };
      }
    }

    if (method === 'GET') {
      const dateMatch = endpoint.match(/date_filter=([^&]+)/);
      if (dateMatch) {
        const d = decodeURIComponent(dateMatch[1]);
        return mockReservations.filter(r => r.reservation_date === d);
      }
      return [...mockReservations];
    }

    if (method === 'POST') {
      const newR = {
        id: Date.now(),
        customer_name: body.customer_name || "Guest Booking",
        group_size: Number(body.group_size) || 2,
        reservation_date: body.reservation_date || new Date().toISOString().split('T')[0],
        reservation_time: body.reservation_time || "19:30",
        special_requests: body.special_requests || "Standard Table",
        status: "CONFIRMED"
      };
      mockReservations.push(newR);
      return newR;
    }
  }

  // 8. Policies CRUD
  if (endpoint.startsWith('/policies')) {
    const singleMatch = endpoint.match(/\/policies\/(\d+)$/);
    if (singleMatch) {
      const pid = Number(singleMatch[1]);
      if (method === 'PUT') {
        const idx = mockPolicies.findIndex(p => p.id === pid);
        if (idx !== -1) {
          mockPolicies[idx] = { ...mockPolicies[idx], ...body };
          return mockPolicies[idx];
        }
      }
      if (method === 'DELETE') {
        mockPolicies = mockPolicies.filter(p => p.id !== pid);
        return { success: true };
      }
    }

    if (method === 'GET') return [...mockPolicies];
    if (method === 'POST') {
      const newP = {
        id: Date.now(),
        policy_name: body.policy_name,
        description: body.description,
        category: body.category || "ALLOCATION",
        is_active: body.is_active !== undefined ? body.is_active : true
      };
      mockPolicies.push(newP);
      return newP;
    }
  }

  // 9. AI Table Allocation Engine
  if (endpoint.startsWith('/allocations/run') && method === 'POST') {
    const algo = body.algorithm || 'A_STAR';
    const autoCommit = body.auto_commit !== undefined ? body.auto_commit : true;
    const waitingList = mockCustomers.filter(c => c.status === 'WAITING');

    if (waitingList.length === 0) {
      return {
        successful_allocations: 0,
        total_requested: 0,
        allocations: [],
        message: "No customers in waiting queue."
      };
    }

    const successfulList = [];
    let allocatedCount = 0;

    for (const cust of waitingList) {
      // Find suitable available table
      const candidateTables = mockTables.filter(t => t.status === 'AVAILABLE' && t.capacity >= cust.group_size);
      if (candidateTables.length === 0) continue;

      // Select table based on algorithm strategy
      let chosenTable = candidateTables[0];
      if (algo === 'A_STAR' || algo === 'GREEDY') {
        // Sort by minimal wasted capacity
        candidateTables.sort((a, b) => (a.capacity - cust.group_size) - (b.capacity - cust.group_size));
        chosenTable = candidateTables[0];
      }

      // Pick best waiter with lowest workload
      const availableWaiters = mockWaiters.filter(w => w.availability);
      availableWaiters.sort((a, b) => a.workload_score - b.workload_score);
      const chosenWaiter = availableWaiters[0] || mockWaiters[0];

      // Perform allocation
      const allocationRecord = {
        id: Date.now() + allocatedCount,
        algorithm: algo,
        customer_group_id: cust.id,
        customer_group_name: cust.group_name,
        table_id: chosenTable.id,
        allocated_table_number: chosenTable.table_number,
        waiter_id: chosenWaiter ? chosenWaiter.id : null,
        assigned_waiter_name: chosenWaiter ? chosenWaiter.name : "Unassigned",
        execution_time_ms: algo === 'A_STAR' ? 1.4 : algo === 'GREEDY' ? 0.6 : algo === 'BFS' ? 2.2 : 1.9,
        nodes_explored: algo === 'A_STAR' ? 8 : algo === 'GREEDY' ? 4 : algo === 'BFS' ? 24 : 18,
        total_cost: Math.max(0, chosenTable.capacity - cust.group_size) * 1.5,
        is_optimal: algo === 'A_STAR',
        explanation: `Allocated ${cust.group_name} (${cust.group_size}p) to Table ${chosenTable.table_number} (${chosenTable.capacity} seats, ${chosenTable.location}) using ${algo}. Waiter ${chosenWaiter ? chosenWaiter.name : 'N/A'} assigned.`,
        created_at: new Date().toISOString()
      };

      successfulList.push(allocationRecord);
      mockAllocations.unshift(allocationRecord);
      allocatedCount++;

      if (autoCommit) {
        // Update customer to SEATED
        cust.status = 'SEATED';

        // Update table to OCCUPIED
        chosenTable.status = 'OCCUPIED';
        chosenTable.group_name = cust.group_name;
        chosenTable.group_size = cust.group_size;
        chosenTable.waiter_name = chosenWaiter ? chosenWaiter.name : "Assigned";

        // Update waiter workload
        if (chosenWaiter) {
          chosenWaiter.assigned_tables = (chosenWaiter.assigned_tables || 0) + 1;
          chosenWaiter.workload_score = Number((chosenWaiter.assigned_tables / (chosenWaiter.max_tables || 4)).toFixed(2));
        }

        mockActivity.unshift({
          id: Date.now() + allocatedCount,
          title: `${algo} Allocation: ${cust.group_name} &rarr; ${chosenTable.table_number}`,
          description: `Seated with Waiter ${chosenWaiter ? chosenWaiter.name : 'Staff'}.`,
          time: "Just now"
        });
      }
    }

    return {
      successful_allocations: allocatedCount,
      total_requested: waitingList.length,
      allocations: successfulList,
      algorithm: algo,
      execution_time_ms: algo === 'A_STAR' ? 1.4 : 0.8,
      nodes_explored: algo === 'A_STAR' ? 8 : 4,
      total_cost: 12.5,
      is_optimal: algo === 'A_STAR',
      explanation: `Processed ${allocatedCount} table allocations using ${algo}.`
    };
  }

  // 10. Allocations History
  if (endpoint.startsWith('/allocations') && !endpoint.includes('/compare') && method === 'GET') {
    return [...mockAllocations];
  }

  // 11. Algorithm Comparison
  if (endpoint.startsWith('/allocations/compare')) {
    return [
      {
        algorithm: "A_STAR",
        execution_time_ms: 1.42,
        nodes_explored: 8,
        successful_allocations: 4,
        table_utilization_percent: 88.5,
        total_cost: 14.2,
        is_optimal_claimed: true,
        optimality_explanation: "Guaranteed optimal: Uses admissible heuristic h(n) <= h*(n) that never overestimates remaining cost."
      },
      {
        algorithm: "GREEDY",
        execution_time_ms: 0.58,
        nodes_explored: 4,
        successful_allocations: 4,
        table_utilization_percent: 74.0,
        total_cost: 28.5,
        is_optimal_claimed: false,
        optimality_explanation: "Suboptimal: Locally greedy choice ignoring downstream seating availability and waiter burnout."
      },
      {
        algorithm: "BFS",
        execution_time_ms: 2.34,
        nodes_explored: 28,
        successful_allocations: 4,
        table_utilization_percent: 82.0,
        total_cost: 19.8,
        is_optimal_claimed: false,
        optimality_explanation: "Step-optimal only: Finds shortest path in graph depth but does not optimize non-uniform branch costs."
      },
      {
        algorithm: "DFS",
        execution_time_ms: 2.11,
        nodes_explored: 22,
        successful_allocations: 3,
        table_utilization_percent: 68.0,
        total_cost: 39.4,
        is_optimal_claimed: false,
        optimality_explanation: "Non-optimal: Explores deep arbitrary branches first, frequently settling on high-penalty assignments."
      },
      {
        algorithm: "RULE_BASED",
        execution_time_ms: 0.35,
        nodes_explored: 2,
        successful_allocations: 4,
        table_utilization_percent: 76.5,
        total_cost: 25.0,
        is_optimal_claimed: false,
        optimality_explanation: "Heuristic rule execution: Fast deterministic matching without global optimization guarantees."
      }
    ];
  }

  // 12. Simulation Suite
  if (endpoint.startsWith('/simulation/start') && method === 'POST') {
    const custCount = Number(body.customer_count) || 12;
    const algo = body.algorithm || 'A_STAR';

    simState = {
      state: "COMPLETED",
      current_time_minutes: 60,
      total_events_processed: custCount * 3,
      active_customers_in_system: 2,
      seated_groups_count: custCount,
      completed_dining_parties: custCount
    };

    const newSimRecord = {
      id: Date.now(),
      algorithm: algo,
      customer_count: custCount,
      total_events: custCount * 3,
      average_waiting_time: algo === 'A_STAR' ? 3.8 : algo === 'GREEDY' ? 7.1 : 5.4,
      utilization_percent: algo === 'A_STAR' ? 92.4 : 76.0,
      completed_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    mockSimulationHistory.unshift(newSimRecord);

    mockActivity.unshift({
      id: Date.now(),
      title: `Multi-Agent Simulation Completed (${algo})`,
      description: `Processed ${custCount} parties across 60 simulated minutes.`,
      time: "Just now"
    });

    return { ...simState };
  }

  if (endpoint.startsWith('/simulation/status')) {
    return { ...simState };
  }

  if (endpoint.startsWith('/simulation/history')) {
    return [...mockSimulationHistory];
  }

  if (endpoint.startsWith('/simulation/pause') || endpoint.startsWith('/simulation/resume') || endpoint.startsWith('/simulation/step') || endpoint.startsWith('/simulation/reset')) {
    if (endpoint.includes('reset')) {
      simState.current_time_minutes = 0;
      simState.total_events_processed = 0;
      simState.state = "IDLE";
    }
    return { ...simState };
  }

  // 13. AI Assistant
  if (endpoint.startsWith('/ai/chat')) {
    const q = (body.message || "").toLowerCase();
    const availableTables = mockTables.filter(t => t.status === "AVAILABLE");
    const occupiedTables = mockTables.filter(t => t.status === "OCCUPIED");
    const waitingList = mockCustomers.filter(c => c.status === "WAITING");
    const busiestWaiter = [...mockWaiters].sort((a,b) => b.workload_score - a.workload_score)[0];

    if (q.includes("available") || q.includes("free")) {
      return {
        reply: `There are currently ${availableTables.length} available tables ready for immediate seating: ${availableTables.map(t => `${t.table_number} (${t.capacity}p in ${t.location})`).join(', ')}.`,
        sources: ["table_allocation_policy.md"],
        relevant_info: [`Available tables: ${availableTables.length}`, `Total capacity: ${availableTables.reduce((acc, t) => acc + t.capacity, 0)} guests`],
        suggested_action: "Run A* Allocation to seat waiting walk-ins.",
        is_fallback: false
      };
    }

    if (q.includes("waiter") || q.includes("workload") || q.includes("staff")) {
      return {
        reply: `Waiter ${busiestWaiter.name} currently carries the highest workload score (${busiestWaiter.workload_score.toFixed(2)}) with ${busiestWaiter.assigned_tables} assigned tables. Server David Kim has zero assigned tables and is next in line for new parties.`,
        sources: ["waiter_assignment_policy.md"],
        relevant_info: [`Busiest: ${busiestWaiter.name}`, `Active staff: ${mockWaiters.filter(w => w.availability).length}`],
        suggested_action: "Assign next incoming table to David Kim or Priya Sharma.",
        is_fallback: false
      };
    }

    if (q.includes("recommend") || q.includes("seat") || q.includes("seven") || q.includes("party")) {
      return {
        reply: `For large parties (6-8 guests), Table T08 (VIP Lounge, 8 seats) or Table T06 (Main Dining, 6 seats) offer optimal comfort with minimum capacity waste. For couples, Window tables T01 and T12 provide scenic outdoor views.`,
        sources: ["table_allocation_policy.md", "accessibility_guidelines.md"],
        relevant_info: ["VIP Table T08 available", "Ground level accessible: T01, T03, T06"],
        suggested_action: "Reserve Table T08 or trigger A* Allocation.",
        is_fallback: false
      };
    }

    return {
      reply: `Saffron & Sage operational rules dictate that all seating assignments minimize wasted seat capacity while enforcing waiter workload limits. Currently, ${availableTables.length} tables are available and ${waitingList.length} parties are waiting in queue. All table state transitions are protected by our 5-state lifecycle Finite State Machine.`,
      sources: ["table_allocation_policy.md", "reservation_policy.md"],
      relevant_info: ["Admissible heuristic active", "Capacity fit verified"],
      suggested_action: "Review customer queue or run AI Search benchmark.",
      is_fallback: false
    };
  }

  // 14. Reset Database
  if (endpoint.startsWith('/system/reset-db')) {
    mockTables = JSON.parse(JSON.stringify(INITIAL_TABLES));
    mockWaiters = JSON.parse(JSON.stringify(INITIAL_WAITERS));
    mockCustomers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
    mockReservations = JSON.parse(JSON.stringify(INITIAL_RESERVATIONS));
    mockPolicies = JSON.parse(JSON.stringify(INITIAL_POLICIES));
    mockActivity = [
      { id: Date.now(), title: "System Database Re-Seeded", description: "All tables, staff, and queues restored to initial benchmark state.", time: "Just now" }
    ];
    return { success: true, message: "Database re-seeded successfully" };
  }

  // 15. Analytics
  if (endpoint.startsWith('/analytics/overview')) {
    return {
      total_active_tables: mockTables.length,
      total_waiters: mockWaiters.length,
      total_customers_served: 48,
      section_utilization: [
        { section: "Main Dining", occupancy_rate: 75 },
        { section: "Window", occupancy_rate: 66 },
        { section: "Patio", occupancy_rate: 80 },
        { section: "Booth", occupancy_rate: 50 },
        { section: "VIP Lounge", occupancy_rate: 40 },
        { section: "Bar Area", occupancy_rate: 60 }
      ],
      hourly_traffic: [
        { time: "17:00", arrivals: 6 },
        { time: "18:00", arrivals: 14 },
        { time: "19:00", arrivals: 22 },
        { time: "20:00", arrivals: 19 },
        { time: "21:00", arrivals: 11 },
        { time: "22:00", arrivals: 5 }
      ]
    };
  }

  if (endpoint.startsWith('/analytics/algorithms')) {
    return [
      { algorithm: "A_STAR", average_execution_time_ms: 1.4, allocation_success_rate: 98.5, average_waiting_time: 4.2 },
      { algorithm: "GREEDY", average_execution_time_ms: 0.6, allocation_success_rate: 89.0, average_waiting_time: 7.1 },
      { algorithm: "BFS", average_execution_time_ms: 2.3, allocation_success_rate: 92.0, average_waiting_time: 5.8 },
      { algorithm: "DFS", average_execution_time_ms: 2.1, allocation_success_rate: 78.5, average_waiting_time: 11.4 },
      { algorithm: "RULE_BASED", average_execution_time_ms: 0.3, allocation_success_rate: 86.0, average_waiting_time: 8.0 }
    ];
  }

  if (endpoint.startsWith('/analytics/waiter-performance')) {
    return [...mockWaiters];
  }

  return { success: true, message: "Operation simulated successfully" };
}
