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
              <input type="text" id="name" v-model="form.name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" v-model="form.email" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="phone">Số điện thoại</label>
            <input type="tel" id="phone" v-model="form.phone">
          </div>
          
          <div class="form-group">
            <label for="message">Tin nhắn *</label>
            <textarea id="message" v-model="form.message" rows="6" required placeholder="Hãy cho chúng tôi biết bạn muốn gì..."></textarea>
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

<style scoped>
.contact-section {
  min-height: 100vh;
  background: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-banner h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.hero-banner p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.store-selection {
  margin-bottom: 60px;
  text-align: center;
}

.store-selection h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

.store-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.store-btn {
  background: white;
  border: 2px solid #FF6B35;
  color: #FF6B35;
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.store-btn:hover,
.store-btn.active {
  background: #FF6B35;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.store-info-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  margin-bottom: 60px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.store-info-card h3 {
  color: #FF6B35;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
}

.info-item i {
  color: #FF6B35;
  font-size: 1.5rem;
  margin-top: 5px;
  width: 24px;
  text-align: center;
}

.info-item strong {
  display: block;
  color: #333;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.info-item p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.info-item a {
  color: #FF6B35;
  text-decoration: none;
  font-weight: 500;
}

.info-item a:hover {
  text-decoration: underline;
}

.map-link {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.map-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #28a745;
  color: white;
  padding: 15px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.map-btn:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  color: white;
  text-decoration: none;
}

.contact-form-section {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.contact-form-section h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  text-align: center;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #FF6B35;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  padding: 18px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .hero-banner h1 {
    font-size: 2rem;
  }
  
  .container {
    padding: 40px 15px;
  }
  
  .store-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .store-btn {
    width: 280px;
  }
  
  .store-info-card,
  .contact-form-section {
    padding: 25px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .info-item {
    padding: 15px;
  }
}
</style>
