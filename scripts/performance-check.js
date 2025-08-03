/**
 * Performance Analysis Script for ChaTraMue Project
 * Analyzes bundle size, dependencies, and provides optimization suggestions
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

console.log('🧋 ChaTraMue Performance Analysis\n')

// Check if dist folder exists
const distPath = path.join(projectRoot, 'dist')
if (!fs.existsSync(distPath)) {
  console.log('❌ Build folder not found. Run "npm run build" first.')
  process.exit(1)
}

// Analyze bundle sizes
function analyzeBundleSize() {
  console.log('📦 Bundle Size Analysis:')
  console.log('─'.repeat(50))
  
  try {
    const files = fs.readdirSync(distPath, { withFileTypes: true })
    let totalSize = 0
    
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(distPath, file.name)
        const stats = fs.statSync(filePath)
        const sizeKB = (stats.size / 1024).toFixed(2)
        totalSize += stats.size
        
        let icon = '📄'
        if (file.name.endsWith('.js')) icon = '📜'
        if (file.name.endsWith('.css')) icon = '🎨'
        if (file.name.endsWith('.html')) icon = '🏠'
        
        console.log(`${icon} ${file.name}: ${sizeKB} KB`)
      }
    })
    
    console.log('─'.repeat(50))
    console.log(`📊 Total bundle size: ${(totalSize / 1024).toFixed(2)} KB`)
    
    // Performance recommendations
    if (totalSize > 500 * 1024) {
      console.log('⚠️  Bundle size is large (>500KB). Consider code splitting.')
    } else if (totalSize < 200 * 1024) {
      console.log('✅ Bundle size is optimal (<200KB)')
    } else {
      console.log('👍 Bundle size is acceptable')
    }
    
  } catch (error) {
    console.log('❌ Error analyzing bundle:', error.message)
  }
}

// Check dependencies
function analyzeDependencies() {
  console.log('\n📋 Dependencies Analysis:')
  console.log('─'.repeat(50))
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))
    const deps = packageJson.dependencies || {}
    const devDeps = packageJson.devDependencies || {}
    
    console.log(`📦 Production dependencies: ${Object.keys(deps).length}`)
    Object.keys(deps).forEach(dep => {
      console.log(`  • ${dep}: ${deps[dep]}`)
    })
    
    console.log(`🔧 Development dependencies: ${Object.keys(devDeps).length}`)
    
    // Check for unused dependencies (basic check)
    const unusedDeps = []
    Object.keys(deps).forEach(dep => {
      // Simple check - look for imports in main files
      const srcPath = path.join(projectRoot, 'src')
      if (fs.existsSync(srcPath)) {
        const hasImport = checkForImports(srcPath, dep)
        if (!hasImport) {
          unusedDeps.push(dep)
        }
      }
    })
    
    if (unusedDeps.length > 0) {
      console.log('\n⚠️  Potentially unused dependencies:')
      unusedDeps.forEach(dep => console.log(`  • ${dep}`))
    } else {
      console.log('\n✅ All dependencies appear to be used')
    }
    
  } catch (error) {
    console.log('❌ Error analyzing dependencies:', error.message)
  }
}

// Simple check for imports (not comprehensive)
function checkForImports(dir, dependency) {
  try {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        if (checkForImports(filePath, dependency)) return true
      } else if (file.endsWith('.js') || file.endsWith('.vue') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8')
        if (content.includes(`from '${dependency}'`) || 
            content.includes(`require('${dependency}')`)) {
          return true
        }
      }
    }
    
    return false
  } catch {
    return true // Assume used if we can't check
  }
}

// Performance recommendations
function provideRecommendations() {
  console.log('\n💡 Performance Recommendations:')
  console.log('─'.repeat(50))
  
  const recommendations = [
    '🚀 Use dynamic imports for route components (already implemented)',
    '🖼️  Optimize images with WebP format',
    '📱 Implement service worker for caching',
    '⚡ Use Vue 3 Composition API for better tree-shaking',
    '🎯 Implement lazy loading for components',
    '📊 Monitor Core Web Vitals in production',
    '🔄 Use HTTP/2 server push for critical resources',
    '💾 Implement proper caching strategies',
  ]
  
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`)
  })
}

// Check Vite config optimizations
function checkViteConfig() {
  console.log('\n⚙️  Vite Configuration Check:')
  console.log('─'.repeat(50))
  
  try {
    const viteConfigPath = path.join(projectRoot, 'vite.config.js')
    if (fs.existsSync(viteConfigPath)) {
      const config = fs.readFileSync(viteConfigPath, 'utf8')
      
      const checks = [
        { name: 'Manual chunks', check: config.includes('manualChunks') },
        { name: 'Terser minification', check: config.includes('terser') },
        { name: 'Drop console', check: config.includes('drop_console') },
        { name: 'Path aliases', check: config.includes('alias') },
        { name: 'Optimization deps', check: config.includes('optimizeDeps') }
      ]
      
      checks.forEach(({ name, check }) => {
        const status = check ? '✅' : '❌'
        console.log(`${status} ${name}`)
      })
    } else {
      console.log('❌ vite.config.js not found')
    }
  } catch (error) {
    console.log('❌ Error checking Vite config:', error.message)
  }
}

// Generate report
function generateReport() {
  const timestamp = new Date().toISOString()
  const report = {
    timestamp,
    project: 'ChaTraMue Website',
    analysis: 'Performance analysis completed'
  }
  
  try {
    fs.writeFileSync(path.join(projectRoot, 'performance-report.json'), JSON.stringify(report, null, 2))
    console.log('\n📄 Performance report saved to performance-report.json')
  } catch (error) {
    console.log('❌ Could not save report:', error.message)
  }
}

// Run analysis
analyzeBundleSize()
analyzeDependencies()
checkViteConfig()
provideRecommendations()
generateReport()

console.log('\n🎉 Analysis complete! Happy optimizing! 🧋')
