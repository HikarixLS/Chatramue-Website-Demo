<template>
  <div class="auth-section">
    <div class="auth-container">
      <div class="auth-card">
        <h2>Đăng Ký Tài Khoản</h2>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">Họ và tên *</label>
              <input
                type="text"
                id="fullName"
                v-model="form.fullName"
                :disabled="isLoading"
                required
                placeholder="Nhập họ và tên"
              />
            </div>

            <div class="form-group">
              <label for="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                v-model="form.phone"
                :disabled="isLoading"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              :disabled="isLoading"
              required
              placeholder="Nhập email của bạn"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">Mật khẩu *</label>
              <div class="password-input">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="form.password"
                  :disabled="isLoading"
                  required
                  placeholder="Nhập mật khẩu"
                  minlength="6"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :disabled="isLoading"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Xác nhận mật khẩu *</label>
              <div class="password-input">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :disabled="isLoading"
                  required
                  placeholder="Nhập lại mật khẩu"
                  minlength="6"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :disabled="isLoading"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="address">Địa chỉ</label>
            <textarea
              id="address"
              v-model="form.address"
              :disabled="isLoading"
              placeholder="Nhập địa chỉ của bạn"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="agreeTerms" class="checkbox-label">
              <input
                type="checkbox"
                id="agreeTerms"
                v-model="form.agreeTerms"
                :disabled="isLoading"
                required
              />
              <span>
                Tôi đồng ý với 
                <a href="#" class="terms-link">Điều khoản sử dụng</a> 
                và 
                <a href="#" class="terms-link">Chính sách bảo mật</a>
              </span>
            </label>
          </div>

          <div v-if="validationError" class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            {{ validationError }}
          </div>

          <div v-if="error" class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            {{ error }}
          </div>

          <button 
            type="submit" 
            class="auth-btn"
            :disabled="isLoading || !isFormValid"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span>{{ isLoading ? 'Đang tạo tài khoản...' : 'Đăng Ký' }}</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Đã có tài khoản? 
            <router-link to="/login" class="auth-link">Đăng nhập ngay</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const { showNotification } = useNotification()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
  agreeTerms: false
})

const { isLoading, error } = authStore

const validationError = computed(() => {
  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    return 'Mật khẩu xác nhận không khớp'
  }
  if (form.password && form.password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự'
  }
  return null
})

const isFormValid = computed(() => {
  return form.fullName && 
         form.email && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword &&
         form.password.length >= 6 &&
         form.agreeTerms
})

const handleRegister = async () => {
  if (validationError.value) {
    showNotification(validationError.value, 'error')
    return
  }

  const result = await authStore.register({
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    password: form.password,
    address: form.address
  })

  if (result.success) {
    showNotification('Đăng ký thành công! Chào mừng bạn đến với Cha Trà Mue!', 'success')
    router.push('/')
  } else {
    showNotification(result.error, 'error')
  }
}
</script>
