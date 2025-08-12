<template>
  <div class="profile-section">
    <div class="profile-container">
      <div class="profile-header">
        <h1>Thông Tin Tài Khoản</h1>
        <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>

      <div class="profile-content">
        <div class="profile-sidebar">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <i class="fas fa-user"></i>
            </div>
            <h3>{{ user.fullName }}</h3>
            <p>{{ user.email }}</p>
          </div>

          <nav class="profile-nav">
            <button 
              @click="activeTab = 'info'"
              :class="{ active: activeTab === 'info' }"
              class="nav-item"
            >
              <i class="fas fa-user"></i>
              Thông tin cá nhân
            </button>
            <button 
              @click="activeTab = 'orders'"
              :class="{ active: activeTab === 'orders' }"
              class="nav-item"
            >
              <i class="fas fa-shopping-bag"></i>
              Lịch sử đơn hàng
            </button>
            <button 
              @click="activeTab = 'settings'"
              :class="{ active: activeTab === 'settings' }"
              class="nav-item"
            >
              <i class="fas fa-cog"></i>
              Cài đặt
            </button>
            <button 
              @click="handleLogout"
              class="nav-item logout"
            >
              <i class="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </nav>
        </div>

        <div class="profile-main">
          <!-- Personal Info Tab -->
          <div v-if="activeTab === 'info'" class="tab-content">
            <h2>Thông tin cá nhân</h2>
            
            <form @submit.prevent="handleUpdateProfile" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="fullName">Họ và tên</label>
                  <input
                    type="text"
                    id="fullName"
                    v-model="profileForm.fullName"
                    :disabled="isLoading"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="profileForm.phone"
                    :disabled="isLoading"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="profileForm.email"
                  :disabled="isLoading"
                  required
                />
              </div>

              <div class="form-group">
                <label for="address">Địa chỉ</label>
                <textarea
                  id="address"
                  v-model="profileForm.address"
                  :disabled="isLoading"
                  rows="3"
                  placeholder="Nhập địa chỉ của bạn"
                ></textarea>
              </div>

              <div class="form-actions">
                <button 
                  type="submit" 
                  class="save-btn"
                  :disabled="isLoading"
                >
                  <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
                  <span>{{ isLoading ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'" class="tab-content">
            <h2>Lịch sử đơn hàng</h2>
            <div class="orders-list">
              <div v-if="userOrders.length === 0" class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!</p>
                <router-link to="/products" class="shop-now-btn">
                  Mua sắm ngay
                </router-link>
              </div>
              
              <div v-else class="orders-container">
                <div v-for="order in userOrders" :key="order.id" class="order-card">
                  <div class="order-header">
                    <div class="order-info">
                      <h3>Đơn hàng #{{ order.id }}</h3>
                      <span class="order-date">{{ formatDate(order.orderDate) }}</span>
                    </div>
                    <div class="order-status">
                      <span class="status-badge" :class="order.status">{{ getStatusText(order.status) }}</span>
                      <span class="order-total">{{ formatPrice(order.total) }}đ</span>
                    </div>
                  </div>
                  
                  <div class="order-items">
                    <div v-for="item in order.items" :key="item.id" class="order-item">
                      <img :src="item.image" :alt="item.name" class="item-image">
                      <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <div class="item-options">
                          <span v-if="item.size && item.size.value">Size: {{ item.size.value }}</span>
                          <span v-if="item.iceLevel">Đá: {{ item.iceLevel.name }}</span>
                          <span v-if="item.sugarLevel">Đường: {{ item.sugarLevel.name }}</span>
                          <span v-if="item.selectedToppings && item.selectedToppings.length > 0">
                            Topping: {{ item.selectedToppings.map(t => t.name).join(', ') }}
                          </span>
                        </div>
                        <div class="item-quantity-price">
                          <span>x{{ item.quantity }}</span>
                          <span class="item-price">{{ formatPrice(item.totalPrice) }}đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="order-delivery">
                    <h4>Thông tin giao hàng</h4>
                    <p><strong>{{ order.customer.fullName }}</strong> - {{ order.customer.phone }}</p>
                    <p>{{ order.customer.address }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="tab-content">
            <h2>Cài đặt tài khoản</h2>
            
            <div class="settings-section">
              <h3>Đổi mật khẩu</h3>
              <form @submit.prevent="handleChangePassword" class="password-form">
                <div class="form-group">
                  <label for="currentPassword">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="newPassword">Mật khẩu mới</label>
                  <input
                    type="password"
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    required
                    minlength="6"
                  />
                </div>
                
                <div class="form-group">
                  <label for="confirmNewPassword">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    v-model="passwordForm.confirmNewPassword"
                    required
                    minlength="6"
                  />
                </div>

                <button type="submit" class="change-password-btn">
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const { showNotification } = useNotification()

const activeTab = ref('info')
const { user, isLoading } = authStore

const profileForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  address: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// Order history - sử dụng trực tiếp orders từ auth store
const userOrders = computed(() => {
  return authStore.orders || []
})

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Đang xử lý',
    'confirmed': 'Đã xác nhận',
    'preparing': 'Đang chuẩn bị',
    'shipping': 'Đang giao hàng',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy'
  }
  return statusMap[status] || 'Không xác định'
}

onMounted(() => {
  if (user.value) {
    Object.assign(profileForm, user.value)
  }
  // Load orders
  authStore.loadOrders()
})

const handleUpdateProfile = async () => {
  const result = await authStore.updateProfile({
    fullName: profileForm.fullName,
    phone: profileForm.phone,
    address: profileForm.address
  })

  if (result.success) {
    showNotification('Cập nhật thông tin thành công!', 'success')
  } else {
    showNotification(result.error, 'error')
  }
}

const handleChangePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    showNotification('Mật khẩu xác nhận không khớp', 'error')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    showNotification('Mật khẩu mới phải có ít nhất 6 ký tự', 'error')
    return
  }

  // In a real app, this would validate current password and update
  showNotification('Đổi mật khẩu thành công!', 'success')
  
  // Reset form
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
}

const handleLogout = () => {
  authStore.logout()
  showNotification('Đăng xuất thành công!', 'success')
  router.push('/')
}
</script>
