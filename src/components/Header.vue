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
    
    <div class="search-icon" @click="toggleSearch">
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>

    <!-- Cart Icon -->
    <div class="cart-icon">
      <router-link to="/shopping-cart">
        <i class="fa-solid fa-shopping-cart"></i>
        <span v-if="cartStore.totalItems > 0" class="cart-count">{{ cartStore.totalItems }}</span>
      </router-link>
    </div>
    
    <div class="search-box" :class="{ active: isSearchActive }">
      <input 
        type="text" 
        v-model="searchQuery"
        @keydown.enter="performSearch"
        @keydown.escape="closeSearch"
        placeholder="Tìm kiếm sản phẩm..."
        ref="searchInput"
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
      style="display:block;position:absolute;top:124px;right:40px;z-index:200;background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.08);min-width:320px;max-width:420px;"
    >
      <router-link 
        v-for="product in searchResults" 
        :key="product.slug"
        :to="`/product/${product.slug}`"
        @click="closeSearch"
        style="display:flex;align-items:center;padding:10px 16px;text-decoration:none;color:#222;gap:12px;border-bottom:1px solid #eee;"
      >
        <img :src="product.image" :alt="product.name" style="width:40px;height:40px;object-fit:contain;border-radius:6px;">
        <span>{{ product.name }}</span>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { products } from '../data/products'

const cartStore = useCartStore()
const isSearchActive = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase()
  return products.filter(product => 
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

const performSearch = () => {
  // Search functionality handled by computed property
  // Results are automatically shown in searchResults computed
}

// Close search when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.search-box') && !e.target.closest('.search-icon') && !e.target.closest('.search-result')) {
    isSearchActive.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
