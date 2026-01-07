# Social Login Setup Guide (Google, LinkedIn, GitHub)

## Current Issue
Social login buttons (Google, LinkedIn, GitHub) appear in the Clerk modal but don't work because they need to be configured in your Clerk dashboard.

## ✅ Quick Fix - Enable Social Providers

### Step 1: Access Clerk Dashboard
1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign in to your account
3. Select your application

### Step 2: Enable Social Providers
1. In the sidebar, click **"User & Authentication"**
2. Click **"Social Connections"**
3. Enable the providers you want:

#### Google OAuth
- Click **"Add connection"** → **"Google"**
- Follow the setup wizard
- Google will provide Client ID and Client Secret
- Add authorized redirect URIs: `https://your-domain.com/sso-callback`

#### GitHub OAuth
- Click **"Add connection"** → **"GitHub"**
- Go to GitHub → Settings → Developer settings → OAuth Apps
- Create new OAuth App
- Copy Client ID and Client Secret to Clerk

#### LinkedIn OAuth
- Click **"Add connection"** → **"LinkedIn"**
- Go to LinkedIn Developer Portal
- Create new app and get credentials
- Add to Clerk dashboard

### Step 3: Configure Redirect URLs
In each provider, add these redirect URLs:
```
http://localhost:5173/sso-callback (for development)
https://your-domain.com/sso-callback (for production)
```

## 🚀 Alternative: Demo Mode with Email

If you want to test immediately without setting up OAuth:

### Option 1: Email/Password Only
The current setup already supports email/password authentication. Users can:
1. Click "Sign Up" 
2. Enter email and password
3. Verify email (if required)
4. Start coding immediately

### Option 2: Magic Links
Enable magic links in Clerk dashboard:
1. Go to **"User & Authentication"** → **"Email, Phone, Username"**
2. Enable **"Email verification links"**
3. Users can sign in with just email (no password needed)

## 🔧 Current Working Features
- ✅ Email/Password authentication
- ✅ Email verification
- ✅ Password reset
- ✅ User profiles
- ✅ Session management

## 🎯 Expected Behavior After Setup
Once social providers are configured:
- ✅ Google "Sign in with Google" button works
- ✅ GitHub "Sign in with GitHub" button works  
- ✅ LinkedIn "Sign in with LinkedIn" button works
- ✅ One-click social authentication
- ✅ Automatic account creation
- ✅ Profile data import from social accounts

## 🚨 Common Issues
1. **"OAuth app not found"** - Provider not configured in Clerk
2. **"Redirect URI mismatch"** - Wrong callback URL in provider settings
3. **"Invalid client"** - Wrong Client ID/Secret in Clerk dashboard
4. **"Access denied"** - App not approved by provider (for production)

## 💡 Quick Test
To test if Clerk is working:
1. Try email/password signup first
2. Check Clerk dashboard for user creation
3. Then configure social providers one by one

The authentication system is working - just needs social provider configuration!