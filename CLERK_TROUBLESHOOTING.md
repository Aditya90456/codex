# Clerk Sign Up Troubleshooting Guide

## Common Issues and Solutions

### 1. **Environment Variables**
Make sure your `.env` file has the correct Clerk publishable key:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-key-here
```

### 2. **Clerk Dashboard Configuration**
In your Clerk Dashboard (https://dashboard.clerk.com):

1. **Go to your application**
2. **Navigate to "Domains"**
3. **Add your development domain:**
   - `http://localhost:5173` (for Vite dev server)
   - `http://localhost:3000` (if using different port)

4. **Check "Sign-up" settings:**
   - Go to "User & Authentication" → "Email, Phone, Username"
   - Make sure "Email address" is enabled
   - Enable "Username" if you want usernames

5. **Social Connections (Optional):**
   - Go to "User & Authentication" → "Social Connections"
   - Enable Google, GitHub, etc. if desired

### 3. **Redirect URLs**
In Clerk Dashboard:
1. Go to "Domains"
2. Add these URLs:
   - **Sign-in redirect:** `http://localhost:5173`
   - **Sign-up redirect:** `http://localhost:5173`
   - **Sign-out redirect:** `http://localhost:5173`

### 4. **Browser Issues**
- **Clear browser cache and cookies**
- **Disable ad blockers** (they sometimes block auth)
- **Try incognito/private mode**
- **Check browser console** for error messages

### 5. **Network Issues**
- Check if you can access `https://clerk.com`
- Verify your internet connection
- Try disabling VPN if using one

### 6. **Code Issues**
The sign up should work with these fixes:
- Added `routing="hash"` to SignUp component
- Fixed redirect URLs to use `window.location.origin`
- Added proper navigation function to ClerkProvider

### 7. **Testing Steps**
1. **Start your dev server:** `npm run dev`
2. **Open browser:** `http://localhost:5173`
3. **Click "Get Started"** button
4. **Try signing up** with a test email
5. **Check browser console** for any errors

### 8. **Debug Information**
The app includes a debug component (bottom-right corner in development mode) that shows:
- Clerk connection status
- User authentication state
- Environment variables
- Current URL

### 9. **Alternative Solutions**
If Clerk continues to have issues, you can:
1. **Use the simple backend** (in `/backend` folder) without authentication
2. **Switch to a different auth provider** (Firebase, Auth0, etc.)
3. **Implement simple local authentication**

### 10. **Common Error Messages**

**"Invalid publishable key"**
- Check your `.env` file
- Verify the key in Clerk Dashboard

**"Domain not allowed"**
- Add your domain in Clerk Dashboard → Domains

**"Sign up is disabled"**
- Check Clerk Dashboard → User & Authentication settings

**Network errors**
- Check internet connection
- Try different browser
- Disable browser extensions

## Quick Fix Commands

```bash
# Restart dev server
npm run dev

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check environment variables
echo $VITE_CLERK_PUBLISHABLE_KEY
```

## Contact Support
If issues persist:
1. Check Clerk documentation: https://clerk.com/docs
2. Clerk Discord community: https://discord.com/invite/b5rXHjAg7A
3. GitHub issues: https://github.com/clerkinc/javascript

## Working Test Account
For testing, you can use:
- **Email:** test@example.com
- **Password:** TestPassword123!

Make sure to use a real email address for verification if required.