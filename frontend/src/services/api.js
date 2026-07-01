const API_URL = '/api';

// Create headers object helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Authentication
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (userData) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  // Expenses CRUD
  getExpenses: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });

    const response = await fetch(`${API_URL}/expenses?${searchParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  addExpense: async (expenseData) => {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });
    return response.json();
  },

  updateExpense: async (id, expenseData) => {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });
    return response.json();
  },

  deleteExpense: async (id) => {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Income CRUD
  getIncomes: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });

    const response = await fetch(`${API_URL}/income?${searchParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  addIncome: async (incomeData) => {
    const response = await fetch(`${API_URL}/income`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(incomeData),
    });
    return response.json();
  },

  updateIncome: async (id, incomeData) => {
    const response = await fetch(`${API_URL}/income/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(incomeData),
    });
    return response.json();
  },

  deleteIncome: async (id) => {
    const response = await fetch(`${API_URL}/income/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Dashboard Aggregates
  getDashboardStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
