import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Babel config for optimization
      babel: {
        plugins: [
          // Remove console logs in production
          ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ]
      }
    }),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false
    }),
    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    }),
    // Bundle analyzer
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  
  build: {
    // Target modern browsers for better optimization
    target: 'es2015',
    
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          
          // Code editor chunks
          'editor': [
            './src/components/CodexEditor.jsx',
            './src/components/CodexEditorModern.jsx',
            './src/components/LeetCodeEditor.jsx'
          ],
          
          // AI features
          'ai-features': [
            './src/components/AI/AIUniversalCreatorModern.jsx',
            './src/components/AI/ReactCodeAI.jsx',
            './src/components/AILeetCodeAssistant.jsx'
          ],
          
          // Web editor
          'web-editor': [
            './src/components/AdvancedWebEditor.jsx',
            './src/components/WebDevStudio.jsx',
            './src/components/WebPlayground.jsx'
          ],
          
          // Utils
          'utils': [
            './src/utils/performance-optimizer.js',
            './src/utils/viewport-fix.js'
          ]
        },
        
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop() 
            : 'chunk';
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific functions
        passes: 2 // Multiple passes for better compression
      },
      mangle: {
        safari10: true // Fix Safari 10 issues
      },
      format: {
        comments: false // Remove comments
      }
    },
    
    // Source maps for debugging (disable in production for smaller size)
    sourcemap: false,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Optimize CSS
    cssMinify: true,
    
    // Report compressed size
    reportCompressedSize: true,
    
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Server options
  server: {
    // Enable HTTP/2
    https: false,
    
    // Optimize HMR
    hmr: {
      overlay: true
    },
    
    // Compression
    compress: true
  },
  
  // Preview options
  preview: {
    port: 4173,
    strictPort: true,
    compress: true
  },
  
  // Performance hints
  performance: {
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000
  }
});
