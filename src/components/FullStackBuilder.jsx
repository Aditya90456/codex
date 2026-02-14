import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Layers, 
  Server, 
  Database, 
  Code, 
  Rocket,
  Download,
  Play,
  Settings,
  CheckCircle,
  Zap,
  Globe,
  Terminal,
  FileCode,
  Package,
  GitBranch,
  Cloud
} from 'lucide-react';
import Editor from '@monaco-editor/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FullStackBuilder = () => {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [projectConfig, setProjectConfig] = useState({
    name: '',
    description: '',
    frontend: 'react',
    backend: 'express',
    database: 'mongodb',
    auth: 'clerk',
    deployment: 'vercel',
    features: []
  });
  const [generatedCode, setGeneratedCode] = useState({
    frontend: {},
    backend: {},
    database: {},
    config: {}
  });
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('frontend');
  const [activeFile, setActiveFile] = useState('');

  const frontendOptions = [
    { id: 'react', name: 'React', icon: '⚛️', description: 'Modern UI with React + Vite' },
    { id: 'nextjs', name: 'Next.js', icon: '▲', description: 'Full-stack React framework' },
    { id: 'vue', name: 'Vue.js', icon: '💚', description: 'Progressive framework' },
    { id: 'angular', name: 'Angular', icon: '🅰️', description: 'Enterprise framework' }
  ];

  const backendOptions = [
    { id: 'express', name: 'Express.js', icon: '🚂', description: 'Fast Node.js framework' },
    { id: 'nestjs', name: 'NestJS', icon: '🐱', description: 'Progressive Node.js framework' },
    { id: 'fastapi', name: 'FastAPI', icon: '⚡', description: 'Modern Python API' },
    { id: 'django', name: 'Django', icon: '🎸', description: 'Python web framework' }
  ];

  const databaseOptions = [
    { id: 'mongodb', name: 'MongoDB', icon: '🍃', description: 'NoSQL database' },
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', description: 'Relational database' },
    { id: 'mysql', name: 'MySQL', icon: '🐬', description: 'Popular SQL database' },
    { id: 'firebase', name: 'Firebase', icon: '🔥', description: 'Google BaaS' }
  ];

  const authOptions = [
    { id: 'clerk', name: 'Clerk', icon: '🔐', description: 'Complete auth solution' },
    { id: 'auth0', name: 'Auth0', icon: '🛡️', description: 'Enterprise auth' },
    { id: 'jwt', name: 'JWT', icon: '🎫', description: 'Custom JWT auth' },
    { id: 'passport', name: 'Passport', icon: '📝', description: 'Node.js auth middleware' }
  ];

  const deploymentOptions = [
    { id: 'vercel', name: 'Vercel', icon: '▲', description: 'Frontend + Serverless' },
    { id: 'netlify', name: 'Netlify', icon: '🌐', description: 'JAMstack platform' },
    { id: 'aws', name: 'AWS', icon: '☁️', description: 'Amazon cloud' },
    { id: 'docker', name: 'Docker', icon: '🐳', description: 'Containerized deployment' }
  ];

  const featureOptions = [
    { id: 'crud', name: 'CRUD Operations', icon: '📝' },
    { id: 'realtime', name: 'Real-time Updates', icon: '⚡' },
    { id: 'file-upload', name: 'File Upload', icon: '📁' },
    { id: 'email', name: 'Email Service', icon: '📧' },
    { id: 'payment', name: 'Payment Integration', icon: '💳' },
    { id: 'search', name: 'Search Functionality', icon: '🔍' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'api', name: 'REST API', icon: '🔌' }
  ];

  const generateProject = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`${API_URL}/api/fullstack/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          config: projectConfig
        })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedCode(data.code);
        setStep(4);
        setActiveFile(Object.keys(data.code.frontend)[0] || '');
      }
    } catch (error) {
      console.error('Error generating project:', error);
      alert('Failed to generate project');
    } finally {
      setGenerating(false);
    }
  };

  const downloadProject = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fullstack/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          config: projectConfig,
          code: generatedCode
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectConfig.name || 'fullstack-project'}.zip`;
      a.click();
    } catch (error) {
      console.error('Error downloading project:', error);
      alert('Failed to download project');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= s 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
              : 'bg-gray-700 text-gray-400'
          }`}>
            {step > s ? <CheckCircle className="w-6 h-6" /> : s}
          </div>
          {s < 4 && (
            <div className={`w-16 h-1 ${step > s ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Project Details</h2>
        <p className="text-gray-400">Let's start with the basics</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Project Name</label>
          <input
            type="text"
            value={projectConfig.name}
            onChange={(e) => setProjectConfig({ ...projectConfig, name: e.target.value })}
            placeholder="my-awesome-app"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={projectConfig.description}
            onChange={(e) => setProjectConfig({ ...projectConfig, description: e.target.value })}
            placeholder="A full-stack application that..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <button
          onClick={() => setStep(2)}
          disabled={!projectConfig.name}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Choose Stack
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Stack</h2>
        <p className="text-gray-400">Select technologies for your project</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frontend */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-400" />
            Frontend
          </h3>
          <div className="space-y-3">
            {frontendOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setProjectConfig({ ...projectConfig, frontend: option.id })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  projectConfig.frontend === option.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <div className="font-bold">{option.name}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Backend */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Server className="w-6 h-6 text-green-400" />
            Backend
          </h3>
          <div className="space-y-3">
            {backendOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setProjectConfig({ ...projectConfig, backend: option.id })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  projectConfig.backend === option.id
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <div className="font-bold">{option.name}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Database */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-400" />
            Database
          </h3>
          <div className="space-y-3">
            {databaseOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setProjectConfig({ ...projectConfig, database: option.id })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  projectConfig.database === option.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <div className="font-bold">{option.name}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Authentication */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-yellow-400" />
            Authentication
          </h3>
          <div className="space-y-3">
            {authOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setProjectConfig({ ...projectConfig, auth: option.id })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  projectConfig.auth === option.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <div className="font-bold">{option.name}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 max-w-2xl mx-auto">
        <button
          onClick={() => setStep(1)}
          className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all"
        >
          Next: Features & Deploy
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Features & Deployment</h2>
        <p className="text-gray-400">Add features and choose deployment platform</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Features */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-400" />
            Features (Select multiple)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featureOptions.map((feature) => (
              <button
                key={feature.id}
                onClick={() => {
                  const features = projectConfig.features.includes(feature.id)
                    ? projectConfig.features.filter(f => f !== feature.id)
                    : [...projectConfig.features, feature.id];
                  setProjectConfig({ ...projectConfig, features });
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  projectConfig.features.includes(feature.id)
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="text-sm font-semibold">{feature.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Deployment */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Cloud className="w-6 h-6 text-cyan-400" />
            Deployment Platform
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {deploymentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setProjectConfig({ ...projectConfig, deployment: option.id })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  projectConfig.deployment === option.id
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <div className="text-sm font-semibold">{option.name}</div>
                <div className="text-xs text-gray-400 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Project Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Name:</span>
              <span className="ml-2 font-semibold">{projectConfig.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Frontend:</span>
              <span className="ml-2 font-semibold">{projectConfig.frontend}</span>
            </div>
            <div>
              <span className="text-gray-400">Backend:</span>
              <span className="ml-2 font-semibold">{projectConfig.backend}</span>
            </div>
            <div>
              <span className="text-gray-400">Database:</span>
              <span className="ml-2 font-semibold">{projectConfig.database}</span>
            </div>
            <div>
              <span className="text-gray-400">Auth:</span>
              <span className="ml-2 font-semibold">{projectConfig.auth}</span>
            </div>
            <div>
              <span className="text-gray-400">Deploy:</span>
              <span className="ml-2 font-semibold">{projectConfig.deployment}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">Features:</span>
              <span className="ml-2 font-semibold">{projectConfig.features.length} selected</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setStep(2)}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
          >
            Back
          </button>
          <button
            onClick={generateProject}
            disabled={generating}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Generating...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Generate Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const currentCode = activeTab === 'frontend' 
      ? generatedCode.frontend[activeFile] 
      : activeTab === 'backend'
      ? generatedCode.backend[activeFile]
      : activeTab === 'database'
      ? generatedCode.database[activeFile]
      : generatedCode.config[activeFile];

    const files = activeTab === 'frontend'
      ? Object.keys(generatedCode.frontend)
      : activeTab === 'backend'
      ? Object.keys(generatedCode.backend)
      : activeTab === 'database'
      ? Object.keys(generatedCode.database)
      : Object.keys(generatedCode.config);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            Project Generated!
          </h2>
          <p className="text-gray-400">Review your code and download the project</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-700">
          {['frontend', 'backend', 'database', 'config'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                const tabFiles = tab === 'frontend' ? Object.keys(generatedCode.frontend)
                  : tab === 'backend' ? Object.keys(generatedCode.backend)
                  : tab === 'database' ? Object.keys(generatedCode.database)
                  : Object.keys(generatedCode.config);
                setActiveFile(tabFiles[0] || '');
              }}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* File Explorer + Editor */}
        <div className="grid grid-cols-4 gap-4 h-[600px]">
          {/* File List */}
          <div className="col-span-1 bg-gray-800 rounded-lg p-4 overflow-auto">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Files
            </h3>
            <div className="space-y-1">
              {files.map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                    activeFile === file
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="col-span-3 bg-gray-900 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={currentCode || '// Select a file to view code'}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
          >
            Start New Project
          </button>
          <button
            onClick={downloadProject}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Project (.zip)
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Layers className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Full Stack Builder
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Create complete full-stack applications in minutes
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};

export default FullStackBuilder;
