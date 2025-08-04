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


