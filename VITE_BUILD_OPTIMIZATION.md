# Vite Build Optimization Guide

## Overview
This document explains the build optimizations implemented to address chunk size warnings and improve build performance.

## Optimizations Applied

### 1. Manual Chunking Strategy
The build now uses `manualChunks` to split large dependencies into separate chunks:

- **react-vendor**: React core libraries (react, react-dom)
- **monaco-editor**: Monaco Editor (large code editor dependency)
- **clerk-auth**: Clerk authentication library
- **ui-vendor**: UI and utility libraries (lucide-react, uuid)

### 2. Chunk Size Warning Limit
- Increased from default 500kb to 1000kb (1MB)
- This reduces false warnings for legitimately large chunks

### 3. Build Performance Optimizations
- **Target**: Set to `esnext` for modern browsers
- **Minifier**: Using `esbuild` for faster minification
- **Dependency Optimization**: Pre-bundling key dependencies

## Benefits

1. **Reduced Bundle Size**: Large dependencies are split into separate chunks
2. **Better Caching**: Users only re-download changed chunks
3. **Faster Loading**: Parallel loading of chunks improves performance
4. **Fewer Warnings**: Appropriate chunk size limits reduce noise

## Configuration Details

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'monaco-editor': ['@monaco-editor/react'],
          'clerk-auth': ['@clerk/clerk-react'],
          'ui-vendor': ['lucide-react', 'uuid']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@monaco-editor/react', '@clerk/clerk-react', 'lucide-react']
  }
})
```

## Expected Build Output

After optimization, you should see:
- Multiple smaller chunk files instead of one large bundle
- Reduced chunk size warnings
- Faster subsequent builds due to better caching
- Improved loading performance for users

## Testing the Build

To test the optimized build:

```bash
npm run build
npm run preview
```

## Further Optimizations

If you need additional optimizations:

1. **Dynamic Imports**: Use `import()` for route-based code splitting
2. **Tree Shaking**: Ensure unused code is eliminated
3. **Asset Optimization**: Compress images and other static assets
4. **CDN Integration**: Consider loading large libraries from CDN

## Monitoring

Monitor your build output for:
- Chunk sizes in the build log
- Loading performance in browser dev tools
- Bundle analyzer reports (consider adding `rollup-plugin-visualizer`)