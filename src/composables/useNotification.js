import { ref } from 'vue'

const notifications = ref([])

export function useNotification() {
  const addNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    const notification = {
      id,
      message,
      type,
      duration
    }
    
    notifications.value.push(notification)
    
    // Auto remove notification after duration
    setTimeout(() => {
      removeNotification(id)
    }, duration)
    
    return id
  }
  
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const clearAllNotifications = () => {
    notifications.value = []
  }
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  }
}
