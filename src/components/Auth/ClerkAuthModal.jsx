import { SignIn, SignUp } from '@clerk/clerk-react';
import { X } from 'lucide-react';

const ClerkAuthModal = ({ isOpen, onClose, mode = 'sign-in' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Clerk Auth Component */}
        <div className="p-6">
          {mode === 'sign-in' ? (
            <SignIn 
              afterSignInUrl="/"
              signUpUrl="#"
            />
          ) : (
            <SignUp 
              afterSignUpUrl="/"
              signInUrl="#"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClerkAuthModal;