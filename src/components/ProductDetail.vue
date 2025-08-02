<template>
  <section class="product-detail" v-if="product">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    
    <div class="product-info">
      <div class="content">
        <h1>{{ product.name }}</h1>
        <p class="description">{{ product.description }}</p>
        <p><strong>Giá:</strong> {{ formatPrice(product.price) }}</p>
        
        <div class="button-group">
          <button class="btn" @click="openToppingModal">Thêm vào giỏ hàng</button>
          <button class="btn btn-primary" @click="buyNow">Mua ngay</button>
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

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const dataStore = useDataStore()
const { showNotification } = useNotification()
const showToppingModal = ref(false)
const isBuyNowMode = ref(false) // Để phân biệt giữa "thêm vào giỏ" và "mua ngay"

const product = computed(() => {
  return dataStore.products.find(p => p.slug === route.params.slug)
})

onMounted(() => {
  dataStore.initializeData()
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
