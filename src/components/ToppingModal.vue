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
            <h4>Chọn kích thước:</h4>
            <div class="option-list">
              <label 
                v-for="option in dataStore.sizeOptions" 
                :key="option.id"
                class="option-item size-option"
              >
                <input 
                  type="radio" 
                  :value="option.id"
                  v-model="selectedSize"
                  name="size-level"
                >
                <span>{{ option.name }}</span>
              </label>
            </div>
          </div>
          
          <div class="option-group">
            <h4>Mức độ đá:</h4>
            <div class="option-list">
              <label 
                v-for="option in dataStore.iceOptions" 
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
                v-for="option in dataStore.sugarOptions" 
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
          Xác nhận - {{ formatPrice(totalPrice) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()

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

onMounted(() => {
  dataStore.initializeData()
})

const emit = defineEmits(['close', 'add-to-cart'])

const selectedToppings = ref([])
const selectedIce = ref('ice-100')
const selectedSugar = ref('sugar-100')
const selectedSize = ref('size-m') // Mặc định chọn size M
const quantity = ref(1)

// Reset selections when modal opens
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    selectedToppings.value = []
    selectedIce.value = 'ice-100'
    selectedSugar.value = 'sugar-100'
    selectedSize.value = 'size-m' // Size M làm mặc định
    quantity.value = 1
  }
})

const availableToppings = computed(() => {
  if (!props.product.availableToppings) return []
  return dataStore.toppings.filter(topping => 
    props.product.availableToppings.includes(topping.id)
  )
})

const selectedToppingsData = computed(() => {
  return dataStore.toppings.filter(topping => 
    selectedToppings.value.includes(topping.id)
  )
})

const toppingsPrice = computed(() => {
  return selectedToppingsData.value.reduce((sum, topping) => sum + topping.price, 0)
})

const selectedSizeData = computed(() => {
  return dataStore.sizeOptions.find(size => size.id === selectedSize.value)
})

const totalPrice = computed(() => {
  const basePrice = props.product.price * selectedSizeData.value.priceMultiplier
  return (basePrice + toppingsPrice.value) * quantity.value
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
  const iceLevel = dataStore.iceOptions.find(ice => ice.id === selectedIce.value)
  const sugarLevel = dataStore.sugarOptions.find(sugar => sugar.id === selectedSugar.value)
  const sizeData = selectedSizeData.value
  
  const cartItem = {
    ...props.product,
    selectedToppings: selectedToppingsData.value,
    iceLevel: iceLevel,
    sugarLevel: sugarLevel,
    size: sizeData,
    toppingsPrice: toppingsPrice.value,
    totalPrice: props.product.price * sizeData.priceMultiplier + toppingsPrice.value,
    quantity: quantity.value,
    // Tạo unique ID cho mỗi item với topping khác nhau
    cartId: `${props.product.id}_${selectedToppings.value.sort().join('_')}_${selectedIce.value}_${selectedSugar.value}_${selectedSize.value}_${Date.now()}`
  }
  
  emit('add-to-cart', cartItem)
  closeModal()
}
</script>


