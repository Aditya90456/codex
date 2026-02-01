import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Brain, ArrowLeft, Copy, Download, Code, Layers, FileText, Zap, Home } from 'lucide-react';

const ReactCodeAI = ({ onBack }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your React.js AI Code Generator. I can create complete React applications with:\n\n• **Full React Apps** - Multi-component applications with routing\n• **Individual Components** - Reusable React components\n• **Hooks & Context** - Custom hooks and state management\n• **Modern Features** - TypeScript, styled-components, animations\n• **Complete Projects** - Todo apps, dashboards, e-commerce, etc.\n\nDescribe what you want to build and I\'ll generate the complete React code! 🚀',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [generating, setGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const reactExamples = [
    'Create a complete todo app with React hooks',
    'Build a weather dashboard with API integration',
    'Generate a modern e-commerce product page',
    'Create a blog app with routing and components',
    'Build a social media feed component',
    'Generate a React admin dashboard'
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || generating) return;

    const userMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setGenerating(true);

    try {
      // Enhanced React-specific prompt
      const enhancedPrompt = `Create a complete React.js application for: ${userMessage.content}

Requirements:
- Use modern React with functional components and hooks
- Include proper imports and exports
- Add TypeScript types if complex
- Use modern CSS-in-JS or styled-components
- Include error handling and loading states
- Add proper component structure and organization
- Include interactive features and state management
- Make it responsive and accessible
- Add comments explaining key functionality
- Use modern React patterns and best practices

Generate a complete, production-ready React application.`;

      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      console.log('🔍 React AI Debug - API URL:', API_URL);
      console.log('🔍 React AI Debug - Request payload:', { 
        prompt: enhancedPrompt,
        outputType: 'react',
        temperature: 0.7
      });
      
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: enhancedPrompt,
          outputType: 'react',
          temperature: 0.7
        })
      });

      console.log('🔍 React AI Debug - Response status:', response.status);
      console.log('🔍 React AI Debug - Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 React AI Debug - Error response:', errorText);
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      console.log('🔍 React AI Debug - Response data:', data);
      console.log('🔍 React AI Debug - Content type:', typeof data.content);
      console.log('🔍 React AI Debug - Content keys:', data.content ? Object.keys(data.content) : 'No content');
      
      if (data.success) {
        const content = data.content.code || data.content.html || data.content.content || data.content;
        console.log('🔍 React AI Debug - Final content length:', content ? content.length : 0);
        
        const assistantMessage = {
          role: 'assistant',
          content: content,
          type: 'react',
          isCode: true,
          source: data.source,
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Response failed');
      }
    } catch (error) {
      console.error('React AI Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `❌ Sorry, I encountered an error generating React code: ${error.message}. Please check the console for details and make sure the backend server is running on port 3001.`,
        isError: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
  };

  const downloadCode = (content) => {
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ReactApp.jsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMultiFileProject = async (projectType) => {
    setGenerating(true);
    
    const projectPrompts = {
      'todo-app': 'Create a complete Todo application with add, edit, delete, and filter functionality',
      'dashboard': 'Create a modern admin dashboard with charts, tables, and navigation',
      'ecommerce': 'Create an e-commerce product listing page with cart functionality',
      'blog': 'Create a blog application with post listing, detail view, and comments',
      'social': 'Create a social media feed with posts, likes, and comments',
      'weather': 'Create a weather app with current weather and 5-day forecast'
    };

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: projectPrompts[projectType],
          outputType: 'react',
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.content.code || data.content.html || data.content.content || data.content,
          type: 'react',
          isCode: true,
          source: data.source,
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Project generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Code className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">React AI</h1>
              <p className="text-sm text-gray-400">Full Stack Generator</p>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mb-4">QUICK PROJECTS</div>
          <div className="space-y-2">
            {[
              { id: 'todo-app', name: 'Todo App', icon: FileText },
              { id: 'dashboard', name: 'Dashboard', icon: Layers },
              { id: 'ecommerce', name: 'E-commerce', icon: Zap },
              { id: 'blog', name: 'Blog App', icon: FileText },
              { id: 'social', name: 'Social Feed', icon: Layers },
              { id: 'weather', name: 'Weather App', icon: Zap }
            ].map((project) => {
              const Icon = project.icon;
              return (
                <button
                  key={project.id}
                  onClick={() => generateMultiFileProject(project.id)}
                  disabled={generating}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all disabled:opacity-50"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{project.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="text-xs text-gray-400 mb-3">FEATURES</div>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Modern React Hooks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>TypeScript Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Styled Components</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Responsive Design</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>State Management</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onBack || (() => window.history.back())}
            className="w-full flex items-center justify-center space-x-2 text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">React Code Generator</h1>
                <p className="text-xs text-gray-400">Powered by AI • Full Stack Ready</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-300 hover:text-white"
                title="Back to Home"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm hidden md:inline">Home</span>
              </button>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-full text-xs text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {messages.map((message, index) => (
              <div key={index} className={`mb-8 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      {message.isCode ? (
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
                          <div className="bg-gray-900/50 px-6 py-3 border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Code className="w-5 h-5 text-blue-400" />
                              <span className="text-sm font-medium text-white">React Component</span>
                              {message.source === 'gemini-ai' && (
                                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                                  AI Generated
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => copyToClipboard(message.content)}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                                title="Copy code"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => downloadCode(message.content)}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <pre className="p-6 overflow-x-auto text-sm font-mono text-gray-300 max-h-96 overflow-y-auto bg-gray-900/30">
                            {message.content}
                          </pre>
                        </div>
                      ) : (
                        <div className={`prose prose-sm max-w-none ${message.isError ? 'text-red-400' : 'text-gray-300'}`}>
                          {message.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 whitespace-pre-wrap">{line}</p>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-3">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}

                {message.role === 'user' && (
                  <div className="flex items-start space-x-4 justify-end">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl max-w-2xl">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="text-xs opacity-75 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">U</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {generating && (
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">Generating React code...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Example Prompts */}
        {messages.length === 1 && !generating && (
          <div className="px-6 pb-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-sm text-gray-400 mb-4">Try these React examples:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reactExamples.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(prompt)}
                    className="text-left px-4 py-3 bg-gray-800/30 hover:bg-gray-700/30 border border-gray-700 rounded-lg text-sm transition-colors text-gray-300 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-700 bg-gray-900/30 backdrop-blur-sm px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4 bg-gray-800/50 border border-gray-600 rounded-2xl p-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your React application..."
                className="flex-1 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:outline-none resize-none max-h-48 overflow-y-auto"
                rows="1"
                disabled={generating}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || generating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactCodeAI;