const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Spotify API credentials (add to .env)
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5173/spotify/callback';

// Spotify OAuth - Get authorization URL
router.get('/auth/url', (req, res) => {
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'user-read-email',
    'user-read-private'
  ].join(' ');

  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${SPOTIFY_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes)}`;

  res.json({ 
    success: true, 
    authUrl,
    configured: !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET)
  });
});

// Exchange authorization code for access token
router.post('/auth/token', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Authorization code required' 
      });
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Better error messages for common issues
      let errorMessage = data.error_description || 'Failed to get access token';
      
      if (data.error === 'invalid_grant') {
        errorMessage = 'Authorization code expired or already used. Please try connecting again.';
      }
      
      console.error('Spotify token error:', errorMessage, data);
      
      return res.status(400).json({
        success: false,
        error: errorMessage,
        errorCode: data.error
      });
    }

    res.json({
      success: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    });
  } catch (error) {
    console.error('Spotify token error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Refresh access token
router.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Refresh token required' 
      });
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Failed to refresh token');
    }

    res.json({
      success: true,
      accessToken: data.access_token,
      expiresIn: data.expires_in
    });
  } catch (error) {
    console.error('Spotify refresh error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get current playback state
router.get('/playback', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 204) {
      return res.json({
        success: true,
        isPlaying: false,
        track: null
      });
    }

    const data = await response.json();

    res.json({
      success: true,
      isPlaying: data.is_playing,
      track: data.item ? {
        name: data.item.name,
        artist: data.item.artists[0]?.name,
        album: data.item.album.name,
        albumArt: data.item.album.images[0]?.url,
        duration: data.item.duration_ms,
        progress: data.progress_ms
      } : null
    });
  } catch (error) {
    console.error('Spotify playback error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Play/Pause
router.put('/playback/:action', async (req, res) => {
  try {
    const { action } = req.params; // 'play' or 'pause'
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    const response = await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    res.json({
      success: response.ok,
      message: `Playback ${action}d`
    });
  } catch (error) {
    console.error('Spotify playback control error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Next/Previous track
router.post('/playback/:action', async (req, res) => {
  try {
    const { action } = req.params; // 'next' or 'previous'
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    const response = await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    res.json({
      success: response.ok,
      message: `Skipped to ${action} track`
    });
  } catch (error) {
    console.error('Spotify skip error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search for coding playlists
router.get('/search/playlists', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    const query = req.query.q || 'coding focus';

    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();

    res.json({
      success: true,
      playlists: data.playlists.items.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        image: p.images[0]?.url,
        uri: p.uri
      }))
    });
  } catch (error) {
    console.error('Spotify search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search for tracks (songs)
router.get('/search/tracks', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    const query = req.query.q || '';

    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query required'
      });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Search failed');
    }

    res.json({
      success: true,
      tracks: data.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        albumArt: track.album.images[0]?.url,
        duration: track.duration_ms,
        uri: track.uri,
        previewUrl: track.preview_url
      }))
    });
  } catch (error) {
    console.error('Spotify track search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search for tracks WITHOUT authentication (using Client Credentials)
router.get('/search/free', async (req, res) => {
  try {
    const query = req.query.q || '';

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query required'
      });
    }

    // Get access token using Client Credentials flow (no user auth needed)
    const authResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      throw new Error('Failed to get access token');
    }

    // Search for tracks
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${authData.access_token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Search failed');
    }

    // Filter tracks that have preview URLs
    const tracksWithPreviews = data.tracks.items
      .filter(track => track.preview_url)
      .map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        albumArt: track.album.images[0]?.url,
        duration: track.duration_ms,
        uri: track.uri,
        previewUrl: track.preview_url
      }));

    res.json({
      success: true,
      tracks: tracksWithPreviews
    });
  } catch (error) {
    console.error('Spotify free search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Play a specific track
router.put('/play/track', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    const { uri, uris } = req.body;

    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    if (!uri && !uris) {
      return res.status(400).json({
        success: false,
        error: 'Track URI required'
      });
    }

    const body = uris ? { uris } : { uris: [uri] };

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'No active device found. Please open Spotify on your device first.'
      });
    }

    if (response.status === 403) {
      const errorData = await response.json();
      return res.status(403).json({
        success: false,
        error: 'Spotify Premium required to control playback',
        isPremiumRequired: true,
        details: errorData.error?.message
      });
    }

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || 'Failed to play track';
      
      // Check if it's a premium requirement error
      if (errorMessage.toLowerCase().includes('premium')) {
        return res.status(403).json({
          success: false,
          error: 'Spotify Premium required to control playback',
          isPremiumRequired: true
        });
      }
      
      throw new Error(errorMessage);
    }

    res.json({
      success: true,
      message: 'Track playing'
    });
  } catch (error) {
    console.error('Spotify play track error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Set volume
router.put('/volume', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    const volume = parseInt(req.query.volume);

    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    if (isNaN(volume) || volume < 0 || volume > 100) {
      return res.status(400).json({
        success: false,
        error: 'Volume must be between 0 and 100'
      });
    }

    const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to set volume');
    }

    res.json({
      success: true,
      volume: volume
    });
  } catch (error) {
    console.error('Spotify volume error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Spotify Integration',
    configured: !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
