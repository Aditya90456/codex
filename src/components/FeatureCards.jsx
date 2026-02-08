import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Brain, 
  Lightbulb, 
  Award, 
  Play, 
  FileText, 
  Layers,
  CheckCircle,
  Users,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Video,
  Github,
  Download,
  Share2,
  Sparkles,
  Terminal,
  Globe,
  Shield,
  Cpu,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const FeatureCards = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const mainFeatures = [
    {
      id: 'split-panel',
      icon: Layers,
      title: 'Split Panel Design',
      description: 'Problem description on left, Monaco code editor on right - just like LeetCode',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      borderGradient: 'from-green-600 to-emerald-600',
      action: 'Try Now',
      route: '/leetcode',
      badge: 'Professional Layout'
    },
    {
      id: '150-problems',
      icon: FileText,
      title: '150 Problems',
      description: 'Arrays, Strings, Trees, Graphs, DP and more - all difficulty levels',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      borderGradient: 'from-blue-600 to-cyan-600',
      action: 'Explore',
      route: '/problems',
      badge: 'Curated Collection'
    },
    {
      id: 'run-submit',
      icon: Play,
      title: 'Run & Submit',
      description: 'Test with custom inputs, submit solutions, see runtime and memory stats',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      borderGradient: 'from-purple-600 to-pink-600',
      action: 'Test Now',
      route: '/leetcode',
      badge: 'Real-time Feedback'
    }
  ];

  const additionalFeatures = [
    {
      id: 'ai-assistant',
      icon: Brain,
      title: 'AI Assistant',
      description: 'Get hints, explanations, and code suggestions powered by advanced AI',
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      borderGradient: 'from-orange-600 to-red-600',
      action: 'Try AI Help',
      route: '/leetcode',
      isNew: true
    },
    {
      id: 'whiteboard',
      icon: Lightbulb,
      title: 'AI Whiteboard',
      description: 'Visual algorithm explanations with interactive drawings and animations',
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-500',
      borderGradient: 'from-teal-600 to-cyan-600',
      action: 'Visualize',
      route: '/leetcode',
      isPopular: true
    },
    {
      id: 'certificates',
      icon: Award,
      title: 'Certificates',
      description: 'Earn verified certificates for completing coding challenges and milestones',
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500',
      borderGradient: 'from-yellow-600 to-orange-600',
      action: 'View Certs',
      route: '/certificates'
    },
    {
      id: 'multi-language',
      icon: Code,
      title: 'Multi-Language',
      description: 'Code in JavaScript, Python, Java, C++, Go, Rust, and more languages',
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-500',
      borderGradient: 'from-indigo-600 to-purple-600',
      action: 'Code Now',
      route: '/leetcode'
    },
    {
      id: 'peer-chat',
      icon: Users,
      title: 'Peer Chat',
      description: 'Discuss problems with other developers and get help from the community',
      color: 'pink',
      gradient: 'from-pink-500 to-rose-500',
      borderGradient: 'from-pink-600 to-rose-600',
      action: 'Join Chat',
      route: '/community'
    },
    {
      id: 'video-tutorials',
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step explanations from top instructors and coding experts',
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-500',
      borderGradient: 'from-emerald-600 to-green-600',
      action: 'Watch Now',
      route: '/tutorials'
    },
    {
      id: 'github-sync',
      icon: Github,
      title: 'GitHub Sync',
      description: 'Automatically sync your solutions to GitHub repositories',
      color: 'slate',
      gradient: 'from-slate-500 to-gray-500',
      borderGradient: 'from-slate-600 to-gray-600',
      action: 'Connect',
      route: '/settings'
    },
    {
      id: 'progress-tracking',
      icon: Trophy,
      title: 'Progress Tracking',
      description: 'Track your coding journey with detailed analytics and achievements',
      color: 'amber',
      gradient: 'from-amber-500 to-yellow-500',
      borderGradient: 'from-amber-600 to-yellow-600',
      action: 'View Stats',
      route: '/profile'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  const renderMainFeatureCard = (feature) => (
    <div 
      key={feature.id}
      className="group relative"
      onMouseEnter={() => setHoveredCard(feature.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.borderGradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
      <div className={`relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-${feature.color}-500/50 transition-all duration-300 h-full`}>
        <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
          <feature.icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
        <p className="text-slate-400 text-sm mb-4">
          {feature.description}
        </p>
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 text-xs text-${feature.color}-400`}>
            <CheckCircle className="w-4 h-4" />
            <span>{feature.badge}</span>
          </div>
          <button 
            onClick={() => handleCardClick(feature.route)}
            className={`px-3 py-1.5 bg-${feature.color}-500/20 hover:bg-${feature.color}-500/30 border border-${feature.color}-500/30 rounded-lg text-${feature.color}-400 text-xs font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1`}
          >
            <span>{feature.action}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdditionalFeatureCard = (feature) => (
    <div 
      key={feature.id}
      className="group relative"
      onMouseEnter={() => setHoveredCard(feature.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.borderGradient} rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
      <div className={`relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-${feature.color}-500/50 transition-all duration-300 h-full`}>
        {/* Badge */}
        {(feature.isNew || feature.isPopular) && (
          <div className="absolute -top-2 -right-2">
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
              feature.isNew 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
            }`}>
              {feature.isNew ? 'NEW' : 'POPULAR'}
            </span>
          </div>
        )}
        
        <div className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-3`}>
          <feature.icon className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-lg font-bold mb-2 text-white">{feature.title}</h4>
        <p className="text-slate-400 text-xs mb-3 line-clamp-2">
          {feature.description}
        </p>
        <button 
          onClick={() => handleCardClick(feature.route)}
          className={`w-full px-2 py-1.5 bg-${feature.color}-500/20 hover:bg-${feature.color}-500/30 border border-${feature.color}-500/30 rounded text-${feature.color}-400 text-xs font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-1`}
        >
          <span>{feature.action}</span>
          {hoveredCard === feature.id && <ExternalLink className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {additionalFeatures.slice(0, 4).map(renderAdditionalFeatureCard)}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {additionalFeatures.map(renderAdditionalFeatureCard)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {mainFeatures.map(renderMainFeatureCard)}
      </div>

      {/* Additional Features */}
      <div className="grid md:grid-cols-4 gap-4">
        {additionalFeatures.map(renderAdditionalFeatureCard)}
      </div>
    </div>
  );
};

export default FeatureCards;