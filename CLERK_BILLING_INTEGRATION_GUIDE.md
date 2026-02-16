# Clerk Billing Integration Guide

## Overview

This guide explains how to integrate Clerk Billing into your Codex Playground platform to offer subscription-based access to premium features.

## What is Clerk Billing?

Clerk Billing is a subscription management system that integrates with Stripe for payment processing. It allows you to:
- Create subscription plans (monthly/annual)
- Manage customer subscriptions
- Handle upgrades/downgrades
- Process recurring payments
- Track subscription lifecycle

## Business Model Options

### Option 1: B2C SaaS (Individual Users)
Charge individual developers for premium features:
- Pro Plan: $9.99/month
- Premium Plan: $19.99/month
- Enterprise Plan: $49.99/month

### Option 2: B2B SaaS (Organizations)
Charge companies/teams for organization-wide access:
- Team Plan: $99/month (up to 10 users)
- Business Plan: $299/month (up to 50 users)
- Enterprise Plan: Custom pricing

### Option 3: Hybrid Model (Recommended)
Combine both individual and organization subscriptions.

## Setup Steps

### 1. Enable Clerk Billing in Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to "Billing" section
4. Click "Enable Billing"

### 2. Connect Stripe Account

**Development Environment:**
```
1. Create a Stripe test account
2. Get your Stripe test API keys
3. Connect to Clerk (test mode)
```

**Production Environment:**
```
1. Create a separate Stripe production account
2. Get your Stripe live API keys
3. Connect to Clerk (live mode)
```

**Important Notes:**
- Must use separate Stripe accounts for dev and prod
- Cannot use existing Stripe account linked to another platform
- All payments processed in USD only

### 3. Create Subscription Plans

Navigate to "Subscription Plans" in Clerk Dashboard:

**Free Plan:**
- Price: $0/month
- Features:
  - 50 problem submissions/month
  - Basic DSA problems
  - Community support
  - Basic certificates

**Pro Plan:**
- Price: $9.99/month or $99/year (save 17%)
- Features:
  - Unlimited problem submissions
  - All DSA + Company problems
  - LLD problems access
  - AI code explanations
  - AI hints and solutions
  - Priority support
  - Premium certificates
  - GitHub integration
  - Code sharing

**Premium Plan:**
- Price: $19.99/month or $199/year (save 17%)
- Features:
  - Everything in Pro
  - 1-on-1 mentorship sessions (2/month)
  - Custom problem sets
  - Interview preparation
  - Resume review
  - Mock interviews
  - Career guidance

**Enterprise Plan:**
- Price: Custom
- Features:
  - Everything in Premium
  - Unlimited mentorship
  - Team collaboration
  - Custom integrations
  - Dedicated support
  - SLA guarantees

### 4. Install Clerk SDK (Already Installed)

Your project already has `@clerk/clerk-react` installed. No additional packages needed.

### 5. Add Environment Variables

Add to `.env`:
```env
# Clerk Billing
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

Add to `backend/.env`:
```env
# Clerk Billing Webhook
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Implementation

### 1. Create Subscription Plans Component

```jsx
// src/components/SubscriptionPlans.jsx
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Check, Zap, Crown, Building2 } from 'lucide-react';

const SubscriptionPlans = () => {
  const { user } = useUser();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Zap,
      price: { monthly: 0, annual: 0 },
      features: [
        '50 submissions/month',
        'Basic DSA problems',
        'Community support',
        'Basic certificates'
      ],
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      price: { monthly: 9.99, annual: 99 },
      popular: true,
      features: [
        'Unlimited submissions',
        'All DSA + Company problems',
        'LLD problems',
        'AI explanations & hints',
        'Premium certificates',
        'GitHub integration',
        'Priority support'
      ],
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      price: { monthly: 19.99, annual: 199 },
      features: [
        'Everything in Pro',
        '2 mentorship sessions/month',
        'Custom problem sets',
        'Interview prep',
        'Resume review',
        'Mock interviews',
        'Career guidance'
      ],
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building2,
      price: { monthly: 'Custom', annual: 'Custom' },
      features: [
        'Everything in Premium',
        'Unlimited mentorship',
        'Team collaboration',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantees'
      ],
      color: 'from-orange-500 to-red-600'
    }
  ];

  const handleSubscribe = async (planId) => {
    try {
      // Redirect to Clerk's checkout page
      const checkoutUrl = `${window.location.origin}/subscribe/${planId}?billing=${billingCycle}`;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Unlock premium features and accelerate your coding journey
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-800 p-2 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = plan.price[billingCycle];
            
            return (
              <div
                key={plan.id}
                className={`relative bg-gray-800 border-2 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-700'
                } rounded-2xl p-6 hover:shadow-2xl transition-all ${
                  plan.popular ? 'transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>

                <div className="mb-6">
                  {typeof price === 'number' ? (
                    <>
                      <span className="text-4xl font-bold text-white">
                        ${price}
                      </span>
                      <span className="text-gray-400">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {price}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={plan.id === 'free'}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.id === 'free'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.id === 'free' ? 'Current Plan' : 'Subscribe Now'}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-left">
            <details className="bg-gray-800 rounded-lg p-4">
              <summary className="font-semibold text-white cursor-pointer">
                Can I cancel anytime?
              </summary>
              <p className="text-gray-400 mt-2">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </details>
            <details className="bg-gray-800 rounded-lg p-4">
              <summary className="font-semibold text-white cursor-pointer">
                Can I upgrade or downgrade my plan?
              </summary>
              <p className="text-gray-400 mt-2">
                Yes! Upgrades take effect immediately. Downgrades take effect at the end of your current billing cycle.
              </p>
            </details>
            <details className="bg-gray-800 rounded-lg p-4">
              <summary className="font-semibold text-white cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="text-gray-400 mt-2">
                We accept all major credit cards (Visa, Mastercard, American Express) through Stripe.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
```

### 2. Create Checkout Page Component

```jsx
// src/components/CheckoutPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

const CheckoutPage = () => {
  const { planId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const billingCycle = searchParams.get('billing') || 'monthly';

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        // Call Clerk's subscription API
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId,
            billingCycle,
            userId: user.id,
            userEmail: user.emailAddresses[0].emailAddress
          })
        });

        const data = await response.json();

        if (data.checkoutUrl) {
          // Redirect to Clerk's checkout page
          window.location.href = data.checkoutUrl;
        } else {
          setError('Failed to create checkout session');
          setLoading(false);
        }
      } catch (err) {
        console.error('Checkout error:', err);
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    };

    if (user) {
      createCheckoutSession();
    }
  }, [planId, billingCycle, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CheckoutPage;
```

### 3. Create Backend Checkout Route

```javascript
// backend/routes/billing.js
const express = require('express');
const router = express.Router();
const { clerkClient } = require('@clerk/clerk-sdk-node');

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { planId, billingCycle, userId, userEmail } = req.body;

    // Create subscription in Clerk
    const subscription = await clerkClient.subscriptions.create({
      userId,
      planId,
      billingCycle,
      successUrl: `${process.env.FRONTEND_URL}/subscription/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/pricing`
    });

    res.json({
      checkoutUrl: subscription.checkoutUrl
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
```

### 4. Add Routes to App

```jsx
// src/App-ClerkNew.jsx
import SubscriptionPlans from './components/SubscriptionPlans';
import CheckoutPage from './components/CheckoutPage';

// Add these routes
<Route path="/pricing" element={<SubscriptionPlans />} />
<Route 
  path="/subscribe/:planId" 
  element={
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  } 
/>
<Route path="/subscription/success" element={<SubscriptionSuccess />} />
```

### 5. Create Subscription Hook

```javascript
// src/hooks/useSubscription.js
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

export const useSubscription = () => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        // Get subscription from user metadata
        const sub = user.publicMetadata?.subscription;
        setSubscription(sub || { plan: 'free', status: 'active' });
      } catch (error) {
        console.error('Subscription fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const hasFeature = (feature) => {
    if (!subscription) return false;

    const features = {
      free: ['basic_problems', 'community_support'],
      pro: ['unlimited_submissions', 'all_problems', 'ai_features', 'github'],
      premium: ['mentorship', 'custom_problems', 'interview_prep'],
      enterprise: ['team_collaboration', 'custom_integrations']
    };

    const planFeatures = features[subscription.plan] || [];
    return planFeatures.includes(feature);
  };

  return {
    subscription,
    loading,
    hasFeature,
    isPro: subscription?.plan === 'pro',
    isPremium: subscription?.plan === 'premium',
    isEnterprise: subscription?.plan === 'enterprise'
  };
};
```

### 6. Protect Features Based on Subscription

```jsx
// Example: Protect AI features
import { useSubscription } from '../hooks/useSubscription';

const AICodeExplainer = () => {
  const { hasFeature } = useSubscription();

  if (!hasFeature('ai_features')) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg text-center">
        <p className="text-gray-400 mb-4">
          AI features are available in Pro plan and above
        </p>
        <button
          onClick={() => window.location.href = '/pricing'}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  // Show AI features
  return <div>AI Code Explainer Content</div>;
};
```

## Webhooks Setup

### 1. Create Webhook Endpoint

```javascript
// backend/routes/webhooks.js
const express = require('express');
const router = express.Router();
const { Webhook } = require('svix');

router.post('/clerk', async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  // Get headers
  const headers = req.headers;
  const payload = JSON.stringify(req.body);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  // Handle events
  const { type, data } = evt;

  switch (type) {
    case 'subscription.created':
      console.log('Subscription created:', data);
      // Update user metadata
      break;

    case 'subscription.updated':
      console.log('Subscription updated:', data);
      // Update user metadata
      break;

    case 'subscription.deleted':
      console.log('Subscription cancelled:', data);
      // Downgrade user to free plan
      break;

    case 'payment.succeeded':
      console.log('Payment succeeded:', data);
      // Send confirmation email
      break;

    case 'payment.failed':
      console.log('Payment failed:', data);
      // Send payment failure notification
      break;

    default:
      console.log('Unhandled event type:', type);
  }

  res.json({ received: true });
});

module.exports = router;
```

### 2. Register Webhook in Clerk Dashboard

1. Go to Clerk Dashboard → Webhooks
2. Click "Add Endpoint"
3. Enter: `https://your-domain.com/api/webhooks/clerk`
4. Select events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`
   - `payment.succeeded`
   - `payment.failed`
5. Copy webhook secret to `.env`

## Testing

### Test Cards (Stripe Test Mode)

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Expired Card: 4000 0000 0000 0069
```

Use any future expiry date and any 3-digit CVC.

## Important Limitations

- **Currency**: USD only
- **Refunds**: Not supported (must refund through Stripe)
- **Tax/VAT**: Not supported yet
- **3D Secure**: Not supported
- **Countries**: Not available in Brazil, India, Malaysia, Mexico, Singapore, Thailand

## Next Steps

1. Set up Stripe account (test and production)
2. Enable Clerk Billing in dashboard
3. Create subscription plans
4. Implement components
5. Set up webhooks
6. Test with test cards
7. Deploy to production
8. Switch to live Stripe keys

## Support

- [Clerk Billing Docs](https://clerk.com/docs/billing)
- [Stripe Documentation](https://stripe.com/docs)
- [Clerk Discord](https://clerk.com/discord)
