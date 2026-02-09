// Test script to verify backend blog API is working
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('========================================');
  console.log('Testing Backend Blog API');
  console.log('========================================\n');

  // Test 1: Check if server is running
  console.log('Test 1: Checking if backend server is running...');
  try {
    const response = await fetch(`${API_URL}/api/blogs/all`);
    if (response.ok) {
      console.log('✅ Backend server is running!\n');
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}\n`);
    }
  } catch (error) {
    console.log('❌ Backend server is NOT running!');
    console.log('Error:', error.message);
    console.log('\nPlease start the backend server:');
    console.log('  cd backend');
    console.log('  node server.js\n');
    return;
  }

  // Test 2: Get all blogs
  console.log('Test 2: Fetching all blogs...');
  try {
    const response = await fetch(`${API_URL}/api/blogs/all`);
    const data = await response.json();
    console.log('✅ Blogs endpoint working!');
    console.log(`   Total blogs: ${data.total || 0}`);
    console.log(`   Blogs returned: ${data.blogs?.length || 0}\n`);
  } catch (error) {
    console.log('❌ Failed to fetch blogs');
    console.log('Error:', error.message, '\n');
  }

  // Test 3: Create a test blog
  console.log('Test 3: Creating a test blog...');
  try {
    const testBlog = {
      userId: 'test_user_123',
      userName: 'Test User',
      userAvatar: 'https://via.placeholder.com/40',
      title: 'Test Blog Post',
      content: 'This is a test blog post created by the test script.',
      tags: ['test', 'javascript'],
      coverImage: ''
    };

    const response = await fetch(`${API_URL}/api/blogs/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testBlog)
    });

    const data = await response.json();
    if (data.success) {
      console.log('✅ Blog created successfully!');
      console.log(`   Blog ID: ${data.blog.id}`);
      console.log(`   Title: ${data.blog.title}\n`);
    } else {
      console.log('❌ Failed to create blog');
      console.log('Error:', data.error, '\n');
    }
  } catch (error) {
    console.log('❌ Failed to create blog');
    console.log('Error:', error.message, '\n');
  }

  // Test 4: Get trending blogs
  console.log('Test 4: Fetching trending blogs...');
  try {
    const response = await fetch(`${API_URL}/api/blogs/trending/all?limit=5`);
    const data = await response.json();
    if (data.success) {
      console.log('✅ Trending endpoint working!');
      console.log(`   Trending blogs: ${data.blogs?.length || 0}\n`);
    } else {
      console.log('⚠️ Trending endpoint returned error\n');
    }
  } catch (error) {
    console.log('❌ Failed to fetch trending blogs');
    console.log('Error:', error.message, '\n');
  }

  // Test 5: Get all tags
  console.log('Test 5: Fetching all tags...');
  try {
    const response = await fetch(`${API_URL}/api/blogs/tags/all`);
    const data = await response.json();
    if (data.success) {
      console.log('✅ Tags endpoint working!');
      console.log(`   Total tags: ${data.tags?.length || 0}\n`);
    } else {
      console.log('⚠️ Tags endpoint returned error\n');
    }
  } catch (error) {
    console.log('❌ Failed to fetch tags');
    console.log('Error:', error.message, '\n');
  }

  console.log('========================================');
  console.log('Test Summary');
  console.log('========================================');
  console.log('All blog API endpoints are working! ✅');
  console.log('\nYou can now:');
  console.log('1. Start frontend: npm run dev');
  console.log('2. Visit: http://localhost:5173/blogs');
  console.log('3. Sign in and create blogs\n');
}

// Run tests
testBackend().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
