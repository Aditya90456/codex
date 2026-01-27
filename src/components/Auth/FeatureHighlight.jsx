import { useState, useEffect } from 'react';
import { SignUpButton } from '@clerk/clerk-react';
import { 
  Code, 
  Brain, 
  Trophy, 
  Zap, 
  Users, 
  Star, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  Play,
  Globe,
  Shield,
  Rocket
} from 'lucide-react';
import '../../styles/scrollbar.css';

/**
 * FeatureHighlight - Animated feature showcase for landing page
 * Highlights key features to encourage sign-up
 */
function FeatureHighlight({ className = "" }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <Code className="w-12 h-12" />,
      title: "Multi-Language IDE",
      description: "Write code in JavaScript, Python, Java, C++, and 8+ more languages with intelligent autocomplete and syntax highlighting.",
      gradient: "from-blue-500 to-cyan-500",
      demo: `// JavaScript
console.log('Hello, World!');

# Python  
print("Hello, World!")

// Java
System.out.println("Hello, World!");`,
      stats: "12+ Languages",
      color: "blue"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI Code Generator",
      description: "Generate complete applications, components, and functions instantly using our advanced AI powered by Google Gemini.",
      gradient: "from-purple-500 to-pink-500",
      demo: `// Prompt: "Create a React todo app"
// ✨ AI generates complete app in seconds!

function TodoApp() {
  const [todos, setTodos] = useState([]);
  // ... complete implementation
}`,
      stats: "Powered by Gemini AI",
      color: "purple"
    },
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "DSA Practice Hub",
      description: "Master data structures and algorithms with 250+ carefully curated problems, solutions, and visual explanations.",
      gradient: "from-yellow-500 to-orange-500",
      demo: `// Binary Search Implementation
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
      stats: "250+ Problems",
      color: "yellow"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Lightning Execution",
      description: "Run your code instantly with our optimized cloud infrastructure. See results in real-time with sub-second response times.",
      gradient: "from-green-500 to-emerald-500",
      demo: `⚡ Execution Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Code compiled successfully
⏱️  Execution time: 0.23s
📊 Memory usage: 2.1 MB
🎯 Output: "Hello, World!"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      stats: "< 1s Response Time",
      color: "green"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentFeature = features[activeFeature];

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-blue-900/10 to-purple-900/10 rounded-3xl border border-gray-800 p-8 feature-highlight-scrollbar ${className}`}>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Feature Info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 bg-gradient-to-r ${currentFeature.gradient} rounded-2xl flex items-center justify-center transition-all duration-500 transform ${isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'}`}>
              {currentFeature.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {currentFeature.title}
              </h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${
                currentFeature.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                currentFeature.color === 'purple' ? 'bg-purple-500/20 text-purple-300' :
                currentFeature.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                <Star className="w-4 h-4" />
                <span>{currentFeature.stats}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed">
            {currentFeature.description}
          </p>

          {/* Feature Navigation Dots */}
          <div className="flex items-center space-x-3">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeFeature 
                    ? `bg-gradient-to-r ${currentFeature.gradient}` 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <SignUpButton mode="modal">
              <button
                className={`flex-1 bg-gradient-to-r ${currentFeature.gradient} hover:shadow-lg hover:shadow-${currentFeature.color}-500/25 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Try It Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex-1 border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:bg-gray-800/50 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Right Side - Code Demo */}
        <div className="relative">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2 border-b border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-gray-400 text-sm font-mono">codex-editor</span>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-sm">
              <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {currentFeature.demo}
              </pre>
            </div>

            {/* Execution Status */}
            <div className={`bg-gradient-to-r ${currentFeature.gradient} bg-opacity-10 px-6 py-3 border-t border-gray-700`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-semibold">Ready to execute</span>
                </div>
                <div className="text-gray-400 text-xs">
                  Press Ctrl+Enter to run
                </div>
              </div>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="absolute -top-4 -right-4 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-xs text-gray-400">Active Users</div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1M+</div>
              <div className="text-xs text-gray-400">Code Executions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Benefits Bar */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: <Shield className="w-5 h-5" />, text: "100% Free", color: "text-green-400" },
            { icon: <Globe className="w-5 h-5" />, text: "Cloud-Based", color: "text-blue-400" },
            { icon: <Rocket className="w-5 h-5" />, text: "Instant Setup", color: "text-purple-400" },
            { icon: <Users className="w-5 h-5" />, text: "Community", color: "text-yellow-400" }
          ].map((benefit, index) => (
            <div key={index} className="flex items-center justify-center space-x-2">
              <div className={benefit.color}>
                {benefit.icon}
              </div>
              <span className="text-gray-300 text-sm font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureHighlight;