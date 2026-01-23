import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Settings, Zap } from 'lucide-react';

function ModeSwitcher() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app_mode') || 'auto';
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showMenu, setShowMenu] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mode-switcher-container')) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const switchMode = (newMode) => {
    if (newMode === 'auto') {
      localStorage.removeItem('app_mode');
    } else {
      localStorage.setItem('app_mode', newMode);
    }
    setMode(newMode);
    setShowMenu(false);
    window.location.reload();
  };

  // Determine actual mode being used
  const actualMode = mode === 'auto' 
    ? (isOnline ? 'online' : 'offline')
    : mode;

  const getButtonColor = () => {
    if (mode === 'auto') return 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800';
    return actualMode === 'offline' 
      ? 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800' 
      : 'bg-green-600 hover:bg-green-700 active:bg-green-800';
  };

  const getIcon = () => {
    if (mode === 'auto') return <Zap className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 sm:w-5 sm:h-5" />;
    return actualMode === 'offline' 
      ? <WifiOff className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 sm:w-5 sm:h-5" /> 
      : <Wifi className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 sm:w-5 sm:h-5" />;
  };

  const getLabel = () => {
    if (mode === 'auto') return `Auto (${isOnline ? 'Online' : 'Offline'})`;
    return actualMode === 'offline' ? 'Offline Mode' : 'Online Mode';
  };

  const getShortLabel = () => {
    if (mode === 'auto') return 'Auto';
    return actualMode === 'offline' ? 'Off' : 'On';
  };

  return (
    <div className="mode-switcher-container fixed bottom-2 right-2 xxs:bottom-3 xxs:right-3 sm:bottom-4 sm:right-4 z-50">
      {/* Main Toggle Button - Ultra responsive sizing */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`
          px-1.5 py-1.5 xxs:px-2 xxs:py-2 xs:px-2.5 xs:py-2 sm:px-4 sm:py-2.5 
          rounded-md xxs:rounded-lg shadow-lg 
          flex items-center gap-1 xxs:gap-1.5 sm:gap-2 
          font-medium transition-all text-white 
          ${getButtonColor()}
          tap-target
          touch-manipulation
          text-[10px] xxs:text-xs sm:text-sm
        `}
        aria-label="Toggle mode switcher"
      >
        {getIcon()}
        {/* Progressive text display based on screen size */}
        <span className="hidden xxs:inline xs:hidden">{getShortLabel()}</span>
        <span className="hidden xs:inline sm:hidden text-xs">{getShortLabel()}</span>
        <span className="hidden sm:inline text-sm">{getLabel()}</span>
        <Settings className="w-3 h-3 xxs:w-3.5 xxs:h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Dropdown Menu - Ultra compact for tiny screens */}
      {showMenu && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 sm:hidden -z-10"
            onClick={() => setShowMenu(false)}
          />
          
          <div className="
            absolute bottom-full right-0 mb-1.5 xxs:mb-2 
            bg-white rounded-md xxs:rounded-lg shadow-2xl 
            border border-gray-200 overflow-hidden 
            w-[calc(100vw-16px)] max-w-[220px] xxs:max-w-[240px] xs:max-w-[260px] sm:min-w-[240px] sm:w-auto
            animate-fade-in
          ">
            {/* Header - Ultra compact */}
            <div className="p-1.5 xxs:p-2 xs:p-2.5 sm:p-3 bg-gray-50 border-b border-gray-200">
              <p className="text-[9px] xxs:text-[10px] xs:text-xs font-semibold text-gray-700">Mode</p>
              <p className="text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs text-gray-500 mt-0.5">
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </p>
            </div>
            
            {/* Mode Options - Touch-friendly even on tiny screens */}
            <button
              onClick={() => switchMode('auto')}
              className={`
                w-full px-2 py-2 xxs:px-2.5 xxs:py-2.5 xs:px-3 xs:py-2.5 sm:px-4 sm:py-3 
                text-left flex items-center gap-1.5 xxs:gap-2 xs:gap-2.5 sm:gap-3 
                transition-all tap-target
                ${mode === 'auto' 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'hover:bg-gray-50 active:bg-gray-100 text-gray-700'
                }
              `}
            >
              <Zap className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[10px] xxs:text-xs sm:text-sm truncate">Auto</div>
                <div className="text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs text-gray-500 truncate">Detects</div>
              </div>
              {mode === 'auto' && (
                <div className="w-1.5 h-1.5 xxs:w-2 xxs:h-2 rounded-full bg-purple-600 flex-shrink-0" />
              )}
            </button>

            <button
              onClick={() => switchMode('offline')}
              className={`
                w-full px-2 py-2 xxs:px-2.5 xxs:py-2.5 xs:px-3 xs:py-2.5 sm:px-4 sm:py-3 
                text-left flex items-center gap-1.5 xxs:gap-2 xs:gap-2.5 sm:gap-3 
                transition-all tap-target
                ${mode === 'offline' 
                  ? 'bg-orange-50 text-orange-700' 
                  : 'hover:bg-gray-50 active:bg-gray-100 text-gray-700'
                }
              `}
            >
              <WifiOff className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[10px] xxs:text-xs sm:text-sm truncate">Offline</div>
                <div className="text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs text-gray-500 truncate">Always</div>
              </div>
              {mode === 'offline' && (
                <div className="w-1.5 h-1.5 xxs:w-2 xxs:h-2 rounded-full bg-orange-600 flex-shrink-0" />
              )}
            </button>

            <button
              onClick={() => switchMode('online')}
              className={`
                w-full px-2 py-2 xxs:px-2.5 xxs:py-2.5 xs:px-3 xs:py-2.5 sm:px-4 sm:py-3 
                text-left flex items-center gap-1.5 xxs:gap-2 xs:gap-2.5 sm:gap-3 
                transition-all tap-target
                ${mode === 'online' 
                  ? 'bg-green-50 text-green-700' 
                  : 'hover:bg-gray-50 active:bg-gray-100 text-gray-700'
                }
              `}
            >
              <Wifi className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[10px] xxs:text-xs sm:text-sm truncate">Online</div>
                <div className="text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs text-gray-500 truncate">Always</div>
              </div>
              {mode === 'online' && (
                <div className="w-1.5 h-1.5 xxs:w-2 xxs:h-2 rounded-full bg-green-600 flex-shrink-0" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ModeSwitcher;
