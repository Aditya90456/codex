# Spotify Integration Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Spotify App

1. Go to **https://developer.spotify.com/dashboard**
2. Log in with your Spotify account (free or premium)
3. Click **"Create app"** button

### Step 2: Configure App

Fill in the form:
- **App name**: `Codex Playground` (or any name you like)
- **App description**: `Music player for coding sessions`
- **Redirect URI**: `http://127.0.0.1:5173/spotify/callback`
- **Which API/SDKs are you planning to use?**: Select "Web API"
- Accept terms and click **"Save"**

### Step 3: Get Credentials

1. Click on your newly created app
2. Click **"Settings"** button
3. You'll see:
   - **Client ID** - Copy this
   - **Client Secret** - Click "View client secret" and copy it

### Step 4: Add to Backend

Open `backend/.env` and replace:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

With your actual credentials:

```env
SPOTIFY_CLIENT_ID=abc123def456...
SPOTIFY_CLIENT_SECRET=xyz789uvw012...
```

### Step 5: Restart Backend

```cmd
cd backend
npm start
```

### Step 6: Test It!

1. Go to your LeetCode editor
2. Click the green music button (bottom-right)
3. Click "Connect with Spotify"
4. Log in and authorize
5. Search for music and start coding! 🎵

## Features You Get

✅ **Search** - Find any playlist, artist, or song
✅ **Playback Control** - Play, pause, skip tracks
✅ **Real-time Info** - See current track with album art
✅ **Coding Playlists** - Search "coding", "focus", "lo-fi"

## Troubleshooting

**"Redirect URI mismatch"**
- Make sure redirect URI in Spotify dashboard exactly matches: `http://127.0.0.1:5173/spotify/callback`

**"Invalid client"**
- Double-check Client ID and Secret are copied correctly
- No extra spaces or quotes

**"No active device"**
- Open Spotify app on your computer or phone
- Start playing any song
- Then use the web player

## For Production Deployment

When deploying to Vercel:

1. Add redirect URI in Spotify dashboard:
   - `https://your-app.vercel.app/spotify/callback`

2. Add environment variables in Vercel:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REDIRECT_URI=https://your-app.vercel.app/spotify/callback`

## Need Help?

- Spotify API Docs: https://developer.spotify.com/documentation/web-api
- Dashboard: https://developer.spotify.com/dashboard
