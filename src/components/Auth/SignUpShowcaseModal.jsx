import { useState, useEffect } from 'react';
import { SignUp, SignIn, useUser } from '@clerk/clerk-react';
import { 
  X, Code, Brain, Trophy, Zap, CheckCircle, Sparkles, ArrowRight, Play, Clock
} from 'lucide-react';
import ScrollProgress from '../Navigation/ScrollProgress';
import SignInTimer from './SignInTimer';
import { useAuthTimer } from '../../hooks/useAuthTimer';
import '../../styles/scrollbar.css';

function SignUpShowcaseModal({ isOpen, onClose, initialMode = 'showcase' }) {
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [scrollContainer, setScrollContainer] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { startTimer, stopTimer, resetTimer, duration, isTracking, formatTime, getSpeedRating } = useAuthTimer();

  const showcaseFeatures = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Multi-Language IDE",
      description: "Code in 12+ languages with intelligent autocomplete",
      gradient: "from-blue-500 to-cyan-500",
      demo: "console.log('Hello, World!');",
      stats: "12+ Languages"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Code Assistant",
      description: "Generate complete applications instantly with AI",
      gradient: "from-purple-500 to-pink-500",
      demo: "// AI: Create a React todo app",
      stats: "Powered by Gemini"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "DSA Practice",
      description: "Master algorithms with 250+ curated problems",
      gradient: "from-yellow-500 to-orange-500",
      demo: "def binary_search(arr, target):",
      stats: "250+ Problems"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Execution",
      description: "See your code results instantly",
      gradient: "from-green-500 to-emerald-500",
      demo: "⚡ Code executed in 0.2s",
      stats: "< 1s Response"
    }
  ];

  useEffect(() => {
    if (currentMode === 'showcase') {
      // Faster animation - 2 seconds instead of 3
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % showcaseFeatures.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentMode]);

  // Start timer when switching to auth modes
  useEffect(() => {
    if (currentMode === 'sign-up' || currentMode === 'sign-in') {
      setIsAuthenticating(true);
      startTimer();
    } else {
      setIsAuthenticating(false);
      resetTimer();
    }
  }, [currentMode, startTimer, resetTimer]);

  // Auto-close modal when user successfully signs in/up
  useEffect(() => {
    if (isLoaded && isSignedIn && isAuthenticating) {
      const finalTime = stopTimer();
      setIsAuthenticating(false);
      
      // Show success message briefly before closing
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [isLoaded, isSignedIn, onClose, stopTimer, isAuthenticating]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden auth-modal-scrollbar relative">
        
        {/* Scroll Progress Indicator */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800/30 z-10">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: scrollContainer ? `${(scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight)) * 100}%` : '0%' }}
          />
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {currentMode === 'showcase' && (
          <div 
            ref={setScrollContainer}
            className="grid md:grid-cols-2 min-h-[600px] max-h-[90vh] overflow-y-auto auth-modal-scrollbar"
          >
            {/* Left Side - Feature Showcase */}
            <div className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-8 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Welcome to Codex</h1>
                    <p className="text-blue-300">Your complete coding environment</p>
                  </div>
                </div>
              </div>

              {/* Animated Feature Display */}
              <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700">
                <div className={`w-16 h-16 bg-gradient-to-r ${showcaseFeatures[currentFeature].gradient} rounded-xl flex items-center justify-center mb-4 transition-all duration-500`}>
                  {showcaseFeatures[currentFeature].icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {showcaseFeatures[currentFeature].title}
                </h3>
                
                <p className="text-gray-300 mb-4">
                  {showcaseFeatures[currentFeature].description}
                </p>

                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400 mb-3">
                  {showcaseFeatures[currentFeature].demo}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-semibold">
                    {showcaseFeatures[currentFeature].stats}
                  </span>
                  <div className="flex space-x-1">
                    {showcaseFeatures.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentFeature ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {[
                  "Free forever - no credit card required",
                  "Instant access to all features",
                  "Cloud-based - access from anywhere",
                  "Join 10,000+ developers worldwide"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Call to Action */}
            <div className="p-8 flex flex-col justify-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-3">
                  Sign In Under 2 Minutes
                </h2>
                <p className="text-gray-400 mb-6">
                  No setup required • Free forever • Instant access
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => setCurrentMode('sign-up')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Create Free Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setCurrentMode('sign-in')}
                    className="w-full border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:bg-gray-800/50"
                  >
                    Already have an account? Sign In
                  </button>

                  <button
                    onClick={() => setCurrentMode('demo')}
                    className="w-full flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors py-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Watch Demo</span>
                  </button>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">Trusted by developers at</span>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-white">10K+</div>
                    <div className="text-xs text-gray-400">Developers</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">1M+</div>
                    <div className="text-xs text-gray-400">Code Runs</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">250+</div>
                    <div className="text-xs text-gray-400">Problems</div>
                  </div>
                </div>
                
                {/* Secured by Clerk Badge */}
                <div className="mt-3 pt-3 border-t border-gray-700 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Secured by Clerk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up Form */}
        {currentMode === 'sign-up' && (
          <div className="p-8 max-w-md mx-auto max-h-[90vh] overflow-y-auto auth-modal-scrollbar">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-gray-400">Start your coding journey today</p>
            </div>

            {/* Sign In Timer */}
            <SignInTimer 
              isActive={isTracking && currentMode === 'sign-up'} 
              onComplete={(time) => {
                const rating = getSpeedRating(time);
                console.log(`Sign up completed in ${formatTime(time)} - ${rating?.rating}`);
              }}
              showGoal={true}
            />

            {/* Success Message */}
            {isLoaded && isSignedIn && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-3 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Account Created Successfully!</div>
                    <div className="text-sm text-green-300">
                      {duration && `Completed in ${formatTime(duration)} ${getSpeedRating(duration)?.emoji}`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="clerk-form-scrollbar">
              <SignUp 
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "bg-gray-800 border-gray-700 hover:bg-gray-700",
                    formFieldInput: "bg-gray-800 border-gray-700 text-white",
                    footerActionLink: "text-blue-400 hover:text-blue-300",
                    footer: "hidden",
                    footerAction: "hidden",
                    footerActionText: "hidden",
                    footerActionLink: "hidden",
                    identityPreviewText: "text-white",
                    identityPreviewEditButton: "text-blue-400",
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                    dividerLine: "bg-gray-700",
                    dividerText: "text-gray-400",
                    formFieldLabel: "text-gray-300",
                    formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-300",
                    otpCodeFieldInput: "bg-gray-800 border-gray-700 text-white",
                    formResendCodeLink: "text-blue-400 hover:text-blue-300",
                    alertText: "text-red-400",
                    logoBox: "hidden",
                    badge: "hidden"
                  },
                  layout: {
                    logoPlacement: "none",
                    showOptionalFields: true
                  }
                }}
              />
            </div>

            {/* Navigation to Sign In */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setCurrentMode('sign-in');
                  // Reset timer when switching modes
                  resetTimer();
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Already have an account? Sign in
              </button>
            </div>

            {/* Secured by Clerk Badge */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Secured by Clerk</span>
              </div>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        {currentMode === 'sign-in' && (
          <div className="p-8 max-w-md mx-auto max-h-[90vh] overflow-y-auto auth-modal-scrollbar">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to continue coding</p>
            </div>

            {/* Sign In Timer */}
            <SignInTimer 
              isActive={isTracking && currentMode === 'sign-in'} 
              onComplete={(time) => {
                const rating = getSpeedRating(time);
                console.log(`Sign in completed in ${formatTime(time)} - ${rating?.rating}`);
              }}
              showGoal={true}
            />

            {/* Success Message */}
            {isLoaded && isSignedIn && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-3 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Welcome Back!</div>
                    <div className="text-sm text-green-300">
                      {duration && `Signed in within ${formatTime(duration)} ${getSpeedRating(duration)?.emoji}`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="clerk-form-scrollbar">
              <SignIn 
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "bg-gray-800 border-gray-700 hover:bg-gray-700",
                    formFieldInput: "bg-gray-800 border-gray-700 text-white",
                    footerActionLink: "text-blue-400 hover:text-blue-300",
                    footer: "hidden",
                    footerAction: "hidden",
                    footerActionText: "hidden",
                    footerActionLink: "hidden",
                    identityPreviewText: "text-white",
                    identityPreviewEditButton: "text-blue-400",
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                    dividerLine: "bg-gray-700",
                    dividerText: "text-gray-400",
                    formFieldLabel: "text-gray-300",
                    formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-300",
                    otpCodeFieldInput: "bg-gray-800 border-gray-700 text-white",
                    formResendCodeLink: "text-blue-400 hover:text-blue-300",
                    alertText: "text-red-400",
                    logoBox: "hidden",
                    badge: "hidden"
                  },
                  layout: {
                    logoPlacement: "none",
                    showOptionalFields: true
                  }
                }}
              />
            </div>

            {/* Only show "Don't have an account? Sign up" on sign-in page */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setCurrentMode('sign-up');
                  // Reset timer when switching modes
                  resetTimer();
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Don't have an account? Sign up
              </button>
            </div>

            {/* Secured by Clerk Badge */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Secured by Clerk</span>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode */}
        {currentMode === 'demo' && (
          <div className="p-8 max-h-[90vh] overflow-y-auto auth-modal-scrollbar">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">See Codex in Action</h2>
              <p className="text-gray-400">Watch how easy it is to start coding</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white mb-4 mx-auto" />
                  <p className="text-white font-semibold">Demo Video Coming Soon</p>
                  <p className="text-gray-400 text-sm">Experience the power of Codex</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentMode('sign-up')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => setCurrentMode('showcase')}
                className="flex-1 border border-gray-600 hover:border-gray-500 px-6 py-3 rounded-xl font-semibold text-gray-300 hover:text-white transition-all"
              >
                Back to Features
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 

export default SignUpShowcaseModal;