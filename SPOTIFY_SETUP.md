# Spotify API Setup — Playback & User Flow

Complete setup for Spotify API: search, playback control, and user OAuth.

---

## 1. Spotify Developer Dashboard

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Create an app or select an existing one
4. Note your **Client ID** and **Client Secret**

---

## 2. Redirect URI (Whitelist)

In your app settings, add these **Redirect URIs** exactly as shown:

| Environment | Redirect URI |
|-------------|--------------|
| Local dev   | `http://localhost:5173/spotify/callback` and `http://127.0.0.1:5173/spotify/callback` |
| Production  | `https://yourdomain.com/spotify/callback` |

Rules:
- The URL must **match exactly** (protocol, host, port, path)
- Add **both** `localhost` and `127.0.0.1` for local dev (browser may use either)
- Production must use **HTTPS** (Spotify does not accept insecure redirects)

---

## 3. Backend `.env`

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/spotify/callback
```

For production:
```env
SPOTIFY_REDIRECT_URI=https://yourdomain.com/spotify/callback
```

---

## 4. User Flow

1. User clicks **Connect Spotify** in the music player
2. Popup opens → user logs in and approves permissions
3. Callback hits `/spotify/callback` with auth code
4. Backend exchanges code for tokens
5. Tokens stored; playback control is available

---

## 5. Production (HTTPS / Certificate)

Spotify enforces **secure redirect URIs** for production:

- Use HTTPS for your frontend
- Add the production callback URL (e.g. `https://app.example.com/spotify/callback`) to Redirect URIs in the Dashboard
- Ensure `SPOTIFY_REDIRECT_URI` in `.env` matches that URL

---

## 6. Features

| Feature | Requirement |
|---------|-------------|
| Search (30s previews) | Client ID + Secret |
| Connect + playback control | Client ID + Secret + user OAuth |
| Playlists (embeds) | No API keys needed |

---

## 7. Troubleshooting

**Invalid redirect URI**
- Redirect URI in code must match one in the Dashboard exactly
- Check protocol, host, port, and path

**Playback control fails**
- User must have Spotify Premium for device playback
- User must have Spotify open (desktop, web, or mobile)
