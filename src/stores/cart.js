import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { validateCartItem } from '../utils/validation.js'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart')) || [])

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      const itemPrice = item.totalPrice || item.price
      return sum + (itemPrice * item.quantity)
    }, 0)
  })

  function addToCart(product, quantity = 1) {
    // Validate product before adding
    const validationError = validateCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    })
    
    if (validationError) {
      throw new Error(validationError)
    }
    
    // Validate quantity limits
    if (quantity > 10) {
      throw new Error('Số lượng mỗi sản phẩm không được quá 10')
    }
    
    const existingItem = items.value.find(item => 
      item.id === product.id && 
      !item.cartId &&
      (!item.selectedToppings || item.selectedToppings.length === 0)
    )
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity > 10) {
        throw new Error('Tổng số lượng sản phẩm này trong giỏ hàng không được quá 10')
      }
      existingItem.quantity = newQuantity
    } else {
      items.value.push({
        ...product,
        quantity,
        selectedToppings: [],
        toppingsPrice: 0,
        totalPrice: product.price,
        cartId: `${product.id}_simple_${Date.now()}`
      })
    }
    
    saveToLocalStorage()
  }

  function addToCartWithToppings(cartItem) {
    // Luôn thêm item mới với topping (không merge với item cũ)
    items.value.push(cartItem)
    saveToLocalStorage()
  }

  function removeFromCart(productId) {
    const index = items.value.findIndex(item => item.cartId === productId || item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.cartId === productId || item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
  }

  function clearCart() {
    items.value = []
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    addToCartWithToppings,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})
