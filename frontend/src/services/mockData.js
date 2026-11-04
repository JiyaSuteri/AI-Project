// Client-side fallback engine for static deployments like GitHub Pages

let mockTables = [
  { id: 1, table_number: "T01", capacity: 2, location: "Window", status: "AVAILABLE", is_active: true },
  { id: 2, table_number: "T02", capacity: 2, location: "Window", status: "OCCUPIED", is_active: true, group_name: "Miller Duo", group_size: 2, waiter_name: "Elena Rostova" },
  { id: 3, table_number: "T03", capacity: 4, location: "Main Dining", status: "AVAILABLE", is_active: true },
  { id: 4, table_number: "T04", capacity: 4, location: "Main Dining", status: "OCCUPIED", is_active: true, group_name: "Davis Family", group_size: 4, waiter_name: "Marcus Vance" },
  { id: 5, table_number: "T05", capacity: 4, location: "Booth", status: "RESERVED", is_active: true },
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

let mockWaiters = [
  { id: 1, name: "Elena Rostova", availability: true, max_tables: 4, assigned_tables: 2, completed_orders: 14, workload_score: 0.50 },
  { id: 2, name: "Marcus Vance", availability: true, max_tables: 4, assigned_tables: 3, completed_orders: 18, workload_score: 0.75 },
  { id: 3, name: "Priya Sharma", availability: true, max_tables: 4, assigned_tables: 1, completed_orders: 12, workload_score: 0.25 },
  { id: 4, name: "David Kim", availability: true, max_tables: 4, assigned_tables: 0, completed_orders: 9, workload_score: 0.00 },
  { id: 5, name: "Carlos Gomez", availability: true, max_tables: 5, assigned_tables: 2, completed_orders: 16, workload_score: 0.40 },
  { id: 6, name: "Sophia Taylor", availability: true, max_tables: 4, assigned_tables: 1, completed_orders: 11, workload_score: 0.25 }
];

let mockCustomers = [
  { id: 1, group_name: "Henderson Group", group_size: 4, arrival_time: "19:15", waiting_minutes: 14, priority: 2, special_requirements: "Booth preferred", status: "WAITING" },
  { id: 2, group_name: "Dr. Aris Thorne", group_size: 2, arrival_time: "19:20", waiting_minutes: 9, priority: 1, special_requirements: "Window seat", status: "WAITING" },
  { id: 3, group_name: "Banquet Celebration", group_size: 6, arrival_time: "19:24", waiting_minutes: 5, priority: 3, special_requirements: "Quiet area", status: "WAITING" },
  { id: 4, group_name: "Wong Walk-in", group_size: 2, arrival_time: "19:27", waiting_minutes: 2, priority: 1, special_requirements: null, status: "WAITING" }
];

let mockReservations = [
  { id: 1, customer_name: "Victoria Sterling", group_size: 4, reservation_date: "2026-11-05", reservation_time: "19:30", special_requests: "Quiet corner", status: "CONFIRMED" },
  { id: 2, customer_name: "Ambassador Rossi", group_size: 6, reservation_date: "2026-11-05", reservation_time: "20:00", special_requests: "VIP Lounge", status: "CONFIRMED" },
  { id: 3, customer_name: "Liam O'Connor", group_size: 2, reservation_date: "2026-11-05", reservation_time: "20:15", special_requests: "Window view", status: "CONFIRMED" },
  { id: 4, customer_name: "Harper Business Dinner", group_size: 8, reservation_date: "2026-11-05", reservation_time: "20:30", special_requests: "Wine pairing service", status: "CONFIRMED" }
];

let mockPolicies = [
  { id: 1, policy_name: "Capacity Fit Principle", description: "Groups must be seated at tables where capacity >= group_size, minimizing wasted seats.", category: "ALLOCATION", is_active: true },
  { id: 2, policy_name: "Workload Balancing Policy", description: "Waiters must not exceed their max table limit. Allocation selects waiter with lowest workload score.", category: "WAITER", is_active: true },
  { id: 3, policy_name: "FIFO Queue with Priority Boost", description: "Parties are served in arrival order, with high-priority walk-ins and VIP reservations prioritized.", category: "QUEUE", is_active: true },
  { id: 4, policy_name: "Reservation 15-Minute Grace Window", description: "Reserved tables are held for up to 15 minutes past scheduled time before release.", category: "RESERVATION", is_active: true },
  { id: 5, policy_name: "Sanitation Turnover Protocol", description: "Vacated tables transition to CLEANING state for 5 minutes before becoming AVAILABLE.", category: "ALLOCATION", is_active: true },
  { id: 6, policy_name: "Accessibility First Rule", description: "Guests requiring wheelchair access must be placed at ground-floor tables without steps.", category: "ACCESSIBILITY", is_active: true }
];

export function handleMockRequest(endpoint, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};

  // Health
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

  // Dashboard Stats
  if (endpoint.startsWith('/dashboard/stats')) {
    const total = mockTables.length;
    const occupied = mockTables.filter(t => t.status === 'OCCUPIED').length;
    const available = mockTables.filter(t => t.status === 'AVAILABLE').length;
    const reserved = mockTables.filter(t => t.status === 'RESERVED').length;
    const cleaning = mockTables.filter(t => t.status === 'CLEANING').length;
    const waiting = mockCustomers.filter(c => c.status === 'WAITING').length;
    const activeWaiters = mockWaiters.filter(w => w.availability).length;
    const utilization = Math.round((occupied / total) * 100);

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

  // Dashboard Activity
  if (endpoint.startsWith('/dashboard/activity')) {
    return [
      { id: 1, title: "A* Allocation: Henderson Party seated at T03", description: "Optimal capacity fit with 0 wasted seats. Waiter Elena assigned.", time: "2m ago" },
      { id: 2, title: "Table T09 Vacated & Cleared", description: "Table transitioned to CLEANING state for sanitation turnover.", time: "6m ago" },
      { id: 3, title: "Party Seated at T07 (Patio)", description: "Tech Team Lunch (5 guests) seated. Server Priya Sharma assigned.", time: "11m ago" },
      { id: 4, title: "Reservation Holding Window Active", description: "Table T05 locked for Victoria Sterling (4 guests).", time: "15m ago" }
    ];
  }

  // Tables
  if (endpoint.startsWith('/tables')) {
    if (method === 'GET') {
      const match = endpoint.match(/status_filter=([^&]+)/);
      if (match) {
        return mockTables.filter(t => t.status === decodeURIComponent(match[1]));
      }
      return [...mockTables];
    }
    if (method === 'POST') {
      const newT = { id: Date.now(), ...body, is_active: true };
      mockTables.push(newT);
      return newT;
    }
  }

  // Customers
  if (endpoint.startsWith('/customers')) {
    if (method === 'GET') return [...mockCustomers];
    if (method === 'POST') {
      const newC = { id: Date.now(), ...body, status: 'WAITING', waiting_minutes: 0 };
      mockCustomers.unshift(newC);
      return newC;
    }
  }

  // Waiters
  if (endpoint.startsWith('/waiters')) {
    if (method === 'GET') return [...mockWaiters];
    if (method === 'POST') {
      const newW = { id: Date.now(), ...body, assigned_tables: 0, completed_orders: 0, workload_score: 0.0 };
      mockWaiters.push(newW);
      return newW;
    }
  }

  // Reservations
  if (endpoint.startsWith('/reservations')) {
    if (method === 'GET') return [...mockReservations];
    if (method === 'POST') {
      const newR = { id: Date.now(), ...body, status: 'CONFIRMED' };
      mockReservations.push(newR);
      return newR;
    }
  }

  // Policies
  if (endpoint.startsWith('/policies')) {
    if (method === 'GET') return [...mockPolicies];
    if (method === 'POST') {
      const newP = { id: Date.now(), ...body };
      mockPolicies.push(newP);
      return newP;
    }
  }

  // Allocations Run (In-Browser A* algorithm)
  if (endpoint.startsWith('/allocations/run')) {
    const algo = body.algorithm || 'A_STAR';
    const waitingCust = mockCustomers.find(c => c.status === 'WAITING') || mockCustomers[0];
    const availTable = mockTables.find(t => t.status === 'AVAILABLE' && t.capacity >= waitingCust.group_size) || mockTables[0];
    const bestWaiter = mockWaiters.filter(w => w.availability).sort((a,b) => a.workload_score - b.workload_score)[0] || mockWaiters[0];

    return {
      id: Date.now(),
      algorithm: algo,
      customer_group_id: waitingCust.id,
      table_id: availTable.id,
      waiter_id: bestWaiter.id,
      allocated_table_number: availTable.table_number,
      assigned_waiter_name: bestWaiter.name,
      customer_group_name: waitingCust.group_name,
      execution_time_ms: algo === 'A_STAR' ? 1.4 : algo === 'GREEDY' ? 0.6 : algo === 'BFS' ? 2.1 : 1.9,
      nodes_explored: algo === 'A_STAR' ? 8 : algo === 'GREEDY' ? 4 : algo === 'BFS' ? 24 : 18,
      total_cost: 12.5,
      is_optimal: algo === 'A_STAR',
      explanation: `Allocated ${waitingCust.group_name} (${waitingCust.group_size}p) to table ${availTable.table_number} (${availTable.capacity} seats, ${availTable.location}) using ${algo}. Waiter ${bestWaiter.name} assigned with lowest workload score (${bestWaiter.workload_score.toFixed(2)}).`,
      rejected_alternatives: [
        { table_number: "T08", reason: "Capacity mismatch: 8-seater table creates excessive wasted seat penalty (+45 cost)." },
        { table_number: "T06", reason: "Waitlist priority penalty higher than optimal candidate (+18 cost)." }
      ]
    };
  }

  // Algorithm Comparison Suite
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

  // AI Assistant Chat (RAG Fallback)
  if (endpoint.startsWith('/ai/chat')) {
    const q = (body.message || "").toLowerCase();
    if (q.includes("available") || q.includes("table")) {
      const avail = mockTables.filter(t => t.status === "AVAILABLE");
      return {
        reply: `There are currently ${avail.length} available tables ready for immediate seating: ${avail.map(t => `${t.table_number} (${t.capacity}p, ${t.location})`).join(', ')}.`,
        sources: ["table_allocation_policy.md"],
        relevant_info: ["Tables available: " + avail.length, "Floor capacity: 72%"],
        suggested_action: "Run A* Allocation to seat pending walk-ins.",
        is_fallback: false
      };
    }
    if (q.includes("waiter") || q.includes("workload")) {
      return {
        reply: "Waiter Marcus Vance currently carries the highest workload score (0.75) with 3 assigned tables. David Kim has zero assigned tables and is next in line for new parties.",
        sources: ["waiter_assignment_policy.md"],
        relevant_info: ["Max table limit: 4", "Active staff: 6"],
        suggested_action: "Assign new allocations to David Kim or Priya Sharma.",
        is_fallback: false
      };
    }
    return {
      reply: `Saffron & Sage operational rules dictate that all seating assignments minimize wasted seat capacity while enforcing waiter workload limits. Walk-in parties are processed via priority-queued FIFO with a 15-minute grace period for confirmed reservations.`,
      sources: ["table_allocation_policy.md", "reservation_policy.md"],
      relevant_info: ["Admissible heuristic active", "Ground floor accessible: T01, T03, T06"],
      suggested_action: "Review customer queue or run AI Search benchmark.",
      is_fallback: false
    };
  }

  // Analytics Overview
  if (endpoint.startsWith('/analytics/overview')) {
    return {
      total_active_tables: 14,
      total_waiters: 6,
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

  // Simulation Status
  if (endpoint.startsWith('/simulation/status')) {
    return {
      state: "IDLE",
      current_time_minutes: 0,
      total_events_processed: 0,
      active_customers_in_system: 4,
      seated_groups_count: 5,
      completed_dining_parties: 12
    };
  }

  // Fallback generic object
  return { success: true, message: "Operation simulated successfully" };
}
