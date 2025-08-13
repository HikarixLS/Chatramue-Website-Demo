<template>
  <section class="product-detail" v-if="product">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    
    <div class="product-info">
      <div class="content">
        <h1>{{ product.name }}</h1>
        <div class="rating-summary">
          <div class="stars" :key="`stars-$// Submit new reviewverageRating}`">
            <i v-for="i in 5" :key="i" 
               :class="['fas fa-star', { 'filled': i <= averageRating }]"></i>
          </div>
          <span class="rating-text" v-if="reviews.length > 0">{{ averageRating }}/5 ({{ reviews.length }} đánh giá)</span>
          <span class="rating-text" v-else>Chưa có đánh giá</span>
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
              name="review-comment"
              ref="commentTextarea"
              v-model="commentModel"
              placeholder="Nhập bình luận của bạn..." 
              rows="4"
              autocomplete="off">
            </textarea>
          </div>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #ddd;">
            <div style="padding: 8px 0;">
              <button 
                @click="submitReview" 
                type="button"
                :disabled="!newReview.comment.trim() || isSubmitting"
                class="custom-submit-btn">
                <span style="display: inline-block; padding: 0 8px;">
                  {{ isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
                </span>
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
        <div v-for="review in reviews" :key="review.id" 
             style="
               margin-bottom: 20px; 
               padding: 15px; 
               border: 1px solid #e0e0e0; 
               border-radius: 8px; 
               background: #fff;
               width: 100%;
               box-sizing: border-box;
               overflow: visible;
             ">
          <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <strong style="color: #333;">{{ review.userName }}</strong>
              <div class="stars">
                <i v-for="i in 5" :key="i" 
                   :class="['fas fa-star', { 'filled': i <= review.rating }]"></i>
              </div>
            </div>
            <span style="color: #666; font-size: 0.9rem;">
              {{ formatDate(review.date || review.createdAt) }}
            </span>
          </div>
          <!-- Clean comment display -->
          <div style="margin-top: 10px; padding: 10px 0;">
            <div style="color: #007bff; font-weight: bold; margin-bottom: 5px;">Bình luận:</div>
            <div style="color: #333; font-size: 16px; line-height: 1.5;" v-text="review.comment || 'Không có bình luận'">
            </div>
          </div>
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
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useDataStore } from '../stores/data'
import { useNotification } from '../composables/useNotification'
import ToppingModal from './ToppingModal.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const dataStore = useDataStore()
const { showNotification } = useNotification()
const showToppingModal = ref(false)
const isBuyNowMode = ref(false)
const commentTextarea = ref(null)

// Reviews data
const reviews = ref([])
const newReview = ref({
  rating: 0,
  comment: ''
})
const hoverRating = ref(0)
const isSubmitting = ref(false)

// Load reviews for current product
const loadReviews = async () => {
  if (!product.value?.id) {
    return
  }
  
  const productId = parseInt(product.value.id)
  
  try {
    // Load reviews from localStorage for this product
    const storageKey = `reviews_product_${productId}`
    const savedReviews = localStorage.getItem(storageKey)
    
    let reviewsData = []
    if (savedReviews) {
      try {
        reviewsData = JSON.parse(savedReviews)
      } catch (e) {
        reviewsData = []
      }
    }
    
    reviews.value = reviewsData
  } catch (error) {
    console.error('Error loading reviews:', error)
    reviews.value = []
  }
}

// Computed average rating
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return Math.round(sum / reviews.value.length * 10) / 10
})

// Computed model for textarea
const commentModel = computed({
  get() {
    return newReview.value.comment
  },
  set(value) {
    newReview.value.comment = value
  }
})

// Submit new review
const submitReview = async () => {
  // Prevent double submission
  if (isSubmitting.value) {
    return
  }
  
  isSubmitting.value = true
  
  if (!authStore.isAuthenticated) {
    showNotification('Vui lòng đăng nhập để đánh giá', 'warning')
    isSubmitting.value = false
    return
  }

  if (!product.value?.id) {
    showNotification('Không tìm thấy thông tin sản phẩm', 'error')
    isSubmitting.value = false
    return
  }

  if (newReview.value.rating === 0) {
    showNotification('Vui lòng chọn số sao đánh giá', 'error')
    isSubmitting.value = false
    return
  }

  if (!newReview.value.comment || newReview.value.comment.length === 0) {
    showNotification('Vui lòng nhập bình luận', 'error')
    isSubmitting.value = false
    return
  }

  try {
    const productId = parseInt(product.value.id)
    
    // Removed restriction - users can review multiple times
    // const existingReview = reviews.value.find(r => 
    //   r.userId === authStore.user.id && r.productId === productId
    // )
    // 
    // if (existingReview) {
    //   showNotification('Bạn đã đánh giá sản phẩm này rồi!', 'warning')
    //   isSubmitting.value = false
    //   return
    // }
    
    const reviewData = {
      id: Date.now() + Math.random(), 
      productId: productId,
      userId: authStore.user.id,
      userName: authStore.user.fullName,
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      date: new Date().toISOString().split('T')[0]
    }

    // Thêm review vào array
    reviews.value.unshift(reviewData)
    
    // Save to localStorage
    const storageKey = `reviews_product_${productId}`
    localStorage.setItem(storageKey, JSON.stringify(reviews.value))
    
    showNotification('Đánh giá đã được gửi thành công!', 'success')
    
    // Reset form completely
    newReview.value.rating = 0
    newReview.value.comment = ''
    
    // Force update textarea using nextTick
    await nextTick()
    if (commentTextarea.value) {
      commentTextarea.value.value = ''
      commentTextarea.value.blur()
    }
    
  } catch (error) {
    console.error('Error submitting review:', error)
    showNotification('Có lỗi xảy ra khi gửi đánh giá', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Clear all reviews for testing
const clearReviews = () => {
  if (!product.value?.id) return
  const productId = parseInt(product.value.id)
  const storageKey = `reviews_product_${productId}`
  localStorage.removeItem(storageKey)
  reviews.value = []
}

// Force reset form
const forceResetForm = () => {
  newReview.value.rating = 0
  newReview.value.comment = ''
  nextTick(() => {
    if (commentTextarea.value) {
      commentTextarea.value.value = ''
      commentTextarea.value.focus()
      commentTextarea.value.blur()
    }
  })
}

// Format date
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch (error) {
    return dateString
  }
}

// Set rating
const setRating = (rating) => {
  newReview.value.rating = rating
}

const product = computed(() => {
  const foundProduct = dataStore.products.find(p => p.slug === route.params.slug)
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
