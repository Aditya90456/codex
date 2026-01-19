import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Code, Trophy, User, Menu, X } from 'lucide-react';

const MobileNav = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/editor-modern', icon: Code, label: 'Editor' },
    { path: '/dsa', icon: Trophy, label: 'DSA' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-50 safe-area-bottom">
        <div className="flex justify-around items-center px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-lg transition-all ${
                  active
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-700 z-40 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">Codex</span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {isMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-slate-900 border-l border-slate-700 z-50 transform transition-transform duration-300 safe-area-top safe-area-bottom">
            <div className="flex flex-col h-full">
              {/* User Info */}
              {user && (
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.firstName?.[0] || user.username?.[0] || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {user.firstName || user.username || 'User'}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {user.emailAddresses?.[0]?.emailAddress || ''}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                          active
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logout Button */}
              {user && onLogout && (
                <div className="p-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNav;
