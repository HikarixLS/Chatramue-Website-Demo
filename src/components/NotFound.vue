<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Oops! Trang không tìm thấy</h1>
        <p>Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.</p>
        
        <div class="actions">
          <router-link to="/" class="btn btn-primary">
            <i class="icon-home"></i>
            Về trang chủ
          </router-link>
          <router-link to="/products" class="btn btn-outline">
            <i class="icon-products"></i>
            Xem sản phẩm
          </router-link>
        </div>
        
        <div class="suggestions">
          <h3>Có thể bạn đang tìm:</h3>
          <ul>
            <li><router-link to="/products">Danh sách sản phẩm</router-link></li>
            <li><router-link to="/about">Giới thiệu thương hiệu</router-link></li>
            <li><router-link to="/contact">Thông tin liên hệ</router-link></li>
          </ul>
        </div>
      </div>
      
      <div class="tea-illustration">
        <div class="tea-cup">🧋</div>
        <div class="steam">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  mounted() {
    // Track 404 errors for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', '404_error', {
        page_path: this.$route.fullPath
      })
    }
  }
}
</script>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.not-found-content {
  text-align: left;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: var(--primary-color, #d4b895);
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-color, #d4b895);
  color: white;
}

.btn-primary:hover {
  background: var(--secondary-color, #8b4513);
  transform: translateY(-2px);
}

.btn-outline {
  border: 2px solid var(--primary-color, #d4b895);
  color: var(--primary-color, #d4b895);
  background: transparent;
}

.btn-outline:hover {
  background: var(--primary-color, #d4b895);
  color: white;
}

.suggestions {
  margin-top: 2rem;
}

.suggestions h3 {
  color: #333;
  margin-bottom: 1rem;
}

.suggestions ul {
  list-style: none;
  padding: 0;
}

.suggestions li {
  margin-bottom: 0.5rem;
}

.suggestions a {
  color: var(--primary-color, #d4b895);
  text-decoration: none;
  font-weight: 500;
}

.suggestions a:hover {
  color: var(--secondary-color, #8b4513);
  text-decoration: underline;
}

.tea-illustration {
  text-align: center;
  position: relative;
}

.tea-cup {
  font-size: 6rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
}

.steam {
  position: relative;
  margin: 0 auto;
  width: 60px;
  height: 40px;
}

.steam span {
  position: absolute;
  width: 6px;
  height: 30px;
  background: linear-gradient(to top, transparent 0%, #fff 50%, transparent 100%);
  border-radius: 50px;
  animation: steam 3s ease-in-out infinite;
}

.steam span:nth-child(1) {
  left: 20px;
  animation-delay: 0s;
}

.steam span:nth-child(2) {
  left: 30px;
  animation-delay: 0.5s;
}

.steam span:nth-child(3) {
  left: 40px;
  animation-delay: 1s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes steam {
  0% {
    opacity: 0;
    transform: translateY(0) scaleX(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scaleX(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scaleX(0.8);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .not-found-content {
    text-align: center;
  }
  
  .error-code {
    font-size: 6rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .actions {
    justify-content: center;
  }
  
  .tea-cup {
    font-size: 4rem;
  }
}
</style>
