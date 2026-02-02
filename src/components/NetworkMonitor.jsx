import { useState, useEffect } from 'react';
import { Activity, X, Wifi, WifiOff, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const NetworkMonitor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      const method = args[1]?.method || 'GET';

      const requestId = Date.now() + Math.random();
      
      // Add pending request
      setRequests(prev => [{
        id: requestId,
        url,
        method,
        status: 'pending',
        startTime,
        duration: null,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 50)); // Keep last 50 requests

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;

        // Update with success
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: response.ok ? 'success' : 'error', statusCode: response.status, duration }
            : req
        ));

        return response;
      } catch (error) {
        const duration = Date.now() - startTime;

        // Update with error
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'error', error: error.message, duration }
            : req
        ));

        throw error;
      }
    };

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.fetch = originalFetch;
    };
  }, []);

  const clearRequests = () => setRequests([]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'bg-slate-700';
    }
  };

  const stats = {
    total: requests.length,
    success: requests.filter(r => r.status === 'success').length,
    error: requests.filter(r => r.status === 'error').length,
    pending: requests.filter(r => r.status === 'pending').length,
    avgDuration: requests.filter(r => r.duration).reduce((sum, r) => sum + r.duration, 0) / requests.filter(r => r.duration).length || 0
  };

  return (
    <>
      {/* Floating Network Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 p-4 ${
          isOnline ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
        } text-white rounded-full shadow-lg transition-all hover:scale-110`}
        title="Network Monitor"
      >
        {isOnline ? <Activity className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
        {requests.filter(r => r.status === 'pending').length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">
            {requests.filter(r => r.status === 'pending').length}
          </span>
        )}
      </button>

      {/* Network Monitor Panel */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-96 max-h-[600px] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <h3 className="font-semibold text-white">Network Monitor</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearRequests}
                className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-slate-900/50 border-b border-slate-700">
            <div className="text-center">
              <div className="text-xs text-gray-400">Total</div>
              <div className="text-lg font-bold text-white">{stats.total}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Success</div>
              <div className="text-lg font-bold text-green-500">{stats.success}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Error</div>
              <div className="text-lg font-bold text-red-500">{stats.error}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Avg</div>
              <div className="text-lg font-bold text-blue-500">
                {stats.avgDuration > 0 ? `${Math.round(stats.avgDuration)}ms` : '-'}
              </div>
            </div>
          </div>

          {/* Request List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {requests.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No network requests yet</p>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className={`p-3 rounded-lg border ${getStatusColor(request.status)} transition-all`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getStatusIcon(request.status)}
                      <span className="text-xs font-mono font-semibold text-white">
                        {request.method}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {request.url.replace(/^https?:\/\/[^/]+/, '')}
                      </span>
                    </div>
                    {request.duration !== null && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {request.duration}ms
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{request.timestamp}</span>
                    {request.statusCode && (
                      <span className={`font-mono ${
                        request.statusCode >= 200 && request.statusCode < 300
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {request.statusCode}
                      </span>
                    )}
                    {request.error && (
                      <span className="text-red-400 truncate max-w-[200px]">
                        {request.error}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 bg-slate-900 border-t border-slate-700 text-center">
            <p className="text-xs text-gray-400">
              {isOnline ? '🟢 Online' : '🔴 Offline'} • Monitoring all requests
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default NetworkMonitor;
