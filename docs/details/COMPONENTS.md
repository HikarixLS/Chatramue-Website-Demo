### 🧩 Components Directory

#### `src/components/Header.vue`
```vue
<template>
  <header class="main-header">
    <!-- Logo -->
    <div class="logo">
      <router-link to="/">
        <img src="/assets/images/logo.png" alt="ChaTraMue">
      </router-link>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="main-nav">
      <ul>
        <li><router-link to="/" :class="{ active: $route.path === '/' }">Trang chủ</router-link></li>
        <li><router-link to="/about" :class="{ active: $route.path === '/about' }">Giới thiệu</router-link></li>
        <li><router-link to="/products" :class="{ active: $route.path === '/products' }">Sản phẩm</router-link></li>
        <li><router-link to="/contact" :class="{ active: $route.path === '/contact' }">Liên hệ</router-link></li>
      </ul>
    </nav>
    
    <!-- Shopping Cart -->
    <div class="cart-icon" @click="$router.push('/cart')">
      <i class="fas fa-shopping-cart"></i>
      <span v-if="cartStore.totalItems > 0" class="cart-badge">
        {{ cartStore.totalItems }}
      </span>
    </div>
    
    <!-- Mobile Menu Toggle -->
    <div class="mobile-menu-toggle" @click="toggleMobileMenu">
      <i class="fas fa-bars"></i>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>
```

**Chức năng:**
- Navigation menu với active states
- Shopping cart icon với badge count
- Mobile responsive hamburger menu
- Logo và branding
- Vue Router integration

#### `src/components/ProductCard.vue`
```vue
<template>
  <div class="product-card" @click="goToProduct">
    <!-- Product Image -->
    <div class="product-image">
      <img :src="product.image" :alt="product.name" loading="lazy">
      <div class="product-overlay">
        <button @click.stop="addToCart" class="quick-add-btn">
          <i class="fas fa-plus"></i>
          Thêm vào giỏ
        </button>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="product-description">{{ truncatedDescription }}</p>
      <div class="product-price">{{ formatPrice(product.price) }}</div>
      
      <!-- Product Tags -->
      <div class="product-tags">
        <span v-for="tag in product.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()

// Computed properties
const truncatedDescription = computed(() => {
  return props.product.description.length > 100 
    ? props.product.description.substring(0, 100) + '...'
    : props.product.description
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const goToProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const addToCart = () => {
  cartStore.addItem({
    ...props.product,
    quantity: 1,
    toppings: [],
    ice: 100,
    sugar: 100
  })
}
</script>
```

**Chức năng:**
- Hiển thị thông tin sản phẩm
- Hover effects và overlay
- Quick add to cart functionality
- Navigate to product detail
- Price formatting Việt Nam
- Responsive design

#### `src/components/ToppingModal.vue`
```vue
<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <h2>Tùy chỉnh {{ product.name }}</h2>
        <button @click="closeModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Product Summary -->
      <div class="product-summary">
        <img :src="product.image" :alt="product.name">
        <div>
          <h3>{{ product.name }}</h3>
          <p>{{ formatPrice(product.price) }}</p>
        </div>
      </div>
      
      <!-- Topping Selection -->
      <div class="selection-group">
        <h3>Chọn topping</h3>
        <div class="topping-options">
          <label v-for="topping in toppingOptions" :key="topping.id">
            <input 
              type="checkbox" 
              :value="topping" 
              v-model="selectedToppings"
              @change="updateTotalPrice"
            >
            <span>{{ topping.name }} (+{{ formatPrice(topping.price) }})</span>
          </label>
        </div>
      </div>
      
      <!-- Ice Level -->
      <div class="selection-group">
        <h3>Độ đá</h3>
        <div class="level-options">
          <label v-for="level in iceLevels" :key="level">
            <input type="radio" :value="level" v-model="selectedIce">
            <span>{{ level }}%</span>
          </label>
        </div>
      </div>
      
      <!-- Sugar Level -->
      <div class="selection-group">
        <h3>Độ ngọt</h3>
        <div class="level-options">
          <label v-for="level in sugarLevels" :key="level">
            <input type="radio" :value="level" v-model="selectedSugar">
            <span>{{ level }}%</span>
          </label>
        </div>
      </div>
      
      <!-- Quantity -->
      <div class="quantity-section">
        <h3>Số lượng</h3>
        <div class="quantity-controls">
          <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity">+</button>
        </div>
      </div>
      
      <!-- Total Price -->
      <div class="total-price">
        <strong>Tổng: {{ formatPrice(totalPrice) }}</strong>
      </div>
      
      <!-- Action Buttons -->
      <div class="modal-actions">
        <button @click="closeModal" class="cancel-btn">Hủy</button>
        <button @click="addToCart" class="add-to-cart-btn">
          Thêm vào giỏ - {{ formatPrice(totalPrice) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  show: Boolean,
  product: Object
})

const emit = defineEmits(['close'])

const cartStore = useCartStore()

// Reactive data
const selectedToppings = ref([])
const selectedIce = ref(100)
const selectedSugar = ref(100)
const quantity = ref(1)

// Options data
const toppingOptions = [
  { id: 1, name: 'Thạch matcha', price: 5000 },
  { id: 2, name: 'Trân châu đen', price: 5000 },
  { id: 3, name: 'Pudding', price: 8000 },
  { id: 4, name: 'Kem cheese', price: 10000 }
]

const iceLevels = [0, 25, 50, 75, 100]
const sugarLevels = [0, 25, 50, 75, 100]

// Computed properties
const totalPrice = computed(() => {
  let base = props.product?.price || 0
  let toppingPrice = selectedToppings.value.reduce((sum, topping) => sum + topping.price, 0)
  return (base + toppingPrice) * quantity.value
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  selectedToppings.value = []
  selectedIce.value = 100
  selectedSugar.value = 100
  quantity.value = 1
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  const cartItem = {
    ...props.product,
    quantity: quantity.value,
    toppings: selectedToppings.value,
    ice: selectedIce.value,
    sugar: selectedSugar.value,
    totalPrice: totalPrice.value
  }
  
  cartStore.addItem(cartItem)
  closeModal()
}

// Watch for modal visibility
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm()
  }
})
</script>
```

**Chức năng:**
- Modal popup cho customization
- Topping selection với giá
- Ice và sugar level selection
- Quantity controls
- Real-time price calculation
- Form validation và reset
- Add to cart với customization

#### `src/components/Footer.vue`
```vue
<template>
  <footer class="main-footer">
    <!-- Footer Content -->
    <div class="footer-content">
      <!-- Company Info -->
      <div class="footer-section">
        <h3>ChaTraMue</h3>
        <p>Thương hiệu trà sữa Thái Lan được yêu thích nhất Việt Nam</p>
        <div class="social-links">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
      
      <!-- Quick Links -->
      <div class="footer-section">
        <h4>Liên kết nhanh</h4>
        <ul>
          <li><router-link to="/">Trang chủ</router-link></li>
          <li><router-link to="/products">Sản phẩm</router-link></li>
          <li><router-link to="/about">Giới thiệu</router-link></li>
          <li><router-link to="/contact">Liên hệ</router-link></li>
        </ul>
      </div>
      
      <!-- Store Locations -->
      <div class="footer-section">
        <h4>Cửa hàng</h4>
        <ul>
          <li>Hà Nội: 123 Phố Cầu Gỗ</li>
          <li>TP.HCM: 456 Đường Nguyễn Huệ</li>
          <li>Đà Nẵng: 789 Đường Bạch Đằng</li>
        </ul>
      </div>
      
      <!-- Contact Info -->
      <div class="footer-section">
        <h4>Liên hệ</h4>
        <ul>
          <li><i class="fas fa-phone"></i> 1900-1234</li>
          <li><i class="fas fa-envelope"></i> info@chatramue.vn</li>
          <li><i class="fas fa-clock"></i> 8:00 - 22:00 hàng ngày</li>
        </ul>
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="footer-bottom">
      <p>&copy; 2025 ChaTraMue Vietnam. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
// Footer component không cần reactive data
</script>
```

**Chức năng:**
- Company information và branding
- Quick navigation links
- Store locations
- Contact information
- Social media links
- Copyright notice