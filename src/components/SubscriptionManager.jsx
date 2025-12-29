import { useState, useEffect } from 'react';
import {
  Crown,
  Calendar,
  CreditCard,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Star,
  Zap,
  Shield,
  Users,
  Code,
  Sparkles
} from 'lucide-react';

const SubscriptionManager = ({ isOpen, onClose, userSubscription, onUpgrade, onCancel }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [billingHistory, setBillingHistory] = useState([]);

  useEffect(() => {
    // Mock billing history
    setBillingHistory([
      {
        id: 1,
        date: '2024-01-15',
        amount: 4999,
        plan: 'Premium Yearly',
        status: 'paid',
        invoice: 'INV-2024-001'
      },
      {
        id: 2,
        date: '2023-12-15',
        amount: 499,
        plan: 'Premium Monthly',
        status: 'paid',
        invoice: 'INV-2023-012'
      },
      {
        id: 3,
        date: '2023-11-15',
        amount: 499,
        plan: 'Premium Monthly',
        status: 'paid',
        invoice: 'INV-2023-011'
      }
    ]);
  }, []);

  const plans = [
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: 499,
      originalPrice: 699,
      duration: 'month',
      features: [
        'Unlimited private projects',
        'Advanced code analysis',
        'Priority support',
        'Exclusive templates',
        'AI code suggestions'
      ],
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'yearly',
      name: 'Premium Yearly',
      price: 4999,
      originalPrice: 8388,
      duration: 'year',
      features: [
        'All monthly features',
        '2 months free',
        'Advanced debugging tools',
        'Custom themes',
        'API access',
        'Team collaboration'
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      savings: '40% OFF'
    },
    {
      id: 'lifetime',
      name: 'Premium Lifetime',
      price: 9999,
      originalPrice: 19999,
      duration: 'lifetime',
      features: [
        'All yearly features',
        'Lifetime updates',
        'Priority feature requests',
        'Direct developer access',
        'Custom integrations',
        'Revenue sharing program'
      ],
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      savings: '50% OFF'
    }
  ];

  const getCurrentPlan = () => {
    if (!userSubscription) return null;
    return plans.find(plan => plan.id === userSubscription.planId) || null;
  };

  const getSubscriptionStatus = () => {
    if (!userSubscription) return 'inactive';
    
    const now = new Date();
    const expiryDate = new Date(userSubscription.expiresAt);
    
    if (expiryDate < now) return 'expired';
    if (userSubscription.status === 'cancelled') return 'cancelled';
    if (userSubscription.status === 'active') return 'active';
    
    return 'inactive';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    if (!userSubscription) return 0;
    
    const now = new Date();
    const expiryDate = new Date(userSubscription.expiresAt);
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const renderCurrentSubscription = () => {
    const currentPlan = getCurrentPlan();
    const status = getSubscriptionStatus();
    const daysRemaining = getDaysRemaining();

    if (!currentPlan || status === 'inactive') {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Active Subscription</h3>
          <p className="text-gray-400 mb-6">
            Upgrade to Premium to unlock all features and boost your coding experience.
          </p>
          <button
            onClick={() => setActiveTab('plans')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View Plans
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Current Plan Card */}
        <div className={`bg-gradient-to-r ${currentPlan.color} p-1 rounded-xl`}>
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`bg-gradient-to-r ${currentPlan.color} p-2 rounded-lg`}>
                  {currentPlan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{currentPlan.name}</h3>
                  <p className="text-gray-400">Active Subscription</p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === 'active' ? 'bg-green-500/20 text-green-400' :
                status === 'expired' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Next Billing</span>
                </div>
                <p className="text-white font-medium">
                  {userSubscription.expiresAt ? formatDate(userSubscription.expiresAt) : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Amount</span>
                </div>
                <p className="text-white font-medium">₹{currentPlan.price}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Days Left</span>
                </div>
                <p className="text-white font-medium">
                  {currentPlan.duration === 'lifetime' ? '∞' : daysRemaining}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Your Premium Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {status === 'active' && daysRemaining > 0 && (
                <>
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Upgrade Plan
                  </button>
                  <button
                    onClick={onCancel}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </>
              )}
              
              {(status === 'expired' || status === 'cancelled') && (
                <button
                  onClick={() => setActiveTab('plans')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Reactivate Subscription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Warnings */}
        {status === 'cancelled' && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-yellow-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Subscription Cancelled</span>
            </div>
            <p className="text-sm text-yellow-200">
              Your subscription will end on {formatDate(userSubscription.expiresAt)}. 
              You'll lose access to premium features after this date.
            </p>
          </div>
        )}

        {status === 'active' && daysRemaining <= 7 && (
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-orange-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Renewal Reminder</span>
            </div>
            <p className="text-sm text-orange-200">
              Your subscription expires in {daysRemaining} days. Make sure your payment method is up to date.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h3>
        <p className="text-gray-400">Upgrade or change your subscription plan</p>
      </div>

      <div className="grid gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-gray-800 rounded-xl p-6 border-2 transition-all duration-200 ${
              plan.popular ? 'border-purple-500' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`bg-gradient-to-r ${plan.color} p-2 rounded-lg`}>
                  {plan.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                  <p className="text-sm text-gray-400">
                    Billed {plan.duration === 'lifetime' ? 'once' : `per ${plan.duration}`}
                  </p>
                </div>
              </div>

              {plan.savings && (
                <span className="bg-green-500/20 text-green-400 text-sm px-2 py-1 rounded-full">
                  {plan.savings}
                </span>
              )}
            </div>

            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-3xl font-bold text-white">₹{plan.price}</span>
              <span className="text-lg text-gray-400 line-through">₹{plan.originalPrice}</span>
            </div>

            <div className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onUpgrade(plan.id)}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {getCurrentPlan()?.id === plan.id ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Billing History</h3>
        <p className="text-gray-400">View and download your past invoices</p>
      </div>

      <div className="space-y-3">
        {billingHistory.map((bill) => (
          <div key={bill.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  bill.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <h4 className="font-medium text-white">{bill.plan}</h4>
                  <p className="text-sm text-gray-400">{formatDate(bill.date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-white">₹{bill.amount}</p>
                  <p className="text-sm text-gray-400">{bill.invoice}</p>
                </div>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {billingHistory.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Billing History</h3>
          <p className="text-gray-400">Your billing history will appear here once you make a purchase.</p>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Subscription Manager</h2>
              <p className="text-sm text-gray-400">Manage your premium subscription</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'current', label: 'Current Plan', icon: Crown },
              { id: 'plans', label: 'All Plans', icon: Star },
              { id: 'billing', label: 'Billing', icon: CreditCard }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'current' && renderCurrentSubscription()}
          {activeTab === 'plans' && renderPlans()}
          {activeTab === 'billing' && renderBilling()}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;