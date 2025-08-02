<template>
  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2025 ChaTraMue Việt Nam. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Simple footer with only copyright
</script>

<style scoped>
.main-footer {
  background: #f8f9fa;
  border-top: 1px solid #e5e5e5;
  padding: 20px 0;
  width: 100%;
  flex-shrink: 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-bottom {
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>
