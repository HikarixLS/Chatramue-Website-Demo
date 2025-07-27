<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
    <NotificationToast />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import NotificationToast from './components/NotificationToast.vue'
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
