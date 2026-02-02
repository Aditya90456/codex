import { useState } from 'react';
import { Music, X, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const SpotifyPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Coding playlists - Spotify embed URLs
  const playlists = [
    {
      name: 'Bollywood Dance',
      uri: 'spotify:playlist:37i9dQZF1DX8xfQRRX1PDm',
      embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8xfQRRX1PDm'
    },
    {
      name: 'Deep Focus',
      uri: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ',
      embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ'
    },
    {
      name: 'Coding Mode',
      uri: 'spotify:playlist:37i9dQZF1DX5trt9i14X7j',
      embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX5trt9i14X7j'
    },
    {
      name: 'Instrumental Study',
      uri: 'spotify:playlist:37i9dQZF1DX3PFzdbtx1Us',
      embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3PFzdbtx1Us'
    },
    {
      name: 'Lo-Fi Beats',
      uri: 'spotify:playlist:37i9dQZF1DWWQRwui0ExPn',
      embed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn'
    }
  ];

  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]);

  return (
    <>
      {/* Floating Music Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all hover:scale-110"
        title="Music Player"
      >
        <Music className="w-6 h-6" />
      </button>

      {/* Spotify Player Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-white">Coding Music</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Playlist Selector */}
          <div className="p-4 border-b border-slate-700">
            <label className="text-sm text-gray-400 mb-2 block">Select Playlist</label>
            <select
              value={selectedPlaylist.name}
              onChange={(e) => {
                const playlist = playlists.find(p => p.name === e.target.value);
                setSelectedPlaylist(playlist);
              }}
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-green-500"
            >
              {playlists.map((playlist) => (
                <option key={playlist.name} value={playlist.name}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Spotify Embed */}
          <div className="p-4">
            <iframe
              src={selectedPlaylist.embed}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>

          {/* Info */}
          <div className="p-3 bg-slate-900 text-center">
            <p className="text-xs text-gray-400">
              🎵 Focus music for coding sessions
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SpotifyPlayer;
