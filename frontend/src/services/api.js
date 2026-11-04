import { handleMockRequest } from './mockData';

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // If running on static hosting (like GitHub Pages) without a running Python backend,
    // seamlessly provide client-side simulated data so all features work in the browser!
    try {
      return handleMockRequest(endpoint, options);
    } catch (mockErr) {
      console.warn(`Fallback simulation error on ${endpoint}:`, mockErr);
      throw error;
    }
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),
  getDashboardActivity: () => request('/dashboard/activity'),

  // Tables
  getTables: (status) => request(status ? `/tables?status_filter=${encodeURIComponent(status)}` : '/tables'),
  getTable: (id) => request(`/tables/${id}`),
  createTable: (data) => request('/tables', { method: 'POST', body: JSON.stringify(data) }),
  updateTable: (id, data) => request(`/tables/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateTableStatus: (id, status) => request(`/tables/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  resetTable: (id) => request(`/tables/${id}/reset`, { method: 'POST' }),
  deleteTable: (id) => request(`/tables/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: (status) => request(status ? `/customers?status_filter=${encodeURIComponent(status)}` : '/customers'),
  getCustomer: (id) => request(`/customers/${id}`),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Waiters
  getWaiters: (availableOnly) => request(availableOnly !== undefined ? `/waiters?available_only=${availableOnly}` : '/waiters'),
  getWaiter: (id) => request(`/waiters/${id}`),
  createWaiter: (data) => request('/waiters', { method: 'POST', body: JSON.stringify(data) }),
  updateWaiter: (id, data) => request(`/waiters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWaiter: (id) => request(`/waiters/${id}`, { method: 'DELETE' }),

  // Reservations
  getReservations: (date) => request(date ? `/reservations?date_filter=${encodeURIComponent(date)}` : '/reservations'),
  createReservation: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  updateReservation: (id, data) => request(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),

  // Allocations
  runAllocation: (algorithm = 'A_STAR', groupIds = null, autoCommit = true) => 
    request('/allocations/run', {
      method: 'POST',
      body: JSON.stringify({ algorithm, group_ids: groupIds, auto_commit: autoCommit })
    }),
  getAllocations: (limit = 50) => request(`/allocations?limit=${limit}`),
  compareAlgorithms: () => request('/allocations/compare'),

  // Policies
  getPolicies: (category, activeOnly) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (activeOnly !== undefined) params.append('active_only', activeOnly);
    const qs = params.toString();
    return request(qs ? `/policies?${qs}` : '/policies');
  },
  createPolicy: (data) => request('/policies', { method: 'POST', body: JSON.stringify(data) }),
  updatePolicy: (id, data) => request(`/policies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePolicy: (id) => request(`/policies/${id}`, { method: 'DELETE' }),

  // Simulation
  startSimulation: (config) => request('/simulation/start', { method: 'POST', body: JSON.stringify(config) }),
  stepSimulation: (deltaSec = 1.0) => request(`/simulation/step?delta_seconds=${deltaSec}`, { method: 'POST' }),
  pauseSimulation: () => request('/simulation/pause', { method: 'POST' }),
  resumeSimulation: () => request('/simulation/resume', { method: 'POST' }),
  resetSimulation: () => request('/simulation/reset', { method: 'POST' }),
  getSimulationStatus: () => request('/simulation/status'),
  getSimulationHistory: () => request('/simulation/history'),

  // Analytics
  getAnalyticsOverview: () => request('/analytics/overview'),
  getAlgorithmAnalytics: () => request('/analytics/algorithms'),
  getWaiterPerformance: () => request('/analytics/waiter-performance'),

  // AI Assistant
  aiChat: (message) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  aiRecommend: (groupSize, specialRequest) => 
    request(`/ai/recommend?group_size=${groupSize}&special_request=${encodeURIComponent(specialRequest || '')}`, { method: 'POST' }),
  aiExplainAllocation: (tableNumber, groupName) => 
    request(`/ai/explain-allocation?table_number=${encodeURIComponent(tableNumber)}&group_name=${encodeURIComponent(groupName)}`, { method: 'POST' }),

  // System
  resetDatabase: () => request('/system/reset-db', { method: 'POST' }),
};
