<template>
  <section class="hero">
    <div class="hero-container">
      <ImageSlider :images="dataStore.bannerImages" />
      <div class="hero-text">
        <h1>ChaTraMue</h1>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import ImageSlider from './ImageSlider.vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()

onMounted(() => {
  dataStore.initializeData()
})
</script>
