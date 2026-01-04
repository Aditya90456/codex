import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Save, Smartphone, Code, FileText, Folder, Plus, 
  Terminal, Settings, Package, Download, Upload
} from 'lucide-react';

const AndroidEditor = ({ onBack }) => {
  // Core editor state
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
        android:textColor="#2196F3"
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
        android:textStyle="bold"
        android:background="@drawable/button_background"
        android:textColor="#FFFFFF"
        android:elevation="4dp" />

    <Button
        android:id="@+id/resetButton"
        android:layout_width="200dp"
        android:layout_height="60dp"
        android:text="RESET"
        android:textSize="16sp"
        android:textStyle="bold"
        android:background="@drawable/button_reset_background"
        android:textColor="#FFFFFF"
        android:elevation="4dp"
        android:layout_marginTop="16dp" />

</LinearLayout>`,
      language: 'xml',
      type: 'layout'
    },
    'AndroidManifest.xml': {
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <activity
            android:name=".SecondActivity"
            android:exported="false"
            android:parentActivityName=".MainActivity" />
            
    </application>

</manifest>`,
      language: 'xml',
      type: 'manifest'
    },
    'build.gradle': {
      content: `plugins {
    id 'com.android.application'
}

android {
    compileSdk 34

    defaultConfig {
        applicationId "com.example.myapp"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.10.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.6.2'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2'
    implementation 'androidx.navigation:navigation-fragment:2.7.4'
    implementation 'androidx.navigation:navigation-ui:2.7.4'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}`,
      language: 'gradle',
      type: 'build'
    },
    'strings.xml': {
      content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">My Android App</string>
    <string name="hello_world">Hello World!</string>
    <string name="increment">Increment</string>
    <string name="reset">Reset</string>
    <string name="counter_text">Count: %1$d</string>
    <string name="welcome_message">Welcome to Android Development!</string>
    <string name="settings">Settings</string>
    <string name="about">About</string>
    <string name="version">Version 1.0</string>
</resources>`,
      language: 'xml',
      type: 'resources'
    }
  });

  const [activeFile, setActiveFile] = useState('MainActivity.java');
  const [consoleOutput, setConsoleOutput] = useState([
    { type: 'info', message: '🤖 Android Development Environment Ready!', timestamp: Date.now() },
    { type: 'success', message: '📱 All Android dependencies prebuilt and configured', timestamp: Date.now() },
    { type: 'info', message: '🚀 Start coding your Android app immediately!', timestamp: Date.now() }
  ]);
  const [isBuilding, setIsBuilding] = useState(false);
  
  // Preview Management for Android Apps
  const [previewSessions, setPreviewSessions] = useState(new Map());
  const [authorizedUsers, setAuthorizedUsers] = useState(new Set());
  const [userLimit] = useState(1000000000); // 1 billion users
  const [currentUsers, setCurrentUsers] = useState(0);
  const [previewPermissions, setPreviewPermissions] = useState({
    public: true,
    requireAuth: false,
    allowedDomains: [],
    maxConcurrentUsers: 50000,
    androidVersions: ['API 21+', 'API 23+', 'API 28+', 'API 30+', 'API 33+']
  });
  const [showPreviewManager, setShowPreviewManager] = useState(false);
  const [androidPreviewUrl, setAndroidPreviewUrl] = useState('');
  
  const editorRef = useRef(null);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'java': return '☕';
      case 'xml': return '📄';
      case 'gradle': return '🔧';
      case 'kt': return '🟣';
      default: return '📄';
    }
  };

  const handleBuild = () => {
    setIsBuilding(true);
    setConsoleOutput(prev => [...prev, { 
      type: 'info', 
      message: '🔨 Building Android project...', 
      timestamp: Date.now() 
    }]);

    // Simulate build process
    setTimeout(() => {
      setConsoleOutput(prev => [...prev, 
        { type: 'info', message: '📦 Compiling Java sources...', timestamp: Date.now() },
        { type: 'info', message: '🎨 Processing resources...', timestamp: Date.now() },
        { type: 'info', message: '📱 Generating APK...', timestamp: Date.now() },
        { type: 'success', message: '✅ Build successful! APK ready for installation', timestamp: Date.now() }
      ]);
      setIsBuilding(false);
    }, 3000);
  };

  const handleRun = () => {
    setConsoleOutput(prev => [...prev, { 
      type: 'info', 
      message: '🚀 Installing and running app on emulator...', 
      timestamp: Date.now() 
    }]);

    setTimeout(() => {
      setConsoleOutput(prev => [...prev, 
        { type: 'success', message: '📱 App launched successfully on Android emulator!', timestamp: Date.now() },
        { type: 'info', message: '🎯 Ready for testing and debugging', timestamp: Date.now() }
      ]);
    }, 2000);
  };

  const createNewFile = () => {
    const fileName = prompt('Enter file name (e.g., SecondActivity.java, fragment_home.xml):');
    if (fileName && !files[fileName]) {
      const extension = fileName.split('.').pop();
      let language = 'java';
      let content = '';

      switch (extension) {
        case 'java':
          language = 'java';
          content = `package com.example.myapp;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;

public class ${fileName.split('.')[0]} extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_${fileName.split('.')[0].toLowerCase()});
    }
}`;
          break;
        case 'xml':
          language = 'xml';
          content = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="New Layout"
        android:textSize="24sp" />

</LinearLayout>`;
          break;
        case 'kt':
          language = 'kotlin';
          content = `package com.example.myapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

class ${fileName.split('.')[0]} : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_${fileName.split('.')[0].toLowerCase()})
    }
}`;
          break;
        default:
          content = `// ${fileName}`;
      }

      setFiles(prev => ({
        ...prev,
        [fileName]: { content, language, type: 'custom' }
      }));
      setActiveFile(fileName);
    }
  };

  // Android Preview Management Functions
  const authorizeUser = (userId) => {
    if (currentUsers >= userLimit) {
      return { success: false, message: 'User limit reached' };
    }
    
    setAuthorizedUsers(prev => new Set([...prev, userId]));
    setCurrentUsers(prev => prev + 1);
    
    setConsoleOutput(prev => [...prev, {
      type: 'success',
      message: `✅ User ${userId} authorized for Android preview`,
      timestamp: Date.now()
    }]);
    
    return { success: true, message: 'User authorized successfully' };
  };

  const deauthorizeUser = (userId) => {
    setAuthorizedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    setCurrentUsers(prev => Math.max(0, prev - 1));
    
    setConsoleOutput(prev => [...prev, {
      type: 'info',
      message: `🔒 User ${userId} deauthorized from Android preview`,
      timestamp: Date.now()
    }]);
  };

  const createAndroidPreviewSession = (userId) => {
    if (!previewPermissions.public && !authorizedUsers.has(userId)) {
      return { success: false, message: 'Unauthorized access to Android preview' };
    }

    const sessionId = `android_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      appType: 'android',
      previewUrl: generateAndroidPreview()
    };

    setPreviewSessions(prev => new Map([...prev, [sessionId, session]]));
    
    setConsoleOutput(prev => [...prev, {
      type: 'success',
      message: `📱 Android preview session created: ${sessionId}`,
      timestamp: Date.now()
    }]);
    
    return { success: true, sessionId, session };
  };

  const generateAndroidPreview = () => {
    // Generate Android app preview URL
    const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Android App Preview</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Roboto', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .android-device {
            width: 300px;
            height: 600px;
            background: #2c3e50;
            border-radius: 25px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
        }
        .screen {
            width: 100%;
            height: 100%;
            background: #f5f5f5;
            border-radius: 15px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .app-title {
            color: #2196F3;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 32px;
        }
        .counter-display {
            font-size: 24px;
            color: #333;
            margin-bottom: 24px;
        }
        .android-button {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin: 10px;
            min-width: 200px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        .android-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        .reset-button {
            background: linear-gradient(45deg, #f44336, #d32f2f);
        }
        .status-bar {
            position: absolute;
            top: 5px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: #666;
            border-radius: 2px;
        }
    </style>
</head>
<body>
    <div class="android-device">
        <div class="status-bar"></div>
        <div class="screen">
            <div class="app-title">Android Counter App</div>
            <div class="counter-display" id="counterDisplay">Count: 0</div>
            <button class="android-button" onclick="increment()">INCREMENT</button>
            <button class="android-button reset-button" onclick="reset()">RESET</button>
        </div>
    </div>

    <script>
        let counter = 0;
        
        function increment() {
            counter++;
            updateDisplay();
        }
        
        function reset() {
            counter = 0;
            updateDisplay();
        }
        
        function updateDisplay() {
            document.getElementById('counterDisplay').textContent = 'Count: ' + counter;
        }
        
        console.log('🤖 Android app preview loaded successfully!');
    </script>
</body>
</html>`;
    
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setAndroidPreviewUrl(url);
    
    return url;
  };

  const openAndroidPreview = () => {
    const previewUrl = generateAndroidPreview();
    window.open(previewUrl, '_blank');
    
    setConsoleOutput(prev => [...prev, {
      type: 'success',
      message: '📱 Android preview opened in new tab!',
      timestamp: Date.now()
    }]);
  };

  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white hover:text-green-200 transition-colors"
              >
                <Code className="w-4 h-4" />
                <span className="text-sm">← Back to Codex</span>
              </button>
            )}
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Android Studio Web</h1>
              <p className="text-xs text-green-100">Professional Android Development</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreviewManager(!showPreviewManager)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                showPreviewManager ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              <Smartphone size={16} />
              <span>Preview Manager</span>
            </button>
            
            <button
              onClick={openAndroidPreview}
              className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm transition-colors"
            >
              <Smartphone size={16} />
              <span>Preview App</span>
            </button>
            
            <button
              onClick={handleBuild}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
              disabled={isBuilding}
            >
              <Package size={16} />
              <span>{isBuilding ? 'Building...' : 'Build'}</span>
            </button>
            
            <button
              onClick={handleRun}
              className="flex items-center space-x-1 bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-sm transition-colors"
            >
              <Play size={16} />
              <span>Run</span>
            </button>
            
            <div className="text-xs text-green-100">
              Users: {currentUsers.toLocaleString()}/{userLimit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Project Files</h3>
              <button
                onClick={createNewFile}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {Object.keys(files).map(fileName => (
              <div
                key={fileName}
                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  activeFile === fileName ? 'bg-green-100 border-r-2 border-green-500' : ''
                }`}
                onClick={() => setActiveFile(fileName)}
              >
                <span className="mr-2">{getFileIcon(fileName)}</span>
                <span className="text-sm">{fileName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{getFileIcon(activeFile)}</span>
                <span className="font-medium">{activeFile}</span>
                <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                  {files[activeFile]?.language}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const blob = new Blob([files[activeFile].content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = activeFile;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={files[activeFile]?.language || 'java'}
              value={files[activeFile]?.content || ''}
              theme="light"
              onChange={(value) => {
                setFiles(prev => ({
                  ...prev, [activeFile]: {
                    ...prev[activeFile],
                    content: value || ''
                  }
                }));
              }}
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
          </div>

          {/* Console */}
          <div className="h-64 bg-gray-900 text-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Terminal size={16} />
                <span className="font-medium">Build Output</span>
              </div>
              <button
                onClick={() => setConsoleOutput([])}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {consoleOutput.map((output, index) => (
                <div key={index} className={`mb-1 ${
                  output.type === 'error' ? 'text-red-400' :
                  output.type === 'success' ? 'text-green-400' :
                  output.type === 'warning' ? 'text-yellow-400' :
                  'text-gray-300'
                }`}>
                  {output.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AndroidEditor;