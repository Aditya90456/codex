import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { User, LogIn, UserPlus, Settings, LogOut, BookOpen, Code, Trophy, Heart, PenSquare } from 'lucide-react';

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
        <span className="text-sm text-gray-300 hidden sm:block font-medium">
          {userName}
        </span>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-10 h-10 rounded-full border-2 border-blue-500 hover:border-purple-500 transition-all shadow-lg hover:shadow-blue-500/50",
              userButtonPopoverCard: "bg-gray-900 border border-gray-700 shadow-2xl",
              userButtonPopoverActionButton: "hover:bg-gray-800 text-gray-200",
              userButtonPopoverActionButtonText: "text-gray-200",
              userButtonPopoverActionButtonIcon: "text-blue-400",
              userButtonPopoverFooter: "hidden"
            },
            baseTheme: "dark"
          }}
          afterSignOutUrl="/"
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="Dashboard"
              labelIcon={<Trophy size={16} />}
              href="/dashboard"
            />
            <UserButton.Link
              label="My Blogs"
              labelIcon={<PenSquare size={16} />}
              href="/blogs"
            />
            <UserButton.Link
              label="Code Editor"
              labelIcon={<Code size={16} />}
              href="/editor"
            />
            <UserButton.Link
              label="Learning Hub"
              labelIcon={<BookOpen size={16} />}
              href="/learn"
            />
            <UserButton.Action label="manageAccount" />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
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
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-all hover:border-blue-500">
          <LogIn size={16} />
          Sign In
        </button>
      </Link>
      <SignUpButton mode="redirect">
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/50">
          <UserPlus size={16} />
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
};


export default AuthButton;