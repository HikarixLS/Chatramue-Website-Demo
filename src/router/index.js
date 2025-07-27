import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Products from '../views/Products.vue'
import Contact from '../views/Contact.vue'
import ProductDetail from '../views/ProductDetail.vue'
import ShoppingCart from '../views/ShoppingCart.vue'
import CheckOut from '../views/CheckOut.vue'

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
      component: CheckOut
    }
  ]
})

export default router
