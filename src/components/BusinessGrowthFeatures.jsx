import { useState, useEffect } from 'react';
import { 
  Share2, 
  Download, 
  Eye, 
  Heart, 
  TrendingUp, 
  Users, 
  Code, 
  Zap,
  Star,
  Gift,
  Crown,
  Rocket
} from 'lucide-react';

const BusinessGrowthFeatures = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    codeExecutions: 0,
    projectsShared: 0,
    popularLanguages: []
  });

  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    // Simulate real-time stats
    const interval = setInterval(() => {
      setStats(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        codeExecutions: prev.codeExecutions + Math.floor(Math.random() * 5),
        projectsShared: prev.projectsShared + Math.floor(Math.random() * 2),
        popularLanguages: [
          { name: 'JavaScript', usage: 45 },
          { name: 'Python', usage: 32 },
          { name: 'Java', usage: 18 },
          { name: 'C++', usage: 15 }
        ]
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const growthFeatures = [
    {
      title: "Instant Code Sharing",
      description: "Share your code with a simple URL - no signup required",
      icon: <Share2 className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      action: () => {
        const shareUrl = `${window.location.origin}/share/${Math.random().toString(36).substr(2, 9)}`;
        navigator.clipboard.writeText(shareUrl);
        alert('Share URL copied to clipboard!');
      }
    },
    {
      title: "Public Code Gallery",
      description: "Browse and learn from community projects",
      icon: <Eye className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      action: () => alert('Opening public gallery...')
    },
    {
      title: "Export & Download",
      description: "Download your projects anytime",
      icon: <Download className="w-6 h-6" />,
      color: "from-green-500 to-teal-500",
      action: () => alert('Downloading project...')
    },
    {
      title: "Premium Features",
      description: "Unlock advanced tools and unlimited usage",
      icon: <Crown className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
      action: () => setShowUpgrade(true)
    }
  ];

  const monetizationStrategies = [
    {
      strategy: "Freemium Model",
      description: "Free basic usage, paid premium features",
      revenue: "$5-50/month per premium user",
      implementation: "Usage limits, advanced features behind paywall"
    },
    {
      strategy: "Advertising",
      description: "Display ads for free users",
      revenue: "$1-5 CPM (cost per thousand views)",
      implementation: "Google AdSense, sponsored content"
    },
    {
      strategy: "Affiliate Marketing",
      description: "Promote coding courses and tools",
      revenue: "5-30% commission on sales",
      implementation: "Integrate with Udemy, Coursera, coding bootcamps"
    },
    {
      strategy: "Enterprise Licensing",
      description: "White-label solutions for schools/companies",
      revenue: "$1000-10000+ per license",
      implementation: "Custom branding, advanced admin features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Growing Without Authentication
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            How coding platforms can build massive user bases and generate revenue without requiring user accounts
          </p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-400">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Code Executions</p>
                <p className="text-2xl font-bold text-blue-400">{stats.codeExecutions.toLocaleString()}</p>
              </div>
              <Code className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Projects Shared</p>
                <p className="text-2xl font-bold text-purple-400">{stats.projectsShared.toLocaleString()}</p>
              </div>
              <Share2 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Growth Rate</p>
                <p className="text-2xl font-bold text-yellow-400">+23%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Growth Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Viral Growth Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={feature.action}
                className="group bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 text-left"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Monetization Strategies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Revenue Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monetizationStrategies.map((strategy, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-green-400">{strategy.strategy}</h3>
                <p className="text-gray-300 mb-3">{strategy.description}</p>
                <div className="mb-3">
                  <span className="text-sm text-gray-400">Potential Revenue: </span>
                  <span className="text-yellow-400 font-semibold">{strategy.revenue}</span>
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-medium">Implementation: </span>
                  {strategy.implementation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold mb-6 text-center">Success Without Authentication</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lower Barrier to Entry</h3>
              <p className="text-gray-300 text-sm">Users can start coding immediately without friction</p>
            </div>
            <div className="text-center">
              <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Viral Growth</h3>
              <p className="text-gray-300 text-sm">Easy sharing leads to organic user acquisition</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">SEO Benefits</h3>
              <p className="text-gray-300 text-sm">Public content attracts search engine traffic</p>
            </div>
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgrade && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700">
              <div className="text-center mb-6">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-gray-400">Unlock unlimited features and advanced tools</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Unlimited code executions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Private projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Advanced debugging tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Priority support</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    alert('Redirecting to payment...');
                    setShowUpgrade(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all duration-300"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessGrowthFeatures;