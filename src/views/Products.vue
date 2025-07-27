<template>
  <section class="product-list">
    <h1>Sản phẩm của chúng tôi</h1>
    
    <div class="product-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </section>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue'
import { products } from '../data/products'
</script>
