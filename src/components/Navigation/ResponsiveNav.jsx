import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Code, 
  BookOpen, 
  User, 
  Settings,
  Palette,
  Globe,
  ChevronDown,
  Trophy
} from 'lucide-react';
import useResponsiveTheme from '../../hooks/useResponsiveTheme';
import ThemeSelector from '../UI/ThemeSelector';
import ResponsiveButton from '../UI/ResponsiveButton';

const ResponsiveNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { 
    isMobile, 
    isTablet, 
    getResponsiveClasses, 
    getThemeClasses,
    adaptiveStyles 
  } = useResponsiveTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/leetcode', label: 'LeetCode', icon: Code },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const NavLink = ({ item, mobile = false }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        className={getResponsiveClasses(
          `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive 
              ? getThemeClasses('primary') + ' shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`,
          mobile ? 'w-full justify-start text-base' : 'text-sm',
          mobile ? 'w-full justify-start text-base' : 'text-sm',
          'text-sm'
        )}
      >
        <Icon className={`w-${mobile ? '5' : '4'} h-${mobile ? '5' : '4'}`} />
        <span className={mobile ? 'block' : 'hidden sm:block'}>{item.label}</span>
      </Link>
    );
  };

  const MobileMenu = () => (
    <div className={`
      fixed inset-0 z-50 lg:hidden
      ${isOpen ? 'block' : 'hidden'}
    `}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Menu Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-80 max-w-[85vw]
        ${getThemeClasses('card')} border-l ${getThemeClasses('outline').split(' ')[1]}
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        safe-area-padding
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} mobile />
            ))}
          </nav>
          
          {/* Theme Selector */}
          <div className="p-4 border-t border-white/10">
            <div className="mb-4">
              <ThemeSelector showLabel />
            </div>
            
            {/* Settings Link */}
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const DesktopNav = () => (
    <nav className="hidden lg:flex items-center space-x-1">
      {navItems.map((item) => (
        <NavLink key={item.path} item={item} />
      ))}
    </nav>
  );

  return (
    <>
      <header className={`
        fixed top-0 left-0 right-0 z-40
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? `${getThemeClasses('card')} backdrop-blur-lg border-b border-white/10 shadow-lg` 
          : 'bg-transparent'
        }
        safe-area-padding-top
      `}>
        <div className="responsive-container">
          <div className={`
            flex items-center justify-between
            ${adaptiveStyles.navigation?.height ? `h-[${adaptiveStyles.navigation.height}]` : 'h-16 lg:h-20'}
          `}>
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${getThemeClasses('primary')}`} />
              <span className="hidden sm:block">CodePlatform</span>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav />

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Selector - Desktop */}
              <div className="hidden lg:block">
                <ThemeSelector variant="compact" />
              </div>
              
              {/* Language Selector - Desktop */}
              <div className="hidden lg:block">
                <ResponsiveButton
                  variant="ghost"
                  size="sm"
                  icon={Globe}
                  className="gap-1"
                >
                  <ChevronDown className="w-3 h-3" />
                </ResponsiveButton>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(true)}
                className={`
                  lg:hidden p-2 rounded-lg transition-colors
                  ${getResponsiveClasses(
                    'hover:bg-white/10 text-white',
                    'touch-target',
                    'touch-target',
                    ''
                  )}
                `}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && (
        <nav className={`
          fixed bottom-0 left-0 right-0 z-40
          ${getThemeClasses('card')} border-t border-white/10
          safe-area-padding-bottom
        `}>
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                    transition-all duration-200 touch-target
                    ${isActive 
                      ? getThemeClasses('primary') + ' shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Spacer for fixed navigation */}
      <div className={`
        ${adaptiveStyles.navigation?.height ? `h-[${adaptiveStyles.navigation.height}]` : 'h-16 lg:h-20'}
      `} />
      
      {/* Bottom spacer for mobile */}
      {isMobile && <div className="h-20" />}
    </>
  );
};

export default ResponsiveNav;