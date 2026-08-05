// Walkthrough difficulty overrides; Medium is the fallback.

// The canonical difficulty vocabulary (single source): the ordered set and its rank map, imported by
// state/views (filters, bands) and model.js (ordering). Kept in this pure, localStorage-free module
// so both the browser and Node (assemble/validate) can import it.
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const DIFFICULTY_RANK = { Easy: 0, Medium: 1, Hard: 2 };

export const easyWalkthroughTitles = [
  "Contains Duplicate",
  "Valid Anagram",
  "Two Sum",
  "Valid Palindrome",
  "Best Time to Buy and Sell Stock",
  "Valid Parentheses",
  "Binary Search",
  "Reverse Linked List",
  "Merge Two Sorted Lists",
  "Linked List Cycle",
  "Invert Binary Tree",
  "Maximum Depth of Binary Tree",
  "Diameter of Binary Tree",
  "Balanced Binary Tree",
  "Same Tree",
  "Subtree of Another Tree",
  "Kth Largest Element in a Stream",
  "Last Stone Weight",
  "Climbing Stairs",
  "Min Cost Climbing Stairs",
  "Happy Number",
  "Plus One",
  "Single Number",
  "Number of 1 Bits",
  "Counting Bits",
  "Reverse Bits",
  "Missing Number"
];

export const hardWalkthroughTitles = [
  "Trapping Rain Water",
  "Minimum Window Substring",
  "Sliding Window Maximum",
  "Largest Rectangle in Histogram",
  "Median of Two Sorted Arrays",
  "Merge K Sorted Lists",
  "Reverse Nodes in K-Group",
  "Binary Tree Maximum Path Sum",
  "Serialize and Deserialize Binary Tree",
  "Find Median from Data Stream",
  "N-Queens",
  "Word Search II",
  "Word Ladder",
  "Swim in Rising Water",
  "Alien Dictionary",
  "Minimum Interval to Include Each Query",
  "Longest Increasing Path in a Matrix",
  "Distinct Subsequences",
  "Burst Balloons",
  "Regular Expression Matching"
];
