<template>
  <div class="checkout-container" v-if="!isRedirecting">
    <div v-if="isLoading" class="loading-state">
      <p>Đang tải thông tin...</p>
    </div>
    
    <template v-else-if="isReady">
      <div class="checkout-summary">
        <h3>Đơn hàng của bạn</h3>
        <div class="order-items">
          <div v-for="item in cartStore.items" :key="item.cartId || item.id" class="order-item">
            <div class="item-info">
              <div class="item-name">{{ item.name }} x{{ item.quantity }}</div>
              <div v-if="item.size && item.size.value" class="item-size">
                Size: {{ item.size.value }}
              </div>
              <div v-if="item.selectedToppings && item.selectedToppings.length > 0" class="item-toppings">
                + {{ item.selectedToppings.map(t => t.name).join(', ') }}
              </div>
            </div>
            <div class="item-price">{{ formatPrice((item.totalPrice || item.price) * item.quantity) }}</div>
          </div>
          <div class="order-total">
            <div class="total-label">Tổng cộng:</div>
            <div class="total-price">{{ formatPrice(cartStore.totalPrice) }}</div>
          </div>
        </div>
      </div>
      
      <form class="checkout-form" @submit.prevent="submitOrder">
        <h3>Thông tin giao hàng</h3>
        
        <label for="fullName">Họ và tên:</label>
        <input type="text" id="fullName" v-model="orderForm.fullName" required>
        
        <label for="phone">Số điện thoại:</label>
        <input type="tel" id="phone" v-model="orderForm.phone" required>
        
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="orderForm.email" required>
        
        <label for="address">Địa chỉ giao hàng:</label>
        <input type="text" id="address" v-model="orderForm.address" required>
        
        <label for="notes">Ghi chú (tùy chọn):</label>
        <input type="text" id="notes" v-model="orderForm.notes">
        
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        
        <button type="submit" class="checkout-btn" :disabled="cartStore.items.length === 0">
          Đặt hàng
        </button>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { showNotification } = useNotification()

const orderForm = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  notes: ''
})

const errorMessage = ref('')
const isLoading = ref(true)
const isReady = ref(false)
const isRedirecting = ref(false)

// Kiểm tra đăng nhập khi component được mount
onMounted(async () => {
  // Delay nhỏ để đảm bảo auth store đã được khởi tạo
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!authStore.isAuthenticated) {
    isRedirecting.value = true
    showNotification('Vui lòng đăng nhập để thanh toán', 'warning')
    router.push({ path: '/login', query: { redirect: '/checkout' } })
    return
  }

  // Kiểm tra giỏ hàng có trống không
  if (cartStore.items.length === 0) {
    isRedirecting.value = true
    showNotification('Giỏ hàng của bạn đang trống', 'warning')
    router.push('/products')
    return
  }

  // Tự động điền thông tin từ profile nếu đã có
  if (authStore.user) {
    orderForm.value.fullName = authStore.user.fullName || ''
    orderForm.value.phone = authStore.user.phone || ''
    orderForm.value.email = authStore.user.email || ''
    orderForm.value.address = authStore.user.address || ''
  }
  
  isLoading.value = false
  isReady.value = true
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const submitOrder = () => {
  // Kiểm tra lại đăng nhập trước khi submit
  if (!authStore.isAuthenticated) {
    showNotification('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error')
    router.push('/login')
    return
  }

  if (cartStore.items.length === 0) {
    errorMessage.value = 'Giỏ hàng của bạn đang trống'
    showNotification('Giỏ hàng của bạn đang trống', 'error')
    return
  }
  
  // Validate form
  if (!orderForm.value.fullName || !orderForm.value.phone || !orderForm.value.email || !orderForm.value.address) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
    return
  }
  
  // In a real app, you would send this to your backend
  const orderData = {
    userId: authStore.user.id,
    items: cartStore.items,
    total: cartStore.totalPrice,
    customer: orderForm.value,
    orderDate: new Date().toISOString()
  }
  
  // Simulate API call
  try {
    // Save order to history
    authStore.addOrder(orderData)
    
    // Clear cart and redirect
    cartStore.clearCart()
    showNotification('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success', 5000)
    router.push('/')
  } catch (error) {
    showNotification('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'error')
  }
}
</script>
