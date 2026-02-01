// Test the input parsing fix
const testInputs = [
  '[2,7,11,15], 9',
  '[3,2,4], 6', 
  '[3,3], 6',
  '[2,7,11,15], target = 9',
  '[[2,7,11,15], 9]'
];

function parseInput(input) {
  let nums, target;
  
  // Handle different input formats
  if (input.includes('], ')) {
    // Format: "[2,7,11,15], 9"
    const parts = input.split('], ');
    nums = JSON.parse(parts[0] + ']');
    target = parseInt(parts[1].replace(/\D/g, '')); // Extract only digits
  } else if (input.includes(', target = ')) {
    // Format: "[2,7,11,15], target = 9"
    const parts = input.split(', target = ');
    nums = JSON.parse(parts[0]);
    target = parseInt(parts[1]);
  } else {
    // Try to match pattern: [array], number
    const arrayTargetMatch = input.match(/\[([^\]]+)\],\s*(?:target\s*=\s*)?(\d+)/);
    if (arrayTargetMatch) {
      nums = JSON.parse(`[${arrayTargetMatch[1]}]`);
      target = parseInt(arrayTargetMatch[2]);
    } else {
      // Fallback
      try {
        const parsed = JSON.parse(`[${input}]`);
        nums = parsed[0];
        target = parsed[1];
      } catch (e) {
        nums = JSON.parse(input);
        target = 0;
      }
    }
  }
  
  return { nums, target };
}

console.log('Testing input parsing:');
testInputs.forEach(input => {
  try {
    const result = parseInput(input);
    console.log(`✅ "${input}" -> nums: ${JSON.stringify(result.nums)}, target: ${result.target}`);
  } catch (error) {
    console.log(`❌ "${input}" -> Error: ${error.message}`);
  }
});