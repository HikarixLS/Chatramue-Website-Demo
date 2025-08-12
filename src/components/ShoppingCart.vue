<template>
  <div class="cart-container">
    <h2>Giỏ hàng của bạn</h2>
    <router-link to="/products" class="continue-shopping">← Tiếp tục mua sắm</router-link>
    
    <div v-if="cartStore.items.length === 0">
      <p style="text-align: center; margin: 40px 0;">Giỏ hàng của bạn đang trống</p>
    </div>
    
    <div v-else>
      <div class="cart-table-wrapper">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartStore.items" :key="item.id">
              <td>
                <div class="cart-product">
                  <img :src="getProductImage(item.image)" :alt="item.name">
                  <div>
                    <div class="cart-product-name">{{ item.name }}</div>
                    <div v-if="item.size" class="cart-options">
                      <small>Size: {{ item.size.value }}</small>
                    </div>
                    <div v-if="item.selectedToppings && item.selectedToppings.length > 0" class="cart-toppings">
                      <small>Topping: {{ getToppingNames(item.selectedToppings) }}</small>
                    </div>
                    <div v-if="item.iceLevel" class="cart-options">
                      <small>Đá: {{ item.iceLevel.name }}</small>
                    </div>
                    <div v-if="item.sugarLevel" class="cart-options">
                      <small>Đường: {{ item.sugarLevel.name }}</small>
                    </div>
                    <span class="cart-remove" @click="cartStore.removeFromCart(item.cartId || item.id)">
                      Xóa
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <div class="price-breakdown">
                  <div>{{ formatPrice(item.price) }}</div>
                  <div v-if="item.toppingsPrice > 0" class="topping-price">
                    +{{ formatPrice(item.toppingsPrice) }}
                  </div>
                  <div class="item-total">= {{ formatPrice(item.totalPrice || item.price) }}</div>
                </div>
              </td>
              <td>
                <input 
                  type="number" 
                  class="cart-qty" 
                  :value="item.quantity"
                  @change="updateQuantity(item.cartId || item.id, $event.target.value)"
                  min="1"
                >
              </td>
              <td>{{ formatPrice((item.totalPrice || item.price) * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="cart-summary">
        <div>
          <div class="subtotal-label">Tổng cộng:</div>
          <div class="subtotal-value">{{ formatPrice(cartStore.totalPrice) }}</div>
        </div>
        <router-link to="/checkout" class="checkout-btn">Thanh toán</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { getImagePath } from '../utils/imageUtils'

const cartStore = useCartStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const updateQuantity = (productId, quantity) => {
  const qty = parseInt(quantity)
  if (qty > 0) {
    cartStore.updateQuantity(productId, qty)
  }
}

const getToppingNames = (toppings) => {
  return toppings.map(t => t.name).join(', ')
}

// Helper function để lấy correct image path
const getProductImage = (imagePath) => {
  return getImagePath(imagePath)
}
</script>
