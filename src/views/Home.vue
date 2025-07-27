<template>
  <section class="hero">
    <div class="hero-container">
      <ImageSlider :images="bannerImages" />
      <div class="hero-text">
        <h1>ChaTraMue Việt Nam</h1>
      </div>
    </div>
  </section>
</template>

<script setup>
import ImageSlider from '../components/ImageSlider.vue'
import { bannerImages } from '../data/products'
</script>
