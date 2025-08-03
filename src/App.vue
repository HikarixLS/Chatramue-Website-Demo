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
    console.log('🧋 ChaTraMue App loaded successfully!')
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
        console.log(`⚡ First Contentful Paint: ${entry.startTime}ms`)
      }
    }
  }).observe({ type: 'paint', buffered: true })
  
  // Measure when app is fully loaded
  window.addEventListener('load', () => {
    const loadTime = performance.now()
    console.log(`🚀 App fully loaded in: ${Math.round(loadTime)}ms`)
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

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for flex children */
}

/* Skip link for accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: var(--z-modal);
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}

/* Loading states */
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  z-index: var(--z-fixed);
  animation: loading-bar 1.5s ease-in-out infinite;
}

.route-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Error boundary */
.error-boundary {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  text-align: center;
  z-index: var(--z-modal);
  max-width: 400px;
  width: 90%;
}

.error-boundary h3 {
  color: var(--error);
  margin-bottom: 1rem;
}

.error-boundary button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  margin-top: 1rem;
}

/* Animations */
@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .route-loading {
    min-height: 150px;
    padding: 1rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
    border-width: 2px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .loading-spinner {
    border-top-color: currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
    border: 3px solid var(--primary-color);
  }
}
</style>
