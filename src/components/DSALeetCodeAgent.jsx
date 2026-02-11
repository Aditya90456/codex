import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Brain, Send, Lightbulb, Code, BookOpen, Zap, 
  TrendingUp, Target, CheckCircle, AlertCircle,
  Sparkles, MessageCircle, X, Minimize2, Maximize2,
  Copy, ThumbsUp, ThumbsDown, RotateCcw, Loader2,
  ChevronDown, ChevronUp, Play, Award
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DSALeetCodeAgent = ({ 
  problemTitle, 
  problemDescription, 
  problemDifficulty, 
  problemTags,
  userCode,
  onCodeSuggestion 
}) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat, hints, patterns, complexity
  const [hints, setHints] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `👋 Hi! I'm your DSA AI Assistant. I can help you with:

🎯 **Problem Analysis** - Understand the problem better
💡 **Hints** - Get progressive hints without spoilers
🔍 **Pattern Recognition** - Identify DSA patterns
⚡ **Optimization** - Improve time/space complexity
🐛 **Debugging** - Find issues in your code
📚 **Explanations** - Learn concepts step-by-step

Ask me anything about "${problemTitle}"!`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [problemTitle, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick action buttons
  const quickActions = [
    { 
      label: 'Give me a hint', 
      icon: Lightbulb, 
      prompt: 'Can you give me a hint to solve this problem without revealing the solution?',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      label: 'Explain approach', 
      icon: BookOpen, 
      prompt: 'Can you explain the optimal approach to solve this problem?',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Identify pattern', 
      icon: Target, 
      prompt: 'What DSA pattern does this problem follow?',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Time complexity', 
      icon: Zap, 
      prompt: 'What is the time and space complexity of the optimal solution?',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Debug my code', 
      icon: Code, 
      prompt: `Can you help me debug this code?\n\n\`\`\`\n${userCode || 'No code provided yet'}\n\`\`\``,
      color: 'from-red-500 to-pink-500'
    },
    { 
      label: 'Similar problems', 
      icon: TrendingUp, 
      prompt: 'What are similar problems I should practice?',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/leetcode-ml/dsa-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'anonymous',
          problemTitle,
          problemDescription,
          problemDifficulty,
          problemTags,
          userCode,
          message: messageText,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          hints: data.hints,
          patterns: data.patterns,
          complexity: data.complexity,
          codeSnippet: data.codeSnippet,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Update hints and patterns if provided
        if (data.hints) setHints(data.hints);
        if (data.patterns) setPatterns(data.patterns);
        if (data.complexity) setComplexity(data.complexity);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('DSA Agent error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again or rephrase your question.',
        error: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    sendMessage(prompt);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    // Could add a toast notification here
  };

  const resetConversation = () => {
    setMessages([]);
    setHints([]);
    setPatterns([]);
    setComplexity(null);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-2xl transition-all transform hover:scale-105 animate-pulse hover:animate-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">DSA AI Assistant</div>
              <div className="text-xs text-blue-100">Click to open</div>
            </div>
            <Sparkles className="w-5 h-5 ml-2" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-2 border-gray-700/50 rounded-3xl shadow-2xl flex flex-col z-50 backdrop-blur-xl">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"></div>
      
      <div className="relative flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-5 rounded-t-3xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">DSA AI Assistant</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Powered by Gemini 2.5
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetConversation}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-all transform hover:scale-110"
              title="Reset conversation"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-all transform hover:scale-110"
              title="Minimize"
            >
              <Minimize2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
        {[
          { id: 'chat', label: 'Chat', icon: MessageCircle },
          { id: 'hints', label: 'Hints', icon: Lightbulb, count: hints.length },
          { id: 'patterns', label: 'Patterns', icon: Target, count: patterns.length },
          { id: 'complexity', label: 'Analysis', icon: Zap }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-3.5 text-sm font-semibold transition-all relative ${
                activeTab === tab.id
                  ? 'text-white bg-gradient-to-b from-blue-600/20 to-transparent'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              )}
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-1.5 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full font-bold shadow-lg">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : message.error
                        ? 'bg-red-900/30 border border-red-700 text-red-200'
                        : 'bg-gray-800 border border-gray-700 text-gray-200'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {message.codeSnippet && (
                      <div className="mt-3 bg-gray-950 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">Code Suggestion</span>
                          <button
                            onClick={() => copyCode(message.codeSnippet)}
                            className="p-1 hover:bg-gray-800 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                        <pre className="text-xs text-green-400 overflow-x-auto">
                          <code>{message.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t border-gray-700/50 bg-gradient-to-b from-gray-800/50 to-gray-800">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.prompt)}
                      className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${action.color} hover:opacity-90 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-all transform hover:scale-105 shadow-lg hover:shadow-xl`}
                      disabled={loading}
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask me anything about this problem..."
                  className="flex-1 px-4 py-3.5 bg-gray-900/80 border-2 border-gray-700/50 focus:border-blue-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {hints.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No hints yet. Ask for hints in the chat!</p>
              </div>
            ) : (
              hints.map((hint, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Hint {index + 1}</h4>
                      <p className="text-sm text-gray-300">{hint}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {patterns.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No patterns identified yet.</p>
              </div>
            ) : (
              patterns.map((pattern, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">{pattern.name}</h4>
                      <p className="text-sm text-gray-300 mb-3">{pattern.description}</p>
                      {pattern.examples && (
                        <div className="text-xs text-gray-400">
                          <span className="font-medium">Similar problems:</span> {pattern.examples.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'complexity' && (
          <div className="h-full overflow-y-auto p-4">
            {!complexity ? (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No complexity analysis yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Time Complexity
                  </h4>
                  <div className="text-2xl font-bold text-green-400 mb-2">{complexity.time}</div>
                  <p className="text-sm text-gray-300">{complexity.timeExplanation}</p>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    Space Complexity
                  </h4>
                  <div className="text-2xl font-bold text-blue-400 mb-2">{complexity.space}</div>
                  <p className="text-sm text-gray-300">{complexity.spaceExplanation}</p>
                </div>

                {complexity.optimization && (
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      Optimization Tips
                    </h4>
                    <p className="text-sm text-gray-300">{complexity.optimization}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default DSALeetCodeAgent;
