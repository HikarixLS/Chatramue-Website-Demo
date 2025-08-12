<template>
  <div class="slider">
    <div v-if="!images || images.length === 0" class="no-images">
      <p>No images to display</p>
      <p>Images: {{ images }}</p>
    </div>
    <template v-else>
      <img 
        v-for="(image, index) in images" 
        :key="index"
        :src="image" 
        :alt="`Banner ${index + 1}`"
        class="slide"
        :class="{ active: index === currentSlide }"
      >
      
      <button class="slider-btn prev" @click="prevSlide">&lt;</button>
      <button class="slider-btn next" @click="nextSlide">&gt;</button>
      
      <div class="slider-dots">
        <button 
          v-for="(image, index) in images" 
          :key="index"
          class="slider-dot"
          :class="{ active: index === currentSlide }"
          @click="goToSlide(index)"
        ></button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 3000
  }
})

const currentSlide = ref(0)
let slideInterval = null

const nextSlide = () => {
  if (props.images && props.images.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % props.images.length
    resetInterval()
  }
}

const prevSlide = () => {
  if (props.images && props.images.length > 0) {
    currentSlide.value = (currentSlide.value - 1 + props.images.length) % props.images.length
    resetInterval()
  }
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetInterval()
}

const resetInterval = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
  if (props.autoPlay) {
    slideInterval = setInterval(nextSlide, props.interval)
  }
}

onMounted(() => {
  if (props.autoPlay) {
    slideInterval = setInterval(nextSlide, props.interval)
  }
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>
