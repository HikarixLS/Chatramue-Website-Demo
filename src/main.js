import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Performance monitoring
const isDev = import.meta.env.DEV

// Error handling
const errorHandler = (error, instance, info) => {
  if (isDev) {
    console.error('Vue Error:', error)
    console.error('Component:', instance)
    console.error('Info:', info)
  }
  // Production error tracking could be added here
}

// Create Vue app instance
const app = createApp(App)

// Global error handling
app.config.errorHandler = errorHandler

// Performance mark for dev
if (isDev) {
  performance.mark('app-init-start')
}

// Install plugins
const pinia = createPinia()

// Pinia devtools in development
app.use(pinia)
app.use(router)

// Global properties (if needed)
app.config.globalProperties.$isDev = isDev

// Mount app with error boundary
try {
  app.mount('#app')
  
  if (isDev) {
    performance.mark('app-init-end')
    performance.measure('app-init', 'app-init-start', 'app-init-end')
  }
} catch (error) {
  console.error('Failed to mount Vue app:', error)
}

// Service worker registration (for PWA features if needed)
if ('serviceWorker' in navigator && !isDev) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        // SW registered successfully
      })
      .catch(registrationError => {
        console.error('SW registration failed: ', registrationError)
      })
  })
}
