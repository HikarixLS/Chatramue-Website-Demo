<template>
  <div class="auth-section">
    <div class="auth-container">
      <div class="auth-card">
        <h2>Đăng Nhập</h2>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              :disabled="isLoading"
              required
              placeholder="Nhập email của bạn"
            />
          </div>

          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <div class="password-input">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="form.password"
                :disabled="isLoading"
                required
                placeholder="Nhập mật khẩu"
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
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="form.rememberMe"
                :disabled="isLoading"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          <div v-if="error" class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            {{ error }}
          </div>

          <button 
            type="submit" 
            class="auth-btn"
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span>{{ isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Chưa có tài khoản? 
            <router-link to="/register" class="auth-link">Đăng ký ngay</router-link>
          </p>
          <router-link to="/forgot-password" class="forgot-link">Quên mật khẩu?</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const { showNotification } = useNotification()

const showPassword = ref(false)
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const { isLoading, error } = authStore

const handleLogin = async () => {
  const result = await authStore.login({
    email: form.email,
    password: form.password
  })

  if (result.success) {
    showNotification('Đăng nhập thành công!', 'success')
    
    // Redirect to intended page or home
    const redirectTo = router.currentRoute.value.query.redirect || '/'
    router.push(redirectTo)
  } else {
    showNotification(result.error, 'error')
  }
}
</script>
