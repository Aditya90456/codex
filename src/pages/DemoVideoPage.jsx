import { useState } from 'react';
import { Play, Code, Sparkles, Terminal, Brain, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoVideoPage = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState('overview');

  const demos = [
    {
      id: 'overview',
      title: 'Codex Editor Overview',
      description: 'Introduction to the advanced code editor with runtime analysis',
      duration: '2:30',
      thumbnail: '🎯',
      features: ['Multi-language support', 'Real-time analysis', 'Smart snippets']
    },
    {
      id: 'runtime-analysis',
      title: 'Runtime Analysis Demo',
      description: 'See how Codex analyzes code complexity and performance in real-time',
      duration: '3:15',
      thumbnail: '📊',
      features: ['Big O analysis', 'Performance metrics', 'Quality scoring']
    },
    {
      id: 'snippets',
      title: 'Dynamic Snippets System',
      description: 'Learn how to use language-specific code snippets',
      duration: '2:45',
      thumbnail: '✨',
      features: ['Auto-completion', 'Custom snippets', 'Quick insertion']
    },
    {
      id: 'execution',
      title: 'Code Execution',
      description: 'Execute JavaScript code and see console output',
      duration: '3:00',
      thumbnail: '▶️',
      features: ['Live execution', 'Console capture', 'Error handling']
    },
    {
      id: 'languages',
      title: 'Multi-Language Support',
      description: 'Switch between 8+ programming languages seamlessly',
      duration: '2:20',
      thumbnail: '🌐',
      features: ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust']
    },
    {
      id: 'suggestions',
      title: 'Smart Suggestions',
      description: 'Get intelligent code improvement suggestions',
      duration: '2:50',
      thumbnail: '💡',
      features: ['Performance tips', 'Best practices', 'One-click apply']
    }
  ];

  const selectedDemo = demos.find(d => d.id === activeDemo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Codex Editor Demos
                </h1>
                <p className="text-xs text-gray-400">Interactive video demonstrations</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/codex')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all"
            >
              Try Live Editor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              {/* Video Container */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">{selectedDemo.thumbnail}</div>
                  <h2 className="text-3xl font-bold mb-2">{selectedDemo.title}</h2>
                  <p className="text-gray-300 mb-6">{selectedDemo.description}</p>
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center space-x-3 mx-auto transition-all">
                    <Play size={24} />
                    <span className="text-lg font-semibold">Play Demo</span>
                  </button>
                  <p className="text-sm text-gray-400 mt-4">Duration: {selectedDemo.duration}</p>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Features Demonstrated</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedDemo.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <Brain className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-bold mb-2">Real-time Analysis</h3>
                <p className="text-sm text-gray-300">Instant code quality and complexity analysis</p>
              </div>
              
              <div className="bg-blue-900/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                <Sparkles className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-bold mb-2">Smart Snippets</h3>
                <p className="text-sm text-gray-300">Language-specific code templates</p>
              </div>
              
              <div className="bg-green-900/30 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
                <Terminal className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="font-bold mb-2">Live Execution</h3>
                <p className="text-sm text-gray-300">Run code and see results instantly</p>
              </div>
            </div>
          </div>

          {/* Demo List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">All Demonstrations</h3>
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  activeDemo === demo.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-2 border-white/20'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{demo.thumbnail}</div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1">{demo.title}</h4>
                    <p className="text-sm text-gray-300 mb-2">{demo.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{demo.duration}</span>
                      {activeDemo === demo.id && (
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">Now Playing</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try Codex Editor?</h2>
          <p className="text-lg text-gray-100 mb-6">
            Experience the power of real-time code analysis and smart suggestions
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => navigate('/codex')}
              className="px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-bold transition-all"
            >
              Launch Editor
            </button>
            <button
              onClick={() => navigate('/docs')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg font-bold transition-all"
            >
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoPage;
