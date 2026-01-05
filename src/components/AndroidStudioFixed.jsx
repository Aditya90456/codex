import { useState, useRef, useEffect, useCallback, Suspense, lazy, Component } from 'react';
import Editor from '@monaco-editor/react';
import ErrorBoundary from './ErrorBoundary';
import { 
  Play, Save, Smartphone, Code, FileText, Folder, Plus, 
  Terminal, Settings, Package, Download, Upload, X, RefreshCw, Globe,
  Zap, Brain, Eye, Lightbulb, CheckCircle, AlertTriangle, Info,
  Loader2, ArrowLeft, Home, Maximize2, Minimize2, ChevronRight, ChevronLeft
} from 'lucide-react';

// Lazy load heavy components
const AndroidPreview = lazy(() => import('./AndroidPreview'));
const CodeAnalyzer = lazy(() => import('./CodeAnalyzer'));

// Loading fallback component
const LoadingFallback = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-3">
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-center">
      <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

const AndroidStudioFixed = ({ onBack }) => {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Android Studio...');
  const [isNavigating, setIsNavigating] = useState(false);

  // Core editor state
  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [consoleMinimized, setConsoleMinimized] = useState(false);

  // Navigation state
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentView, setCurrentView] = useState('editor');

  const editorRef = useRef(null);
  const navigationTimeoutRef = useRef(null);

  // Initialize Android Studio with proper loading sequence
  useEffect(() => {
    const initializeStudio = async () => {
      try {
        setIsLoading(true);
        
        const loadingSteps = [
          { progress: 10, message: 'Loading Android SDK...' },
          { progress: 25, message: 'Initializing project structure...' },
          { progress: 40, message: 'Setting up code editor...' },
          { progress: 60, message: 'Loading Android emulator...' },
          { progress: 80, message: 'Configuring build tools...' },
          { progress: 95, message: 'Finalizing setup...' },
          { progress: 100, message: 'Android Studio ready!' }
        ];

        for (const step of loadingSteps) {
          setLoadingProgress(step.progress);
          setLoadingMessage(step.message);
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Initialize default project
        await initializeDefaultProject();
        
        setIsLoading(false);
        setConsoleOutput([
          { type: 'success', message: '🚀 Android Studio loaded successfully! • All systems ready', timestamp: Date.now() },
          { type: 'info', message: '📱 Ready for Android development • Monaco Editor initialized', timestamp: Date.now() }
        ]);

      } catch (error) {
        console.error('Failed to initialize Android Studio:', error);
        setConsoleOutput([
          { type: 'error', message: `❌ Initialization failed: ${error.message}`, timestamp: Date.now() }
        ]);
        setIsLoading(false);
      }
    };

    initializeStudio();
  }, []);

  // Initialize default Android project
  const initializeDefaultProject = async () => {
    const defaultFiles = {
      'MainActivity.java': {
        content: `package com.example.myapp;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private TextView textView;
    private Button button;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        initializeViews();
        setupListeners();
    }
    
    private void initializeViews() {
        textView = findViewById(R.id.textView);
        button = findViewById(R.id.button);
    }
    
    private void setupListeners() {
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                textView.setText("Hello from Android Studio!");
            }
        });
    }
}`,
        language: 'java',
        type: 'activity'
      },
      'activity_main.xml': {
        content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="16dp">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome to Android Studio!"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_marginBottom="32dp" />

    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Click Me"
        android:textSize="16sp"
        android:padding="16dp" />

</LinearLayout>`,
        language: 'xml',
        type: 'layout'
      },
      'AndroidManifest.xml': {
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
    </application>

</manifest>`,
        language: 'xml',
        type: 'manifest'
      }
    };

    setFiles(defaultFiles);
    setActiveFile('MainActivity.java');
  };

  // Safe navigation with loading states
  const navigateToView = useCallback((view, options = {}) => {
    if (isNavigating) return;

    setIsNavigating(true);
    
    // Clear any existing navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Add to navigation history
    setNavigationHistory(prev => [...prev.slice(-9), {
      view: currentView,
      timestamp: Date.now()
    }]);

    // Simulate navigation loading
    navigationTimeoutRef.current = setTimeout(() => {
      setCurrentView(view);
      setIsNavigating(false);
      
      if (options.callback) {
        options.callback();
      }
    }, 200);

  }, [isNavigating, currentView]);

  // Safe back navigation
  const handleBackNavigation = useCallback(() => {
    if (onBack) {
      setIsNavigating(true);
      setTimeout(() => {
        onBack();
      }, 100);
    }
  }, [onBack]);

  // Handle editor mounting with error handling
  const handleEditorDidMount = useCallback((editor, monaco) => {
    try {
      editorRef.current = editor;
      setIsEditorReady(true);
      
      // Configure editor
      editor.updateOptions({
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
        minimap: { enabled: true },
        automaticLayout: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        bracketPairColorization: { enabled: true }
      });

      setConsoleOutput(prev => [...prev, {
        type: 'success',
        message: '✅ Code editor ready • Monaco Editor mounted successfully',
        timestamp: Date.now()
      }]);

    } catch (error) {
      console.error('Editor mount error:', error);
      setConsoleOutput(prev => [...prev, {
        type: 'error',
        message: `❌ Editor error: ${error.message}`,
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Handle code changes with immediate feedback
  const handleCodeChange = useCallback((value, fileName) => {
    try {
      // Immediate state update with timestamp for reactivity
      const timestamp = Date.now();
      
      setFiles(prev => {
        const newFiles = {
          ...prev,
          [fileName]: {
            ...prev[fileName],
            content: value || '',
            lastModified: timestamp // Add timestamp for reactivity
          }
        };
        
        // Trigger immediate console feedback
        setConsoleOutput(prevOutput => [...prevOutput, {
          type: 'info',
          message: `📝 Live Update: ${fileName} • ${(value || '').length} characters • Line count: ${(value || '').split('\n').length}`,
          timestamp: timestamp
        }]);
        
        return newFiles;
      });

      // No need to toggle states - components will react to file changes automatically
      console.log(`🔄 Code changed in ${fileName}, preview will update automatically`);

    } catch (error) {
      console.error('Code change error:', error);
      setConsoleOutput(prev => [...prev, {
        type: 'error',
        message: `❌ Error updating ${fileName}: ${error.message}`,
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Handle file selection with loading
  const handleFileSelect = useCallback((fileName) => {
    if (isNavigating || !files[fileName]) return;

    setIsNavigating(true);
    
    setTimeout(() => {
      setActiveFile(fileName);
      setIsNavigating(false);
      
      setConsoleOutput(prev => [...prev, {
        type: 'info',
        message: `📂 Opened ${fileName} • File loaded successfully`,
        timestamp: Date.now()
      }]);
    }, 100);
  }, [isNavigating, files]);

  // Cleanup navigation timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-6">
          {/* Animated Logo with Glow Effect */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mx-auto opacity-20 animate-ping"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Android Studio</h2>
          <p className="text-lg text-gray-600 mb-6">{loadingMessage}</p>
          
          {/* Enhanced Progress Bar */}
          <div className="w-96 h-3 bg-gray-200 rounded-full mx-auto overflow-hidden shadow-inner mb-2">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${loadingProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 mb-6 w-96 mx-auto">
            <span>0%</span>
            <span className="font-bold text-blue-600">{loadingProgress}%</span>
            <span>100%</span>
          </div>

          {/* Loading Features */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>📱 Loading Android SDK...</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>⚡ Initializing code editor...</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span>🚀 Setting up emulator...</span>
            </div>
          </div>

          {/* Loading Animation Dots */}
          <div className="mt-8 flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={`h-screen bg-white text-gray-900 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Header with Navigation */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackNavigation}
                disabled={isNavigating}
                className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">← Back to Codex Playground</span>
              </button>
              
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              
              <div>
                <h1 className="text-xl font-bold">Android Studio</h1>
                <p className="text-xs text-green-100">Professional Android Development</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isNavigating && (
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              )}
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className={`${sidebarCollapsed ? 'w-12' : 'w-64'} bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300`}>
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && <h3 className="font-medium">Project Files</h3>}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>
            </div>
            
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-y-auto">
                {Object.keys(files).map(fileName => (
                  <div
                    key={fileName}
                    className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                      activeFile === fileName ? 'bg-green-100 border-r-2 border-green-500' : ''
                    } ${isNavigating ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => handleFileSelect(fileName)}
                  >
                    <span className="mr-2">
                      {fileName.endsWith('.java') ? '☕' : 
                       fileName.endsWith('.xml') ? '📄' : 
                       fileName.endsWith('.kt') ? '🟣' : '📄'}
                    </span>
                    <span className="text-sm">{fileName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Editor Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>
                    {activeFile.endsWith('.java') ? '☕' : 
                     activeFile.endsWith('.xml') ? '📄' : '🟣'}
                  </span>
                  <span className="font-medium">{activeFile}</span>
                  {isNavigating && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                  
                  {/* Real-time indicator */}
                  <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 font-medium">Live Editing</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // Force refresh all components
                      setConsoleOutput(prev => [...prev, {
                        type: 'info',
                        message: '🔄 Force refreshing preview and analyzer...',
                        timestamp: Date.now()
                      }]);
                      
                      if (showPreview) {
                        setShowPreview(false);
                        setTimeout(() => setShowPreview(true), 100);
                      }
                      if (showAnalyzer) {
                        setShowAnalyzer(false);
                        setTimeout(() => setShowAnalyzer(true), 100);
                      }
                    }}
                    disabled={isNavigating}
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={16} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={() => navigateToView('preview', { callback: () => setShowPreview(true) })}
                    disabled={isNavigating}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    <Eye size={16} />
                    <span>Preview</span>
                  </button>
                  
                  <button
                    onClick={() => navigateToView('analyzer', { callback: () => setShowAnalyzer(true) })}
                    disabled={isNavigating}
                    className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    <Brain size={16} />
                    <span>Analyze</span>
                  </button>

                  <button
                    onClick={() => setConsoleMinimized(!consoleMinimized)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                      consoleMinimized 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                    title={consoleMinimized ? "Show Console" : "Hide Console"}
                  >
                    <Terminal size={16} />
                    <span>{consoleMinimized ? 'Show' : 'Hide'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 relative">
              {isNavigating && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <LoadingFallback message="Loading editor..." />
                </div>
              )}
              
              <Suspense fallback={<LoadingFallback message="Loading Monaco Editor..." />}>
                <Editor
                  height="100%"
                  language={files[activeFile]?.language || 'java'}
                  value={files[activeFile]?.content || ''}
                  theme="light"
                  onChange={(value) => handleCodeChange(value, activeFile)}
                  onMount={handleEditorDidMount}
                  loading={<LoadingFallback message="Initializing editor..." />}
                  options={{
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                    minimap: { enabled: true },
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    bracketPairColorization: { enabled: true },
                    suggest: { showKeywords: true, showSnippets: true },
                    quickSuggestions: true,
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </Suspense>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/3 bg-gray-100 border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Android Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              {/* Remove padding to allow perfect centering */}
              <div className="flex-1 flex items-center justify-center">
                <Suspense fallback={<LoadingFallback message="Loading preview..." />}>
                  <AndroidPreview 
                    key={`preview-${activeFile}-${files[activeFile]?.lastModified || Date.now()}`}
                    files={files} 
                    activeFile={activeFile} 
                  />
                </Suspense>
              </div>
            </div>
          )}

          {/* Analyzer Panel */}
          {showAnalyzer && (
            <div className="w-1/3 bg-gray-100 border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Code Analyzer</h3>
                  <button
                    onClick={() => setShowAnalyzer(false)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <Suspense fallback={<LoadingFallback message="Loading analyzer..." />}>
                  <CodeAnalyzer 
                    key={`analyzer-${activeFile}-${files[activeFile]?.lastModified || Date.now()}`}
                    files={files} 
                    activeFile={activeFile} 
                  />
                </Suspense>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Console with Minimize/Maximize */}
        <div className={`${consoleMinimized ? 'h-12' : 'h-48'} bg-gray-900 text-white flex flex-col transition-all duration-300 border-t border-gray-700`}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center space-x-3">
              <Terminal size={16} className="text-blue-400" />
              <span className="font-medium">Console</span>
              {isEditorReady && (
                <div className="flex items-center space-x-1 text-xs bg-green-900/50 px-2 py-1 rounded-full">
                  <CheckCircle size={12} className="text-green-400" />
                  <span className="text-green-300">Ready</span>
                </div>
              )}
              <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {consoleOutput.length} messages
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConsoleMinimized(!consoleMinimized)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
                title={consoleMinimized ? "Maximize Console" : "Minimize Console"}
              >
                {consoleMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={() => setConsoleOutput([])}
                className="text-sm text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
          
          {!consoleMinimized && (
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-950">
              {consoleOutput.length === 0 ? (
                <div className="text-gray-500 italic text-center py-8">
                  Console is empty. Code changes and system messages will appear here.
                </div>
              ) : (
                consoleOutput.map((output, index) => (
                  <div key={index} className={`mb-2 p-2 rounded border-l-4 ${
                    output.type === 'error' ? 'text-red-300 bg-red-900/20 border-red-500' :
                    output.type === 'success' ? 'text-green-300 bg-green-900/20 border-green-500' :
                    output.type === 'warning' ? 'text-yellow-300 bg-yellow-900/20 border-yellow-500' :
                    output.type === 'info' ? 'text-blue-300 bg-blue-900/20 border-blue-500' :
                    'text-gray-300 bg-gray-800/50 border-gray-600'
                  }`}>
                    <div className="flex items-start justify-between">
                      <span className="flex-1">{output.message}</span>
                      <span className="text-xs opacity-60 ml-2 whitespace-nowrap">
                        {new Date(output.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {consoleMinimized && (
            <div className="flex-1 flex items-center px-4 bg-gray-950">
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Console minimized</span>
                {consoleOutput.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span>Latest:</span>
                    <span className={`${
                      consoleOutput[consoleOutput.length - 1]?.type === 'error' ? 'text-red-400' :
                      consoleOutput[consoleOutput.length - 1]?.type === 'success' ? 'text-green-400' :
                      consoleOutput[consoleOutput.length - 1]?.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {consoleOutput[consoleOutput.length - 1]?.message.substring(0, 50)}...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AndroidStudioFixed;