// Get API base URL
const getApiUrl = () => {
  // In development, use relative paths (Vite proxy handles routing)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // In production, use environment variable or relative path
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return apiUrl;
};

export const apiUrl = getApiUrl();

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${apiUrl}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

// Specific API endpoints
export const api = {
  auth: {
    me: () => fetch(`${apiUrl}/api/auth/me`, { credentials: 'include' }).then(r => r.json()),
    login: (data) => apiCall('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
    signup: (data) => apiCall('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  },
  user: {
    getProfile: (name) => fetch(`${apiUrl}/api/user/profile/${name}`, { credentials: 'include' }).then(r => r.json()),
  },
  // Add more endpoints as needed
};
