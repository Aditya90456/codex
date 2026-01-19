import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Save, Smartphone, Code, FileText, Folder, Terminal, 
  Settings, Download, X, RefreshCw, Maximize2, Minimize2, Moon, Sun
} from 'lucide-react';

const AndroidEditorModern = ({ onBack }) => {
  const [files, setFiles] = useState({
    'MainActivity.java': {
      content: `package com.example.myapp;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private int counter = 0;
    private TextView counterText;
    private Button incrementButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        counterText = findViewById(R.id.counterText);
        incrementButton = findViewById(R.id.incrementButton);

        incrementButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                counter++;
                updateCounterText();
            }
        });

        updateCounterText();
    }

    private void updateCounterText() {
        counterText.setText("Count: " + counter);
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
    android:padding="16dp"
    android:background="#F5F5F5">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Android Counter App"
        android:textSize="28sp"
        android:textStyle="bold"
        android:textColor="#4CAF50"
        android:layout_marginBottom="32dp" />

    <TextView
        android:id="@+id/counterText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Count: 0"
        android:textSize="24sp"
        android:textColor="#333333"
        android:layout_marginBottom="24dp" />

    <Button
        android:id="@+id/incrementButton"
        android:layout_width="200dp"
        android:layout_height="60dp"
        android:text="INCREMENT"
        android:textSize="16sp"
        android:background="#4CAF50"
        android:textColor="#FFFFFF" />
</LinearLayout>`,
      language: 'xml',
      type: 'layout'
    }
  });

  const [activeFile, setActiveFile] = useState('MainActivity.java');
  const [theme, setTheme] = useState('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const editorRef = useRef(null);

  const isDark = theme === 'vs-dark';

  const buildApp = () => {
    setIsBuilding(true);
    setShowConsole(true);
    setConsoleOutput([
      { type: 'info', text: '🔨 Building Android App...', time: new Date().toLocaleTimeString() },
      { type: 'info', text: '📦 Compiling Java files...', time: new Date().toLocaleTimeString() },
      { type: 'info', text: '🎨 Processing resources...', time: new Date().toLocaleTimeString() },
      { type: 'success', text: '✅ Build successful!', time: new Date().toLocaleTimeString() },
      { type: 'info', text: '📱 APK generated: app-debug.apk', time: new Date().toLocaleTimeString() }
    ]);
    
    setTimeout(() => {
      setIsBuilding(false);
    }, 2000);
  };

  const saveFile = () => {
    const blob = new Blob([files[activeFile].content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = activeFile;
    link.click();
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-6 py-3 ${isFullscreen ? '' : 'mt-16'}`}>
        <div className="flex items-center justify-between">
          {/* Left - File Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Android Studio</h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mobile Development</p>
              </div>
            </div>

            <div className={`h-8 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

            <select
              value={activeFile}
              onChange={(e) => setActiveFile(e.target.value)}
              className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg px-4 py-2 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              {Object.keys(files).map(fileName => (
                <option key={fileName} value={fileName}>
                  {files[fileName].type === 'activity' ? '☕' : '📄'} {fileName}
                </option>
              ))}
            </select>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg px-4 py-2 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <option value="vs-dark">🌙 Dark</option>
              <option value="light">☀️ Light</option>
            </select>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={buildApp}
              disabled={isBuilding}
              className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition-all ${
                isBuilding 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              } text-white shadow-lg hover:shadow-xl`}
            >
              <Play className="w-4 h-4" />
              <span>{isBuilding ? 'Building...' : 'Build & Run'}</span>
            </button>

            <div className={`h-8 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'} mx-2`}></div>

            <button
              onClick={saveFile}
              className={`p-2.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Save File"
            >
              <Save className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2.5 rounded-lg transition-all ${showPreview ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Toggle Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`p-2.5 rounded-lg transition-all ${showConsole ? 'bg-blue-500 text-white' : isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Toggle Console"
            >
              <Terminal className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={files[activeFile].language}
              value={files[activeFile].content}
              onChange={(value) => {
                setFiles(prev => ({
                  ...prev,
                  [activeFile]: { ...prev[activeFile], content: value || '' }
                }));
              }}
              theme={theme}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                folding: true,
                bracketPairColorization: { enabled: true },
                padding: { top: 16, bottom: 16 }
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className={`w-1/2 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-l flex flex-col`}>
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-sm">Device Preview</span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative">
                {/* Phone Frame */}
                <div className={`w-80 h-[600px] rounded-[3rem] ${isDark ? 'bg-gray-800' : 'bg-gray-200'} p-3 shadow-2xl`}>
                  <div className={`w-full h-full rounded-[2.5rem] ${isDark ? 'bg-gray-900' : 'bg-white'} overflow-hidden flex flex-col`}>
                    {/* Status Bar */}
                    <div className={`h-8 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-between px-4`}>
                      <span className="text-xs">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-3 border border-current rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                      <h1 className="text-2xl font-bold text-green-600 mb-8">Android Counter App</h1>
                      <div className="text-xl mb-6 text-gray-800 dark:text-gray-200">Count: 0</div>
                      <button className="w-48 h-14 bg-green-500 text-white rounded-lg font-bold text-sm shadow-lg hover:bg-green-600 transition-all">
                        INCREMENT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Device Label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  Pixel 6 Pro
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Console */}
      {showConsole && (
        <div className={`h-48 ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-t flex flex-col`}>
          <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border-b px-4 py-2 flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-sm">Build Output</span>
              {consoleOutput.length > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  {consoleOutput.length}
                </span>
              )}
            </div>
            <button
              onClick={clearConsole}
              className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
              title="Clear Console"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
            {consoleOutput.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Terminal className={`w-12 h-12 mb-2 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Build output will appear here
                </div>
              </div>
            ) : (
              consoleOutput.map((log, index) => (
                <div key={index} className={`flex items-start space-x-2 ${
                  log.type === 'error' ? 'text-red-500' :
                  log.type === 'success' ? 'text-green-500' :
                  log.type === 'warning' ? 'text-yellow-500' :
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AndroidEditorModern;
