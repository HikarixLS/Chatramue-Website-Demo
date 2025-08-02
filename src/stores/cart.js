import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
    const existingItem = items.value.find(item => 
      item.id === product.id && 
      !item.cartId &&
      (!item.selectedToppings || item.selectedToppings.length === 0)
    )
    
    if (existingItem) {
      existingItem.quantity += quantity
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
