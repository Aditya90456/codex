import { useState } from 'react';
import { ExternalLink, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { ssoProviders } from '../../lib/clerk';

const SSOSetupGuide = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showKeys, setShowKeys] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Access Clerk Dashboard',
      description: 'Sign in to your Clerk account and select your application',
      action: 'Open Dashboard',
      url: 'https://dashboard.clerk.com',
    },
    {
      id: 2,
      title: 'Navigate to Social Connections',
      description: 'Go to Settings → Authentication → Social Connections',
      details: [
        'In the left sidebar, click "Social Connections"',
        'Or navigate to Settings → Authentication → Social Connections',
        'You\'ll see a list of available social providers',
      ],
    },
    {
      id: 3,
      title: 'Enable Social Providers',
      description: 'Configure Google, GitHub, LinkedIn, and other providers',
      providers: Object.entries(ssoProviders),
    },
    {
      id: 4,
      title: 'Test Your Setup',
      description: 'Verify that social login buttons appear and work correctly',
      testSteps: [
        'Go to your sign-up page (/sign-up)',
        'Look for social provider buttons',
        'Click a social button to test the flow',
        'Complete authentication and verify redirect',
      ],
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          SSO Setup Guide
        </h1>
        <p className="text-gray-400 text-lg">
          Configure social login providers for your application in just a few steps
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                activeStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-600 text-gray-400'
              }`}
            >
              {activeStep > step.id ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-2 transition-all ${
                  activeStep > step.id ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`${activeStep === step.id ? 'block' : 'hidden'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {step.id}
              </div>
              <h2 className="text-2xl font-bold text-white">{step.title}</h2>
            </div>

            <p className="text-gray-300 text-lg mb-6">{step.description}</p>

            {/* Step 1: Dashboard Access */}
            {step.id === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-blue-400 font-semibold mb-3">Quick Access</h3>
                  <p className="text-blue-300 mb-4">
                    Click the button below to open your Clerk dashboard in a new tab.
                  </p>
                  <a
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {step.action}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Your Current Configuration:</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Publishable Key:</span>
                    <code className="bg-gray-900 px-2 py-1 rounded text-green-400 font-mono text-xs">
                      {showKeys 
                        ? import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'Not configured'
                        : '••••••••••••••••••••••••••••••••'
                      }
                    </code>
                    <button
                      onClick={() => setShowKeys(!showKeys)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Navigation */}
            {step.id === 2 && (
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Navigation Steps:</h3>
                  <ol className="space-y-2">
                    {step.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-300 text-sm">
                    💡 <strong>Tip:</strong> If you can't find "Social Connections", look for "Authentication" 
                    in the settings menu, then select "Social Connections" from the submenu.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Provider Configuration */}
            {step.id === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {step.providers.map(([key, provider]) => (
                    <div
                      key={key}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <h4 className="text-white font-semibold">{provider.name}</h4>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{provider.description}</p>
                      <div className="text-xs text-gray-500">
                        Strategy: <code className="bg-gray-900 px-1 rounded">oauth_{key}</code>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h3 className="text-green-400 font-semibold mb-3">Quick Setup (Recommended)</h3>
                  <p className="text-green-300 mb-4">
                    For each provider you want to enable:
                  </p>
                  <ol className="space-y-2 text-green-300 text-sm">
                    <li>1. Click "Configure" next to the provider</li>
                    <li>2. Select "Use Clerk's shared OAuth app"</li>
                    <li>3. Click "Enable" or "Save"</li>
                    <li>4. Repeat for other providers</li>
                  </ol>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    <strong>Note:</strong> Using Clerk's shared OAuth apps is perfect for development and testing. 
                    For production, consider setting up your own OAuth applications for better branding and control.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Testing */}
            {step.id === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Testing Checklist:</h3>
                  <div className="space-y-3">
                    {step.testSteps.map((testStep, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 border-2 border-gray-500 rounded flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-gray-300">{testStep}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="/sign-up"
                    className="block bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center font-medium transition-colors"
                  >
                    Test Sign Up Page
                  </a>
                  <a
                    href="/sign-in"
                    className="block bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg text-center font-medium transition-colors"
                  >
                    Test Sign In Page
                  </a>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Success Indicators:</span>
                  </div>
                  <ul className="text-green-300 text-sm space-y-1 ml-7">
                    <li>• Social provider buttons are visible</li>
                    <li>• Clicking buttons redirects to provider</li>
                    <li>• Authentication completes successfully</li>
                    <li>• User is redirected back to your app</li>
                    <li>• User profile shows provider information</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                disabled={activeStep === steps.length}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                {activeStep === steps.length ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <a
          href="https://clerk.com/docs/authentication/social-connections"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
        >
          <ExternalLink className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-white font-medium">Clerk Documentation</div>
            <div className="text-gray-400 text-sm">Official SSO setup guide</div>
          </div>
        </a>

        <a
          href="https://dashboard.clerk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
        >
          <ExternalLink className="w-5 h-5 text-green-400" />
          <div>
            <div className="text-white font-medium">Clerk Dashboard</div>
            <div className="text-gray-400 text-sm">Configure your application</div>
          </div>
        </a>

        <div className="flex items-center gap-2 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <CheckCircle className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-white font-medium">Need Help?</div>
            <div className="text-gray-400 text-sm">Check console for errors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOSetupGuide;