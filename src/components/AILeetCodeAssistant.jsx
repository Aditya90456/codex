import { useState, useRef, useEffect } from 'react';
import { Brain, X, Lightbulb, Code, CheckCircle, AlertCircle, Zap, MessageSquare, Sparkles, Target, User } from 'lucide-react';

const AILeetCodeAssistant = ({ 
  currentProblem, 
  currentCode = '', 
  language = 'javascript',
  testResults = null,
  onCodeSuggestion = null 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistanceMode, setAssistanceMode] = useState('hint'); // 'hint', 'solution', 'debug', 'optimize'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Initialize with welcome message when problem changes
  useEffect(() => {
    if (currentProblem && isOpen) {
      initializeAssistant();
    }
  }, [currentProblem, isOpen]);

  const initializeAssistant = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `👋 Hi! I'm your AI LeetCode assistant. I'm here to help you solve "${currentProblem.title}".

I can help you with:
🔍 **Hints** - Gentle nudges in the right direction
💡 **Approach** - Explain different solution strategies  
🐛 **Debug** - Find issues in your code
⚡ **Optimize** - Improve time/space complexity
📝 **Review** - Analyze your solution

What would you like help with?`,
      timestamp: new Date().toISOString(),
      mode: 'welcome'
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/ai/leetcode-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          problem: currentProblem,
          code: currentCode,
          language,
          testResults,
          assistanceMode,
          conversationHistory: messages.slice(-5)
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.response,
          timestamp: new Date().toISOString(),
          mode: assistanceMode,
          suggestions: data.suggestions || []
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI assistant error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "Sorry, I'm having trouble right now. Can you try asking again? 🤔",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    {
      icon: Lightbulb,
      label: 'Give me a hint',
      mode: 'hint',
      action: () => {
        setAssistanceMode('hint');
        setInputMessage('Can you give me a hint for this problem?');
      }
    },
    {
      icon: Target,
      label: 'Explain approach',
      mode: 'solution',
      action: () => {
        setAssistanceMode('solution');
        setInputMessage('What approach should I use to solve this?');
      }
    },
    {
      icon: AlertCircle,
      label: 'Debug my code',
      mode: 'debug',
      action: () => {
        setAssistanceMode('debug');
        setInputMessage('Can you help me debug this code?');
      }
    },
    {
      icon: Zap,
      label: 'Optimize solution',
      mode: 'optimize',
      action: () => {
        setAssistanceMode('optimize');
        setInputMessage('How can I optimize this solution?');
      }
    }
  ];

  const applySuggestion = (suggestion) => {
    if (onCodeSuggestion) {
      onCodeSuggestion(suggestion);
    }
  };

  const formatMessage = (content) => {
    // Enhanced markdown-like formatting for code assistance
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 p-3 rounded-lg overflow-x-auto"><code class="text-green-400">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-2 py-1 rounded text-sm text-green-400">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-blue-300">$1</em>')
      .replace(/🔍|💡|🐛|⚡|📝|🎯|✅|❌|⚠️/g, '<span class="text-lg">$&</span>');
  };

  const getModeColor = (mode) => {
    const colors = {
      hint: 'text-yellow-400',
      solution: 'text-blue-400',
      debug: 'text-red-400',
      optimize: 'text-green-400',
      welcome: 'text-purple-400'
    };
    return colors[mode] || 'text-gray-400';
  };

  const getModeIcon = (mode) => {
    const icons = {
      hint: Lightbulb,
      solution: Target,
      debug: AlertCircle,
      optimize: Zap,
      welcome: Sparkles
    };
    const Icon = icons[mode] || Brain;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-24 z-50 p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-110"
        title="AI LeetCode Assistant"
      >
        <Brain className="w-6 h-6" />
      </button>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[450px] h-[600px] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900 to-blue-900 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI LeetCode Assistant</h3>
                <p className="text-xs text-purple-200">Powered by Gemini AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Problem Context */}
          {currentProblem && (
            <div className="p-3 bg-slate-900 border-b border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">{currentProblem.title}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  currentProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  currentProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {currentProblem.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-400">{currentProblem.category} • {language}</p>
            </div>
          )}

          {/* Assistance Mode Selector */}
          <div className="flex bg-slate-900 border-b border-slate-700">
            {[
              { key: 'hint', label: '💡 Hint', color: 'yellow' },
              { key: 'solution', label: '🎯 Approach', color: 'blue' },
              { key: 'debug', label: '🐛 Debug', color: 'red' },
              { key: 'optimize', label: '⚡ Optimize', color: 'green' }
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setAssistanceMode(mode.key)}
                className={`flex-1 p-2 text-xs font-medium transition-colors ${
                  assistanceMode === mode.key
                    ? `bg-${mode.color}-600 text-white`
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'ai' 
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                    : 'bg-gradient-to-br from-green-500 to-teal-600'
                }`}>
                  {message.type === 'ai' ? (
                    getModeIcon(message.mode)
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[90%] p-3 rounded-lg ${
                    message.type === 'ai'
                      ? 'bg-slate-700 text-white'
                      : 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                  }`}>
                    <div 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>

                  {/* Code Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => applySuggestion(suggestion)}
                          className="block w-full text-left p-2 bg-slate-600 hover:bg-slate-500 rounded text-xs text-gray-300 hover:text-white transition-colors"
                        >
                          <Code className="w-3 h-3 inline mr-1" />
                          Apply: {suggestion.description}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-3 border-t border-slate-700 bg-slate-900">
              <p className="text-xs text-gray-400 mb-2">Quick help:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-700 bg-slate-900">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask for ${assistanceMode} help...`}
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                rows="1"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white p-2 rounded-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AILeetCodeAssistant;