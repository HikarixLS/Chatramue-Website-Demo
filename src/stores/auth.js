import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.js'
import { validateUserInput, sanitizeInput } from '../utils/validation.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const orders = ref([]) // Thêm orders state

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return user.value.fullName || user.value.email
  })

  // Actions
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Validate and sanitize input
      const sanitizedCredentials = {
        email: sanitizeInput(credentials.email),
        password: credentials.password // Password không cần sanitize
      };

      // Basic email validation
      if (!sanitizedCredentials.email.includes('@')) {
        throw new Error('Email không hợp lệ');
      }

      // Simulate API call - in real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('chatramue_users') || '[]')
      const foundUser = users.find(u => 
        u.email === sanitizedCredentials.email && u.password === sanitizedCredentials.password
      )
      
      if (!foundUser) {
        throw new Error('Email hoặc mật khẩu không đúng')
      }
      
      // Set user data (excluding password)
      const { password, ...userData } = foundUser
      user.value = userData
      
      // Store in localStorage for persistence
      localStorage.setItem('chatramue_current_user', JSON.stringify(userData))
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Validate and sanitize input data
      const validation = validateUserInput(userData);
      if (!validation.isValid) {
        throw new Error('Dữ liệu đăng ký không hợp lệ: ' + validation.errors.join(', '));
      }

      // Sanitize input
      const sanitizedData = {
        email: sanitizeInput(userData.email),
        fullName: sanitizeInput(userData.fullName),
        phone: sanitizeInput(userData.phone),
        address: sanitizeInput(userData.address),
        password: userData.password // Password sẽ được hash ở backend
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem('chatramue_users') || '[]')
      
      // Check if email already exists
      if (users.some(u => u.email === sanitizedData.email)) {
        throw new Error('Email này đã được đăng ký')
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: sanitizedData.email,
        password: sanitizedData.password,
        fullName: sanitizedData.fullName,
        phone: sanitizedData.phone,
        address: sanitizedData.address,
        createdAt: new Date().toISOString()
      }
      
      // Save to localStorage
      users.push(newUser)
      localStorage.setItem('chatramue_users', JSON.stringify(users))
      
      // Auto login after registration
      const { password, ...userDataWithoutPassword } = newUser
      user.value = userDataWithoutPassword
      localStorage.setItem('chatramue_current_user', JSON.stringify(userDataWithoutPassword))
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    orders.value = [] // Clear orders khi logout
    localStorage.removeItem('chatramue_current_user')
  }

  const checkAuthStatus = () => {
    const savedUser = localStorage.getItem('chatramue_current_user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        loadOrders() // Load orders khi user đăng nhập
      } catch (err) {
        localStorage.removeItem('chatramue_current_user')
      }
    }
  }

  // Thêm đơn hàng mới
  const addOrder = (orderData) => {
    if (!user.value) return
    
    const newOrder = {
      id: Date.now().toString(),
      userId: user.value.id,
      items: orderData.items,
      total: orderData.total,
      customer: orderData.customer,
      orderDate: new Date().toISOString(),
      status: 'pending' // pending, confirmed, delivered, cancelled
    }
    
    // Thêm vào orders array
    orders.value.unshift(newOrder)
    
    // Lưu vào localStorage
    const allOrders = JSON.parse(localStorage.getItem('chatramue_orders') || '[]')
    allOrders.unshift(newOrder)
    localStorage.setItem('chatramue_orders', JSON.stringify(allOrders))
    
    return newOrder
  }

  // Load orders từ localStorage
  const loadOrders = () => {
    if (!user.value) return []
    
    const allOrders = JSON.parse(localStorage.getItem('chatramue_orders') || '[]')
    orders.value = allOrders.filter(order => order.userId === user.value.id)
    return orders.value
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Validate and sanitize profile data
      const validation = validateUserInput(profileData);
      if (!validation.isValid) {
        throw new Error('Dữ liệu cập nhật không hợp lệ: ' + validation.errors.join(', '));
      }

      // Sanitize input
      const sanitizedData = {};
      Object.keys(profileData).forEach(key => {
        if (key !== 'password') {
          sanitizedData[key] = sanitizeInput(profileData[key]);
        } else {
          sanitizedData[key] = profileData[key];
        }
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update user data
      const updatedUser = { ...user.value, ...sanitizedData }
      user.value = updatedUser
      
      // Update in localStorage
      localStorage.setItem('chatramue_current_user', JSON.stringify(updatedUser))
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('chatramue_users') || '[]')
      const userIndex = users.findIndex(u => u.id === user.value.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...sanitizedData }
        localStorage.setItem('chatramue_users', JSON.stringify(users))
      }
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    orders,
    // Getters
    isAuthenticated,
    userDisplayName,
    // Actions
    login,
    register,
    logout,
    checkAuthStatus,
    updateProfile,
    addOrder,
    loadOrders
  }
})
