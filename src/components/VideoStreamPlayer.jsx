// Video Stream Player Component
import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Youtube, ExternalLink, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const VideoStreamPlayer = ({ videoUrl, problemTitle, onClose, isOpen }) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [videoType, setVideoType] = useState('youtube'); // youtube, vimeo, direct
  const [embedUrl, setEmbedUrl] = useState('');
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Extract video ID and determine platform
  useEffect(() => {
    if (!videoUrl) return;

    setIsLoading(true);
    
    // YouTube detection
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = videoUrl.match(youtubeRegex);
    
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`);
      setVideoType('youtube');
      setIsLoading(false);
      return;
    }

    // Vimeo detection
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = videoUrl.match(vimeoRegex);
    
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      setEmbedUrl(`https://player.vimeo.com/video/${videoId}`);
      setVideoType('vimeo');
      setIsLoading(false);
      return;
    }

    // Direct video URL
    if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      setEmbedUrl(videoUrl);
      setVideoType('direct');
      setIsLoading(false);
      return;
    }

    // Default to YouTube search
    const searchQuery = encodeURIComponent(`${problemTitle} solution`);
    setEmbedUrl(`https://www.youtube.com/results?search_query=${searchQuery}`);
    setVideoType('search');
    setIsLoading(false);
  }, [videoUrl, problemTitle]);

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Skip forward/backward
  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Update time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Load metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Seek to position
  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div 
        ref={containerRef}
        className={`bg-gradient-to-br ${theme.card} rounded-2xl border-2 ${theme.border} max-w-6xl w-full shadow-2xl overflow-hidden ${isFullscreen ? 'max-w-full h-full' : ''}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme.border} bg-gradient-to-r from-slate-900/50 to-slate-800/50`}>
          <div className="flex items-center gap-3">
            <Youtube className="w-6 h-6 text-red-400" />
            <div>
              <h2 className="text-lg font-bold text-white">{problemTitle}</h2>
              <p className="text-xs text-gray-400">Video Solution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black">
          {isLoading ? (
            <div className="aspect-video flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
          ) : videoType === 'youtube' || videoType === 'vimeo' ? (
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={problemTitle}
              />
            </div>
          ) : videoType === 'direct' ? (
            <div className="aspect-video relative group">
              <video
                ref={videoRef}
                src={embedUrl}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
              />
              
              {/* Custom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={() => skip(-10)} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button onClick={() => skip(10)} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                      <SkipForward className="w-4 h-4" />
                    </button>
                    <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-sm text-white ml-2">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Search results fallback
            <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
              <Youtube className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Video Not Available</h3>
              <p className="text-gray-400 mb-6">Search for video solutions on YouTube</p>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all"
              >
                <Youtube className="w-5 h-5" />
                Search on YouTube
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className={`p-4 border-t ${theme.border} bg-gradient-to-r from-slate-900/30 to-slate-800/30`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Watch the complete solution explanation
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Understand the approach, time complexity, and implementation
              </p>
            </div>
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/30 transition-all text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStreamPlayer;
