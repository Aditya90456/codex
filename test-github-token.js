const { Octokit } = require('@octokit/rest');
require('dotenv').config({ path: './backend/.env' });

async function testToken() {
  console.log('🔍 Testing GitHub Token Configuration\n');
  console.log('=' .repeat(50));
  
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('❌ ERROR: No GITHUB_TOKEN found in backend/.env');
    console.log('\n📝 To fix:');
    console.log('1. Open backend/.env');
    console.log('2. Add: GITHUB_TOKEN=your_token_here');
    console.log('3. Get token from: https://github.com/settings/tokens');
    return;
  }
  
  console.log('✅ Token found in .env');
  console.log('📝 Token preview:', token.substring(0, 15) + '...\n');
  
  const octokit = new Octokit({ auth: token });
  
  try {
    // Test 1: Authentication
    console.log('Test 1: Authentication');
    console.log('-'.repeat(50));
    const { data: user } = await octokit.users.getAuthenticated();
    console.log('✅ Authenticated successfully!');
    console.log('👤 Username:', user.login);
    console.log('📧 Email:', user.email || 'Not public');
    console.log('🔗 Profile:', user.html_url);
    
    // Test 2: Check scopes
    console.log('\nTest 2: Token Permissions');
    console.log('-'.repeat(50));
    const { headers } = await octokit.request('GET /user/repos', {
      per_page: 1
    });
    
    const scopes = headers['x-oauth-scopes'] || 'No scopes header';
    console.log('📋 Token scopes:', scopes);
    
    if (scopes.includes('repo')) {
      console.log('✅ Has "repo" scope - Can create repositories!');
    } else {
      console.log('❌ Missing "repo" scope - Cannot create repositories!');
      console.log('\n🔧 FIX REQUIRED:');
      console.log('1. Go to: https://github.com/settings/tokens');
      console.log('2. Generate new token with "repo" scope');
      console.log('3. Update GITHUB_TOKEN in backend/.env');
      return;
    }
    
    // Test 3: Rate limits
    console.log('\nTest 3: Rate Limits');
    console.log('-'.repeat(50));
    const rateLimit = await octokit.rateLimit.get();
    const core = rateLimit.data.resources.core;
    console.log('📊 Rate limit:', core.remaining, '/', core.limit);
    console.log('🔄 Resets at:', new Date(core.reset * 1000).toLocaleString());
    
    if (core.remaining < 10) {
      console.log('⚠️  WARNING: Low rate limit remaining!');
    } else {
      console.log('✅ Sufficient rate limit available');
    }
    
    // Test 4: Try to list repos (tests read permission)
    console.log('\nTest 4: Repository Access');
    console.log('-'.repeat(50));
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      per_page: 5,
      sort: 'updated'
    });
    console.log('✅ Can access repositories');
    console.log('📦 Total repositories:', repos.length > 0 ? `${repos.length}+ repos` : '0 repos');
    
    if (repos.length > 0) {
      console.log('📝 Recent repos:');
      repos.slice(0, 3).forEach(repo => {
        console.log(`   - ${repo.name} (${repo.private ? 'private' : 'public'})`);
      });
    }
    
    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS PASSED!');
    console.log('🎉 GitHub integration is ready to use!');
    console.log('='.repeat(50));
    
    console.log('\n📝 Next steps:');
    console.log('1. Start backend: cd backend && npm start');
    console.log('2. Go to LeetCode Editor');
    console.log('3. Solve a problem');
    console.log('4. Click "Sync to GitHub" button');
    console.log('5. Check your GitHub profile for new repo!');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.log('\n🔍 Error details:');
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    
    if (error.status === 401) {
      console.log('\n🔧 FIX: Token is invalid or expired');
      console.log('1. Go to: https://github.com/settings/tokens');
      console.log('2. Generate new token (classic)');
      console.log('3. Select "repo" scope');
      console.log('4. Copy token');
      console.log('5. Update GITHUB_TOKEN in backend/.env');
    } else if (error.status === 403) {
      console.log('\n🔧 FIX: Token lacks required permissions');
      console.log('1. Current token missing "repo" scope');
      console.log('2. Generate new token with "repo" scope');
      console.log('3. Update GITHUB_TOKEN in backend/.env');
    } else if (error.status === 404) {
      console.log('\n🔧 FIX: Resource not found');
      console.log('This might be a temporary GitHub issue');
    } else {
      console.log('\n🔧 FIX: Unknown error');
      console.log('Check your internet connection and try again');
    }
    
    console.log('\n📚 Full guide: See GITHUB_FIX_NOW.md');
  }
}

// Run the test
console.log('🚀 Starting GitHub Token Test...\n');
testToken().catch(console.error);
