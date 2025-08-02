const API_BASE_URL = 'http://localhost:3001'

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Products API
export const productsAPI = {
  getAll: () => apiRequest('/products'),
  getById: (id) => apiRequest(`/products/${id}`),
  create: (product) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id, product) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
}

// Toppings API
export const toppingsAPI = {
  getAll: () => apiRequest('/toppings'),
  getById: (id) => apiRequest(`/toppings/${id}`),
}

// Options API
export const optionsAPI = {
  getAll: () => apiRequest('/options'),
  getSizes: () => apiRequest('/options?type=size'),
  getIceLevels: () => apiRequest('/options?type=ice'),
  getSugarLevels: () => apiRequest('/options?type=sugar'),
}

// Users API
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (user) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  update: (id, user) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  }),
}

// Orders API
export const ordersAPI = {
  getAll: () => apiRequest('/orders'),
  getById: (id) => apiRequest(`/orders/${id}`),
  getByUserId: (userId) => apiRequest(`/orders?userId=${userId}`),
  create: (order) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  update: (id, order) => apiRequest(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(order),
  }),
  delete: (id) => apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  }),
}

// Health check
export const healthCheck = async () => {
  try {
    await fetch(`${API_BASE_URL}/products`)
    return true
  } catch {
    return false
  }
}

// Default export for convenience
const api = {
  products: productsAPI,
  toppings: toppingsAPI,
  options: optionsAPI,
  users: usersAPI,
  orders: ordersAPI,
  healthCheck,
}

export default api
