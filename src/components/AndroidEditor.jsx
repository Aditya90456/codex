import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Save, Smartphone, Code, FileText, Folder, Plus, 
  Terminal, Settings, Package, Download, Upload, X, RefreshCw, Globe
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
  const [isRunning, setIsRunning] = useState(false);
  const [appStatus, setAppStatus] = useState('stopped'); // stopped, building, installing, running
  const [buildProgress, setBuildProgress] = useState(0);
  
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
  const [showAndroidPreview, setShowAndroidPreview] = useState(false);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const [codeChangeDetected, setCodeChangeDetected] = useState(false);
  const [lastCodeChange, setLastCodeChange] = useState(Date.now());
  // Dynamic User Management System for 1B+ users
  const [realTimeUsers, setRealTimeUsers] = useState(new Map());
  const [userActivity, setUserActivity] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    peakUsers: 0,
    sessionsToday: 0,
    appsBuilt: 0,
    codeLines: 0
  });
  const [userSimulation, setUserSimulation] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms
  const [userRegions, setUserRegions] = useState(new Map());
  const [deviceTypes, setDeviceTypes] = useState(new Map());
  
  // User generation and activity simulation
  useEffect(() => {
    if (!userSimulation) return;

    const interval = setInterval(() => {
      // Generate random user activity
      const activities = [
        'joined the platform',
        'started coding',
        'built an app',
        'ran tests',
        'deployed project',
        'shared code',
        'created new file',
        'fixed bug',
        'added feature',
        'optimized code'
      ];

      const regions = ['US', 'EU', 'ASIA', 'LATAM', 'AFRICA', 'OCEANIA'];
      const devices = ['Mobile', 'Desktop', 'Tablet'];
      
      // Simulate user joining
      if (Math.random() > 0.3) {
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const region = regions[Math.floor(Math.random() * regions.length)];
        const device = devices[Math.floor(Math.random() * devices.length)];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        const newUser = {
          id: userId,
          joinedAt: Date.now(),
          region,
          device,
          activity,
          isActive: true,
          sessionDuration: 0,
          appsBuilt: Math.floor(Math.random() * 5),
          linesOfCode: Math.floor(Math.random() * 1000)
        };

        setRealTimeUsers(prev => {
          const updated = new Map(prev);
          updated.set(userId, newUser);
          
          // Keep only last 1000 users for performance
          if (updated.size > 1000) {
            const firstKey = updated.keys().next().value;
            updated.delete(firstKey);
          }
          
          return updated;
        });

        // Update region stats
        setUserRegions(prev => {
          const updated = new Map(prev);
          updated.set(region, (updated.get(region) || 0) + 1);
          return updated;
        });

        // Update device stats
        setDeviceTypes(prev => {
          const updated = new Map(prev);
          updated.set(device, (updated.get(device) || 0) + 1);
          return updated;
        });

        // Add to activity feed
        setUserActivity(prev => {
          const newActivity = {
            id: Date.now(),
            userId,
            action: activity,
            region,
            device,
            timestamp: Date.now()
          };
          
          const updated = [newActivity, ...prev.slice(0, 49)]; // Keep last 50 activities
          return updated;
        });

        // Update global stats
        setGlobalStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers + 1,
          activeUsers: Math.min(prev.activeUsers + 1, 1000000000),
          peakUsers: Math.max(prev.peakUsers, prev.activeUsers + 1),
          sessionsToday: prev.sessionsToday + 1,
          appsBuilt: prev.appsBuilt + (activity === 'built an app' ? 1 : 0),
          codeLines: prev.codeLines + newUser.linesOfCode
        }));
      }

      // Simulate user leaving (30% chance)
      if (Math.random() > 0.7 && realTimeUsers.size > 0) {
        const userIds = Array.from(realTimeUsers.keys());
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
        
        setRealTimeUsers(prev => {
          const updated = new Map(prev);
          updated.delete(randomUserId);
          return updated;
        });

        setGlobalStats(prev => ({
          ...prev,
          activeUsers: Math.max(0, prev.activeUsers - 1)
        }));
      }

    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [userSimulation, simulationSpeed, realTimeUsers.size]);

  // Auto-authorize users based on activity
  useEffect(() => {
    const newUsers = Array.from(realTimeUsers.values())
      .filter(user => !authorizedUsers.has(user.id) && user.appsBuilt > 0);
    
    newUsers.forEach(user => {
      if (Math.random() > 0.5) { // 50% chance to auto-authorize active users
        authorizeUser(user.id);
      }
    });
  }, [realTimeUsers, authorizedUsers]);

  const [autoPreview, setAutoPreview] = useState(true);
  
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
    setAppStatus('building');
    setBuildProgress(0);
    setConsoleOutput(prev => [...prev, { 
      type: 'info', 
      message: '🔨 Building Android project...', 
      timestamp: Date.now() 
    }]);

    // Simulate build process with progress
    const buildSteps = [
      { progress: 20, message: '📦 Compiling Java sources...' },
      { progress: 40, message: '🎨 Processing resources...' },
      { progress: 60, message: '📱 Generating DEX files...' },
      { progress: 80, message: '🔧 Packaging APK...' },
      { progress: 100, message: '✅ Build successful! APK ready for installation' }
    ];

    buildSteps.forEach((step, index) => {
      setTimeout(() => {
        setBuildProgress(step.progress);
        setConsoleOutput(prev => [...prev, { 
          type: step.progress === 100 ? 'success' : 'info', 
          message: step.message, 
          timestamp: Date.now() 
        }]);
        
        if (step.progress === 100) {
          setIsBuilding(false);
          setAppStatus('built');
        }
      }, (index + 1) * 600);
    });
  };

  const handleRun = () => {
    if (appStatus === 'running') {
      // Stop the app
      setIsRunning(false);
      setAppStatus('stopped');
      setConsoleOutput(prev => [...prev, { 
        type: 'warning', 
        message: '⏹️ Stopping Android application...', 
        timestamp: Date.now() 
      }]);
      
      setTimeout(() => {
        setConsoleOutput(prev => [...prev, { 
          type: 'info', 
          message: '📱 Application stopped successfully', 
          timestamp: Date.now() 
        }]);
      }, 1000);
      return;
    }

    setIsRunning(true);
    setAppStatus('installing');
    setConsoleOutput(prev => [...prev, { 
      type: 'info', 
      message: '🚀 Installing and running app on emulator...', 
      timestamp: Date.now() 
    }]);

    // Simulate installation and launch process
    const runSteps = [
      { status: 'installing', message: '📲 Installing APK on Android emulator...' },
      { status: 'launching', message: '🎯 Launching application...' },
      { status: 'running', message: '📱 App launched successfully on Android emulator!' },
      { status: 'running', message: '🎮 Ready for testing and debugging' },
      { status: 'running', message: '📊 Performance monitoring active' }
    ];

    runSteps.forEach((step, index) => {
      setTimeout(() => {
        setAppStatus(step.status);
        setConsoleOutput(prev => [...prev, { 
          type: step.status === 'running' ? 'success' : 'info', 
          message: step.message, 
          timestamp: Date.now() 
        }]);
        
        if (step.status === 'running' && index === runSteps.length - 1) {
          // Auto-generate preview when app is running
          setTimeout(() => {
            generateAndroidPreview();
          }, 500);
        }
      }, (index + 1) * 800);
    });
  };

  // Handle code changes with live preview
  const handleCodeChange = (value, fileName) => {
    setFiles(prev => ({
      ...prev, 
      [fileName]: {
        ...prev[fileName],
        content: value || ''
      }
    }));
    
    setCodeChangeDetected(true);
    setLastCodeChange(Date.now());
    
    // Show code change feedback
    setConsoleOutput(prev => [...prev, {
      type: 'info',
      message: `📝 Code changed in ${fileName}`,
      timestamp: Date.now()
    }]);
    
    // Auto-update preview if enabled
    if (autoPreview && showAndroidPreview) {
      setTimeout(() => {
        generateAndroidPreview();
        setCodeChangeDetected(false);
      }, 1500); // Debounce preview updates
    }
  };

  // Detect specific code patterns and provide smart suggestions
  const analyzeCodeChanges = (content, fileName) => {
    const suggestions = [];
    
    if (fileName.endsWith('.java')) {
      // Java-specific analysis
      if (content.includes('Button') && !content.includes('setOnClickListener')) {
        suggestions.push({
          type: 'suggestion',
          message: '💡 Tip: Add setOnClickListener to make your button interactive'
        });
      }
      
      if (content.includes('TextView') && !content.includes('setText')) {
        suggestions.push({
          type: 'suggestion',
          message: '💡 Tip: Use setText() to update TextView content dynamically'
        });
      }
      
      if (content.includes('findViewById') && !content.includes('R.id.')) {
        suggestions.push({
          type: 'warning',
          message: '⚠️ Make sure your findViewById references match XML IDs'
        });
      }
    }
    
    if (fileName.endsWith('.xml')) {
      // XML-specific analysis
      if (content.includes('android:id="@+id/') && content.includes('Button')) {
        suggestions.push({
          type: 'success',
          message: '✅ Button with ID detected - ready for Java interaction'
        });
      }
      
      if (content.includes('LinearLayout') && !content.includes('android:orientation')) {
        suggestions.push({
          type: 'warning',
          message: '⚠️ LinearLayout should specify android:orientation'
        });
      }
    }
    
    // Add suggestions to console
    suggestions.forEach(suggestion => {
      setConsoleOutput(prev => [...prev, {
        type: suggestion.type,
        message: suggestion.message,
        timestamp: Date.now()
      }]);
    });
  };

  const createNewFile = () => {
    // Generate automatic file name based on existing files
    const existingJavaFiles = Object.keys(files).filter(name => name.endsWith('.java')).length;
    const existingXmlFiles = Object.keys(files).filter(name => name.endsWith('.xml')).length;
    
    let fileName, language, content;
    
    // Alternate between Java and XML files
    if (existingJavaFiles <= existingXmlFiles) {
      fileName = `NewActivity${existingJavaFiles + 1}.java`;
      language = 'java';
      content = `package com.example.myapp;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;

public class NewActivity${existingJavaFiles + 1} extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new${existingJavaFiles + 1});
    }
}`;
    } else {
      fileName = `activity_new${existingXmlFiles + 1}.xml`;
      language = 'xml';
      content = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:gravity="center">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="New Activity ${existingXmlFiles + 1}"
        android:textSize="24sp"
        android:textColor="#333333" />

</LinearLayout>`;
    }

    if (!files[fileName]) {
      setFiles(prev => ({
        ...prev,
        [fileName]: { content, language, type: 'custom' }
      }));
      setActiveFile(fileName);
      
      setConsoleOutput(prev => [...prev, {
        type: 'success',
        message: `📄 Created new file: ${fileName}`,
        timestamp: Date.now()
      }]);
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
    // Generate Android app preview URL based on current code
    const javaFile = files['MainActivity.java'];
    const xmlFile = files['activity_main.xml'];
    
    // Analyze code to extract dynamic elements
    let buttonText = 'INCREMENT';
    let titleText = 'Android Counter App';
    let backgroundColor = '#F5F5F5';
    let buttonColor = '#4CAF50';
    
    // Parse XML for custom values
    if (xmlFile && xmlFile.content) {
      const xmlContent = xmlFile.content;
      
      // Extract button text
      const buttonTextMatch = xmlContent.match(/android:text="([^"]*)".*incrementButton/s);
      if (buttonTextMatch) buttonText = buttonTextMatch[1];
      
      // Extract title text
      const titleMatch = xmlContent.match(/android:text="([^"]*)".*title/s);
      if (titleMatch) titleText = titleMatch[1];
      
      // Extract background color
      const bgMatch = xmlContent.match(/android:background="([^"]*)"/);
      if (bgMatch && bgMatch[1].startsWith('#')) backgroundColor = bgMatch[1];
    }
    
    // Parse Java for dynamic behavior
    let counterLogic = 'counter++';
    if (javaFile && javaFile.content) {
      const javaContent = javaFile.content;
      
      // Check for custom increment logic
      if (javaContent.includes('counter += 2')) counterLogic = 'counter += 2';
      if (javaContent.includes('counter += 5')) counterLogic = 'counter += 5';
      if (javaContent.includes('counter *= 2')) counterLogic = 'counter *= 2';
    }
    
    // Enhanced preview HTML with dynamic content
    const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Android App Preview - ${titleText}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .android-device {
            width: 320px;
            height: 640px;
            background: linear-gradient(145deg, #2c3e50, #34495e);
            border-radius: 30px;
            padding: 25px 15px;
            box-shadow: 
                0 20px 40px rgba(0,0,0,0.3),
                inset 0 2px 4px rgba(255,255,255,0.1);
            position: relative;
            overflow: hidden;
        }
        
        .device-frame {
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: 20px;
            padding: 8px;
            position: relative;
        }
        
        .screen {
            width: 100%;
            height: 100%;
            background: ${backgroundColor};
            border-radius: 15px;
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .status-bar {
            height: 24px;
            background: linear-gradient(90deg, #2196F3, #1976D2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 12px;
            font-size: 12px;
            color: white;
            font-weight: 500;
        }
        
        .app-content {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: ${backgroundColor};
        }
        
        .app-title {
            color: #2196F3;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            animation: titleGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes titleGlow {
            from { text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
            to { text-shadow: 0 1px 10px rgba(33, 150, 243, 0.3); }
        }
        
        .counter-display {
            font-size: 28px;
            color: #333;
            margin-bottom: 30px;
            font-weight: 600;
            background: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 2px solid #E3F2FD;
            transition: all 0.3s ease;
        }
        
        .android-button {
            background: linear-gradient(145deg, ${buttonColor}, ${buttonColor}dd);
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin: 8px;
            min-width: 180px;
            box-shadow: 
                0 4px 12px rgba(76, 175, 80, 0.3),
                0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .android-button:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 6px 16px rgba(76, 175, 80, 0.4),
                0 4px 8px rgba(0,0,0,0.15);
        }
        
        .android-button:active {
            transform: translateY(0);
            box-shadow: 
                0 2px 8px rgba(76, 175, 80, 0.3),
                0 1px 2px rgba(0,0,0,0.1);
        }
        
        .reset-button {
            background: linear-gradient(145deg, #f44336, #d32f2f);
            box-shadow: 
                0 4px 12px rgba(244, 67, 54, 0.3),
                0 2px 4px rgba(0,0,0,0.1);
        }
        
        .reset-button:hover {
            box-shadow: 
                0 6px 16px rgba(244, 67, 54, 0.4),
                0 4px 8px rgba(0,0,0,0.15);
        }
        
        .navigation-bar {
            height: 48px;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .nav-indicator {
            width: 134px;
            height: 5px;
            background: #fff;
            border-radius: 3px;
        }
        
        .device-speaker {
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 4px;
            background: #555;
            border-radius: 2px;
        }
        
        .device-camera {
            position: absolute;
            top: 6px;
            right: 20px;
            width: 8px;
            height: 8px;
            background: #333;
            border-radius: 50%;
        }
        
        .loading-animation {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 4px solid #E3F2FD;
            border-top: 4px solid #2196F3;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .success-animation {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            opacity: 0;
            pointer-events: none;
            z-index: 1000;
        }
        
        .animate-success {
            animation: successPop 0.6s ease-out;
        }
        
        @keyframes successPop {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
        
        .code-change-indicator {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="android-device">
        <div class="device-speaker"></div>
        <div class="device-camera"></div>
        
        <div class="device-frame">
            <div class="screen">
                <div class="status-bar">
                    <span>📶 Codex Playground</span>
                    <span>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>🔋 100%</span>
                </div>
                
                <div class="app-content">
                    <div class="code-change-indicator">Live Preview</div>
                    <div class="loading-animation" id="loadingAnimation"></div>
                    
                    <div class="app-title">🤖 ${titleText}</div>
                    <div class="counter-display" id="counterDisplay">Count: 0</div>
                    
                    <button class="android-button" onclick="increment()" id="incrementBtn">
                        ⬆️ ${buttonText}
                    </button>
                    <button class="android-button reset-button" onclick="reset()" id="resetBtn">
                        🔄 RESET
                    </button>
                    
                    <div style="margin-top: 20px; font-size: 12px; color: #666;">
                        Built with Android Studio Web • Live Preview
                    </div>
                </div>
                
                <div class="navigation-bar">
                    <div class="nav-indicator"></div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="success-animation" id="successAnimation">✨</div>

    <script>
        let counter = 0;
        const incrementLogic = '${counterLogic}';
        
        function showLoading() {
            document.getElementById('loadingAnimation').style.display = 'block';
            setTimeout(() => {
                document.getElementById('loadingAnimation').style.display = 'none';
            }, 300);
        }
        
        function showSuccess() {
            const successEl = document.getElementById('successAnimation');
            successEl.classList.add('animate-success');
            setTimeout(() => {
                successEl.classList.remove('animate-success');
            }, 600);
        }
        
        function increment() {
            showLoading();
            setTimeout(() => {
                // Apply dynamic increment logic
                if (incrementLogic.includes('+=')) {
                    const value = parseInt(incrementLogic.match(/\\d+/)[0]);
                    counter += value;
                } else if (incrementLogic.includes('*=')) {
                    const value = parseInt(incrementLogic.match(/\\d+/)[0]);
                    counter *= value;
                } else {
                    counter++;
                }
                
                updateDisplay();
                showSuccess();
                
                // Add haptic feedback simulation
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }, 300);
        }
        
        function reset() {
            showLoading();
            setTimeout(() => {
                counter = 0;
                updateDisplay();
                showSuccess();
                
                if (navigator.vibrate) {
                    navigator.vibrate([50, 50, 50]);
                }
            }, 300);
        }
        
        function updateDisplay() {
            const display = document.getElementById('counterDisplay');
            display.textContent = 'Count: ' + counter;
            
            // Add color animation based on count
            if (counter > 10) {
                display.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                display.style.color = 'white';
            } else if (counter > 5) {
                display.style.background = 'linear-gradient(45deg, #FF9800, #F57C00)';
                display.style.color = 'white';
            } else {
                display.style.background = 'white';
                display.style.color = '#333';
            }
            
            // Scale animation
            display.style.transform = 'scale(1.1)';
            setTimeout(() => {
                display.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Simulate app lifecycle
        window.addEventListener('load', () => {
            console.log('🤖 Android app preview loaded successfully!');
            console.log('📱 Simulating Android lifecycle events...');
            console.log('🔄 Live preview with code changes: ${new Date().toLocaleTimeString()}');
            
            // Simulate onCreate
            setTimeout(() => {
                console.log('📱 onCreate() called');
            }, 100);
            
            // Simulate onStart
            setTimeout(() => {
                console.log('📱 onStart() called');
            }, 200);
            
            // Simulate onResume
            setTimeout(() => {
                console.log('📱 onResume() called - App is now active');
            }, 300);
        });
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                increment();
            } else if (e.key === 'r' || e.key === 'R') {
                reset();
            }
        });
        
        // Add touch gesture support
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    increment(); // Swipe up
                } else {
                    reset(); // Swipe down
                }
            }
        });
    </script>
</body>
</html>`;
    
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setAndroidPreviewUrl(url);
    setShowAndroidPreview(true);
    setCodeChangeDetected(false);
    
    setConsoleOutput(prev => [...prev, {
      type: 'success',
      message: `📱 Live preview updated with your code changes! (${new Date().toLocaleTimeString()})`,
      timestamp: Date.now()
    }]);
    
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
                <span className="text-sm">← Back to Codex Playground</span>
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
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-all duration-300 ${
                isBuilding 
                  ? 'bg-yellow-600 hover:bg-yellow-700 animate-pulse' 
                  : appStatus === 'built' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isBuilding}
            >
              <Package size={16} />
              <span>
                {isBuilding ? `Building... ${buildProgress}%` : 
                 appStatus === 'built' ? 'Built ✓' : 'Build'}
              </span>
            </button>
            
            <button
              onClick={handleRun}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-all duration-300 ${
                appStatus === 'running' 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : isRunning 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-green-700 hover:bg-green-800'
              }`}
              disabled={isBuilding}
            >
              {appStatus === 'running' ? (
                <>
                  <X size={16} />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>
                    {appStatus === 'installing' ? 'Installing...' :
                     appStatus === 'launching' ? 'Launching...' : 'Run'}
                  </span>
                </>
              )}
            </button>
            
            <div className="flex items-center space-x-4 text-xs text-green-100">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span>Live: {globalStats.activeUsers.toLocaleString()}</span>
              </div>
              <div>Total: {globalStats.totalUsers.toLocaleString()}</div>
              <div>Peak: {globalStats.peakUsers.toLocaleString()}</div>
              <div>Apps: {globalStats.appsBuilt.toLocaleString()}</div>
              <div className="flex items-center space-x-1">
                <span>Simulation:</span>
                <button
                  onClick={() => setUserSimulation(!userSimulation)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    userSimulation ? 'bg-green-700 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {userSimulation ? 'ON' : 'OFF'}
                </button>
              </div>
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
        <div className={`${showAndroidPreview ? 'flex-1' : 'flex-1'} flex flex-col`}>
          {/* Editor Toolbar */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{getFileIcon(activeFile)}</span>
                <span className="font-medium">{activeFile}</span>
                <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                  {files[activeFile]?.language}
                </span>
                {codeChangeDetected && (
                  <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 animate-pulse">
                    • Modified
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <span>Auto Preview:</span>
                  <button
                    onClick={() => setAutoPreview(!autoPreview)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      autoPreview ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {autoPreview ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <button
                  onClick={generateAndroidPreview}
                  className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                    codeChangeDetected 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white animate-pulse' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  <Smartphone size={16} />
                  <span>{codeChangeDetected ? 'Update Preview' : 'Preview'}</span>
                </button>
                
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

          {/* Editor and Preview Container */}
          <div className="flex-1 flex">
            {/* Editor */}
            <div className={`${showAndroidPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
              <Editor
                height="100%"
                language={files[activeFile]?.language || 'java'}
                value={files[activeFile]?.content || ''}
                theme="light"
                onChange={(value) => {
                  handleCodeChange(value, activeFile);
                  // Analyze code for suggestions
                  if (value) {
                    analyzeCodeChanges(value, activeFile);
                  }
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

            {/* Android Preview Panel */}
            {showAndroidPreview && (
              <div className="w-1/2 bg-gray-100 border-l border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-800">Android Preview</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={generateAndroidPreview}
                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                        title="Refresh Preview"
                      >
                        <RefreshCw size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={openAndroidPreview}
                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                        title="Open in New Tab"
                      >
                        <Globe size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowAndroidPreview(false)}
                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                        title="Close Preview"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${androidPreviewUrl ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-600">
                      {androidPreviewUrl ? 'Preview Active' : 'No Preview'}
                    </span>
                    <span className="text-xs text-gray-500">
                      • Users: {currentUsers.toLocaleString()}/{userLimit.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 p-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  {androidPreviewUrl ? (
                    <div className="w-full h-full max-w-sm mx-auto">
                      <iframe
                        src={androidPreviewUrl}
                        className="w-full h-full border-none rounded-lg shadow-2xl"
                        title="Android Preview"
                        style={{ minHeight: '600px' }}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                        <Smartphone size={40} className="text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-700">Click "Preview" to see your Android app</p>
                      <p className="text-sm text-gray-500 mt-1">Real-time Android simulation</p>
                      <button
                        onClick={generateAndroidPreview}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Generate Preview
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Console */}
      <div className={`${isConsoleMinimized ? 'h-10' : 'h-64'} bg-gray-900 text-white flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Terminal size={16} />
            <span className="font-medium">Build Output</span>
            {isConsoleMinimized && (
              <span className="text-xs text-gray-400">
                ({consoleOutput.length} messages)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsConsoleMinimized(!isConsoleMinimized)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
              title={isConsoleMinimized ? 'Maximize Console' : 'Minimize Console'}
            >
              {isConsoleMinimized ? '⬆️' : '⬇️'}
            </button>
            <button
              onClick={() => setConsoleOutput([])}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        
        {!isConsoleMinimized && (
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
        )}
      </div>

      {/* Preview Manager Modal */}
      {showPreviewManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Android Preview Manager</h2>
                    <p className="text-sm text-purple-100">Manage 1B+ user authorization system</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreviewManager(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Real-Time User Activity */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live User Activity</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Now:</span>
                      <span className="font-bold text-green-600 animate-pulse">
                        {globalStats.activeUsers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Registered:</span>
                      <span className="font-bold text-blue-600">{globalStats.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Peak Today:</span>
                      <span className="font-bold text-purple-600">{globalStats.peakUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Apps Built:</span>
                      <span className="font-bold text-orange-600">{globalStats.appsBuilt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Code Lines:</span>
                      <span className="font-bold text-indigo-600">{globalStats.codeLines.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Global Capacity</span>
                      <span>{((globalStats.activeUsers / userLimit) * 100).toFixed(4)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((globalStats.activeUsers / userLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Regional Distribution */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Distribution</h3>
                  <div className="space-y-2">
                    {Array.from(userRegions.entries()).map(([region, count]) => (
                      <div key={region} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{region}:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((count / Math.max(...userRegions.values())) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-purple-600">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Device Types</h4>
                    <div className="flex space-x-2">
                      {Array.from(deviceTypes.entries()).map(([device, count]) => (
                        <div key={device} className="text-center">
                          <div className="text-xs text-gray-600">{device}</div>
                          <div className="text-sm font-bold text-purple-600">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Live Activity Feed</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Speed:</span>
                      <select
                        value={simulationSpeed}
                        onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value={500}>Fast</option>
                        <option value={1000}>Normal</option>
                        <option value={2000}>Slow</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {userActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{activity.userId.slice(-8)}</span>
                          <span className="text-sm text-gray-600">{activity.action}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{activity.region}</span>
                          <span>•</span>
                          <span>{activity.device}</span>
                          <span>•</span>
                          <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                    {userActivity.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No recent activity
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Permissions */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview Permissions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Public Access:</span>
                      <button
                        onClick={() => setPreviewPermissions(prev => ({ ...prev, public: !prev.public }))}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          previewPermissions.public 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {previewPermissions.public ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Require Auth:</span>
                      <button
                        onClick={() => setPreviewPermissions(prev => ({ ...prev, requireAuth: !prev.requireAuth }))}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          previewPermissions.requireAuth 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {previewPermissions.requireAuth ? 'Required' : 'Optional'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Max Concurrent:</span>
                      <span className="font-medium text-blue-600">
                        {previewPermissions.maxConcurrentUsers.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dynamic User Management */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Dynamic User Management</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bulk User Actions
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            // Auto-authorize all active users
                            Array.from(realTimeUsers.values()).forEach(user => {
                              if (user.appsBuilt > 0) {
                                authorizeUser(user.id);
                              }
                            });
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Authorize Active Users
                        </button>
                        <button
                          onClick={() => {
                            // Generate 100 new users instantly
                            for (let i = 0; i < 100; i++) {
                              setTimeout(() => {
                                const userId = `bulk_user_${Date.now()}_${i}`;
                                authorizeUser(userId);
                              }, i * 10);
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Generate 100 Users
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Controls
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setGlobalStats({
                              totalUsers: 0,
                              activeUsers: 0,
                              peakUsers: 0,
                              sessionsToday: 0,
                              appsBuilt: 0,
                              codeLines: 0
                            });
                            setRealTimeUsers(new Map());
                            setUserActivity([]);
                            setUserRegions(new Map());
                            setDeviceTypes(new Map());
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Reset All Stats
                        </button>
                        <button
                          onClick={() => {
                            // Simulate peak load
                            setGlobalStats(prev => ({
                              ...prev,
                              activeUsers: Math.floor(Math.random() * 10000000) + 1000000,
                              peakUsers: Math.floor(Math.random() * 50000000) + 10000000
                            }));
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Simulate Peak Load
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Recent Users ({realTimeUsers.size})</h4>
                    <div className="max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Array.from(realTimeUsers.values()).slice(0, 20).map(user => (
                          <div key={user.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="text-sm font-medium text-gray-700">{user.id.slice(-12)}</span>
                              <span className="text-xs text-gray-500">{user.region}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-600">{user.appsBuilt} apps</span>
                              <button
                                onClick={() => {
                                  if (authorizedUsers.has(user.id)) {
                                    deauthorizeUser(user.id);
                                  } else {
                                    authorizeUser(user.id);
                                  }
                                }}
                                className={`text-xs px-2 py-1 rounded transition-colors ${
                                  authorizedUsers.has(user.id)
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                                }`}
                              >
                                {authorizedUsers.has(user.id) ? 'Revoke' : 'Auth'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {realTimeUsers.size === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No users online - Enable simulation to see activity
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AndroidEditor;