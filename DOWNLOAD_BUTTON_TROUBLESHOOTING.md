# Download Button Troubleshooting 🔍

## Where to Find the Download Button

### Location
The download button appears **ONLY after a successful submission** (all test cases passed).

### Steps to See It:

1. **Go to Playground**
   ```
   http://localhost:5173/playground
   ```

2. **Select a Problem**
   - Click on any problem from the list
   - Or use the default problem

3. **Write/Use Solution**
   - Write your solution code
   - Or use the starter code

4. **Submit Code**
   - Click the green "Submit" button (bottom right)
   - Wait for all test cases to run

5. **Look for Download Button**
   - If all tests pass ✅
   - Scroll down in the "Result" tab
   - You'll see a green button: **"Download Solution for GitHub"**

## Visual Guide

```
┌─────────────────────────────────────────┐
│ Result Tab                              │
├─────────────────────────────────────────┤
│ ✅ Accepted                             │
│                                         │
│ ┌──────────┐  ┌──────────┐            │
│ │ Runtime  │  │ Memory   │            │
│ │ 52 ms    │  │ 42.1 MB  │            │
│ │ Beats 75%│  │ Beats 60%│            │
│ └──────────┘  └──────────┘            │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ 📥 Download Solution for GitHub     ││ ← HERE!
│ └─────────────────────────────────────┘│
│                                         │
│ Test Cases Passed: 57/57                │
└─────────────────────────────────────────┘
```

## Common Issues

### Issue 1: Button Not Visible
**Reason:** Tests didn't pass or submission failed

**Solution:**
- Make sure ALL test cases pass
- Look for green "Accepted" message
- Check "Result" tab (not "Testcase" tab)

### Issue 2: Download Doesn't Start
**Reason:** Browser blocking downloads

**Solution:**
1. Check browser console (F12)
2. Look for download permission popup
3. Allow downloads from localhost
4. Try again

### Issue 3: File Downloads But Empty
**Reason:** Code or test results missing

**Solution:**
- Make sure you have code in the editor
- Submit again
- Check browser console for errors

## Testing the Download

### Quick Test:

1. **Use Default Problem** (Two Sum)
2. **Use This Simple Solution:**
   ```javascript
   function twoSum(nums, target) {
       const map = new Map();
       for (let i = 0; i < nums.length; i++) {
           const complement = target - nums[i];
           if (map.has(complement)) {
               return [map.get(complement), i];
           }
           map.set(nums[i], i);
       }
       return [];
   }
   ```
3. **Click Submit**
4. **Wait for "Accepted"**
5. **Click Download Button**
6. **Check Downloads Folder**

### Expected File:
- **Name:** `1-two-sum.js` (or similar)
- **Content:** Code with problem description and stats
- **Size:** ~1-2 KB

## What the Downloaded File Contains

```javascript
/*
 * Problem: Two Sum
 * Difficulty: Easy
 * Category: Array
 * 
 * Description:
 * Given an array of integers nums and an integer target...
 * 
 * Submission Result:
 * - Status: Accepted ✅
 * - Test Cases Passed: 57/57
 * - Runtime: 52 ms
 * - Memory: 42.1 MB
 * 
 * Submitted: 2024-01-15T10:30:00.000Z
 * Language: javascript
 */

function twoSum(nums, target) {
    // Your solution code here
}
```

## Browser Console Check

Open console (F12) and look for:

### Success Messages:
```
✅ User stats updated: {...}
✅ Solution downloaded! Upload to your GitHub repo.
```

### Error Messages:
```
❌ No test results available. Submit your code first.
❌ Download failed: [error message]
```

## Alternative: Manual Download

If button still doesn't work, use browser console:

```javascript
// Open Console (F12)
// Copy and paste this:

const problem = {
  title: "Two Sum",
  difficulty: "Easy",
  category: "Array",
  description: "Given an array of integers..."
};

const code = `function twoSum(nums, target) {
    // Your code here
}`;

const result = {
  accepted: true,
  passedTestCases: 57,
  totalTestCases: 57,
  runtime: "52 ms",
  memory: "42.1 MB"
};

const content = `/*
 * Problem: ${problem.title}
 * Difficulty: ${problem.difficulty}
 * Category: ${problem.category}
 * 
 * Description:
 * ${problem.description}
 * 
 * Submission Result:
 * - Status: Accepted ✅
 * - Test Cases Passed: ${result.passedTestCases}/${result.totalTestCases}
 * - Runtime: ${result.runtime}
 * - Memory: ${result.memory}
 * 
 * Submitted: ${new Date().toISOString()}
 * Language: javascript
 */

${code}
`;

const blob = new Blob([content], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'solution.js';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);

console.log('✅ Download triggered!');
```

## Verify Button Exists in Code

Check if button is in the DOM:

```javascript
// Open Console (F12)
// Run this after successful submission:

const button = document.querySelector('button');
const buttons = Array.from(document.querySelectorAll('button'));
const downloadButton = buttons.find(b => b.textContent.includes('Download'));

if (downloadButton) {
  console.log('✅ Download button found!');
  console.log('Button text:', downloadButton.textContent);
  // Click it programmatically
  downloadButton.click();
} else {
  console.log('❌ Download button not found');
  console.log('Available buttons:', buttons.map(b => b.textContent));
}
```

## Still Not Working?

### Check These:

1. **Backend Running?**
   ```bash
   cd backend
   npm start
   ```
   Should see: "Server running on port 3001"

2. **Frontend Running?**
   ```bash
   npm run dev
   ```
   Should see: "Local: http://localhost:5173"

3. **On Correct Page?**
   - URL: `http://localhost:5173/playground`
   - NOT `/editor` or other pages

4. **Submission Successful?**
   - Green "Accepted" message
   - All test cases passed
   - No errors in console

5. **Browser Permissions?**
   - Downloads allowed
   - No popup blockers
   - JavaScript enabled

## Debug Mode

Add this to see what's happening:

```javascript
// In browser console after submission:
console.log('Test Results:', testResults);
console.log('Selected Problem:', selectedProblem);
console.log('Code:', code);
console.log('Language:', language);
```

## Contact Support

If still not working, provide:
1. Screenshot of the Result tab
2. Browser console errors (F12 → Console)
3. Browser and version
4. Steps you followed

The download button is definitely in the code and should appear after successful submission!
