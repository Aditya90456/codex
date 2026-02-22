import { useState } from 'react';
import { useOperator, PERMISSIONS } from '../../contexts/OperatorContext';
import { 
  Users, FileText, BarChart3, Settings, Shield, 
  MessageSquare, AlertTriangle, Activity, Database 
} from 'lucide-react';
import UserManagement from './UserManagement';
import ContentModeration from './ContentModeration';
import Analytics from './Analytics';
import SystemSettings from './SystemSettings';
import ProblemManagement from './ProblemManagement';
import SupportTickets from './SupportTickets';

const OperatorDashboard = () => {
  const { isOperator, operatorRole, hasPermission } = useOperator();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOperator) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have operator permissions</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Activity, 
      permission: null 
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      permission: PERMISSIONS.VIEW_USERS 
    },
    { 
      id: 'content', 
      label: 'Content', 
      icon: FileText, 
      permission: PERMISSIONS.VIEW_CONTENT 
    },
    { 
      id: 'problems', 
      label: 'Problems', 
      icon: Database, 
      permission: PERMISSIONS.CREATE_PROBLEMS 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      permission: PERMISSIONS.VIEW_ANALYTICS 
    },
    { 
      id: 'tickets', 
      label: 'Support', 
      icon: MessageSquare, 
      permission: PERMISSIONS.VIEW_TICKETS 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      permission: PERMISSIONS.MANAGE_SETTINGS 
    },
  ].filter(tab => !tab.permission || hasPermission(tab.permission));

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 px-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Operator Dashboard</h1>
            <p className="text-purple-100 mt-1">Role: {operatorRole}</p>
          </div>
          <Shield className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'content' && <ContentModeration />}
        {activeTab === 'problems' && <ProblemManagement />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'tickets' && <SupportTickets />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    </div>
  );
};

const OverviewTab = () => {
  const stats = [
    { label: 'Total Users', value: '12,543', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Active Today', value: '3,421', change: '+8%', icon: Activity, color: 'green' },
    { label: 'Problems', value: '1,234', change: '+5', icon: Database, color: 'purple' },
    { label: 'Open Tickets', value: '23', change: '-3', icon: MessageSquare, color: 'yellow' },
    { label: 'Flagged Content', value: '7', change: '-2', icon: AlertTriangle, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 text-${stat.color}-400`} />
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New user registered', user: 'john@example.com', time: '2 min ago' },
            { action: 'Problem submitted', user: 'admin', time: '15 min ago' },
            { action: 'Content flagged', user: 'moderator', time: '1 hour ago' },
            { action: 'Ticket resolved', user: 'support', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-sm text-gray-400">{activity.user}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
