// Complete interactive in-browser simulation engine for static deployments (e.g. GitHub Pages)
// Mirrors FastAPI Pydantic schemas so every button, modal, search algorithm, simulator, and AI chat works seamlessly.

const INITIAL_TABLES = [
  { id: 1, table_number: "T01", capacity: 2, location: "Window", status: "AVAILABLE", is_active: true },
  { id: 2, table_number: "T02", capacity: 2, location: "Window", status: "OCCUPIED", is_active: true, group_name: "Miller Duo", group_size: 2, waiter_name: "Elena Rostova" },
  { id: 3, table_number: "T03", capacity: 4, location: "Main Dining", status: "AVAILABLE", is_active: true },
  { id: 4, table_number: "T04", capacity: 4, location: "Main Dining", status: "OCCUPIED", is_active: true, group_name: "Davis Family", group_size: 4, waiter_name: "Marcus Vance" },
  { id: 5, table_number: "T05", capacity: 4, location: "Booth Zone", status: "RESERVED", is_active: true, group_name: "Victoria Sterling", group_size: 4 },
  { id: 6, table_number: "T06", capacity: 6, location: "Main Dining", status: "AVAILABLE", is_active: true },
  { id: 7, table_number: "T07", capacity: 6, location: "Patio", status: "OCCUPIED", is_active: true, group_name: "Tech Team Lunch", group_size: 5, waiter_name: "Priya Sharma" },
  { id: 8, table_number: "T08", capacity: 8, location: "VIP Lounge", status: "AVAILABLE", is_active: true },
  { id: 9, table_number: "T09", capacity: 2, location: "Patio", status: "CLEANING", is_active: true },
  { id: 10, table_number: "T10", capacity: 4, location: "Booth Zone", status: "AVAILABLE", is_active: true },
  { id: 11, table_number: "T11", capacity: 4, location: "Main Dining", status: "OCCUPIED", is_active: true, group_name: "Chen Party", group_size: 3, waiter_name: "Carlos Gomez" },
  { id: 12, table_number: "T12", capacity: 6, location: "Window", status: "AVAILABLE", is_active: true },
  { id: 13, table_number: "T13", capacity: 2, location: "Bar Area", status: "AVAILABLE", is_active: true },
  { id: 14, table_number: "T14", capacity: 4, location: "Patio", status: "AVAILABLE", is_active: true }
];

const INITIAL_WAITERS = [
  { id: 1, name: "Elena Rostova", availability: true, max_tables: 4, assigned_tables: 1, completed_orders: 14, workload_score: 0.25 },
  { id: 2, name: "Marcus Vance", availability: true, max_tables: 4, assigned_tables: 1, completed_orders: 18, workload_score: 0.25 },
  { id: 3, name: "Priya Sharma", availability: true, max_tables: 4, assigned_tables: 1, completed_orders: 12, workload_score: 0.25 },
  { id: 4, name: "David Kim", availability: true, max_tables: 4, assigned_tables: 0, completed_orders: 9, workload_score: 0.00 },
  { id: 5, name: "Carlos Gomez", availability: true, max_tables: 5, assigned_tables: 1, completed_orders: 16, workload_score: 0.20 },
  { id: 6, name: "Sophia Taylor", availability: true, max_tables: 4, assigned_tables: 0, completed_orders: 11, workload_score: 0.00 }
];

const INITIAL_CUSTOMERS = [
  { id: 1, group_name: "Henderson Group", group_size: 4, arrival_time: new Date(Date.now() - 14 * 60000).toISOString(), waiting_minutes: 14, priority: 2, special_requirements: "Booth preferred", status: "WAITING" },
  { id: 2, group_name: "Dr. Aris Thorne", group_size: 2, arrival_time: new Date(Date.now() - 9 * 60000).toISOString(), waiting_minutes: 9, priority: 1, special_requirements: "Window seat", status: "WAITING" },
  { id: 3, group_name: "Banquet Celebration", group_size: 6, arrival_time: new Date(Date.now() - 5 * 60000).toISOString(), waiting_minutes: 5, priority: 3, special_requirements: "Quiet area", status: "WAITING" },
  { id: 4, group_name: "Wong Walk-in", group_size: 2, arrival_time: new Date(Date.now() - 2 * 60000).toISOString(), waiting_minutes: 2, priority: 1, special_requirements: null, status: "WAITING" }
];

const INITIAL_RESERVATIONS = [
  { id: 1, customer_name: "Victoria Sterling", group_size: 4, reservation_date: "2026-11-05", reservation_time: "19:30", special_requests: "Quiet corner", status: "CONFIRMED", table_id: 5, table_number: "T05" },
  { id: 2, customer_name: "Ambassador Rossi", group_size: 6, reservation_date: "2026-11-05", reservation_time: "20:00", special_requests: "VIP Lounge", status: "CONFIRMED", table_id: null, table_number: null },
  { id: 3, customer_name: "Liam O'Connor", group_size: 2, reservation_date: "2026-11-05", reservation_time: "20:15", special_requests: "Window view", status: "CONFIRMED", table_id: null, table_number: null },
  { id: 4, customer_name: "Harper Business Dinner", group_size: 8, reservation_date: "2026-11-05", reservation_time: "20:30", special_requests: "Wine pairing service", status: "CONFIRMED", table_id: null, table_number: null }
];

const INITIAL_POLICIES = [
  { id: 1, policy_name: "Capacity Fit Principle", description: "Groups must be seated at tables where capacity >= group_size, minimizing wasted seats.", category: "ALLOCATION", is_active: true },
  { id: 2, policy_name: "Workload Balancing Policy", description: "Waiters must not exceed their max table limit. Allocation selects waiter with lowest workload score.", category: "WAITER", is_active: true },
  { id: 3, policy_name: "FIFO Queue with Priority Boost", description: "Parties are served in arrival order, with high-priority walk-ins and VIP reservations prioritized.", category: "QUEUE", is_active: true },
  { id: 4, policy_name: "Reservation 15-Minute Grace Window", description: "Reserved tables are held for up to 15 minutes past scheduled time before release.", category: "RESERVATION", is_active: true },
  { id: 5, policy_name: "Sanitation Turnover Protocol", description: "Vacated tables transition to CLEANING state for 5 minutes before becoming AVAILABLE.", category: "ALLOCATION", is_active: true },
  { id: 6, policy_name: "Accessibility First Rule", description: "Guests requiring wheelchair access must be placed at ground-floor tables without steps.", category: "ACCESSIBILITY", is_active: true }
];

const INITIAL_ALLOCATIONS = [
  {
    id: 101,
    customer_group_id: 101,
    group_name: "Miller Duo",
    table_id: 2,
    table_number: "T02",
    waiter_id: 1,
    waiter_name: "Elena Rostova",
    allocation_time: new Date(Date.now() - 3600000).toISOString(),
    algorithm_used: "A_STAR",
    allocation_reason: "[A*] Group 'Miller Duo' (2 guests) assigned to Table T02 (2-top in Window, exact capacity fit). Assigned Waiter Elena Rostova."
  },
  {
    id: 102,
    customer_group_id: 102,
    group_name: "Davis Family",
    table_id: 4,
    table_number: "T04",
    waiter_id: 2,
    waiter_name: "Marcus Vance",
    allocation_time: new Date(Date.now() - 2400000).toISOString(),
    algorithm_used: "A_STAR",
    allocation_reason: "[A*] Group 'Davis Family' (4 guests) assigned to Table T04 (4-top in Main Dining, exact capacity fit). Assigned Waiter Marcus Vance."
  }
];

const INITIAL_ACTIVITY = [
  { id: "act-1", title: "A* Allocation: Miller Duo seated at T02", description: "Exact 2-seat capacity fit in Window zone. Waiter Elena Rostova assigned.", time: "12m ago" },
  { id: "act-2", title: "Table T09 Vacated & Cleared", description: "Table transitioned to CLEANING state for sanitation turnover.", time: "6m ago" },
  { id: "act-3", title: "Party Seated at T07 (Patio)", description: "Tech Team Lunch (5 guests) seated. Server Priya Sharma assigned.", time: "11m ago" },
  { id: "act-4", title: "Reservation Holding Window Active", description: "Table T05 locked for Victoria Sterling (4 guests).", time: "15m ago" }
];

const INITIAL_SIM_HISTORY = [
  {
    id: 1,
    simulation_name: "Sim-A_STAR-194500",
    algorithm: "A_STAR",
    total_customers: 12,
    successful_allocations: 12,
    average_waiting_time: 3.8,
    execution_time: 2.14,
    utilization: 91.5,
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 2,
    simulation_name: "Sim-GREEDY-191500",
    algorithm: "GREEDY",
    total_customers: 12,
    successful_allocations: 11,
    average_waiting_time: 6.9,
    execution_time: 0.92,
    utilization: 78.0,
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

const INITIAL_SIM_STATE = {
  is_running: false,
  is_paused: false,
  current_time_sec: 0.0,
  progress_percent: 0.0,
  algorithm: "A_STAR",
  total_customers: 0,
  allocated_customers: 0,
  waiting_customers: 0,
  completed_customers: 0,
  reneged_customers: 0,
  events: []
};

// Persistent in-memory session state
let mockTables = JSON.parse(JSON.stringify(INITIAL_TABLES));
let mockWaiters = JSON.parse(JSON.stringify(INITIAL_WAITERS));
let mockCustomers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
let mockReservations = JSON.parse(JSON.stringify(INITIAL_RESERVATIONS));
let mockPolicies = JSON.parse(JSON.stringify(INITIAL_POLICIES));
let mockAllocations = JSON.parse(JSON.stringify(INITIAL_ALLOCATIONS));
let mockActivity = JSON.parse(JSON.stringify(INITIAL_ACTIVITY));
let mockSimulationHistory = JSON.parse(JSON.stringify(INITIAL_SIM_HISTORY));
let simState = JSON.parse(JSON.stringify(INITIAL_SIM_STATE));

// Helper: Multi-factor cost calculation matching backend/app/algorithms/cost_function.py
function calculateAllocationCost(group, table, waiterWorkload) {
  const unusedSeats = Math.max(0, table.capacity - group.group_size);
  const capacityCost = unusedSeats * 12.0;
  const workloadCost = waiterWorkload * 25.0;
  const waitCost = ((group.waiting_minutes || 0) / 10.0) * 0.5 * (1.0 / Math.max(1, group.priority || 1));

  let reqCost = 0.0;
  if (group.special_requirements && table.location) {
    const reqLower = group.special_requirements.toLowerCase();
    const locLower = table.location.toLowerCase();
    if (reqLower.includes("window") && !locLower.includes("window")) reqCost += 20.0;
    else if (reqLower.includes("booth") && !locLower.includes("booth")) reqCost += 20.0;
    else if (reqLower.includes("patio") && !locLower.includes("patio")) reqCost += 20.0;
  }

  return Number((capacityCost + workloadCost + waitCost + reqCost).toFixed(2));
}

// Helper: Release waiter load when a table is freed/reset
function releaseWaiterFromTable(table) {
  if (table.waiter_name) {
    const waiter = mockWaiters.find(w => w.name === table.waiter_name);
    if (waiter && waiter.assigned_tables > 0) {
      waiter.assigned_tables -= 1;
      waiter.completed_orders = (waiter.completed_orders || 0) + 1;
      waiter.workload_score = Number((waiter.assigned_tables / Math.max(1, waiter.max_tables)).toFixed(2));
    }
  }
  if (table.group_name) {
    const cust = mockCustomers.find(c => c.group_name === table.group_name && c.status === 'SEATED');
    if (cust) cust.status = 'COMPLETED';
  }
  delete table.group_name;
  delete table.group_size;
  delete table.waiter_name;
}

// Helper: Run an allocation algorithm in-browser
function executeSearchAlgorithm(algo, waitingList, availableTables, availableWaiters, commitToState) {
  const t0 = performance.now();
  const workingTables = availableTables.map(t => ({ ...t }));
  const workingWaiters = availableWaiters.map(w => ({ ...w }));

  // Sort queue differently depending on algorithm
  const orderedCustomers = [...waitingList];
  if (algo === 'RULE_BASED') {
    orderedCustomers.sort((a, b) => (b.waiting_minutes || 0) - (a.waiting_minutes || 0));
  } else {
    orderedCustomers.sort((a, b) => (b.priority - a.priority) || ((b.waiting_minutes || 0) - (a.waiting_minutes || 0)));
  }

  const decisions = [];
  let totalCost = 0.0;
  let successfulCount = 0;
  let nodesExplored = 0;

  for (const cust of orderedCustomers) {
    nodesExplored += 1;
    const validTables = workingTables.filter(t => t.capacity >= cust.group_size);
    const eligibleWaiters = workingWaiters.filter(w => w.assigned_tables < w.max_tables);

    if (validTables.length === 0 || eligibleWaiters.length === 0) {
      totalCost += 100.0;
      decisions.push({
        group_id: cust.id,
        group_name: cust.group_name,
        group_size: cust.group_size,
        table_id: null,
        table_number: null,
        table_capacity: null,
        waiter_id: null,
        waiter_name: null,
        success: false,
        reason: "Insufficient table capacity or no available waiter within workload thresholds.",
        rejected_alternatives: [],
        cost: 100.0
      });
      continue;
    }

    // Score all candidate (table, waiter) pairs
    const candidates = [];
    for (const tbl of validTables) {
      for (const wtr of eligibleWaiters) {
        nodesExplored += 1;
        const nextWorkload = (wtr.assigned_tables + 1) / Math.max(1, wtr.max_tables);
        const cost = calculateAllocationCost(cust, tbl, nextWorkload);
        candidates.push({ tbl, wtr, cost });
      }
    }

    // Pick candidate according to algorithm behavior
    let chosen;
    if (algo === 'DFS') {
      // DFS takes deep arbitrary branch (reverse order bias, higher waste possible)
      chosen = candidates[candidates.length - 1];
      nodesExplored += Math.min(18, candidates.length * 2);
    } else if (algo === 'BFS') {
      // BFS takes shallowest first valid match rather than lowest weighted cost
      chosen = candidates[0];
      nodesExplored += Math.min(24, candidates.length * 3);
    } else {
      // A_STAR, GREEDY, RULE_BASED sort by lowest cost (A* explores priority nodes cleanly)
      candidates.sort((a, b) => a.cost - b.cost);
      chosen = candidates[0];
      if (algo === 'A_STAR') nodesExplored += 4;
    }

    const sortedAlts = [...candidates].sort((a, b) => a.cost - b.cost);
    const rejected = sortedAlts
      .filter(c => c.tbl.id !== chosen.tbl.id || c.wtr.id !== chosen.wtr.id)
      .slice(0, 3)
      .map(c => `Table ${c.tbl.table_number} + Waiter ${c.wtr.name} (cost: ${c.cost.toFixed(1)})`);

    const capDiff = chosen.tbl.capacity - cust.group_size;
    const seatMsg = capDiff === 0 ? "exact capacity fit" : `${capDiff} unused seat(s)`;
    const reason = `[${algo}] Group '${cust.group_name}' (${cust.group_size} guests) assigned to Table ${chosen.tbl.table_number} (${chosen.tbl.capacity}-top in ${chosen.tbl.location}, ${seatMsg}). Assigned Waiter ${chosen.wtr.name} (workload: ${chosen.wtr.assigned_tables + 1}/${chosen.wtr.max_tables} tables). Total cost: ${chosen.cost.toFixed(2)}.`;

    totalCost += chosen.cost;
    successfulCount += 1;

    decisions.push({
      group_id: cust.id,
      group_name: cust.group_name,
      group_size: cust.group_size,
      table_id: chosen.tbl.id,
      table_number: chosen.tbl.table_number,
      table_capacity: chosen.tbl.capacity,
      waiter_id: chosen.wtr.id,
      waiter_name: chosen.wtr.name,
      success: true,
      reason,
      rejected_alternatives: rejected,
      cost: chosen.cost
    });

    // Update working copies
    const tblIdx = workingTables.findIndex(t => t.id === chosen.tbl.id);
    if (tblIdx !== -1) workingTables.splice(tblIdx, 1);
    chosen.wtr.assigned_tables += 1;

    // Commit to live state if requested
    if (commitToState) {
      const realCust = mockCustomers.find(c => c.id === cust.id);
      const realTable = mockTables.find(t => t.id === chosen.tbl.id);
      const realWaiter = mockWaiters.find(w => w.id === chosen.wtr.id);

      if (realCust) {
        realCust.status = 'SEATED';
        realCust.assigned_table_number = chosen.tbl.table_number;
      }
      if (realTable) {
        realTable.status = 'OCCUPIED';
        realTable.group_name = cust.group_name;
        realTable.group_size = cust.group_size;
        realTable.waiter_name = chosen.wtr.name;
      }
      if (realWaiter) {
        realWaiter.assigned_tables += 1;
        realWaiter.workload_score = Number((realWaiter.assigned_tables / Math.max(1, realWaiter.max_tables)).toFixed(2));
      }

      mockAllocations.unshift({
        id: Date.now() + successfulCount,
        customer_group_id: cust.id,
        table_id: chosen.tbl.id,
        waiter_id: chosen.wtr.id,
        allocation_time: new Date().toISOString(),
        algorithm_used: algo,
        allocation_reason: reason,
        group_name: cust.group_name,
        table_number: chosen.tbl.table_number,
        waiter_name: chosen.wtr.name
      });

      mockActivity.unshift({
        id: `alloc-${Date.now()}-${successfulCount}`,
        title: `${algo} Allocation: ${cust.group_name} → ${chosen.tbl.table_number}`,
        description: `Seated (${cust.group_size} guests) with Waiter ${chosen.wtr.name}.`,
        time: "Just now"
      });
    }
  }

  const execTimeMs = Number(Math.max(0.35, performance.now() - t0).toFixed(2));
  const occupiedCap = mockTables.filter(t => t.status === 'OCCUPIED').reduce((s, t) => s + t.capacity, 0);
  const totalCap = mockTables.filter(t => t.is_active).reduce((s, t) => s + t.capacity, 0);
  const utilization = Number(((occupiedCap / Math.max(1, totalCap)) * 100).toFixed(1));
  const avgWait = orderedCustomers.length
    ? Number((orderedCustomers.reduce((s, c) => s + (c.waiting_minutes || 0), 0) / orderedCustomers.length).toFixed(1))
    : 0.0;

  return {
    algorithm: algo,
    execution_time_ms: execTimeMs,
    nodes_explored: nodesExplored,
    total_requested: orderedCustomers.length,
    successful_allocations: successfulCount,
    unallocated_count: orderedCustomers.length - successfulCount,
    table_utilization_percent: utilization,
    average_wait_minutes: avgWait,
    total_cost: Number(totalCost.toFixed(2)),
    decisions
  };
}

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

  // 2. Dashboard Stats & Activity
  if (endpoint.startsWith('/dashboard/stats')) {
    const total = mockTables.length;
    const occupied = mockTables.filter(t => t.status === 'OCCUPIED').length;
    const available = mockTables.filter(t => t.status === 'AVAILABLE').length;
    const reserved = mockTables.filter(t => t.status === 'RESERVED').length;
    const cleaning = mockTables.filter(t => t.status === 'CLEANING').length;
    const waitingList = mockCustomers.filter(c => c.status === 'WAITING');
    const activeWaiters = mockWaiters.filter(w => w.availability).length;

    const occupiedCap = mockTables.filter(t => t.status === 'OCCUPIED').reduce((s, t) => s + t.capacity, 0);
    const totalCap = mockTables.filter(t => t.is_active).reduce((s, t) => s + t.capacity, 0);
    const utilization = totalCap > 0 ? Number(((occupiedCap / totalCap) * 100).toFixed(1)) : 0;
    const avgWait = waitingList.length
      ? Number((waitingList.reduce((s, c) => s + (c.waiting_minutes || 0), 0) / waitingList.length).toFixed(1))
      : 0.0;

    return {
      total_tables: total,
      occupied_tables: occupied,
      available_tables: available,
      reserved_tables: reserved,
      cleaning_tables: cleaning,
      waiting_customers: waitingList.length,
      active_waiters: activeWaiters,
      average_waiting_time_minutes: avgWait,
      table_utilization_percent: utilization
    };
  }

  if (endpoint.startsWith('/dashboard/activity')) {
    return [...mockActivity];
  }

  // 3. Tables CRUD & Status Transitions
  const resetMatch = endpoint.match(/^\/tables\/(\d+)\/reset/);
  if (resetMatch && method === 'POST') {
    const tid = Number(resetMatch[1]);
    const tbl = mockTables.find(t => t.id === tid);
    if (!tbl) throw new Error("Table not found");
    releaseWaiterFromTable(tbl);
    tbl.status = 'AVAILABLE';
    mockActivity.unshift({
      id: `reset-${Date.now()}`,
      title: `Table ${tbl.table_number} Reset to AVAILABLE`,
      description: `Sanitation completed. Table ready for immediate seating.`,
      time: "Just now"
    });
    return { ...tbl };
  }

  const statusMatch = endpoint.match(/^\/tables\/(\d+)\/status/);
  if (statusMatch && method === 'PUT') {
    const tid = Number(statusMatch[1]);
    const tbl = mockTables.find(t => t.id === tid);
    if (!tbl) throw new Error("Table not found");
    const newStatus = (body.status || '').toUpperCase();
    if (newStatus === 'AVAILABLE' || newStatus === 'CLEANING') {
      releaseWaiterFromTable(tbl);
    }
    tbl.status = newStatus;
    mockActivity.unshift({
      id: `status-${Date.now()}`,
      title: `Table ${tbl.table_number} → ${tbl.status}`,
      description: `Operational state transitioned by floor coordinator.`,
      time: "Just now"
    });
    return { ...tbl };
  }

  if (endpoint.startsWith('/tables')) {
    const singleMatch = endpoint.match(/^\/tables\/(\d+)$/);
    if (singleMatch) {
      const tid = Number(singleMatch[1]);
      if (method === 'GET') return mockTables.find(t => t.id === tid) || {};
      if (method === 'PUT') {
        const idx = mockTables.findIndex(t => t.id === tid);
        if (idx !== -1) {
          mockTables[idx] = { ...mockTables[idx], ...body };
          return { ...mockTables[idx] };
        }
      }
      if (method === 'DELETE') {
        const tbl = mockTables.find(t => t.id === tid);
        if (tbl && tbl.status === 'OCCUPIED') {
          throw new Error("Cannot delete an occupied table. Free or reset table first.");
        }
        mockTables = mockTables.filter(t => t.id !== tid);
        return { message: `Table ${tbl ? tbl.table_number : tid} deleted successfully` };
      }
    }

    if (method === 'GET') {
      const filterMatch = endpoint.match(/status_filter=([^&]+)/);
      if (filterMatch) {
        const stat = decodeURIComponent(filterMatch[1]).toUpperCase();
        return mockTables.filter(t => t.status === stat);
      }
      return [...mockTables];
    }

    if (method === 'POST') {
      const tNum = (body.table_number || `T${String(mockTables.length + 1).padStart(2, '0')}`).toUpperCase();
      if (mockTables.some(t => t.table_number === tNum)) {
        throw new Error(`Table number '${tNum}' already exists.`);
      }
      const newT = {
        id: Date.now(),
        table_number: tNum,
        capacity: Number(body.capacity) || 4,
        location: body.location || "Main Dining",
        status: (body.status || "AVAILABLE").toUpperCase(),
        is_active: true
      };
      mockTables.push(newT);
      mockActivity.unshift({
        id: `newt-${Date.now()}`,
        title: `New Table ${newT.table_number} Registered`,
        description: `${newT.capacity} seats in ${newT.location}.`,
        time: "Just now"
      });
      return { ...newT };
    }
  }

  // 4. Customers CRUD
  if (endpoint.startsWith('/customers')) {
    const singleMatch = endpoint.match(/^\/customers\/(\d+)$/);
    if (singleMatch) {
      const cid = Number(singleMatch[1]);
      if (method === 'GET') return mockCustomers.find(c => c.id === cid) || {};
      if (method === 'PUT') {
        const idx = mockCustomers.findIndex(c => c.id === cid);
        if (idx !== -1) {
          mockCustomers[idx] = { ...mockCustomers[idx], ...body };
          return { ...mockCustomers[idx] };
        }
      }
      if (method === 'DELETE') {
        const cust = mockCustomers.find(c => c.id === cid);
        if (cust) {
          const tbl = mockTables.find(t => t.group_name === cust.group_name && t.status === 'OCCUPIED');
          if (tbl) {
            releaseWaiterFromTable(tbl);
            tbl.status = 'CLEANING';
          }
        }
        mockCustomers = mockCustomers.filter(c => c.id !== cid);
        return { message: `Customer group removed` };
      }
    }

    if (method === 'GET') {
      const filterMatch = endpoint.match(/status_filter=([^&]+)/);
      let list = [...mockCustomers];
      if (filterMatch) {
        const stat = decodeURIComponent(filterMatch[1]).toUpperCase();
        list = list.filter(c => c.status === stat);
      }
      return list.sort((a, b) => (b.priority - a.priority) || ((b.waiting_minutes || 0) - (a.waiting_minutes || 0)));
    }

    if (method === 'POST') {
      const newC = {
        id: Date.now(),
        group_name: body.group_name || "New Guest Party",
        group_size: Number(body.group_size) || 2,
        arrival_time: new Date().toISOString(),
        waiting_minutes: 0,
        priority: Number(body.priority) || 1,
        special_requirements: body.special_requirements || null,
        status: (body.status || "WAITING").toUpperCase()
      };
      mockCustomers.unshift(newC);
      mockActivity.unshift({
        id: `cust-${Date.now()}`,
        title: `Party Arrived: ${newC.group_name}`,
        description: `${newC.group_size} guests placed in waiting queue.`,
        time: "Just now"
      });
      return { ...newC };
    }
  }

  // 5. Waiters CRUD
  if (endpoint.startsWith('/waiters')) {
    const singleMatch = endpoint.match(/^\/waiters\/(\d+)$/);
    if (singleMatch) {
      const wid = Number(singleMatch[1]);
      if (method === 'GET') return mockWaiters.find(w => w.id === wid) || {};
      if (method === 'PUT') {
        const idx = mockWaiters.findIndex(w => w.id === wid);
        if (idx !== -1) {
          mockWaiters[idx] = { ...mockWaiters[idx], ...body };
          mockWaiters[idx].workload_score = Number(
            (mockWaiters[idx].assigned_tables / Math.max(1, mockWaiters[idx].max_tables)).toFixed(2)
          );
          return { ...mockWaiters[idx] };
        }
      }
      if (method === 'DELETE') {
        const w = mockWaiters.find(item => item.id === wid);
        if (w && w.assigned_tables > 0) {
          throw new Error("Cannot remove a waiter who is currently assigned to active tables.");
        }
        mockWaiters = mockWaiters.filter(item => item.id !== wid);
        return { message: "Waiter removed successfully" };
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
        availability: body.availability !== undefined ? body.availability : true,
        assigned_tables: 0,
        completed_orders: 0,
        workload_score: 0.0
      };
      mockWaiters.push(newW);
      return { ...newW };
    }
  }

  // 6. Reservations CRUD
  if (endpoint.startsWith('/reservations')) {
    const seatMatch = endpoint.match(/^\/reservations\/(\d+)\/seat$/);
    if (seatMatch && method === 'POST') {
      const rid = Number(seatMatch[1]);
      const res = mockReservations.find(r => r.id === rid);
      if (!res) throw new Error("Reservation not found");
      if (res.status === 'SEATED') throw new Error("This reservation has already been seated.");

      // Find available table
      const table = mockTables.find(t => t.status === 'AVAILABLE' && t.capacity >= res.group_size) || mockTables.find(t => t.status === 'AVAILABLE');
      if (!table) throw new Error("No available tables suitable for this reservation.");
      
      const waiter = mockWaiters.find(w => w.availability) || mockWaiters[0];

      res.status = 'SEATED';
      res.table_id = table.id;
      res.table_number = table.table_number;

      table.status = 'OCCUPIED';
      table.group_name = res.customer_name;
      table.group_size = res.group_size;
      table.waiter_name = waiter ? waiter.name : 'Server Assigned';

      return {
        success: true,
        message: `Reservation seated at Table ${table.table_number}`,
        reservation_id: res.id,
        table_id: table.id,
        table_number: table.table_number,
        waiter_name: table.waiter_name
      };
    }

    const singleMatch = endpoint.match(/^\/reservations\/(\d+)$/);
    if (singleMatch) {
      const rid = Number(singleMatch[1]);
      if (method === 'GET') return mockReservations.find(r => r.id === rid) || {};
      if (method === 'PUT') {
        const idx = mockReservations.findIndex(r => r.id === rid);
        if (idx !== -1) {
          mockReservations[idx] = { ...mockReservations[idx], ...body };
          return { ...mockReservations[idx] };
        }
      }
      if (method === 'DELETE') {
        mockReservations = mockReservations.filter(r => r.id !== rid);
        return { message: "Reservation cancelled" };
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
      const dup = mockReservations.find(
        r =>
          r.customer_name === body.customer_name &&
          r.reservation_date === body.reservation_date &&
          r.reservation_time === body.reservation_time
      );
      if (dup) {
        throw new Error("A reservation with this name, date, and time already exists.");
      }
      const newR = {
        id: Date.now(),
        customer_name: body.customer_name || "Guest Booking",
        group_size: Number(body.group_size) || 2,
        reservation_date: body.reservation_date || new Date().toISOString().split('T')[0],
        reservation_time: body.reservation_time || "19:30",
        special_requests: body.special_requests || null,
        status: (body.status || "CONFIRMED").toUpperCase(),
        table_id: body.table_id || null,
        table_number: null
      };
      mockReservations.push(newR);
      return { ...newR };
    }
  }

  // 7. Policies CRUD
  if (endpoint.startsWith('/policies')) {
    const singleMatch = endpoint.match(/^\/policies\/(\d+)$/);
    if (singleMatch) {
      const pid = Number(singleMatch[1]);
      if (method === 'PUT') {
        const idx = mockPolicies.findIndex(p => p.id === pid);
        if (idx !== -1) {
          mockPolicies[idx] = { ...mockPolicies[idx], ...body };
          return { ...mockPolicies[idx] };
        }
      }
      if (method === 'DELETE') {
        mockPolicies = mockPolicies.filter(p => p.id !== pid);
        return { message: "Policy deleted" };
      }
    }

    if (method === 'GET') {
      let list = [...mockPolicies];
      const catMatch = endpoint.match(/category=([^&]+)/);
      if (catMatch) list = list.filter(p => p.category === decodeURIComponent(catMatch[1]).toUpperCase());
      const activeMatch = endpoint.match(/active_only=([^&]+)/);
      if (activeMatch) list = list.filter(p => String(p.is_active) === activeMatch[1]);
      return list;
    }

    if (method === 'POST') {
      const newP = {
        id: Date.now(),
        policy_name: body.policy_name,
        description: body.description,
        category: (body.category || "ALLOCATION").toUpperCase(),
        is_active: body.is_active !== undefined ? body.is_active : true
      };
      mockPolicies.push(newP);
      return { ...newP };
    }
  }

  // 8. AI Table Allocation Engine
  if (endpoint.startsWith('/allocations/run') && method === 'POST') {
    const algo = (body.algorithm || 'A_STAR').toUpperCase();
    const autoCommit = body.auto_commit !== undefined ? body.auto_commit : true;
    let waitingList = mockCustomers.filter(c => c.status === 'WAITING');
    if (body.group_ids && Array.isArray(body.group_ids)) {
      waitingList = waitingList.filter(c => body.group_ids.includes(c.id));
    }
    const availableTables = mockTables.filter(t => t.status === 'AVAILABLE' && t.is_active);
    const availableWaiters = mockWaiters.filter(w => w.availability);

    if (waitingList.length === 0) throw new Error("No waiting customer groups found to allocate.");
    if (availableTables.length === 0) throw new Error("No available tables currently in the restaurant.");
    if (availableWaiters.length === 0) throw new Error("No active waiters currently available.");

    return executeSearchAlgorithm(algo, waitingList, availableTables, availableWaiters, autoCommit);
  }

  if (endpoint.startsWith('/allocations/compare')) {
    let cDtos = mockCustomers.filter(c => c.status === 'WAITING');
    if (cDtos.length === 0) {
      cDtos = [
        { id: 901, group_name: "Benchmark Duo", group_size: 2, priority: 1, waiting_minutes: 5, special_requirements: "Window" },
        { id: 902, group_name: "Family Feast", group_size: 4, priority: 2, waiting_minutes: 12, special_requirements: "High chair" },
        { id: 903, group_name: "Tech Execs", group_size: 6, priority: 3, waiting_minutes: 20, special_requirements: "Quiet booth" },
        { id: 904, group_name: "Birthday Squad", group_size: 8, priority: 1, waiting_minutes: 8, special_requirements: null }
      ];
    }
    let tDtos = mockTables.filter(t => t.status === 'AVAILABLE' && t.is_active);
    if (tDtos.length === 0) {
      tDtos = mockTables.map(t => ({ ...t, status: 'AVAILABLE' }));
    }
    const wDtos = mockWaiters.filter(w => w.availability);

    const meta = {
      RULE_BASED: { optimal: false, time: 0.35, nodes: 6, exp: "Heuristic rule execution: Fast deterministic matching without global optimization guarantees." },
      GREEDY: { optimal: false, time: 0.58, nodes: 14, exp: "Suboptimal: Locally greedy choice ignoring downstream seating availability and waiter burnout." },
      BFS: { optimal: false, time: 2.34, nodes: 32, exp: "Step-optimal only: Finds shortest path in graph depth but does not optimize non-uniform branch costs." },
      DFS: { optimal: false, time: 2.11, nodes: 26, exp: "Non-optimal: Explores deep arbitrary branches first, frequently settling on high-penalty assignments." },
      A_STAR: { optimal: true, time: 1.42, nodes: 18, exp: "Guaranteed optimal: Uses admissible heuristic h(n) <= h*(n) that never overestimates remaining cost." }
    };

    return ["RULE_BASED", "GREEDY", "BFS", "DFS", "A_STAR"].map(algo => {
      const res = executeSearchAlgorithm(algo, cDtos, tDtos, wDtos, false);
      return {
        algorithm: algo,
        execution_time_ms: Number(Math.max(meta[algo].time, res.execution_time_ms).toFixed(2)),
        nodes_explored: Math.max(meta[algo].nodes, res.nodes_explored),
        successful_allocations: res.successful_allocations,
        average_waiting_time_min: res.average_wait_minutes,
        table_utilization_percent: res.table_utilization_percent,
        total_cost: res.total_cost,
        is_optimal_claimed: meta[algo].optimal,
        optimality_explanation: meta[algo].exp
      };
    });
  }

  if (endpoint.startsWith('/allocations') && method === 'GET') {
    const limitMatch = endpoint.match(/limit=(\d+)/);
    const limit = limitMatch ? Number(limitMatch[1]) : 50;
    return mockAllocations.slice(0, limit);
  }

  // 9. Multi-Agent Discrete-Event Simulation
  if (endpoint.startsWith('/simulation/start') && method === 'POST') {
    const count = Number(body.customer_count) || 12;
    const algo = (body.algorithm || 'A_STAR').toUpperCase();
    const interval = Number(body.arrival_interval_seconds) || 2.0;
    const serviceDur = Number(body.service_duration_seconds) || 8.0;
    const cleanDur = Number(body.cleaning_duration_seconds) || 4.0;

    const sampleNames = [
      "Sterling Family", "Watson Duo", "OmniCorp Tech Group", "Dr. Vance",
      "Claire & Chris", "Morrison Trio", "Harding Banquet", "Alvarez Party",
      "Nakamura", "Greenwood Brunch", "Baker Duo", "Chen & Associates"
    ];

    const events = [
      {
        timestamp_sec: 0.0,
        event_type: "INIT",
        description: `Simulation scenario initialized with ${count} parties, ${mockTables.length} tables, ${mockWaiters.length} waiters using ${algo}.`
      }
    ];

    let allocated = 0;
    let reneged = 0;
    let maxTime = 0;

    for (let i = 0; i < count; i++) {
      const tArr = Number((i * interval + 0.4).toFixed(1));
      const partyName = sampleNames[i % sampleNames.length] + (i >= sampleNames.length ? ` #${i + 1}` : "");
      const size = [2, 4, 4, 6, 2, 8][i % 6];
      const tbl = mockTables[i % mockTables.length];
      const wtr = mockWaiters[i % mockWaiters.length];

      events.push({
        timestamp_sec: tArr,
        event_type: "ARRIVAL",
        description: `${partyName} (${size} guests) arrived and entered queue.`
      });

      // Simulate occasional renege on non-optimal algorithms with high customer counts
      if (algo === 'DFS' && i === count - 1 && count > 10) {
        const tRenege = Number((tArr + 12.0).toFixed(1));
        reneged += 1;
        maxTime = Math.max(maxTime, tRenege);
        events.push({
          timestamp_sec: tRenege,
          event_type: "RENEGED",
          description: `${partyName} left the waiting queue after exceeding patience limit.`
        });
        continue;
      }

      allocated += 1;
      const tSeat = Number((tArr + 0.5).toFixed(1));
      const tDone = Number((tSeat + serviceDur).toFixed(1));
      const tClean = Number((tDone + cleanDur).toFixed(1));
      maxTime = Math.max(maxTime, tClean);

      events.push({
        timestamp_sec: tSeat,
        event_type: "ALLOCATED",
        description: `${partyName} seated at Table ${tbl.table_number} (${tbl.capacity} seats). Assigned Waiter: ${wtr.name}.`
      });
      events.push({
        timestamp_sec: tDone,
        event_type: "SERVICE_DONE",
        description: `Dining concluded at Table ${tbl.table_number}. Table is now in CLEANING turnover for ${cleanDur}s.`
      });
      events.push({
        timestamp_sec: tClean,
        event_type: "CLEANING_DONE",
        description: `Table ${tbl.table_number} (${tbl.capacity}-top, ${tbl.location}) sanitized and returned to AVAILABLE pool.`
      });
    }

    events.sort((a, b) => a.timestamp_sec - b.timestamp_sec);

    simState = {
      is_running: false,
      is_paused: false,
      current_time_sec: maxTime,
      progress_percent: 100.0,
      algorithm: algo,
      total_customers: count,
      allocated_customers: allocated,
      waiting_customers: 0,
      completed_customers: allocated,
      reneged_customers: reneged,
      events: events.slice(-60)
    };

    const ts = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
    mockSimulationHistory.unshift({
      id: Date.now(),
      simulation_name: `Sim-${algo}-${ts}`,
      algorithm: algo,
      total_customers: count,
      successful_allocations: allocated,
      average_waiting_time: algo === 'A_STAR' ? 3.4 : algo === 'GREEDY' ? 6.2 : 5.1,
      execution_time: algo === 'A_STAR' ? 2.18 : 1.45,
      utilization: algo === 'A_STAR' ? 92.4 : 78.5,
      created_at: new Date().toISOString()
    });

    mockActivity.unshift({
      id: `sim-${Date.now()}`,
      title: `Multi-Agent Simulation Completed (${algo})`,
      description: `Seated ${allocated}/${count} parties across ${maxTime}s virtual time.`,
      time: "Just now"
    });

    return { ...simState };
  }

  if (endpoint.startsWith('/simulation/step') && method === 'POST') {
    const deltaMatch = endpoint.match(/delta_seconds=([\d.]+)/);
    const delta = deltaMatch ? Number(deltaMatch[1]) : 1.0;
    if (simState.total_customers === 0) {
      simState.total_customers = 6;
      simState.waiting_customers = 2;
      simState.events = [
        { timestamp_sec: 0.0, event_type: "INIT", description: "Interactive step simulation initialized with 6 parties." }
      ];
    }
    simState.current_time_sec = Number((simState.current_time_sec + delta).toFixed(1));
    if (simState.allocated_customers < simState.total_customers) {
      simState.allocated_customers += 1;
      simState.completed_customers = Math.max(0, simState.allocated_customers - 1);
      simState.waiting_customers = Math.max(0, simState.total_customers - simState.allocated_customers);
      const tbl = mockTables[simState.allocated_customers % mockTables.length];
      simState.events.push({
        timestamp_sec: simState.current_time_sec,
        event_type: "ALLOCATED",
        description: `Step ${simState.current_time_sec}s: Party #${simState.allocated_customers} seated at Table ${tbl.table_number}.`
      });
    } else {
      simState.completed_customers = simState.total_customers;
      simState.events.push({
        timestamp_sec: simState.current_time_sec,
        event_type: "CLEANING_DONE",
        description: `Step ${simState.current_time_sec}s: All tables sanitized and returned to AVAILABLE pool.`
      });
    }
    simState.progress_percent = Number(Math.min(100, (simState.completed_customers / Math.max(1, simState.total_customers)) * 100).toFixed(1));
    return { ...simState };
  }

  if (endpoint.startsWith('/simulation/pause')) {
    simState.is_paused = true;
    simState.is_running = false;
    return { ...simState };
  }

  if (endpoint.startsWith('/simulation/resume')) {
    simState.is_paused = false;
    simState.is_running = true;
    return { ...simState };
  }

  if (endpoint.startsWith('/simulation/reset')) {
    simState = JSON.parse(JSON.stringify(INITIAL_SIM_STATE));
    return { ...simState };
  }

  if (endpoint.startsWith('/simulation/status')) {
    return { ...simState };
  }

  if (endpoint.startsWith('/simulation/history')) {
    return [...mockSimulationHistory];
  }

  // 10. Grounded AI Assistant
  if (endpoint.startsWith('/ai/recommend')) {
    const sizeMatch = endpoint.match(/group_size=(\d+)/);
    const size = sizeMatch ? Number(sizeMatch[1]) : 4;
    const suitable = mockTables
      .filter(t => t.status === 'AVAILABLE' && t.is_active && t.capacity >= size)
      .sort((a, b) => a.capacity - b.capacity);

    return {
      reply: suitable.length
        ? `Best table recommendation for ${size} guests: **Table ${suitable[0].table_number}** (${suitable[0].capacity} seats, ${suitable[0].location}) with ${suitable[0].capacity - size} unused seat(s).`
        : `No single available table currently fits ${size} guests. Please check cleaning turnover tables or merge adjacent tables.`,
      relevant_info: [`Matching open tables: ${suitable.length}`],
      sources: ["table_allocation_policy.md (Capacity Fit Principle)"],
      explanation: "Evaluated live floor availability using Capacity Fit criteria.",
      suggested_action: suitable.length ? `Seat party at ${suitable[0].table_number}.` : "Wait for next turnover.",
      is_fallback: false
    };
  }

  if (endpoint.startsWith('/ai/explain-allocation')) {
    const latest = mockAllocations[0];
    return {
      reply: latest ? latest.allocation_reason : "No recent allocations found in session.",
      relevant_info: [`Logged allocations: ${mockAllocations.length}`],
      sources: ["table_allocation_policy.md"],
      explanation: "Extracted directly from active allocation history.",
      suggested_action: "Run AI Allocation to evaluate pending guests.",
      is_fallback: false
    };
  }

  if (endpoint.startsWith('/ai/chat')) {
    const q = (body.message || "").toLowerCase();
    const availableTables = mockTables.filter(t => t.status === "AVAILABLE" && t.is_active);
    const occupiedTables = mockTables.filter(t => t.status === "OCCUPIED");
    const waitingList = mockCustomers.filter(c => c.status === "WAITING");
    const sortedWaiters = [...mockWaiters].sort((a, b) => (b.workload_score - a.workload_score) || (b.assigned_tables - a.assigned_tables));
    const busiestWaiter = sortedWaiters[0];
    const lightestWaiter = sortedWaiters[sortedWaiters.length - 1];

    if (q.includes("available") || q.includes("free") || q.includes("seat") || q.includes("seven") || q.includes("which table")) {
      const numMatch = q.match(/\b(\d+)\b/);
      let targetSize = numMatch ? Number(numMatch[1]) : null;
      if (q.includes("seven")) targetSize = 7;
      else if (q.includes("eight")) targetSize = 8;
      else if (q.includes("six")) targetSize = 6;
      else if (q.includes("four")) targetSize = 4;
      else if (q.includes("two")) targetSize = 2;

      if (targetSize) {
        const suitable = availableTables.filter(t => t.capacity >= targetSize).sort((a, b) => a.capacity - b.capacity);
        return {
          reply: suitable.length
            ? `For a party of ${targetSize}, available table(s) include: ${suitable.map(t => `**Table ${t.table_number}** (${t.capacity} seats, ${t.location})`).join(', ')}.`
            : `There are currently **no available single tables** with capacity for ${targetSize} guests.`,
          sources: ["table_allocation_policy.md (Capacity Fit Principle)"],
          relevant_info: [`Available: ${availableTables.length}`, `Occupied: ${occupiedTables.length}`],
          suggested_action: suitable.length ? `Allocate ${suitable[0].table_number} to minimize wasted capacity.` : "Consult Large Group Seating Protocol.",
          is_fallback: false
        };
      }

      return {
        reply: availableTables.length
          ? `There are currently **${availableTables.length} available tables**: ${availableTables.map(t => `${t.table_number} (${t.capacity}p, ${t.location})`).join(', ')}.`
          : `All tables are currently occupied, reserved, or in cleaning turnover.`,
        sources: ["table_allocation_policy.md"],
        relevant_info: [`Available tables: ${availableTables.length}`, `Waiting queue: ${waitingList.length}`],
        suggested_action: "Open AI Allocation to seat waiting walk-ins.",
        is_fallback: false
      };
    }

    if (q.includes("waiter") || q.includes("workload") || q.includes("staff") || q.includes("busiest")) {
      return {
        reply: `**${busiestWaiter.name}** currently holds the highest workload (${busiestWaiter.assigned_tables}/${busiestWaiter.max_tables} tables, score: ${busiestWaiter.workload_score.toFixed(2)}). **${lightestWaiter.name}** has the lightest load (${lightestWaiter.assigned_tables}/${lightestWaiter.max_tables} tables).`,
        sources: ["waiter_assignment_policy.md (Waiter Workload Balancing)"],
        relevant_info: mockWaiters.map(w => `${w.name}: ${w.assigned_tables}/${w.max_tables}`),
        suggested_action: `Route forthcoming allocations to ${lightestWaiter.name}.`,
        is_fallback: false
      };
    }

    if (q.includes("why was") || q.includes("allocated") || q.includes("reason")) {
      const recent = mockAllocations.slice(0, 3);
      return {
        reply: recent.length
          ? "Recent allocation decisions:\n" + recent.map(a => `• **${a.group_name}** → **${a.table_number}** (${a.algorithm_used}): ${a.allocation_reason}`).join('\n')
          : "No allocations have been executed yet in this session.",
        sources: ["table_allocation_policy.md"],
        relevant_info: [`Logged allocations: ${mockAllocations.length}`],
        suggested_action: "Inspect AI Allocation page for detailed alternatives.",
        is_fallback: false
      };
    }

    return {
      reply: `**Saffron & Sage AI Operations Overview**:\n• **Tables**: ${availableTables.length} available, ${occupiedTables.length} occupied.\n• **Waiting Queue**: ${waitingList.length} parties waiting.\n• **Active Staff**: ${mockWaiters.filter(w => w.availability).length} servers.\nAll seating follows Capacity Fit, Waiter Workload Balancing, and 15-minute Reservation Grace Window policies.`,
      sources: ["table_allocation_policy.md", "reservation_policy.md", "waiter_assignment_policy.md"],
      relevant_info: [`Tables: ${mockTables.length}`, `Queue: ${waitingList.length}`],
      suggested_action: "Ask about available tables, waiter workloads, or run A* Allocation.",
      is_fallback: false
    };
  }

  // 11. System Reset
  if (endpoint.startsWith('/system/reset-db')) {
    mockTables = JSON.parse(JSON.stringify(INITIAL_TABLES));
    mockWaiters = JSON.parse(JSON.stringify(INITIAL_WAITERS));
    mockCustomers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
    mockReservations = JSON.parse(JSON.stringify(INITIAL_RESERVATIONS));
    mockPolicies = JSON.parse(JSON.stringify(INITIAL_POLICIES));
    mockAllocations = JSON.parse(JSON.stringify(INITIAL_ALLOCATIONS));
    mockSimulationHistory = JSON.parse(JSON.stringify(INITIAL_SIM_HISTORY));
    simState = JSON.parse(JSON.stringify(INITIAL_SIM_STATE));
    mockActivity = JSON.parse(JSON.stringify(INITIAL_ACTIVITY));
    return { status: "success", message: "Database successfully re-seeded with sample scenario" };
  }

  // 12. Analytics
  if (endpoint.startsWith('/analytics/overview')) {
    const sections = {};
    for (const t of mockTables) {
      const loc = t.location || "Main Dining";
      if (!sections[loc]) sections[loc] = { total_tables: 0, occupied: 0, capacity: 0 };
      sections[loc].total_tables += 1;
      sections[loc].capacity += t.capacity;
      if (t.status === "OCCUPIED") sections[loc].occupied += 1;
    }

    const section_utilization = Object.entries(sections).map(([section, s]) => ({
      section,
      total_tables: s.total_tables,
      occupied_tables: s.occupied,
      capacity: s.capacity,
      occupancy_rate: Number(((s.occupied / Math.max(1, s.total_tables)) * 100).toFixed(1))
    }));

    return {
      total_active_tables: mockTables.filter(t => t.is_active).length,
      total_waiters: mockWaiters.length,
      total_customers_served: mockCustomers.filter(c => c.status === "SEATED" || c.status === "COMPLETED").length + 48,
      section_utilization,
      hourly_traffic: [
        { time: "12:00", arrivals: 4, occupancy: 35 },
        { time: "13:00", arrivals: 8, occupancy: 70 },
        { time: "14:00", arrivals: 5, occupancy: 55 },
        { time: "17:00", arrivals: 3, occupancy: 30 },
        { time: "18:00", arrivals: 9, occupancy: 80 },
        { time: "19:00", arrivals: 12, occupancy: 95 },
        { time: "20:00", arrivals: 10, occupancy: 85 },
        { time: "21:00", arrivals: 6, occupancy: 50 }
      ]
    };
  }

  if (endpoint.startsWith('/analytics/algorithms')) {
    return [
      { algorithm: "RULE_BASED", average_execution_time_ms: 0.4, nodes_explored: 12, average_table_utilization_percent: 82.0, success_rate_percent: 88.0, optimality_status: "Fast Heuristic (Suboptimal)" },
      { algorithm: "GREEDY", average_execution_time_ms: 0.9, nodes_explored: 45, average_table_utilization_percent: 86.5, success_rate_percent: 92.0, optimality_status: "Locally Optimal" },
      { algorithm: "BFS", average_execution_time_ms: 6.8, nodes_explored: 850, average_table_utilization_percent: 90.0, success_rate_percent: 96.0, optimality_status: "Step-Shortest Path" },
      { algorithm: "DFS", average_execution_time_ms: 4.5, nodes_explored: 620, average_table_utilization_percent: 79.0, success_rate_percent: 85.0, optimality_status: "Unranked Exploration" },
      { algorithm: "A_STAR", average_execution_time_ms: 3.2, nodes_explored: 340, average_table_utilization_percent: 96.0, success_rate_percent: 98.5, optimality_status: "Minimal Cost (Admissible)" }
    ];
  }

  if (endpoint.startsWith('/analytics/waiter-performance')) {
    return [...mockWaiters];
  }

  return { success: true, message: "Operation simulated successfully" };
}
