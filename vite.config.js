import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // Server configuration
  server: {
    port: 5173,
    host: true,
    open: true, // Auto open browser
    strictPort: false, // Try next port if 5173 is busy
  },
  
  // Build optimizations
  build: {
    target: 'es2015', // Support older browsers
    minify: 'terser',
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['./src/composables/useNotification.js']
        }
      }
    },
    // Remove console logs in production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@data': resolve(__dirname, 'src/data'),
    }
  },
  
  // CSS optimization
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})
