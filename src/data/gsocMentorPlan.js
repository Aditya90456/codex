/**
 * GSoC Mentor Plan Data
 * 
 * @license MIT
 * @copyright 2026 Codex Platform
 * 
 * This educational content is open source and free to use, modify, and share.
 * See GSOC_LICENSE.md for full license details.
 * 
 * A comprehensive 12-week preparation guide for Google Summer of Code.
 * Not officially affiliated with Google or the GSoC program.
 */

// GSoC Mentor Plan - Complete Preparation Guide
export const gsocMentorPlan = {
  overview: {
    title: "Google Summer of Code - Complete Preparation Guide",
    description: "A comprehensive 12-week plan to prepare for GSoC with mentorship guidance",
    duration: "12 weeks",
    difficulty: "Intermediate to Advanced",
    prerequisites: [
      "Basic programming knowledge in at least one language",
      "Understanding of Git and GitHub",
      "Familiarity with open source concepts",
      "Problem-solving skills"
    ]
  },
  
  phases: [
    {
      id: 1,
      phase: "Phase 1: Foundation Building",
      weeks: "Week 1-3",
      duration: "3 weeks",
      color: "blue",
      goals: [
        "Master Git and GitHub workflows",
        "Understand open source contribution process",
        "Build strong programming fundamentals",
        "Learn to read and understand large codebases"
      ],
      weeks_detail: [
        {
          week: 1,
          title: "Git & GitHub Mastery",
          tasks: [
            {
              name: "Learn Git basics",
              description: "Master git commands: clone, add, commit, push, pull, branch, merge",
              resources: ["Git Documentation", "GitHub Learning Lab", "Pro Git Book"],
              completed: false
            },
            {
              name: "Practice GitHub workflow",
              description: "Fork repos, create PRs, handle merge conflicts, use GitHub Issues",
              resources: ["GitHub Guides", "First Contributions Repo"],
              completed: false
            },
            {
              name: "Set up development environment",
              description: "Install necessary tools, configure IDE, set up SSH keys",
              resources: ["VS Code", "Git", "Terminal setup guides"],
              completed: false
            }
          ]
        },
        {
          week: 2,
          title: "Open Source Fundamentals",
          tasks: [
            {
              name: "Understand open source licenses",
              description: "Learn about MIT, GPL, Apache licenses and their implications",
              resources: ["choosealicense.com", "Open Source Guide"],
              completed: false
            },
            {
              name: "Study contribution guidelines",
              description: "Read CONTRIBUTING.md files, understand code of conduct",
              resources: ["Open Source Guides", "Good First Issue"],
              completed: false
            },
            {
              name: "Make first contribution",
              description: "Fix documentation, typos, or simple bugs in beginner-friendly repos",
              resources: ["Good First Issue", "Up For Grabs", "First Timers Only"],
              completed: false
            }
          ]
        },
        {
          week: 3,
          title: "Programming & DSA Fundamentals",
          tasks: [
            {
              name: "Strengthen programming language",
              description: "Deep dive into your primary language (Python/Java/C++/JavaScript)",
              resources: ["Language official docs", "Exercism", "HackerRank"],
              completed: false
            },
            {
              name: "Practice DSA problems",
              description: "Solve 20-30 easy to medium problems on arrays, strings, and basic algorithms",
              resources: ["LeetCode", "Codeforces", "A2Z DSA Sheet"],
              completed: false
            },
            {
              name: "Learn code review practices",
              description: "Understand how to review code, give feedback, and improve code quality",
              resources: ["Code Review Best Practices", "Google Code Review Guide"],
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 2,
      phase: "Phase 2: Organization Research & Selection",
      weeks: "Week 4-6",
      duration: "3 weeks",
      color: "green",
      goals: [
        "Research and shortlist GSoC organizations",
        "Understand project requirements",
        "Start contributing to selected organizations",
        "Build relationships with mentors"
      ],
      weeks_detail: [
        {
          week: 4,
          title: "Organization Discovery",
          tasks: [
            {
              name: "Browse GSoC organizations list",
              description: "Review previous year's organizations and their projects",
              resources: ["GSoC Archive", "Organization List"],
              completed: false
            },
            {
              name: "Identify interests and skills match",
              description: "Match your skills with organization tech stacks and project ideas",
              resources: ["GSoC Ideas Pages", "Organization Websites"],
              completed: false
            },
            {
              name: "Create shortlist of 5-7 organizations",
              description: "Select organizations based on interest, tech stack, and community activity",
              resources: ["Organization GitHub repos", "Community channels"],
              completed: false
            }
          ]
        },
        {
          week: 5,
          title: "Deep Dive into Organizations",
          tasks: [
            {
              name: "Join community channels",
              description: "Join Slack/Discord/IRC channels, introduce yourself professionally",
              resources: ["Organization communication channels"],
              completed: false
            },
            {
              name: "Study codebase architecture",
              description: "Clone repos, run projects locally, understand code structure",
              resources: ["README files", "Architecture docs", "Wiki pages"],
              completed: false
            },
            {
              name: "Read past GSoC proposals",
              description: "Study successful proposals from previous years",
              resources: ["GSoC Archive", "Organization blogs"],
              completed: false
            }
          ]
        },
        {
          week: 6,
          title: "Start Contributing",
          tasks: [
            {
              name: "Fix beginner issues",
              description: "Solve 'good first issue' or 'beginner-friendly' labeled issues",
              resources: ["GitHub Issues", "Organization task boards"],
              completed: false
            },
            {
              name: "Engage with mentors",
              description: "Ask questions, seek feedback, show genuine interest",
              resources: ["Community channels", "Mailing lists"],
              completed: false
            },
            {
              name: "Document your contributions",
              description: "Keep track of PRs, issues solved, and community interactions",
              resources: ["Personal blog", "GitHub profile"],
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 3,
      phase: "Phase 3: Proposal Development",
      weeks: "Week 7-9",
      duration: "3 weeks",
      color: "purple",
      goals: [
        "Select final project and organization",
        "Write comprehensive proposal",
        "Get feedback from mentors",
        "Refine and finalize proposal"
      ],
      weeks_detail: [
        {
          week: 7,
          title: "Project Selection & Planning",
          tasks: [
            {
              name: "Choose final project",
              description: "Select 1-2 projects based on interest, feasibility, and mentor availability",
              resources: ["Organization ideas list", "Mentor discussions"],
              completed: false
            },
            {
              name: "Break down project into milestones",
              description: "Create detailed timeline with weekly deliverables",
              resources: ["Project management tools", "Gantt charts"],
              completed: false
            },
            {
              name: "Research technical requirements",
              description: "Understand all technologies, APIs, and tools needed",
              resources: ["Documentation", "Technical blogs", "Stack Overflow"],
              completed: false
            }
          ]
        },
        {
          week: 8,
          title: "Proposal Writing",
          tasks: [
            {
              name: "Write proposal draft",
              description: "Include: abstract, goals, implementation plan, timeline, deliverables",
              resources: ["GSoC Proposal Template", "Past successful proposals"],
              completed: false
            },
            {
              name: "Create detailed timeline",
              description: "Week-by-week breakdown with specific tasks and milestones",
              resources: ["Timeline templates", "Project planning guides"],
              completed: false
            },
            {
              name: "Add technical details",
              description: "Include architecture diagrams, pseudocode, and implementation approach",
              resources: ["Draw.io", "Lucidchart", "Technical writing guides"],
              completed: false
            }
          ]
        },
        {
          week: 9,
          title: "Proposal Refinement",
          tasks: [
            {
              name: "Get mentor feedback",
              description: "Share draft with mentors, incorporate their suggestions",
              resources: ["Community channels", "Email"],
              completed: false
            },
            {
              name: "Proofread and polish",
              description: "Check grammar, formatting, clarity, and completeness",
              resources: ["Grammarly", "Peer review"],
              completed: false
            },
            {
              name: "Prepare backup proposal",
              description: "Have a second project proposal ready as backup",
              resources: ["Alternative project ideas"],
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 4,
      phase: "Phase 4: Application & Pre-GSoC Preparation",
      weeks: "Week 10-12",
      duration: "3 weeks",
      color: "orange",
      goals: [
        "Submit GSoC application",
        "Continue contributing to organization",
        "Prepare for coding period",
        "Build strong mentor relationships"
      ],
      weeks_detail: [
        {
          week: 10,
          title: "Application Submission",
          tasks: [
            {
              name: "Submit application early",
              description: "Don't wait for deadline, submit with time to spare",
              resources: ["GSoC Website", "Application portal"],
              completed: false
            },
            {
              name: "Verify submission",
              description: "Double-check all details, attachments, and contact information",
              resources: ["Application checklist"],
              completed: false
            },
            {
              name: "Continue active contributions",
              description: "Keep contributing even after submission to show commitment",
              resources: ["Organization repos", "Issue trackers"],
              completed: false
            }
          ]
        },
        {
          week: 11,
          title: "Skill Enhancement",
          tasks: [
            {
              name: "Learn project-specific technologies",
              description: "Deep dive into frameworks, libraries, and tools for your project",
              resources: ["Official docs", "Tutorials", "Online courses"],
              completed: false
            },
            {
              name: "Study similar implementations",
              description: "Look at similar features in other projects for inspiration",
              resources: ["GitHub", "Open source projects"],
              completed: false
            },
            {
              name: "Set up development environment",
              description: "Ensure you can build, test, and run the project smoothly",
              resources: ["Setup guides", "Docker", "Virtual environments"],
              completed: false
            }
          ]
        },
        {
          week: 12,
          title: "Pre-GSoC Preparation",
          tasks: [
            {
              name: "Create detailed work plan",
              description: "Expand proposal timeline into actionable daily/weekly tasks",
              resources: ["Project management tools", "Notion", "Trello"],
              completed: false
            },
            {
              name: "Establish communication routine",
              description: "Set up regular check-ins with mentors, decide on communication channels",
              resources: ["Calendar", "Communication tools"],
              completed: false
            },
            {
              name: "Prepare for community bonding",
              description: "Plan how to engage with community during bonding period",
              resources: ["GSoC timeline", "Community guidelines"],
              completed: false
            }
          ]
        }
      ]
    }
  ],
  
  tips: [
    {
      category: "Communication",
      tips: [
        "Be professional and respectful in all interactions",
        "Ask smart questions - do your research first",
        "Respond promptly to mentor messages",
        "Document your progress regularly",
        "Be honest about challenges and blockers"
      ]
    },
    {
      category: "Technical",
      tips: [
        "Write clean, well-documented code",
        "Follow the organization's coding standards",
        "Test your code thoroughly before submitting",
        "Learn to use debugging tools effectively",
        "Keep your commits atomic and meaningful"
      ]
    },
    {
      category: "Proposal Writing",
      tips: [
        "Be specific and realistic with timelines",
        "Show you understand the problem deeply",
        "Include mockups or diagrams where relevant",
        "Mention your relevant experience and skills",
        "Proofread multiple times"
      ]
    },
    {
      category: "Community Engagement",
      tips: [
        "Start contributing early (3-4 months before)",
        "Help other contributors when possible",
        "Attend community meetings and events",
        "Blog about your contributions",
        "Build genuine relationships, not just for GSoC"
      ]
    }
  ],
  
  resources: {
    official: [
      { name: "GSoC Official Website", url: "https://summerofcode.withgoogle.com/" },
      { name: "GSoC Student Guide", url: "https://google.github.io/gsocguides/student/" },
      { name: "GSoC FAQ", url: "https://developers.google.com/open-source/gsoc/faq" }
    ],
    learning: [
      { name: "Git & GitHub", url: "https://learngitbranching.js.org/" },
      { name: "Open Source Guide", url: "https://opensource.guide/" },
      { name: "First Contributions", url: "https://firstcontributions.github.io/" }
    ],
    communities: [
      { name: "GSoC Discord", url: "Various organization servers" },
      { name: "Reddit r/gsoc", url: "https://reddit.com/r/gsoc" },
      { name: "GSoC Mailing Lists", url: "Organization specific" }
    ]
  },
  
  milestones: [
    { week: 3, title: "First Open Source Contribution", description: "Successfully merge your first PR" },
    { week: 6, title: "Organization Selection", description: "Finalize 2-3 target organizations" },
    { week: 9, title: "Proposal Draft Complete", description: "Complete first draft of proposal" },
    { week: 12, title: "Application Submitted", description: "Submit GSoC application" }
  ]
};

export const getPhaseProgress = (phaseId, completedTasks) => {
  const phase = gsocMentorPlan.phases.find(p => p.id === phaseId);
  if (!phase) return { total: 0, completed: 0, percentage: 0 };
  
  let total = 0;
  let completed = 0;
  
  phase.weeks_detail.forEach(week => {
    week.tasks.forEach(task => {
      total++;
      if (completedTasks[`${phaseId}-${week.week}-${task.name}`]) {
        completed++;
      }
    });
  });
  
  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};
