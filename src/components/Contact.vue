<template>
  <section class="contact-section">
    <div class="hero-banner">
      <h1>Liên Hệ ChaTraMue</h1>
      <p>Chúng tôi luôn sẵn sàng phục vụ bạn</p>
    </div>

    <div class="container">
      <!-- Store Selection -->
      <div class="store-selection">
        <h2>Chọn cửa hàng</h2>
        <div class="store-buttons">
          <button 
            v-for="(store, key) in stores" 
            :key="key"
            @click="selectedStore = key"
            :class="{ active: selectedStore === key }"
            class="store-btn"
          >
            {{ store.name }}
          </button>
        </div>
      </div>

      <!-- Store Information -->
      <div class="store-info-card">
        <h3>{{ currentStore.name }}</h3>
        <div class="info-grid">
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <strong>Địa chỉ</strong>
              <p>{{ currentStore.address }}</p>
            </div>
          </div>
          
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <div>
              <strong>Điện thoại</strong>
              <p><a :href="`tel:${currentStore.phone}`">{{ currentStore.phone }}</a></p>
            </div>
          </div>
          
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <div>
              <strong>Email</strong>
              <p><a :href="`mailto:${currentStore.email}`">{{ currentStore.email }}</a></p>
            </div>
          </div>
          
          <div class="info-item">
            <i class="fas fa-clock"></i>
            <div>
              <strong>Giờ mở cửa</strong>
              <p>{{ currentStore.hours }}</p>
            </div>
          </div>
        </div>

        <!-- Google Maps Link -->
        <div class="map-link">
          <a 
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentStore.address)}`" 
            target="_blank" 
            class="map-btn"
          >
            <i class="fas fa-map"></i>
            Xem bản đồ trên Google Maps
          </a>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="contact-form-section">
        <h2>Gửi tin nhắn cho chúng tôi</h2>
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Họ và tên *</label>
              <input type="text" id="name" name="name" v-model="form.name" required autocomplete="name">
            </div>
            
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" name="email" v-model="form.email" required autocomplete="email">
            </div>
          </div>
          
          <div class="form-group">
            <label for="phone">Số điện thoại</label>
            <input type="tel" id="phone" name="phone" v-model="form.phone" autocomplete="tel">
          </div>
          
          <div class="form-group">
            <label for="message">Tin nhắn *</label>
            <textarea id="message" name="message" v-model="form.message" rows="6" required placeholder="Hãy cho chúng tôi biết bạn muốn gì..." autocomplete="off"></textarea>
          </div>
          
          <button type="submit" class="submit-btn">
            <i class="fas fa-paper-plane"></i>
            Gửi tin nhắn
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive data
const selectedStore = ref('hanoi')

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

// Store data
const stores = {
  hanoi: {
    name: 'ChaTraMue Hà Nội',
    address: '123 Phố Cầu Gỗ, Hoàn Kiếm, Hà Nội',
    phone: '024-3826-1234',
    email: 'hanoi@chatramue.vn',
    hours: '8:00 - 22:00 hàng ngày'
  },
  hcm: {
    name: 'ChaTraMue TP. Hồ Chí Minh',
    address: '456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    phone: '028-3822-5678',
    email: 'hcm@chatramue.vn',
    hours: '7:00 - 23:00 hàng ngày'
  },
  danang: {
    name: 'ChaTraMue Đà Nẵng',
    address: '789 Đường Bạch Đằng, Hải Châu, Đà Nẵng',
    phone: '0236-3888-9999',
    email: 'danang@chatramue.vn',
    hours: '8:00 - 22:00 hàng ngày'
  }
}

const currentStore = computed(() => stores[selectedStore.value])

// Form submission
const submitForm = () => {
  if (!form.value.name || !form.value.email || !form.value.message) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc!')
    return
  }
  
  alert(`Cảm ơn ${form.value.name}! Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất có thể.`)
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    phone: '',
    message: ''
  }
}
</script>