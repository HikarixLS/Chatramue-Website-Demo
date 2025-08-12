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
        
        <h4>Phương thức thanh toán</h4>
        <div class="payment-methods">
          <label class="payment-option">
            <input type="radio" id="payment-cod" v-model="orderForm.paymentMethod" value="cod" name="payment">
            <span>Thanh toán khi nhận hàng (COD)</span>
          </label>
          <label class="payment-option">
            <input type="radio" id="payment-bank" v-model="orderForm.paymentMethod" value="bank" name="payment">
            <span>Chuyển khoản ngân hàng</span>
          </label>
        </div>
        
        <div v-if="orderForm.paymentMethod === 'bank'" class="bank-info">
          <h5>Thông tin chuyển khoản:</h5>
          <div class="bank-details">
            <p><strong>Ngân hàng:</strong> Techombank</p>
            <p><strong>Số tài khoản:</strong> 19039566880010</p>
            <p><strong>Chủ tài khoản:</strong> CONG TY TNHH CHATRAMUE VIETNAM</p>
            <p><strong>Nội dung:</strong> Thanh toan don hang #[Mã đơn hàng]</p>
            <div class="qr-payment">
              <p><em>Hoặc quét mã QR để thanh toán nhanh:</em></p>
              <div class="qr-container">
                <canvas ref="qrCodeCanvas" class="qr-code"></canvas>
              </div>
            </div>
          </div>
        </div>
        
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
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'
import { validateOrderForm, validateCartItem } from '../utils/validation.js'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { showNotification } = useNotification()

const orderForm = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
  paymentMethod: 'cod'
})

const errorMessage = ref('')
const isLoading = ref(true)
const isReady = ref(false)
const isRedirecting = ref(false)
const qrCodeCanvas = ref(null)

// Tạo QR Code data
const qrPaymentData = computed(() => {
  const bankInfo = {
    bank: "Techcombank",
    accountNumber: "19039566880010",
    accountName: "CONG TY TNHH CHATRAMUE VIETNAM",
    amount: cartStore.totalPrice,
    content: `Thanh toan don hang ChaTraMue ${Date.now()}`,
  }
  
  // Format cho QR Banking Vietnam
  return `2|99|${bankInfo.accountNumber}|${bankInfo.accountName}|${bankInfo.bank}|${bankInfo.amount}|${bankInfo.content}|VND`
})

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
  
  // Tạo QR code sau khi component đã mount
  await nextTick()
  generateQRCode()
})

// Watch payment method changes để regenerate QR code
watch(() => orderForm.value.paymentMethod, async (newMethod) => {
  if (newMethod === 'bank') {
    await nextTick()
    generateQRCode()
  }
})

// Function tạo QR Code
const generateQRCode = () => {
  if (!qrCodeCanvas.value) {
    console.log('Canvas not found')
    return
  }
  
  const canvas = qrCodeCanvas.value
  const ctx = canvas.getContext('2d')
  
  console.log('Generating QR code...')
  console.log('Total amount:', cartStore.totalPrice)
  
  // Set canvas size
  canvas.width = 200
  canvas.height = 200
  
  // Clear canvas và show loading
  ctx.clearRect(0, 0, 200, 200)
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, 200, 200)
  ctx.fillStyle = '#333'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Đang tạo QR...', 100, 100)
  
  // Sử dụng VietQR API với format đúng
  const amount = cartStore.totalPrice
  const content = `Thanh toan don hang ChaTraMue ${Date.now()}`
  const qrApiUrl = `https://img.vietqr.io/image/TCB-19039566880010-qr_only.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`
  
  console.log('QR URL:', qrApiUrl)
  
  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  img.onload = () => {
    console.log('QR image loaded successfully')
    ctx.clearRect(0, 0, 200, 200)
    ctx.drawImage(img, 0, 0, 200, 200)
  }
  
  img.onerror = (error) => {
    console.error('QR API error:', error)
    // Fallback: hiển thị thông tin thanh toán
    ctx.clearRect(0, 0, 200, 200)
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, 200, 200)
    ctx.strokeStyle = '#ddd'
    ctx.strokeRect(0, 0, 200, 200)
    
    ctx.fillStyle = '#333'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('QR Code VietQR', 100, 25)
    ctx.fillText('Techcombank', 100, 45)
    ctx.fillText('STK: 19039566880010', 100, 65)
    ctx.fillText(`Số tiền: ${amount.toLocaleString()}đ`, 100, 85)
    ctx.fillText('CHATRAMUE VIETNAM', 100, 105)
    ctx.fillText('─────────────', 100, 125)
    ctx.fillText('Mở app ngân hàng', 100, 145)
    ctx.fillText('để quét mã QR', 100, 165)
  }
  
  img.src = qrApiUrl
}

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
  
  // Validate cart items
  for (let item of cartStore.items) {
    const itemError = validateCartItem(item)
    if (itemError) {
      showNotification(`Sản phẩm không hợp lệ: ${itemError}`, 'error')
      return
    }
  }
  
  // Validate order form với ràng buộc toàn vẹn
  const orderValidation = validateOrderForm(orderForm.value)
  if (!orderValidation.isValid) {
    const firstError = Object.values(orderValidation.errors)[0]
    errorMessage.value = firstError
    showNotification(firstError, 'error')
    return
  }
  
  // Additional business logic validation
  if (cartStore.totalPrice < 10000) {
    showNotification('Đơn hàng tối thiểu 10,000 VNĐ', 'error')
    return
  }
  
  if (cartStore.totalPrice > 5000000) {
    showNotification('Đơn hàng không được vượt quá 5,000,000 VNĐ', 'error')
    return
  }
  
  // In a real app, you would send this to your backend
  const orderData = {
    userId: authStore.user.id,
    items: cartStore.items,
    total: cartStore.totalPrice,
    customer: orderForm.value,
    orderDate: new Date().toISOString(),
    status: 'pending'
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


