import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Code, Lightbulb, Zap, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

const AIPeerChat = ({ currentCode = '', currentProblem = null, language = 'javascript' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hey! 👋 I'm your coding buddy. I can help you with algorithms, debug code, explain concepts, or just chat about programming. What's on your mind?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('casual'); // 'casual', 'debug', 'explain', 'optimize'
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
    setIsTyping(true);

    try {
      // Prepare context for AI
      const context = {
        currentCode: currentCode || '',
        currentProblem: currentProblem ? {
          title: currentProblem.title,
          description: currentProblem.description,
          difficulty: currentProblem.difficulty,
          category: currentProblem.category
        } : null,
        language,
        chatMode,
        conversationHistory: messages.slice(-5) // Last 5 messages for context
      };

      const response = await fetch(`${API_BASE}/api/ai/peer-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          context
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.response,
          timestamp: new Date().toISOString(),
          helpful: null // For user feedback
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "Sorry, I'm having trouble connecting right now. Can you try again? 🤔",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Could add a toast notification here
  };

  const rateMessage = (messageId, helpful) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, helpful } : msg
    ));
  };

  const quickActions = [
    {
      icon: Code,
      label: 'Debug my code',
      action: () => {
        setChatMode('debug');
        setInputMessage('Can you help me debug this code? I think there might be an issue.');
      }
    },
    {
      icon: Lightbulb,
      label: 'Explain concept',
      action: () => {
        setChatMode('explain');
        setInputMessage('Can you explain how this algorithm works?');
      }
    },
    {
      icon: Zap,
      label: 'Optimize code',
      action: () => {
        setChatMode('optimize');
        setInputMessage('How can I make this code more efficient?');
      }
    }
  ];

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-110"
        title="Chat with AI Peer"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-96 h-[500px] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Coding Buddy</h3>
                <p className="text-xs text-gray-400">Always here to help! 🤖</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Mode Selector */}
          <div className="flex bg-slate-900 border-b border-slate-700">
            {[
              { key: 'casual', label: '💬 Chat', color: 'blue' },
              { key: 'debug', label: '🐛 Debug', color: 'red' },
              { key: 'explain', label: '💡 Explain', color: 'yellow' },
              { key: 'optimize', label: '⚡ Optimize', color: 'green' }
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setChatMode(mode.key)}
                className={`flex-1 p-2 text-xs font-medium transition-colors ${
                  chatMode === mode.key
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
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-br from-green-500 to-teal-600'
                }`}>
                  {message.type === 'ai' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[85%] p-3 rounded-lg ${
                    message.type === 'ai'
                      ? 'bg-slate-700 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    <div 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>

                  {/* Message Actions */}
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition-colors"
                        title="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => rateMessage(message.id, true)}
                        className={`p-1 hover:bg-slate-700 rounded transition-colors ${
                          message.helpful === true ? 'text-green-400' : 'text-gray-400 hover:text-white'
                        }`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => rateMessage(message.id, false)}
                        className={`p-1 hover:bg-slate-700 rounded transition-colors ${
                          message.helpful === false ? 'text-red-400' : 'text-gray-400 hover:text-white'
                        }`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-3 border-t border-slate-700 bg-slate-900">
              <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
              <div className="flex gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-gray-300 hover:text-white transition-colors"
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
                placeholder="Ask me anything about coding..."
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                rows="1"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIPeerChat;