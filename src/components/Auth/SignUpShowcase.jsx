inimport { useState } from 'react';
import Shield, Zap, Code, Trophy, Users, ArrowRight } from 'lucide-react';
import ClerkSignUp from './ClerkSignUp';

const SignUpShowcase = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Professional Code Editor",
      description: "Monaco Editor with syntax highlighting, autocomplete, and themes"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Code Execution",
      description: "Run JavaScript code instantly with real-time output"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Problem Solving",
      description: "Practice coding problems and track your progress"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Features",
      description: "Share solutions and learn from other developers"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Authentication",
      description: "Powered by Clerk for enterprise-grade security"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Verification",
      description: "Secure account creation with email verification"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-600/10 border border-purple-500/20 rounded-full px-6 py-3 mb-8">
            <UserPlus className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Join Codex Playground</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Start Your
            <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Coding Journey
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of developers using Codex Playground to practice, learn, and build amazing projects. 
            Sign up in seconds and start coding immediately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="text-sm text-gray-400">
              <span>✨ No credit card required</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-purple-500/30"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Active Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-400 text-sm">Problems Solved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">100+</div>
              <div className="text-gray-400 text-sm">Coding Challenges</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Coding?</h2>
            <p className="text-gray-300 mb-6">
              Join Codex Playground today and take your programming skills to the next level.
            </p>
            
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Sign Up Now - It's Free!</span>
            </button>
            
            <div className="mt-4 text-sm text-gray-400">
              <span>🚀 Get started in under 30 seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clerk Sign Up Modal */}
      <ClerkSignUp
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          // Could open sign in modal here
        }}
      />
    </div>
  );
};

export default SignUpShowcase;