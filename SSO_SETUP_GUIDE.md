# 🔧 SSO (Social Login) Setup Guide

## 🚨 **Issue: SSO Not Working**

Social Sign-On (Google, GitHub, LinkedIn, etc.) requires configuration in your Clerk dashboard. By default, only email/password authentication is enabled.

## ✅ **Step-by-Step SSO Setup**

### **Step 1: Access Clerk Dashboard**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign in to your account
3. Select your application

### **Step 2: Configure Social Providers**

1. **Navigate to Social Connections**:
   - In the sidebar, click **"Social Connections"**
   - Or go to Settings → Authentication → Social Connections

2. **Enable Providers**:
   - **Google** (Most Popular):
     - Click "Configure" next to Google
     - Follow the setup wizard
     - No additional setup needed for basic use
   
   - **GitHub** (Great for Developers):
     - Click "Configure" next to GitHub
     - Follow the setup wizard
     - No additional setup needed for basic use
   
   - **LinkedIn** (Professional):
     - Click "Configure" next to LinkedIn
     - Follow the setup wizard

### **Step 3: Quick Enable (Recommended)**

For development, you can use Clerk's shared OAuth apps:

1. **Google**: Click "Use Clerk's shared OAuth app" (instant setup)
2. **GitHub**: Click "Use Clerk's shared OAuth app" (instant setup)
3. **LinkedIn**: Click "Use Clerk's shared OAuth app" (instant setup)

This allows immediate testing without creating your own OAuth apps.

### **Step 4: Production Setup (Later)**

For production, create your own OAuth applications:

#### **Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs from Clerk
6. Copy Client ID and Secret to Clerk

#### **GitHub OAuth Setup**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details
4. Add callback URL from Clerk
5. Copy Client ID and Secret to Clerk

## 🛠️ **Verify SSO is Working**

### **Test the Setup**

1. **Go to your sign-up page**: `http://localhost:5173/sign-up`
2. **Look for social buttons**: Should see Google, GitHub, LinkedIn buttons
3. **Click a social button**: Should redirect to provider
4. **Complete authentication**: Should redirect back to your app
5. **Check user profile**: Should show social provider info

### **Debug SSO Issues**

If social buttons don't appear:

1. **Check Clerk Dashboard**:
   - Verify providers are enabled
   - Check configuration status

2. **Check Console Errors**:
   - Look for OAuth-related errors
   - Check network requests

3. **Verify Domain Settings**:
   - Ensure localhost is allowed
   - Check redirect URLs

## 🎯 **Expected Results**

After setup, you should see:

✅ **Social buttons** in sign-up/sign-in forms
✅ **Smooth OAuth flow** when clicking social buttons
✅ **User profiles** populated with social provider data
✅ **No console errors** related to OAuth

## 🔧 **Quick Fix Commands**

If you need to restart after configuration:

```bash
# Stop development server
# Ctrl+C

# Restart server
npm run dev
```

## 📱 **Mobile Considerations**

Social login works on mobile browsers but:
- Some providers may show mobile-optimized flows
- Deep linking might behave differently
- Test on actual devices for best results

## 🚨 **Common Issues**

### **"OAuth App Not Found"**
- Provider not configured in Clerk dashboard
- Using wrong OAuth credentials

### **"Redirect URI Mismatch"**
- Callback URL not properly configured
- Domain mismatch between app and OAuth settings

### **"Access Denied"**
- User declined permissions
- OAuth app not approved (for production)

## 🎉 **Success Checklist**

- [ ] Clerk dashboard shows enabled social providers
- [ ] Social buttons appear in auth forms
- [ ] Clicking social buttons redirects to provider
- [ ] Authentication completes successfully
- [ ] User is redirected back to your app
- [ ] User profile shows social provider data

## 📞 **Need Help?**

1. Check Clerk's [Social Login Documentation](https://clerk.com/docs/authentication/social-connections)
2. Verify your Clerk dashboard configuration
3. Test with different browsers
4. Check browser console for errors

---

**🎯 Most users can get SSO working in under 5 minutes using Clerk's shared OAuth apps!**