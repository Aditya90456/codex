# 🔧 Social Media Sign Up Fix - Complete Guide

## 🚨 Current Issue
Social media sign up buttons (Google, LinkedIn, GitHub) are not working because they require OAuth configuration in the Clerk dashboard.

## 📋 Step-by-Step Fix

### Step 1: Configure Clerk Dashboard

1. **Go to Clerk Dashboard**
   - Visit: https://dashboard.clerk.com
   - Sign in to your account
   - Select your application

2. **Navigate to Social Connections**
   - Go to "User & Authentication" → "Social Connections"
   - You'll see available providers: Google, GitHub, LinkedIn, etc.

### Step 2: Enable Social Providers

#### For Google OAuth:
1. **Enable Google in Clerk**
   - Toggle ON the Google provider
   - You'll need Google OAuth credentials

2. **Create Google OAuth App**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Set authorized redirect URIs:
     - `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
     - `http://localhost:5173` (for development)

3. **Add Credentials to Clerk**
   - Copy Client ID and Client Secret from Google
   - Paste them in Clerk's Google provider settings

#### For GitHub OAuth:
1. **Enable GitHub in Clerk**
   - Toggle ON the GitHub provider

2. **Create GitHub OAuth App**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Set Authorization callback URL:
     - `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`

3. **Add Credentials to Clerk**
   - Copy Client ID and Client Secret from GitHub
   - Paste them in Clerk's GitHub provider settings

#### For LinkedIn OAuth:
1. **Enable LinkedIn in Clerk**
   - Toggle ON the LinkedIn provider

2. **Create LinkedIn App**
   - Go to [LinkedIn Developer Portal](https://developer.linkedin.com)
   - Create a new app
   - Add redirect URLs:
     - `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`

3. **Add Credentials to Clerk**
   - Copy Client ID and Client Secret from LinkedIn
   - Paste them in Clerk's LinkedIn provider settings

### Step 3: Update Redirect URLs

Make sure all OAuth apps have these redirect URLs:
- **Production**: `https://your-domain.com`
- **Development**: `http://localhost:5173`
- **Clerk Callback**: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`

### Step 4: Test Configuration

1. **Restart Development Server**
   ```bash
   npm run dev
   ```

2. **Test Social Login**
   - Click sign up button
   - Try each social provider
   - Should redirect to respective OAuth screens

## 🔍 Troubleshooting

### Common Issues:

1. **"OAuth app not found" Error**
   - Check if OAuth app is created in provider's developer console
   - Verify Client ID and Secret are correct in Clerk

2. **"Redirect URI mismatch" Error**
   - Add correct redirect URLs to OAuth app
   - Include both development and production URLs

3. **"Provider not enabled" Error**
   - Make sure provider is toggled ON in Clerk dashboard
   - Save settings after enabling

4. **"Invalid client" Error**
   - Double-check Client ID and Secret
   - Ensure they're copied correctly without extra spaces

### Quick Fixes:

1. **Clear Browser Cache**
   - Clear cookies and cache
   - Try in incognito/private mode

2. **Check Network Tab**
   - Open browser dev tools
   - Look for failed OAuth requests
   - Check error messages

3. **Verify Environment**
   - Ensure VITE_CLERK_PUBLISHABLE_KEY is set
   - Restart server after .env changes

## 🎯 Expected Behavior After Fix

✅ **Google Sign Up**: Redirects to Google OAuth, returns with user data  
✅ **GitHub Sign Up**: Redirects to GitHub OAuth, returns with user data  
✅ **LinkedIn Sign Up**: Redirects to LinkedIn OAuth, returns with user data  
✅ **Email Sign Up**: Works as fallback option  
✅ **Fast Demo Sign Up**: Works when Clerk is not configured  

## 📞 Need Help?

1. **Clerk Documentation**: https://docs.clerk.com/authentication/social-connections
2. **Google OAuth Setup**: https://developers.google.com/identity/protocols/oauth2
3. **GitHub OAuth Setup**: https://docs.github.com/en/developers/apps/building-oauth-apps
4. **LinkedIn OAuth Setup**: https://docs.microsoft.com/en-us/linkedin/shared/authentication

## 🚀 Quick Test

After configuration, test with this checklist:
- [ ] Google sign up button works
- [ ] GitHub sign up button works  
- [ ] LinkedIn sign up button works
- [ ] Email sign up still works
- [ ] User data is properly stored
- [ ] Redirect after sign up works

The social media sign up should work perfectly after following these steps!