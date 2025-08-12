// Image path utility for handling different environments

/**
 * Get the correct image path based on environment
 * @param {string} imagePath - The relative image path (e.g., '/images/banner.jpg')
 * @returns {string} - The full image path for current environment
 */
export const getImagePath = (imagePath) => {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Get base URL from Vite environment
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Combine base URL with image path
  return `${baseUrl}${cleanPath}`;
};

/**
 * Update product data with correct image paths
 * @param {Array} products - Array of products
 * @returns {Array} - Products with updated image paths
 */
export const updateProductImages = (products) => {
  return products.map(product => ({
    ...product,
    image: getImagePath(product.image)
  }));
};

/**
 * Update banner images with correct paths
 * @param {Array} banners - Array of banner objects
 * @returns {Array} - Banners with updated image paths
 */
export const updateBannerImages = (banners) => {
  return banners.map(banner => ({
    ...banner,
    src: getImagePath(banner.src)
  }));
};
