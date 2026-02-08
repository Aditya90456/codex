import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Trophy, Zap, ArrowRight, Star, Target, Brain } from 'lucide-react';

const LearnPage = () => {
  const navigate = useNavigate();

  const learningPaths = [
    {
      id: 'practice',
      title: 'Practice Problems',
      description: 'Solve 150+ DSA problems with AI assistance, code execution, and instant feedback',
      icon: <Code className="w-12 h-12" />,
      color: 'from-blue-600 to-cyan-600',
      route: '/leetcode',
      features: [
        '150+ curated problems',
        'Multi-language support',
        'AI hints & solutions',
        'Real-time execution',
        'Progress tracking'
      ],
      difficulty: 'All Levels',
      time: 'Self-paced'
    },
    {
      id: 'articles',
      title: 'Learning Articles',
      description: 'Read comprehensive guides on data structures, algorithms, and problem-solving patterns',
      icon: <BookOpen className="w-12 h-12" />,
      color: 'from-purple-600 to-pink-600',
      route: '/articles',
      features: [
        '14+ detailed articles',
        'Code examples',
        'Visual explanations',
        'Time complexity analysis',
        'Best practices'
      ],
      difficulty: 'Beginner to Advanced',
      time: '10-25 min per article'
    }
  ];

  const stats = [
    { label: 'Problems', value: '150+', icon: <Target className="w-6 h-6" /> },
    { label: 'Articles', value: '14+', icon: <BookOpen className="w-6 h-6" /> },
    { label: 'Topics', value: '7', icon: <Brain className="w-6 h-6" /> },
    { label: 'Certificates', value: '5', icon: <Trophy className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Master Data Structures & Algorithms
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose your learning path: Practice problems with AI assistance or read comprehensive guides
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
                <div className="flex justify-center mb-2 text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Learning Path</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer group"
              onClick={() => navigate(path.route)}
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {path.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">{path.title}</h3>
              <p className="text-gray-400 mb-6">{path.description}</p>

              <div className="space-y-2 mb-6">
                {path.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Difficulty</div>
                  <div className="text-sm font-semibold">{path.difficulty}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="text-sm font-semibold">{path.time}</div>
                </div>
                <button className={`px-6 py-3 rounded-lg bg-gradient-to-r ${path.color} hover:opacity-90 transition-opacity flex items-center gap-2 font-semibold`}>
                  Start
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Quick Access
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/leetcode')}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Arrays & Hashing</div>
              <div className="text-sm text-gray-400">Start with fundamentals</div>
            </button>
            
            <button
              onClick={() => navigate('/articles')}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Beginner Articles</div>
              <div className="text-sm text-gray-400">Learn the basics</div>
            </button>
            
            <button
              onClick={() => navigate('/playground')}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Two Sum Problem</div>
              <div className="text-sm text-gray-400">Classic starter problem</div>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">AI-Powered Learning</h4>
            <p className="text-sm text-gray-400">Get hints, explanations, and solutions from AI assistant</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Earn Certificates</h4>
            <p className="text-sm text-gray-400">Complete milestones and earn verified certificates</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Track Progress</h4>
            <p className="text-sm text-gray-400">Monitor your learning journey and achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
