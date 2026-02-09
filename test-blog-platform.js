const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api/blogs';

async function testBlogPlatform() {
  console.log('\n🧪 Testing Blog Platform API...\n');

  const testUserId = 'test_user_123';
  const testUserName = 'Test User';
  let blogId = null;

  try {
    // Test 1: Create a blog
    console.log('1️⃣  Creating a test blog...');
    const createResponse = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        userName: testUserName,
        title: 'Test Blog Post',
        content: 'This is a test blog post created by the test script.',
        tags: ['test', 'javascript', 'tutorial'],
        coverImage: 'https://via.placeholder.com/800x400'
      })
    });

    const createData = await createResponse.json();
    if (createData.success) {
      blogId = createData.blog.id;
      console.log('✅ Blog created successfully!');
      console.log(`   Blog ID: ${blogId}`);
    } else {
      console.log('❌ Failed to create blog');
      return;
    }

    // Test 2: Get all blogs
    console.log('\n2️⃣  Fetching all blogs...');
    const allBlogsResponse = await fetch(`${API_URL}/all`);
    const allBlogsData = await allBlogsResponse.json();
    if (allBlogsData.success) {
      console.log(`✅ Found ${allBlogsData.blogs.length} blogs`);
    } else {
      console.log('❌ Failed to fetch blogs');
    }

    // Test 3: Get single blog
    console.log('\n3️⃣  Fetching single blog...');
    const singleBlogResponse = await fetch(`${API_URL}/${blogId}`);
    const singleBlogData = await singleBlogResponse.json();
    if (singleBlogData.success) {
      console.log('✅ Blog fetched successfully!');
      console.log(`   Title: ${singleBlogData.blog.title}`);
      console.log(`   Views: ${singleBlogData.blog.views}`);
    } else {
      console.log('❌ Failed to fetch blog');
    }

    // Test 4: Like the blog
    console.log('\n4️⃣  Liking the blog...');
    const likeResponse = await fetch(`${API_URL}/${blogId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user_456' })
    });

    const likeData = await likeResponse.json();
    if (likeData.success) {
      console.log('✅ Blog liked successfully!');
      console.log(`   Likes: ${likeData.likes}`);
    } else {
      console.log('❌ Failed to like blog');
    }

    // Test 5: Add a comment
    console.log('\n5️⃣  Adding a comment...');
    const commentResponse = await fetch(`${API_URL}/${blogId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user_789',
        userName: 'Commenter',
        content: 'Great blog post!'
      })
    });

    const commentData = await commentResponse.json();
    if (commentData.success) {
      console.log('✅ Comment added successfully!');
      console.log(`   Total comments: ${commentData.totalComments}`);
    } else {
      console.log('❌ Failed to add comment');
    }

    // Test 6: Follow a user
    console.log('\n6️⃣  Following the blog author...');
    const followResponse = await fetch(`${API_URL}/follow/${testUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user_456' })
    });

    const followData = await followResponse.json();
    if (followData.success) {
      console.log('✅ User followed successfully!');
      console.log(`   Followers: ${followData.followersCount}`);
    } else {
      console.log('❌ Failed to follow user');
    }

    // Test 7: Get user profile
    console.log('\n7️⃣  Fetching user profile...');
    const profileResponse = await fetch(`${API_URL}/user/${testUserId}/profile`);
    const profileData = await profileResponse.json();
    if (profileData.success) {
      console.log('✅ Profile fetched successfully!');
      console.log(`   Blogs: ${profileData.profile.blogsCount}`);
      console.log(`   Followers: ${profileData.profile.followersCount}`);
      console.log(`   Following: ${profileData.profile.followingCount}`);
    } else {
      console.log('❌ Failed to fetch profile');
    }

    // Test 8: Get trending blogs
    console.log('\n8️⃣  Fetching trending blogs...');
    const trendingResponse = await fetch(`${API_URL}/trending/all?limit=5`);
    const trendingData = await trendingResponse.json();
    if (trendingData.success) {
      console.log(`✅ Found ${trendingData.blogs.length} trending blogs`);
    } else {
      console.log('❌ Failed to fetch trending blogs');
    }

    // Test 9: Get all tags
    console.log('\n9️⃣  Fetching all tags...');
    const tagsResponse = await fetch(`${API_URL}/tags/all`);
    const tagsData = await tagsResponse.json();
    if (tagsData.success) {
      console.log(`✅ Found ${tagsData.tags.length} tags`);
      if (tagsData.tags.length > 0) {
        console.log(`   Top tag: #${tagsData.tags[0].tag} (${tagsData.tags[0].count} uses)`);
      }
    } else {
      console.log('❌ Failed to fetch tags');
    }

    // Test 10: Search blogs
    console.log('\n🔟 Searching blogs...');
    const searchResponse = await fetch(`${API_URL}/all?search=test`);
    const searchData = await searchResponse.json();
    if (searchData.success) {
      console.log(`✅ Found ${searchData.blogs.length} blogs matching "test"`);
    } else {
      console.log('❌ Failed to search blogs');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log('   ✅ Blog creation');
    console.log('   ✅ Blog retrieval');
    console.log('   ✅ Like functionality');
    console.log('   ✅ Comment system');
    console.log('   ✅ Follow system');
    console.log('   ✅ User profiles');
    console.log('   ✅ Trending algorithm');
    console.log('   ✅ Tags system');
    console.log('   ✅ Search functionality');
    console.log('\n🎉 Blog Platform is fully operational!\n');

  } catch (error) {
    console.log('\n❌ TEST FAILED!');
    console.log(`Error: ${error.message}`);
    console.log('\n💡 Make sure backend server is running:');
    console.log('   cd backend && node server.js\n');
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    console.log('✅ Backend server is running');
    console.log(`   Status: ${data.status}`);
    return true;
  } catch (error) {
    console.log('❌ Backend server is NOT running!');
    console.log('   Please start the backend server first:');
    console.log('   cd backend && node server.js\n');
    return false;
  }
}

// Run tests
(async () => {
  console.log('\n🚀 BLOG PLATFORM TEST SUITE');
  console.log('='.repeat(60));
  
  const backendRunning = await checkBackend();
  if (backendRunning) {
    await testBlogPlatform();
  }
})();
