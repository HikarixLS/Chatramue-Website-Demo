# ChaTraMue Việt Nam - Vue.js Website

Website bán trà thái chính hiệu được xây dựng với Vue.js 3.

## Công nghệ sử dụng

- **Vue.js 3** - Framework JavaScript với Composition API
- **Vue Router** - Định tuyến client-side  
- **Pinia** - Quản lý state toàn cục
- **Vite** - Build tool và dev server

## Tính năng

- 🏠 **Trang chủ** với slider hình ảnh tự động
- 🛍️ **Danh sách sản phẩm** với lưới hiển thị responsive
- 📱 **Chi tiết sản phẩm** với modal chọn topping
- 🧊 **Tùy chọn** mức đá và đường cho từng sản phẩm
- 🛒 **Giỏ hàng** với localStorage và thông báo
- 💳 **Thanh toán** với form thông tin khách hàng
- 🔍 **Tìm kiếm** sản phẩm real-time

## Chạy dự án

```bash
npm install
npm run dev
```

Truy cập: http://localhost:3000
- 📞 **Liên hệ** với thông tin nhiều cửa hàng
- 📖 **Giới thiệu** về thương hiệu

## Cấu trúc thư mục

```
src/
├── components/          # Các component tái sử dụng
│   ├── Header.vue      # Header với navigation và tìm kiếm
│   ├── Footer.vue      # Footer đơn giản
│   ├── ImageSlider.vue # Slider hình ảnh với auto-play
│   └── ProductCard.vue # Card hiển thị sản phẩm
├── views/              # Các trang chính
│   ├── Home.vue        # Trang chủ
│   ├── Products.vue    # Danh sách sản phẩm
│   ├── ProductDetail.vue # Chi tiết sản phẩm
│   ├── ShoppingCart.vue  # Giỏ hàng
│   ├── CheckOut.vue    # Thanh toán
│   ├── About.vue       # Giới thiệu
│   └── Contact.vue     # Liên hệ
├── stores/             # Pinia stores
│   └── cart.js         # Store quản lý giỏ hàng
├── data/               # Dữ liệu tĩnh
│   └── products.js     # Danh sách sản phẩm
├── router/             # Vue Router config
│   └── index.js        # Cấu hình routes
├── App.vue             # Component gốc
├── main.js             # Entry point
└── style.css           # CSS toàn cục
```

## Cài đặt và chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy development server:**
   ```bash
   npm run dev
   ```

3. **Build cho production:**
   ```bash
   npm run build
   ```

4. **Preview build:**
   ```bash
   npm run preview
   ```

## Các tính năng chính

### 🛒 Quản lý giỏ hàng
- Thêm/xóa sản phẩm
- Cập nhật số lượng
- Lưu trữ trong localStorage
- Hiển thị tổng tiền real-time

### 🔍 Tìm kiếm
- Tìm kiếm real-time
- Hiển thị kết quả dropdown
- Navigation đến sản phẩm

### 📱 Responsive Design
- Hoạt động tốt trên desktop, tablet, mobile
- Grid layout linh hoạt
- Navigation mobile-friendly

### ⚡ Performance
- Lazy loading components
- Optimized images
- Fast build với Vite

## Customization

### Thêm sản phẩm mới
Chỉnh sửa file `src/data/products.js`:

```javascript
{
  id: 7,
  slug: 'san-pham-moi',
  name: 'Tên sản phẩm',
  price: 50000,
  image: '/assets/images/image.jpg',
  description: 'Mô tả sản phẩm...',
  category: 'danh-muc'
}
```

### Thêm route mới
Chỉnh sửa file `src/router/index.js`:

```javascript
{
  path: '/route-moi',
  name: 'route-moi',
  component: () => import('../views/ComponentMoi.vue')
}
```

### Styling
CSS được tổ chức trong `src/style.css` với CSS variables để dễ dàng thay đổi màu sắc và font.

## Browser Support

- Chrome/Edge (Chromium) 87+
- Firefox 78+
- Safari 14+

## License

© 2025 ChaTraMue Việt Nam. All rights reserved.
