import { useState } from 'react';
import { Youtube, Play } from 'lucide-react';

const DualCreatorIntegration = () => {
  const [selected, setSelected] = useState('striver');

  const creators = {
    striver: {
      name: "Striver",
      desc: "English • Systematic",
      url: "https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
      color: "blue"
    },
    babbar: {
      name: "Love Babbar", 
      desc: "Hindi • Detailed",
      url: "https://youtube.com/c/CodeHelp",
      color: "pink"
    }
  };

  return (
    <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 p-4">
      <h3 className="text-white font-medium mb-3">Choose Creator</h3>
      
      <div className="space-y-2">
        {Object.entries(creators).map(([key, creator]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
              selected === key
                ? `bg-${creator.color}-500/20 border-${creator.color}-500/50`
                : 'bg-gray-700/30 border-gray-600/30 hover:border-gray-500/50'
            }`}
          >
            <div className="text-left">
              <div className="text-white font-medium">{creator.name}</div>
              <div className="text-gray-400 text-sm">{creator.desc}</div>
            </div>
            {selected === key && (
              <a
                href={creator.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 px-3 py-1 bg-${creator.color}-600 text-white rounded text-sm hover:bg-${creator.color}-700`}
                onClick={(e) => e.stopPropagation()}
              >
                <Youtube className="w-4 h-4" />
                Watch
              </a>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DualCreatorIntegration;