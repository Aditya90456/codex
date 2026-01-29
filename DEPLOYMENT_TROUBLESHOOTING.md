# Deployment Troubleshooting Guide

## Common Deployment Issues & Solutions

### Issue 1: Build Fails on Vercel/Netlify

**Symptoms:**
- Build process fails during `npm run build`
- "Module not found" errors
- Out of memory errors

**Solutions:**

1. **Check Node Version**
   ```json
   // Add to package.json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

2. **Increase Memory Limit**
   ```bash
   # In package.json scripts
   "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
   ```

3. **Clear Cache and Reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Issue 2: Routes Not Working (404 on Refresh)

**Symptoms:**
- Direct URL access returns 404
- Page refresh breaks the app
- Only home page works

**Solution:**
Your `vercel.json` is already configured correctly with rewrites. Make sure it's in the root directory.

### Issue 3: Environment Variables Not Working

**Symptoms:**
- API calls fail in production
- Features work locally but not in deployment
- "undefined" errors for env variables

**Solutions:**

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=your_key_here
     VITE_BACKEND_URL=your_backend_url_here
     ```

2. **Prefix with VITE_:**
   All environment variables must start with `VITE_` to be accessible in the frontend.

3. **Rebuild After Adding Variables:**
   Environment variables require a new deployment to take effect.

### Issue 4: Backend API Not Accessible

**Symptoms:**
- CORS errors in production
- API calls timeout
- "Failed to fetch" errors

**Solutions:**

1. **Deploy Backend Separately:**
   - Deploy backend to Render/Railway/Heroku
   - Update `VITE_BACKEND_URL` in Vercel

2. **Update CORS Configuration:**
   ```javascript
   // In backend/server.js
   const allowedOrigins = [
     'http://localhost:5173',
     'https://your-app.vercel.app',
     'https://your-custom-domain.com'
   ];
   ```

3. **Check Backend Environment Variables:**
   - Ensure `GEMINI_API_KEY` is set in backend deployment
   - Verify `PORT` is correctly configured

### Issue 5: Large Bundle Size

**Symptoms:**
- Slow initial load
- Build warnings about chunk size
- Performance issues

**Solutions:**

Your `vite.config.js` already has optimizations. If still having issues:

1. **Lazy Load Routes:**
   ```javascript
   import { lazy, Suspense } from 'react';
   
   const CodexEditor = lazy(() => import('./components/CodexEditorModern'));
   const DSAWithAI = lazy(() => import('./pages/DSAWithAIPage'));
   
   // In Routes
   <Suspense fallback={<LoadingScreen />}>
     <Route path="/editor" element={<CodexEditor />} />
   </Suspense>
   ```

2. **Analyze Bundle:**
   ```bash
   npm install --save-dev rollup-plugin-visualizer
   npm run build
   ```

### Issue 6: Monaco Editor Not Loading

**Symptoms:**
- Code editor appears blank
- Console errors about Monaco
- Editor crashes in production

**Solutions:**

1. **Check CDN Access:**
   Monaco loads from CDN. Ensure CSP allows it.

2. **Self-Host Monaco (if needed):**
   ```javascript
   import * as monaco from 'monaco-editor';
   import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
   
   self.MonacoEnvironment = {
     getWorker() {
       return new editorWorker();
     }
   };
   ```

### Issue 7: Clerk Authentication Issues

**Symptoms:**
- Login/signup not working
- Infinite loading on auth pages
- "Invalid publishable key" errors

**Solutions:**

1. **Verify Clerk Keys:**
   - Check `VITE_CLERK_PUBLISHABLE_KEY` is set
   - Ensure it starts with `pk_test_` or `pk_live_`

2. **Update Clerk Domain Settings:**
   - Go to Clerk Dashboard → Domains
   - Add your Vercel domain
   - Add your custom domain (if any)

3. **Check CSP Headers:**
   Your `vercel.json` already includes Clerk domains in CSP.

## Quick Deployment Checklist

### Before Deploying:

- [ ] Run `npm run build` locally to test
- [ ] Check all environment variables are set
- [ ] Verify `vercel.json` is in root directory
- [ ] Test all routes work locally
- [ ] Ensure backend is deployed and accessible
- [ ] Check CORS configuration includes production URL

### Vercel Deployment Steps:

1. **Connect Repository:**
   - Go to Vercel Dashboard
   - Import your GitHub repository
   - Select the project

2. **Configure Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   VITE_BACKEND_URL=https://your-backend.onrender.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Test all routes

### Backend Deployment (Render):

1. **Create New Web Service:**
   - Connect your repository
   - Select `backend` folder as root directory

2. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

3. **Set Environment Variables:**
   ```
   GEMINI_API_KEY=your_key_here
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Deploy and Copy URL:**
   - Deploy the backend
   - Copy the service URL
   - Add it to frontend's `VITE_BACKEND_URL`

## Testing Deployment

### Frontend Tests:
```bash
# Test production build locally
npm run build
npm run preview

# Open http://localhost:4173
# Test all routes:
# - /
# - /editor
# - /playground
# - /web
# - /dsa-ai
# - /ai
```

### Backend Tests:
```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Test AI endpoint
curl -X POST https://your-backend.onrender.com/api/ai/explain-code \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(\"test\")","problemTitle":"Test","language":"javascript"}'
```

## Common Error Messages

### "Failed to load module"
- **Cause:** Missing dependency or incorrect import
- **Fix:** Check import paths, run `npm install`

### "Hydration failed"
- **Cause:** Server/client mismatch (usually with SSR)
- **Fix:** Vite doesn't use SSR by default, check for dynamic imports

### "CORS policy blocked"
- **Cause:** Backend not allowing frontend domain
- **Fix:** Add production URL to backend CORS config

### "Cannot read property of undefined"
- **Cause:** Environment variable not set
- **Fix:** Check all `import.meta.env.VITE_*` variables are defined

### "Chunk load error"
- **Cause:** Old cached files after deployment
- **Fix:** Clear browser cache, add cache busting

## Performance Optimization

### 1. Enable Compression:
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Optimize Images:
- Use WebP format
- Compress images before deployment
- Use lazy loading for images

### 3. Code Splitting:
Already configured in `vite.config.js` with manual chunks.

## Getting Help

If issues persist:

1. **Check Vercel Logs:**
   - Go to Deployment → View Function Logs
   - Look for specific error messages

2. **Check Browser Console:**
   - Open DevTools → Console
   - Look for errors and warnings

3. **Check Network Tab:**
   - See which requests are failing
   - Check response status codes

4. **Test Locally:**
   - Run `npm run build && npm run preview`
   - Replicate production environment

## Contact Support

- **Vercel Support:** https://vercel.com/support
- **Render Support:** https://render.com/docs
- **Clerk Support:** https://clerk.com/support

---

**Last Updated:** January 29, 2026
**Status:** ✅ Configuration verified and optimized
