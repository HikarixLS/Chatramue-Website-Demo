<template>
  <header>
    <div class="logo">
      <router-link to="/">
        <img src="/images/ChaTraMue2_a1f8934c-a3cc-46da-a2be-58cc9f716369_300x300.png" alt="ChaTraMue Logo">
      </router-link>
    </div>
    
    <nav>
      <ul>
        <li><router-link to="/">Trang chủ</router-link></li>
        <li><router-link to="/about">Giới thiệu</router-link></li>
        <li class="dropdown">
          <router-link to="/products" class="dropbtn">Sản phẩm</router-link>
          <ul class="dropdown-content">
            <li><router-link to="/product/tra-sua-thai-xanh">Trà Thái Xanh</router-link></li>
            <li><router-link to="/product/tra-sua-thai-do">Trà Thái Đỏ</router-link></li>
            <li><router-link to="/product/tra-sua-hoa-hong">Trà Sữa Hoa Hồng</router-link></li>
            <li><router-link to="/product/tra-oolong">Trà Ô Long</router-link></li>
            <li><router-link to="/product/tra-chanh">Trà Chanh Mật Ong</router-link></li>
            <li><router-link to="/product/tra-hoa-nhai">Trà Hoa Nhài</router-link></li>
          </ul>
        </li>
        <li><router-link to="/contact">Liên hệ</router-link></li>
      </ul>
    </nav>
    
    <!-- Cart Icon -->
    <div class="cart-icon">
      <router-link to="/shopping-cart">
        <i class="fa-solid fa-shopping-cart"></i>
        <span v-if="cartStore.totalItems > 0" class="cart-count">{{ cartStore.totalItems }}</span>
      </router-link>
    </div>

    <!-- Auth Menu -->
    <div class="auth-menu">
      <div v-if="authStore.isAuthenticated" class="user-menu">
        <div class="user-avatar" @click="toggleUserMenu">
          <i class="fas fa-user"></i>
          <span>{{ authStore.userDisplayName }}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="user-dropdown" :class="{ active: isUserMenuActive }">
          <router-link to="/profile" @click="closeUserMenu">
            <i class="fas fa-user"></i>
            Tài khoản của tôi
          </router-link>
          <router-link to="/profile?tab=orders" @click="closeUserMenu">
            <i class="fas fa-shopping-bag"></i>
            Đơn hàng của tôi
          </router-link>
          <button @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            Đăng xuất
          </button>
        </div>
      </div>
      <div v-else class="auth-links">
        <router-link to="/login" class="login-btn">Đăng nhập</router-link>
        <router-link to="/register" class="register-btn">Đăng ký</router-link>
      </div>
    </div>
    
    <div class="search-icon" @click="toggleSearch">
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>
    
    <div class="search-box" :class="{ active: isSearchActive }">
      <input 
        type="text" 
        id="header-search"
        name="search"
        v-model="searchQuery"
        @keydown.enter="performSearch"
        @keydown.escape="closeSearch"
        placeholder="Tìm kiếm sản phẩm..."
        ref="searchInput"
        autocomplete="off"
      >
      <button @click="performSearch">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <button @click="closeSearch" type="button">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    
    <div 
      v-if="searchResults.length > 0 && isSearchActive" 
      class="search-result"
    >
      <router-link 
        v-for="product in searchResults" 
        :key="product.slug"
        :to="`/product/${product.slug}`"
        @click="closeSearch"
        class="search-result-item"
      >
        <img :src="product.image" :alt="product.name" class="search-result-image">
        <span class="search-result-name">{{ product.name }}</span>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useDataStore } from '../stores/data'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const dataStore = useDataStore()
const { showNotification } = useNotification()

const isSearchActive = ref(false)
const isUserMenuActive = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase()
  return dataStore.products.filter(product => 
    product.name.toLowerCase().includes(query)
  ).slice(0, 5)
})

const toggleSearch = async () => {
  isSearchActive.value = true
  await nextTick()
  searchInput.value?.focus()
}

const closeSearch = () => {
  isSearchActive.value = false
  searchQuery.value = ''
}

const toggleUserMenu = () => {
  isUserMenuActive.value = !isUserMenuActive.value
}

const closeUserMenu = () => {
  isUserMenuActive.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeUserMenu()
  showNotification('Đăng xuất thành công!', 'success')
  router.push('/')
}

const performSearch = () => {
  // Search functionality handled by computed property
  // Results are automatically shown in searchResults computed
}

// Close dropdowns when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.search-box') && !e.target.closest('.search-icon') && !e.target.closest('.search-result')) {
    isSearchActive.value = false
  }
  if (!e.target.closest('.user-menu')) {
    isUserMenuActive.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Check auth status on mount
  authStore.checkAuthStatus()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
