<template>
  <section class="product-detail" v-if="product">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    
    <div class="product-info">
      <div class="content">
        <h1>{{ product.name }}</h1>
        <div class="rating-summary">
          <div class="stars">
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
        <div class="rating-input">
          <span>Điểm đánh giá:</span>
          <div class="stars-input">
            <i v-for="i in 5" :key="i" 
               :class="['fas fa-star', { 'filled': i <= newReview.rating }]"
               @click="newReview.rating = i"></i>
          </div>
        </div>
        <textarea v-model="newReview.comment" placeholder="Nhập bình luận của bạn..." rows="4"></textarea>
        <button @click="submitReview" class="btn btn-primary">Gửi đánh giá</button>
      </div>
      
      <div v-else class="login-prompt">
        <p>Vui lòng <router-link to="/login">đăng nhập</router-link> để viết đánh giá.</p>
      </div>
      
      <!-- Reviews List -->
      <div class="reviews-list">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <strong>{{ review.userName }}</strong>
            <div class="stars">
              <i v-for="i in 5" :key="i" 
                 :class="['fas fa-star', { 'filled': i <= review.rating }]"></i>
            </div>
            <span class="review-date">{{ formatDate(review.createdAt) }}</span>
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
import { computed, ref, onMounted } from 'vue'
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
  rating: 5,
  comment: ''
})

// Load reviews for current product
const loadReviews = async () => {
  try {
    const response = await fetch(`http://localhost:3001/reviews?productId=${route.params.id}`)
    reviews.value = await response.json()
  } catch (error) {
    console.error('Error loading reviews:', error)
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
  if (!newReview.value.comment.trim()) {
    showNotification('Vui lòng nhập bình luận', 'error')
    return
  }

  try {
    const reviewData = {
      productId: parseInt(route.params.id),
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
      newReview.value = { rating: 5, comment: '' }
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

const product = computed(() => {
  return dataStore.products.find(p => p.slug === route.params.slug)
})

onMounted(() => {
  dataStore.initializeData()
  loadReviews()
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
