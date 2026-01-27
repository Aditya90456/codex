import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { User, LogIn, UserPlus } from 'lucide-react';

const AuthButton = ({ variant = 'default' }) => {
  const { isSignedIn, isLoaded, userName } = useAuthContext();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg animate-pulse">
        <div className="w-4 h-4 bg-gray-600 rounded"></div>
        <div className="w-16 h-4 bg-gray-600 rounded"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300 hidden sm:block">
          Welcome, {userName}
        </span>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 rounded-full border-2 border-blue-500",
            }
          }}
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Link to="/sign-in">
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <LogIn size={16} />
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/sign-in">
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors">
          <LogIn size={16} />
          Sign In
        </button>
      </Link>
      <SignUpButton mode="redirect">
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <UserPlus size={16} />
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
};


export default AuthButton;