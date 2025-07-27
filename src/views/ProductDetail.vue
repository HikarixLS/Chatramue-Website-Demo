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
          <router-link to="/shopping-cart" class="btn">Xem giỏ hàng</router-link>
        </div>
      </div>
    </div>
    
    <!-- Topping Modal -->
    <ToppingModal
      :is-visible="showToppingModal"
      :product="product"
      @close="showToppingModal = false"
      @add-to-cart="handleAddToCart"
    />
  </section>
  
  <div v-else>
    <p>Không tìm thấy sản phẩm</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useNotification } from '../composables/useNotification'
import { products } from '../data/products'
import ToppingModal from '../components/ToppingModal.vue'

const route = useRoute()
const cartStore = useCartStore()
const { showNotification } = useNotification()
const showToppingModal = ref(false)

const product = computed(() => {
  return products.find(p => p.slug === route.params.slug)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const openToppingModal = () => {
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
}
</script>
