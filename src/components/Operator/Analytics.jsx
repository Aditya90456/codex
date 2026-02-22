import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Daily Active Users', value: '3,421', change: '+12%', icon: Users },
          { label: 'Problems Solved', value: '8,234', change: '+18%', icon: Activity },
          { label: 'Avg Session Time', value: '24m', change: '+5%', icon: TrendingUp },
          { label: 'Completion Rate', value: '67%', change: '+3%', icon: BarChart3 },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-blue-400" />
                <span className="text-sm font-medium text-green-400">{metric.change}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart Component Here
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Problem Difficulty Distribution</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart Component Here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
