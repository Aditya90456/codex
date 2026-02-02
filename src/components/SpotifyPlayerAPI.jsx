import { useState, useEffect } from 'react';
import { Music, X, Play, Pause, SkipForward, SkipBack, Search, LogIn, Loader, Volume2, VolumeX } from 'lucide-react';

const SpotifyPlayerAPI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isExchangingToken, setIsExchangingToken] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';

  // Check if already connected
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      setAccessToken(token);
      setIsConnected(true);
      fetchCurrentTrack(token);
    }
  }, []);

  // Poll for current track
  useEffect(() => {
    if (!isConnected || !accessToken) return;

    const interval = setInterval(() => {
      fetchCurrentTrack(accessToken);
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, accessToken]);

  const connectSpotify = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/spotify/auth/url`);
      const data = await response.json();

      if (!data.configured) {
        alert('Spotify API not configured. Please add credentials to backend .env');
        return;
      }

      const width = 500;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        data.authUrl,
        'Spotify Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      window.addEventListener('message', handleSpotifyCallback);
    } catch (error) {
      console.error('Spotify connect error:', error);
      alert('Failed to connect to Spotify');
    }
  };

  const handleSpotifyCallback = async (event) => {
    if (event.data.type === 'spotify-callback') {
      // Prevent duplicate token exchanges
      if (isExchangingToken) {
        console.log('Token exchange already in progress, skipping...');
        return;
      }

      const { code } = event.data;
      setIsExchangingToken(true);

      try {
        const response = await fetch(`${API_BASE}/api/spotify/auth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (data.success) {
          setAccessToken(data.accessToken);
          setIsConnected(true);
          localStorage.setItem('spotify_access_token', data.accessToken);
          localStorage.setItem('spotify_refresh_token', data.refreshToken);
          fetchCurrentTrack(data.accessToken);
          
          // Remove the event listener after successful connection
          window.removeEventListener('message', handleSpotifyCallback);
        } else {
          console.error('Spotify auth failed:', data.error);
          alert(data.error || 'Failed to connect to Spotify. Please try again.');
          
          // Remove the event listener on error too
          window.removeEventListener('message', handleSpotifyCallback);
        }
      } catch (error) {
        console.error('Token exchange error:', error);
        alert('Failed to connect to Spotify. Please try again.');
        
        // Remove the event listener on error
        window.removeEventListener('message', handleSpotifyCallback);
      } finally {
        setIsExchangingToken(false);
      }
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccessToken(null);
    setCurrentTrack(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
  };

  const fetchCurrentTrack = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/api/spotify/playback`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setCurrentTrack(data.track);
        setIsPlaying(data.isPlaying);
      }
    } catch (error) {
      console.error('Fetch track error:', error);
    }
  };

  const togglePlayback = async () => {
    try {
      const action = isPlaying ? 'pause' : 'play';
      await fetch(`${API_BASE}/api/spotify/playback/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback toggle error:', error);
    }
  };

  const skipTrack = async (direction) => {
    try {
      await fetch(`${API_BASE}/api/spotify/playback/${direction}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      setTimeout(() => fetchCurrentTrack(accessToken), 500);
    } catch (error) {
      console.error('Skip track error:', error);
    }
  };

  const searchTracks = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const response = await fetch(
        `${API_BASE}/api/spotify/search/tracks?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.tracks);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-search as user types (debounced)
  useEffect(() => {
    if (!searchQuery.trim() || !isConnected) {
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      searchTracksAuto();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery, isConnected]);

  const searchTracksAuto = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/spotify/search/tracks?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.tracks.slice(0, 5)); // Show top 5 suggestions
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Auto-search error:', error);
    }
  };

  const playTrack = async (trackUri, previewUrl) => {
    try {
      // Try to play via Spotify API (Premium only)
      const response = await fetch(`${API_BASE}/api/spotify/play/track`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uri: trackUri })
      });

      const data = await response.json();

      if (!data.success) {
        // If Premium required, offer preview or open in Spotify
        if (data.error?.includes('Premium') || data.error?.includes('premium')) {
          const choice = confirm(
            '🎵 Spotify Premium Required\n\n' +
            'Playing tracks requires Spotify Premium.\n\n' +
            'Click OK to open this song in Spotify app/web,\n' +
            'or Cancel to stay here.'
          );
          
          if (choice) {
            // Open in Spotify
            window.open(`https://open.spotify.com/track/${trackUri.split(':')[2]}`, '_blank');
          }
          return;
        }
        
        alert(data.error || 'Failed to play track. Make sure Spotify is open on your device.');
        return;
      }

      setSearchResults([]);
      setSearchQuery('');
      setShowSuggestions(false);
      setTimeout(() => fetchCurrentTrack(accessToken), 1000);
    } catch (error) {
      console.error('Play track error:', error);
      alert('Failed to play track. Make sure Spotify is open on your device.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchTracks();
    }
  };

  const setVolumeLevel = async (newVolume) => {
    try {
      await fetch(`${API_BASE}/api/spotify/volume?volume=${newVolume}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setVolume(newVolume);
    } catch (error) {
      console.error('Volume control error:', error);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolumeLevel(volume);
      setIsMuted(false);
    } else {
      setVolumeLevel(0);
      setIsMuted(true);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating Music Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all hover:scale-110"
        title="Spotify Player"
      >
        <Music className="w-6 h-6" />
      </button>

      {/* Spotify Player Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-white">Spotify Player</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isConnected ? (
            /* Not Connected */
            <div className="p-6 text-center">
              <div className="mb-4">
                <Music className="w-16 h-16 text-green-500 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">Connect to Spotify</h4>
                <p className="text-sm text-gray-400">
                  Search and play your favorite songs while coding
                </p>
              </div>
              <button
                onClick={connectSpotify}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mx-auto"
              >
                <LogIn className="w-5 h-5" />
                Connect with Spotify
              </button>
            </div>
          ) : (
            /* Connected */
            <>
              {/* Search Bar */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => searchQuery && setShowSuggestions(true)}
                      placeholder="Search for songs..."
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-green-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowSuggestions(false);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={searchTracks}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isSearching ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Auto-Suggestions or Search Results */}
              {(showSuggestions || searchResults.length > 0) && (
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-400">
                      {showSuggestions ? 'Suggestions' : 'Search Results'}
                    </h4>
                    {searchResults.length > 0 && (
                      <button
                        onClick={() => {
                          setSearchResults([]);
                          setShowSuggestions(false);
                        }}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {searchResults.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track.uri, track.previewUrl)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg transition-colors text-left group"
                    >
                      {track.albumArt && (
                        <img src={track.albumArt} alt={track.album} className="w-12 h-12 rounded flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{track.name}</p>
                        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                      </div>
                      <Play className="w-5 h-5 text-green-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              {/* Current Track */}
              {currentTrack && searchResults.length === 0 && !showSuggestions && (
                <div className="flex-1 p-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Now Playing</h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    {currentTrack.albumArt && (
                      <img
                        src={currentTrack.albumArt}
                        alt={currentTrack.album}
                        className="w-full aspect-square rounded-lg mb-3"
                      />
                    )}
                    <h5 className="text-white font-semibold truncate">{currentTrack.name}</h5>
                    <p className="text-sm text-gray-400 truncate mb-3">{currentTrack.artist}</p>
                    
                    {/* Progress Bar */}
                    {currentTrack.duration && (
                      <div className="space-y-1">
                        <div className="w-full bg-slate-600 rounded-full h-1">
                          <div
                            className="bg-green-500 h-1 rounded-full transition-all"
                            style={{ width: `${(currentTrack.progress / currentTrack.duration) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{formatTime(currentTrack.progress || 0)}</span>
                          <span>{formatTime(currentTrack.duration)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Playback Controls */}
              <div className="p-4 bg-slate-900 border-t border-slate-700">
                {/* Volume Control */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVolume = parseInt(e.target.value);
                      setVolumeLevel(newVolume);
                      if (newVolume > 0) setIsMuted(false);
                    }}
                    className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{isMuted ? 0 : volume}%</span>
                </div>

                {/* Playback Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => skipTrack('previous')}
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                    title="Previous"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePlayback}
                    className="p-3 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={() => skipTrack('next')}
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                    title="Next"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  onClick={disconnect}
                  className="w-full mt-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SpotifyPlayerAPI;
