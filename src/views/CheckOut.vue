<template>
  <div class="checkout-container">
    <div class="checkout-summary">
      <h3>Đơn hàng của bạn</h3>
      <table>
        <tbody>
          <tr v-for="item in cartStore.items" :key="item.cartId || item.id">
            <td>
              <div>{{ item.name }} x{{ item.quantity }}</div>
              <div v-if="item.selectedToppings && item.selectedToppings.length > 0" style="font-size: 0.85rem; color: #666; font-style: italic;">
                + {{ item.selectedToppings.map(t => t.name).join(', ') }}
              </div>
            </td>
            <td>{{ formatPrice((item.totalPrice || item.price) * item.quantity) }}</td>
          </tr>
          <tr style="border-top: 1px solid #eee; font-weight: bold;">
            <td>Tổng cộng:</td>
            <td>{{ formatPrice(cartStore.totalPrice) }}</td>
          </tr>
        </tbody>
      </table>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const cartStore = useCartStore()
const { addNotification } = useNotification()

const orderForm = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  notes: ''
})

const errorMessage = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const submitOrder = () => {
  if (cartStore.items.length === 0) {
    errorMessage.value = 'Giỏ hàng của bạn đang trống'
    addNotification('Giỏ hàng của bạn đang trống', 'error')
    return
  }
  
  // In a real app, you would send this to your backend
  const orderData = {
    items: cartStore.items,
    total: cartStore.totalPrice,
    customer: orderForm.value
  }
  
  // Simulate API call
  try {
    // Clear cart and redirect
    cartStore.clearCart()
    addNotification('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success', 5000)
    router.push('/')
  } catch (error) {
    addNotification('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'error')
  }
}
</script>
