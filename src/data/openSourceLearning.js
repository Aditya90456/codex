/**
 * Open Source Learning (OSL) Data
 * 
 * @license MIT
 * @copyright 2026 Codex Platform
 * 
 * Comprehensive guide to learning and contributing to open source
 */

export const openSourceLearning = {
  overview: {
    title: "Open Source Learning Path",
    description: "Master open source contribution from beginner to advanced",
    tagline: "Learn, Contribute, Grow in the Open Source Community",
    benefits: [
      "Build real-world experience",
      "Collaborate with global developers",
      "Improve your coding skills",
      "Build your portfolio",
      "Get noticed by recruiters",
      "Give back to the community"
    ]
  },

  levels: [
    {
      id: 1,
      level: "Beginner",
      title: "Getting Started with Open Source",
      duration: "2-4 weeks",
      color: "green",
      description: "Learn the basics of open source and make your first contribution",
      skills: ["Git basics", "GitHub workflow", "Reading documentation", "Communication"],
      modules: [
        {
          id: "1.1",
          title: "Understanding Open Source",
          topics: [
            {
              name: "What is Open Source?",
              description: "Learn about open source philosophy, history, and impact",
              resources: ["opensource.org", "Open Source Guide"],
              tasks: [
                "Read about open source history",
                "Understand different licenses (MIT, GPL, Apache)",
                "Learn about open source business models"
              ]
            },
            {
              name: "Why Contribute?",
              description: "Understand the benefits of contributing to open source",
              resources: ["GitHub Open Source Guide", "freeCodeCamp articles"],
              tasks: [
                "List personal goals for open source",
                "Research companies that value open source",
                "Join open source communities"
              ]
            },
            {
              name: "Open Source Etiquette",
              description: "Learn how to be a good community member",
              resources: ["Code of Conduct examples", "Communication guides"],
              tasks: [
                "Read project codes of conduct",
                "Learn professional communication",
                "Understand community guidelines"
              ]
            }
          ]
        },
        {
          id: "1.2",
          title: "Git & GitHub Fundamentals",
          topics: [
            {
              name: "Git Basics",
              description: "Master version control with Git",
              resources: ["Pro Git Book", "Git Documentation", "Learn Git Branching"],
              tasks: [
                "Install and configure Git",
                "Learn: init, clone, add, commit, push, pull",
                "Practice branching and merging",
                "Handle merge conflicts"
              ]
            },
            {
              name: "GitHub Workflow",
              description: "Learn GitHub features and collaboration",
              resources: ["GitHub Skills", "GitHub Docs"],
              tasks: [
                "Create GitHub account and profile",
                "Fork and clone repositories",
                "Create pull requests",
                "Use GitHub Issues and Projects"
              ]
            },
            {
              name: "Markdown & Documentation",
              description: "Write clear documentation",
              resources: ["Markdown Guide", "Documentation best practices"],
              tasks: [
                "Learn Markdown syntax",
                "Write a README file",
                "Document code changes",
                "Create contribution guidelines"
              ]
            }
          ]
        },
        {
          id: "1.3",
          title: "Making Your First Contribution",
          topics: [
            {
              name: "Finding Beginner-Friendly Projects",
              description: "Discover projects welcoming first-time contributors",
              resources: ["Good First Issue", "Up For Grabs", "First Timers Only"],
              tasks: [
                "Browse beginner-friendly labels",
                "Find projects matching your interests",
                "Read CONTRIBUTING.md files",
                "Join project communication channels"
              ]
            },
            {
              name: "Making Your First PR",
              description: "Submit your first pull request",
              resources: ["First Contributions repo", "How to Contribute guides"],
              tasks: [
                "Fix documentation typos",
                "Improve README files",
                "Add code comments",
                "Submit your first PR"
              ]
            },
            {
              name: "Code Review Process",
              description: "Learn to give and receive feedback",
              resources: ["Code Review Best Practices", "Google Code Review Guide"],
              tasks: [
                "Respond to review comments",
                "Make requested changes",
                "Learn from feedback",
                "Review others' PRs"
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      level: "Intermediate",
      title: "Active Open Source Contributor",
      duration: "2-3 months",
      color: "blue",
      description: "Become a regular contributor and build your reputation",
      skills: ["Code contribution", "Bug fixing", "Feature implementation", "Testing"],
      modules: [
        {
          id: "2.1",
          title: "Code Contributions",
          topics: [
            {
              name: "Understanding Codebases",
              description: "Navigate and understand large projects",
              resources: ["Code reading techniques", "Architecture documentation"],
              tasks: [
                "Clone and run projects locally",
                "Understand project structure",
                "Read existing code",
                "Use debugging tools"
              ]
            },
            {
              name: "Bug Fixing",
              description: "Find and fix bugs in open source projects",
              resources: ["Debugging guides", "Issue trackers"],
              tasks: [
                "Reproduce reported bugs",
                "Write failing tests",
                "Fix bugs and verify",
                "Document the fix"
              ]
            },
            {
              name: "Feature Implementation",
              description: "Add new features to projects",
              resources: ["Feature proposal templates", "Design docs"],
              tasks: [
                "Discuss feature ideas",
                "Write design proposals",
                "Implement features",
                "Add tests and documentation"
              ]
            }
          ]
        },
        {
          id: "2.2",
          title: "Testing & Quality",
          topics: [
            {
              name: "Writing Tests",
              description: "Ensure code quality with tests",
              resources: ["Testing frameworks", "TDD guides"],
              tasks: [
                "Learn project testing framework",
                "Write unit tests",
                "Write integration tests",
                "Achieve good code coverage"
              ]
            },
            {
              name: "CI/CD Pipelines",
              description: "Understand continuous integration",
              resources: ["GitHub Actions", "Travis CI", "CircleCI"],
              tasks: [
                "Understand CI/CD workflows",
                "Fix failing builds",
                "Add CI checks",
                "Optimize build times"
              ]
            },
            {
              name: "Code Quality Tools",
              description: "Use linters and formatters",
              resources: ["ESLint", "Prettier", "Black", "Pylint"],
              tasks: [
                "Set up linters locally",
                "Fix linting errors",
                "Configure formatters",
                "Maintain code standards"
              ]
            }
          ]
        },
        {
          id: "2.3",
          title: "Community Engagement",
          topics: [
            {
              name: "Helping Others",
              description: "Support other contributors",
              resources: ["Community forums", "Stack Overflow"],
              tasks: [
                "Answer questions in issues",
                "Help newcomers",
                "Review pull requests",
                "Mentor first-time contributors"
              ]
            },
            {
              name: "Documentation",
              description: "Improve project documentation",
              resources: ["Technical writing guides", "Docs as Code"],
              tasks: [
                "Write tutorials",
                "Create examples",
                "Update API docs",
                "Translate documentation"
              ]
            },
            {
              name: "Community Building",
              description: "Grow and nurture communities",
              resources: ["Community management guides"],
              tasks: [
                "Organize meetups",
                "Create content",
                "Engage on social media",
                "Build relationships"
              ]
            }
          ]
        }
      ]
    },
    {
      id: 3,
      level: "Advanced",
      title: "Open Source Leader & Maintainer",
      duration: "6+ months",
      color: "purple",
      description: "Lead projects, mentor others, and shape the open source ecosystem",
      skills: ["Project maintenance", "Leadership", "Mentoring", "Strategic planning"],
      modules: [
        {
          id: "3.1",
          title: "Project Maintenance",
          topics: [
            {
              name: "Becoming a Maintainer",
              description: "Take on maintainer responsibilities",
              resources: ["Maintainer guides", "Open Source Guides"],
              tasks: [
                "Understand maintainer duties",
                "Manage issues and PRs",
                "Make release decisions",
                "Handle conflicts"
              ]
            },
            {
              name: "Release Management",
              description: "Plan and execute releases",
              resources: ["Semantic Versioning", "Changelog guides"],
              tasks: [
                "Plan release cycles",
                "Write changelogs",
                "Tag releases",
                "Communicate updates"
              ]
            },
            {
              name: "Security & Compliance",
              description: "Handle security and legal issues",
              resources: ["Security best practices", "License compliance"],
              tasks: [
                "Handle security reports",
                "Review dependencies",
                "Ensure license compliance",
                "Create security policies"
              ]
            }
          ]
        },
        {
          id: "3.2",
          title: "Leadership & Mentoring",
          topics: [
            {
              name: "Mentoring Contributors",
              description: "Guide and develop new contributors",
              resources: ["Mentoring guides", "Teaching resources"],
              tasks: [
                "Create onboarding docs",
                "Mentor newcomers",
                "Provide constructive feedback",
                "Recognize contributions"
              ]
            },
            {
              name: "Building Teams",
              description: "Form and lead contributor teams",
              resources: ["Team building guides", "Leadership resources"],
              tasks: [
                "Identify potential maintainers",
                "Delegate responsibilities",
                "Build diverse teams",
                "Foster collaboration"
              ]
            },
            {
              name: "Conflict Resolution",
              description: "Handle disagreements professionally",
              resources: ["Conflict resolution guides", "Code of Conduct enforcement"],
              tasks: [
                "Mediate disputes",
                "Enforce code of conduct",
                "Make tough decisions",
                "Maintain healthy culture"
              ]
            }
          ]
        },
        {
          id: "3.3",
          title: "Strategic Growth",
          topics: [
            {
              name: "Project Sustainability",
              description: "Ensure long-term project health",
              resources: ["Sustainability guides", "Funding resources"],
              tasks: [
                "Develop funding strategies",
                "Build partnerships",
                "Plan roadmaps",
                "Measure impact"
              ]
            },
            {
              name: "Community Growth",
              description: "Scale and diversify your community",
              resources: ["Community metrics", "Growth strategies"],
              tasks: [
                "Track community health",
                "Improve diversity",
                "Expand reach",
                "Create sub-communities"
              ]
            },
            {
              name: "Thought Leadership",
              description: "Share knowledge and influence",
              resources: ["Speaking guides", "Writing resources"],
              tasks: [
                "Write blog posts",
                "Give conference talks",
                "Create video content",
                "Influence standards"
              ]
            }
          ]
        }
      ]
    }
  ],

  projectIdeas: [
    {
      category: "Web Development",
      projects: [
        { name: "React", difficulty: "Intermediate", language: "JavaScript" },
        { name: "Vue.js", difficulty: "Beginner", language: "JavaScript" },
        { name: "Next.js", difficulty: "Intermediate", language: "JavaScript" },
        { name: "Tailwind CSS", difficulty: "Beginner", language: "CSS" }
      ]
    },
    {
      category: "Backend & APIs",
      projects: [
        { name: "Node.js", difficulty: "Intermediate", language: "JavaScript" },
        { name: "Django", difficulty: "Intermediate", language: "Python" },
        { name: "FastAPI", difficulty: "Beginner", language: "Python" },
        { name: "Express", difficulty: "Beginner", language: "JavaScript" }
      ]
    },
    {
      category: "DevOps & Tools",
      projects: [
        { name: "Docker", difficulty: "Intermediate", language: "Go" },
        { name: "Kubernetes", difficulty: "Advanced", language: "Go" },
        { name: "Terraform", difficulty: "Intermediate", language: "Go" },
        { name: "Ansible", difficulty: "Intermediate", language: "Python" }
      ]
    },
    {
      category: "Data Science & ML",
      projects: [
        { name: "TensorFlow", difficulty: "Advanced", language: "Python" },
        { name: "PyTorch", difficulty: "Advanced", language: "Python" },
        { name: "Pandas", difficulty: "Intermediate", language: "Python" },
        { name: "Scikit-learn", difficulty: "Intermediate", language: "Python" }
      ]
    },
    {
      category: "Mobile Development",
      projects: [
        { name: "React Native", difficulty: "Intermediate", language: "JavaScript" },
        { name: "Flutter", difficulty: "Intermediate", language: "Dart" },
        { name: "Expo", difficulty: "Beginner", language: "JavaScript" }
      ]
    }
  ],

  resources: {
    platforms: [
      { name: "GitHub", url: "https://github.com", description: "Largest code hosting platform" },
      { name: "GitLab", url: "https://gitlab.com", description: "DevOps platform with CI/CD" },
      { name: "Bitbucket", url: "https://bitbucket.org", description: "Git solution for teams" }
    ],
    findProjects: [
      { name: "Good First Issue", url: "https://goodfirstissue.dev", description: "Find beginner-friendly issues" },
      { name: "Up For Grabs", url: "https://up-for-grabs.net", description: "Projects with tasks for new contributors" },
      { name: "First Timers Only", url: "https://www.firsttimersonly.com", description: "Friendly open source projects" },
      { name: "CodeTriage", url: "https://www.codetriage.com", description: "Help your favorite projects" }
    ],
    learning: [
      { name: "Open Source Guides", url: "https://opensource.guide", description: "Learn how to contribute" },
      { name: "GitHub Skills", url: "https://skills.github.com", description: "Interactive GitHub courses" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org", description: "Learn to code for free" },
      { name: "The Odin Project", url: "https://www.theodinproject.com", description: "Full stack curriculum" }
    ],
    communities: [
      { name: "Dev.to", url: "https://dev.to", description: "Developer community" },
      { name: "Hashnode", url: "https://hashnode.com", description: "Blogging for developers" },
      { name: "Reddit r/opensource", url: "https://reddit.com/r/opensource", description: "Open source discussions" },
      { name: "Discord Communities", url: "Various", description: "Project-specific servers" }
    ]
  },

  tips: [
    "Start small - documentation fixes are valuable contributions",
    "Read the CONTRIBUTING.md file before contributing",
    "Be patient - maintainers are often volunteers",
    "Ask questions - the community wants to help",
    "Test your changes thoroughly before submitting",
    "Write clear commit messages and PR descriptions",
    "Be respectful and professional in all interactions",
    "Don't be discouraged by rejection - learn and improve",
    "Contribute regularly to build momentum",
    "Give back by helping others once you learn"
  ],

  badges: [
    { name: "First Contribution", description: "Made your first PR", icon: "🎉" },
    { name: "Bug Hunter", description: "Fixed 10 bugs", icon: "🐛" },
    { name: "Feature Builder", description: "Implemented 5 features", icon: "⚡" },
    { name: "Documentation Hero", description: "Improved docs significantly", icon: "📚" },
    { name: "Code Reviewer", description: "Reviewed 25 PRs", icon: "👀" },
    { name: "Community Helper", description: "Helped 50 people", icon: "🤝" },
    { name: "Maintainer", description: "Became a project maintainer", icon: "🔧" },
    { name: "Mentor", description: "Mentored 10 contributors", icon: "🎓" }
  ]
};

export const getLevelProgress = (levelId, completedTasks) => {
  const level = openSourceLearning.levels.find(l => l.id === levelId);
  if (!level) return { total: 0, completed: 0, percentage: 0 };
  
  let total = 0;
  let completed = 0;
  
  level.modules.forEach(module => {
    module.topics.forEach(topic => {
      topic.tasks.forEach(task => {
        total++;
        if (completedTasks[`${levelId}-${module.id}-${topic.name}-${task}`]) {
          completed++;
        }
      });
    });
  });
  
  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};
