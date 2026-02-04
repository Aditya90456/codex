import { useState } from 'react';
import { Youtube, Play } from 'lucide-react';

const PlaylistIntegration = ({ playlistUrl, title = "Striver's A2Z DSA Course" }) => {
  const [showPlayer, setShowPlayer] = useState(false);

  const playlistId = playlistUrl.match(/[?&]list=([^&]+)/)?.[1];
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;

  return (
    <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-gray-400 text-sm">180+ videos • Complete DSA course</p>
        </div>
        <button
          onClick={() => setShowPlayer(!showPlayer)}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
        >
          <Play className="w-4 h-4" />
          {showPlayer ? 'Hide' : 'Watch'}
        </button>
      </div>

      {showPlayer && (
        <div className="mb-3">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <a
        href={playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
      >
        <Youtube className="w-4 h-4" />
        Open in YouTube
      </a>
    </div>
  );
};

export default PlaylistIntegration;