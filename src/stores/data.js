import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api.js'
import { sanitizeInput } from '../utils/validation.js'
import { updateProductImages, updateBannerImages } from '../utils/imageUtils.js'
import { products as staticProducts, toppings as staticToppings, iceOptions as staticIceOptions, sugarOptions as staticSugarOptions, sizeOptions as staticSizeOptions, bannerImages as staticBanners } from '../data/products.js'

export const useDataStore = defineStore('data', () => {
  console.log('Data store initialized')
  
  const isApiAvailable = ref(false)
  const products = ref([])
  const toppings = ref([])
  const iceOptions = ref([])
  const sugarOptions = ref([])
  const sizeOptions = ref([])
  const bannerImages = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Check API availability
  const checkApiHealth = async () => {
    try {
      isApiAvailable.value = await api.checkHealth()
      return isApiAvailable.value
    } catch (error) {
      isApiAvailable.value = false
      return false
    }
  }

  // Load products
  const loadProducts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      if (isApiAvailable.value) {
        const apiProducts = await api.products.getAll()
        products.value = updateProductImages(apiProducts)
      } else {
        // Fallback to static data with updated image paths
        products.value = updateProductImages(staticProducts)
      }
    } catch (err) {
      error.value = err.message
      // Fallback to static data on error with updated image paths
      products.value = updateProductImages(staticProducts)
    } finally {
      isLoading.value = false
    }
  }

  // Load toppings
  const loadToppings = async () => {
    try {
      if (isApiAvailable.value) {
        toppings.value = await api.toppings.getAll()
      } else {
        toppings.value = staticToppings
      }
    } catch (err) {
      toppings.value = staticToppings
    }
  }

  // Load options
  const loadOptions = async () => {
    try {
      if (isApiAvailable.value) {
        const [ice, sugar, size] = await Promise.all([
          api.options.getIceOptions(),
          api.options.getSugarOptions(),
          api.options.getSizeOptions()
        ])
        iceOptions.value = ice
        sugarOptions.value = sugar
        sizeOptions.value = size
      } else {
        iceOptions.value = staticIceOptions
        sugarOptions.value = staticSugarOptions
        sizeOptions.value = staticSizeOptions
      }
    } catch (err) {
      iceOptions.value = staticIceOptions
      sugarOptions.value = staticSugarOptions
      sizeOptions.value = staticSizeOptions
    }
  }

  // Load banner images
  const loadBanners = async () => {
    try {
      if (isApiAvailable.value) {
        const apiBanners = await api.bannerImages.getAll()
        bannerImages.value = updateBannerImages(apiBanners).map(b => b.src)
      } else {
        const updatedBanners = updateBannerImages(staticBanners)
        bannerImages.value = updatedBanners.map(b => b.src)
      }
    } catch (err) {
      const updatedBanners = updateBannerImages(staticBanners)
      bannerImages.value = updatedBanners.map(b => b.src)
    }
  }

  // Initialize all data
  const initializeData = async () => {
    console.log('Initializing data...')
    console.log('Static products:', staticProducts)
    
    // Load static data first với image paths đã được cập nhật
    products.value = updateProductImages(staticProducts)
    toppings.value = staticToppings
    iceOptions.value = staticIceOptions
    sugarOptions.value = staticSugarOptions
    sizeOptions.value = staticSizeOptions
    const updatedBanners = updateBannerImages(staticBanners)
    bannerImages.value = updatedBanners.map(b => b.src)
    
    console.log('Static data loaded:', {
      products: products.value.length,
      bannerImages: bannerImages.value.length
    })
    
    // Sau đó thử load từ API (không blocking)
    checkApiHealth().then(() => {
      if (isApiAvailable.value) {
        loadProducts()
        loadToppings()
        loadOptions()
        loadBanners()
      }
    })
  }

  // Get product by slug
  const getProductBySlug = async (slug) => {
    if (products.value.length === 0) {
      await loadProducts()
    }
    return products.value.find(p => p.slug === slug)
  }

  // Get featured products
  const getFeaturedProducts = async () => {
    if (products.value.length === 0) {
      await loadProducts()
    }
    return products.value.filter(p => p.featured)
  }

  // Search products
  const searchProducts = async (query) => {
    if (products.value.length === 0) {
      await loadProducts()
    }
    
    // Sanitize search query
    const sanitizedQuery = sanitizeInput(query);
    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      return [];
    }
    
    const lowerQuery = sanitizedQuery.toLowerCase()
    return products.value.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    // State
    isApiAvailable,
    products,
    toppings,
    iceOptions,
    sugarOptions,
    sizeOptions,
    bannerImages,
    isLoading,
    error,

    // Actions
    checkApiHealth,
    initializeData,
    loadProducts,
    loadToppings,
    loadOptions,
    loadBanners,
    getProductBySlug,
    getFeaturedProducts,
    searchProducts
  }
})
