const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Jamendo API - Free music, no authentication required
// Official test client_id (read-only, 35k req/mo) - works out of the box
// Get your own at: https://devportal.jamendo.com/
const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '709fa152';

// Search for tracks
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = req.query.limit || 20;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query required'
      });
    }

    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&include=musicinfo&audioformat=mp32`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Search failed');
    }

    res.json({
      success: true,
      tracks: data.results.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name,
        albumArt: track.album_image || track.image,
        duration: track.duration * 1000, // Convert to ms
        audioUrl: track.audio,
        audioDownload: track.audiodownload,
        shareUrl: track.shareurl,
        license: track.license_ccurl
      }))
    });
  } catch (error) {
    console.error('Jamendo search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get popular tracks
router.get('/popular', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const genre = req.query.genre || '';

    let url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&order=popularity_total&include=musicinfo&audioformat=mp32`;
    
    if (genre) {
      url += `&tags=${encodeURIComponent(genre)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to get popular tracks');
    }

    res.json({
      success: true,
      tracks: data.results.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name,
        albumArt: track.album_image || track.image,
        duration: track.duration * 1000,
        audioUrl: track.audio,
        audioDownload: track.audiodownload,
        shareUrl: track.shareurl,
        license: track.license_ccurl
      }))
    });
  } catch (error) {
    console.error('Jamendo popular error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Bollywood / Indian music - curated search
router.get('/bollywood', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    // Search for Bollywood, Indian, Hindi music on Jamendo
    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&search=bollywood+indian&order=popularity_total&include=musicinfo&audioformat=mp32`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to get Bollywood tracks');
    }

    res.json({
      success: true,
      genre: 'bollywood',
      tracks: data.results.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name,
        albumArt: track.album_image || track.image,
        duration: track.duration * 1000,
        audioUrl: track.audio,
        audioDownload: track.audiodownload,
        shareUrl: track.shareurl,
        license: track.license_ccurl
      }))
    });
  } catch (error) {
    console.error('Jamendo Bollywood error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get tracks by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const limit = req.query.limit || 20;

    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&tags=${encodeURIComponent(genre)}&order=popularity_total&include=musicinfo&audioformat=mp32`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to get tracks by genre');
    }

    res.json({
      success: true,
      genre: genre,
      tracks: data.results.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        album: track.album_name,
        albumArt: track.album_image || track.image,
        duration: track.duration * 1000,
        audioUrl: track.audio,
        audioDownload: track.audiodownload,
        shareUrl: track.shareurl,
        license: track.license_ccurl
      }))
    });
  } catch (error) {
    console.error('Jamendo genre error:', error);
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
    service: 'Jamendo Music API',
    configured: !!JAMENDO_CLIENT_ID && JAMENDO_CLIENT_ID !== 'YOUR_CLIENT_ID',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
