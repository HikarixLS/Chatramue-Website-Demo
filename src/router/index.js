import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '../stores/auth'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Products from '../components/Products.vue'
import Contact from '../components/Contact.vue'
import ProductDetail from '../components/ProductDetail.vue'
import ShoppingCart from '../components/ShoppingCart.vue'
import CheckOut from '../components/CheckOut.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Profile from '../components/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/product/:slug',
      name: 'product-detail',
      component: ProductDetail,
      props: true
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/shopping-cart',
      name: 'shopping-cart',
      component: ShoppingCart
    },
    {
      path: '/cart',
      name: 'cart',
      component: ShoppingCart
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckOut,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards - temporarily disabled
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()
  
//   // Check if route requires authentication
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next({
//       path: '/login',
//       query: { redirect: to.fullPath }
//     })
//     return
//   }
  
//   // Check if route requires guest (not authenticated)
//   if (to.meta.requiresGuest && authStore.isAuthenticated) {
//     next('/')
//     return
//   }
  
//   next()
// })

export default router
