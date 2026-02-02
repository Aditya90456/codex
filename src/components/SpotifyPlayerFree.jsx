import { useState, useEffect, useRef, useCallback } from 'react';
import { Music, X, Search, Loader, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart } from 'lucide-react';

const MY_SONGS_KEY = 'codex_my_songs';

const getMySongs = () => {
  try {
    const saved = localStorage.getItem(MY_SONGS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveMySongs = (tracks) => {
  localStorage.setItem(MY_SONGS_KEY, JSON.stringify(tracks));
};

const SPOTIFY_PLAYLISTS = [
  { name: 'Bollywood Dance', embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8xfQRRX1PDm' },
  { name: 'Deep Focus', embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { name: 'Coding Mode', embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX5trt9i14X7j' },
  { name: 'Instrumental Study', embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3PFzdbtx1Us' },
  { name: 'Lo-Fi Beats', embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn' },
  { name: 'Top 50 India', embed: 'https://open.spotify.com/embed/playlist/37i9dQZEVXbObFQZ3JLcXt' }
];

const SpotifyPlayerFree = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';
  const [mySongs, setMySongs] = useState(getMySongs);
  const [viewMode, setViewMode] = useState('popular'); // 'popular' | 'search' | 'mySongs' | 'spotify'
  const [selectedSpotifyPlaylist, setSelectedSpotifyPlaylist] = useState(SPOTIFY_PLAYLISTS[0]);

  const loadMySongs = useCallback(() => {
    const saved = getMySongs();
    setMySongs(saved);
    setSearchResults(saved);
    setViewMode('mySongs');
  }, []);

  const toggleSaveTrack = (track, e) => {
    e?.stopPropagation();
    const saved = getMySongs();
    const exists = saved.some((t) => t.id === track.id);
    const updated = exists ? saved.filter((t) => t.id !== track.id) : [...saved, track];
    saveMySongs(updated);
    setMySongs(updated);
    if (viewMode === 'mySongs') setSearchResults(updated);
  };

  const isTrackSaved = (trackId) => mySongs.some((t) => t.id === trackId);

  // Load popular tracks on open (real music from Jamendo)
  const loadPopularTracks = useCallback(async () => {
    setIsSearching(true);
    setViewMode('popular');
    try {
      const res = await fetch(`${API_BASE}/api/jamendo/popular?limit=20`);
      const data = await res.json();
      if (data.success && data.tracks?.length > 0) {
        setSearchResults(data.tracks);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Load popular error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Load popular tracks from API when player opens
  useEffect(() => {
    if (isOpen) loadPopularTracks();
  }, [isOpen, loadPopularTracks]);

  // Update time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Search tracks - Spotify API first (large catalog), then Jamendo API (full songs)
  const searchTracks = async (queryOverride) => {
    const q = (queryOverride ?? searchQuery).trim();
    if (!q) return;

    setSearchQuery(q);
    setIsSearching(true);
    setViewMode('search');
    let tracks = [];

    try {
      // Spotify API first (30-sec previews, large catalog)
      const spotifyRes = await fetch(
        `${API_BASE}/api/spotify/search/free?q=${encodeURIComponent(q)}`
      );
      const spotifyData = await spotifyRes.json();

      if (spotifyData.success && spotifyData.tracks?.length > 0) {
        tracks = spotifyData.tracks.map((t) => ({
          id: t.id,
          name: t.name,
          artist: t.artist,
          album: t.album,
          albumArt: t.albumArt,
          duration: t.duration,
          audioUrl: t.previewUrl,
        }));
      } else {
        // Fallback: Jamendo API (full songs)
        const jamendoRes = await fetch(
          `${API_BASE}/api/jamendo/search?q=${encodeURIComponent(q)}&limit=20`
        );
        const jamendoData = await jamendoRes.json();

        if (jamendoData.success && jamendoData.tracks?.length > 0) {
          tracks = jamendoData.tracks;
        }
      }

      setSearchResults(tracks);
      if (tracks.length === 0) {
        console.warn('No tracks found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Is the backend running on port 3001?');
    } finally {
      setIsSearching(false);
    }
  };

  const playTrack = (track) => {
    if (!track.audioUrl) {
      alert('Audio not available for this track. Try another song!');
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl || track.previewUrl;
      audioRef.current.volume = volume / 100;
      audioRef.current.play();
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipToNext = () => {
    if (searchResults.length === 0) return;
    
    const currentIndex = searchResults.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % searchResults.length;
    playTrack(searchResults[nextIndex]);
  };

  const skipToPrevious = () => {
    if (searchResults.length === 0) return;
    
    const currentIndex = searchResults.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex === 0 ? searchResults.length - 1 : currentIndex - 1;
    playTrack(searchResults[prevIndex]);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      handleVolumeChange(volume);
      setIsMuted(false);
    } else {
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchTracks();
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Floating Music Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all hover:scale-110"
        title="Music Player"
      >
        <Music className="w-6 h-6" />
      </button>

      {/* Music Player Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-white">Free Music Player</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info Banner */}
          <div className="p-3 bg-green-900/30 border-b border-slate-700">
            <p className="text-xs text-green-300">
              🎵 Spotify playlists • Jamendo search • Save to My Songs
            </p>
          </div>

          {/* Quick Search - Bollywood & More */}
          <div className="px-4 pt-2 pb-1 border-b border-slate-700">
            <p className="text-xs text-gray-400 mb-2">Quick search:</p>
            <div className="flex flex-wrap gap-2">
              {['Spotify', 'My Songs', 'Popular', 'Movies', 'Bollywood', 'Indian', 'Hindi', 'Chill', 'Rock', 'Jazz'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    if (genre === 'Spotify') setViewMode('spotify');
                    else if (genre === 'Popular') loadPopularTracks();
                    else if (genre === 'My Songs') loadMySongs();
                    else searchTracks(genre);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    (genre === 'Spotify' && viewMode === 'spotify') ||
                    (genre === 'My Songs' && viewMode === 'mySongs') ||
                    (genre === 'Popular' && viewMode === 'popular')
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 hover:bg-green-600 text-gray-300 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Spotify Playlists - when Spotify mode */}
          {viewMode === 'spotify' && (
            <>
              <div className="p-4 border-b border-slate-700">
                <label className="text-sm text-gray-400 mb-2 block">Spotify Playlist</label>
                <select
                  value={selectedSpotifyPlaylist.name}
                  onChange={(e) => {
                    const p = SPOTIFY_PLAYLISTS.find((pl) => pl.name === e.target.value);
                    if (p) setSelectedSpotifyPlaylist(p);
                  }}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-green-500"
                >
                  {SPOTIFY_PLAYLISTS.map((pl) => (
                    <option key={pl.name} value={pl.name}>{pl.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 p-4 min-h-[300px]">
                <iframe
                  src={selectedSpotifyPlaylist.embed}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>
            </>
          )}

          {/* Search, Tracks, My Songs - when not Spotify mode */}
          {viewMode !== 'spotify' && (
          <>
          <div className="p-4 border-b border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for songs..."
                className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-green-500"
              />
              <button
                onClick={searchTracks}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isSearching ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Current Track */}
          {currentTrack && (
            <div className="p-4 bg-slate-900 border-b border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                {currentTrack.albumArt && (
                  <img src={currentTrack.albumArt} alt={currentTrack.album} className="w-16 h-16 rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{currentTrack.name}</p>
                  <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-600 rounded-full h-1 cursor-pointer">
                  <div
                    className="bg-green-500 h-1 rounded-full transition-all"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">
                {viewMode === 'mySongs' ? 'My Songs' : 'Tracks'}
              </h4>
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  className={`w-full flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer group ${
                    currentTrack?.id === track.id ? 'bg-slate-700' : ''
                  }`}
                  onClick={() => playTrack(track)}
                >
                  {track.albumArt && (
                    <img src={track.albumArt} alt={track.album} className="w-12 h-12 rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.name}</p>
                    <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                  </div>
                  <button
                    onClick={(e) => toggleSaveTrack(track, e)}
                    className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${
                      isTrackSaved(track.id)
                        ? 'text-pink-500 hover:bg-pink-500/20'
                        : 'text-gray-500 hover:text-pink-500 hover:bg-pink-500/20'
                    }`}
                    title={isTrackSaved(track.id) ? 'Remove from My Songs' : 'Add to My Songs'}
                  >
                    <Heart className={`w-5 h-5 ${isTrackSaved(track.id) ? 'fill-current' : ''}`} />
                  </button>
                  {track.audioUrl ? (
                    <Play className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <span className="text-xs text-gray-500">No audio</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!currentTrack && searchResults.length === 0 && (
            <div className="flex-1 p-6 text-center">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-3" />
              {viewMode === 'mySongs' ? (
                <>
                  <p className="text-gray-400 mb-2">No songs saved yet</p>
                  <p className="text-sm text-gray-500">
                    Search for music and click the ♥ to add tracks to My Songs
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-400 mb-2">Search for free music</p>
                  <p className="text-sm text-gray-500">
                    Try: Movies, Bollywood, Indian, electronic, jazz, rock, ambient, chill
                  </p>
                </>
              )}
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
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
              />
              <span className="text-xs text-gray-400 w-8 text-right">{isMuted ? 0 : volume}%</span>
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={skipToPrevious}
                disabled={!currentTrack || searchResults.length === 0}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlayPause}
                disabled={!currentTrack}
                className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 rounded-full transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={skipToNext}
                disabled={!currentTrack || searchResults.length === 0}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
                title="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
          </>
          )}
        </div>
      )}
    </>
  );
};

export default SpotifyPlayerFree;
