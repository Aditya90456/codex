import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, GitPullRequest, Users, Code2, Heart, ExternalLink, Github } from 'lucide-react';

const OpenSourcePage = () => {
  const [activeSection, setActiveSection] = useState('contribute');

  const stats = [
    { icon: Star, label: "GitHub Stars", value: "2.5K+", color: "text-yellow-400" },
    { icon: GitBranch, label: "Forks", value: "450+", color: "text-blue-400" },
    { icon: GitPullRequest, label: "Pull Requests", value: "1.2K+", color: "text-green-400" },
    { icon: Users, label: "Contributors", value: "180+", color: "text-purple-400" }
  ];

  const contributionAreas = [
    {
      title: "Frontend Development",
      icon: Code2,
      description: "Work on React components, UI/UX improvements, and interactive features",
      skills: ["React", "JavaScript", "CSS", "Tailwind"],
      difficulty: "Beginner to Advanced"
    },
    {
      title: "Backend Development",
      icon: GitBranch,
      description: "Build APIs, database schemas, and server-side logic",
      skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
      difficulty: "Intermediate to Advanced"
    },
    {
      title: "AI/ML Integration",
      icon: Star,
      description: "Implement AI-powered features like code completion and suggestions",
      skills: ["Python", "TensorFlow", "NLP", "Machine Learning"],
      difficulty: "Advanced"
    },
    {
      title: "Documentation",
      icon: Heart,
      description: "Improve docs, write tutorials, and create guides for users",
      skills: ["Technical Writing", "Markdown", "Communication"],
      difficulty: "Beginner"
    }
  ];

  const goodFirstIssues = [
    {
      title: "Add dark mode toggle animation",
      labels: ["good first issue", "frontend", "enhancement"],
      difficulty: "Easy",
      repo: "codex-frontend"
    },
    {
      title: "Fix typos in documentation",
      labels: ["good first issue", "documentation"],
      difficulty: "Easy",
      repo: "codex-docs"
    },
    {
      title: "Improve error messages in API",
      labels: ["good first issue", "backend"],
      difficulty: "Medium",
      repo: "codex-backend"
    },
    {
      title: "Add unit tests for auth module",
      labels: ["good first issue", "testing"],
      difficulty: "Medium",
      repo: "codex-backend"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Github className="w-20 h-20 mx-auto mb-6 text-blue-400" />
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Open Source at Codex
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join our community of developers building the future of coding education. 
              Every contribution matters, from code to documentation.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://github.com/your-org/codex"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
              >
                <Github className="w-5 h-5" />
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
              <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all">
                Contribution Guide
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center"
            >
              <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-4 border-b border-gray-700 mb-8">
          {['contribute', 'areas', 'issues'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 font-semibold capitalize transition-all ${
                activeSection === section
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {section === 'issues' ? 'Good First Issues' : section}
            </button>
          ))}
        </div>

        {/* How to Contribute */}
        {activeSection === 'contribute' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Fork the Repository</h3>
                    <p className="text-gray-400">
                      Start by forking our repository on GitHub. This creates your own copy where you can make changes.
                    </p>
                    <code className="block mt-2 bg-gray-900 p-3 rounded text-sm text-green-400">
                      git clone https://github.com/your-username/codex.git
                    </code>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Set Up Development Environment</h3>
                    <p className="text-gray-400">
                      Install dependencies and run the project locally. Check our README for detailed setup instructions.
                    </p>
                    <code className="block mt-2 bg-gray-900 p-3 rounded text-sm text-green-400">
                      npm install && npm run dev
                    </code>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Find an Issue</h3>
                    <p className="text-gray-400">
                      Browse our issues labeled "good first issue" or "help wanted". Comment on the issue to let us know you're working on it.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Create a Branch</h3>
                    <p className="text-gray-400">
                      Create a new branch for your changes. Use a descriptive name that reflects what you're working on.
                    </p>
                    <code className="block mt-2 bg-gray-900 p-3 rounded text-sm text-green-400">
                      git checkout -b feature/your-feature-name
                    </code>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Make Your Changes</h3>
                    <p className="text-gray-400">
                      Write clean, well-documented code. Follow our coding standards and add tests if applicable.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    6
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Submit a Pull Request</h3>
                    <p className="text-gray-400">
                      Push your changes and create a pull request. Describe what you've done and reference the issue number.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-xl border border-blue-500/50">
              <h3 className="text-2xl font-bold mb-4">Code of Conduct</h3>
              <p className="text-gray-300">
                We are committed to providing a welcoming and inclusive environment. Please read and follow our 
                Code of Conduct to ensure a positive experience for everyone in our community.
              </p>
            </div>
          </motion.div>
        )}

        {/* Contribution Areas */}
        {activeSection === 'areas' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {contributionAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all"
              >
                <area.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">{area.title}</h3>
                <p className="text-gray-400 mb-4">{area.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {area.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Difficulty: <span className="text-blue-400 font-semibold">{area.difficulty}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Good First Issues */}
        {activeSection === 'issues' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {goodFirstIssues.map((issue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{issue.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    issue.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {issue.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {issue.labels.map((label, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                      {label}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  Repository: <span className="text-blue-400">{issue.repo}</span>
                </div>
              </motion.div>
            ))}
            
            <div className="text-center mt-8">
              <a
                href="https://github.com/your-org/codex/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
              >
                View All Issues on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OpenSourcePage;
