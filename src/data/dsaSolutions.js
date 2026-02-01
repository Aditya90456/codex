// Solutions for 150 DSA Problems
// Each solution includes optimal approach with explanation

export const dsaSolutions = {
  1: {
    // Two Sum
    javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
    explanation: "Use a hash map to store numbers we've seen. For each number, check if its complement (target - num) exists in the map. Time: O(n), Space: O(n)"
  },
  
  2: {
    // Best Time to Buy and Sell Stock
    javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (let price of prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    
    return maxProfit;
}`,
    python: `def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit`,
    java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        
        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }
        
        return maxProfit;
    }
}`,
    cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        
        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }
        
        return maxProfit;
    }
};`,
    explanation: "Track minimum price seen so far and maximum profit. For each price, update min and calculate profit if we sell at current price. Time: O(n), Space: O(1)"
  },
  
  3: {
    // Contains Duplicate
    javascript: `function containsDuplicate(nums) {
    const seen = new Set();
    for (let num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}`,
    python: `def contains_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
    java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (seen.contains(num)) return true;
            seen.add(num);
        }
        return false;
    }
}`,
    cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int num : nums) {
            if (seen.count(num)) return true;
            seen.insert(num);
        }
        return false;
    }
};`,
    explanation: "Use a hash set to track seen numbers. If we encounter a number already in the set, we found a duplicate. Time: O(n), Space: O(n)"
  },
  
  4: {
    // Product of Array Except Self
    javascript: `function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);
    
    // Left pass
    let left = 1;
    for (let i = 0; i < n; i++) {
        result[i] = left;
        left *= nums[i];
    }
    
    // Right pass
    let right = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= right;
        right *= nums[i];
    }
    
    return result;
}`,
    python: `def product_except_self(nums):
    n = len(nums)
    result = [1] * n
    
    # Left pass
    left = 1
    for i in range(n):
        result[i] = left
        left *= nums[i]
    
    # Right pass
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]
    
    return result`,
    java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, 1);
        
        int left = 1;
        for (int i = 0; i < n; i++) {
            result[i] = left;
            left *= nums[i];
        }
        
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= right;
            right *= nums[i];
        }
        
        return result;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 1);
        
        int left = 1;
        for (int i = 0; i < n; i++) {
            result[i] = left;
            left *= nums[i];
        }
        
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= right;
            right *= nums[i];
        }
        
        return result;
    }
};`,
    explanation: "Two passes: left-to-right to accumulate left products, right-to-left to multiply by right products. Time: O(n), Space: O(1) excluding output"
  },
  
  5: {
    // Maximum Subarray (Kadane's Algorithm)
    javascript: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
    python: `def max_sub_array(nums):
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
    java: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        
        return maxSum;
    }
}`,
    cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            currentSum = max(nums[i], currentSum + nums[i]);
            maxSum = max(maxSum, currentSum);
        }
        
        return maxSum;
    }
};`,
    explanation: "Kadane's Algorithm: At each position, decide whether to extend current subarray or start new one. Time: O(n), Space: O(1)"
  },
  
  // Add more solutions for remaining 145 problems...
  // This is a template showing the structure
  
  // Helper function to get solution
  getSolution: function(problemId, language) {
    const solution = this[problemId];
    if (!solution) return null;
    return {
      code: solution[language],
      explanation: solution.explanation
    };
  },
  
  // Check if solution exists
  hasSolution: function(problemId) {
    return this[problemId] !== undefined && this[problemId] !== this.getSolution && this[problemId] !== this.hasSolution;
  }
};

export default dsaSolutions;
