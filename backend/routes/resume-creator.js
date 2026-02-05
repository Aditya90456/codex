const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const htmlPdf = require('html-pdf-node');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// AI Resume Creator Engine - User-Based System
class ResumeCreatorEngine {
  constructor() {
    this.userDataFile = path.join(__dirname, '../data/user-ml-data.json');
    this.templatesDir = path.join(__dirname, '../data/resume-templates');
    this.resumeDataFile = path.join(__dirname, '../data/generated-resumes.json');
    this.aiTemplatesFile = path.join(__dirname, '../data/ai-generated-templates.json');
    this.userProfilesFile = path.join(__dirname, '../data/user-profiles.json');
    this.userPreferencesFile = path.join(__dirname, '../data/user-preferences.json');
  }

  async ensureDataFiles() {
    const dataDir = path.join(__dirname, '../data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    try {
      await fs.access(this.templatesDir);
    } catch {
      await fs.mkdir(this.templatesDir, { recursive: true });
      await this.createDefaultTemplates();
    }

    try {
      await fs.access(this.resumeDataFile);
    } catch {
      await fs.writeFile(this.resumeDataFile, JSON.stringify({}));
    }

    try {
      await fs.access(this.aiTemplatesFile);
    } catch {
      await fs.writeFile(this.aiTemplatesFile, JSON.stringify({}));
    }

    try {
      await fs.access(this.userProfilesFile);
    } catch {
      await fs.writeFile(this.userProfilesFile, JSON.stringify({}));
    }

    try {
      await fs.access(this.userPreferencesFile);
    } catch {
      await fs.writeFile(this.userPreferencesFile, JSON.stringify({}));
    }
  }

  async createUserProfile(userId, profileData) {
    try {
      let profiles = {};
      try {
        const data = await fs.readFile(this.userProfilesFile, 'utf8');
        profiles = JSON.parse(data);
      } catch {
        // File doesn't exist or is empty
      }

      profiles[userId] = {
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };

      await fs.writeFile(this.userProfilesFile, JSON.stringify(profiles, null, 2));
      return profiles[userId];
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  async getUserProfile(userId) {
    try {
      const data = await fs.readFile(this.userProfilesFile, 'utf8');
      const profiles = JSON.parse(data);
      return profiles[userId] || null;
    } catch (error) {
      console.error('Error reading user profile:', error);
      return null;
    }
  }

  async updateUserPreferences(userId, preferences) {
    try {
      let userPrefs = {};
      try {
        const data = await fs.readFile(this.userPreferencesFile, 'utf8');
        userPrefs = JSON.parse(data);
      } catch {
        // File doesn't exist or is empty
      }

      userPrefs[userId] = {
        ...userPrefs[userId],
        ...preferences,
        updatedAt: new Date().toISOString()
      };

      await fs.writeFile(this.userPreferencesFile, JSON.stringify(userPrefs, null, 2));
      return userPrefs[userId];
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  }

  async getUserPreferences(userId) {
    try {
      const data = await fs.readFile(this.userPreferencesFile, 'utf8');
      const preferences = JSON.parse(data);
      return preferences[userId] || this.getDefaultPreferences();
    } catch (error) {
      console.error('Error reading user preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  getDefaultPreferences() {
    return {
      preferredTemplateStyle: 'modern',
      colorScheme: 'professional',
      sectionPriorities: {
        skills: 10,
        projects: 9,
        experience: 8,
        achievements: 7,
        certifications: 6,
        stats: 8
      },
      showCodingStats: true,
      emphasizeProjects: true,
      includeGitHubActivity: true,
      preferredLanguages: [],
      careerGoals: [],
      industryFocus: 'technology',
      experienceLevel: 'intermediate'
    };
  }

  async generateUserBasedTemplate(userId, personalInfo, focusArea = 'fullstack') {
    try {
      // Get comprehensive user data
      const userMLData = await this.getUserMLData(userId);
      const userProfile = await this.getUserProfile(userId);
      const userPreferences = await this.getUserPreferences(userId);
      
      if (!userMLData) {
        userMLData = this.createSampleUserData(userId);
        await this.saveSampleUserData(userId, userMLData);
      }

      // Create personalized prompt based on user data
      const prompt = `
You are an expert resume designer and career counselor. Generate a highly personalized resume template based on comprehensive user data:

USER PROFILE:
- Name: ${personalInfo.name}
- Focus Area: ${focusArea}
- Experience Level: ${userPreferences.experienceLevel}
- Industry Focus: ${userPreferences.industryFocus}
- Career Goals: ${userPreferences.careerGoals.join(', ') || 'General software development'}

CODING STATISTICS:
- Problems Solved: ${userMLData.user.totalProblems || 0}
- Current Streak: ${userMLData.user.streak || 0} days
- Longest Streak: ${userMLData.user.longestStreak || 0} days
- Coding Level: ${userMLData.user.level || 1}
- Engagement Score: ${userMLData.user.addictionScore || 50}
- Difficulty Distribution: ${JSON.stringify(userMLData.user.problemsByDifficulty || {})}

CODING PATTERNS & SKILLS:
- Primary Languages: ${JSON.stringify(userMLData.user.solvingPatterns?.languages || {})}
- Problem Types Mastered: ${JSON.stringify(userMLData.user.solvingPatterns?.problemTypes || {})}
- Preferred Languages: ${userPreferences.preferredLanguages.join(', ') || 'Not specified'}

USER PREFERENCES:
- Template Style: ${userPreferences.preferredTemplateStyle}
- Color Scheme: ${userPreferences.colorScheme}
- Show Coding Stats: ${userPreferences.showCodingStats}
- Emphasize Projects: ${userPreferences.emphasizeProjects}
- Section Priorities: ${JSON.stringify(userPreferences.sectionPriorities)}

PERSONAL PROFILE DATA:
${userProfile ? `
- Years of Experience: ${userProfile.yearsOfExperience || 'Not specified'}
- Education Level: ${userProfile.educationLevel || 'Not specified'}
- Specializations: ${userProfile.specializations?.join(', ') || 'Not specified'}
- Notable Achievements: ${userProfile.achievements?.join(', ') || 'Not specified'}
- Work Style: ${userProfile.workStyle || 'Not specified'}
- Leadership Experience: ${userProfile.hasLeadershipExperience ? 'Yes' : 'No'}
` : 'No detailed profile data available'}

REQUIREMENTS:
Create a template that is uniquely tailored to this user's:
1. Coding journey and skill progression
2. Career aspirations and industry focus
3. Personal preferences and style choices
4. Achievement level and experience
5. Strengths and areas of expertise

Generate a JSON response with this structure:
{
  "templateName": "unique_user_based_template_name",
  "displayName": "Personalized Template Name",
  "description": "Detailed description explaining why this template suits this specific user",
  "targetRole": "specific role optimized for this user's profile",
  "personalizedFor": {
    "userId": "${userId}",
    "userName": "${personalInfo.name}",
    "keyStrengths": ["strength1", "strength2", "strength3"],
    "careerStage": "entry|junior|mid|senior|expert",
    "uniqueValue": "what makes this user stand out"
  },
  "styles": {
    "primaryColor": "#hex_color",
    "secondaryColor": "#hex_color", 
    "accentColor": "#hex_color",
    "fontFamily": "font_name, fallback",
    "headerStyle": "centered|left-aligned|minimal|bold|creative",
    "sectionDivider": "line|colored-bar|dotted|none|gradient",
    "layout": "traditional|modern|creative|technical|executive",
    "spacing": "compact|normal|spacious|dynamic"
  },
  "sectionPriority": {
    "summary": 1-10,
    "skills": 1-10,
    "projects": 1-10,
    "experience": 1-10,
    "achievements": 1-10,
    "certifications": 1-10,
    "stats": 1-10,
    "education": 1-10
  },
  "customizations": {
    "emphasizeProjects": true/false,
    "showCodingStats": true/false,
    "highlightStreaks": true/false,
    "technicalFocus": true/false,
    "minimalistDesign": true/false,
    "showProgressionStory": true/false,
    "emphasizeLeadership": true/false,
    "industrySpecific": true/false
  },
  "contentRecommendations": {
    "summaryFocus": "what to emphasize in professional summary",
    "skillsOrganization": "how to organize technical skills",
    "projectSelection": "which types of projects to highlight",
    "achievementFraming": "how to frame achievements"
  },
  "aiRecommendations": [
    "personalized recommendation 1 based on user's specific journey",
    "personalized recommendation 2 based on user's goals",
    "personalized recommendation 3 based on user's strengths",
    "personalized recommendation 4 based on user's experience level",
    "personalized recommendation 5 based on user's preferences"
  ]
}

Make this template deeply personal and uniquely suited to this individual user's coding journey, career goals, and personal style.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }
      
      const aiTemplate = JSON.parse(jsonMatch[0]);
      
      // Add metadata
      aiTemplate.generatedAt = new Date().toISOString();
      aiTemplate.userId = userId;
      aiTemplate.basedOnStats = {
        totalProblems: userMLData.user.totalProblems,
        level: userMLData.user.level,
        focusArea,
        userPreferences: userPreferences,
        hasProfile: !!userProfile
      };
      
      // Save the user-based template
      await this.saveAITemplate(userId, aiTemplate);
      
      return aiTemplate;
      
    } catch (error) {
      console.error('User-based template generation error:', error);
      // Fallback to enhanced smart template
      return this.generateEnhancedFallbackTemplate(userId, focusArea);
    }
  }

  async generateEnhancedFallbackTemplate(userId, focusArea) {
    const userMLData = await this.getUserMLData(userId) || this.createSampleUserData(userId);
    const userPreferences = await this.getUserPreferences(userId);
    const { totalProblems, level, addictionScore } = userMLData.user;
    
    // Enhanced color selection based on preferences and focus area
    const colorSchemes = {
      professional: {
        fullstack: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
        frontend: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6' },
        backend: { primary: '#059669', secondary: '#047857', accent: '#10b981' },
        mobile: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
        ai: { primary: '#ea580c', secondary: '#c2410c', accent: '#f97316' },
        devops: { primary: '#0891b2', secondary: '#0e7490', accent: '#06b6d4' },
        data: { primary: '#7c2d12', secondary: '#92400e', accent: '#a16207' }
      },
      creative: {
        fullstack: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
        frontend: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' },
        backend: { primary: '#06b6d4', secondary: '#0891b2', accent: '#67e8f9' },
        mobile: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
        ai: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
        devops: { primary: '#6366f1', secondary: '#4f46e5', accent: '#818cf8' },
        data: { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' }
      }
    };
    
    const scheme = userPreferences.colorScheme || 'professional';
    const colors = colorSchemes[scheme]?.[focusArea] || colorSchemes.professional.fullstack;
    
    // Determine experience level and template sophistication
    let experienceLevel = userPreferences.experienceLevel;
    if (!experienceLevel) {
      if (level >= 25 && totalProblems >= 500) experienceLevel = 'expert';
      else if (level >= 20 && totalProblems >= 300) experienceLevel = 'senior';
      else if (level >= 15 && totalProblems >= 150) experienceLevel = 'mid';
      else if (level >= 10 && totalProblems >= 50) experienceLevel = 'junior';
      else experienceLevel = 'entry';
    }
    
    return {
      templateName: `user_based_${focusArea}_${experienceLevel}_${Date.now()}`,
      displayName: `Personalized ${focusArea.charAt(0).toUpperCase() + focusArea.slice(1)} Template`,
      description: `Custom template designed for your ${totalProblems} problems solved, Level ${level} expertise, and ${experienceLevel}-level experience in ${focusArea} development`,
      targetRole: `${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)}-Level ${focusArea.charAt(0).toUpperCase() + focusArea.slice(1)} Developer`,
      personalizedFor: {
        userId: userId,
        keyStrengths: this.identifyUserStrengths(userMLData.user),
        careerStage: experienceLevel,
        uniqueValue: this.generateUniqueValue(userMLData.user, focusArea)
      },
      styles: {
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent,
        fontFamily: userPreferences.preferredTemplateStyle === 'creative' ? 'Helvetica, Arial, sans-serif' : 'Arial, sans-serif',
        headerStyle: totalProblems >= 200 ? 'bold' : userPreferences.preferredTemplateStyle === 'minimal' ? 'minimal' : 'centered',
        sectionDivider: userPreferences.preferredTemplateStyle === 'modern' ? 'colored-bar' : 'line',
        layout: userPreferences.preferredTemplateStyle || 'modern',
        spacing: totalProblems >= 200 ? 'normal' : 'compact'
      },
      sectionPriority: {
        ...userPreferences.sectionPriorities,
        stats: userPreferences.showCodingStats ? 9 : 5
      },
      customizations: {
        emphasizeProjects: userPreferences.emphasizeProjects,
        showCodingStats: userPreferences.showCodingStats,
        highlightStreaks: userMLData.user.streak >= 30,
        technicalFocus: focusArea === 'backend' || focusArea === 'ai',
        minimalistDesign: userPreferences.preferredTemplateStyle === 'minimal',
        showProgressionStory: totalProblems >= 100,
        emphasizeLeadership: experienceLevel === 'senior' || experienceLevel === 'expert',
        industrySpecific: true
      },
      contentRecommendations: {
        summaryFocus: `Emphasize your ${totalProblems} problems solved and ${focusArea} expertise`,
        skillsOrganization: `Highlight ${focusArea} technologies and your strongest programming languages`,
        projectSelection: `Showcase projects that demonstrate ${focusArea} capabilities and problem-solving skills`,
        achievementFraming: `Frame achievements in terms of impact and technical growth`
      },
      aiRecommendations: [
        `Highlight your ${totalProblems} problems solved as a key differentiator in ${focusArea} roles`,
        `Emphasize your Level ${level} coding proficiency and consistent learning approach`,
        experienceLevel === 'expert' ? 'Position yourself for senior/lead roles with architecture and mentoring experience' : 
        experienceLevel === 'senior' ? 'Focus on technical leadership and complex problem-solving achievements' :
        'Showcase your growth trajectory and eagerness to take on challenging projects',
        `Tailor your resume for ${userPreferences.industryFocus || 'technology'} industry opportunities`,
        userPreferences.showCodingStats ? 'Include your coding statistics to demonstrate consistent practice and dedication' : 'Focus on practical project outcomes and business impact'
      ],
      generatedAt: new Date().toISOString(),
      userId: userId,
      basedOnStats: { 
        totalProblems, 
        level, 
        focusArea, 
        userPreferences: userPreferences,
        experienceLevel: experienceLevel
      }
    };
  }

  identifyUserStrengths(userStats) {
    const strengths = [];
    const { totalProblems, streak, level, solvingPatterns } = userStats;
    
    if (totalProblems >= 300) strengths.push('Exceptional Problem Solver');
    else if (totalProblems >= 150) strengths.push('Strong Problem Solver');
    else if (totalProblems >= 50) strengths.push('Dedicated Learner');
    
    if (streak >= 50) strengths.push('Highly Consistent');
    else if (streak >= 20) strengths.push('Consistent Practitioner');
    
    if (level >= 20) strengths.push('Advanced Technical Skills');
    else if (level >= 10) strengths.push('Solid Technical Foundation');
    
    // Analyze language diversity
    const languages = Object.keys(solvingPatterns?.languages || {});
    if (languages.length >= 4) strengths.push('Multi-Language Proficiency');
    else if (languages.length >= 2) strengths.push('Versatile Developer');
    
    return strengths.slice(0, 3);
  }

  generateUniqueValue(userStats, focusArea) {
    const { totalProblems, level, streak } = userStats;
    
    if (totalProblems >= 500 && level >= 25) {
      return `Expert-level ${focusArea} developer with proven algorithmic mastery and ${totalProblems}+ problems solved`;
    } else if (totalProblems >= 200 && streak >= 30) {
      return `Dedicated ${focusArea} developer combining strong problem-solving skills with consistent learning habits`;
    } else if (level >= 15) {
      return `Skilled ${focusArea} developer with solid technical foundation and growing expertise`;
    } else {
      return `Motivated ${focusArea} developer with strong learning trajectory and problem-solving mindset`;
    }
  }

  async generateAITemplate(userStats, personalInfo, focusArea = 'fullstack') {
    // Use the new user-based template generation
    return await this.generateUserBasedTemplate(userStats.userId, personalInfo, focusArea);
  }

  generateSmartFallbackTemplate(userStats, focusArea) {
    const { totalProblems, level, addictionScore } = userStats;
    
    // Smart color selection based on focus area and level
    const colorSchemes = {
      fullstack: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
      frontend: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6' },
      backend: { primary: '#059669', secondary: '#047857', accent: '#10b981' },
      mobile: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
      ai: { primary: '#ea580c', secondary: '#c2410c', accent: '#f97316' },
      devops: { primary: '#0891b2', secondary: '#0e7490', accent: '#06b6d4' },
      data: { primary: '#7c2d12', secondary: '#92400e', accent: '#a16207' }
    };
    
    const colors = colorSchemes[focusArea] || colorSchemes.fullstack;
    
    // Template selection based on level and problems solved
    let templateType = 'professional';
    if (level >= 20 && totalProblems >= 300) templateType = 'expert';
    else if (level >= 15 && totalProblems >= 150) templateType = 'senior';
    else if (level >= 10 && totalProblems >= 50) templateType = 'intermediate';
    else templateType = 'entry';
    
    return {
      templateName: `ai_${focusArea}_${templateType}_${Date.now()}`,
      displayName: `AI-Optimized ${focusArea.charAt(0).toUpperCase() + focusArea.slice(1)} Template`,
      description: `Personalized template optimized for ${focusArea} roles based on your ${totalProblems} problems solved and Level ${level} expertise`,
      targetRole: `${focusArea.charAt(0).toUpperCase() + focusArea.slice(1)} Developer`,
      styles: {
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent,
        fontFamily: level >= 15 ? 'Helvetica, Arial, sans-serif' : 'Arial, sans-serif',
        headerStyle: totalProblems >= 100 ? 'bold' : 'centered',
        sectionDivider: level >= 10 ? 'colored-bar' : 'line',
        layout: addictionScore >= 80 ? 'modern' : 'traditional',
        spacing: totalProblems >= 200 ? 'normal' : 'compact'
      },
      sectionPriority: {
        summary: 9,
        skills: totalProblems >= 50 ? 10 : 8,
        projects: totalProblems >= 100 ? 10 : 7,
        experience: level >= 15 ? 9 : 6,
        achievements: totalProblems >= 150 ? 9 : 7,
        certifications: 6,
        stats: addictionScore >= 70 ? 8 : 5
      },
      customizations: {
        emphasizeProjects: totalProblems >= 100,
        showCodingStats: addictionScore >= 60,
        highlightStreaks: userStats.streak >= 30,
        technicalFocus: focusArea === 'backend' || focusArea === 'ai',
        minimalistDesign: level >= 20
      },
      aiRecommendations: [
        `Highlight your ${totalProblems} problems solved as a key differentiator`,
        `Emphasize ${focusArea} expertise in your summary and projects`,
        level >= 15 ? 'Consider senior-level positions' : 'Focus on growth and learning achievements'
      ],
      generatedAt: new Date().toISOString(),
      userId: userStats.userId,
      basedOnStats: { totalProblems, level, focusArea }
    };
  }

  async saveAITemplate(userId, template) {
    try {
      let templates = {};
      try {
        const data = await fs.readFile(this.aiTemplatesFile, 'utf8');
        templates = JSON.parse(data);
      } catch {
        // File doesn't exist or is empty
      }

      if (!templates[userId]) {
        templates[userId] = [];
      }

      templates[userId].push(template);

      // Keep only last 5 AI templates per user
      if (templates[userId].length > 5) {
        templates[userId] = templates[userId].slice(-5);
      }

      await fs.writeFile(this.aiTemplatesFile, JSON.stringify(templates, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving AI template:', error);
      return false;
    }
  }

  async getUserAITemplates(userId) {
    try {
      const data = await fs.readFile(this.aiTemplatesFile, 'utf8');
      const templates = JSON.parse(data);
      return templates[userId] || [];
    } catch (error) {
      console.error('Error reading AI templates:', error);
      return [];
    }
  }

  async createDefaultTemplates() {
    const templates = {
      professional: {
        name: 'Professional',
        description: 'Clean, ATS-friendly format perfect for corporate applications',
        styles: {
          primaryColor: '#2563eb',
          fontFamily: 'Arial, sans-serif',
          headerStyle: 'centered',
          sectionDivider: 'line'
        }
      },
      creative: {
        name: 'Creative',
        description: 'Modern design with visual elements for creative roles',
        styles: {
          primaryColor: '#7c3aed',
          fontFamily: 'Helvetica, sans-serif',
          headerStyle: 'left-aligned',
          sectionDivider: 'colored-bar'
        }
      },
      technical: {
        name: 'Technical',
        description: 'Code-focused layout highlighting technical achievements',
        styles: {
          primaryColor: '#059669',
          fontFamily: 'Consolas, monospace',
          headerStyle: 'minimal',
          sectionDivider: 'dotted'
        }
      },
      minimal: {
        name: 'Minimal',
        description: 'Simple, elegant design focusing on content',
        styles: {
          primaryColor: '#dc2626',
          fontFamily: 'Times, serif',
          headerStyle: 'simple',
          sectionDivider: 'none'
        }
      }
    };

    await fs.writeFile(
      path.join(this.templatesDir, 'templates.json'),
      JSON.stringify(templates, null, 2)
    );
  }

  async getUserMLData(userId) {
    try {
      const data = await fs.readFile(this.userDataFile, 'utf8');
      const userData = JSON.parse(data);
      return userData[userId] || null;
    } catch (error) {
      console.error('Error reading user ML data:', error);
      return null;
    }
  }

  async saveGeneratedResume(userId, resumeData) {
    try {
      let resumes = {};
      try {
        const data = await fs.readFile(this.resumeDataFile, 'utf8');
        resumes = JSON.parse(data);
      } catch {
        // File doesn't exist or is empty
      }

      if (!resumes[userId]) {
        resumes[userId] = [];
      }

      resumes[userId].push({
        ...resumeData,
        generatedAt: new Date().toISOString(),
        id: Date.now().toString()
      });

      // Keep only last 10 resumes per user
      if (resumes[userId].length > 10) {
        resumes[userId] = resumes[userId].slice(-10);
      }

      await fs.writeFile(this.resumeDataFile, JSON.stringify(resumes, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving resume:', error);
      return false;
    }
  }

  generateSkillsFromPatterns(solvingPatterns = {}) {
    const languageMap = {
      'JavaScript': { weight: 1, tools: ['Node.js', 'React', 'Express', 'MongoDB', 'Vue.js'] },
      'Python': { weight: 1, tools: ['Django', 'Flask', 'NumPy', 'Pandas', 'TensorFlow'] },
      'Java': { weight: 1, tools: ['Spring Boot', 'Maven', 'JUnit', 'Hibernate', 'Gradle'] },
      'C++': { weight: 1, tools: ['STL', 'CMake', 'GDB', 'Boost', 'Qt'] },
      'Go': { weight: 1, tools: ['Gin', 'GORM', 'Docker', 'Kubernetes', 'gRPC'] },
      'TypeScript': { weight: 1, tools: ['Angular', 'NestJS', 'Deno', 'Webpack', 'Jest'] },
      'Rust': { weight: 1, tools: ['Cargo', 'Tokio', 'Serde', 'Actix', 'WebAssembly'] },
      'Swift': { weight: 1, tools: ['Xcode', 'SwiftUI', 'Core Data', 'Alamofire', 'RxSwift'] }
    };

    const topicMap = {
      'Array': 'Data Structures & Algorithms',
      'String': 'String Processing',
      'LinkedList': 'Linked Lists',
      'Tree': 'Binary Trees & BST',
      'Graph': 'Graph Algorithms',
      'DynamicProgramming': 'Dynamic Programming',
      'Dynamic Programming': 'Dynamic Programming',
      'Greedy': 'Greedy Algorithms',
      'Backtracking': 'Backtracking',
      'BinarySearch': 'Binary Search',
      'TwoPointers': 'Two Pointers Technique',
      'SlidingWindow': 'Sliding Window',
      'Stack': 'Stack & Queue',
      'Heap': 'Heap & Priority Queue',
      'Trie': 'Trie Data Structure',
      'UnionFind': 'Union-Find',
      'BitManipulation': 'Bit Manipulation'
    };

    // Handle empty or missing data
    const languages = Object.entries(solvingPatterns.languages || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([lang]) => lang);

    // If no languages, provide defaults
    if (languages.length === 0) {
      languages.push('JavaScript', 'Python', 'Java');
    }

    const topics = Object.entries(solvingPatterns.problemTypes || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([topic]) => topicMap[topic] || topic);

    // If no topics, provide defaults
    if (topics.length === 0) {
      topics.push('Data Structures & Algorithms', 'String Processing', 'Binary Trees & BST', 'Dynamic Programming');
    }

    const tools = new Set();
    languages.forEach(lang => {
      if (languageMap[lang]) {
        languageMap[lang].tools.forEach(tool => tools.add(tool));
      }
    });

    // Add universal tools
    ['Git', 'Docker', 'AWS', 'Linux', 'REST APIs', 'GraphQL'].forEach(tool => tools.add(tool));

    return {
      programming: languages,
      algorithms: topics,
      tools: Array.from(tools).slice(0, 12),
      soft: ['Problem Solving', 'Analytical Thinking', 'Code Review', 'Team Collaboration', 'Continuous Learning']
    };
  }

  generateProjectsFromPatterns(userStats, languages, topics) {
    const projects = [];
    const { totalProblems, solvingPatterns } = userStats;

    // Project templates based on language and topic combinations
    const projectTemplates = [
      {
        condition: (langs, topics) => langs.includes('JavaScript') && topics.includes('Array'),
        project: {
          name: 'Algorithm Visualizer Dashboard',
          description: 'Interactive web application for visualizing sorting and searching algorithms with real-time performance metrics',
          technologies: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API', 'Chart.js'],
          highlights: [
            'Implemented 12+ sorting algorithms with step-by-step visualization',
            'Built responsive dashboard with performance comparison charts',
            'Optimized rendering for datasets up to 10,000 elements',
            'Added time/space complexity analysis for each algorithm'
          ]
        }
      },
      {
        condition: (langs, topics) => langs.includes('Python') && topics.includes('Dynamic Programming'),
        project: {
          name: 'LeetCode Problem Classifier',
          description: 'Machine learning system that automatically categorizes coding problems and suggests optimal solution approaches',
          technologies: ['Python', 'scikit-learn', 'Flask', 'SQLite', 'Pandas'],
          highlights: [
            'Trained ML model with 95% accuracy on 1000+ problems',
            'Built REST API serving 100+ requests per minute',
            'Implemented caching system reducing response time by 60%',
            'Created automated testing suite with 90% code coverage'
          ]
        }
      },
      {
        condition: (langs, topics) => langs.includes('Java') && topics.includes('Tree'),
        project: {
          name: 'Binary Tree Operations Library',
          description: 'Comprehensive Java library for binary tree data structures with advanced traversal and manipulation methods',
          technologies: ['Java', 'JUnit', 'Maven', 'JavaDoc', 'Git'],
          highlights: [
            'Implemented 20+ tree algorithms including AVL and Red-Black trees',
            'Achieved 98% test coverage with comprehensive unit tests',
            'Optimized memory usage by 40% using iterative approaches',
            'Published library with detailed documentation and examples'
          ]
        }
      },
      {
        condition: (langs, topics) => langs.includes('C++') && topics.includes('Graph'),
        project: {
          name: 'Graph Algorithm Benchmark Suite',
          description: 'High-performance C++ library for graph algorithms with comprehensive benchmarking tools',
          technologies: ['C++17', 'STL', 'CMake', 'Google Test', 'Valgrind'],
          highlights: [
            'Implemented Dijkstra, A*, and Floyd-Warshall algorithms',
            'Optimized performance achieving 10x speedup over naive implementations',
            'Built memory-efficient adjacency list representation',
            'Created automated benchmark suite for performance regression testing'
          ]
        }
      },
      {
        condition: (langs, topics) => langs.includes('Python') && topics.includes('String'),
        project: {
          name: 'Text Processing Pipeline',
          description: 'Scalable text analysis system for processing large documents with pattern matching and sentiment analysis',
          technologies: ['Python', 'NLTK', 'spaCy', 'Redis', 'Docker'],
          highlights: [
            'Built KMP and Rabin-Karp string matching algorithms',
            'Processed 1M+ documents with 99.5% accuracy',
            'Implemented distributed processing using Redis queues',
            'Containerized application with Docker for easy deployment'
          ]
        }
      }
    ];

    // Select projects based on user's strongest areas
    projectTemplates.forEach(template => {
      if (template.condition(languages, topics) && projects.length < 3) {
        projects.push(template.project);
      }
    });

    // Add a general project if user has solved many problems
    if (totalProblems >= 100 && projects.length < 3) {
      projects.push({
        name: 'Coding Interview Prep Platform',
        description: 'Full-stack web application helping developers prepare for technical interviews with personalized problem recommendations',
        technologies: languages.slice(0, 2).concat(['React', 'Node.js', 'MongoDB']),
        highlights: [
          `Curated database of ${Math.min(totalProblems, 500)}+ coding problems`,
          'Built adaptive difficulty system based on user performance',
          'Implemented real-time code execution and testing',
          'Created progress tracking with detailed analytics dashboard'
        ]
      });
    }

    return projects;
  }

  generateAchievements(userStats, metrics = {}) {
    const achievements = [];
    const { 
      totalProblems = 0, 
      streak = 0, 
      longestStreak = 0, 
      level = 1, 
      problemsByDifficulty = {}, 
      addictionScore = 50 
    } = userStats;

    if (totalProblems >= 500) {
      achievements.push(`🏆 Elite Problem Solver: Successfully solved ${totalProblems}+ algorithmic challenges across all difficulty levels`);
    } else if (totalProblems >= 200) {
      achievements.push(`🎯 Advanced Problem Solver: Completed ${totalProblems}+ coding challenges with consistent improvement`);
    } else if (totalProblems >= 50) {
      achievements.push(`� Dedicated Learner: Solved ${totalProblems}+ problems demonstrating strong commitment to skill development`);
    } else if (totalProblems > 0) {
      achievements.push(`🚀 Getting Started: Completed ${totalProblems}+ coding challenges with growing expertise`);
    }

    if (longestStreak >= 100) {
      achievements.push(`🔥 Consistency Champion: Maintained ${longestStreak}-day coding streak showing exceptional dedication`);
    } else if (longestStreak >= 50) {
      achievements.push(`⚡ Persistent Coder: Achieved ${longestStreak}-day longest coding streak`);
    } else if (streak >= 30) {
      achievements.push(`� Current Streak: Maintaining ${streak}-day active coding practice`);
    } else if (streak > 0) {
      achievements.push(`� Consistent Practice: Current ${streak}-day coding streak`);
    }

    if (level >= 25) {
      achievements.push(`🌟 Expert Level: Reached Level ${level} demonstrating mastery in algorithmic problem-solving`);
    } else if (level >= 15) {
      achievements.push(`🚀 Advanced Level: Achieved Level ${level} in competitive programming`);
    } else if (level >= 10) {
      achievements.push(`📊 Intermediate Level: Progressed to Level ${level} in coding proficiency`);
    } else if (level >= 5) {
      achievements.push(`📈 Growing Skills: Reached Level ${level} in problem-solving`);
    }

    const hardProblems = problemsByDifficulty?.Hard || 0;
    if (hardProblems >= 50) {
      achievements.push(`💎 Hard Problem Master: Conquered ${hardProblems}+ Hard-level algorithmic challenges`);
    } else if (hardProblems >= 20) {
      achievements.push(`🔥 Hard Problem Solver: Successfully tackled ${hardProblems}+ Hard-level problems`);
    } else if (hardProblems > 0) {
      achievements.push(`💪 Challenge Accepted: Solved ${hardProblems}+ Hard-level problems`);
    }

    const mediumProblems = problemsByDifficulty?.Medium || 0;
    if (mediumProblems >= 100) {
      achievements.push(`⚡ Medium Problem Expert: Mastered ${mediumProblems}+ Medium-complexity algorithms`);
    } else if (mediumProblems >= 50) {
      achievements.push(`🎯 Medium Problem Solver: Completed ${mediumProblems}+ Medium-level challenges`);
    }

    if (addictionScore >= 90) {
      achievements.push('🎯 Exceptional Engagement: Demonstrated outstanding commitment to continuous learning and improvement');
    } else if (addictionScore >= 70) {
      achievements.push('📈 High Engagement: Showed strong dedication to skill development and consistent practice');
    } else if (addictionScore >= 50) {
      achievements.push('🌱 Growing Commitment: Building consistent coding practice and skill development');
    }

    // Add achievements based on metrics if available
    if (metrics?.engagementLevel?.level === 'Addicted') {
      achievements.push('🏅 Peak Performance: Maintained highest level of coding engagement and consistency');
    } else if (metrics?.engagementLevel?.level === 'High') {
      achievements.push('⭐ High Performance: Demonstrated strong coding engagement and learning commitment');
    }

    // Ensure we have at least some achievements
    if (achievements.length === 0) {
      achievements.push('🌟 Coding Journey Started: Beginning the path to programming excellence');
      achievements.push('💻 Problem Solver: Developing algorithmic thinking and coding skills');
      achievements.push('📚 Continuous Learner: Committed to improving programming abilities');
    }

    return achievements.slice(0, 6); // Limit to top 6 achievements
  }

  generateProfessionalSummary(userStats, focusArea = 'fullstack') {
    const { level, totalProblems, streak } = userStats;
    
    const focusDescriptions = {
      fullstack: 'Full-Stack Developer',
      frontend: 'Frontend Developer',
      backend: 'Backend Developer',
      mobile: 'Mobile Developer',
      ai: 'AI/ML Engineer',
      devops: 'DevOps Engineer',
      data: 'Data Engineer'
    };

    const experienceLevel = level < 5 ? 'Aspiring' : 
                           level < 10 ? 'Entry-Level' : 
                           level < 20 ? 'Mid-Level' : 
                           level < 30 ? 'Senior' : 'Expert';
    
    const roleTitle = focusDescriptions[focusArea] || 'Software Developer';
    
    let summary = `${experienceLevel} ${roleTitle} with a proven track record in algorithmic problem-solving and software development. `;
    
    if (totalProblems >= 200) {
      summary += `Demonstrated exceptional technical skills by solving ${totalProblems}+ complex coding challenges, `;
    } else if (totalProblems >= 50) {
      summary += `Built strong technical foundation through solving ${totalProblems}+ coding problems, `;
    }
    
    if (streak >= 50) {
      summary += `maintaining a ${streak}-day active coding streak that showcases dedication and consistency. `;
    } else if (streak >= 20) {
      summary += `with current ${streak}-day coding streak demonstrating commitment to continuous learning. `;
    }
    
    summary += `Passionate about writing clean, efficient code and tackling complex technical challenges. `;
    summary += `Strong analytical mindset with experience in multiple programming languages and modern development practices.`;
    
    return summary;
  }

  async generateResume(userId, personalInfo, customizations = {}) {
    await this.ensureDataFiles();
    
    let userMLData = await this.getUserMLData(userId);
    
    // If no ML data exists, create sample data for the user
    if (!userMLData) {
      console.log(`No ML data found for user ${userId}, creating sample data...`);
      userMLData = this.createSampleUserData(userId);
      await this.saveSampleUserData(userId, userMLData);
    }

    const { user: userStats } = userMLData;
    const skills = this.generateSkillsFromPatterns(userStats.solvingPatterns || {});
    const projects = this.generateProjectsFromPatterns(userStats, skills.programming, skills.algorithms);
    const achievements = this.generateAchievements(userStats, userMLData.metrics || {});
    const summary = this.generateProfessionalSummary(userStats, customizations.focusArea);

    const resumeData = {
      personalInfo,
      summary,
      skills,
      projects: customizations.includeProjects !== false ? projects : [],
      achievements: customizations.includeAchievements !== false ? achievements : [],
      experience: this.generateExperience(userStats, customizations.focusArea),
      certifications: customizations.includeCertifications !== false ? this.generateCertifications(userStats) : [],
      stats: {
        totalProblems: userStats.totalProblems || 0,
        streak: userStats.streak || 0,
        level: userStats.level || 1,
        addictionScore: userStats.addictionScore || 50
      },
      template: customizations.template || 'professional',
      generatedAt: new Date().toISOString()
    };

    // Save the generated resume
    await this.saveGeneratedResume(userId, resumeData);

    return resumeData;
  }

  createSampleUserData(userId) {
    return {
      user: {
        userId,
        totalProblems: 75,
        streak: 15,
        longestStreak: 30,
        level: 8,
        addictionScore: 75,
        problemsByDifficulty: {
          Easy: 35,
          Medium: 30,
          Hard: 10
        },
        solvingPatterns: {
          languages: {
            'JavaScript': 40,
            'Python': 25,
            'Java': 10
          },
          problemTypes: {
            'Array': 20,
            'String': 15,
            'Tree': 12,
            'Dynamic Programming': 8,
            'Graph': 6
          }
        }
      },
      metrics: {
        engagementLevel: {
          level: 'High',
          score: 75
        }
      }
    };
  }

  async saveSampleUserData(userId, userData) {
    try {
      let allUserData = {};
      try {
        const data = await fs.readFile(this.userDataFile, 'utf8');
        allUserData = JSON.parse(data);
      } catch {
        // File doesn't exist, start fresh
      }

      allUserData[userId] = userData;
      await fs.writeFile(this.userDataFile, JSON.stringify(allUserData, null, 2));
      console.log(`✅ Sample data created for user ${userId}`);
    } catch (error) {
      console.error('Error saving sample user data:', error);
    }
  }

  generateExperience(userStats, focusArea) {
    const experience = [];
    const { totalProblems, level } = userStats;

    // Generate experience based on problem-solving level
    if (level >= 15 && totalProblems >= 200) {
      experience.push({
        title: 'Software Development Intern',
        company: 'Tech Solutions Inc.',
        duration: '6 months',
        location: 'Remote',
        responsibilities: [
          'Developed and optimized algorithms for data processing applications',
          'Collaborated with senior developers on code reviews and architectural decisions',
          'Implemented comprehensive unit tests achieving 95%+ code coverage',
          'Participated in agile development processes and sprint planning',
          'Contributed to open-source projects and technical documentation'
        ]
      });
    } else if (level >= 10 && totalProblems >= 100) {
      experience.push({
        title: 'Junior Developer (Project-based)',
        company: 'Freelance',
        duration: '3 months',
        location: 'Remote',
        responsibilities: [
          'Built responsive web applications using modern frameworks',
          'Implemented efficient algorithms for client-specific requirements',
          'Conducted thorough testing and debugging of applications',
          'Maintained clear documentation and version control practices'
        ]
      });
    }

    return experience;
  }

  generateCertifications(userStats) {
    const certifications = [];
    const { totalProblems, streak, level } = userStats;

    if (totalProblems >= 300) {
      certifications.push('LeetCode Problem Solving - Expert Level (300+ Problems)');
    } else if (totalProblems >= 150) {
      certifications.push('LeetCode Problem Solving - Advanced Level (150+ Problems)');
    } else if (totalProblems >= 50) {
      certifications.push('LeetCode Problem Solving - Intermediate Level (50+ Problems)');
    }

    if (streak >= 60) {
      certifications.push('Consistent Coding Practice - 60+ Day Streak Achievement');
    } else if (streak >= 30) {
      certifications.push('Consistent Coding Practice - 30+ Day Streak Achievement');
    }

    if (level >= 20) {
      certifications.push('Advanced Algorithmic Problem Solving Certification');
    }

    // Add relevant industry certifications
    certifications.push('AWS Cloud Practitioner (In Progress)');
    certifications.push('Google IT Support Professional Certificate');
    
    return certifications;
  }
}

const resumeEngine = new ResumeCreatorEngine();

// Create or update user profile
router.post('/user-profile', async (req, res) => {
  try {
    const { userId, profileData } = req.body;

    if (!userId || !profileData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and profileData'
      });
    }

    const profile = await resumeEngine.createUserProfile(userId, profileData);

    res.json({
      success: true,
      data: profile,
      message: 'User profile created/updated successfully'
    });

  } catch (error) {
    console.error('User profile creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create user profile'
    });
  }
});

// Get user profile
router.get('/user-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await resumeEngine.getUserProfile(userId);
    
    res.json({
      success: true,
      data: profile,
      exists: !!profile
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

// Update user preferences
router.post('/user-preferences', async (req, res) => {
  try {
    const { userId, preferences } = req.body;

    if (!userId || !preferences) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and preferences'
      });
    }

    const updatedPreferences = await resumeEngine.updateUserPreferences(userId, preferences);

    res.json({
      success: true,
      data: updatedPreferences,
      message: 'User preferences updated successfully'
    });

  } catch (error) {
    console.error('User preferences update error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update user preferences'
    });
  }
});

// Get user preferences
router.get('/user-preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const preferences = await resumeEngine.getUserPreferences(userId);
    
    res.json({
      success: true,
      data: preferences
    });

  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user preferences'
    });
  }
});

// Generate manual resume
router.post('/generate-manual', async (req, res) => {
  try {
    const { userId, resumeData } = req.body;

    if (!userId || !resumeData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and resumeData'
      });
    }

    // Process and format the manual resume data
    const processedResume = {
      personalInfo: resumeData.personalInfo,
      summary: resumeData.personalInfo.summary,
      skills: {
        programming: resumeData.skills.programming || [],
        algorithms: [], // Will be populated from coding stats if available
        tools: resumeData.skills.tools || [],
        soft: resumeData.skills.soft || []
      },
      experience: resumeData.experience || [],
      projects: resumeData.projects || [],
      education: resumeData.education || [],
      achievements: resumeData.achievements || [],
      certifications: resumeData.certifications || [],
      stats: {
        totalProblems: 0,
        streak: 0,
        level: 0,
        addictionScore: 0
      },
      template: 'manual',
      generatedAt: new Date().toISOString(),
      isManual: true
    };

    // Try to get user's coding stats to enhance the resume
    try {
      const userMLData = await resumeEngine.getUserMLData(userId);
      if (userMLData && userMLData.user) {
        processedResume.stats = {
          totalProblems: userMLData.user.totalProblems || 0,
          streak: userMLData.user.streak || 0,
          level: userMLData.user.level || 0,
          addictionScore: userMLData.user.addictionScore || 0
        };

        // Add algorithm skills from coding patterns
        if (userMLData.user.solvingPatterns?.problemTypes) {
          const topicMap = {
            'Array': 'Array Algorithms',
            'String': 'String Processing',
            'LinkedList': 'Linked Lists',
            'Tree': 'Binary Trees & BST',
            'Graph': 'Graph Algorithms',
            'DynamicProgramming': 'Dynamic Programming',
            'Greedy': 'Greedy Algorithms',
            'Backtracking': 'Backtracking',
            'BinarySearch': 'Binary Search',
            'TwoPointers': 'Two Pointers',
            'SlidingWindow': 'Sliding Window',
            'Stack': 'Stack & Queue',
            'Heap': 'Heap & Priority Queue'
          };

          processedResume.skills.algorithms = Object.entries(userMLData.user.solvingPatterns.problemTypes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6)
            .map(([topic]) => topicMap[topic] || topic);
        }
      }
    } catch (error) {
      console.log('Could not fetch coding stats, proceeding with manual data only');
    }

    // Save the manual resume
    await resumeEngine.saveGeneratedResume(userId, processedResume);

    res.json({
      success: true,
      data: processedResume,
      message: 'Manual resume generated successfully'
    });

  } catch (error) {
    console.error('Manual resume generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate manual resume'
    });
  }
});

// Get AI suggestions for resume content
router.post('/ai-suggestions', async (req, res) => {
  try {
    const { type, context, userId } = req.body;

    if (!type || !context) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type and context'
      });
    }

    let prompt = '';
    
    switch (type) {
      case 'summary':
        prompt = `Generate 3 professional summary suggestions for a ${context.role || 'software developer'} with the following experience: ${JSON.stringify(context.experience || [])}. Each summary should be 2-3 sentences and highlight key strengths.`;
        break;
      
      case 'responsibilities':
        prompt = `Generate 5 professional responsibility/achievement bullet points for a ${context.title || 'Software Developer'} role at ${context.company || 'a technology company'}. Focus on quantifiable achievements and technical skills. Format as action-oriented statements.`;
        break;
      
      case 'skills':
        prompt = `Suggest relevant technical skills for a ${context.role || 'software developer'} position. Include programming languages, frameworks, tools, and soft skills. Return as categorized lists.`;
        break;
      
      case 'achievements':
        prompt = `Generate 4 professional achievement statements for a software developer. Focus on measurable impact, technical accomplishments, and career growth. Format as concise bullet points.`;
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid suggestion type'
        });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse suggestions from AI response
    const suggestions = text.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 10)
      .slice(0, 5);

    res.json({
      success: true,
      suggestions: suggestions,
      type: type
    });

  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI suggestions'
    });
  }
});
router.post('/generate-user-based-template', async (req, res) => {
  try {
    const { userId, personalInfo, focusArea = 'fullstack' } = req.body;

    if (!userId || !personalInfo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and personalInfo'
      });
    }

    const aiTemplate = await resumeEngine.generateUserBasedTemplate(userId, personalInfo, focusArea);

    res.json({
      success: true,
      data: aiTemplate,
      message: 'User-based AI template generated successfully'
    });

  } catch (error) {
    console.error('User-based template generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate user-based template'
    });
  }
});

// Generate AI-powered template
router.post('/generate-ai-template', async (req, res) => {
  try {
    const { userId, personalInfo, focusArea = 'fullstack' } = req.body;

    if (!userId || !personalInfo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and personalInfo'
      });
    }

    let userMLData = await resumeEngine.getUserMLData(userId);
    
    // If no ML data exists, create sample data
    if (!userMLData) {
      userMLData = resumeEngine.createSampleUserData(userId);
      await resumeEngine.saveSampleUserData(userId, userMLData);
    }

    const aiTemplate = await resumeEngine.generateAITemplate(userMLData.user, personalInfo, focusArea);

    res.json({
      success: true,
      data: aiTemplate,
      message: 'AI template generated successfully'
    });

  } catch (error) {
    console.error('AI template generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate AI template'
    });
  }
});

// Get user's AI-generated templates
router.get('/ai-templates/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const aiTemplates = await resumeEngine.getUserAITemplates(userId);
    
    res.json({
      success: true,
      data: aiTemplates,
      count: aiTemplates.length
    });

  } catch (error) {
    console.error('Error fetching AI templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI templates'
    });
  }
});

// Generate resume with AI template
router.post('/generate-with-ai-template', async (req, res) => {
  try {
    const { userId, personalInfo, aiTemplate, customizations = {} } = req.body;

    if (!userId || !personalInfo || !aiTemplate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, personalInfo, and aiTemplate'
      });
    }

    // Merge AI template customizations with user customizations
    const mergedCustomizations = {
      ...customizations,
      template: aiTemplate.templateName,
      aiTemplate: aiTemplate,
      focusArea: aiTemplate.targetRole?.toLowerCase() || customizations.focusArea || 'fullstack'
    };

    const resumeData = await resumeEngine.generateResume(userId, personalInfo, mergedCustomizations);

    res.json({
      success: true,
      data: resumeData,
      message: 'Resume generated with AI template successfully'
    });

  } catch (error) {
    console.error('AI resume generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate resume with AI template'
    });
  }
});
router.post('/generate', async (req, res) => {
  try {
    const { userId, personalInfo, customizations } = req.body;

    if (!userId || !personalInfo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and personalInfo'
      });
    }

    const resumeData = await resumeEngine.generateResume(userId, personalInfo, customizations);

    res.json({
      success: true,
      data: resumeData,
      message: 'Resume generated successfully'
    });

  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate resume'
    });
  }
});

// Get user's saved resumes
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const resumeDataFile = path.join(__dirname, '../data/generated-resumes.json');
    
    try {
      const data = await fs.readFile(resumeDataFile, 'utf8');
      const resumes = JSON.parse(data);
      const userResumes = resumes[userId] || [];
      
      res.json({
        success: true,
        data: userResumes.reverse(), // Most recent first
        count: userResumes.length
      });
    } catch (error) {
      res.json({
        success: true,
        data: [],
        count: 0
      });
    }

  } catch (error) {
    console.error('Error fetching resume history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resume history'
    });
  }
});

// Get available templates
router.get('/templates', async (req, res) => {
  try {
    await resumeEngine.ensureDataFiles();
    
    const templatesFile = path.join(__dirname, '../data/resume-templates/templates.json');
    const data = await fs.readFile(templatesFile, 'utf8');
    const templates = JSON.parse(data);

    res.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates'
    });
  }
});

// Export resume in different formats
router.post('/export', async (req, res) => {
  try {
    const { resumeData, format = 'txt' } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: 'Resume data is required'
      });
    }

    let exportedContent;
    let contentType;
    let fileExtension;

    switch (format.toLowerCase()) {
      case 'txt':
        exportedContent = formatResumeAsText(resumeData);
        contentType = 'text/plain';
        fileExtension = 'txt';
        break;
      case 'json':
        exportedContent = JSON.stringify(resumeData, null, 2);
        contentType = 'application/json';
        fileExtension = 'json';
        break;
      case 'pdf':
        try {
          const htmlContent = formatResumeAsHTML(resumeData);
          const options = {
            format: 'A4',
            printBackground: true,
            margin: {
              top: '20mm',
              bottom: '20mm',
              left: '15mm',
              right: '15mm'
            }
          };
          
          const file = { content: htmlContent };
          const pdfBuffer = await htmlPdf.generatePdf(file, options);
          
          const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
          
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
          res.send(pdfBuffer);
          return;
        } catch (pdfError) {
          console.error('PDF generation error:', pdfError);
          return res.status(500).json({
            success: false,
            error: 'Failed to generate PDF. Please try again.'
          });
        }
      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported format. Supported formats: txt, json, pdf'
        });
    }

    const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.${fileExtension}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(exportedContent);

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export resume'
    });
  }
});

function formatResumeAsText(resume) {
  let text = '';
  
  // Header
  text += `${resume.personalInfo.name}\n`;
  text += `${resume.personalInfo.email}`;
  if (resume.personalInfo.phone) text += ` | ${resume.personalInfo.phone}`;
  text += '\n';
  if (resume.personalInfo.location) text += `${resume.personalInfo.location}\n`;
  if (resume.personalInfo.linkedin) text += `LinkedIn: ${resume.personalInfo.linkedin}\n`;
  if (resume.personalInfo.github) text += `GitHub: ${resume.personalInfo.github}\n`;
  text += '\n';
  
  // Summary
  text += 'PROFESSIONAL SUMMARY\n';
  text += '===================\n';
  text += `${resume.summary}\n\n`;
  
  // Skills
  text += 'TECHNICAL SKILLS\n';
  text += '===============\n';
  text += `Programming Languages: ${resume.skills.programming.join(', ')}\n`;
  text += `Algorithms & Data Structures: ${resume.skills.algorithms.join(', ')}\n`;
  text += `Tools & Technologies: ${resume.skills.tools.join(', ')}\n`;
  text += `Core Competencies: ${resume.skills.soft.join(', ')}\n\n`;
  
  // Experience
  if (resume.experience && resume.experience.length > 0) {
    text += 'PROFESSIONAL EXPERIENCE\n';
    text += '======================\n';
    resume.experience.forEach(exp => {
      text += `${exp.title} - ${exp.company}\n`;
      text += `${exp.duration}`;
      if (exp.location) text += ` | ${exp.location}`;
      text += '\n';
      exp.responsibilities.forEach(resp => {
        text += `• ${resp}\n`;
      });
      text += '\n';
    });
  }
  
  // Projects
  if (resume.projects && resume.projects.length > 0) {
    text += 'PROJECTS\n';
    text += '========\n';
    resume.projects.forEach(project => {
      text += `${project.name}\n`;
      text += `${project.description}\n`;
      text += `Technologies: ${project.technologies.join(', ')}\n`;
      project.highlights.forEach(highlight => {
        text += `• ${highlight}\n`;
      });
      text += '\n';
    });
  }
  
  // Achievements
  if (resume.achievements && resume.achievements.length > 0) {
    text += 'ACHIEVEMENTS\n';
    text += '============\n';
    resume.achievements.forEach(achievement => {
      text += `• ${achievement}\n`;
    });
    text += '\n';
  }
  
  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    text += 'CERTIFICATIONS\n';
    text += '==============\n';
    resume.certifications.forEach(cert => {
      text += `• ${cert}\n`;
    });
    text += '\n';
  }
  
  // Coding Statistics
  text += 'CODING STATISTICS\n';
  text += '=================\n';
  text += `• Problems Solved: ${resume.stats.totalProblems}\n`;
  text += `• Current Streak: ${resume.stats.streak} days\n`;
  text += `• Coding Level: ${resume.stats.level}\n`;
  text += `• Engagement Score: ${resume.stats.addictionScore}/100\n`;
  
  return text;
}

function formatResumeAsHTML(resume) {
  const templateColors = {
    professional: '#2563eb',
    creative: '#7c3aed',
    technical: '#059669',
    minimal: '#dc2626'
  };
  
  // Use AI template colors if available
  let primaryColor = templateColors[resume.template] || '#2563eb';
  let secondaryColor = primaryColor;
  let accentColor = primaryColor;
  
  if (resume.aiTemplate && resume.aiTemplate.styles) {
    primaryColor = resume.aiTemplate.styles.primaryColor || primaryColor;
    secondaryColor = resume.aiTemplate.styles.secondaryColor || primaryColor;
    accentColor = resume.aiTemplate.styles.accentColor || primaryColor;
  }
  
  const fontFamily = resume.aiTemplate?.styles?.fontFamily || 'Arial, sans-serif';
  const layout = resume.aiTemplate?.styles?.layout || 'traditional';
  const spacing = resume.aiTemplate?.styles?.spacing || 'normal';
  
  // Dynamic spacing based on AI template
  const spacingValues = {
    compact: { section: '25px', padding: '15px', margin: '10px' },
    normal: { section: '35px', padding: '20px', margin: '15px' },
    spacious: { section: '45px', padding: '25px', margin: '20px' }
  };
  
  const spacingConfig = spacingValues[spacing] || spacingValues.normal;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resume.personalInfo.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fontFamily};
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        
        .header {
            text-align: ${resume.aiTemplate?.styles?.headerStyle === 'left-aligned' ? 'left' : 'center'};
            margin-bottom: ${spacingConfig.section};
            padding-bottom: ${spacingConfig.padding};
            border-bottom: ${resume.aiTemplate?.styles?.headerStyle === 'bold' ? '4px' : '3px'} solid ${primaryColor};
            ${layout === 'modern' ? `
                background: linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}05);
                padding: ${spacingConfig.padding};
                border-radius: 10px;
                border-bottom: none;
                border-left: 5px solid ${primaryColor};
            ` : ''}
        }
        
        .header h1 {
            font-size: ${layout === 'modern' ? '2.8em' : '2.5em'};
            color: ${primaryColor};
            margin-bottom: ${spacingConfig.margin};
            font-weight: ${resume.aiTemplate?.styles?.headerStyle === 'bold' ? 'bold' : 'normal'};
            ${layout === 'creative' ? 'text-shadow: 2px 2px 4px rgba(0,0,0,0.1);' : ''}
        }
        
        .contact-info {
            color: #666;
            font-size: 1.1em;
            ${layout === 'modern' ? `
                display: flex;
                flex-wrap: wrap;
                justify-content: ${resume.aiTemplate?.styles?.headerStyle === 'left-aligned' ? 'flex-start' : 'center'};
                gap: 15px;
            ` : ''}
        }
        
        .contact-info p {
            margin: 5px 0;
            ${layout === 'modern' ? `
                background: white;
                padding: 5px 10px;
                border-radius: 15px;
                border: 1px solid ${primaryColor}30;
                margin: 0;
            ` : ''}
        }
        
        .section {
            margin-bottom: ${spacingConfig.section};
        }
        
        .section-title {
            font-size: 1.4em;
            color: ${primaryColor};
            font-weight: bold;
            margin-bottom: ${spacingConfig.margin};
            padding-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            ${resume.aiTemplate?.styles?.sectionDivider === 'colored-bar' ? `
                border-bottom: 3px solid ${accentColor};
                background: linear-gradient(90deg, ${primaryColor}15, transparent);
                padding: 10px;
                border-radius: 5px;
            ` : resume.aiTemplate?.styles?.sectionDivider === 'dotted' ? `
                border-bottom: 2px dotted ${primaryColor};
            ` : resume.aiTemplate?.styles?.sectionDivider === 'none' ? '' : `
                border-bottom: 2px solid ${primaryColor};
            `}
        }
        
        .summary {
            font-size: 1.1em;
            line-height: 1.7;
            text-align: justify;
            color: #444;
            ${layout === 'modern' ? `
                background: ${primaryColor}05;
                padding: ${spacingConfig.padding};
                border-radius: 10px;
                border-left: 4px solid ${accentColor};
            ` : ''}
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(${layout === 'compact' ? '250px' : '300px'}, 1fr));
            gap: ${spacingConfig.margin};
            margin-top: ${spacingConfig.margin};
        }
        
        .skill-category {
            background: ${layout === 'minimal' ? '#f8f9fa' : `linear-gradient(135deg, ${primaryColor}08, ${secondaryColor}03)`};
            padding: ${spacingConfig.margin};
            border-radius: ${layout === 'modern' ? '12px' : '8px'};
            border-left: 4px solid ${accentColor};
            ${layout === 'creative' ? `box-shadow: 0 4px 6px rgba(0,0,0,0.1);` : ''}
        }
        
        .skill-category h3 {
            color: ${primaryColor};
            font-size: 1.1em;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        .skill-category p {
            color: #555;
            line-height: 1.5;
        }
        
        .experience-item, .project-item {
            margin-bottom: ${spacingConfig.section};
            padding: ${spacingConfig.padding};
            background: ${layout === 'minimal' ? '#f8f9fa' : `linear-gradient(135deg, ${primaryColor}05, ${secondaryColor}02)`};
            border-radius: ${layout === 'modern' ? '12px' : '8px'};
            border-left: 4px solid ${accentColor};
            ${layout === 'creative' ? `box-shadow: 0 2px 4px rgba(0,0,0,0.1);` : ''}
        }
        
        .experience-item h3, .project-item h3 {
            color: ${primaryColor};
            font-size: 1.2em;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .experience-meta, .project-meta {
            color: #666;
            font-style: italic;
            margin-bottom: ${spacingConfig.margin};
        }
        
        .project-description {
            color: #555;
            margin-bottom: ${spacingConfig.margin};
            line-height: 1.6;
        }
        
        .technologies {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            color: white;
            padding: 5px 12px;
            border-radius: ${layout === 'modern' ? '20px' : '15px'};
            font-size: 0.9em;
            display: inline-block;
            margin-bottom: ${spacingConfig.margin};
            ${layout === 'creative' ? 'box-shadow: 0 2px 4px rgba(0,0,0,0.2);' : ''}
        }
        
        .responsibilities, .highlights, .achievements, .certifications {
            list-style: none;
            padding-left: 0;
        }
        
        .responsibilities li, .highlights li, .achievements li, .certifications li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 8px;
            color: #555;
            line-height: 1.5;
        }
        
        .responsibilities li:before, .highlights li:before, .achievements li:before, .certifications li:before {
            content: "▸";
            color: ${accentColor};
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: ${spacingConfig.margin};
            margin-top: ${spacingConfig.margin};
        }
        
        .stat-item {
            text-align: center;
            padding: ${spacingConfig.padding};
            background: linear-gradient(135deg, ${primaryColor}15, ${accentColor}05);
            border-radius: ${layout === 'modern' ? '15px' : '10px'};
            border: 2px solid ${primaryColor}30;
            ${layout === 'creative' ? 'box-shadow: 0 4px 8px rgba(0,0,0,0.1);' : ''}
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: ${primaryColor};
            display: block;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }
        
        ${resume.aiTemplate?.customizations?.minimalistDesign ? `
            .header { border-bottom: 1px solid #ddd; }
            .section-title { border-bottom: 1px solid #ddd; text-transform: none; }
            .skill-category, .experience-item, .project-item { background: white; border: 1px solid #eee; }
        ` : ''}
        
        @media print {
            body {
                padding: 20px;
            }
            
            .section {
                page-break-inside: avoid;
                margin-bottom: 20px;
            }
            
            .header h1 {
                font-size: 2.2em;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${resume.personalInfo.name}</h1>
        <div class="contact-info">
            <p>${resume.personalInfo.email}${resume.personalInfo.phone ? ' | ' + resume.personalInfo.phone : ''}</p>
            ${resume.personalInfo.location ? `<p>${resume.personalInfo.location}</p>` : ''}
            ${resume.personalInfo.linkedin ? `<p>LinkedIn: ${resume.personalInfo.linkedin}</p>` : ''}
            ${resume.personalInfo.github ? `<p>GitHub: ${resume.personalInfo.github}</p>` : ''}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p class="summary">${resume.summary}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Technical Skills</h2>
        <div class="skills-grid">
            <div class="skill-category">
                <h3>Programming Languages</h3>
                <p>${resume.skills.programming.join(', ')}</p>
            </div>
            <div class="skill-category">
                <h3>Algorithms & Data Structures</h3>
                <p>${resume.skills.algorithms.join(', ')}</p>
            </div>
            <div class="skill-category">
                <h3>Tools & Technologies</h3>
                <p>${resume.skills.tools.join(', ')}</p>
            </div>
            <div class="skill-category">
                <h3>Core Competencies</h3>
                <p>${resume.skills.soft.join(', ')}</p>
            </div>
        </div>
    </div>

    ${resume.experience && resume.experience.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        ${resume.experience.map(exp => `
            <div class="experience-item">
                <h3>${exp.title} - ${exp.company}</h3>
                <p class="experience-meta">${exp.duration}${exp.location ? ' | ' + exp.location : ''}</p>
                <ul class="responsibilities">
                    ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${resume.projects && resume.projects.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Projects</h2>
        ${resume.projects.map(project => `
            <div class="project-item">
                <h3>${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="technologies">Technologies: ${project.technologies.join(', ')}</div>
                <ul class="highlights">
                    ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${resume.achievements && resume.achievements.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Achievements</h2>
        <ul class="achievements">
            ${resume.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${resume.certifications && resume.certifications.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Certifications</h2>
        <ul class="certifications">
            ${resume.certifications.map(cert => `<li>${cert}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${resume.aiTemplate?.customizations?.showCodingStats !== false ? `
    <div class="section">
        <h2 class="section-title">Coding Statistics</h2>
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-number">${resume.stats.totalProblems}</span>
                <span class="stat-label">Problems Solved</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${resume.stats.streak}</span>
                <span class="stat-label">Day Streak</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${resume.stats.level}</span>
                <span class="stat-label">Coding Level</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${resume.stats.addictionScore}</span>
                <span class="stat-label">Engagement Score</span>
            </div>
        </div>
    </div>
    ` : ''}

    ${resume.aiTemplate ? `
    <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${primaryColor};">
        <p style="font-size: 0.9em; color: #666; margin: 0;">
            <strong>AI-Generated Template:</strong> ${resume.aiTemplate.displayName} - ${resume.aiTemplate.description}
        </p>
    </div>
    ` : ''}
</body>
</html>`;
}

module.exports = router;