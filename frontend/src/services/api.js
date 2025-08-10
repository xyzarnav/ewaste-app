const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  changePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Batch API functions
export const batchAPI = {
  getBatches: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/batches${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getBatch: async (batchId) => {
    const response = await fetch(`${API_BASE_URL}/batches/${batchId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createBatch: async (batchData) => {
    const response = await fetch(`${API_BASE_URL}/batches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(batchData)
    });
    return handleResponse(response);
  },

  updateBatchStatus: async (batchId, status) => {
    const response = await fetch(`${API_BASE_URL}/batches/${batchId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  addItemsToBatch: async (batchId, items) => {
    const response = await fetch(`${API_BASE_URL}/batches/${batchId}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items })
    });
    return handleResponse(response);
  },

  deleteBatch: async (batchId) => {
    const response = await fetch(`${API_BASE_URL}/batches/${batchId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Auto Complete API functions
export const autoCompleteAPI = {
  autoFill: async (itemName, modelSerial) => {
    const response = await fetch(`${API_BASE_URL}/auto-complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemName, serialNumber: modelSerial })
    });
    return handleResponse(response);
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  }
};

export default {
  auth: authAPI,
  batches: batchAPI,
  autoComplete: autoCompleteAPI,
  health: healthAPI
};

