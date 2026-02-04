// DSA 150 Problems organized by patterns with video solutions and platform links
export const dsaPatternProblems = {
  arrays: {
    title: "Arrays & Hashing",
    icon: "Code",
    color: "blue",
    problems: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/two-sum/",
        gfgUrl: "https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1/A",
        videoUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
        hindiVideoUrl: "https://www.youtube.com/watch?v=dRUpbt8vHpo", // Striver Hindi
        striverVideoUrl: "https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA&si=OnJg3ViS7VU_TZ3x", // Striver A2Z Course
        pattern: "Hash Map",
        companies: ["Google", "Amazon", "Microsoft"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: 217,
        title: "Contains Duplicate",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/",
        gfgUrl: "https://www.geeksforgeeks.org/find-duplicates-in-on-time-and-constant-extra-space/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1324/A",
        videoUrl: "https://www.youtube.com/watch?v=3OamzN90kPg",
        hindiVideoUrl: "https://www.youtube.com/watch?v=4oS6toDeF-E", // Love Babbar Hindi
        hindiVideoUrl: "https://www.youtube.com/watch?v=4oS6toDeF-E", // Love Babbar Hindi
        pattern: "Hash Set",
        companies: ["Apple", "Google", "Amazon"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: 242,
        title: "Valid Anagram",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
        gfgUrl: "https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1328/B",
        videoUrl: "https://www.youtube.com/watch?v=9UtInBqnCgA",
        hindiVideoUrl: "https://www.youtube.com/watch?v=NNqc2kSsGvs", // Love Babbar Hindi
        hindiVideoUrl: "https://www.youtube.com/watch?v=GA_b_TOjDn0", // Love Babbar Hindi
        pattern: "Hash Map / Sorting",
        companies: ["Bloomberg", "Amazon", "Facebook"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 49,
        title: "Group Anagrams",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
        gfgUrl: "https://www.geeksforgeeks.org/given-a-sequence-of-words-print-all-anagrams-together/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/514/A",
        videoUrl: "https://www.youtube.com/watch?v=vzdNOK2oB2E",
        hindiVideoUrl: "https://www.youtube.com/watch?v=ptgyktzXbF8", // Love Babbar Hindi
        hindiVideoUrl: "https://www.youtube.com/watch?v=ptgyktzXbmE", // Love Babbar Hindi
        pattern: "Hash Map + Sorting",
        companies: ["Facebook", "Amazon", "Uber"],
        timeComplexity: "O(n*k*log(k))",
        spaceComplexity: "O(n*k)"
      },
      {
        id: 347,
        title: "Top K Frequent Elements",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
        gfgUrl: "https://www.geeksforgeeks.org/find-k-numbers-with-most-occurrences-in-the-given-array/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1332/A",
        videoUrl: "https://www.youtube.com/watch?v=YPTqKIgVk-k",
        hindiVideoUrl: "https://www.youtube.com/watch?v=7VoJn544QrM", // Love Babbar Hindi
        pattern: "Hash Map + Heap",
        companies: ["Amazon", "Facebook", "Yelp"],
        timeComplexity: "O(n log k)",
        spaceComplexity: "O(n + k)"
      },
      {
        id: 238,
        title: "Product of Array Except Self",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
        gfgUrl: "https://www.geeksforgeeks.org/a-product-array-puzzle/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1352/A",
        videoUrl: "https://www.youtube.com/watch?v=bNvIQI2wAjk",
        hindiVideoUrl: "https://www.youtube.com/watch?v=R1URUB6_y2k", // Love Babbar Hindi
        hindiVideoUrl: "https://www.youtube.com/watch?v=khTiTSZ5QZY", // Love Babbar Hindi
        pattern: "Prefix/Suffix Arrays",
        companies: ["Amazon", "Microsoft", "Apple"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      }
    ]
  },
  twoPointers: {
    title: "Two Pointers",
    icon: "Target",
    color: "green",
    problems: [
      {
        id: 125,
        title: "Valid Palindrome",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
        gfgUrl: "https://www.geeksforgeeks.org/c-program-check-given-string-palindrome/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1328/A",
        videoUrl: "https://www.youtube.com/watch?v=jJXJ16kPFWg",
        hindiVideoUrl: "https://www.youtube.com/watch?v=rRW7kDQ1Prg", // Love Babbar Hindi
        pattern: "Two Pointers",
        companies: ["Facebook", "Microsoft", "Amazon"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 167,
        title: "Two Sum II - Input Array Is Sorted",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        gfgUrl: "https://www.geeksforgeeks.org/two-pointers-technique/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1352/B",
        videoUrl: "https://www.youtube.com/watch?v=-gjxg6Pln50",
        pattern: "Two Pointers",
        companies: ["Amazon", "Microsoft", "Adobe"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 15,
        title: "3Sum",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/3sum/",
        gfgUrl: "https://www.geeksforgeeks.org/find-a-triplet-that-sum-to-a-given-value/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1354/B",
        videoUrl: "https://www.youtube.com/watch?v=jzZsG8n2R9A",
        pattern: "Two Pointers + Sorting",
        companies: ["Facebook", "Amazon", "Microsoft"],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
      },
      {
        id: 11,
        title: "Container With Most Water",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
        gfgUrl: "https://www.geeksforgeeks.org/container-with-most-water/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1355/A",
        videoUrl: "https://www.youtube.com/watch?v=UuiTKBwPgAo",
        pattern: "Two Pointers",
        companies: ["Amazon", "Bloomberg", "Adobe"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      }
    ]
  },
  slidingWindow: {
    title: "Sliding Window",
    icon: "Zap",
    color: "yellow",
    problems: [
      {
        id: 121,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        gfgUrl: "https://www.geeksforgeeks.org/best-time-to-buy-and-sell-stock/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1358/A",
        videoUrl: "https://www.youtube.com/watch?v=1pkOgXD63yU",
        hindiVideoUrl: "https://www.youtube.com/watch?v=4YlW8I2aTqY", // Love Babbar Hindi
        pattern: "Sliding Window",
        companies: ["Amazon", "Facebook", "Microsoft"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        gfgUrl: "https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1360/A",
        videoUrl: "https://www.youtube.com/watch?v=wiGpQwVHdE0",
        pattern: "Sliding Window + Hash Set",
        companies: ["Amazon", "Adobe", "Bloomberg"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(m,n))"
      },
      {
        id: 424,
        title: "Longest Repeating Character Replacement",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/",
        gfgUrl: "https://www.geeksforgeeks.org/longest-repeating-character-replacement/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1362/A",
        videoUrl: "https://www.youtube.com/watch?v=gqXU1UyA8pk",
        pattern: "Sliding Window + Hash Map",
        companies: ["Microsoft", "Amazon", "Google"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 76,
        title: "Minimum Window Substring",
        difficulty: "Hard",
        leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
        gfgUrl: "https://www.geeksforgeeks.org/find-the-smallest-window-in-a-string-containing-all-characters-of-another-string/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1364/A",
        videoUrl: "https://www.youtube.com/watch?v=jSto0O4AJbM",
        pattern: "Sliding Window + Hash Map",
        companies: ["Facebook", "Amazon", "LinkedIn"],
        timeComplexity: "O(|s| + |t|)",
        spaceComplexity: "O(|s| + |t|)"
      }
    ]
  },
  stack: {
    title: "Stack",
    icon: "BarChart3",
    color: "purple",
    problems: [
      {
        id: 20,
        title: "Valid Parentheses",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
        gfgUrl: "https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1374/A",
        videoUrl: "https://www.youtube.com/watch?v=WTzjTskDFMg",
        hindiVideoUrl: "https://www.youtube.com/watch?v=CCyOXOUbvDI", // Love Babbar Hindi
        pattern: "Stack",
        companies: ["Google", "Facebook", "Amazon"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: 155,
        title: "Min Stack",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/min-stack/",
        gfgUrl: "https://www.geeksforgeeks.org/design-a-stack-that-supports-getmin-in-o1-time-and-o1-extra-space/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1375/A",
        videoUrl: "https://www.youtube.com/watch?v=qkLl7nAwDPo",
        pattern: "Stack Design",
        companies: ["Amazon", "Bloomberg", "Adobe"],
        timeComplexity: "O(1)",
        spaceComplexity: "O(n)"
      },
      {
        id: 150,
        title: "Evaluate Reverse Polish Notation",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        gfgUrl: "https://www.geeksforgeeks.org/stack-set-4-evaluation-postfix-expression/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1376/A",
        videoUrl: "https://www.youtube.com/watch?v=iu0082c4HDE",
        pattern: "Stack",
        companies: ["LinkedIn", "Amazon", "Facebook"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: 22,
        title: "Generate Parentheses",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/generate-parentheses/",
        gfgUrl: "https://www.geeksforgeeks.org/print-all-combinations-of-balanced-parentheses/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1377/A",
        videoUrl: "https://www.youtube.com/watch?v=s9fokUqJ76A",
        pattern: "Stack + Backtracking",
        companies: ["Google", "Uber", "Amazon"],
        timeComplexity: "O(4^n / √n)",
        spaceComplexity: "O(4^n / √n)"
      }
    ]
  },
  binarySearch: {
    title: "Binary Search",
    icon: "Search",
    color: "red",
    problems: [
      {
        id: 704,
        title: "Binary Search",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/binary-search/",
        gfgUrl: "https://www.geeksforgeeks.org/binary-search/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1385/A",
        videoUrl: "https://www.youtube.com/watch?v=s4DPM8ct1pI",
        pattern: "Binary Search",
        companies: ["Google", "Microsoft", "Amazon"],
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 74,
        title: "Search a 2D Matrix",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/",
        gfgUrl: "https://www.geeksforgeeks.org/search-in-row-wise-and-column-wise-sorted-matrix/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1386/A",
        videoUrl: "https://www.youtube.com/watch?v=Ber2pi2C0j0",
        pattern: "Binary Search",
        companies: ["Amazon", "Microsoft", "Facebook"],
        timeComplexity: "O(log(m*n))",
        spaceComplexity: "O(1)"
      },
      {
        id: 875,
        title: "Koko Eating Bananas",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/koko-eating-bananas/",
        gfgUrl: "https://www.geeksforgeeks.org/minimum-eating-speed-to-eat-all-bananas/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1387/A",
        videoUrl: "https://www.youtube.com/watch?v=U2SozAs9RzA",
        pattern: "Binary Search on Answer",
        companies: ["Facebook", "Google", "Amazon"],
        timeComplexity: "O(n * log(max(piles)))",
        spaceComplexity: "O(1)"
      },
      {
        id: 153,
        title: "Find Minimum in Rotated Sorted Array",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        gfgUrl: "https://www.geeksforgeeks.org/find-minimum-element-in-a-sorted-and-rotated-array/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1388/A",
        videoUrl: "https://www.youtube.com/watch?v=nIVW4P8b1VA",
        pattern: "Modified Binary Search",
        companies: ["Facebook", "Amazon", "Microsoft"],
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 33,
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        gfgUrl: "https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1389/A",
        videoUrl: "https://www.youtube.com/watch?v=U8XENwh8Oy8",
        pattern: "Modified Binary Search",
        companies: ["Facebook", "LinkedIn", "Amazon"],
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)"
      }
    ]
  },
  linkedList: {
    title: "Linked List",
    icon: "GitBranch",
    color: "indigo",
    problems: [
      {
        id: 206,
        title: "Reverse Linked List",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
        gfgUrl: "https://www.geeksforgeeks.org/reverse-a-linked-list/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1392/A",
        videoUrl: "https://www.youtube.com/watch?v=G0_I-ZF0S38",
        hindiVideoUrl: "https://www.youtube.com/watch?v=D2vI2DNJGd8", // Love Babbar Hindi
        pattern: "Iterative/Recursive",
        companies: ["Google", "Amazon", "Microsoft"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 21,
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
        gfgUrl: "https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1393/A",
        videoUrl: "https://www.youtube.com/watch?v=XIdigk956u0",
        pattern: "Two Pointers",
        companies: ["Amazon", "Microsoft", "Apple"],
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(1)"
      },
      {
        id: 143,
        title: "Reorder List",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/reorder-list/",
        gfgUrl: "https://www.geeksforgeeks.org/rearrange-a-given-linked-list-in-place/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1394/A",
        videoUrl: "https://www.youtube.com/watch?v=S5bfdUTrKLM",
        pattern: "Fast & Slow Pointers",
        companies: ["Facebook", "Amazon", "Microsoft"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 19,
        title: "Remove Nth Node From End of List",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        gfgUrl: "https://www.geeksforgeeks.org/remove-nth-node-from-end-of-the-linked-list/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1395/B",
        videoUrl: "https://www.youtube.com/watch?v=XVuQxVej6y8",
        pattern: "Two Pointers",
        companies: ["Amazon", "Microsoft", "Facebook"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      }
    ]
  },
  trees: {
    title: "Trees",
    icon: "Brain",
    color: "emerald",
    problems: [
      {
        id: 226,
        title: "Invert Binary Tree",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/write-an-efficient-c-function-to-convert-a-tree-into-its-mirror-tree/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1396/A",
        videoUrl: "https://www.youtube.com/watch?v=OnSn2XEQ4MY",
        pattern: "DFS",
        companies: ["Google", "Facebook", "Uber"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: 104,
        title: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/write-a-c-program-to-find-the-maximum-depth-or-height-of-a-tree/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1397/A",
        videoUrl: "https://www.youtube.com/watch?v=hTM3phVI6YQ",
        pattern: "DFS/BFS",
        companies: ["LinkedIn", "Amazon", "Facebook"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: 543,
        title: "Diameter of Binary Tree",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/diameter-of-a-binary-tree/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1398/B",
        videoUrl: "https://www.youtube.com/watch?v=ey7DYc9OANo",
        pattern: "DFS",
        companies: ["Facebook", "Amazon", "Google"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: 110,
        title: "Balanced Binary Tree",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/balanced-binary-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/how-to-determine-if-a-binary-tree-is-balanced/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1399/A",
        videoUrl: "https://www.youtube.com/watch?v=C4_WO0HUr4E",
        pattern: "DFS",
        companies: ["Bloomberg", "Amazon", "Facebook"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: 100,
        title: "Same Tree",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/same-tree/",
        gfgUrl: "https://www.geeksforgeeks.org/write-c-code-to-determine-if-two-trees-are-identical/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1400/B",
        videoUrl: "https://www.youtube.com/watch?v=vRbbcKXCxOw",
        pattern: "DFS",
        companies: ["Bloomberg", "Amazon", "Facebook"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      }
    ]
  },
  dynamicProgramming: {
    title: "Dynamic Programming",
    icon: "Trophy",
    color: "orange",
    problems: [
      {
        id: 70,
        title: "Climbing Stairs",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
        gfgUrl: "https://www.geeksforgeeks.org/count-ways-reach-nth-stair/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1401/A",
        videoUrl: "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
        pattern: "1D DP",
        companies: ["Adobe", "Amazon", "Apple"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 746,
        title: "Min Cost Climbing Stairs",
        difficulty: "Easy",
        leetcodeUrl: "https://leetcode.com/problems/min-cost-climbing-stairs/",
        gfgUrl: "https://www.geeksforgeeks.org/min-cost-climbing-stairs/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1402/A",
        videoUrl: "https://www.youtube.com/watch?v=ktmzAhjhH10",
        pattern: "1D DP",
        companies: ["Amazon", "Google", "Microsoft"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 198,
        title: "House Robber",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/house-robber/",
        gfgUrl: "https://www.geeksforgeeks.org/find-maximum-sum-such-that-no-two-elements-are-adjacent/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1403/A",
        videoUrl: "https://www.youtube.com/watch?v=xlvhyfcoQa4",
        pattern: "1D DP",
        companies: ["LinkedIn", "Amazon", "Airbnb"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 213,
        title: "House Robber II",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/",
        gfgUrl: "https://www.geeksforgeeks.org/maximum-sum-such-that-no-two-elements-are-adjacent/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1404/A",
        videoUrl: "https://www.youtube.com/watch?v=rWAJCfYYOvM",
        pattern: "1D DP",
        companies: ["Microsoft", "Amazon", "Facebook"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: 5,
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/",
        gfgUrl: "https://www.geeksforgeeks.org/longest-palindrome-substring-set-1/",
        codeforcesUrl: "https://codeforces.com/problemset/problem/1405/A",
        videoUrl: "https://www.youtube.com/watch?v=XYQecbcd6_c",
        pattern: "2D DP / Expand Around Centers",
        companies: ["Amazon", "Microsoft", "Facebook"],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
      }
    ]
  }
};

// Helper function to get all problems as a flat array
export const getAllDSAProblems = () => {
  const allProblems = [];
  Object.entries(dsaPatternProblems).forEach(([patternKey, pattern]) => {
    pattern.problems.forEach(problem => {
      allProblems.push({
        ...problem,
        patternKey,
        patternTitle: pattern.title,
        patternColor: pattern.color
      });
    });
  });
  return allProblems;
};

// Helper function to get problems by difficulty
export const getProblemsByDifficulty = (difficulty) => {
  return getAllDSAProblems().filter(problem => problem.difficulty === difficulty);
};

// Helper function to get problems by pattern
export const getProblemsByPattern = (patternKey) => {
  return dsaPatternProblems[patternKey]?.problems || [];
};

// Helper function to search problems
export const searchProblems = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return getAllDSAProblems().filter(problem => 
    problem.title.toLowerCase().includes(lowercaseQuery) ||
    problem.pattern.toLowerCase().includes(lowercaseQuery) ||
    problem.companies.some(company => company.toLowerCase().includes(lowercaseQuery))
  );
};