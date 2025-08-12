// Validation utilities cho ràng buộc toàn vẹn dữ liệu

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email không được để trống'
  if (!emailRegex.test(email)) return 'Email không đúng định dạng'
  if (email.length > 100) return 'Email không được quá 100 ký tự'
  return null
}

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Mật khẩu không được để trống'
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
  if (password.length > 50) return 'Mật khẩu không được quá 50 ký tự'
  if (!/[a-zA-Z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái'
  if (!/[0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số'
  return null
}

// Full name validation
export const validateFullName = (fullName) => {
  if (!fullName) return 'Họ và tên không được để trống'
  if (fullName.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự'
  if (fullName.length > 50) return 'Họ và tên không được quá 50 ký tự'
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) return 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
  return null
}

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) return null // Phone is optional
  const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/
  if (!phoneRegex.test(phone)) return 'Số điện thoại không đúng định dạng (VD: 0901234567)'
  return null
}

// Address validation
export const validateAddress = (address) => {
  if (!address) return null // Address is optional
  if (address.length > 200) return 'Địa chỉ không được quá 200 ký tự'
  if (address.trim().length < 5) return 'Địa chỉ phải có ít nhất 5 ký tự'
  return null
}

// Order validation
export const validateOrderForm = (orderForm) => {
  const errors = {}
  
  const fullNameError = validateFullName(orderForm.fullName)
  if (fullNameError) errors.fullName = fullNameError
  
  const phoneError = validatePhone(orderForm.phone)
  if (phoneError) errors.phone = phoneError
  else if (!orderForm.phone) errors.phone = 'Số điện thoại không được để trống khi đặt hàng'
  
  const emailError = validateEmail(orderForm.email)
  if (emailError) errors.email = emailError
  
  if (!orderForm.address || orderForm.address.trim().length < 10) {
    errors.address = 'Địa chỉ giao hàng phải có ít nhất 10 ký tự'
  }
  
  if (!orderForm.paymentMethod) {
    errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Cart validation
export const validateCartItem = (item) => {
  if (!item.id) return 'ID sản phẩm không hợp lệ'
  if (!item.name) return 'Tên sản phẩm không hợp lệ'
  if (!item.price || item.price <= 0) return 'Giá sản phẩm không hợp lệ'
  if (!item.quantity || item.quantity <= 0) return 'Số lượng phải lớn hơn 0'
  if (item.quantity > 10) return 'Số lượng không được quá 10'
  return null
}

// Sanitize input (XSS protection)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Check for SQL injection patterns
export const validateSQLInjection = (input) => {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i
  ]
  
  for (let pattern of sqlPatterns) {
    if (pattern.test(input)) {
      return 'Dữ liệu không hợp lệ'
    }
  }
  return null
}

// Comprehensive validation
export const validateUserInput = (data) => {
  const errors = {}
  
  // Validate each field
  for (let [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Sanitize input
      data[key] = sanitizeInput(value)
      
      // Check for SQL injection
      const sqlError = validateSQLInjection(data[key])
      if (sqlError) {
        errors[key] = sqlError
        continue
      }
      
      // Field-specific validation
      switch (key) {
        case 'email':
          const emailError = validateEmail(data[key])
          if (emailError) errors[key] = emailError
          break
        case 'password':
          const passwordError = validatePassword(data[key])
          if (passwordError) errors[key] = passwordError
          break
        case 'fullName':
          const nameError = validateFullName(data[key])
          if (nameError) errors[key] = nameError
          break
        case 'phone':
          const phoneError = validatePhone(data[key])
          if (phoneError) errors[key] = phoneError
          break
        case 'address':
          const addressError = validateAddress(data[key])
          if (addressError) errors[key] = addressError
          break
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: data
  }
}
