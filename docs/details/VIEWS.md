### 📄 Views Directory (Pages)

#### `src/views/Home.vue`
```vue
<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Chào mừng đến với ChaTraMue</h1>
        <p>Thưởng thức hương vị trà sữa Thái Lan chính thống</p>
        <router-link to="/products" class="cta-button">
          Khám phá menu
        </router-link>
      </div>
      <div class="hero-image">
        <img src="/assets/images/Banner.jpg" alt="ChaTraMue Banner">
      </div>
    </section>
    
    <!-- Featured Products -->
    <section class="featured-products">
      <div class="container">
        <h2>Sản phẩm nổi bật</h2>
        <div class="products-grid">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>
    
    <!-- About Preview -->
    <section class="about-preview">
      <div class="container">
        <div class="about-content">
          <h2>Về ChaTraMue</h2>
          <p>Được thành lập từ năm 1945 tại Thái Lan, ChaTraMue là thương hiệu trà được yêu thích nhất...</p>
          <router-link to="/about" class="learn-more-btn">
            Tìm hiểu thêm
          </router-link>
        </div>
        <div class="about-image">
          <img src="/assets/images/about-preview.jpg" alt="About ChaTraMue">
        </div>
      </div>
    </section>
    
    <!-- Store Locations -->
    <section class="store-locations">
      <div class="container">
        <h2>Cửa hàng của chúng tôi</h2>
        <div class="stores-grid">
          <div v-for="store in stores" :key="store.id" class="store-card">
            <h3>{{ store.name }}</h3>
            <p>{{ store.address }}</p>
            <p>{{ store.phone }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { products } from '../data/products.js'

// Reactive data
const featuredProducts = ref([])
const stores = ref([
  {
    id: 1,
    name: 'ChaTraMue Hà Nội',
    address: '123 Phố Cầu Gỗ, Hoàn Kiếm, Hà Nội',
    phone: '024-3826-1234'
  },
  {
    id: 2,
    name: 'ChaTraMue TP.HCM',
    address: '456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    phone: '028-3822-5678'
  },
  {
    id: 3,
    name: 'ChaTraMue Đà Nẵng',
    address: '789 Đường Bạch Đằng, Hải Châu, Đà Nẵng',
    phone: '0236-3888-9999'
  }
])

// Lifecycle
onMounted(() => {
  // Get first 6 products as featured
  featuredProducts.value = products.slice(0, 6)
})
</script>
```

**Chức năng:**
- Hero section với call-to-action
- Featured products showcase
- About company preview
- Store locations display
- Navigation to other pages

#### `src/views/Products.vue`
```vue
<template>
  <div class="products-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1>Sản phẩm ChaTraMue</h1>
      <p>Khám phá bộ sưu tập trà sữa Thái Lan chính thống</p>
    </div>
    
    <!-- Filters -->
    <div class="filters-section">
      <div class="container">
        <!-- Category Filter -->
        <div class="filter-group">
          <label>Danh mục:</label>
          <select v-model="selectedCategory" @change="filterProducts">
            <option value="">Tất cả</option>
            <option value="trà-sữa">Trà sữa</option>
            <option value="trà-xanh">Trà xanh</option>
            <option value="trà-đặc-biệt">Trà đặc biệt</option>
          </select>
        </div>
        
        <!-- Price Filter -->
        <div class="filter-group">
          <label>Giá:</label>
          <select v-model="selectedPriceRange" @change="filterProducts">
            <option value="">Tất cả</option>
            <option value="0-50000">Dưới 50,000đ</option>
            <option value="50000-100000">50,000đ - 100,000đ</option>
            <option value="100000-999999">Trên 100,000đ</option>
          </select>
        </div>
        
        <!-- Search -->
        <div class="filter-group">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="filterProducts"
            placeholder="Tìm kiếm sản phẩm..."
          >
        </div>
      </div>
    </div>
    
    <!-- Products Grid -->
    <div class="products-section">
      <div class="container">
        <div v-if="filteredProducts.length === 0" class="no-products">
          <p>Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
        
        <div v-else class="products-grid">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { products } from '../data/products.js'

// Reactive data
const allProducts = ref([])
const selectedCategory = ref('')
const selectedPriceRange = ref('')
const searchQuery = ref('')

// Computed properties
const filteredProducts = computed(() => {
  let filtered = [...allProducts.value]
  
  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }
  
  // Filter by price range
  if (selectedPriceRange.value) {
    const [min, max] = selectedPriceRange.value.split('-').map(Number)
    filtered = filtered.filter(product => {
      return product.price >= min && product.price <= (max || Infinity)
    })
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Methods
const filterProducts = () => {
  // Trigger computed property update
}

// Lifecycle
onMounted(() => {
  allProducts.value = products
})
</script>
```

**Chức năng:**
- Display all products in grid
- Category filtering
- Price range filtering
- Search functionality
- No results state
- Responsive grid layout

#### `src/views/ProductDetail.vue`
```vue
<template>
  <div v-if="product" class="product-detail-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/">Trang chủ</router-link>
      <span>/</span>
      <router-link to="/products">Sản phẩm</router-link>
      <span>/</span>
      <span>{{ product.name }}</span>
    </div>
    
    <!-- Product Detail -->
    <div class="product-detail">
      <div class="container">
        <!-- Product Image -->
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
        </div>
        
        <!-- Product Info -->
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <div class="product-price">{{ formatPrice(product.price) }}</div>
          
          <div class="product-description">
            <h3>Mô tả sản phẩm</h3>
            <p>{{ product.description }}</p>
          </div>
          
          <div class="product-ingredients" v-if="product.ingredients">
            <h3>Thành phần</h3>
            <ul>
              <li v-for="ingredient in product.ingredients" :key="ingredient">
                {{ ingredient }}
              </li>
            </ul>
          </div>
          
          <!-- Action Buttons -->
          <div class="product-actions">
            <div class="quantity-selector">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <span>{{ quantity }}</span>
              <button @click="increaseQuantity">+</button>
            </div>
            
            <button @click="showToppingModal = true" class="customize-btn">
              Tùy chỉnh
            </button>
            
            <button @click="addToCart" class="add-to-cart-btn">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Related Products -->
    <div class="related-products">
      <div class="container">
        <h2>Sản phẩm tương tự</h2>
        <div class="products-grid">
          <ProductCard 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id"
            :product="relatedProduct"
          />
        </div>
      </div>
    </div>
    
    <!-- Topping Modal -->
    <ToppingModal 
      :show="showToppingModal"
      :product="product"
      @close="showToppingModal = false"
    />
  </div>
  
  <!-- Product Not Found -->
  <div v-else class="product-not-found">
    <h2>Sản phẩm không tồn tại</h2>
    <router-link to="/products">Quay lại danh sách sản phẩm</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import ProductCard from '../components/ProductCard.vue'
import ToppingModal from '../components/ToppingModal.vue'
import { products } from '../data/products.js'

const route = useRoute()
const cartStore = useCartStore()

// Reactive data
const product = ref(null)
const quantity = ref(1)
const showToppingModal = ref(false)

// Computed properties
const relatedProducts = computed(() => {
  if (!product.value) return []
  
  return products
    .filter(p => p.id !== product.value.id && p.category === product.value.category)
    .slice(0, 4)
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
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
    ...product.value,
    quantity: quantity.value,
    toppings: [],
    ice: 100,
    sugar: 100
  }
  
  cartStore.addItem(cartItem)
}

// Lifecycle
onMounted(() => {
  const productId = route.params.id
  product.value = products.find(p => p.id === productId)
})
</script>
```

**Chức năng:**
- Dynamic route parameter handling
- Product detail display
- Image gallery
- Quantity selection
- Add to cart functionality
- Topping customization modal
- Related products suggestions
- Breadcrumb navigation
- 404 handling cho invalid products