// Test AI Whiteboard Visualization

const BASE_URL = 'http://localhost:3001/api/ai';

async function testAIWhiteboard() {
  console.log('🎨 Testing AI Whiteboard Visualization...\n');

  try {
    // Test 1: Visualize Two Sum problem
    console.log('1️⃣ Testing Two Sum Visualization...');
    const twoSumResponse = await fetch(`${BASE_URL}/visualize-logic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'two-sum',
        problemTitle: 'Two Sum',
        code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
      })
    });

    const twoSumData = await twoSumResponse.json();
    console.log('✅ Two Sum Visualization:', twoSumData.success ? 'SUCCESS' : 'FAILED');
    
    if (twoSumData.success) {
      console.log(`   Description: ${twoSumData.animation.description}`);
      console.log(`   Steps: ${twoSumData.animation.steps?.length || 0}`);
      
      if (twoSumData.animation.steps) {
        console.log('\n   Animation Steps:');
        twoSumData.animation.steps.forEach((step, idx) => {
          console.log(`   ${idx + 1}. ${step.explanation}`);
          console.log(`      Type: ${step.drawing?.type}, Color: ${step.drawing?.color}`);
        });
      }
    } else {
      console.log(`   Error: ${twoSumData.error}`);
    }
    console.log('');

    // Test 2: Visualize Binary Search
    console.log('2️⃣ Testing Binary Search Visualization...');
    const binarySearchResponse = await fetch(`${BASE_URL}/visualize-logic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'binary-search',
        problemTitle: 'Binary Search',
        code: `function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
      })
    });

    const binarySearchData = await binarySearchResponse.json();
    console.log('✅ Binary Search Visualization:', binarySearchData.success ? 'SUCCESS' : 'FAILED');
    
    if (binarySearchData.success) {
      console.log(`   Description: ${binarySearchData.animation.description}`);
      console.log(`   Steps: ${binarySearchData.animation.steps?.length || 0}`);
    }
    console.log('');

    // Test 3: Visualize without code (just problem title)
    console.log('3️⃣ Testing Visualization without Code...');
    const noCodeResponse = await fetch(`${BASE_URL}/visualize-logic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'reverse-linked-list',
        problemTitle: 'Reverse Linked List'
      })
    });

    const noCodeData = await noCodeResponse.json();
    console.log('✅ No Code Visualization:', noCodeData.success ? 'SUCCESS' : 'FAILED');
    
    if (noCodeData.success) {
      console.log(`   Description: ${noCodeData.animation.description}`);
      console.log(`   Steps: ${noCodeData.animation.steps?.length || 0}`);
    }
    console.log('');

    console.log('\n🎉 All AI Whiteboard Tests Completed!');
    console.log('\n✨ AI Whiteboard Features:');
    console.log('   • Auto-generates step-by-step visualizations');
    console.log('   • Creates drawings (rectangles, circles, arrows)');
    console.log('   • Provides explanations for each step');
    console.log('   • Works with or without code');
    console.log('   • Visualizes algorithm logic');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testAIWhiteboard();
