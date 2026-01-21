import { useState, useRef, useEffect } from 'react';
import { Send, Brain, ArrowLeft, Copy, Plus, MoreVertical, Download, Code, Terminal, Zap, Settings, Book } from 'lucide-react';

const AIUniversalCreatorModern = ({ onBack }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I\'m your AI assistant for Codex Playground. I can help you with:\n\n• **General coding questions** and explanations\n• **Debugging** and troubleshooting\n• **Programming concepts** and best practices\n• **Code generation** - Web apps, mobile apps, APIs, documents, and data analysis\n\nJust ask me anything! Whether you want to chat about programming or need me to generate specific code, I\'m here to help. 😊',
            timestamp: Date.now()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const examplePrompts = [
        'How do I fix a JavaScript error?',
        'Explain React hooks to me',
        'Create a todo list app with dark mode',
        'What are the best practices for API design?',
        'Build a weather forecast mobile app',
        'Help me understand async/await in JavaScript'
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
            // Detect if this is a code generation request or general chat
            const isCodeRequest = detectCodeGenerationRequest(userMessage.content);
            
            let response;
            if (isCodeRequest) {
                // Use code generation endpoint
                response = await fetch('http://localhost:3001/api/ai/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userMessage.content, outputType: 'web' })
                });
            } else {
                // Use general chat endpoint
                response = await fetch('http://localhost:3001/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: userMessage.content,
                        conversationHistory: messages.slice(-10) // Last 10 messages for context
                    })
                });
            }

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            if (data.success) {
                let assistantMessage;
                
                if (isCodeRequest && data.content) {
                    // Code generation response
                    assistantMessage = {
                        role: 'assistant',
                        content: data.content.html || data.content.code || data.content.content,
                        type: data.content.type,
                        isCode: true,
                        source: data.source,
                        timestamp: Date.now()
                    };
                } else {
                    // General chat response
                    assistantMessage = {
                        role: 'assistant',
                        content: data.response || data.content,
                        isCode: false,
                        source: data.source,
                        timestamp: Date.now()
                    };
                }
                
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error(data.error || 'Response failed');
            }
        } catch (error) {
            console.error('AI Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: '❌ Sorry, I encountered an error. Please make sure the backend server is running on port 3001 and try again.',
                isError: true,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setGenerating(false);
        }
    };

    // Function to detect if user wants code generation or general chat
    const detectCodeGenerationRequest = (message) => {
        const codeKeywords = [
            'create', 'build', 'generate', 'make', 'develop', 'code',
            'app', 'website', 'api', 'function', 'component', 'script',
            'html', 'css', 'javascript', 'python', 'react', 'express',
            'todo', 'calculator', 'form', 'button', 'page', 'site'
        ];
        
        const lowerMessage = message.toLowerCase();
        return codeKeywords.some(keyword => lowerMessage.includes(keyword)) && 
               (lowerMessage.includes('create') || lowerMessage.includes('build') || 
                lowerMessage.includes('generate') || lowerMessage.includes('make'));
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

    const downloadCode = (content, type) => {
        const extensions = { html: 'html', javascript: 'js', markdown: 'md', python: 'py' };
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-generated.${extensions[type] || 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const startNewChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: 'Hello! I\'m your AI assistant for Codex Playground. I can help you with:\n\n• **General coding questions** and explanations\n• **Debugging** and troubleshooting\n• **Programming concepts** and best practices\n• **Code generation** - Web apps, mobile apps, APIs, documents, and data analysis\n\nJust ask me anything! Whether you want to chat about programming or need me to generate specific code, I\'m here to help. 😊',
                timestamp: Date.now()
            }
        ]);
    };

    return (
        <div className="flex h-screen bg-white text-gray-900">
            {/* Custom Scrollbar Styles */}
            <style>{`
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
                
                * {
                    scrollbar-width: thin;
                    scrollbar-color: #d1d5db transparent;
                }
            `}</style>

            {/* Sidebar */}
            <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800`}>
                <div className="p-4 border-b border-gray-800">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">New Chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    <div className="text-xs font-semibold text-gray-400 mb-4 px-2">AI ASSISTANT</div>
                    <div className="px-3 py-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                            <Brain className="w-6 h-6 text-purple-400" />
                            <div>
                                <div className="text-sm font-medium text-white">Universal AI</div>
                                <div className="text-xs text-gray-400">Chat & Code Generation</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 leading-relaxed">
                            Ask me anything about programming, or request code generation for web apps, mobile apps, APIs, and more!
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-800">
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
                <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">AI Code Generator</h1>
                            <p className="text-xs text-gray-500">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs text-green-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Online</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-4 py-6">
                        {messages.map((message, index) => (
                            <div key={index} className={`mb-6 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                                {message.role === 'assistant' && (
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Brain className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            {message.isCode ? (
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Code className="w-4 h-4 text-gray-600" />
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Generated Code
                                                            </span>
                                                            {message.source === 'gemini-ai' && (
                                                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                                                    Gemini AI
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => copyToClipboard(message.content)}
                                                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                                                title="Copy code"
                                                            >
                                                                <Copy className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => downloadCode(message.content, message.type)}
                                                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                                                title="Download"
                                                            >
                                                                <Download className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-800 max-h-96 overflow-y-auto">
                                                        {message.content}
                                                    </pre>
                                                </div>
                                            ) : (
                                                <div className={`prose prose-sm max-w-none ${message.isError ? 'text-red-600' : 'text-gray-800'}`}>
                                                    {message.content.split('\n').map((line, i) => (
                                                        <p key={i} className="mb-2 whitespace-pre-wrap">{line}</p>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-400 mt-2">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {message.role === 'user' && (
                                    <div className="flex items-start space-x-3 justify-end">
                                        <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl max-w-xl">
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                            <div className="text-xs opacity-75 mt-1">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm font-semibold">U</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {generating && (
                            <div className="flex items-start space-x-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span className="text-sm text-gray-600">Generating with AI...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Example Prompts (shown when no messages) */}
                {messages.length === 1 && !generating && (
                    <div className="px-4 pb-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-sm text-gray-500 mb-3">Try these examples:</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {examplePrompts.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setInputText(prompt)}
                                        className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="border-t border-gray-200 bg-white px-4 py-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-end space-x-3 bg-gray-50 border border-gray-300 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <textarea
                                ref={textareaRef}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message AI Code Generator..."
                                className="flex-1 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none resize-none max-h-48 overflow-y-auto"
                                rows="1"
                                disabled={generating}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim() || generating}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-xs text-gray-400 text-center mt-2">
                            Press Enter to send, Shift+Enter for new line
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIUniversalCreatorModern;