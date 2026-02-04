import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  Clock, 
  Users, 
  CheckCircle, 
  Play, 
  FileText, 
  Code, 
  Zap,
  Target,
  Brain,
  Sparkles,
  ShoppingCart,
  CreditCard,
  Gift,
  Calendar,
  Video,
  User,
  Award,
  Briefcase
} from 'lucide-react';

const LeetCodeTopmat = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('products'); // 'products', 'sessions', 'mentorship'
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [showPayment, setShowPayment] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState(new Set());

  // Load purchased items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('leetcode_topmat_purchases');
    if (saved) {
      setPurchasedItems(new Set(JSON.parse(saved)));
    }
  }, []);

  const sessions = [
    {
      id: 'mock-interview',
      title: '1:1 Mock Interview Session',
      duration: '60 minutes',
      price: 49,
      description: 'Practice coding interviews with personalized feedback',
      features: [
        'Live coding session with screen sharing',
        'Real interview questions from FAANG companies',
        'Detailed feedback and improvement suggestions',
        'Recording provided for review',
        'Follow-up resources and study plan'
      ],
      popular: true
    },
    {
      id: 'code-review',
      title: 'Code Review & Optimization',
      duration: '30 minutes',
      price: 29,
      description: 'Get expert review of your solutions and optimization tips',
      features: [
        'Review up to 5 coding solutions',
        'Performance optimization suggestions',
        'Best practices and clean code tips',
        'Alternative approach discussions',
        'Written summary with recommendations'
      ]
    },
    {
      id: 'career-guidance',
      title: 'Career Guidance & Strategy',
      duration: '45 minutes',
      price: 39,
      description: 'Navigate your tech career with expert guidance',
      features: [
        'Resume review and optimization',
        'Interview preparation strategy',
        'Company-specific preparation tips',
        'Salary negotiation guidance',
        'Career roadmap planning'
      ]
    },
    {
      id: 'system-design',
      title: 'System Design Deep Dive',
      duration: '90 minutes',
      price: 79,
      description: 'Master system design interviews with hands-on practice',
      features: [
        'Live system design problem solving',
        'Architecture best practices',
        'Scalability and performance discussions',
        'Real-world case studies',
        'Design document templates'
      ]
    }
  ];

  const mentorshipPlans = [
    {
      id: 'basic-mentorship',
      title: 'Basic Mentorship',
      duration: '1 month',
      price: 199,
      sessions: 4,
      description: 'Get started with structured guidance',
      features: [
        '4 x 30-minute sessions per month',
        'Personalized study plan',
        'Progress tracking and feedback',
        'Email support between sessions',
        'Resource recommendations'
      ]
    },
    {
      id: 'premium-mentorship',
      title: 'Premium Mentorship',
      duration: '3 months',
      price: 499,
      sessions: 12,
      description: 'Comprehensive interview preparation program',
      features: [
        '12 x 45-minute sessions over 3 months',
        'Mock interviews and code reviews',
        'Company-specific preparation',
        'Resume and LinkedIn optimization',
        'Unlimited chat support',
        'Job referral assistance'
      ],
      popular: true
    },
    {
      id: 'elite-mentorship',
      title: 'Elite Mentorship',
      duration: '6 months',
      price: 899,
      sessions: 24,
      description: 'Complete career transformation program',
      features: [
        '24 x 60-minute sessions over 6 months',
        'Unlimited mock interviews',
        'System design mastery program',
        'Behavioral interview coaching',
        'Salary negotiation support',
        'Direct job referrals to top companies',
        '24/7 priority support'
      ]
    }
  ];

  const packages = {
    free: {
      id: 'free',
      name: 'Free Starter Pack',
      price: 0,
      originalPrice: 0,
      description: 'Get started with essential LeetCode preparation materials',
      features: [
        '50 Essential Problems with Solutions',
        'Basic Algorithm Patterns Guide',
        'Time Complexity Cheat Sheet',
        'Interview Tips PDF',
        'Community Access'
      ],
      includes: [
        { type: 'pdf', name: 'LeetCode Patterns Guide', pages: 25, size: '2.1 MB' },
        { type: 'problems', name: '50 Essential Problems', count: 50 },
        { type: 'cheatsheet', name: 'Big O Notation Guide', pages: 5, size: '800 KB' }
      ],
      color: 'green',
      badge: 'FREE'
    },
    premium: {
      id: 'premium',
      name: 'Premium Topmat',
      price: 29.99,
      originalPrice: 49.99,
      description: 'Complete LeetCode mastery package for serious developers',
      features: [
        '150+ Curated Problems with Detailed Solutions',
        'Advanced Algorithm Patterns & Techniques',
        'Company-Specific Problem Sets (FAANG)',
        'Video Explanations for Complex Problems',
        'Interview Simulation Questions',
        'System Design Basics',
        'Lifetime Updates',
        'Priority Support'
      ],
      includes: [
        { type: 'pdf', name: 'Complete LeetCode Mastery Guide', pages: 200, size: '15.2 MB' },
        { type: 'problems', name: '150+ Premium Problems', count: 150 },
        { type: 'videos', name: 'Video Explanations', count: 50, duration: '10+ hours' },
        { type: 'templates', name: 'Code Templates Library', count: 25 },
        { type: 'cheatsheet', name: 'Advanced Patterns Cheat Sheet', pages: 15, size: '2.5 MB' },
        { type: 'bonus', name: 'System Design Primer', pages: 50, size: '5.8 MB' }
      ],
      color: 'blue',
      badge: 'BESTSELLER',
      discount: '40% OFF'
    },
    ultimate: {
      id: 'ultimate',
      name: 'Ultimate Master Pack',
      price: 79.99,
      originalPrice: 149.99,
      description: 'Everything you need to ace any coding interview',
      features: [
        'Everything in Premium +',
        '300+ Problems Across All Difficulty Levels',
        'Live Mock Interview Sessions (3 sessions)',
        'Personalized Study Plan',
        'Advanced System Design Course',
        'Behavioral Interview Guide',
        'Salary Negotiation Strategies',
        '1-on-1 Mentorship (2 hours)',
        'Job Referral Network Access'
      ],
      includes: [
        { type: 'pdf', name: 'Ultimate Interview Bible', pages: 400, size: '28.5 MB' },
        { type: 'problems', name: '300+ Elite Problems', count: 300 },
        { type: 'videos', name: 'Complete Video Library', count: 100, duration: '25+ hours' },
        { type: 'live', name: 'Mock Interview Sessions', count: 3, duration: '1 hour each' },
        { type: 'course', name: 'System Design Masterclass', lessons: 20, duration: '8 hours' },
        { type: 'mentorship', name: '1-on-1 Mentorship', duration: '2 hours' },
        { type: 'bonus', name: 'Salary Negotiation Guide', pages: 30, size: '3.2 MB' }
      ],
      color: 'purple',
      badge: 'ULTIMATE',
      discount: '47% OFF'
    }
  };

  const handleBookSession = (session) => {
    // Simulate booking - you can integrate with your own booking system
    alert(`Booking ${session.title} session. This would integrate with your booking system.`);
  };

  const handleBookMentorship = (plan) => {
    // Simulate mentorship booking - you can integrate with your own system
    alert(`Booking ${plan.title} mentorship. This would integrate with your mentorship system.`);
  };

  const handlePurchase = (packageId) => {
    if (packageId === 'free') {
      // Free package - instant access
      const newPurchases = new Set(purchasedItems);
      newPurchases.add(packageId);
      setPurchasedItems(newPurchases);
      localStorage.setItem('leetcode_topmat_purchases', JSON.stringify([...newPurchases]));
      
      // Show success message
      alert('🎉 Free Starter Pack activated! Check your downloads section.');
    } else {
      // Paid packages - show payment modal
      setSelectedPackage(packageId);
      setShowPayment(true);
    }
  };

  const simulatePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      const newPurchases = new Set(purchasedItems);
      newPurchases.add(selectedPackage);
      setPurchasedItems(newPurchases);
      localStorage.setItem('leetcode_topmat_purchases', JSON.stringify([...newPurchases]));
      
      setShowPayment(false);
      alert(`🎉 ${packages[selectedPackage].name} purchased successfully! Check your downloads section.`);
    }, 2000);
  };

  const downloadItem = (item, packageName) => {
    // Simulate download
    alert(`📥 Downloading ${item.name} from ${packageName}...`);
    console.log('Download initiated:', item);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-purple-900 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                LeetCode Premium
                <span className="text-lg bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                  Digital Products
                </span>
              </h2>
              <p className="text-blue-200">Premium digital products & 1:1 mentorship for coding interview success</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-900">
          <button
            onClick={() => setSelectedTab('products')}
            className={`flex-1 flex items-center justify-center gap-2 p-4 transition-colors ${
              selectedTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Digital Products</span>
          </button>
          <button
            onClick={() => setSelectedTab('sessions')}
            className={`flex-1 flex items-center justify-center gap-2 p-4 transition-colors ${
              selectedTab === 'sessions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">1:1 Sessions</span>
          </button>
          <button
            onClick={() => setSelectedTab('mentorship')}
            className={`flex-1 flex items-center justify-center gap-2 p-4 transition-colors ${
              selectedTab === 'mentorship'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="font-medium">Mentorship</span>
          </button>
        </div>

        <div className="p-6">
          {/* Digital Products Tab */}
          {selectedTab === 'products' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Digital Products</h3>
                <p className="text-gray-400">Comprehensive study materials and resources</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.values(packages).map((pkg) => {
                  const isPurchased = purchasedItems.has(pkg.id);
                  const colorClasses = {
                    green: 'border-green-500 bg-green-500/10',
                    blue: 'border-blue-500 bg-blue-500/10',
                    purple: 'border-purple-500 bg-purple-500/10'
                  };

                  return (
                    <div
                      key={pkg.id}
                      className={`relative border-2 rounded-xl p-6 transition-all hover:scale-105 ${
                        selectedPackage === pkg.id ? colorClasses[pkg.color] : 'border-slate-600 bg-slate-700'
                      }`}
                    >
                      {/* Badge */}
                      <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                        pkg.color === 'green' ? 'bg-green-500 text-white' :
                        pkg.color === 'blue' ? 'bg-blue-500 text-white' :
                        'bg-purple-500 text-white'
                      }`}>
                        {pkg.badge}
                      </div>

                      {/* Discount Badge */}
                      {pkg.discount && (
                        <div className="absolute -top-3 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                          {pkg.discount}
                        </div>
                      )}

                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                        
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-3xl font-bold text-white">
                            {pkg.price === 0 ? 'FREE' : `$${pkg.price}`}
                          </span>
                          {pkg.originalPrice > pkg.price && (
                            <span className="text-lg text-gray-500 line-through">
                              ${pkg.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => isPurchased ? null : handlePurchase(pkg.id)}
                        disabled={isPurchased}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                          isPurchased
                            ? 'bg-green-600 text-white cursor-default'
                            : pkg.color === 'green'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : pkg.color === 'blue'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {isPurchased ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Purchased
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            {pkg.price === 0 ? <Gift className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                            {pkg.price === 0 ? 'Get Free' : 'Purchase Now'}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 1:1 Sessions Tab */}
          {selectedTab === 'sessions' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">1:1 Sessions</h3>
                <p className="text-gray-400">Book personalized coding sessions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`relative border-2 rounded-xl p-6 transition-all hover:scale-105 ${
                      session.popular ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600 bg-slate-700'
                    }`}
                  >
                    {session.popular && (
                      <div className="absolute -top-3 left-4 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">
                        POPULAR
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-white mb-2">{session.title}</h4>
                      <p className="text-gray-400 text-sm mb-4">{session.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">{session.duration}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">${session.price}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {session.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => handleBookSession(session)}
                      className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Book Session
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentorship Tab */}
          {selectedTab === 'mentorship' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Long-term Mentorship</h3>
                <p className="text-gray-400">Comprehensive mentorship programs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mentorshipPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative border-2 rounded-xl p-6 transition-all hover:scale-105 ${
                      plan.popular ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 bg-slate-700'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-4 px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-bold">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-white mb-2">{plan.title}</h4>
                      <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-gray-300">{plan.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-gray-300">{plan.sessions} sessions</span>
                        </div>
                      </div>
                      
                      <div className="text-3xl font-bold text-white mb-2">${plan.price}</div>
                      <div className="text-sm text-gray-400">≈ ${Math.round(plan.price / plan.sessions)} per session</div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => handleBookMentorship(plan)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        plan.popular 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                      Start Mentorship
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Enhanced Mentorship Button */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-white mb-2">🚀 Premium Mentorship Experience</h4>
                  <p className="text-gray-400 mb-4">Get personalized 1:1 guidance from industry experts</p>
                  <button
                    onClick={() => alert('Mentorship booking system would be integrated here')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    <Award className="w-5 h-5" />
                    Explore Full Mentorship
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Downloads Section */}
          {purchasedItems.size > 0 && (
            <div className="border-t border-slate-700 pt-8 mt-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Download className="w-6 h-6 text-blue-400" />
                Your Downloads
              </h3>
              
              <div className="space-y-6">
                {[...purchasedItems].map(packageId => {
                  const pkg = packages[packageId];
                  return (
                    <div key={packageId} className="bg-slate-700 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-white mb-4">{pkg.name}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pkg.includes.map((item, index) => {
                          const getIcon = (type) => {
                            switch (type) {
                              case 'pdf': return <FileText className="w-5 h-5 text-red-400" />;
                              case 'problems': return <Code className="w-5 h-5 text-green-400" />;
                              case 'videos': return <Play className="w-5 h-5 text-blue-400" />;
                              case 'templates': return <Zap className="w-5 h-5 text-yellow-400" />;
                              case 'cheatsheet': return <Brain className="w-5 h-5 text-purple-400" />;
                              case 'course': return <BookOpen className="w-5 h-5 text-indigo-400" />;
                              case 'live': return <Users className="w-5 h-5 text-orange-400" />;
                              case 'mentorship': return <Target className="w-5 h-5 text-pink-400" />;
                              default: return <Sparkles className="w-5 h-5 text-cyan-400" />;
                            }
                          };

                          return (
                            <div key={index} className="bg-slate-600 rounded-lg p-4">
                              <div className="flex items-start gap-3 mb-3">
                                {getIcon(item.type)}
                                <div className="flex-1">
                                  <h5 className="font-medium text-white text-sm">{item.name}</h5>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {item.pages && `${item.pages} pages`}
                                    {item.count && `${item.count} items`}
                                    {item.duration && ` • ${item.duration}`}
                                    {item.size && ` • ${item.size}`}
                                    {item.lessons && `${item.lessons} lessons`}
                                  </div>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => downloadItem(item, pkg.name)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Complete Purchase</h3>
              
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-white">{packages[selectedPackage].name}</h4>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-white">${packages[selectedPackage].price}</span>
                  {packages[selectedPackage].originalPrice > packages[selectedPackage].price && (
                    <span className="text-gray-500 line-through">${packages[selectedPackage].originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Mock Payment Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Expiry</label>
                    <input
                      type="text"
                      placeholder="12/25"
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={simulatePayment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay ${packages[selectedPackage].price}
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeetCodeTopmat;