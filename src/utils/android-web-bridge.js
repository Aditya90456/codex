/**
 * Android Web Bridge - Communication between Android WebView and Web App
 */

class AndroidWebBridge {
  constructor() {
    this.isAndroid = this.detectAndroid();
    this.callbacks = new Map();
    this.setupMessageListener();
  }

  // Detect if running in Android WebView
  detectAndroid() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android/.test(userAgent) && typeof window.Android !== 'undefined';
  }

  // Setup message listener for Android communication
  setupMessageListener() {
    if (this.isAndroid) {
      window.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleAndroidMessage(data);
        } catch (error) {
          console.error('Android message parsing error:', error);
        }
      });
    }
  }

  // Handle messages from Android
  handleAndroidMessage(data) {
    const { type, payload, callbackId } = data;
    
    if (callbackId && this.callbacks.has(callbackId)) {
      const callback = this.callbacks.get(callbackId);
      callback(payload);
      this.callbacks.delete(callbackId);
    }

    // Emit custom event for other listeners
    window.dispatchEvent(new CustomEvent('androidMessage', {
      detail: { type, payload }
    }));
  }

  // Send message to Android
  sendToAndroid(type, payload = {}) {
    if (!this.isAndroid) {
      console.warn('Not running in Android WebView');
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      const callbackId = Date.now().toString();
      this.callbacks.set(callbackId, resolve);

      const message = {
        type,
        payload,
        callbackId
      };

      if (window.Android && window.Android.receiveMessage) {
        window.Android.receiveMessage(JSON.stringify(message));
      }

      // Timeout after 10 seconds
      setTimeout(() => {
        if (this.callbacks.has(callbackId)) {
          this.callbacks.delete(callbackId);
          resolve(null);
        }
      }, 10000);
    });
  }

  // Common Android functions
  async showToast(message, duration = 'SHORT') {
    return this.sendToAndroid('SHOW_TOAST', { message, duration });
  }

  async vibrate(pattern = [100]) {
    return this.sendToAndroid('VIBRATE', { pattern });
  }

  async getDeviceInfo() {
    return this.sendToAndroid('GET_DEVICE_INFO');
  }

  async openUrl(url) {
    return this.sendToAndroid('OPEN_URL', { url });
  }

  async shareContent(title, text, url) {
    return this.sendToAndroid('SHARE', { title, text, url });
  }

  async requestPermission(permission) {
    return this.sendToAndroid('REQUEST_PERMISSION', { permission });
  }

  async saveToDownloads(filename, content, mimeType = 'text/plain') {
    return this.sendToAndroid('SAVE_FILE', { filename, content, mimeType });
  }

  async getNetworkStatus() {
    return this.sendToAndroid('GET_NETWORK_STATUS');
  }

  async setBrightness(level) {
    return this.sendToAndroid('SET_BRIGHTNESS', { level });
  }

  async keepScreenOn(enabled = true) {
    return this.sendToAndroid('KEEP_SCREEN_ON', { enabled });
  }
}

// Create global instance
const androidBridge = new AndroidWebBridge();

export default androidBridge;