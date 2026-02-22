import { useState } from 'react';
import { motion } from 'framer-motion';
import LeaderboardPage from '../components/Leaderboard/LeaderboardPage';
import BadgesShowcase from '../components/Leaderboard/BadgesShowcase';
import UserProfileStats from '../components/Leaderboard/UserProfileStats';
import { Trophy, Award, BarChart3 } from 'lucide-react';

const LeaderboardFullPage = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');

  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'stats', label: 'My Stats', icon: BarChart3 },
    { id: 'badges', label: 'Badges', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'leaderboard' && <LeaderboardPage />}
        {activeTab === 'stats' && <UserProfileStats />}
        {activeTab === 'badges' && <BadgesShowcase />}
      </div>
    </div>
  );
};

export default LeaderboardFullPage;
