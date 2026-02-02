import { useState, useEffect, useRef } from 'react';
import { Music, X, Search, Loader, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

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

  // Search tracks using Jamendo API (free, full songs!)
  const searchTracks = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/jamendo/search?q=${encodeURIComponent(searchQuery)}&limit=20`
      );

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.tracks);
      } else {
        alert('Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
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
      audioRef.current.src = track.audioUrl;
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
              🎵 Full songs • 100% Free • No ads • Legal music from Jamendo
            </p>
          </div>

          {/* Search Bar */}
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
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Search Results</h4>
              {searchResults.map((track) => (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`w-full flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg transition-colors text-left ${
                    currentTrack?.id === track.id ? 'bg-slate-700' : ''
                  }`}
                >
                  {track.albumArt && (
                    <img src={track.albumArt} alt={track.album} className="w-12 h-12 rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.name}</p>
                    <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                  </div>
                  {track.audioUrl ? (
                    <Play className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <span className="text-xs text-gray-500">No audio</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!currentTrack && searchResults.length === 0 && (
            <div className="flex-1 p-6 text-center">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">Search for free music</p>
              <p className="text-sm text-gray-500">
                Try: electronic, jazz, rock, ambient, chill
              </p>
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
        </div>
      )}
    </>
  );
};

export default SpotifyPlayerFree;
