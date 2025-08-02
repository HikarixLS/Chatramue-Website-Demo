<template>
  <div class="product-card">
    <router-link :to="`/product/${product.slug}`">
      <img :src="product.image" :alt="product.name">
    </router-link>
    
    <router-link :to="`/product/${product.slug}`" class="product-name">
      {{ product.name }}
    </router-link>
    
    <div class="product-price">{{ formatPrice(product.price) }}</div>
    
    <div class="product-btn-group">
      <router-link :to="`/product/${product.slug}`" class="buy-btn">
        Xem chi tiết
      </router-link>
      <button class="add-to-cart-btn" @click="openToppingModal">
        Thêm vào giỏ
      </button>
    </div>
    
    <!-- Topping Modal -->
    <ToppingModal
      :is-visible="showToppingModal"
      :product="product"
      @close="showToppingModal = false"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useNotification } from '../composables/useNotification'
import ToppingModal from './ToppingModal.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const { showNotification } = useNotification()
const showToppingModal = ref(false)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const openToppingModal = () => {
  // Nếu sản phẩm có topping thì mở modal, nếu không thì thêm trực tiếp
  if (props.product.availableToppings && props.product.availableToppings.length > 0) {
    showToppingModal.value = true
  } else {
    // Thêm trực tiếp vào giỏ hàng nếu không có topping
    cartStore.addToCart(props.product)
    showNotification(`Đã thêm ${props.product.name} vào giỏ hàng`, 'success')
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
