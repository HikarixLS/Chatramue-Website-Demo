### 🔧 Root Files

#### `index.html`
```html
<!-- Entry point của ứng dụng -->
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ChaTraMue - Trà Sữa Thái Lan</title>
  <!-- FontAwesome CDN cho icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Chức năng:**
- Entry point HTML cho SPA
- Load FontAwesome icons
- Mount point cho Vue app (`#app`)
- Meta tags cho SEO và responsive

#### `package.json`
```json
{
  "name": "chatramue-vue",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "pinia": "^2.1.7",
    "vue": "^3.4.29",
    "vue-router": "^4.3.3"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.5",
    "vite": "^5.3.1"
  }
}
```

**Chức năng:**
- Quản lý dependencies và scripts
- Vue 3 ecosystem: Vue, Router, Pinia
- Vite build tool configuration
- NPM scripts cho development

#### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

**Chức năng:**
- Cấu hình Vite build tool
- Vue plugin integration
- Development server settings
- Build output configuration