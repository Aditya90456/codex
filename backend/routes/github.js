const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');

// GitHub sync solution endpoint
router.post('/sync-solution', async (req, res) => {
  try {
    const { 
      fileName, 
      folderPath, 
      content, 
      problemTitle,
      language 
    } = req.body;

    // Validate required fields
    if (!fileName || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fileName and content are required'
      });
    }

    // Get GitHub token from environment
    const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    
    if (!githubToken) {
      return res.status(500).json({
        success: false,
        error: 'GitHub token not configured. Please set GITHUB_TOKEN in your .env file'
      });
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: githubToken
    });

    // Get authenticated user (token owner)
    let authenticatedUser;
    try {
      const { data } = await octokit.users.getAuthenticated();
      authenticatedUser = data.login;
      console.log('✅ Authenticated as:', authenticatedUser);
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid GitHub token. Please check your token and try again.'
      });
    }

    const repoName = 'leetcode-solutions';
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
    const owner = authenticatedUser;

    try {
      // Check if repository exists
      let repoExists = false;
      try {
        await octokit.repos.get({
          owner,
          repo: repoName
        });
        repoExists = true;
        console.log('✅ Repository exists');
      } catch (error) {
        if (error.status === 404) {
          console.log('📦 Creating new repository...');
          // Create repository if it doesn't exist
          await octokit.repos.createForAuthenticatedUser({
            name: repoName,
            description: 'My LeetCode solutions - Auto-synced from CP-AI',
            private: false,
            auto_init: true
          });
          
          console.log('✅ Repository created');
          
          // Wait for repo initialization
          await new Promise(resolve => setTimeout(resolve, 3000));
          repoExists = true;
        } else {
          throw error;
        }
      }

      // Check if file already exists
      let sha;
      try {
        const existingFile = await octokit.repos.getContent({
          owner,
          repo: repoName,
          path: filePath
        });
        sha = existingFile.data.sha;
        console.log('📝 File exists, will update');
      } catch (error) {
        // File doesn't exist, that's okay
        sha = null;
        console.log('📝 New file, will create');
      }

      // Create or update file
      const commitMessage = sha 
        ? `Update: ${problemTitle || 'Solution'} (${language})`
        : `Add: ${problemTitle || 'Solution'} (${language})`;

      console.log('💾 Committing file:', filePath);
      
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: filePath,
        message: commitMessage,
        content: Buffer.from(content).toString('base64'),
        sha: sha || undefined
      });

      // Generate file URL
      const fileUrl = `https://github.com/${owner}/${repoName}/blob/main/${filePath}`;

      console.log('✅ File synced successfully:', fileUrl);

      res.json({
        success: true,
        message: 'Solution synced to GitHub successfully',
        fileUrl
      });

    } catch (githubError) {
      console.error('GitHub API Error:', githubError);
      
      // Handle specific GitHub errors
      if (githubError.status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Invalid GitHub token. Please check your credentials.'
        });
      } else if (githubError.status === 403) {
        return res.status(403).json({
          success: false,
          error: 'GitHub API rate limit exceeded or insufficient permissions.'
        });
      } else if (githubError.status === 404) {
        return res.status(404).json({
          success: false,
          error: 'Repository or user not found.'
        });
      }
      
      throw githubError;
    }

  } catch (error) {
    console.error('GitHub sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sync solution to GitHub'
    });
  }
});

module.exports = router;
