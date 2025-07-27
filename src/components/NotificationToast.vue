<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', `notification--${notification.type}`]"
          @click="removeNotification(notification.id)"
        >
          <div class="notification-content">
            <i :class="getIcon(notification.type)"></i>
            <span>{{ notification.message }}</span>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useNotification } from '../composables/useNotification'

const { notifications, removeNotification } = useNotification()

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return 'fa-solid fa-check-circle'
    case 'error':
      return 'fa-solid fa-exclamation-circle'
    case 'warning':
      return 'fa-solid fa-exclamation-triangle'
    case 'info':
      return 'fa-solid fa-info-circle'
    default:
      return 'fa-solid fa-bell'
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
  padding: 12px 16px;
  min-width: 280px;
  max-width: 400px;
  cursor: pointer;
  pointer-events: auto;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.notification:hover {
  transform: translateX(-5px);
}

.notification--success {
  border-left-color: #4CAF50;
}

.notification--error {
  border-left-color: #f44336;
}

.notification--warning {
  border-left-color: #ff9800;
}

.notification--info {
  border-left-color: #2196f3;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notification-content i {
  font-size: 16px;
}

.notification--success .notification-content i {
  color: #4CAF50;
}

.notification--error .notification-content i {
  color: #f44336;
}

.notification--warning .notification-content i {
  color: #ff9800;
}

.notification--info .notification-content i {
  color: #2196f3;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

@media (max-width: 480px) {
  .notification-container {
    left: 10px;
    right: 10px;
    top: 10px;
  }
  
  .notification {
    min-width: auto;
    max-width: none;
  }
}
</style>
