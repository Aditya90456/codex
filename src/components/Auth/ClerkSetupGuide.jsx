import { useState } from 'react';
import { Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';

const ClerkSetupGuide = () => {
  const [copiedStep, setCopiedStep] = useState(null);

  const copyToClipboard = (text, step) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      title: "Create Clerk Account",
      description: "Sign up for a free Clerk account",
      action: "Go to dashboard.clerk.com",
      link: "https://dashboard.clerk.com"
    },
    {
      title: "Create Application",
      description: "Create a new application in your Clerk dashboard",
      action: "Click 'Add application' and choose your settings"
    },
    {
      title: "Get API Keys",
      description: "Copy your publishable key from the API Keys section",
      action: "Navigate to API Keys → Copy Publishable key"
    },
    {
      title: "Update Environment",
      description: "Add your Clerk key to your .env file",
      code: "VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here",
      copyText: "VITE_CLERK_PUBLISHABLE_KEY="
    },
    {
      title: "Restart Server",
      description: "Restart your development server to load the new environment variables",
      code: "npm run dev",
      copyText: "npm run dev"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-xl border border-gray-700 p-8">
        <div className="text-center mb-8">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Clerk Setup Required
          </h1>
          <p className="text-gray-400">
            Follow these steps to configure Clerk authentication
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-600">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 mb-3">
                    {step.description}
                  </p>
                  
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <ExternalLink size={16} />
                      {step.action}
                    </a>
                  )}
                  
                  {step.code && (
                    <div className="mt-3">
                      <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                        <div className="flex items-center justify-between">
                          <code className="text-green-400 text-sm font-mono">
                            {step.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(step.copyText, index)}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                          >
                            {copiedStep === index ? (
                              <>
                                <Check size={12} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {step.action && !step.link && (
                    <p className="text-blue-400 text-sm font-medium">
                      → {step.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-2">💡 Pro Tip</h4>
          <p className="text-gray-300 text-sm">
            Make sure your publishable key starts with <code className="bg-gray-800 px-1 rounded">pk_test_</code> for development 
            or <code className="bg-gray-800 px-1 rounded">pk_live_</code> for production.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClerkSetupGuide;