import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Brain, Eye, Smile, Frown, Zap, AlertCircle } from 'lucide-react';

const CameraMindCapture = ({ onEmotionDetected, onFocusChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [focusLevel, setFocusLevel] = useState(0);
  const [thinkingState, setThinkingState] = useState('idle');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Emotion states mapping
  const emotionStates = {
    focused: { icon: Brain, color: '#8b5cf6', label: 'Deep Focus', thinking: 'solution' },
    confused: { icon: AlertCircle, color: '#f59e0b', label: 'Confused', thinking: 'stuck' },
    excited: { icon: Zap, color: '#10b981', label: 'Breakthrough!', thinking: 'optimization' },
    neutral: { icon: Eye, color: '#6b7280', label: 'Analyzing', thinking: 'approach' },
    frustrated: { icon: Frown, color: '#ef4444', label: 'Frustrated', thinking: 'stuck' },
    happy: { icon: Smile, color: '#3b82f6', label: 'Confident', thinking: 'solution' }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setHasPermission(true);
      setIsActive(true);
      startDetection();
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    setIsActive(false);
  };

  const startDetection = () => {
    // Simulate ML detection (in production, use TensorFlow.js or similar)
    detectionIntervalRef.current = setInterval(() => {
      detectEmotionAndFocus();
    }, 2000); // Check every 2 seconds
  };

  const detectEmotionAndFocus = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simulate ML emotion detection
    // In production: Use face-api.js, TensorFlow.js, or MediaPipe
    const emotions = ['focused', 'confused', 'excited', 'neutral', 'frustrated', 'happy'];
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const detectedFocus = Math.floor(Math.random() * 100);

    // Analyze facial features (simulated)
    const analysis = analyzeFacialFeatures(ctx, canvas);
    
    setCurrentEmotion(detectedEmotion);
    setFocusLevel(detectedFocus);
    setThinkingState(emotionStates[detectedEmotion].thinking);

    // Callback to parent
    onEmotionDetected?.({
      emotion: detectedEmotion,
      focus: detectedFocus,
      thinking: emotionStates[detectedEmotion].thinking,
      timestamp: new Date().toISOString(),
      analysis
    });

    onFocusChange?.(detectedFocus);
  };

  const analyzeFacialFeatures = (ctx, canvas) => {
    // Simulate facial feature analysis
    // In production: Use actual ML models
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate brightness (proxy for engagement)
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    brightness = brightness / (data.length / 4);

    return {
      brightness: Math.floor(brightness),
      eyeContact: Math.random() > 0.5,
      headPosition: Math.random() > 0.3 ? 'centered' : 'tilted',
      blinkRate: Math.floor(Math.random() * 20),
      microExpressions: Math.floor(Math.random() * 10)
    };
  };

  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const EmotionIcon = currentEmotion ? emotionStates[currentEmotion].icon : Brain;
  const emotionColor = currentEmotion ? emotionStates[currentEmotion].color : '#6b7280';

  return (
    <div className="camera-mind-capture">
      <div className="camera-header">
        <div className="header-left">
          <Camera className="camera-icon" />
          <h4>Mind Capture - Visual Analysis</h4>
        </div>
        <button 
          onClick={toggleCamera}
          className={`camera-toggle ${isActive ? 'active' : ''}`}
          title={isActive ? 'Stop camera' : 'Start camera'}
        >
          {isActive ? <CameraOff size={18} /> : <Camera size={18} />}
          <span>{isActive ? 'Stop' : 'Start'}</span>
        </button>
      </div>

      {hasPermission === false && (
        <div className="permission-denied">
          <AlertCircle size={48} />
          <p>Camera access denied</p>
          <p className="hint">Please allow camera access to use Mind Capture</p>
        </div>
      )}

      {isActive && (
        <div className="camera-content">
          <div className="video-container">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="video-feed"
            />
            <canvas 
              ref={canvasRef} 
              width="640" 
              height="480"
              style={{ display: 'none' }}
            />
            
            {currentEmotion && (
              <div className="emotion-overlay">
                <div 
                  className="emotion-indicator"
                  style={{ backgroundColor: emotionColor }}
                >
                  <EmotionIcon size={20} />
                  <span>{emotionStates[currentEmotion].label}</span>
                </div>
              </div>
            )}
          </div>

          <div className="analysis-panel">
            <div className="analysis-row">
              <div className="analysis-item">
                <Brain size={16} style={{ color: emotionColor }} />
                <div className="analysis-details">
                  <span className="label">Thinking State</span>
                  <span className="value" style={{ color: emotionColor }}>
                    {thinkingState}
                  </span>
                </div>
              </div>

              <div className="analysis-item">
                <Eye size={16} style={{ color: focusLevel > 70 ? '#10b981' : '#f59e0b' }} />
                <div className="analysis-details">
                  <span className="label">Focus Level</span>
                  <div className="focus-bar">
                    <div 
                      className="focus-fill"
                      style={{ 
                        width: `${focusLevel}%`,
                        backgroundColor: focusLevel > 70 ? '#10b981' : focusLevel > 40 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                  <span className="value">{focusLevel}%</span>
                </div>
              </div>
            </div>

            <div className="emotion-history">
              <h5>Detected States</h5>
              <div className="emotion-badges">
                {Object.entries(emotionStates).map(([key, state]) => {
                  const Icon = state.icon;
                  return (
                    <div 
                      key={key}
                      className={`emotion-badge ${currentEmotion === key ? 'active' : ''}`}
                      style={{ 
                        borderColor: currentEmotion === key ? state.color : 'transparent',
                        backgroundColor: currentEmotion === key ? `${state.color}20` : 'transparent'
                      }}
                    >
                      <Icon size={14} style={{ color: state.color }} />
                      <span>{state.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isActive && hasPermission !== false && (
        <div className="camera-inactive">
          <Camera size={48} opacity={0.3} />
          <p>Start camera to enable visual mind analysis</p>
          <p className="hint">AI will detect your emotions and focus level while solving</p>
        </div>
      )}
    </div>
  );
};

export default CameraMindCapture;
