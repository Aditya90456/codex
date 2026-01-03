import { UserButton, useUser } from '@clerk/clerk-react';
import { Crown, Settings, LogOut } from 'lucide-react';

const ClerkUserButton = ({ subscription }) => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      {/* Premium Badge */}
      {subscription?.status === 'active' && (
        <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-2 py-1 rounded-full">
          <Crown className="w-3 h-3 text-yellow-400" />
          <span className="text-yellow-400 text-xs font-medium">Premium</span>
        </div>
      )}

      {/* User Button */}
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "bg-gray-800 border border-gray-700",
            userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700",
            userButtonPopoverActionButtonText: "text-gray-300",
            userButtonPopoverActionButtonIcon: "text-gray-400",
            userButtonPopoverFooter: "hidden"
          }
        }}
        userProfileMode="navigation"
        userProfileUrl="/profile"
        afterSignOutUrl="/"
      >
        <UserButton.MenuItems>
          <UserButton.Action
            label="Dashboard"
            labelIcon={<Settings className="w-4 h-4" />}
            onClick={() => window.location.href = '/dashboard'}
          />
          {subscription?.status !== 'active' && (
            <UserButton.Action
              label="Upgrade to Premium"
              labelIcon={<Crown className="w-4 h-4" />}
              onClick={() => window.location.href = '/premium'}
            />
          )}
          <UserButton.Action
            label="Sign out"
            labelIcon={<LogOut className="w-4 h-4" />}
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
};

export default ClerkUserButton;