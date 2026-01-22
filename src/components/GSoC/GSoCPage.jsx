import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Award, Calendar, BookOpen, ExternalLink } from 'lucide-react';

const GSoCPage = () => {
  const [activeTab, setActiveTab] = useState('about');

  const projects = [
    {
      title: "AI-Powered Code Assistant",
      duration: "175 hours"
    },
    {
      title: "Mobile App Development",
      difficulty: "Medium",
      mentor: "Available",
      description: "Create native mobile applications for iOS and Android platforms",
      skills: ["React Native", "Mobile UI/UX", "API Integration"],
      duration: "350 hours"
    },
    {
      title: "DSA Visualization Engine",
      difficulty: "Hard",
      mentor: "Available",
      description: "Build interactive 3D visualizations for data structures and algorithms",
      skills: ["Three.js", "WebGL", "React", "Algorithms"],
      duration: "350 hours"
    }
  ];

  const timeline = [
    { date: "Feb 1 - Feb 19", event: "Organization Applications", status: "upcoming" },
    { date: "Feb 21", event: "Organizations Announced", status: "upcoming" },
    { date: "Mar 18 - Apr 2", event: "Contributor Application Period", status: "upcoming" },
    { date: "May 1", event: "Accepted Contributors Announced", status: "upcoming" },
    { date: "May 1 - May 26", event: "Community Bonding", status: "upcoming" },
    { date: "May 27 - Aug 19", event: "Coding Period", status: "upcoming" },
    { date: "Aug 26 - Sep 2", event: "Final Evaluation", status: "upcoming" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Google Summer of Code 2026
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join us in building the future of coding education. Contribute to open source and get mentored by industry experts.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-4 border-b border-gray-700 mb-8">
          {['about', 'projects', 'timeline', 'apply'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* About Section */}
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <Code className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Open Source</h3>
                <p className="text-gray-400">Contribute to a real-world project used by thousands of developers</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <Users className="w-12 h-12 text-pink-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Mentorship</h3>
                <p className="text-gray-400">Get guidance from experienced developers throughout your journey</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <Award className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Stipend</h3>
                <p className="text-gray-400">Receive a stipend from Google for your contributions</p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <h2 className="text-3xl font-bold mb-4">About Our Organization</h2>
              <p className="text-gray-300 mb-4">
                Codex is a modern coding platform that combines interactive learning, real-time collaboration, 
                and AI-powered assistance to help developers learn and grow. Our mission is to make coding 
                education accessible, engaging, and effective for everyone.
              </p>
              <p className="text-gray-300">
                As a GSoC contributor, you'll work on cutting-edge features that impact thousands of users, 
                learn industry best practices, and become part of a vibrant open-source community.
              </p>
            </div>
          </motion.div>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400">{project.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    project.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {project.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Duration: {project.duration}</span>
                  <span>Mentor: {project.mentor}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Timeline Section */}
        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
              >
                <Calendar className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.event}</h3>
                  <p className="text-gray-400">{item.date}</p>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {item.status}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Apply Section */}
        {activeTab === 'apply' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <h2 className="text-3xl font-bold mb-6">How to Apply</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">1</span>
                    Get Familiar with the Project
                  </h3>
                  <p className="text-gray-400 ml-10">
                    Explore our codebase, try out the platform, and understand our tech stack. Join our community channels.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">2</span>
                    Make Your First Contribution
                  </h3>
                  <p className="text-gray-400 ml-10">
                    Start with good first issues, fix bugs, or improve documentation. Show us your coding style and commitment.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">3</span>
                    Write Your Proposal
                  </h3>
                  <p className="text-gray-400 ml-10">
                    Choose a project idea, discuss with mentors, and write a detailed proposal following our template.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">4</span>
                    Submit on GSoC Website
                  </h3>
                  <p className="text-gray-400 ml-10">
                    Submit your proposal through the official GSoC website during the application period.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <a
                  href="https://github.com/your-org/codex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  View on GitHub
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://summerofcode.withgoogle.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
                >
                  GSoC Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-8 rounded-xl border border-purple-500/50">
              <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
              <p className="text-gray-300 mb-4">
                Join our community channels to connect with mentors and other contributors:
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all">
                  Discord
                </button>
                <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all">
                  Slack
                </button>
                <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all">
                  Email
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GSoCPage;
