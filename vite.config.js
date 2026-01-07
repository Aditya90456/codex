import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit to 1MB (1000kb)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Monaco Editor (large dependency)
          if (id.includes('@monaco-editor')) {
            return 'monaco-editor';
          }
          
          // Clerk authentication
          if (id.includes('@clerk/clerk-react')) {
            return 'clerk-auth';
          }
          
          // UI libraries
          if (id.includes('lucide-react')) {
            return 'ui-vendor';
          }
          
          // Utility libraries
          if (id.includes('uuid')) {
            return 'utils';
          }
          
          // Node modules (other vendor libraries)
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
