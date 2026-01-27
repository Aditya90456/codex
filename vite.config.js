import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit to 1MB (1000kb)
    chunkSizeWarningLimit: 1000,
    // Optimize build performance
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom'],
          
          // Monaco Editor (large dependency)
          'monaco-editor': ['@monaco-editor/react'],
          
          // Clerk authentication
          'clerk-auth': ['@clerk/clerk-react'],
          
          // UI and utility libraries
          'ui-vendor': ['lucide-react', 'uuid']
        }
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@monaco-editor/react', '@clerk/clerk-react', 'lucide-react'],
    force: true
  },
  // Performance optimizations
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  },
  // Enable faster HMR
  esbuild: {
    target: 'esnext'
  }
})
