import { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Wallet,
  X,
  Check,
  Shield,
  Lock,
  Star,
  Crown,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, plan, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('method'); // method, details, processing, success
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    phoneNumber: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, Rupay',
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Google Pay, PhonePe, Paytm',
      popular: true
    },
    {
      id: 'paytm',
      name: 'Paytm Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Pay with Paytm balance',
      popular: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Shield className="w-6 h-6" />,
      description: 'All major banks supported',
      popular: false
    }
  ];

  const plans = {
    monthly: {
      name: 'Premium Monthly',
      price: 499,
      originalPrice: 699,
      duration: '1 Month',
      features: [
        'Unlimited private projects',
        'Advanced code analysis',
        'Priority support',
        'Exclusive templates',
        'AI code suggestions',
        'Team collaboration'
      ]
    },
    yearly: {
      name: 'Premium Yearly',
      price: 4999,
      originalPrice: 8388,
      duration: '12 Months',
      features: [
        'All monthly features',
        '2 months free',
        'Advanced debugging tools',
        'Custom themes',
        'API access',
        'White-label option'
      ],
      popular: true
    },
    lifetime: {
      name: 'Premium Lifetime',
      price: 9999,
      originalPrice: 19999,
      duration: 'Lifetime',
      features: [
        'All yearly features',
        'Lifetime updates',
        'Priority feature requests',
        'Direct developer access',
        'Custom integrations',
        'Revenue sharing program'
      ]
    }
  };

  const currentPlan = plans[plan] || plans.yearly;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success
      setPaymentStep('success');
      
      // Call success callback after a short delay
      setTimeout(() => {
        onPaymentSuccess({
          plan: currentPlan,
          method: selectedMethod,
          transactionId: 'TXN' + Date.now(),
          amount: currentPlan.price
        });
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
      setPaymentStep('method');
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Choose Payment Method</h3>
      
      <div className="grid gap-3">
        {paymentMethods.map(method => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`${selectedMethod === method.id ? 'text-blue-400' : 'text-gray-400'}`}>
                  {method.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{method.name}</span>
                    {method.popular && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{method.description}</p>
                </div>
              </div>
              
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-400'
              }`}>
                {selectedMethod === method.id && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => setPaymentStep('details')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <span>Continue</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderPaymentDetails = () => {
    if (selectedMethod === 'card') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Card Details</h3>
            <button
              onClick={() => setPaymentStep('method')}
              className="text-gray-400 hover:text-white"
            >
              Back
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength="19"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength="5"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                  maxLength="3"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      );
    }

    if (selectedMethod === 'upi') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">UPI Payment</h3>
            <button
              onClick={() => setPaymentStep('method')}
              className="text-gray-400 hover:text-white"
            >
              Back
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              placeholder="yourname@paytm"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <Smartphone className="w-4 h-4" />
              <span className="text-sm font-medium">Quick UPI Apps</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors">
                Google Pay
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors">
                PhonePe
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors">
                Paytm
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedMethod === 'paytm') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Paytm Wallet</h3>
            <button
              onClick={() => setPaymentStep('method')}
              className="text-gray-400 hover:text-white"
            >
              Back
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="8335873311"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, '').substring(0, 10))}
              maxLength="10"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-orange-400 mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Paytm Wallet Balance</span>
            </div>
            <p className="text-sm text-gray-300">
              You'll be redirected to Paytm to complete the payment using your wallet balance or linked payment methods.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Net Banking</h3>
          <button
            onClick={() => setPaymentStep('method')}
            className="text-gray-400 hover:text-white"
          >
            Back
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Your Bank
          </label>
          <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none">
            <option value="">Choose your bank</option>
            <option value="sbi">State Bank of India</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="icici">ICICI Bank</option>
            <option value="axis">Axis Bank</option>
            <option value="kotak">Kotak Mahindra Bank</option>
            <option value="pnb">Punjab National Bank</option>
          </select>
        </div>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Processing Payment</h3>
      <p className="text-gray-400">Please wait while we process your payment...</p>
      <div className="mt-4 text-sm text-gray-500">
        Do not close this window or press the back button
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Payment Successful!</h3>
      <p className="text-gray-400 mb-4">
        Welcome to Codex Premium! Your subscription is now active.
      </p>
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
        <p className="text-sm text-green-300">
          Transaction ID: TXN{Date.now()}
        </p>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Upgrade to Premium</h2>
              <p className="text-sm text-gray-400">{currentPlan.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left - Plan Details */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{currentPlan.name}</h3>
                  {currentPlan.popular && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-bold text-white">₹{currentPlan.price}</span>
                  <span className="text-lg text-gray-400 line-through">₹{currentPlan.originalPrice}</span>
                  <span className="text-sm text-green-400">
                    {Math.round((1 - currentPlan.price / currentPlan.originalPrice) * 100)}% OFF
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">
                  Billed for {currentPlan.duration}
                </p>

                <div className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-gray-400">
                  Your payment information is encrypted and secure. We use industry-standard security measures.
                </p>
              </div>
            </div>

            {/* Right - Payment Form */}
            <div>
              {paymentStep === 'method' && renderMethodSelection()}
              {paymentStep === 'details' && (
                <div>
                  {renderPaymentDetails()}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors mt-6 flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{currentPlan.price}</span>
                  </button>
                </div>
              )}
              {paymentStep === 'processing' && renderProcessing()}
              {paymentStep === 'success' && renderSuccess()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;