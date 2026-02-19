// Take U Forward (Striver's) DSA Problems
// Organized by topics from Striver's A2Z DSA Sheet

export const tufProblems = {
  // Step 1: Learn the basics
  basics: [
    {
      id: 'tuf-1',
      title: 'Print Name N Times',
      difficulty: 'Easy',
      category: 'Recursion',
      tags: ['Recursion', 'Basics'],
      description: 'Write a program to print your name N times using recursion.',
      examples: [
        { input: 'N = 5', output: 'Name printed 5 times', explanation: 'Print name 5 times' }
      ],
      constraints: ['1 <= N <= 1000'],
      videoUrl: 'https://www.youtube.com/watch?v=un6PLygfXrA',
      articleUrl: 'https://takeuforward.org/recursion/print-name-n-times-using-recursion/',
      starterCode: {
        javascript: `function printName(n) {\n  // Write your code here\n  \n}`,
        python: `def print_name(n):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public void printName(int n) {\n        // Write your code here\n    }\n}`,
        cpp: `void printName(int n) {\n    // Write your code here\n}`
      }
    },
    {
      id: 'tuf-2',
      title: 'Print 1 to N',
      difficulty: 'Easy',
      category: 'Recursion',
      tags: ['Recursion', 'Basics'],
      description: 'Print numbers from 1 to N using recursion.',
      examples: [
        { input: 'N = 5', output: '1 2 3 4 5', explanation: 'Print all numbers from 1 to 5' }
      ],
      constraints: ['1 <= N <= 10000'],
      videoUrl: 'https://www.youtube.com/watch?v=un6PLygfXrA',
      articleUrl: 'https://takeuforward.org/recursion/print-1-to-n-using-recursion/',
      starterCode: {
        javascript: `function printNumbers(n) {\n  // Write your code here\n  \n}`,
        python: `def print_numbers(n):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public void printNumbers(int n) {\n        // Write your code here\n    }\n}`,
        cpp: `void printNumbers(int n) {\n    // Write your code here\n}`
      }
    },
    {
      id: 'tuf-basics-3',
      title: 'Sum of First N Numbers',
      difficulty: 'Easy',
      category: 'Recursion',
      tags: ['Recursion', 'Math'],
      description: 'Calculate sum of first N natural numbers using recursion.',
      examples: [
        { input: 'N = 5', output: '15', explanation: '1+2+3+4+5 = 15' }
      ],
      constraints: ['1 <= N <= 10000'],
      videoUrl: 'https://www.youtube.com/watch?v=un6PLygfXrA',
      articleUrl: 'https://takeuforward.org/recursion/sum-of-first-n-natural-numbers/',
      starterCode: {
        javascript: `function sumOfN(n) {\n  // Write your code here\n  \n}`,
        python: `def sum_of_n(n):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int sumOfN(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int sumOfN(int n) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-basics-4',
      title: 'Factorial of N',
      difficulty: 'Easy',
      category: 'Recursion',
      tags: ['Recursion', 'Math'],
      description: 'Calculate factorial of N using recursion.',
      examples: [
        { input: 'N = 5', output: '120', explanation: '5! = 5*4*3*2*1 = 120' }
      ],
      constraints: ['0 <= N <= 12'],
      videoUrl: 'https://www.youtube.com/watch?v=un6PLygfXrA',
      articleUrl: 'https://takeuforward.org/recursion/factorial-of-n/',
      starterCode: {
        javascript: `function factorial(n) {\n  // Write your code here\n  \n}`,
        python: `def factorial(n):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public long factorial(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `long long factorial(int n) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-basics-5',
      title: 'Reverse an Array',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Two Pointers'],
      description: 'Reverse an array using recursion or two pointers.',
      examples: [
        { input: 'arr = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reverse the array' }
      ],
      constraints: ['1 <= arr.length <= 10^5'],
      videoUrl: 'https://www.youtube.com/watch?v=un6PLygfXrA',
      articleUrl: 'https://takeuforward.org/data-structure/reverse-a-given-array/',
      starterCode: {
        javascript: `function reverseArray(arr) {\n  // Write your code here\n  \n}`,
        python: `def reverse_array(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public void reverseArray(int[] arr) {\n        // Write your code here\n    }\n}`,
        cpp: `void reverseArray(vector<int>& arr) {\n    // Write your code here\n}`
      }
    },
    {
      id: 'tuf-basics-6',
      title: 'Check Palindrome String',
      difficulty: 'Easy',
      category: 'Strings',
      tags: ['Strings', 'Two Pointers'],
      description: 'Check if a string is palindrome.',
      examples: [
        { input: 's = "racecar"', output: 'true', explanation: 'String reads same forwards and backwards' }
      ],
      constraints: ['1 <= s.length <= 10^5'],
      videoUrl: 'https://www.youtube.com/watch?v=un6PLygfXrA',
      articleUrl: 'https://takeuforward.org/data-structure/check-if-a-string-is-palindrome-or-not/',
      starterCode: {
        javascript: `function isPalindrome(s) {\n  // Write your code here\n  \n}`,
        python: `def is_palindrome(s):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}`,
        cpp: `bool isPalindrome(string s) {\n    // Write your code here\n    return false;\n}`
      }
    }
  ],

  // Step 3: Arrays
  arrays: [
    {
      id: 'tuf-3',
      title: 'Largest Element in Array',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Easy'],
      description: 'Find the largest element in an array.',
      examples: [
        { input: 'arr = [1, 8, 7, 56, 90]', output: '90', explanation: '90 is the largest element' }
      ],
      constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/data-structure/find-the-largest-element-in-an-array/',
      starterCode: {
        javascript: `function findLargest(arr) {\n  // Write your code here\n  \n}`,
        python: `def find_largest(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int findLargest(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int findLargest(vector<int>& arr) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-4',
      title: 'Second Largest Element',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Easy'],
      description: 'Find the second largest element in an array without sorting.',
      examples: [
        { input: 'arr = [12, 35, 1, 10, 34, 1]', output: '34', explanation: '34 is the second largest' }
      ],
      constraints: ['2 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/data-structure/find-second-smallest-and-second-largest-element-in-an-array/',
      starterCode: {
        javascript: `function findSecondLargest(arr) {\n  // Write your code here\n  \n}`,
        python: `def find_second_largest(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int findSecondLargest(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int findSecondLargest(vector<int>& arr) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-5',
      title: 'Remove Duplicates from Sorted Array',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Two Pointers'],
      description: 'Remove duplicates from a sorted array in-place.',
      examples: [
        { input: 'arr = [1,1,2,2,2,3,3]', output: '[1,2,3]', explanation: 'Remove all duplicates' }
      ],
      constraints: ['1 <= arr.length <= 3 * 10^4', '-100 <= arr[i] <= 100'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/data-structure/remove-duplicates-in-place-from-sorted-array/',
      starterCode: {
        javascript: `function removeDuplicates(arr) {\n  // Write your code here\n  \n}`,
        python: `def remove_duplicates(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int removeDuplicates(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int removeDuplicates(vector<int>& arr) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-arrays-4',
      title: 'Left Rotate Array by One',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Rotation'],
      description: 'Rotate array to left by one position.',
      examples: [
        { input: 'arr = [1,2,3,4,5]', output: '[2,3,4,5,1]', explanation: 'Rotate left by 1' }
      ],
      constraints: ['1 <= arr.length <= 10^5'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/data-structure/left-rotate-the-array-by-one/',
      starterCode: {
        javascript: `function rotateLeft(arr) {\n  // Write your code here\n  \n}`,
        python: `def rotate_left(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public void rotateLeft(int[] arr) {\n        // Write your code here\n    }\n}`,
        cpp: `void rotateLeft(vector<int>& arr) {\n    // Write your code here\n}`
      }
    },
    {
      id: 'tuf-arrays-5',
      title: 'Move Zeros to End',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Two Pointers'],
      description: 'Move all zeros to the end while maintaining order of non-zero elements.',
      examples: [
        { input: 'arr = [1,0,2,3,0,4,0,5]', output: '[1,2,3,4,5,0,0,0]', explanation: 'Move zeros to end' }
      ],
      constraints: ['1 <= arr.length <= 10^4'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/data-structure/move-all-zeros-to-the-end-of-the-array/',
      starterCode: {
        javascript: `function moveZeros(arr) {\n  // Write your code here\n  \n}`,
        python: `def move_zeros(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public void moveZeros(int[] arr) {\n        // Write your code here\n    }\n}`,
        cpp: `void moveZeros(vector<int>& arr) {\n    // Write your code here\n}`
      }
    },
    {
      id: 'tuf-arrays-6',
      title: 'Union of Two Sorted Arrays',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Two Pointers'],
      description: 'Find union of two sorted arrays.',
      examples: [
        { input: 'arr1 = [1,2,3,4,5], arr2 = [2,3,4,4,5]', output: '[1,2,3,4,5]', explanation: 'Union without duplicates' }
      ],
      constraints: ['1 <= arr1.length, arr2.length <= 10^5'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/data-structure/union-of-two-sorted-arrays/',
      starterCode: {
        javascript: `function findUnion(arr1, arr2) {\n  // Write your code here\n  \n}`,
        python: `def find_union(arr1, arr2):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public List<Integer> findUnion(int[] arr1, int[] arr2) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`,
        cpp: `vector<int> findUnion(vector<int>& arr1, vector<int>& arr2) {\n    // Write your code here\n    return {};\n}`
      }
    },
    {
      id: 'tuf-arrays-7',
      title: 'Missing Number',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Math'],
      description: 'Find the missing number in array containing n distinct numbers from 0 to n.',
      examples: [
        { input: 'arr = [3,0,1]', output: '2', explanation: 'Numbers are 0,1,3. Missing is 2' }
      ],
      constraints: ['n == arr.length', '1 <= n <= 10^4'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/arrays/find-the-missing-number-in-an-array/',
      starterCode: {
        javascript: `function missingNumber(arr) {\n  // Write your code here\n  \n}`,
        python: `def missing_number(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int missingNumber(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int missingNumber(vector<int>& arr) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-arrays-8',
      title: 'Maximum Consecutive Ones',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays'],
      description: 'Find maximum consecutive 1s in a binary array.',
      examples: [
        { input: 'arr = [1,1,0,1,1,1]', output: '3', explanation: 'Maximum consecutive 1s is 3' }
      ],
      constraints: ['1 <= arr.length <= 10^5', 'arr[i] is either 0 or 1'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/data-structure/count-maximum-consecutive-ones-in-the-array/',
      starterCode: {
        javascript: `function findMaxConsecutiveOnes(arr) {\n  // Write your code here\n  \n}`,
        python: `def find_max_consecutive_ones(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int findMaxConsecutiveOnes(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int findMaxConsecutiveOnes(vector<int>& arr) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-arrays-9',
      title: 'Single Number',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Bit Manipulation'],
      description: 'Find the element that appears once while others appear twice.',
      examples: [
        { input: 'arr = [4,1,2,1,2]', output: '4', explanation: '4 appears once' }
      ],
      constraints: ['1 <= arr.length <= 3 * 10^4', 'Each element appears twice except one'],
      videoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
      articleUrl: 'https://takeuforward.org/arrays/find-the-number-that-appears-once-and-other-numbers-twice/',
      starterCode: {
        javascript: `function singleNumber(arr) {\n  // Write your code here\n  \n}`,
        python: `def single_number(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int singleNumber(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int singleNumber(vector<int>& arr) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-arrays-10',
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Arrays', 'Hash Table'],
      description: 'Find two numbers that add up to a target.',
      examples: [
        { input: 'arr = [2,7,11,15], target = 9', output: '[0,1]', explanation: '2 + 7 = 9' }
      ],
      constraints: ['2 <= arr.length <= 10^4', 'Only one valid answer exists'],
      videoUrl: 'https://www.youtube.com/watch?v=UXDSeD9mN-k',
      articleUrl: 'https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array/',
      starterCode: {
        javascript: `function twoSum(arr, target) {\n  // Write your code here\n  \n}`,
        python: `def two_sum(arr, target):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int[] twoSum(int[] arr, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
        cpp: `vector<int> twoSum(vector<int>& arr, int target) {\n    // Write your code here\n    return {};\n}`
      }
    }
  ],

  // Step 4: Binary Search
  binarySearch: [
    {
      id: 'tuf-6',
      title: 'Binary Search',
      difficulty: 'Easy',
      category: 'Binary Search',
      tags: ['Binary Search', 'Searching'],
      description: 'Implement binary search algorithm.',
      examples: [
        { input: 'arr = [1,2,3,4,5,6,7], target = 4', output: '3', explanation: 'Element found at index 3' }
      ],
      constraints: ['1 <= arr.length <= 10^4', '-10^4 <= arr[i], target <= 10^4'],
      videoUrl: 'https://www.youtube.com/watch?v=W9QJ8HaRvJQ',
      articleUrl: 'https://takeuforward.org/data-structure/binary-search-explained/',
      starterCode: {
        javascript: `function binarySearch(arr, target) {\n  // Write your code here\n  \n}`,
        python: `def binary_search(arr, target):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int binarySearch(int[] arr, int target) {\n        // Write your code here\n        return -1;\n    }\n}`,
        cpp: `int binarySearch(vector<int>& arr, int target) {\n    // Write your code here\n    return -1;\n}`
      }
    },
    {
      id: 'tuf-7',
      title: 'Lower Bound',
      difficulty: 'Easy',
      category: 'Binary Search',
      tags: ['Binary Search'],
      description: 'Find the lower bound (smallest index where arr[i] >= target).',
      examples: [
        { input: 'arr = [1,2,3,3,5,8,8,10,10,11], target = 9', output: '7', explanation: 'Lower bound is at index 7' }
      ],
      constraints: ['1 <= arr.length <= 10^5', '1 <= arr[i] <= 10^9'],
      videoUrl: 'https://www.youtube.com/watch?v=W9QJ8HaRvJQ',
      articleUrl: 'https://takeuforward.org/arrays/implement-lower-bound-bs-2/',
      starterCode: {
        javascript: `function lowerBound(arr, target) {\n  // Write your code here\n  \n}`,
        python: `def lower_bound(arr, target):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int lowerBound(int[] arr, int target) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int lowerBound(vector<int>& arr, int target) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-bs-3',
      title: 'Upper Bound',
      difficulty: 'Easy',
      category: 'Binary Search',
      tags: ['Binary Search'],
      description: 'Find the upper bound (smallest index where arr[i] > target).',
      examples: [
        { input: 'arr = [1,2,3,3,5,8,8,10,10,11], target = 8', output: '7', explanation: 'Upper bound is at index 7' }
      ],
      constraints: ['1 <= arr.length <= 10^5'],
      videoUrl: 'https://www.youtube.com/watch?v=W9QJ8HaRvJQ',
      articleUrl: 'https://takeuforward.org/arrays/implement-upper-bound/',
      starterCode: {
        javascript: `function upperBound(arr, target) {\n  // Write your code here\n  \n}`,
        python: `def upper_bound(arr, target):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int upperBound(int[] arr, int target) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int upperBound(vector<int>& arr, int target) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-bs-4',
      title: 'Search Insert Position',
      difficulty: 'Easy',
      category: 'Binary Search',
      tags: ['Binary Search'],
      description: 'Find the index where target should be inserted in sorted array.',
      examples: [
        { input: 'arr = [1,3,5,6], target = 5', output: '2', explanation: 'Target found at index 2' }
      ],
      constraints: ['1 <= arr.length <= 10^4'],
      videoUrl: 'https://www.youtube.com/watch?v=W9QJ8HaRvJQ',
      articleUrl: 'https://takeuforward.org/arrays/search-insert-position/',
      starterCode: {
        javascript: `function searchInsert(arr, target) {\n  // Write your code here\n  \n}`,
        python: `def search_insert(arr, target):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int searchInsert(int[] arr, int target) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int searchInsert(vector<int>& arr, int target) {\n    // Write your code here\n    return 0;\n}`
      }
    },
    {
      id: 'tuf-bs-5',
      title: 'First and Last Position',
      difficulty: 'Medium',
      category: 'Binary Search',
      tags: ['Binary Search'],
      description: 'Find first and last position of element in sorted array.',
      examples: [
        { input: 'arr = [5,7,7,8,8,10], target = 8', output: '[3,4]', explanation: '8 appears at indices 3 and 4' }
      ],
      constraints: ['0 <= arr.length <= 10^5'],
      videoUrl: 'https://www.youtube.com/watch?v=W9QJ8HaRvJQ',
      articleUrl: 'https://takeuforward.org/data-structure/first-and-last-occurrences-in-array/',
      starterCode: {
        javascript: `function searchRange(arr, target) {\n  // Write your code here\n  \n}`,
        python: `def search_range(arr, target):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int[] searchRange(int[] arr, int target) {\n        // Write your code here\n        return new int[]{-1, -1};\n    }\n}`,
        cpp: `vector<int> searchRange(vector<int>& arr, int target) {\n    // Write your code here\n    return {-1, -1};\n}`
      }
    },
    {
      id: 'tuf-bs-6',
      title: 'Count Occurrences',
      difficulty: 'Easy',
      category: 'Binary Search',
      tags: ['Binary Search'],
      description: 'Count number of occurrences of target in sorted array.',
      examples: [
        { input: 'arr = [1,1,2,2,2,2,3], target = 2', output: '4', explanation: '2 appears 4 times' }
      ],
      constraints: ['1 <= arr.length <= 10^5'],
      videoUrl: 'https://www.youtube.com/watch?v=W9QJ8HaRvJQ',
      articleUrl: 'https://takeuforward.org/data-structure/count-occurrences-in-sorted-array/',
      starterCode: {
        javascript: `function countOccurrences(arr, target) {\n  // Write your code here\n  \n}`,
        python: `def count_occurrences(arr, target):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public int countOccurrences(int[] arr, int target) {\n        // Write your code here\n        return 0;\n    }\n}`,
        cpp: `int countOccurrences(vector<int>& arr, int target) {\n    // Write your code here\n    return 0;\n}`
      }
    }
  ],

  // Step 6: Linked List
  linkedList: [
    {
      id: 'tuf-8',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      category: 'Linked List',
      tags: ['Linked List', 'Recursion'],
      description: 'Reverse a singly linked list.',
      examples: [
        { input: '1->2->3->4->5', output: '5->4->3->2->1', explanation: 'Reverse the entire list' }
      ],
      constraints: ['0 <= list.length <= 5000', '-5000 <= Node.val <= 5000'],
      videoUrl: 'https://www.youtube.com/watch?v=iRtLEoL-r-g',
      articleUrl: 'https://takeuforward.org/data-structure/reverse-a-linked-list/',
      starterCode: {
        javascript: `function reverseList(head) {\n  // Write your code here\n  \n}`,
        python: `def reverse_list(head):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}`,
        cpp: `ListNode* reverseList(ListNode* head) {\n    // Write your code here\n    return nullptr;\n}`
      }
    },
    {
      id: 'tuf-9',
      title: 'Middle of Linked List',
      difficulty: 'Easy',
      category: 'Linked List',
      tags: ['Linked List', 'Two Pointers'],
      description: 'Find the middle node of a linked list.',
      examples: [
        { input: '1->2->3->4->5', output: '3', explanation: 'Middle node is 3' }
      ],
      constraints: ['1 <= list.length <= 100', '1 <= Node.val <= 100'],
      videoUrl: 'https://www.youtube.com/watch?v=7LjQ57RqgEc',
      articleUrl: 'https://takeuforward.org/data-structure/find-middle-element-in-a-linked-list/',
      starterCode: {
        javascript: `function middleNode(head) {\n  // Write your code here\n  \n}`,
        python: `def middle_node(head):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public ListNode middleNode(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}`,
        cpp: `ListNode* middleNode(ListNode* head) {\n    // Write your code here\n    return nullptr;\n}`
      }
    },
    {
      id: 'tuf-ll-3',
      title: 'Detect Cycle in Linked List',
      difficulty: 'Easy',
      category: 'Linked List',
      tags: ['Linked List', 'Two Pointers'],
      description: 'Detect if linked list has a cycle.',
      examples: [
        { input: '3->2->0->-4 (cycle at node 2)', output: 'true', explanation: 'There is a cycle' }
      ],
      constraints: ['0 <= list.length <= 10^4'],
      videoUrl: 'https://www.youtube.com/watch?v=wiOo4DC5GGA',
      articleUrl: 'https://takeuforward.org/data-structure/detect-a-cycle-in-a-linked-list/',
      starterCode: {
        javascript: `function hasCycle(head) {\n  // Write your code here\n  \n}`,
        python: `def has_cycle(head):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your code here\n        return false;\n    }\n}`,
        cpp: `bool hasCycle(ListNode* head) {\n    // Write your code here\n    return false;\n}`
      }
    },
    {
      id: 'tuf-ll-4',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      category: 'Linked List',
      tags: ['Linked List', 'Recursion'],
      description: 'Merge two sorted linked lists.',
      examples: [
        { input: 'l1 = 1->2->4, l2 = 1->3->4', output: '1->1->2->3->4->4', explanation: 'Merged sorted list' }
      ],
      constraints: ['0 <= l1.length, l2.length <= 50'],
      videoUrl: 'https://www.youtube.com/watch?v=Xb4slcp1U38',
      articleUrl: 'https://takeuforward.org/data-structure/merge-two-sorted-linked-lists/',
      starterCode: {
        javascript: `function mergeTwoLists(l1, l2) {\n  // Write your code here\n  \n}`,
        python: `def merge_two_lists(l1, l2):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n        // Write your code here\n        return null;\n    }\n}`,
        cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    // Write your code here\n    return nullptr;\n}`
      }
    },
    {
      id: 'tuf-ll-5',
      title: 'Remove Nth Node From End',
      difficulty: 'Medium',
      category: 'Linked List',
      tags: ['Linked List', 'Two Pointers'],
      description: 'Remove the nth node from the end of list.',
      examples: [
        { input: 'head = 1->2->3->4->5, n = 2', output: '1->2->3->5', explanation: 'Remove 2nd from end' }
      ],
      constraints: ['1 <= list.length <= 30', '1 <= n <= list.length'],
      videoUrl: 'https://www.youtube.com/watch?v=Lhu3MsXZy-Q',
      articleUrl: 'https://takeuforward.org/data-structure/remove-n-th-node-from-the-end-of-a-linked-list/',
      starterCode: {
        javascript: `function removeNthFromEnd(head, n) {\n  // Write your code here\n  \n}`,
        python: `def remove_nth_from_end(head, n):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        // Write your code here\n        return null;\n    }\n}`,
        cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {\n    // Write your code here\n    return nullptr;\n}`
      }
    },
    {
      id: 'tuf-ll-6',
      title: 'Palindrome Linked List',
      difficulty: 'Easy',
      category: 'Linked List',
      tags: ['Linked List', 'Two Pointers'],
      description: 'Check if linked list is a palindrome.',
      examples: [
        { input: '1->2->2->1', output: 'true', explanation: 'List is palindrome' }
      ],
      constraints: ['1 <= list.length <= 10^5'],
      videoUrl: 'https://www.youtube.com/watch?v=-DtNInqFUXs',
      articleUrl: 'https://takeuforward.org/data-structure/check-if-given-linked-list-is-plaindrome/',
      starterCode: {
        javascript: `function isPalindrome(head) {\n  // Write your code here\n  \n}`,
        python: `def is_palindrome(head):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public boolean isPalindrome(ListNode head) {\n        // Write your code here\n        return false;\n    }\n}`,
        cpp: `bool isPalindrome(ListNode* head) {\n    // Write your code here\n    return false;\n}`
      }
    }
  ],

  // Step 7: Recursion
  recursion: [
    {
      id: 'tuf-10',
      title: 'Subset Sum',
      difficulty: 'Medium',
      category: 'Recursion',
      tags: ['Recursion', 'Backtracking'],
      description: 'Find all possible subset sums.',
      examples: [
        { input: 'arr = [3, 1, 2]', output: '[0, 1, 2, 3, 3, 4, 5, 6]', explanation: 'All subset sums' }
      ],
      constraints: ['1 <= arr.length <= 15', '0 <= arr[i] <= 10^4'],
      videoUrl: 'https://www.youtube.com/watch?v=rYkfBRtMJr8',
      articleUrl: 'https://takeuforward.org/data-structure/subset-sum-sum-of-all-subsets/',
      starterCode: {
        javascript: `function subsetSums(arr) {\n  // Write your code here\n  \n}`,
        python: `def subset_sums(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public List<Integer> subsetSums(int[] arr) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`,
        cpp: `vector<int> subsetSums(vector<int>& arr) {\n    // Write your code here\n    return {};\n}`
      }
    },
    {
      id: 'tuf-rec-2',
      title: 'Generate All Subsets',
      difficulty: 'Medium',
      category: 'Recursion',
      tags: ['Recursion', 'Backtracking'],
      description: 'Generate all possible subsets (power set).',
      examples: [
        { input: 'arr = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explanation: 'All subsets' }
      ],
      constraints: ['1 <= arr.length <= 10'],
      videoUrl: 'https://www.youtube.com/watch?v=b7AYbpM5YrE',
      articleUrl: 'https://takeuforward.org/data-structure/power-set-print-all-the-possible-subsequences-of-the-string/',
      starterCode: {
        javascript: `function subsets(arr) {\n  // Write your code here\n  \n}`,
        python: `def subsets(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public List<List<Integer>> subsets(int[] arr) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`,
        cpp: `vector<vector<int>> subsets(vector<int>& arr) {\n    // Write your code here\n    return {};\n}`
      }
    },
    {
      id: 'tuf-rec-3',
      title: 'Combination Sum',
      difficulty: 'Medium',
      category: 'Recursion',
      tags: ['Recursion', 'Backtracking'],
      description: 'Find all unique combinations that sum to target.',
      examples: [
        { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]', explanation: 'Combinations that sum to 7' }
      ],
      constraints: ['1 <= candidates.length <= 30', '1 <= target <= 500'],
      videoUrl: 'https://www.youtube.com/watch?v=OyZFFqQtu98',
      articleUrl: 'https://takeuforward.org/data-structure/combination-sum-1/',
      starterCode: {
        javascript: `function combinationSum(candidates, target) {\n  // Write your code here\n  \n}`,
        python: `def combination_sum(candidates, target):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`,
        cpp: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    // Write your code here\n    return {};\n}`
      }
    },
    {
      id: 'tuf-rec-4',
      title: 'Permutations',
      difficulty: 'Medium',
      category: 'Recursion',
      tags: ['Recursion', 'Backtracking'],
      description: 'Generate all permutations of an array.',
      examples: [
        { input: 'arr = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', explanation: 'All permutations' }
      ],
      constraints: ['1 <= arr.length <= 6'],
      videoUrl: 'https://www.youtube.com/watch?v=f2ic2Rsc9pU',
      articleUrl: 'https://takeuforward.org/data-structure/print-all-permutations-of-a-string-array/',
      starterCode: {
        javascript: `function permute(arr) {\n  // Write your code here\n  \n}`,
        python: `def permute(arr):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public List<List<Integer>> permute(int[] arr) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`,
        cpp: `vector<vector<int>> permute(vector<int>& arr) {\n    // Write your code here\n    return {};\n}`
      }
    },
    {
      id: 'tuf-rec-5',
      title: 'N-Queens',
      difficulty: 'Hard',
      category: 'Recursion',
      tags: ['Recursion', 'Backtracking'],
      description: 'Place N queens on NxN chessboard so no two attack each other.',
      examples: [
        { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: 'Two solutions' }
      ],
      constraints: ['1 <= n <= 9'],
      videoUrl: 'https://www.youtube.com/watch?v=i05Ju7AftcM',
      articleUrl: 'https://takeuforward.org/data-structure/n-queen-problem-return-all-distinct-solutions-to-the-n-queens-puzzle/',
      starterCode: {
        javascript: `function solveNQueens(n) {\n  // Write your code here\n  \n}`,
        python: `def solve_n_queens(n):\n    # Write your code here\n    pass`,
        java: `public class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`,
        cpp: `vector<vector<string>> solveNQueens(int n) {\n    // Write your code here\n    return {};\n}`
      }
    }
  ]
};

// Get all TUF problems as a flat array
export const getAllTUFProblems = () => {
  const allProblems = [];
  Object.values(tufProblems).forEach(category => {
    allProblems.push(...category);
  });
  return allProblems;
};

// Get TUF problems by difficulty
export const getTUFProblemsByDifficulty = (difficulty) => {
  return getAllTUFProblems().filter(p => p.difficulty === difficulty);
};

// Get TUF problems by category
export const getTUFProblemsByCategory = (category) => {
  return tufProblems[category] || [];
};
