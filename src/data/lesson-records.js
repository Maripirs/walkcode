// Lesson explanations and five-step walkthrough records.
export const featured = {
  "Contains Duplicate": {
    "brief": "Given an array of integers, return true if any value appears at least twice; otherwise return false.",
    "concepts": [
      "One pass through the array",
      "Set membership"
    ],
    "algorithm": [
      "Create an empty set for values already visited.",
      "Read each number from left to right.",
      "If the number is already in the set, return true.",
      "Otherwise add it to the set and continue.",
      "If the scan ends, return false."
    ],
    "code": "const seen = new Set();\nfor (const n of nums) {\n  if (seen.has(n)) return true;\n  seen.add(n);\n}\nreturn false;",
    "fixes": [
      "Check membership before adding the current value.",
      "A Set stores prior values directly, so it is enough for a duplicate check."
    ],
    "complexity": "Time O(n); space O(n) in the worst case."
  },
  "Reverse Linked List": {
    "brief": "Given the head of a singly linked list, reverse its links in place and return the new head.",
    "concepts": [
      "Pointer rewiring",
      "The prev / current / next invariant"
    ],
    "algorithm": [
      "Start prev at null and current at the original head.",
      "Save current.next before changing any link.",
      "Point current.next backward to prev.",
      "Move prev to current, then move current to the saved next node.",
      "When current reaches null, prev is the new head."
    ],
    "code": "let prev = null;\nlet current = head;\nwhile (current) {\n  const next = current.next;\n  current.next = prev;\n  prev = current;\n  current = next;\n}\nreturn prev;",
    "fixes": [
      "Save next before overwriting current.next, or the unreversed list is lost.",
      "Return prev, not head: the original head becomes the final node."
    ],
    "complexity": "Time O(n); space O(1) for the iterative version."
  },
  "Invert Binary Tree": {
    "brief": "Given a binary tree, swap the left and right child of every node and return the same root.",
    "concepts": [
      "Tree DFS",
      "Recursive child swapping"
    ],
    "algorithm": [
      "An empty subtree needs no work.",
      "Keep the original left child safe while you recursively invert the right child.",
      "Assign the inverted right subtree to root.left.",
      "Assign the inverted original left subtree to root.right.",
      "Return root after both child links have been replaced."
    ],
    "code": "function invertTree(root) {\n  if (!root) return null;\n  const oldLeft = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(oldLeft);\n  return root;\n}",
    "fixes": [
      "Save one child before its reference is overwritten.",
      "Handle the null base case before reading a child."
    ],
    "complexity": "Time O(n); space O(h) for the recursion stack, where h is the tree height."
  },
  "Two Sum": {
    "brief": "Given an array of integers and a target, return the indices of two different numbers whose values add up to that target.",
    "concepts": [
      "Complement lookup",
      "Hash map: value → index"
    ],
    "algorithm": [
      "Walk through the array once.",
      "For the current value n, calculate target − n.",
      "If that complement is already saved, return its saved index and the current index.",
      "Otherwise save n and its index for a future match."
    ],
    "code": "const seen = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const need = target - nums[i];\n  if (seen.has(need)) return [seen.get(need), i];\n  seen.set(nums[i], i);\n}",
    "fixes": [
      "Save after checking, so you cannot use the same element twice.",
      "Map values to indices—not booleans—because the result needs positions."
    ],
    "complexity": "Time O(n); space O(n) for the map."
  },
  "Two Sum II": {
    "brief": "Given a sorted array and a target, return the two positions whose values add up to the target.",
    "concepts": [
      "Sorted order",
      "Two pointers"
    ],
    "algorithm": [
      "Start left at the first value and right at the last.",
      "Compare their sum with target.",
      "Too small: move left rightward. Too large: move right leftward.",
      "A match is the answer."
    ],
    "code": "let left = 0, right = numbers.length - 1;\nwhile (left < right) {\n  const sum = numbers[left] + numbers[right];\n  if (sum === target) return [left + 1, right + 1];\n  if (sum < target) left++; else right--;\n}",
    "fixes": [
      "Move only one pointer per comparison.",
      "The input is already sorted; do not sort it again."
    ],
    "complexity": "Time O(n); space O(1)."
  },
  "Longest Substring Without Repeating Characters": {
    "brief": "Given a string, find the length of its longest contiguous substring with no repeated characters.",
    "concepts": [
      "Sliding window",
      "Set of characters inside the current window"
    ],
    "algorithm": [
      "Expand the right edge one character at a time.",
      "If the new character already exists, shrink the left edge until it does not.",
      "Add the incoming character once the window is valid again.",
      "After the window is valid, update the best length."
    ],
    "code": "const seen = new Set();\nlet left = 0, best = 0;\nfor (let right = 0; right < s.length; right++) {\n  while (seen.has(s[right])) seen.delete(s[left++]);\n  seen.add(s[right]);\n  best = Math.max(best, right - left + 1);\n}",
    "fixes": [
      "Delete s[left], not the incoming duplicate.",
      "Measure after the window is repaired."
    ],
    "complexity": "Time O(n); space O(min(n, alphabet size))."
  },
  "Binary Search": {
    "brief": "Given a sorted list and a target, return its index or -1 without checking every value.",
    "concepts": [
      "Sorted order",
      "Binary search interval"
    ],
    "algorithm": [
      "Keep a left and right boundary for the possible answer.",
      "Check the middle value.",
      "Discard the half that cannot contain target.",
      "Stop when the boundaries cross."
    ],
    "code": "let left = 0, right = nums.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (nums[mid] === target) return mid;\n  if (nums[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;",
    "fixes": [
      "Use left <= right so a single remaining value is checked.",
      "Move past mid; mid was already tested."
    ],
    "complexity": "Time O(log n); space O(1)."
  },
  "Valid Parentheses": {
    "brief": "Given brackets, decide whether every opening bracket is closed in the correct order.",
    "concepts": [
      "Last-in, first-out order",
      "Stack"
    ],
    "algorithm": [
      "Push every opening bracket.",
      "For a closing bracket, the stack must have the matching opener on top.",
      "Pop that opener after confirming the stack was not empty.",
      "The stack must be empty at the end."
    ],
    "code": "const pairs = { \")\":\"(\", \"]\":\"[\", \"}\":\"{\" };\nconst stack = [];\nfor (const ch of s) {\n  if (ch in pairs) { if (stack.pop() !== pairs[ch]) return false; }\n  else stack.push(ch);\n}\nreturn stack.length === 0;",
    "fixes": [
      "Check the result of pop; an empty stack is invalid.",
      "Do not only compare counts—order matters."
    ],
    "complexity": "Time O(n); space O(n)."
  },
  "Number of Islands": {
    "brief": "Given a grid of land and water, count the distinct groups of connected land.",
    "concepts": [
      "Grid graph",
      "DFS or BFS",
      "Visited set / in-place marking"
    ],
    "algorithm": [
      "Scan every cell.",
      "When you find unvisited land, increment the count.",
      "Flood-fill all connected land so it is not counted again.",
      "During the fill, stop at water, visited cells, or the grid boundary."
    ],
    "code": "function visit(r, c) {\n  if (r < 0 || c < 0 || r === rows || c === cols || grid[r][c] !== \"1\") return;\n  grid[r][c] = \"0\";\n  visit(r+1,c); visit(r-1,c); visit(r,c+1); visit(r,c-1);\n}",
    "fixes": [
      "Mark a cell visited when it is discovered, not later.",
      "Check grid boundaries before indexing."
    ],
    "complexity": "Time O(rows × cols); space O(rows × cols) in the worst case."
  }
};

export const profiles = {
  "Arrays & Hashing": {
    "concepts": [
      "Array scan",
      "Set or hash map for constant-time lookup"
    ],
    "algorithm": [
      "Identify what must be remembered from earlier values.",
      "Store only that minimal state.",
      "Update the answer while scanning."
    ],
    "fixes": [
      "Check before overwriting a map entry.",
      "Treat duplicates and empty input as explicit cases."
    ],
    "complexity": "Usually O(n) time and O(n) auxiliary space."
  },
  "Two Pointers": {
    "concepts": [
      "Sorted order or opposing boundaries",
      "Two moving indices"
    ],
    "algorithm": [
      "Define what each pointer represents.",
      "Use a comparison to prove which pointer can move.",
      "Stop when pointers cross."
    ],
    "fixes": [
      "Move the pointer that can improve the result.",
      "Handle equal values deliberately."
    ],
    "complexity": "Usually O(n) time and O(1) space."
  },
  "Sliding Window": {
    "concepts": [
      "Contiguous range",
      "Window validity invariant"
    ],
    "algorithm": [
      "Expand the right edge.",
      "While invalid, shrink left.",
      "Record the best valid window."
    ],
    "fixes": [
      "Repair before measuring.",
      "Remove the outgoing element before advancing left."
    ],
    "complexity": "Usually O(n) time and O(k) space."
  },
  "Stack": {
    "concepts": [
      "Last unfinished item",
      "Stack or monotonic stack"
    ],
    "algorithm": [
      "Push unresolved candidates.",
      "Pop when the current value resolves them.",
      "Use the remaining stack for unresolved work."
    ],
    "fixes": [
      "Check empty-stack cases.",
      "Choose increasing or decreasing order deliberately."
    ],
    "complexity": "Usually O(n) time and O(n) space."
  },
  "Binary Search": {
    "concepts": [
      "Sorted or monotonic answer space",
      "Search interval"
    ],
    "algorithm": [
      "Define the boolean predicate or sorted target.",
      "Test mid.",
      "Discard a proven-impossible half."
    ],
    "fixes": [
      "Choose inclusive bounds consistently.",
      "Move past mid after testing it."
    ],
    "complexity": "Usually O(log n) time and O(1) space."
  },
  "Graphs": {
    "concepts": [
      "Nodes, edges, and visited state",
      "DFS or BFS"
    ],
    "algorithm": [
      "Choose a start state.",
      "Mark visited when discovered.",
      "Explore each neighbor once."
    ],
    "fixes": [
      "Avoid revisiting nodes.",
      "Use a queue for shortest unweighted paths."
    ],
    "complexity": "Usually O(V + E) time and O(V) space."
  },
  "Trees": {
    "concepts": [
      "Recursive subtree result",
      "DFS or BFS"
    ],
    "algorithm": [
      "Write the null base case.",
      "Ask each child for the information you need.",
      "Combine child results at the parent."
    ],
    "fixes": [
      "Separate global answer from return value when needed.",
      "Handle an empty tree."
    ],
    "complexity": "Usually O(n) time and O(h) space."
  },
  "1-D Dynamic Programming": {
    "concepts": [
      "State for a prefix or index",
      "Overlapping subproblems"
    ],
    "algorithm": [
      "Define dp[i] in words.",
      "Write its recurrence.",
      "Set base cases and iterate in dependency order."
    ],
    "fixes": [
      "Do not use a state before it exists.",
      "Consider constant-space compression."
    ],
    "complexity": "Usually O(n) time and O(n) or O(1) space."
  },
  "2-D Dynamic Programming": {
    "concepts": [
      "Two-dimensional state",
      "Transitions from earlier cells"
    ],
    "algorithm": [
      "Define both state dimensions.",
      "Set first row/column base cases.",
      "Fill in an order that respects dependencies."
    ],
    "fixes": [
      "Check matrix bounds.",
      "Choose an iteration direction that preserves dependencies."
    ],
    "complexity": "Often O(m × n) time and space."
  }
};

export const fallback = {
  "concepts": [
    "The problem’s input shape",
    "A state that prevents repeated work"
  ],
  "algorithm": [
    "Name the brute-force approach.",
    "Identify the repeated work to avoid.",
    "Choose a data structure or recurrence that preserves the key state."
  ],
  "fixes": [
    "Check boundary and empty-input cases.",
    "Trace a tiny example before coding."
  ],
  "complexity": "State the runtime in terms of input size and the memory used beyond the input."
};

export const problemExplanations = {
  "Two Sum": "You receive an array of integers and a target. Find the indices of two different numbers whose values add up to that target.",
  "Contains Duplicate": "You receive an array of integers. Decide whether any value appears more than once.",
  "Valid Anagram": "You receive two strings. Decide whether they contain exactly the same letters with the same counts, possibly in a different order.",
  "Group Anagrams": "You receive a list of strings. Put strings together when they are rearrangements of the same letters.",
  "Top K Frequent Elements": "You receive an array of integers and k. Return the k values that occur most often.",
  "Encode and Decode Strings": "Design a way to turn a list of strings into one string and recover the exact original list, even when strings contain special characters.",
  "Product of Array Except Self": "For each position in an integer array, return the product of every other value without dividing by the current value.",
  "Valid Sudoku": "You receive a partially filled 9 by 9 Sudoku board. Decide whether its filled cells obey the row, column, and 3 by 3 box rules.",
  "Longest Consecutive Sequence": "You receive an unsorted array of integers. Find the length of the longest run of consecutive values, regardless of their order in the array.",
  "Two Sum II": "You receive a sorted array and a target. Find the two 1-indexed positions whose values add up to the target.",
  "Valid Palindrome": "You receive a string. Ignore case and non-alphanumeric characters, then decide whether it reads the same forward and backward.",
  "3Sum": "You receive an integer array. Return every unique group of three values whose sum is zero.",
  "Container With Most Water": "You receive vertical line heights. Choose two lines that hold the most water, where width is their distance and height is the shorter line.",
  "Trapping Rain Water": "You receive an elevation map. Calculate how much rainwater remains trapped between its bars after raining.",
  "Longest Substring Without Repeating Characters": "You receive a string. Find the length of its longest contiguous section that contains no repeated character.",
  "Best Time to Buy and Sell Stock": "You receive daily stock prices. Choose one earlier day to buy and one later day to sell for the largest possible profit, or return zero.",
  "Longest Repeating Character Replacement": "You receive an uppercase string and a replacement budget k. Find the longest substring that can be made of one repeated letter using at most k changes.",
  "Permutation in String": "You receive two strings. Decide whether the second contains a contiguous substring that is a permutation of the first.",
  "Minimum Window Substring": "You receive strings s and t. Find the shortest contiguous section of s that contains every character required by t, including repeated characters.",
  "Sliding Window Maximum": "You receive an array and a window size k. Return the largest value visible in each consecutive window of k positions.",
  "Valid Parentheses": "You receive a string of brackets. Decide whether every opening bracket is closed by the right type in the right nesting order.",
  "Min Stack": "Design a stack that supports push, pop, top, and retrieving its current minimum value in constant time.",
  "Evaluate Reverse Polish Notation": "You receive arithmetic tokens in postfix order. Evaluate the expression, where an operator uses the two most recent values.",
  "Daily Temperatures": "You receive daily temperatures. For each day, report how many days pass before a warmer temperature, or zero if none arrives.",
  "Car Fleet": "Cars drive toward one destination at different positions and speeds. Count how many groups arrive together when faster cars cannot pass slower ones.",
  "Largest Rectangle in Histogram": "You receive bar heights. Find the largest rectangular area that can be drawn using adjacent bars in the histogram.",
  "Binary Search": "You receive a sorted array and a target. Return the target index, or -1 when the target does not occur.",
  "Search a 2D Matrix": "You receive a matrix whose rows and row boundaries are sorted. Decide whether a target value is present.",
  "Koko Eating Bananas": "Koko must finish piles of bananas within h hours. Find the smallest whole-number eating speed that lets her finish in time.",
  "Find Minimum in Rotated Sorted Array": "You receive a sorted array that was rotated at an unknown position. Find its smallest value.",
  "Search in Rotated Sorted Array": "You receive a rotated sorted array with distinct values and a target. Return the target index or -1.",
  "Time Based Key-Value Store": "Design a store that saves values for a key at timestamps and retrieves the value that existed at or before a requested timestamp.",
  "Median of Two Sorted Arrays": "You receive two sorted arrays. Find the median value of all their combined elements without fully merging them.",
  "Reverse Linked List": "You receive the head of a singly linked list. Reverse all next pointers and return the new head.",
  "Merge Two Sorted Lists": "You receive the heads of two sorted linked lists. Join their existing nodes into one sorted linked list.",
  "Reorder List": "You receive a linked list. Rearrange its nodes in first, last, second, second-last order without changing node values.",
  "Remove Nth Node From End of List": "You receive a linked list and n. Remove the node that is n positions from the end and return the head.",
  "Copy List with Random Pointer": "You receive a linked list where each node also has a random pointer. Create a deep copy with the same next and random relationships.",
  "Add Two Numbers": "You receive two linked lists representing non-negative integers in reverse digit order. Add them and return the sum in the same form.",
  "Linked List Cycle": "You receive the head of a linked list. Decide whether following next pointers eventually loops back to an earlier node.",
  "Find the Duplicate Number": "You receive n + 1 integers from 1 through n with exactly one repeated value. Find that duplicate without changing the array.",
  "LRU Cache": "Design a fixed-capacity cache that returns a value by key and discards the least recently used entry when it fills up.",
  "Merge K Sorted Lists": "You receive several sorted linked lists. Merge all of their nodes into one sorted linked list.",
  "Reverse Nodes in K-Group": "You receive a linked list and k. Reverse each complete block of k nodes, leaving a final smaller block unchanged.",
  "Invert Binary Tree": "You receive the root of a binary tree. Swap every node’s left and right children and return the root.",
  "Maximum Depth of Binary Tree": "You receive a binary tree. Return the number of nodes on its longest path from the root down to a leaf.",
  "Diameter of Binary Tree": "You receive a binary tree. Find the greatest number of edges on any path between two nodes.",
  "Balanced Binary Tree": "You receive a binary tree. Decide whether the heights of the left and right subtrees differ by no more than one at every node.",
  "Same Tree": "You receive two binary trees. Decide whether they have identical shapes and values at corresponding nodes.",
  "Subtree of Another Tree": "You receive two binary trees. Decide whether one tree appears exactly as a full subtree of the other.",
  "Lowest Common Ancestor of a Binary Search Tree": "You receive a binary search tree and two nodes. Find their lowest shared ancestor in the tree.",
  "Binary Tree Level Order Traversal": "You receive a binary tree. Return its node values grouped by depth from top to bottom.",
  "Binary Tree Right Side View": "You receive a binary tree. Return the values visible when looking at it from the right side, one per depth.",
  "Count Good Nodes in Binary Tree": "You receive a binary tree. Count nodes whose value is at least every value on the path from the root to that node.",
  "Validate Binary Search Tree": "You receive a binary tree. Decide whether it obeys strict binary-search-tree ordering at every subtree.",
  "Kth Smallest Element in a BST": "You receive a binary search tree and k. Return its kth smallest value.",
  "Construct Binary Tree from Preorder and Inorder Traversal": "You receive preorder and inorder traversals of the same tree with unique values. Rebuild and return that tree.",
  "Binary Tree Maximum Path Sum": "You receive a binary tree. Find the largest sum obtainable along any non-empty path between nodes.",
  "Serialize and Deserialize Binary Tree": "Design a way to convert a binary tree to a string and reconstruct the identical tree from that string.",
  "Kth Largest Element in a Stream": "Design a structure that receives numbers one at a time and returns the kth largest value seen so far.",
  "Last Stone Weight": "You receive stone weights. Repeatedly smash the two heaviest stones and return the final weight, or zero when none remains.",
  "K Closest Points to Origin": "You receive points on a plane and k. Return any k points with the smallest distance from the origin.",
  "Kth Largest Element in an Array": "You receive an unsorted integer array and k. Return the kth largest value in sorted order.",
  "Task Scheduler": "You receive repeating task labels and a cooldown n. Find the fewest intervals needed to run all tasks without repeating a label too soon.",
  "Design Twitter": "Design a small social feed that posts tweets, follows users, and returns the ten most recent tweets from a user and people they follow.",
  "Find Median from Data Stream": "Design a structure that adds numbers from a stream and returns the median after any insertion.",
  "Subsets": "You receive distinct integers. Return every possible subset, including the empty subset.",
  "Combination Sum": "You receive candidate numbers and a target. Return all unique combinations that add to the target, allowing a candidate to be reused.",
  "Permutations": "You receive distinct integers. Return every possible ordering of those integers.",
  "Subsets II": "You receive integers that may repeat. Return every distinct subset without duplicate results.",
  "Combination Sum II": "You receive candidate numbers that may repeat and a target. Return unique combinations that add to the target, using each input occurrence at most once.",
  "Word Search": "You receive a grid of letters and a word. Decide whether the word can be traced through adjacent cells without reusing a cell.",
  "Palindrome Partitioning": "You receive a string. Split it into every possible list of substrings where each substring is a palindrome.",
  "Letter Combinations of a Phone Number": "You receive digits from 2 through 9. Return every letter string those telephone-keypad digits can represent.",
  "N-Queens": "Place n queens on an n by n board so none attack each other, and return every valid board arrangement.",
  "Generate Parentheses": "You receive n pairs of parentheses. Return every well-formed string that uses all n pairs.",
  "Implement Trie (Prefix Tree)": "Design a prefix tree that inserts words, finds complete words, and checks whether a prefix exists.",
  "Design Add and Search Words Data Structure": "Design a word dictionary that adds words and searches patterns where a dot can match any single letter.",
  "Word Search II": "You receive a letter grid and a word list. Return every listed word that can be traced through adjacent cells without reusing a cell.",
  "Clone Graph": "You receive a reference to a node in a connected graph. Return a deep copy with the same nodes and neighbor links.",
  "Number of Islands": "You receive a grid of land and water. Count how many separate groups of horizontally or vertically connected land it contains.",
  "Max Area of Island": "You receive a grid of land and water. Find the largest number of connected land cells in any one island.",
  "Pacific Atlantic Water Flow": "You receive a height grid. Return cells from which water can reach both the Pacific and Atlantic borders by flowing only downhill or level.",
  "Surrounded Regions": "You receive a board of X and O cells. Change only O regions completely surrounded by X into X.",
  "Rotting Oranges": "You receive a grid of fresh, rotten, and empty cells. Find the minutes required for rot to spread to all fresh oranges, or report impossible.",
  "Walls and Gates": "You receive rooms, walls, gates, and empty spaces. Fill each empty room with its distance to the nearest gate.",
  "Course Schedule": "You receive courses and prerequisite pairs. Decide whether it is possible to complete all courses.",
  "Course Schedule II": "You receive courses and prerequisite pairs. Return one valid order to take all courses, or an empty list if none exists.",
  "Redundant Connection": "You receive edges that form a tree plus one extra edge. Return the edge whose removal restores a tree.",
  "Number of Connected Components in an Undirected Graph": "You receive an undirected graph. Count how many disconnected groups of vertices it has.",
  "Graph Valid Tree": "You receive an undirected graph with n vertices. Decide whether its edges form exactly one valid tree.",
  "Word Ladder": "You receive a start word, end word, and dictionary. Find the fewest one-letter changes needed to reach the end word using dictionary words.",
  "Reconstruct Itinerary": "You receive airline tickets. Reconstruct the route that uses every ticket once, starts at JFK, and is lexicographically smallest when choices exist.",
  "Min Cost to Connect All Points": "You receive points on a plane. Connect every point with the smallest possible total Manhattan-distance cost.",
  "Network Delay Time": "You receive directed travel times, a starting node, and n nodes. Return how long until every node receives the signal, or -1 if one cannot.",
  "Swim in Rising Water": "You receive elevation values in a grid. Find the earliest time you can travel from top-left to bottom-right when water reaches that elevation.",
  "Alien Dictionary": "You receive words already sorted in an unknown alphabet. Infer one valid ordering of the letters, or report that none is possible.",
  "Cheapest Flights Within K Stops": "You receive flights, a source, destination, and a stop limit. Find the cheapest route that uses at most that many stops.",
  "Climbing Stairs": "You can take one or two steps at a time. Given n steps, count the different ways to reach the top.",
  "Min Cost Climbing Stairs": "You receive a cost for each stair. Find the smallest total cost to reach the top when each move climbs one or two stairs.",
  "House Robber": "You receive money in a row of houses. Find the largest amount you can take without taking from adjacent houses.",
  "House Robber II": "You receive money in houses arranged in a circle. Find the largest amount you can take without taking from adjacent houses.",
  "Longest Palindromic Substring": "You receive a string. Return its longest contiguous substring that reads the same in either direction.",
  "Palindromic Substrings": "You receive a string. Count how many of its contiguous substrings are palindromes.",
  "Decode Ways": "You receive a digit string where 1 through 26 map to letters. Count the ways to split it into valid letter encodings.",
  "Coin Change": "You receive coin denominations and an amount. Return the fewest coins needed to make that amount, or -1 if it is impossible.",
  "Maximum Product Subarray": "You receive an integer array. Return the largest product obtainable from a non-empty contiguous subarray.",
  "Word Break": "You receive a string and a dictionary. Decide whether the string can be split into one or more dictionary words.",
  "Longest Increasing Subsequence": "You receive an integer array. Return the length of its longest strictly increasing subsequence, not necessarily contiguous.",
  "Partition Equal Subset Sum": "You receive positive integers. Decide whether they can be split into two subsets with equal sums.",
  "Unique Paths": "You receive an m by n grid. Count the paths from top-left to bottom-right when you may move only right or down.",
  "Longest Common Subsequence": "You receive two strings. Return the length of the longest sequence of characters they share in the same relative order.",
  "Best Time to Buy and Sell Stock with Cooldown": "You receive daily stock prices. Maximize profit with as many trades as you want, but after selling you must wait one day before buying again.",
  "Coin Change II": "You receive coin denominations and an amount. Count the unique combinations of coins that make exactly that amount.",
  "Target Sum": "You receive integers and a target. Count how many ways assigning plus or minus to each integer reaches the target.",
  "Interleaving String": "You receive three strings. Decide whether the third can be built by interleaving the first two while preserving each string’s character order.",
  "Longest Increasing Path in a Matrix": "You receive an integer matrix. Return the length of the longest path that moves to adjacent cells with strictly increasing values.",
  "Distinct Subsequences": "You receive strings s and t. Count how many subsequences of s equal t.",
  "Edit Distance": "You receive two strings. Find the fewest insertions, deletions, or replacements needed to change one into the other.",
  "Burst Balloons": "You receive balloon values. Choose a popping order that maximizes the coins earned from each balloon’s current neighbors.",
  "Regular Expression Matching": "You receive a string and a pattern using dot and star. Decide whether the whole string matches the pattern.",
  "Maximum Subarray": "You receive an integer array. Return the largest sum obtainable from a non-empty contiguous subarray.",
  "Jump Game": "You receive maximum jump lengths at each array position. Decide whether you can reach the final index from the first.",
  "Jump Game II": "You receive maximum jump lengths at each array position. Return the fewest jumps needed to reach the final index.",
  "Gas Station": "You receive circular gas and cost arrays. Return a start station that completes one full circuit, or -1 if none can.",
  "Hand of Straights": "You receive cards and a group size. Decide whether they can be rearranged into consecutive groups of that size.",
  "Merge Triplets to Form Target Triplet": "You receive integer triplets and a target triplet. Decide whether repeatedly taking coordinate-wise maximum can create the target exactly.",
  "Partition Labels": "You receive a string. Divide it into as many parts as possible so each letter appears in at most one part, and return the part lengths.",
  "Valid Parenthesis String": "You receive parentheses plus wildcard stars that can act as an opening, closing, or empty character. Decide whether the string can be valid.",
  "Insert Interval": "You receive sorted, non-overlapping intervals and one new interval. Insert it and merge any overlaps.",
  "Merge Intervals": "You receive intervals that may overlap. Merge every overlapping group and return the non-overlapping result.",
  "Non-overlapping Intervals": "You receive intervals. Return the fewest intervals to remove so the remaining intervals do not overlap.",
  "Meeting Rooms": "You receive meeting intervals. Decide whether one person can attend every meeting without any overlap.",
  "Meeting Rooms II": "You receive meeting intervals. Return the minimum number of rooms needed to hold all meetings.",
  "Minimum Interval to Include Each Query": "You receive intervals and query values. For each query, return the length of the smallest interval containing it, or -1.",
  "Rotate Image": "You receive an n by n matrix. Rotate it 90 degrees clockwise in place.",
  "Spiral Matrix": "You receive a matrix. Return all values in clockwise spiral order from the outside inward.",
  "Set Matrix Zeroes": "You receive a matrix. If any cell is zero, set its entire row and column to zero while modifying the matrix in place.",
  "Happy Number": "Starting with an integer, repeatedly replace it with the sum of its squared digits. Decide whether this process reaches 1.",
  "Plus One": "You receive digits representing a non-negative integer. Return the digits after adding one.",
  "Pow(x, n)": "You receive a number x and integer exponent n. Compute x raised to n efficiently.",
  "Multiply Strings": "You receive two non-negative integers as strings. Return their product as a string without converting them to built-in big integers.",
  "Detect Squares": "Design a structure that adds points and counts how many axis-aligned squares can be formed with a given query point.",
  "Single Number": "You receive integers where every value appears twice except one. Return the value that appears only once.",
  "Number of 1 Bits": "You receive an unsigned integer. Return how many bits in its binary representation are 1.",
  "Counting Bits": "For every number from 0 through n, return how many 1 bits appear in its binary representation.",
  "Reverse Bits": "You receive a 32-bit unsigned integer. Return the integer made by reversing all 32 bits.",
  "Missing Number": "You receive n distinct values from the range 0 through n. Return the one value that is missing.",
  "Sum of Two Integers": "You receive two integers. Return their sum without using the plus or minus operator.",
  "Reverse Integer": "You receive a signed 32-bit integer. Reverse its digits, returning zero if the reversed result overflows the 32-bit range."
};

export const briefs = {
  "Two Sum": [
    "nums: an integer array; target: an integer.",
    "Return two indices whose values sum to target.",
    "Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]"
  ],
  "Two Sum II": [
    "numbers: a sorted integer array; target: an integer.",
    "Return the two 1-indexed positions.",
    "Input: [2, 7, 11, 15], target = 9\nOutput: [1, 2]"
  ],
  "Longest Substring Without Repeating Characters": [
    "s: a string.",
    "Return the longest valid substring length.",
    "Input: \"abcabcbb\"\nOutput: 3, from \"abc\""
  ],
  "Binary Search": [
    "nums: sorted integer array; target: an integer.",
    "Return the target index or -1.",
    "Input: [-1, 0, 3, 5, 9], target = 9\nOutput: 4"
  ],
  "Valid Parentheses": [
    "s: a bracket string.",
    "Return true when every opening bracket closes in order.",
    "Input: \"([])\"\nOutput: true"
  ],
  "Number of Islands": [
    "grid: a matrix of \"1\" land and \"0\" water.",
    "Return the number of connected land groups.",
    "Input: [[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"1\",\"0\",\"1\"]]\nOutput: 3"
  ],
  "Contains Duplicate": [
    "nums: an array of integers.",
    "Return true if any value appears at least twice; otherwise return false.",
    "Input: nums = [1, 2, 3, 1]\nOutput: true, because 1 appears more than once."
  ],
  "Reverse Linked List": [
    "head: the first node of a singly linked list. Each node has a value and a next pointer.",
    "Return the head of the same nodes in reverse order.",
    "Input: 1 → 2 → 3 → null\nOutput: 3 → 2 → 1 → null"
  ],
  "Invert Binary Tree": [
    "root: the root node of a binary tree. Each node has left and right children.",
    "Return the root after every node’s left and right subtrees have been swapped.",
    "Input:    4\n       / \\ \n      2   7\nOutput:   4\n       / \\ \n      7   2"
  ]
};

export const conceptChoices = {
  "Two Sum": [
    "Hash map / complement lookup",
    "Two pointers only",
    "Binary search"
  ],
  "Two Sum II": [
    "Two pointers",
    "Dynamic programming",
    "Trie"
  ],
  "Longest Substring Without Repeating Characters": [
    "Sliding window + set",
    "Heap",
    "Union-find"
  ],
  "Binary Search": [
    "Binary search interval",
    "Depth-first search",
    "Prefix sums"
  ],
  "Valid Parentheses": [
    "Stack",
    "Queue",
    "Hash map"
  ],
  "Number of Islands": [
    "Grid DFS/BFS + visited state",
    "Binary search",
    "Monotonic stack"
  ],
  "Contains Duplicate": [
    "Hash set",
    "Two pointers",
    "Binary search"
  ],
  "Reverse Linked List": [
    "Pointer rewiring with prev / current / next",
    "Hash map",
    "Two pointers"
  ],
  "Invert Binary Tree": [
    "Tree DFS with child swapping",
    "Hash map",
    "Two pointers"
  ]
};

export const complexityLessons = {
  "Contains Duplicate": {
    "code": "const seen = new Set();\nfor (const n of nums) {\n  if (seen.has(n)) return true;\n  seen.add(n);\n}\nreturn false;",
    "work": "Across the for loop, how many times can one array value be checked and added to the set?",
    "workChoices": [
      ["once", "At most once"],
      ["nested", "Once for every other array value"]
    ],
    "workCorrect": "once",
    "workWhy": "The loop advances through nums once. Set membership and insertion are constant time on average, so each value contributes constant work.",
    "memory": "In the worst case, what extra storage can grow with the array?",
    "memoryChoices": [
      ["set", "The set of distinct values seen so far"],
      ["constant", "Only n and the loop index"]
    ],
    "memoryCorrect": "set",
    "memoryWhy": "If no number repeats, seen stores every input value before the loop finishes.",
    "final": [
      ["linear-linear", "Time O(n), space O(n)"],
      ["quadratic-linear", "Time O(n²), space O(n)"],
      ["linear-constant", "Time O(n), space O(1)"]
    ],
    "finalCorrect": "linear-linear"
  },
  "Reverse Linked List": {
    "code": "let prev = null, current = head;\nwhile (current) {\n  const next = current.next;\n  current.next = prev;\n  prev = current;\n  current = next;\n}\nreturn prev;",
    "work": "During the while loop, how many times can a single node become current?",
    "workChoices": [
      [
        "once",
        "At most once"
      ],
      [
        "revisit",
        "Once for every other node"
      ]
    ],
    "workCorrect": "once",
    "workWhy": "The current pointer moves to the saved next node and never moves backward, so each node is processed once.",
    "memory": "Besides the input list, what storage can grow as the list gets longer?",
    "memoryChoices": [
      [
        "constant",
        "Only prev, current, and next"
      ],
      [
        "nodes",
        "A second list of all nodes"
      ]
    ],
    "memoryCorrect": "constant",
    "memoryWhy": "The algorithm changes links in the original list and holds only three node references.",
    "final": [
      [
        "linear-constant",
        "Time O(n), space O(1)"
      ],
      [
        "quadratic-constant",
        "Time O(n²), space O(1)"
      ],
      [
        "linear-linear",
        "Time O(n), space O(n)"
      ]
    ],
    "finalCorrect": "linear-constant"
  },
  "Two Sum II": {
    "code": "let left = 0, right = numbers.length - 1;\nwhile (left < right) {\n  const sum = numbers[left] + numbers[right];\n  if (sum === target) return [left + 1, right + 1];\n  if (sum < target) left++;\n  else right--;\n}",
    "work": "Across the full search, how many times can either pointer move?",
    "workChoices": [
      [
        "once",
        "At most once per array position"
      ],
      [
        "nested",
        "Once for every other array position"
      ]
    ],
    "workCorrect": "once",
    "workWhy": "left only moves right and right only moves left. Together they can cross the array only once.",
    "memory": "Besides the input array, what storage can grow as the input gets longer?",
    "memoryChoices": [
      [
        "constant",
        "Only left, right, and sum"
      ],
      [
        "map",
        "A map of every value"
      ]
    ],
    "memoryCorrect": "constant",
    "memoryWhy": "The algorithm keeps a fixed number of variables and uses the sorted input directly.",
    "final": [
      [
        "linear-constant",
        "Time O(n), space O(1)"
      ],
      [
        "quadratic-constant",
        "Time O(n²), space O(1)"
      ],
      [
        "linear-linear",
        "Time O(n), space O(n)"
      ]
    ],
    "finalCorrect": "linear-constant"
  },
  "Longest Substring Without Repeating Characters": {
    "code": "const seen = new Set();\nlet left = 0, best = 0;\nfor (let right = 0; right < s.length; right++) {\n  while (seen.has(s[right])) seen.delete(s[left++]);\n  seen.add(s[right]);\n  best = Math.max(best, right - left + 1);\n}\nreturn best;",
    "work": "Although there is a while loop inside the for loop, how many total times can one character leave the window?",
    "workChoices": [
      [
        "once",
        "At most once"
      ],
      [
        "nested",
        "Once for every later character"
      ]
    ],
    "workCorrect": "once",
    "workWhy": "left only moves forward. Each character is added once and removed at most once, so the two pointers make one total pass.",
    "memory": "In the worst case, what extra storage can grow with the input string?",
    "memoryChoices": [
      [
        "set",
        "The set of characters in the current window"
      ],
      [
        "constant",
        "Only left, right, and best"
      ]
    ],
    "memoryCorrect": "set",
    "memoryWhy": "When all characters are distinct, the current window and its set can contain the whole string.",
    "final": [
      [
        "linear-linear",
        "Time O(n), space O(n)"
      ],
      [
        "quadratic-linear",
        "Time O(n²), space O(n)"
      ],
      [
        "linear-constant",
        "Time O(n), space O(1)"
      ]
    ],
    "finalCorrect": "linear-linear"
  },
  "Valid Parentheses": {
    "code": "const pairs = { \")\":\"(\", \"]\":\"[\", \"}\":\"{\" };\nconst stack = [];\nfor (const char of s) {\n  if (char in pairs) {\n    if (stack.pop() !== pairs[char]) return false;\n  } else stack.push(char);\n}\nreturn stack.length === 0;",
    "work": "How many times can one bracket be read by the for loop?",
    "workChoices": [
      [
        "once",
        "At most once"
      ],
      [
        "nested",
        "Once for every other bracket"
      ]
    ],
    "workCorrect": "once",
    "workWhy": "The loop makes one pass through the string, and each stack push or pop is constant time.",
    "memory": "In the worst case, what extra storage can grow with the string?",
    "memoryChoices": [
      [
        "stack",
        "The stack of unmatched opening brackets"
      ],
      [
        "constant",
        "Only the pairs object"
      ]
    ],
    "memoryCorrect": "stack",
    "memoryWhy": "A string of only opening brackets leaves every bracket on the stack, so the stack can hold n values.",
    "final": [
      [
        "linear-linear",
        "Time O(n), space O(n)"
      ],
      [
        "quadratic-linear",
        "Time O(n²), space O(n)"
      ],
      [
        "linear-constant",
        "Time O(n), space O(1)"
      ]
    ],
    "finalCorrect": "linear-linear"
  },
  "Binary Search": {
    "code": "let left = 0, right = nums.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (nums[mid] === target) return mid;\n  if (nums[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;",
    "work": "After each unsuccessful comparison, what happens to the remaining search interval?",
    "workChoices": [
      [
        "halve",
        "It is cut roughly in half"
      ],
      [
        "one",
        "It loses only one value"
      ]
    ],
    "workCorrect": "halve",
    "workWhy": "Each comparison proves an entire half of the sorted interval cannot contain the target.",
    "memory": "Besides the input array, what storage can grow as the array gets longer?",
    "memoryChoices": [
      [
        "constant",
        "Only left, right, and mid"
      ],
      [
        "copy",
        "A copy of the remaining half"
      ]
    ],
    "memoryCorrect": "constant",
    "memoryWhy": "The active interval is represented by indexes; no new array is created.",
    "final": [
      [
        "log-constant",
        "Time O(log n), space O(1)"
      ],
      [
        "linear-constant",
        "Time O(n), space O(1)"
      ],
      [
        "log-linear",
        "Time O(log n), space O(n)"
      ]
    ],
    "finalCorrect": "log-constant"
  },
  "Number of Islands": {
    "code": "function visit(r, c) {\n  if (r < 0 || c < 0 || r === rows || c === cols || grid[r][c] !== \"1\") return;\n  grid[r][c] = \"0\";\n  visit(r + 1, c); visit(r - 1, c);\n  visit(r, c + 1); visit(r, c - 1);\n}\nfor (let r = 0; r < rows; r++)\n  for (let c = 0; c < cols; c++)\n    if (grid[r][c] === \"1\") { count++; visit(r, c); }",
    "work": "Across the scan and all flood fills, how many times can one grid cell be visited as land?",
    "workChoices": [
      [
        "once",
        "At most once"
      ],
      [
        "nested",
        "Once for every other cell"
      ]
    ],
    "workCorrect": "once",
    "workWhy": "Flood fill marks a land cell the first time it visits it, so later scans and calls skip it.",
    "memory": "What extra storage can grow with the size of the grid in this recursive version?",
    "memoryChoices": [
      [
        "callstack",
        "The recursion call stack"
      ],
      [
        "constant",
        "Only the island counter"
      ]
    ],
    "memoryCorrect": "callstack",
    "memoryWhy": "A large connected island can create a recursive path containing many cells.",
    "final": [
      [
        "grid-grid",
        "Time O(rows × cols), space O(rows × cols)"
      ],
      [
        "quadratic-constant",
        "Time O((rows × cols)²), space O(1)"
      ],
      [
        "grid-constant",
        "Time O(rows × cols), space O(1)"
      ]
    ],
    "finalCorrect": "grid-grid"
  },
  "Invert Binary Tree": {
    "code": "function invertTree(root) {\n  if (!root) return null;\n  const oldLeft = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(oldLeft);\n  return root;\n}",
    "work": "How many times does the recursive function process a real tree node?",
    "workChoices": [
      [
        "once",
        "At most once"
      ],
      [
        "nested",
        "Once for every other node"
      ]
    ],
    "workCorrect": "once",
    "workWhy": "Each call handles one node, swaps its two child references, and recurses into each child once.",
    "memory": "What extra storage can grow as the tree gets taller?",
    "memoryChoices": [
      [
        "stack",
        "The recursion call stack"
      ],
      [
        "constant",
        "Only oldLeft"
      ]
    ],
    "memoryCorrect": "stack",
    "memoryWhy": "The recursive calls wait for child calls to finish. Their depth follows the tree height h.",
    "final": [
      [
        "tree-height",
        "Time O(n), space O(h)"
      ],
      [
        "tree-constant",
        "Time O(n), space O(1)"
      ],
      [
        "quadratic-height",
        "Time O(n²), space O(h)"
      ]
    ],
    "finalCorrect": "tree-height"
  }
};
