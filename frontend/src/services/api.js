import { handleMockRequest } from './mockData';

export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('bistro_custom_api_url');
    if (custom && custom.trim()) {
      let url = custom.trim().replace(/\/+$/, '');
      return url.endsWith('/api') ? url : `${url}/api`;
    }
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    let url = envUrl.trim().replace(/\/+$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  return '/api';
}

export function isRealBackendConfigured() {
  if (typeof window !== 'undefined') {
    const explicitMode = localStorage.getItem('bistro_api_mode');
    if (explicitMode === 'demo') return false;
    if (explicitMode === 'live') return true;

    const custom = localStorage.getItem('bistro_custom_api_url');
    if (custom && custom.trim()) return true;

    // When running on localhost or 127.0.0.1, default directly to real backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return true;
    }
  }
  const envUrl = import.meta.env.VITE_API_URL;
  return Boolean(envUrl && envUrl.trim());
}

export function setCustomApiUrl(url) {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('bistro_custom_api_url', url.trim());
      localStorage.setItem('bistro_api_mode', 'live');
    } else {
      localStorage.removeItem('bistro_custom_api_url');
    }
  }
}

export function setApiMode(mode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bistro_api_mode', mode);
  }
}

async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const isRealBackend = isRealBackendConfigured();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bistro_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const isGuest = localStorage.getItem('bistro_is_guest') === 'true';
    if (isGuest) {
      headers['X-Guest-Mode'] = 'true';
    }
  }

  const config = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        const errBody = await response.json().catch(() => ({}));
        const message = errBody.detail || `Server error (${response.status})`;
        const err = new Error(typeof message === 'string' ? message : JSON.stringify(message));
        err.isApiError = true;
        err.status = response.status;
        throw err;
      }
      const err = new Error(`Server returned HTTP ${response.status}`);
      err.isApiError = true;
      err.status = response.status;
      throw err;
    }

    if (!isJson) {
      if (isRealBackend) {
        throw new Error(`Expected JSON response from backend, received '${contentType || 'non-JSON'}'`);
      }
      // On static hosts without a running backend, use interactive in-browser simulation
      return handleMockRequest(endpoint, options);
    }

    return await response.json();
  } catch (error) {
    // DO NOT silently fall back to mock data if the user explicitly configured a live backend
    // or if the server returned a valid API validation error.
    if (isRealBackend || error?.isApiError) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
    // If visitor is on static GitHub Pages with no backend configured, use client-side demo engine
    return handleMockRequest(endpoint, options);
  }
}

export const api = {
  // Config & Connectivity
  getBaseUrl: getApiBaseUrl,
  isRealBackend: isRealBackendConfigured,
  setCustomApiUrl,
  setApiMode,

  // Authentication
  getAuthStatus: () => request('/auth/status'),
  googleAuth: (credential) => request('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  devDemoLogin: () => request('/auth/dev-demo-login', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

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
  seatReservation: (id) => request(`/reservations/${id}/seat`, { method: 'POST' }),

  // Allocations
  runAllocation: (algorithm = 'A_STAR', groupIds = null, autoCommit = true) => 
    request('/allocations/run', {
      method: 'POST',
      body: JSON.stringify({ algorithm, group_ids: groupIds, auto_commit: autoCommit })
    }),
  allocateTable: (groupId, algorithm = 'A_STAR', autoCommit = true) =>
    request('/allocations/run', {
      method: 'POST',
      body: JSON.stringify({ algorithm, group_ids: groupId ? [groupId] : null, auto_commit: autoCommit })
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
