import { useAuth } from '../../contexts/SimpleClerkAuth';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AuthGuard component - Protects routes and components from unauthorized access
 * Redirects non-authenticated users to the home page with auth modal
 */
function AuthGuard({ children, fallback = null, redirectTo = "/" }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>Verifying access...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to home or show fallback
  if (!isAuthenticated) {
    if (fallback) {
      return fallback;
    }
    
    // Redirect to home page, which will show the auth modal
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
}

export default AuthGuard;