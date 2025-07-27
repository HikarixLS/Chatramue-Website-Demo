<template>
  <div v-if="isVisible" class="topping-modal-overlay" @click="closeModal">
    <div class="topping-modal" @click.stop>
      <div class="modal-header">
        <h3>Chọn topping cho {{ product.name }}</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div class="product-info">
          <img :src="product.image" :alt="product.name" class="product-image">
          <div class="product-details">
            <h4>{{ product.name }}</h4>
            <p class="base-price">Giá gốc: {{ formatPrice(product.price) }}</p>
          </div>
        </div>
        
        <div class="toppings-section">
          <h4>Chọn topping (tùy chọn):</h4>
          <div class="toppings-list">
            <label 
              v-for="topping in availableToppings" 
              :key="topping.id"
              class="topping-item"
            >
              <input 
                type="checkbox" 
                :value="topping.id"
                v-model="selectedToppings"
              >
              <span class="topping-name">{{ topping.name }}</span>
              <span class="topping-price">+{{ formatPrice(topping.price) }}</span>
            </label>
          </div>
        </div>
        
        <div class="options-section">
          <div class="option-group">
            <h4>Mức độ đá:</h4>
            <div class="option-list">
              <label 
                v-for="option in iceOptions" 
                :key="option.id"
                class="option-item"
              >
                <input 
                  type="radio" 
                  :value="option.id"
                  v-model="selectedIce"
                  name="ice-level"
                >
                <span>{{ option.name }}</span>
              </label>
            </div>
          </div>
          
          <div class="option-group">
            <h4>Mức độ đường:</h4>
            <div class="option-list">
              <label 
                v-for="option in sugarOptions" 
                :key="option.id"
                class="option-item"
              >
                <input 
                  type="radio" 
                  :value="option.id"
                  v-model="selectedSugar"
                  name="sugar-level"
                >
                <span>{{ option.name }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="quantity-section">
          <label for="quantity">Số lượng:</label>
          <div class="quantity-controls">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
            <input 
              type="number" 
              id="quantity"
              v-model.number="quantity" 
              min="1" 
              max="10"
            >
            <button @click="increaseQuantity" :disabled="quantity >= 10">+</button>
          </div>
        </div>
        
        <div class="total-price">
          <strong>Tổng cộng: {{ formatPrice(totalPrice) }}</strong>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">Hủy</button>
        <button class="add-to-cart-btn" @click="addToCart">
          Thêm vào giỏ hàng - {{ formatPrice(totalPrice) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { toppings, iceOptions, sugarOptions } from '../data/products'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const selectedToppings = ref([])
const selectedIce = ref('ice-100')
const selectedSugar = ref('sugar-100')
const quantity = ref(1)

// Reset selections when modal opens
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    selectedToppings.value = []
    selectedIce.value = 'ice-100'
    selectedSugar.value = 'sugar-100'
    quantity.value = 1
  }
})

const availableToppings = computed(() => {
  if (!props.product.availableToppings) return []
  return toppings.filter(topping => 
    props.product.availableToppings.includes(topping.id)
  )
})

const selectedToppingsData = computed(() => {
  return toppings.filter(topping => 
    selectedToppings.value.includes(topping.id)
  )
})

const toppingsPrice = computed(() => {
  return selectedToppingsData.value.reduce((sum, topping) => sum + topping.price, 0)
})

const totalPrice = computed(() => {
  return (props.product.price + toppingsPrice.value) * quantity.value
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const increaseQuantity = () => {
  if (quantity.value < 10) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const closeModal = () => {
  emit('close')
}

const addToCart = () => {
  const iceLevel = iceOptions.find(ice => ice.id === selectedIce.value)
  const sugarLevel = sugarOptions.find(sugar => sugar.id === selectedSugar.value)
  
  const cartItem = {
    ...props.product,
    selectedToppings: selectedToppingsData.value,
    iceLevel: iceLevel,
    sugarLevel: sugarLevel,
    toppingsPrice: toppingsPrice.value,
    totalPrice: props.product.price + toppingsPrice.value,
    quantity: quantity.value,
    // Tạo unique ID cho mỗi item với topping khác nhau
    cartId: `${props.product.id}_${selectedToppings.value.sort().join('_')}_${selectedIce.value}_${selectedSugar.value}_${Date.now()}`
  }
  
  emit('add-to-cart', cartItem)
  closeModal()
}
</script>

<style scoped>
.topping-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.topping-modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.product-info {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  background: #f9f9f9;
}

.product-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.base-price {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.toppings-section {
  margin-bottom: 20px;
}

.toppings-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.toppings-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.topping-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.topping-item:hover {
  border-color: #d62828;
  background: #fafafa;
}

.topping-item input[type="checkbox"] {
  margin-right: 10px;
}

.topping-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.topping-price {
  font-size: 14px;
  color: #d62828;
  font-weight: 500;
}

.options-section {
  margin-bottom: 20px;
}

.option-group {
  margin-bottom: 15px;
}

.option-group h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.option-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  background: white;
}

.option-item:hover {
  border-color: #d62828;
  background: #fafafa;
}

.option-item input[type="radio"] {
  margin-right: 8px;
}

.option-item input[type="radio"]:checked + span {
  color: #d62828;
  font-weight: 500;
}

.quantity-section {
  margin-bottom: 20px;
}

.quantity-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  width: 35px;
  height: 35px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-controls button:hover:not(:disabled) {
  background: #f0f0f0;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 60px;
  height: 35px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.total-price {
  text-align: center;
  font-size: 18px;
  color: #d62828;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.cancel-btn, .add-to-cart-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn {
  background: #f0f0f0;
  color: #333;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.add-to-cart-btn {
  background: var(--btn-bg);
  color: white;
}

.add-to-cart-btn:hover {
  background: var(--btn-hover-bg);
}

@media (max-width: 480px) {
  .topping-modal {
    margin: 10px;
    max-width: none;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 15px;
  }
  
  .product-info {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>
