<template>
  <section class="product-list">
    <div class="product-header">
      <h1>Sản phẩm của chúng tôi</h1>
      
      <!-- Tìm kiếm và lọc -->
      <div class="product-filters">
        <div class="products-search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm sản phẩm..." 
            class="search-input"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <select v-model="selectedCategory" class="category-filter">
          <option value="">Tất cả danh mục</option>
          <option value="tra-sua">Trà sữa</option>
          <option value="tra-trai-cay">Trà trái cây</option>
          <option value="tra-truyen-thong">Trà truyền thống</option>
          <option value="tra-hoa">Trà hoa</option>
        </select>
        
        <select v-model="sortBy" class="sort-filter">
          <option value="">Sắp xếp theo</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
        </select>
      </div>
    </div>
    
    <div v-if="dataStore.isLoading" class="loading-state">
      <p>Đang tải sản phẩm...</p>
    </div>
    
    <div v-else-if="filteredProducts.length === 0" class="no-products">
      <p>Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.</p>
    </div>
    
    <div v-else class="product-grid">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()

// Reactive search and filter variables
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('')

// Computed property for filtered products
const filteredProducts = computed(() => {
  let products = [...dataStore.products]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    products = products.filter(product => 
      product.category === selectedCategory.value
    )
  }

  // Apply sorting
  if (sortBy.value) {
    switch (sortBy.value) {
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
    }
  }

  return products
})

onMounted(() => {
  dataStore.initializeData()
})
</script>
