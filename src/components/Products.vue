<template>
  <section class="product-list">
    <h1>Sản phẩm của chúng tôi</h1>
    
    <div v-if="dataStore.isLoading" class="loading-state">
      <p>Đang tải sản phẩm...</p>
    </div>
    
    <div v-else class="product-grid">
      <ProductCard 
        v-for="product in dataStore.products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()

onMounted(() => {
  dataStore.initializeData()
})
</script>
