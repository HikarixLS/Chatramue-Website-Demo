<template>
  <div id="app" :class="{ 'is-loading': isLoading }">
    <!-- Loading indicator -->
    <div v-if="isLoading" class="page-loading" aria-label="Đang tải..."></div>
    
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="skip-link">
      Chuyển đến nội dung chính
    </a>
    
    <!-- Header -->
    <Header />
    
    <!-- Main content with router view -->
    <main id="main-content" class="main-content" role="main">
      <Suspense>
        <router-view v-slot="{ Component, route }">
          <Transition
            :name="route.meta.transition || 'fade'"
            mode="out-in"
            appear
          >
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </router-view>
        <template #fallback>
          <div class="route-loading">
            <div class="loading-spinner"></div>
            <p>Đang tải trang...</p>
          </div>
        </template>
      </Suspense>
    </main>
    
    <!-- Footer -->
    <Footer />
    
    <!-- Global components -->
    <NotificationToast />
    
    <!-- Error boundary for development -->
    <div v-if="hasError && isDev" class="error-boundary">
      <h3>Đã xảy ra lỗi</h3>
      <p>{{ errorMessage }}</p>
      <button @click="reloadApp">Tải lại trang</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onErrorCaptured, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import NotificationToast from './components/NotificationToast.vue'

// Environment variables
const isDev = import.meta.env.DEV

// Reactive state
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

// Router instance
const router = useRouter()

// Computed properties
const appClasses = computed(() => ({
  'is-loading': isLoading.value,
  'has-error': hasError.value,
  'is-dev': isDev
}))

// Error handling
onErrorCaptured((error, instance, info) => {
  console.error('App Error Captured:', error)
  console.error('Component:', instance)
  console.error('Info:', info)
  
  hasError.value = true
  errorMessage.value = error.message || 'Đã xảy ra lỗi không xác định'
  
  return false // Prevent error propagation
})

// Lifecycle hooks
onMounted(() => {
  // App initialization
  initializeApp()
  
  // Performance monitoring
  if (isDev && 'performance' in window) {
    measureInitialLoad()
  }
  
  // Router ready
  router.isReady().then(() => {
    isLoading.value = false
  })
})

// Functions
const initializeApp = () => {
  // Set app title from env
  document.title = import.meta.env.VITE_APP_TITLE || 'ChaTraMue Việt Nam'
  
  // Set meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.content = import.meta.env.VITE_APP_DESCRIPTION || 'Website bán trà thái chính hiệu'
  }
  
  // Initialize theme
  initializeTheme()
  
  // Handle offline/online status
  handleNetworkStatus()
}

const initializeTheme = () => {
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
}

const handleNetworkStatus = () => {
  const updateOnlineStatus = () => {
    if (!navigator.onLine) {
      console.warn('App is offline')
      // Could show offline notification
    }
  }
  
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
}

const measureInitialLoad = () => {
  // Measure First Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        // Performance measurement
      }
    }
  }).observe({ type: 'paint', buffered: true })
  
  // Measure when app is fully loaded
  window.addEventListener('load', () => {
    const loadTime = performance.now()
  })
}

const reloadApp = () => {
  window.location.reload()
}

// Global error handler for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  hasError.value = true
  errorMessage.value = 'Đã xảy ra lỗi kết nối'
})
</script>


