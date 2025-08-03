import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '../stores/auth'

// Dynamic imports for code splitting and better performance
const Home = () => import('../components/Home.vue')
const About = () => import('../components/About.vue')
const Products = () => import('../components/Products.vue')
const Contact = () => import('../components/Contact.vue')
const ProductDetail = () => import('../components/ProductDetail.vue')
const ShoppingCart = () => import('../components/ShoppingCart.vue')
const CheckOut = () => import('../components/CheckOut.vue')
const Login = () => import('../components/Login.vue')
const Register = () => import('../components/Register.vue')
const Profile = () => import('../components/Profile.vue')

// 404 Error component
const NotFound = () => import('../components/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { 
      title: 'ChaTraMue - Trang chủ',
      description: 'Trà thái chính hiệu ChaTraMue Việt Nam'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { 
      title: 'Giới thiệu - ChaTraMue',
      description: 'Tìm hiểu về thương hiệu trà thái ChaTraMue'
    }
  },
  {
    path: '/products',
    name: 'products',
    component: Products,
    meta: { 
      title: 'Sản phẩm - ChaTraMue',
      description: 'Khám phá các loại trà thái đặc biệt từ ChaTraMue'
    }
  },
  {
    path: '/product/:slug',
    name: 'product-detail',
    component: ProductDetail,
    props: true,
    meta: { 
      title: 'Chi tiết sản phẩm - ChaTraMue',
      description: 'Thông tin chi tiết sản phẩm trà thái'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { 
      title: 'Liên hệ - ChaTraMue',
      description: 'Thông tin liên hệ và địa chỉ cửa hàng ChaTraMue'
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: ShoppingCart,
    alias: ['/shopping-cart'],
    meta: { 
      title: 'Giỏ hàng - ChaTraMue',
      description: 'Giỏ hàng của bạn'
    }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckOut,
    meta: { 
      requiresAuth: true,
      title: 'Thanh toán - ChaTraMue',
      description: 'Hoàn tất đơn hàng'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { 
      requiresGuest: true,
      title: 'Đăng nhập - ChaTraMue',
      description: 'Đăng nhập tài khoản'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { 
      requiresGuest: true,
      title: 'Đăng ký - ChaTraMue',
      description: 'Tạo tài khoản mới'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { 
      requiresAuth: true,
      title: 'Hồ sơ - ChaTraMue',
      description: 'Thông tin tài khoản cá nhân'
    }
  },
  // Catch-all 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { 
      title: 'Không tìm thấy trang - ChaTraMue',
      description: 'Trang bạn tìm kiếm không tồn tại'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Scroll behavior for better UX
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Global navigation guards
router.beforeEach(async (to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Set meta description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }
  
  // Loading indicator
  if (typeof window !== 'undefined') {
    const loadingEl = document.querySelector('.page-loading')
    if (loadingEl) {
      loadingEl.style.display = 'block'
    }
  }
  
  // Auth guards (commented out for now)
  // const authStore = useAuthStore()
  
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   next({
  //     path: '/login',
  //     query: { redirect: to.fullPath }
  //   })
  //   return
  // }
  
  // if (to.meta.requiresGuest && authStore.isAuthenticated) {
  //   next('/')
  //   return
  // }
  
  next()
})

router.afterEach(() => {
  // Hide loading indicator
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const loadingEl = document.querySelector('.page-loading')
      if (loadingEl) {
        loadingEl.style.display = 'none'
      }
    }, 100)
  }
})

export default router
