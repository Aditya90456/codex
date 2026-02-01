// Debug the comparison function
function compareOutput(actual, expected) {
  // Convert both to strings for comparison, removing spaces
  const actualStr = JSON.stringify(actual).replace(/\s/g, '');
  let expectedStr;
  
  if (typeof expected === 'string') {
    // If expected is already a string, try to parse it first, then stringify to normalize
    try {
      const parsed = JSON.parse(expected);
      expectedStr = JSON.stringify(parsed).replace(/\s/g, '');
    } catch (e) {
      // If parsing fails, treat as string and remove spaces
      expectedStr = expected.replace(/\s/g, '');
    }
  } else {
    expectedStr = JSON.stringify(expected).replace(/\s/g, '');
  }
  
  console.log('Comparing:');
  console.log('  actual:', JSON.stringify(actual), typeof actual);
  console.log('  expected:', expected, typeof expected);
  console.log('  actualStr:', actualStr);
  console.log('  expectedStr:', expectedStr);
  console.log('  result:', actualStr === expectedStr);
  
  return actualStr === expectedStr;
}

// Test cases
const testCases = [
  { actual: [0, 1], expected: '[0,1]' },
  { actual: [1, 2], expected: '[1,2]' },
  { actual: 5, expected: '5' }
];

testCases.forEach((test, i) => {
  console.log(`\nTest ${i + 1}:`);
  compareOutput(test.actual, test.expected);
});