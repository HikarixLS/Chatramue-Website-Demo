<template>
  <section class="product-detail" v-if="product">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    
    <div class="product-info">
      <div class="content">
        <h1>{{ product.name }}</h1>
        <div class="rating-summary">
          <div class="stars" :key="`stars-${reviews.length}-${averageRating}`">
            <i v-for="i in 5" :key="i" 
               :class="['fas fa-star', { 'filled': i <= averageRating }]"></i>
          </div>
          <span class="rating-text">{{ averageRating }}/5 ({{ reviews.length }} đánh giá)</span>
        </div>
        <p class="description">{{ product.description }}</p>
        <p><strong>Giá:</strong> {{ formatPrice(product.price) }}</p>
        
        <div class="button-group">
          <button class="btn" @click="openToppingModal">Thêm vào giỏ hàng</button>
          <button class="btn btn-primary" @click="buyNow">Mua ngay</button>
        </div>
      </div>
    </div>
    
    <!-- Reviews Section -->
    <div class="reviews-section">
      <h3>Đánh giá sản phẩm</h3>
      
      <!-- Write Review Form -->
      <div v-if="authStore.isAuthenticated" class="write-review">
        <h4>Viết đánh giá của bạn</h4>
        
        <div class="review-form-content">
          <div class="rating-input">
            <span>Điểm đánh giá:</span>
            <div class="stars-input">
              <i v-for="i in 5" :key="i" 
                 :class="['fas fa-star', { 'filled': i <= newReview.rating }]"
                 @click="setRating(i)"
                 @mouseover="hoverRating = i"
                 @mouseleave="hoverRating = 0"
                 :style="{ color: i <= (hoverRating || newReview.rating) ? '#ffc107' : '#ddd' }"></i>
            </div>
            <span class="rating-display">({{ newReview.rating }}/5)</span>
          </div>
          
          <div class="comment-input">
            <label for="review-comment">Bình luận của bạn:</label>
            <textarea 
              id="review-comment"
              v-model="newReview.comment" 
              placeholder="Nhập bình luận của bạn..." 
              rows="4">
            </textarea>
          </div>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #ddd;">
            <div style="padding: 8px 0;">
              <button 
                @click="submitReview" 
                type="button"
                :disabled="!newReview.comment.trim()"
                class="custom-submit-btn">
                <span style="display: inline-block; padding: 0 8px;">Gửi đánh giá</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="login-prompt">
        <p>Vui lòng <router-link to="/login">đăng nhập</router-link> để viết đánh giá.</p>
      </div>
      
      <!-- Reviews List -->
      <div class="reviews-list">
        <h3>Danh sách đánh giá ({{ reviews.length }})</h3>
        
        <div v-if="reviews.length === 0" style="padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #666;">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <strong>{{ review.userName }}</strong>
            <div class="stars">
              <i v-for="i in 5" :key="i" 
                 :class="['fas fa-star', { 'filled': i <= review.rating }]"></i>
            </div>
            <span class="review-date">
              {{ review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : '' }}
            </span>
          </div>
          <p class="review-comment">{{ review.comment }}</p>
        </div>
      </div>
    </div>
    
    <!-- Topping Modal -->
    <ToppingModal
      :is-visible="showToppingModal"
      :product="product"
      @close="showToppingModal = false; isBuyNowMode = false"
      @add-to-cart="handleAddToCart"
    />
  </section>
  
  <div v-else>
    <p>Không tìm thấy sản phẩm</p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useDataStore } from '../stores/data'
import { useNotification } from '../composables/useNotification'
import ToppingModal from './ToppingModal.vue'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const dataStore = useDataStore()
const { showNotification } = useNotification()
const showToppingModal = ref(false)
const isBuyNowMode = ref(false)

// Reviews data
const reviews = ref([])
const newReview = ref({
  rating: 0,
  comment: ''
})
const hoverRating = ref(0)

// Load reviews for current product
const loadReviews = async () => {
  if (!product.value?.id) {
    console.log('❌ No product ID found')
    return
  }
  
  const productId = parseInt(product.value.id)
  console.log('🔄 Loading reviews for product:', productId, 'from product:', product.value.name)
  
  try {
    const url = `http://localhost:3001/reviews?productId=${productId}`
    console.log('📡 API URL:', url)
    
    const response = await fetch(url)
    const reviewsData = await response.json()
    
    console.log('✅ API Response:', reviewsData)
    console.log('📊 Reviews count:', reviewsData.length)
    
    reviews.value = reviewsData
    
    console.log('💾 Reviews stored in reactive:', reviews.value)
  } catch (error) {
    console.error('❌ Error loading reviews:', error)
    reviews.value = []
  }
}

// Computed average rating
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return Math.round(sum / reviews.value.length * 10) / 10
})

// Submit new review
const submitReview = async () => {
  console.log('Submit review clicked')
  console.log('Product:', product.value)
  console.log('Auth user:', authStore.user)
  
  if (!newReview.value.comment.trim()) {
    showNotification('Vui lòng nhập bình luận', 'error')
    return
  }

  if (!authStore.isAuthenticated) {
    showNotification('Vui lòng đăng nhập để đánh giá', 'warning')
    return
  }

  if (!product.value?.id) {
    showNotification('Không tìm thấy thông tin sản phẩm', 'error')
    return
  }

  try {
    const reviewData = {
      productId: parseInt(product.value.id),
      userId: authStore.user.id,
      userName: authStore.user.fullName,
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      createdAt: new Date().toISOString()
    }

    const response = await fetch('http://localhost:3001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    })

    if (response.ok) {
      showNotification('Đánh giá đã được gửi thành công!', 'success')
      newReview.value = { rating: 0, comment: '' }
      loadReviews() // Reload reviews
    }
  } catch (error) {
    showNotification('Có lỗi xảy ra khi gửi đánh giá', 'error')
  }
}

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Set rating
const setRating = (rating) => {
  newReview.value.rating = rating
}

const product = computed(() => {
  const foundProduct = dataStore.products.find(p => p.slug === route.params.slug)
  console.log('Product lookup:', {
    slug: route.params.slug,
    allProducts: dataStore.products.map(p => ({id: p.id, slug: p.slug, name: p.name})),
    foundProduct: foundProduct
  })
  return foundProduct
})

onMounted(async () => {
  await dataStore.initializeData()
  // Force reload reviews
  reviews.value = []
  // Load reviews after product data is available
  if (product.value?.id) {
    await loadReviews()
  }
})

// Watch for product changes and reload reviews
watch(() => product.value?.id, (newId) => {
  if (newId) {
    loadReviews()
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const openToppingModal = () => {
  isBuyNowMode.value = false // Đặt về chế độ thêm vào giỏ hàng
  // Nếu sản phẩm có topping thì mở modal, nếu không thì thêm trực tiếp
  if (product.value?.availableToppings && product.value.availableToppings.length > 0) {
    showToppingModal.value = true
  } else {
    // Thêm trực tiếp vào giỏ hàng nếu không có topping
    if (product.value) {
      cartStore.addToCart(product.value)
      showNotification(`Đã thêm ${product.value.name} vào giỏ hàng`, 'success')
    }
  }
}

const handleAddToCart = (cartItem) => {
  cartStore.addToCartWithToppings(cartItem)
  const toppingsText = cartItem.selectedToppings.length > 0 
    ? ` với ${cartItem.selectedToppings.map(t => t.name).join(', ')}`
    : ''
  showNotification(`Đã thêm ${cartItem.name}${toppingsText} vào giỏ hàng`, 'success')
  
  // Nếu là chế độ "mua ngay", chuyển đến trang thanh toán
  if (isBuyNowMode.value) {
    setTimeout(() => {
      router.push('/checkout')
    }, 500) // Delay nhỏ để user thấy notification
  }
}

const buyNow = () => {
  // Kiểm tra trạng thái đăng nhập trước
  if (!authStore.isAuthenticated) {
    showNotification('Vui lòng đăng nhập để mua hàng', 'warning')
    // Lưu URL hiện tại để redirect sau khi đăng nhập
    router.push({ path: '/login', query: { redirect: '/checkout' } })
    return
  }

  // Đặt chế độ "mua ngay"
  isBuyNowMode.value = true
  
  // Nếu sản phẩm có topping thì mở modal để chọn
  if (product.value?.availableToppings && product.value.availableToppings.length > 0) {
    showToppingModal.value = true
  } else {
    // Nếu không có topping, thêm trực tiếp và chuyển đến checkout
    if (product.value) {
      cartStore.addToCart(product.value)
      showNotification(`Đã thêm ${product.value.name} vào giỏ hàng`, 'success')
      setTimeout(() => {
        router.push('/checkout')
      }, 500)
    }
  }
}
</script>
