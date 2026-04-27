// API utility functions
const API_BASE = 'http://localhost:3000/api';

// Get JWT token from localStorage
function getToken() {
  return localStorage.getItem('jwtToken');
}

// Set JWT token in localStorage
function setToken(token) {
  localStorage.setItem('jwtToken', token);
}

// Clear JWT token
function clearToken() {
  localStorage.removeItem('jwtToken');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getToken();
}

// Generic fetch with authentication
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const token = getToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred'
      };
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Authentication endpoints
const Auth = {
  login: async (usernameOrEmail, password) => {
    const data = await apiCall('/auth/login', 'POST', {
      usernameOrEmail,
      password
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  register: async (username, email, password, role = 'Technician') => {
    return await apiCall('/auth/register', 'POST', {
      username,
      email,
      password,
      role
    });
  },

  logout: () => {
    clearToken();
  }
};

// User endpoints
const Users = {
  create: async (username, email, password, role = 'Technician') => {
    return await apiCall('/users', 'POST', {
      username,
      email,
      password,
      role
    });
  },

  list: async () => {
    return await apiCall('/users', 'GET');
  },

  get: async (id) => {
    return await apiCall(`/users/${id}`, 'GET');
  },

  updateRole: async (id, role) => {
    return await apiCall(`/users/${id}/role`, 'PATCH', { role });
  },

  updateStatus: async (id, isEnabled) => {
    return await apiCall(`/users/${id}/status`, 'PATCH', { isEnabled });
  }
};

// Item endpoints
const Items = {
  create: async (itemData) => {
    return await apiCall('/items', 'POST', itemData);
  },

  list: async () => {
    return await apiCall('/items', 'GET');
  },

  get: async (id) => {
    return await apiCall(`/items/${id}`, 'GET');
  },

  update: async (id, itemData) => {
    return await apiCall(`/items/${id}`, 'PUT', itemData);
  },

  delete: async (id) => {
    return await apiCall(`/items/${id}`, 'DELETE');
  }
};

// Transaction endpoints
const Transactions = {
  checkout: async (itemId, userId, document = null) => {
    return await apiCall('/transactions/checkout', 'POST', {
      itemId,
      userId,
      document
    });
  },

  checkin: async (itemId, document = null) => {
    return await apiCall('/transactions/checkin', 'POST', {
      itemId,
      document
    });
  },

  getHistory: async (itemId) => {
    return await apiCall(`/transactions/${itemId}/history`, 'GET');
  }
};

// API Key endpoints
const ApiKeys = {
  generate: async (label, purpose) => {
    return await apiCall('/keys', 'POST', { label, purpose });
  },

  list: async () => {
    return await apiCall('/keys', 'GET');
  },

  revoke: async (id) => {
    return await apiCall(`/keys/${id}`, 'DELETE');
  }
};

// Utility function to show messages
function showMessage(message, type = 'success') {
  const messageEl = document.createElement('div');
  messageEl.className = `message-box ${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 12px 20px;
    border-radius: 4px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 4000);
}

// Utility function to handle errors
function handleError(error) {
  console.error('Error:', error);
  const message = error.message || 'An unexpected error occurred';
  showMessage(message, 'error');
}
