## 💾 Quản lý dữ liệu

### Products Data (src/data/products.js)
```javascript
// Cấu trúc sản phẩm
{
  id: 'unique-identifier',
  name: 'Tên sản phẩm',
  price: 65000,
  image: 'path/to/image.jpg',
  description: 'Mô tả chi tiết',
  ingredients: ['Thành phần 1', 'Thành phần 2'],
  category: 'trà-sữa'
}
```

### Cart Store (src/stores/cart.js)
```javascript
// Pinia store với:
- items: [] // Danh sách sản phẩm trong giỏ
- addItem() // Thêm sản phẩm
- removeItem() // Xóa sản phẩm
- updateQuantity() // Cập nhật số lượng
- totalItems // Computed: Tổng số item
- totalPrice // Computed: Tổng giá tiền
```

### localStorage Persistence
- Tự động lưu cart state
- Khôi phục khi reload trang
- Sync giữa multiple tabs