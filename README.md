# 🧋 ChaTraMue Việt Nam - Vue.js Website

[![Vue.js](### 📦 Scripts có sẵn
```bash
npm run dev        # Chạy dev server (Vite)
npm run build      # Build production
npm run preview    # Preview build
npm run api        # Chạy JSON Server (port 3001)
npm run dev:full   # Chạy đồng thời dev + api server
npm run perf       # Phân tích performance
npm run analyze    # Build + phân tích performance
npm run optimize   # Clean + build + analyze toàn diện
npm run lint       # Kiểm tra & sửa lỗi code
npm run format     # Format code với Prettier
```img.shields.io/badge/Vue.js-3.5.18-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=flat-square)](LICENSE)

> Website bán trà thái chính hiệu được xây dựng với Vue.js 3, mang đến trải nghiệm mua sắm trực tuyến tối ưu cho thương hiệu ChaTraMue.

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|--------|
| **Vue.js 3** | 3.5.18 | Framework JavaScript với Composition API |
| **Vue Router** | 4.2.0 | Định tuyến client-side SPA |
| **Pinia** | 2.1.0 | Quản lý state toàn cục hiện đại |
| **Vite** | 6.3.5 | Build tool & dev server siêu nhanh |

## ✨ Tính năng chính

### 🏪 **Giao diện người dùng**
- 🏠 **Trang chủ** với slider hình ảnh tự động
- 🛍️ **Danh sách sản phẩm** với lưới responsive
- 📱 **Chi tiết sản phẩm** với modal chọn topping
- 📖 **Giới thiệu** thương hiệu và **Liên hệ** đa cửa hàng

### 🛒 **E-commerce Core**
- 🧊 **Tùy chọn** mức đá và đường cho từng sản phẩm
- 🛒 **Giỏ hàng** với localStorage và thông báo real-time
- 💳 **Thanh toán** với form thông tin khách hàng
- 🔍 **Tìm kiếm** sản phẩm instant search

### 🎯 **Trải nghiệm**
- 📱 **Responsive Design** - Tối ưu cho mọi thiết bị
- ⚡ **Performance** - Lazy loading & fast build
- 💾 **Offline Support** - localStorage cho giỏ hàng

## 🚀 Khởi chạy nhanh

### Cài đặt & Chạy
```bash
# Clone repository
git clone https://github.com/HikarixLS/Chatramue-Website-Demo.git
cd Chatramue-Website-Demo

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### 🌐 Truy cập
- **Development**: http://localhost:5173
- **Alternative**: http://localhost:3000

### � Scripts có sẵn
```bash
npm run dev        # Chạy dev server (Vite)
npm run build      # Build production
npm run preview    # Preview build
npm run api        # Chạy JSON Server (port 3001)
npm run dev:full   # Chạy đồng thời dev + api server
```

## 📁 Cấu trúc dự án

```
📦 Chatramue-Website-Demo/
├── 📂 public/                  # Static assets
│   └── 📂 images/             # Product & banner images
├── 📂 src/
│   ├── 📂 components/         # Reusable components
│   │   ├── 🧩 Header.vue      # Navigation & search
│   │   ├── 🧩 Footer.vue      # Footer component
│   │   ├── 🧩 ImageSlider.vue # Auto-play slider
│   │   ├── 🧩 ProductCard.vue # Product display card
│   │   ├── 🧩 Login.vue       # User authentication
│   │   ├── 🧩 Register.vue    # User registration
│   │   ├── 🧩 Profile.vue     # User profile
│   │   ├── 🧩 ToppingModal.vue # Product customization
│   │   └── 🧩 NotificationToast.vue # Notifications
│   ├── 📂 composables/        # Vue composition functions
│   │   └── 🔧 useNotification.js # Notification logic
│   ├── 📂 components/         # Main pages
│   │   ├── 🏠 Home.vue        # Homepage
│   │   ├── 🛍️ Products.vue    # Product listing
│   │   ├── 📱 ProductDetail.vue # Product details
│   │   ├── 🛒 ShoppingCart.vue # Shopping cart
│   │   ├── 💳 CheckOut.vue    # Checkout process
│   │   ├── 📖 About.vue       # Brand information
│   │   └── 📞 Contact.vue     # Contact information
│   ├── 📂 stores/             # Pinia state management
│   │   ├── 🏪 auth.js         # Authentication store
│   │   ├── 🛒 cart.js         # Shopping cart store
│   │   └── 📊 data.js         # Data management store
│   ├── 📂 data/               # Static data
│   │   └── 📋 products.js     # Product catalog
│   ├── 📂 router/             # Vue Router config
│   │   └── 🛣️ index.js        # Route definitions
│   ├── 📂 services/           # API services
│   │   └── 🔌 api.js          # API integration
│   ├── 🎯 App.vue             # Root component
│   ├── 🚀 main.js             # Application entry
│   └── 🎨 style.css           # Global styles
├── 📄 db.json                 # JSON Server database
├── ⚙️ vite.config.js          # Vite configuration
└── 📦 package.json            # Dependencies & scripts
```

## 🔧 Development Guide

### 📋 Prerequisites
- **Node.js** 16.0+ 
- **npm** 7.0+
- **Git** 2.0+

### 🛠️ Available Commands

| Command | Description | Port |
|---------|-------------|------|
| `npm run dev` | Development server | 5173 |
| `npm run build` | Production build | - |
| `npm run preview` | Preview build locally | 4173 |
| `npm run api` | JSON Server API | 3001 |
| `npm run dev:full` | Dev + API servers | 5173 + 3001 |
| `npm run perf` | Performance analysis | - |
| `npm run analyze` | Build + performance check | - |
| `npm run optimize` | Complete optimization cycle | - |
| `npm run lint` | ESLint code checking | - |
| `npm run format` | Prettier code formatting | - |

## 🎯 Các tính năng chi tiết

### 🛒 **Quản lý giỏ hàng**
- ➕ Thêm/xóa sản phẩm dễ dàng
- 🔢 Cập nhật số lượng real-time
- 💾 Lưu trữ persistent với localStorage
- 💰 Tính tổng tiền tự động
- 🔔 Thông báo trạng thái

### 🔍 **Hệ thống tìm kiếm**
- ⚡ Tìm kiếm instant search
- 📋 Dropdown kết quả thông minh
- 🎯 Navigation trực tiếp đến sản phẩm
- 🏷️ Lọc theo danh mục

### 📱 **Responsive & Performance**
- 📱 **Mobile-first** design approach
- 💻 Tối ưu cho desktop, tablet, mobile
- 🔄 Grid layout linh hoạt & adaptive
- 🧭 Navigation mobile-friendly
- ⚡ **Lazy loading** cho components
- 🖼️ **Optimized images** với WebP
- 🚀 **Fast build** với Vite HMR

### 🔐 **User Management**
- 👤 Đăng ký/đăng nhập người dùng
- 📝 Quản lý profile cá nhân
- 🔒 Bảo mật thông tin khách hàng

## ⚙️ Customization & Extension

### 🆕 **Thêm sản phẩm mới**
Chỉnh sửa `src/data/products.js`:

```javascript
{
  id: 7,
  slug: 'tra-dao-cam-sa', 
  name: 'Trà Đào Cam Sả',
  price: 65000,
  image: '/images/tra-dao-cam-sa.jpg',
  description: 'Hương vị tươi mát từ đào, cam và sả...',
  category: 'tra-trai-cay',
  ingredients: ['đào', 'cam', 'sả', 'trà đen'],
  sizes: ['M', 'L'],
  toppings: ['trân châu', 'thạch', 'pudding']
}
```

### 🛣️ **Thêm route mới**
Cập nhật `src/router/index.js`:

```javascript
{
  path: '/promotion',
  name: 'Promotion', 
  component: () => import('../components/Promotion.vue'),
  meta: { title: 'Khuyến mãi' }
}
```

### 🎨 **Tùy chỉnh giao diện**
- **CSS Variables**: Định nghĩa trong `src/style.css`
- **Component Styling**: Scoped CSS trong từng `.vue` file  
- **Responsive Breakpoints**: Tùy chỉnh cho mobile/tablet/desktop

```css
:root {
  --primary-color: #d4b895;      /* ChaTraMue brand color */
  --secondary-color: #8b4513;    /* Brown accent */
  --success-color: #28a745;      /* Success states */
  --border-radius: 8px;          /* Consistent rounding */
}
```

## 🌍 Browser Support & Deployment

### ✅ **Supported Browsers**
| Browser | Version | Status |
|---------|---------|--------|
| Chrome/Edge (Chromium) | 87+ | ✅ Fully Supported |
| Firefox | 78+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Mobile Chrome/Safari | Latest | ✅ Optimized |

### 🚀 **Deployment Options**
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to GitHub Pages
npm run build && npm run deploy
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)  
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📄 License & Credits

**© 2025 ChaTraMue Việt Nam. All rights reserved.**

---

### 🏷️ **Tags**
`#vue3` `#vite` `#pinia` `#e-commerce` `#tea-shop` `#vietnamese` `#responsive` `#spa`

### 👨‍💻 **Developer**
Made with ❤️ by [HikarixLS](https://github.com/HikarixLS)

---
⭐ **Star this repo if you found it helpful!**
