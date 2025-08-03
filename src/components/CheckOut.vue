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
              <div v-if="item.iceLevel" class="item-options">
                Đá: {{ item.iceLevel.name }}
              </div>
              <div v-if="item.sugarLevel" class="item-options">
                Đường: {{ item.sugarLevel.name }}
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

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.checkout-summary {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
}

.checkout-summary h3 {
  margin-bottom: 1rem;
  color: #333;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.item-size {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.item-options {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
  font-style: italic;
}

.item-toppings {
  font-size: 0.9rem;
  color: #888;
}

.item-price {
  font-weight: 600;
  color: #e67e22;
  margin-left: 1rem;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 2px solid #e67e22;
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.total-price {
  color: #e67e22;
  font-size: 1.2rem;
}

.checkout-form {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.checkout-form h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.checkout-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.checkout-form input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.checkout-form input:focus {
  outline: none;
  border-color: #e67e22;
}

.checkout-btn {
  width: 100%;
  background: #e67e22;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover:not(:disabled) {
  background: #d35400;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #666;
}

@media (max-width: 768px) {
  .checkout-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>
