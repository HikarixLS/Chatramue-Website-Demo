### 🎯 Core Application Files

#### `src/main.js`
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Pinia store setup
app.use(createPinia())

// Vue Router setup
app.use(router)

// Mount app to DOM
app.mount('#app')
```

**Chức năng:**
- Bootstrap Vue application
- Setup Pinia state management
- Setup Vue Router
- Mount app vào DOM element

#### `src/App.vue`
```vue
<template>
  <div id="app">
    <!-- Global Header -->
    <Header />
    
    <!-- Router View - Dynamic content -->
    <main>
      <router-view />
    </main>
    
    <!-- Global Footer -->
    <Footer />
    
    <!-- Global notifications -->
    <div v-if="showNotification" class="notification">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

// Global state
const showNotification = ref(false)
const notificationMessage = ref('')

// Global methods
const showMessage = (message) => {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}
</script>
```

**Chức năng:**
- Root component chứa layout chung
- Header và Footer global
- Router view cho dynamic content
- Global notification system