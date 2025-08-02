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


