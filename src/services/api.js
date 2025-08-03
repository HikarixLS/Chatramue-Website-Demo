// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000
const isDev = import.meta.env.DEV

// API Response Cache
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Request interceptor for logging
const logRequest = (url, options) => {
  if (isDev) {
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`)
  }
}

// Response interceptor for logging
const logResponse = (url, response, duration) => {
  if (isDev) {
    console.log(`✅ API Response: ${url} (${duration}ms)`)
  }
}

// Error interceptor
const logError = (url, error) => {
  if (isDev) {
    console.error(`❌ API Error: ${url}`, error)
  }
}

// Cache utilities
const getCacheKey = (url, options) => {
  return `${url}_${JSON.stringify(options || {})}`
}

const getCachedResponse = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  cache.delete(key)
  return null
}

const setCachedResponse = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Generic API request function with enhanced features
async function apiRequest(endpoint, options = {}) {
  const startTime = performance.now()
  const url = `${API_BASE_URL}${endpoint}`
  
  // Check cache for GET requests
  const cacheKey = getCacheKey(url, options)
  if (!options.method || options.method === 'GET') {
    const cachedResponse = getCachedResponse(cacheKey)
    if (cachedResponse) {
      if (isDev) {
        console.log(`💾 Cache Hit: ${url}`)
      }
      return cachedResponse
    }
  }

  try {
    logRequest(url, options)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    clearTimeout(timeoutId)
    const duration = Math.round(performance.now() - startTime)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Cache successful GET responses
    if (!options.method || options.method === 'GET') {
      setCachedResponse(cacheKey, data)
    }
    
    logResponse(url, response, duration)
    return data
    
  } catch (error) {
    const duration = Math.round(performance.now() - startTime)
    
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`Request timeout after ${API_TIMEOUT}ms`)
      timeoutError.isTimeout = true
      logError(url, timeoutError)
      throw timeoutError
    }
    
    logError(url, error)
    
    // Enhanced error object
    const enhancedError = new Error(error.message)
    enhancedError.url = url
    enhancedError.duration = duration
    enhancedError.options = options
    enhancedError.originalError = error
    
    throw enhancedError
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

// Banner Images API
export const bannerImagesAPI = {
  getAll: () => apiRequest('/bannerImages'),
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
  bannerImages: bannerImagesAPI,
  healthCheck,
}

export default api
