import { supplementalFullCode } from './supplemental-solutions.js';
import { blankLine, genericWrong } from './blank-line.js';

// Lesson explanations and five-step walkthrough records.
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





// ---- Roadmap problems promoted WIP -> Built (consolidated from the former walkthrough-upgrades.js).
// Authored via the lesson()/ex() helpers, which build code-fix exercises from the full solution.
// Build a whole-line code-fix exercise from a spec { prompt, correct, choices, why }: the JS
// solution is shown with `correct` blanked, and Python variants live in languages.js keyed by
// `title:index`. Keeping the JS solution here as the single source means the shown code is
// always the real solution with one line removed.
function ex(fullJs, spec) {
  return {
    prompt: spec.prompt,
    code: blankLine(fullJs, spec.correct),
    choices: spec.choices,
    correct: spec.correct,
    why: spec.why,
    wrong: spec.wrong || genericWrong(spec.choices, spec.correct),
  };
}

function lesson(title, details) {
  const fullCode = supplementalFullCode[title];
  return {
    ...details,
    code: fullCode.JavaScript,
    pythonCode: fullCode.Python,
    exercises: details.exercises.map((spec) => ex(fullCode.JavaScript, spec)),
  };
}

const walkthroughUpgrades = {
  'Evaluate Reverse Polish Notation': lesson('Evaluate Reverse Polish Notation', {
    brief: 'Evaluate an arithmetic expression given in postfix (Reverse Polish) notation.',
    concepts: ['Operand stack', 'Postfix evaluation'],
    intuition: 'In postfix notation an operator always applies to the two most recent results — a stack fits perfectly: push numbers, and when an operator arrives, pop two, combine, and push the result back.',
    inputOutput: ['tokens: an array of number strings and the operators +, -, *, /.', 'Return the integer value of the expression.', 'Input: ["2","1","+","3","*"]\nOutput: 9, i.e. (2 + 1) * 3'],
    conceptChoices: ['Operand stack', 'Recurse over the token tree', 'Two-pointer token scan'],
    algorithm: ['Keep a stack of operands.', 'For each number token, push it onto the stack.', 'For each operator, pop the two most recent operands.', 'Apply the operator (left operand first) and push the result.', 'Return the value left on the stack.'],
    fixes: ['Pop the right operand before the left — order matters for minus and divide.', 'Convert token strings to numbers before pushing.'],
    complexity: 'Time O(n); space O(n).',
    exercises: [
      { prompt: 'Which line combines the two popped operands and returns the result to the stack?', correct: 'stack.push(ops[token](a, b));', choices: ['stack.push(ops[token](a, b));', 'stack.push(ops[token](b, a));', 'stack.push(a, b);'], why: 'Apply the operator to the left operand a and right operand b in that order, then push the single result.' },
      { prompt: 'For a non-operator token, which line puts the operand on the stack?', correct: 'stack.push(Number(token));', choices: ['stack.push(Number(token));', 'stack.push(token);', 'stack.pop(Number(token));'], why: 'Convert the token string to a number and push it for later operators to use.' },
    ],
    complexityGuide: { work: 'How many times is each token processed?', workChoices: [['once', 'At most once'], ['nested', 'Once per other token']], workCorrect: 'once', workWhy: 'One pass reads each token, and each push or pop is constant time.', memory: 'What extra storage can grow with the input?', memoryChoices: [['stack', 'The operand stack'], ['constant', 'Only a and b']], memoryCorrect: 'stack', memoryWhy: 'A long run of numbers before an operator all sit on the stack.', final: [['linear-linear', 'Time O(n), space O(n)'], ['quadratic-linear', 'Time O(n²), space O(n)'], ['linear-constant', 'Time O(n), space O(1)']], finalCorrect: 'linear-linear' },
  }),
  'Longest Repeating Character Replacement': lesson('Longest Repeating Character Replacement', {
    brief: 'Find the longest substring you can turn into one repeated letter using at most k replacements.',
    concepts: ['Sliding window', 'Most-frequent-char count'],
    intuition: 'A window works if the characters that are not the most common one number at most k (those are the ones you replace) — so grow the window while window size minus the top character count stays within k, and shrink when it does not.',
    inputOutput: ['s: an uppercase string; k: the number of characters you may replace.', 'Return the longest achievable run of one repeated letter.', 'Input: s = "AABABBA", k = 1\nOutput: 4'],
    conceptChoices: ['Sliding window on the majority letter', 'Try each target letter separately', 'Two pointers from both ends'],
    algorithm: ['Count each character in the current window.', 'Expand the right edge, updating counts.', 'Track the highest single-character count in the window.', 'While the window needs more than k replacements, shrink from the left.', 'Record the largest valid window length.'],
    fixes: ['Compare window size minus the top character count against k.', 'A shrinking window can never beat an earlier best, so maxCount need not decrease.'],
    complexity: 'Time O(n); space O(1) (at most 26 counts).',
    exercises: [
      { prompt: 'Which line shrinks the window while it needs more than k replacements?', correct: 'while (right - left + 1 - maxCount > k) {', choices: ['while (right - left + 1 - maxCount > k) {', 'while (right - left + 1 - maxCount < k) {', 'while (right - left + 1 > k) {'], why: 'Window length minus the most frequent character count is how many need replacing; shrink while that exceeds k.' },
      { prompt: 'Which line tracks the highest single-character count in the window?', correct: 'maxCount = Math.max(maxCount, counts.get(s[right]));', choices: ['maxCount = Math.max(maxCount, counts.get(s[right]));', 'maxCount = counts.get(s[right]);', 'maxCount = Math.max(maxCount, right - left);'], why: 'maxCount is the largest frequency of any one character, which sets how many replacements the window needs.' },
    ],
    complexityGuide: { work: 'How many times can each character enter and leave the window?', workChoices: [['once', 'At most once each'], ['nested', 'Once per other character']], workCorrect: 'once', workWhy: 'Both edges move only forward, so each character is added and removed at most once — linear.', memory: 'What bounds the extra storage?', memoryChoices: [['alphabet', 'One count per letter (at most 26)'], ['string', 'A copy of the string']], memoryCorrect: 'alphabet', memoryWhy: 'Only the frequency of each of the 26 uppercase letters is stored.', final: [['linear-constant', 'Time O(n), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['quadratic-constant', 'Time O(n²), space O(1)']], finalCorrect: 'linear-constant' },
  }),
  'Product of Array Except Self': lesson('Product of Array Except Self', {
    brief: 'Return an array where each position holds the product of all the other values, without dividing.',
    concepts: ['Prefix product', 'Suffix product'],
    intuition: 'Each answer is the product of everything to the left times everything to the right — one forward pass builds the left products and one backward pass folds in the right products, so you never need division.',
    inputOutput: ['nums: an integer array (may contain zeros).', 'Return an array where each slot is the product of all other values.', 'Input: nums = [1, 2, 3, 4]\nOutput: [24, 12, 8, 6]'],
    conceptChoices: ['Prefix and suffix products', 'Divide the total product by each value', 'A prefix sum, then subtract'],
    algorithm: ['Fill a result array with ones.', 'Left-to-right pass: set result[i] to the product of everything before i.', 'Right-to-left pass: multiply result[i] by the product of everything after i.', 'Return the result — no division used.'],
    fixes: ['Initialize result with ones so the first prefix multiplies cleanly.', 'Use a second pass for suffixes instead of dividing (division breaks on zeros).'],
    complexity: 'Time O(n); space O(1) beyond the output array.',
    exercises: [
      { prompt: 'In the forward pass, which line stores the running product of everything to the left of i?', correct: 'answer[i] = prefix;', choices: ['answer[i] = prefix;', 'answer[i] = postfix;', 'answer[i] = nums[i];'], why: 'Each slot first holds the product of all elements to its left — the prefix so far.' },
      { prompt: 'In the backward pass, which line grows the running product of everything to the right?', correct: 'postfix *= nums[i];', choices: ['postfix *= nums[i];', 'postfix += nums[i];', 'postfix *= answer[i];'], why: 'postfix accumulates the product of all elements to the right as the scan moves backward.' },
    ],
    complexityGuide: { work: 'How many passes over the array does the algorithm make?', workChoices: [['two', 'Two linear passes'], ['nested', 'A pass for every element']], workCorrect: 'two', workWhy: 'One forward pass for prefixes and one backward pass for suffixes — both linear.', memory: 'Besides the output array, what extra storage grows with the input?', memoryChoices: [['constant', 'Only prefix and suffix accumulators'], ['array', 'A second full array']], memoryCorrect: 'constant', memoryWhy: 'Prefixes are written into the output array and only two running products are kept.', final: [['linear-constant', 'Time O(n), space O(1) extra'], ['quadratic-constant', 'Time O(n²), space O(1)'], ['linear-linear', 'Time O(n), space O(n) extra']], finalCorrect: 'linear-constant' },
  }),
  'Top K Frequent Elements': lesson('Top K Frequent Elements', {
    brief: 'Return the k values that occur most often, in any order.',
    concepts: ['Frequency count', 'Bucket sort by frequency'],
    intuition: 'A value can appear at most n times, so instead of sorting by count, drop each value into a bucket indexed by its frequency and read the buckets from the top down — linear, no heap or sort.',
    inputOutput: ['nums: an integer array; k: how many top values to return.', 'Return the k most frequent values (any order).', 'Input: nums = [1,1,1,2,2,3], k = 2\nOutput: [1, 2]'],
    conceptChoices: ['Bucket values by frequency', 'Sort all values by count', 'A heap of the k largest counts'],
    algorithm: ['Count how many times each value appears.', 'Make buckets indexed by frequency, from 0 to n.', 'Put each value in the bucket for its count.', 'Scan buckets from highest frequency downward, collecting values.', 'Stop once k values are collected.'],
    fixes: ['Index the buckets by frequency, not by value.', 'Frequencies are bounded by n, so bucketing beats an O(n log n) sort.'],
    complexity: 'Time O(n); space O(n).',
    exercises: [
      { prompt: 'Which line tallies how many times each value appears?', correct: 'for (const num of nums) counts.set(num, (counts.get(num) || 0) + 1);', choices: ['for (const num of nums) counts.set(num, (counts.get(num) || 0) + 1);', 'for (const num of nums) counts.set(num, 1);', 'for (const num of nums) counts.set(num, counts.get(num));'], why: 'Increment each value\'s running count, treating a missing value as zero.' },
      { prompt: 'Which line groups values by how frequently they occur?', correct: 'for (const [num, count] of counts) buckets[count].push(num);', choices: ['for (const [num, count] of counts) buckets[count].push(num);', 'for (const [num, count] of counts) buckets[num].push(count);', 'for (const [num, count] of counts) buckets[count] = num;'], why: 'Index the bucket by frequency, so all values sharing a count land together.' },
    ],
    complexityGuide: { work: 'Counting aside, is the bucket phase linear or a sort?', workChoices: [['linear', 'Linear — build and scan buckets'], ['sort', 'An O(n log n) sort']], workCorrect: 'linear', workWhy: 'Counting, filling buckets, and scanning buckets are each linear — no comparison sort.', memory: 'What extra storage grows with the input?', memoryChoices: [['buckets', 'The counts map plus frequency buckets'], ['constant', 'Only k and a loop index']], memoryCorrect: 'buckets', memoryWhy: 'The map holds every distinct value and the buckets span all possible frequencies.', final: [['linear-linear', 'Time O(n), space O(n)'], ['nlogn-linear', 'Time O(n log n), space O(n)'], ['linear-constant', 'Time O(n), space O(1)']], finalCorrect: 'linear-linear' },
  }),
  'Longest Consecutive Sequence': lesson('Longest Consecutive Sequence', {
    brief: 'Find the length of the longest run of consecutive integers in an unsorted array.',
    concepts: ['Hash set membership', 'Counting only from run starts'],
    intuition: 'Only begin counting from a number whose left neighbor is missing — that makes each consecutive run get walked exactly once, so the whole thing is linear despite the inner loop.',
    inputOutput: ['nums: an unsorted integer array.', 'Return the length of the longest consecutive run.', 'Input: nums = [100, 4, 200, 1, 3, 2]\nOutput: 4, from 1,2,3,4'],
    conceptChoices: ['Hash set, counting up from run starts', 'Sort, then scan for runs', 'Two pointers over the array'],
    algorithm: ['Put every number in a set for O(1) lookups.', 'For each number, check whether it starts a run (no predecessor).', 'Skip numbers that are not a run start.', 'From a start, extend forward while the next value exists, counting length.', 'Track the longest run seen.'],
    fixes: ['Only extend from a number whose predecessor is absent.', 'A set gives O(1) membership so the total work stays linear.'],
    complexity: 'Time O(n); space O(n).',
    exercises: [
      { prompt: 'To count each run once, which line skips numbers that are not a run\'s start?', correct: 'if (set.has(n - 1)) continue;', choices: ['if (set.has(n - 1)) continue;', 'if (set.has(n + 1)) continue;', 'if (!set.has(n - 1)) continue;'], why: 'A number starts a run only when n - 1 is absent; if n - 1 exists, skip this number.' },
      { prompt: 'Which line extends the current run forward?', correct: 'while (set.has(n + length)) length++;', choices: ['while (set.has(n + length)) length++;', 'while (set.has(n - length)) length++;', 'while (set.has(n + length)) length--;'], why: 'From the run\'s start, keep growing while the next consecutive value is present.' },
    ],
    complexityGuide: { work: 'The inner while loop looks nested — how many times can it run in total?', workChoices: [['once', 'Each number is extended at most once overall'], ['nested', 'Once for every pair of numbers']], workCorrect: 'once', workWhy: 'Extension only runs from run starts, so each number is counted a single time across its run — linear.', memory: 'What extra storage grows with the input?', memoryChoices: [['set', 'The set of all numbers'], ['constant', 'Only best and length']], memoryCorrect: 'set', memoryWhy: 'The hash set stores every input value for constant-time membership checks.', final: [['linear-linear', 'Time O(n), space O(n)'], ['nlogn-constant', 'Time O(n log n), space O(1)'], ['quadratic-linear', 'Time O(n²), space O(n)']], finalCorrect: 'linear-linear' },
  }),
  'Valid Anagram': lesson('Valid Anagram', {
    brief: 'Given strings s and t, return true when they have the same character frequencies.',
    concepts: ['Character frequency map', 'Count balance'],
    inputOutput: ['s and t: lowercase strings.', 'Return true only when each character count matches.', 'Input: s = "anagram", t = "nagaram"\nOutput: true'],
    conceptChoices: ['Compare character frequency counts', 'Sort both strings and compare', 'Two pointers from each end'],
    algorithm: [
      "Return false immediately if the two strings have different lengths.",
      "Build a map of character to count for every character in s.",
      "Iterate over the characters of t.",
      "Decrement the stored count for the current character.",
      "A count that drops below zero means t has a character s lacks, so return false.",
      "Return true once every character of t is consumed with no shortfall."
    ],
    fixes: ['Check lengths before doing map work.', 'Subtract for t; adding would hide a mismatch.'],
    complexity: 'Time O(n); space O(n) in the general alphabet case.',
    intuition: 'Two anagrams are just the same bag of letters poured out in a different order — so forget the order entirely and only ask whether every letter shows up the same number of times.',
    exercises: [
      { prompt: 'Which line rejects strings that can’t be anagrams before counting?', correct: 'if (s.length !== t.length) return false;', choices: ['if (s.length !== t.length) return false;', 'if (s.length !== t.length) return true;', 'if (s.length === t.length) return false;'], why: 'Unequal lengths cannot have equal character counts.' },
      { prompt: 'Each character of t consumes one available count. Which line?', correct: 'const next = (counts.get(char) || 0) - 1;', choices: ['const next = (counts.get(char) || 0) - 1;', 'const next = (counts.get(char) || 0) + 1;', 'const next = (counts.get(char) || 0) * 1;'], why: 'Subtracting consumes one matching character; a later negative count signals a mismatch.' },
    ],
    complexityGuide: { work: 'Across both loops, how many characters are processed?', workChoices: [['once', 'At most once per character'], ['nested', 'Once for every other character']], workCorrect: 'once', workWhy: 'The two scans are consecutive, so total work is linear.', memory: 'Which storage can grow with distinct characters?', memoryChoices: [['map', 'The frequency map'], ['constant', 'Only char and next']], memoryCorrect: 'map', memoryWhy: 'The map can store every distinct character in s.', final: [['linear-linear', 'Time O(n), space O(n)'], ['quadratic-linear', 'Time O(n²), space O(n)'], ['linear-constant', 'Time O(n), space O(1)']], finalCorrect: 'linear-linear' },
  }),
  'Valid Palindrome': lesson('Valid Palindrome', {
    brief: 'Ignore punctuation and case, then decide whether a string reads the same from both ends.',
    concepts: ['Opposing pointers', 'Alphanumeric normalization'],
    inputOutput: ['s: a string containing letters, digits, and punctuation.', 'Return true when its alphanumeric characters are a palindrome.', 'Input: s = "A man, a plan, a canal: Panama"\nOutput: true'],
    conceptChoices: ['Two pointers moving inward', 'Reverse the string and compare', 'A stack of the first half'],
    algorithm: [
      "Initialize a left pointer at the first character and a right pointer at the last.",
      "Loop while left is less than right.",
      [
        "Advance left past any non-alphanumeric character.",
        "Move right back past any non-alphanumeric character."
      ],
      "Compare the two characters case-insensitively.",
      "A mismatch means it is not a palindrome, so return false.",
      "Otherwise increment left and decrement right to keep scanning inward.",
      "Return true once the pointers meet or cross."
    ],
    fixes: ['Skip punctuation before comparing.', 'Move both pointers only after a match.'],
    complexity: 'Time O(n); space O(1).',
    intuition: 'A palindrome mirrors around its center, so you never need the whole string at once — just walk inward from both ends, skipping anything that is not a letter or digit, and check that each facing pair matches.',
    exercises: [
      { prompt: 'Which line rejects a mismatched mirrored pair?', correct: 'if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;', choices: ['if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;', 'if (s[left].toLowerCase() === s[right].toLowerCase()) return false;', 'if (s[left] !== s[right]) return false;'], why: 'One mismatched alphanumeric pair, compared case-insensitively, disproves the palindrome.' },
      { prompt: 'Which line skips non-alphanumeric characters on the left edge?', correct: 'while (left < right && !/[a-z0-9]/i.test(s[left])) left++;', choices: ['while (left < right && !/[a-z0-9]/i.test(s[left])) left++;', 'while (left < right && /[a-z0-9]/i.test(s[left])) left++;', 'while (left < right && !/[a-z0-9]/i.test(s[right])) left++;'], why: 'Advance left past non-alphanumeric characters, staying in bounds, before comparing.' },
    ],
    complexityGuide: { work: 'How many times can either pointer pass one character?', workChoices: [['once', 'At most once'], ['nested', 'Once for every other character']], workCorrect: 'once', workWhy: 'Pointers only move inward; no character is revisited.', memory: 'What extra storage grows with the input?', memoryChoices: [['constant', 'Only left and right'], ['copy', 'A normalized string copy']], memoryCorrect: 'constant', memoryWhy: 'The original string is compared in place.', final: [['linear-constant', 'Time O(n), space O(1)'], ['quadratic-constant', 'Time O(n²), space O(1)'], ['linear-linear', 'Time O(n), space O(n)']], finalCorrect: 'linear-constant' },
  }),
  'Best Time to Buy and Sell Stock': lesson('Best Time to Buy and Sell Stock', {
    brief: 'Choose an earlier buy day and a later sell day to maximize profit, or return zero.',
    concepts: ['Prefix minimum', 'Greedy best-so-far'],
    inputOutput: ['prices[i]: stock price on day i.', 'Return the greatest legal buy-then-sell profit.', 'Input: [7, 1, 5, 3, 6, 4]\nOutput: 5'],
    conceptChoices: ['Track the lowest price so far', 'Try every buy/sell pair', 'A prefix-max of later prices'],
    algorithm: [
      [
        "Set the lowest price so far to infinity, so the first day's price replaces it.",
        "Set the best profit so far to zero."
      ],
      "Iterate over the prices, treating each as a potential sell day.",
      "Compute today's profit as the price minus the lowest price so far, keeping it if it beats the best.",
      "Update the lowest price with today's price when it is smaller.",
      "Return the best profit after the loop."
    ],
    fixes: ['Compute profit before updating the running minimum.', 'Keep best at zero for a falling market.'],
    complexity: 'Time O(n); space O(1).',
    intuition: 'On any day you could sell, the best you could have done is sell now after buying at the cheapest day so far — so just track the lowest price behind you and the biggest gap it ever opens up.',
    exercises: [
      { prompt: 'Which line records the best profit from selling at today’s price?', correct: 'best = Math.max(best, price - minPrice);', choices: ['best = Math.max(best, price - minPrice);', 'best = Math.max(best, minPrice - price);', 'best = Math.max(best, price - best);'], why: 'Selling today after buying at the cheapest earlier price gives profit price − minPrice.' },
      { prompt: 'Which line keeps the cheapest purchase price for future days?', correct: 'minPrice = Math.min(minPrice, price);', choices: ['minPrice = Math.min(minPrice, price);', 'minPrice = Math.max(minPrice, price);', 'minPrice = price;'], why: 'A future sale needs the smallest earlier price, so keep the running minimum.' },
    ],
    complexityGuide: { work: 'How many price entries are examined?', workChoices: [['once', 'At most once'], ['nested', 'Once for every other price']], workCorrect: 'once', workWhy: 'One loop does constant work per price.', memory: 'What storage grows with prices.length?', memoryChoices: [['constant', 'Only minPrice and best'], ['array', 'A profit for every day']], memoryCorrect: 'constant', memoryWhy: 'Only two running values are kept.', final: [['linear-constant', 'Time O(n), space O(1)'], ['quadratic-constant', 'Time O(n²), space O(1)'], ['linear-linear', 'Time O(n), space O(n)']], finalCorrect: 'linear-constant' },
  }),
  'Min Stack': lesson('Min Stack', {
    brief: 'Design a stack that reports its minimum value without scanning every item.',
    concepts: ['Parallel stack state', 'Minimum at each depth'],
    inputOutput: ['Operations: push, pop, top, getMin.', 'Return the current minimum in constant time.', 'Input: push(-2), push(0), push(-3), getMin()\nOutput: -3'],
    conceptChoices: ['A second stack of running minimums', 'Keep a single min variable', 'Sort the values on getMin'],
    algorithm: [
      [
        "Keep a stack of the actual values.",
        "Keep a parallel stack of running minimums."
      ],
      [
        "On push, add the value to the value stack.",
        "On push, also push the smaller of the value and the current minimum onto the min stack."
      ],
      "On pop, remove the top element from both stacks.",
      "top returns the value stack's top; getMin returns the min stack's top."
    ],
    fixes: ['Store one minimum for every stack depth.', 'Pop both stacks together.'],
    complexity: 'Every operation is O(1); storage is O(n).',
    intuition: 'You cannot afford to hunt for the minimum on demand, so remember it as you go: at every push record the smallest value seen up to that depth, and popping simply uncovers the minimum that came before.',
    exercises: [
      { prompt: 'On push, which line keeps the running minimum correct at the new depth?', correct: 'minStack.push(Math.min(val, minStack.at(-1)));', choices: ['minStack.push(Math.min(val, minStack.at(-1)));', 'minStack.push(Math.min(val, stack.at(-1)));', 'minStack.push(val);'], why: 'Compare the new value with the previous minimum, which sits on top of minStack.' },
      { prompt: 'Which line returns the current minimum in O(1)?', correct: 'getMin() { return this.minStack.at(-1); }', choices: ['getMin() { return this.minStack.at(-1); }', 'getMin() { return this.stack.at(-1); }', 'getMin() { return Math.min(...this.stack); }'], why: 'The current minimum is kept on top of minStack, so getMin just reads that top.' },
    ],
    complexityGuide: { work: 'How much scanning does getMin perform?', workChoices: [['constant', 'It reads one top value'], ['linear', 'It scans all values']], workCorrect: 'constant', workWhy: 'The minimum is maintained at the top of minStack.', memory: 'What extra storage can grow with pushes?', memoryChoices: [['stack', 'One minimum record per depth'], ['constant', 'Only one global minimum']], memoryCorrect: 'stack', memoryWhy: 'minStack mirrors every item in the main stack.', final: [['constant-linear', 'Time O(1) per operation, space O(n)'], ['linear-constant', 'Time O(n) per operation, space O(1)'], ['constant-constant', 'Time O(1) per operation, space O(1)']], finalCorrect: 'constant-linear' },
  }),
  'Maximum Depth of Binary Tree': lesson('Maximum Depth of Binary Tree', {
    brief: 'Return the number of nodes on the longest path from the root down to a leaf.',
    concepts: ['Recursive subtree depth', 'DFS base case'],
    inputOutput: ['root: the root of a binary tree.', 'Return the maximum root-to-leaf node count.', 'Input: [3,9,20,null,null,15,7]\nOutput: 3'],
    conceptChoices: ['1 + the deeper subtree', 'Count all the nodes', 'Follow only the left spine'],
    algorithm: [
      "Define one call to return the depth of the subtree rooted at a node.",
      "Base case: an empty node has depth 0.",
      [
        "Recursively compute the left child's depth.",
        "Recursively compute the right child's depth."
      ],
      "Take the larger of the two child depths — the longer branch wins.",
      "Add 1 for the current node and return this subtree's depth."
    ],
    fixes: ['Use zero for an empty subtree.', 'Recurse into both children before choosing the larger depth.'],
    complexity: 'Time O(n); space O(h) for recursion height h.',
    intuition: 'A tree’s depth is nothing more than one step plus the depth of its taller side — so let each node ask its two children how deep they are and add itself on top.',
    exercises: [
      { prompt: 'Which line returns this node’s depth from its children’s depths?', correct: 'return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));', choices: ['return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));', 'return 1 + Math.min(maxDepth(root.left), maxDepth(root.right));', 'return Math.max(maxDepth(root.left), maxDepth(root.right));'], why: 'A node’s depth is one more than the depth of its deeper child.' },
      { prompt: 'Which line gives an empty subtree its depth?', correct: 'if (!root) return 0;', choices: ['if (!root) return 0;', 'if (!root) return 1;', 'if (!root) return null;'], why: 'An empty subtree has depth zero, which lets a leaf become depth one.' },
    ],
    complexityGuide: { work: 'How many times is each real node visited?', workChoices: [['once', 'At most once'], ['nested', 'Once for every other node']], workCorrect: 'once', workWhy: 'Each call handles its node once, then moves only to children.', memory: 'What grows with a very tall tree?', memoryChoices: [['stack', 'The recursion call stack'], ['constant', 'Only two child depths']], memoryCorrect: 'stack', memoryWhy: 'Calls remain active along a root-to-leaf path of height h.', final: [['linear-height', 'Time O(n), space O(h)'], ['quadratic-height', 'Time O(n²), space O(h)'], ['linear-constant', 'Time O(n), space O(1)']], finalCorrect: 'linear-height' },
  }),
  'Group Anagrams': lesson('Group Anagrams', {
    brief: 'Group strings together when they contain the same letters in a different order.',
    concepts: ['Canonical anagram signature', 'Hash map grouping'],
    inputOutput: ['strs: an array of lowercase strings.', 'Return groups where every string in a group is an anagram.', 'Input: ["eat","tea","tan","ate","nat","bat"]\nOutput: [["eat","tea","ate"],["tan","nat"],["bat"]]'],
    conceptChoices: ['Bucket by a canonical letter key', 'Compare every pair for anagrams', 'Sort the whole list of words'],
    algorithm: [
      "Keep a map from a sorted-letter key to the list of words that share it.",
      "Iterate over the words.",
      "Sort the current word's letters to form its key - anagrams produce the same key.",
      "Create an empty group for that key if none exists yet.",
      "Append the word to the group stored under that key.",
      "After the loop, return all the groups (the map's values)."
    ],
    fixes: ['Use the sorted letters as the key, not the original word.', 'Store the original word in its group.'],
    complexity: 'Time O(n · k log k); space O(n · k), where k is a word length.',
    intuition: 'Every anagram of a word collapses to the same fingerprint when you sort its letters — so use that sorted-letter fingerprint as a bucket label and drop each word into its matching bucket.',
    exercises: [
      { prompt: 'Which line builds one stable key shared by all anagrams of word?', correct: "const key = [...word].sort().join('');", choices: ["const key = [...word].sort().join('');", 'const key = [...word].sort();', "const key = word.join('');"], why: 'Sorting the letters and joining them yields the same string for every anagram.' },
      { prompt: 'Which line adds the word to the group for its signature?', correct: 'groups.get(key).push(word);', choices: ['groups.get(key).push(word);', 'groups.set(key, word);', 'groups.get(word).push(key);'], why: 'Append the original word to the bucket keyed by its sorted-letter signature.' },
    ],
    complexityGuide: { work: 'What dominates work for each word of length k?', workChoices: [['sort', 'Sorting its k characters'], ['constant', 'One constant-time comparison']], workCorrect: 'sort', workWhy: 'Creating the canonical key requires sorting each word.', memory: 'What grows with all input characters?', memoryChoices: [['groups', 'The grouped output map'], ['constant', 'Only key']], memoryCorrect: 'groups', memoryWhy: 'The map keeps every word in an output group.', final: [['n-klogk', 'Time O(n · k log k), space O(n · k)'], ['linear-constant', 'Time O(n), space O(1)'], ['quadratic-linear', 'Time O(n²), space O(n)']], finalCorrect: 'n-klogk' },
  }),
  '3Sum': lesson('3Sum', {
    brief: 'Return every unique triple in an integer array whose values add to zero.',
    concepts: ['Sorted input', 'Fixed value plus two pointers'],
    inputOutput: ['nums: an integer array.', 'Return all unique triples [a, b, c] with a + b + c = 0.', 'Input: [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]'],
    conceptChoices: ['Sort, then two pointers per anchor', 'A hash set of complements per anchor', 'Three nested loops'],
    algorithm: [
      "Sort nums so equal values sit next to each other.",
      "Fix the first value at index i, scanning i across the array.",
      "Skip a fixed value equal to the previous one to avoid duplicate triplets.",
      "Set a left pointer just after i and a right pointer at the last index.",
      "Loop while left is less than right, summing the three chosen values.",
      [
        "A sum below zero needs a larger value, so increment left.",
        "A sum above zero needs a smaller value, so decrement right.",
        {
          "seq": [
            "A sum of zero records the triplet.",
            "Advance both pointers past any duplicate values before continuing."
          ]
        }
      ]
    ],
    fixes: ['Skip repeated fixed values with continue.', 'Move both pointers after storing a valid triple.'],
    complexity: 'Time O(n²); space O(1) beyond the result, excluding sort implementation.',
    intuition: 'Lock one number in place and the puzzle shrinks to finding two others that cancel it out — and once the array is sorted, those two can be squeezed in from both ends while duplicates are quietly skipped.',
    exercises: [
      { prompt: 'Which line skips a repeated fixed value while keeping later distinct ones?', correct: 'if (i > 0 && nums[i] === nums[i - 1]) continue;', choices: ['if (i > 0 && nums[i] === nums[i - 1]) continue;', 'if (i > 0 && nums[i] === nums[i - 1]) break;', 'if (i > 0 && nums[i] === nums[i - 1]) return [];'], why: 'continue skips just this duplicate fixed value while later distinct ones still run.' },
      { prompt: 'The array is sorted. Which line reacts to a sum below zero?', correct: 'if (sum < 0) left++;', choices: ['if (sum < 0) left++;', 'if (sum < 0) right--;', 'if (sum < 0) left--;'], why: 'A too-small sum needs a larger value, so move left rightward.' },
    ],
    complexityGuide: { work: 'For each fixed i, how do left and right move?', workChoices: [['once', 'Across the remaining suffix once'], ['nested', 'Across the suffix for every pointer position']], workCorrect: 'once', workWhy: 'Both pointers move inward without resetting for that i.', memory: 'What auxiliary structure grows with n after sorting?', memoryChoices: [['constant', 'Only indexes and sum'], ['map', 'A map of every value']], memoryCorrect: 'constant', memoryWhy: 'The pair search uses the sorted array directly.', final: [['quadratic-constant', 'Time O(n²), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['cubic-constant', 'Time O(n³), space O(1)']], finalCorrect: 'quadratic-constant' },
  }),
  'Daily Temperatures': lesson('Daily Temperatures', {
    brief: 'For every day, report how many days pass until a warmer temperature occurs.',
    concepts: ['Monotonic decreasing stack', 'Unresolved indexes'],
    inputOutput: ['temperatures: daily temperature values.', 'Return waiting days for a warmer temperature, or zero.', 'Input: [73,74,75,71,69,72,76,73]\nOutput: [1,1,4,2,1,1,0,0]'],
    conceptChoices: ['A decreasing stack of day indexes', 'For each day, scan ahead for a warmer one', 'Sort the days by temperature'],
    algorithm: [
      [
        "Create a result array of zeros, one entry per day.",
        "Keep a stack of day indices whose warmer day is still unknown."
      ],
      "Iterate over the days by index i.",
      "While the stack is nonempty and day i is warmer than the day at the top of the stack, resolve that earlier day.",
      "Pop that earlier index and set its result to i minus that index - the days waited.",
      "Push the current index i as still unresolved.",
      "Return the result array."
    ],
    fixes: ['Store indexes so a waiting distance can be computed.', 'Pop while today is warmer, not just once.'],
    complexity: 'Time O(n); space O(n).',
    intuition: 'Each cooler day is just waiting for the next warmer one, so stack up the unresolved days and let a warm day reach back and settle every colder day still waiting on top of the stack.',
    exercises: [
      { prompt: 'Which line records how long the earlier day waited?', correct: 'result[prev] = i - prev;', choices: ['result[prev] = i - prev;', 'result[prev] = prev - i;', 'result[prev] = i + prev;'], why: 'Today (i) is the first warmer day after prev, so the wait is i − prev.' },
      { prompt: 'Which line keeps today’s index unresolved for a later warmer day?', correct: 'stack.push(i);', choices: ['stack.push(i);', 'stack.pop();', 'stack.push(prev);'], why: 'Push today’s index so a future warmer day can resolve it.' },
    ],
    complexityGuide: { work: 'How many times can one index be pushed and popped?', workChoices: [['once', 'At most once each'], ['nested', 'Once for every later day']], workCorrect: 'once', workWhy: 'An index enters once and leaves once when resolved.', memory: 'What can grow during a long cooling streak?', memoryChoices: [['stack', 'The unresolved-index stack'], ['constant', 'Only i and prev']], memoryCorrect: 'stack', memoryWhy: 'Every unresolved day remains on the stack.', final: [['linear-linear', 'Time O(n), space O(n)'], ['quadratic-linear', 'Time O(n²), space O(n)'], ['linear-constant', 'Time O(n), space O(1)']], finalCorrect: 'linear-linear' },
  }),
  'Merge Two Sorted Lists': lesson('Merge Two Sorted Lists', {
    brief: 'Merge two already-sorted linked lists by relinking their existing nodes.',
    concepts: ['Linked-list tail pointer', 'Sorted merge invariant'],
    inputOutput: ['list1 and list2: heads of sorted linked lists.', 'Return one sorted list containing all original nodes.', 'Input: 1→2→4 and 1→3→4\nOutput: 1→1→2→3→4→4'],
    conceptChoices: ['Splice nodes with a tail pointer', 'Collect all nodes and sort', 'Recurse on the smaller head'],
    algorithm: [
      "Create a dummy head node and set a tail pointer to it.",
      "Loop while both lists still have nodes.",
      [
        {
          "seq": [
            "When list1's value is less than or equal to list2's, attach list1's node to tail.",
            "Advance list1 to its next node."
          ]
        },
        {
          "seq": [
            "Otherwise attach list2's node to tail.",
            "Advance list2 to its next node."
          ]
        }
      ],
      "Advance tail to the node just attached.",
      "After the loop, attach whichever list still has remaining nodes.",
      "Return dummy.next, the head of the merged list."
    ],
    fixes: ['Advance only the list whose node was attached.', 'Return dummy.next so the sentinel is excluded.'],
    complexity: 'Time O(m + n); space O(1).',
    intuition: 'Because both lists are already sorted, the next node of the merged list is always the smaller of the two current heads — so keep a tail pointer and repeatedly snap on whichever front node is smaller.',
    exercises: [
      { prompt: 'After attaching a node, which line advances the tail?', correct: 'tail = tail.next;', choices: ['tail = tail.next;', 'tail = tail.val;', 'tail = dummy;'], why: 'tail must move to the node just attached so the next one links onto the end.' },
      { prompt: 'One list runs out first. Which line appends the leftover nodes?', correct: 'tail.next = list1 || list2;', choices: ['tail.next = list1 || list2;', 'tail.next = list1 && list2;', 'tail.next = null;'], why: 'Whichever list still has nodes is already sorted, so attach it whole.' },
    ],
    complexityGuide: { work: 'How often can a node move from an input list to the merged list?', workChoices: [['once', 'At most once'], ['nested', 'Once for every node in the other list']], workCorrect: 'once', workWhy: 'Each comparison attaches exactly one new node and advances it permanently.', memory: 'What extra storage grows with the lists?', memoryChoices: [['constant', 'Only dummy and tail references'], ['array', 'A copy of all node values']], memoryCorrect: 'constant', memoryWhy: 'Existing nodes are relinked in place.', final: [['linear-constant', 'Time O(m + n), space O(1)'], ['quadratic-constant', 'Time O(mn), space O(1)'], ['linear-linear', 'Time O(m + n), space O(m + n)']], finalCorrect: 'linear-constant' },
  }),
  'Climbing Stairs': lesson('Climbing Stairs', {
    brief: 'Count the distinct ways to climb n steps when each move is one or two steps.',
    concepts: ['One-dimensional dynamic programming', 'Fibonacci recurrence'],
    inputOutput: ['n: number of stairs.', 'Return the number of one-step/two-step sequences that reach n.', 'Input: n = 4\nOutput: 5'],
    conceptChoices: ['Build on the previous two counts', 'Enumerate every 1/2-step sequence', 'Greedily take 2-steps first'],
    algorithm: [
      "Keep two running counts: the number of ways to reach the previous step and the step before it, both initialized to one.",
      "Iterate from step 2 through n.",
      "Compute the ways to reach the current step as the sum of the two previous counts.",
      "Shift the two counts forward so they describe the latest two steps.",
      "Return the count corresponding to step n."
    ],
    fixes: ['Add the two legal previous states.', 'Update both saved states after computing current.'],
    complexity: 'Time O(n); space O(1).',
    intuition: 'You reach any step from either one or two steps below, so the number of ways to a step is simply the sum of the ways to the two steps beneath it — the Fibonacci pattern in disguise.',
    exercises: [
      { prompt: 'Which line combines the two previous step counts?', correct: 'const current = one + two;', choices: ['const current = one + two;', 'const current = one * two;', 'const current = Math.max(one, two);'], why: 'The two disjoint ways to arrive — a one-step or a two-step move — are added.' },
      { prompt: 'Which line shifts the older saved state forward?', correct: 'two = one;', choices: ['two = one;', 'two = current;', 'two = one + two;'], why: 'The previous one-step-back state becomes two steps back for the next iteration.' },
    ],
    complexityGuide: { work: 'How many loop iterations occur as n grows?', workChoices: [['once', 'One per stair after the base cases'], ['nested', 'One for every earlier stair']], workCorrect: 'once', workWhy: 'The loop advances one stair per iteration.', memory: 'What state grows with n?', memoryChoices: [['constant', 'Only one, two, and current'], ['array', 'A table for every stair']], memoryCorrect: 'constant', memoryWhy: 'The recurrence is compressed to two prior values.', final: [['linear-constant', 'Time O(n), space O(1)'], ['quadratic-constant', 'Time O(n²), space O(1)'], ['linear-linear', 'Time O(n), space O(n)']], finalCorrect: 'linear-constant' },
  }),
  'Course Schedule': lesson('Course Schedule', {
    brief: 'Determine whether every course can be completed given prerequisite pairs.',
    concepts: ['Directed graph', 'Indegree topological traversal'],
    inputOutput: ['numCourses and prerequisite pairs [course, prerequisite].', 'Return true when no prerequisite cycle prevents completion.', 'Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true'],
    conceptChoices: ['Peel off zero-prerequisite courses (topological sort)', 'DFS to detect a cycle', 'Union-find on prerequisites'],
    algorithm: [
      [
        "Build a directed edge from each prerequisite to the course that depends on it.",
        "Count each course's number of prerequisites (its indegree)."
      ],
      "Seed a queue with every course whose indegree is zero.",
      "Process each queued course, decrementing the indegree of every course that depends on it.",
      "When a dependent course's indegree drops to zero, add it to the queue.",
      "Every course is finishable exactly when the queue processes all of them."
    ],
    fixes: ['Decrease a dependent’s indegree after completing one prerequisite.', 'Enqueue a course only when its indegree reaches zero.'],
    complexity: 'Time O(V + E); space O(V + E).',
    intuition: 'A schedule is impossible only when prerequisites form a cycle, so keep peeling off courses that currently have no prerequisites left; if everything eventually peels away, no cycle was hiding in there.',
    exercises: [
      { prompt: 'While building the graph, which line counts a prerequisite for a course?', correct: 'indegree[course] += 1;', choices: ['indegree[course] += 1;', 'indegree[prereq] += 1;', 'indegree[course] -= 1;'], why: 'Each prerequisite pair adds one incoming edge to the dependent course.' },
      { prompt: 'Which line enqueues a course once its prerequisites are gone?', correct: 'if (indegree[nextCourse] === 0) queue.push(nextCourse);', choices: ['if (indegree[nextCourse] === 0) queue.push(nextCourse);', 'if (indegree[nextCourse] > 0) queue.push(nextCourse);', 'if (indegree[course] === 0) queue.push(nextCourse);'], why: 'A course is ready exactly when its remaining prerequisite count reaches zero.' },
    ],
    complexityGuide: { work: 'How often can an edge be removed during the traversal?', workChoices: [['once', 'At most once'], ['nested', 'Once for every other edge']], workCorrect: 'once', workWhy: 'Each prerequisite edge is processed only when its source course leaves the queue.', memory: 'Which representation grows with courses and prerequisites?', memoryChoices: [['graph', 'Adjacency list and indegree array'], ['constant', 'Only the queue head']], memoryCorrect: 'graph', memoryWhy: 'The graph stores every prerequisite relationship.', final: [['graph-graph', 'Time O(V + E), space O(V + E)'], ['quadratic-constant', 'Time O(V²), space O(1)'], ['linear-constant', 'Time O(V), space O(1)']], finalCorrect: 'graph-graph' },
  }),
  'Diameter of Binary Tree': lesson('Diameter of Binary Tree', {
    brief: 'Find the largest number of edges on any path between two nodes in a binary tree.',
    concepts: ['Postorder DFS', 'Subtree height plus global answer'],
    inputOutput: ['root: a binary tree root.', 'Return the longest path length measured in edges.', 'Input: [1,2,3,4,5]\nOutput: 3'],
    conceptChoices: ['Left height + right height at each node', 'The depth of the whole tree', 'The longest root-to-leaf path'],
    algorithm: [
      "Track the best diameter found so far, starting at zero.",
      "Define a height helper; an empty node has height zero - the base case.",
      [
        "Recursively compute the left child's height.",
        "Recursively compute the right child's height."
      ],
      "Update the best diameter with left height plus right height - the path bending through this node.",
      "Return one plus the larger child height as this node's height.",
      "Run the helper from the root, then return the best diameter."
    ],
    fixes: ['Update best with both child paths, not only the larger one.', 'Return height upward while keeping diameter global.'],
    complexity: 'Time O(n); space O(h) for recursion height h.',
    intuition: 'The longest path might bend through any node, joining its deepest left reach to its deepest right reach — so as you compute each node’s height, quietly track the best left-plus-right total you ever see.',
    exercises: [
      { prompt: 'Which line updates the best path turning through this node?', correct: 'best = Math.max(best, left + right);', choices: ['best = Math.max(best, left + right);', 'best = Math.max(best, Math.max(left, right));', 'best = Math.max(best, left * right);'], why: 'A path turning through a node joins both child paths, so their edge counts add.' },
      { prompt: 'Which line returns this node’s height to its parent?', correct: 'return 1 + Math.max(left, right);', choices: ['return 1 + Math.max(left, right);', 'return 1 + Math.min(left, right);', 'return 1 + left + right;'], why: 'A node’s height is one plus the height of its deeper child.' },
    ],
    complexityGuide: { work: 'How many times is each node’s height computed?', workChoices: [['once', 'At most once'], ['nested', 'Once for every ancestor']], workCorrect: 'once', workWhy: 'Postorder computes each subtree result once and returns it upward.', memory: 'What can grow with a skewed tree?', memoryChoices: [['stack', 'The recursion call stack'], ['constant', 'Only left and right']], memoryCorrect: 'stack', memoryWhy: 'One call remains active per node along the deepest path.', final: [['linear-height', 'Time O(n), space O(h)'], ['quadratic-height', 'Time O(n²), space O(h)'], ['linear-constant', 'Time O(n), space O(1)']], finalCorrect: 'linear-height' },
  }),
  'Kth Largest Element in an Array': lesson('Kth Largest Element in an Array', {
    brief: 'Return the kth largest value in an unsorted array without fully sorting it.',
    concepts: ['Quickselect partition', 'Target sorted index'],
    inputOutput: ['nums: unsorted integers; k: a positive rank.', 'Return the kth largest value.', 'Input: nums = [3,2,1,5,6,4], k = 2\nOutput: 5'],
    conceptChoices: ['Quickselect around a pivot', 'Sort fully, then take index k', 'A min-heap of size k'],
    algorithm: [
      "The kth largest sits at ascending index n - k, so make that the target index.",
      "Maintain a left and right boundary over the current search range.",
      "Loop while left is less than or equal to right, choosing a pivot within the range.",
      "Partition the range so values at most the pivot go left and larger values go right.",
      "Place the pivot at its final sorted position between the two sides.",
      [
        "A pivot position equal to the target means the pivot is the answer, so return it.",
        "A pivot position below the target means the answer is further right, so search the right side.",
        "A pivot position above the target means the answer is further left, so search the left side."
      ]
    ],
    fixes: ['Use nums.length - k for the ascending target index.', 'Narrow only one partition after each pivot.'],
    complexity: 'Average time O(n); worst-case O(n²); space O(1) iterative.',
    intuition: 'You do not need the whole array sorted — only the value that would land in one particular slot. Partitioning drops a pivot into its final sorted position, so you just keep chasing whichever side still hides that slot.',
    exercises: [
      { prompt: 'Which line converts rank k to the ascending target index?', correct: 'const target = nums.length - k;', choices: ['const target = nums.length - k;', 'const target = k;', 'const target = nums.length - k - 1;'], why: 'The kth-largest value sits at ascending index n − k after partitioning.' },
      { prompt: 'The pivot is left of target. Which line narrows the search rightward?', correct: 'if (pivotIndex < target) left = pivotIndex + 1;', choices: ['if (pivotIndex < target) left = pivotIndex + 1;', 'if (pivotIndex < target) left = pivotIndex - 1;', 'if (pivotIndex < target) right = pivotIndex + 1;'], why: 'The target is past this pivot, so start the next search just after it.' },
    ],
    complexityGuide: { work: 'After partitioning, how much of the array is kept?', workChoices: [['one-side', 'Only the side containing target'], ['both-sides', 'Both partitions']], workCorrect: 'one-side', workWhy: 'Quickselect discards the partition proven not to contain the target.', memory: 'What storage is created by this iterative partition loop?', memoryChoices: [['constant', 'A fixed set of indexes and pivot values'], ['array', 'A sorted copy']], memoryCorrect: 'constant', memoryWhy: 'It swaps inside nums rather than creating another array.', final: [['average-linear', 'Average time O(n), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['quadratic-constant', 'Always time O(n²), space O(1)']], finalCorrect: 'average-linear' },
  }),
  'Coin Change': lesson('Coin Change', {
    brief: 'Return the fewest coins needed to make an amount, or -1 when no combination can make it.',
    concepts: ['One-dimensional dynamic programming', 'Best prior amount'],
    inputOutput: ['coins: denominations; amount: target total.', 'Return the minimum number of coins, or -1.', 'Input: coins = [1,2,5], amount = 11\nOutput: 3'],
    conceptChoices: ['Fewest coins built up per amount', 'Greedily take the largest coin first', 'Recurse over every combination'],
    algorithm: [
      "Create a dp array over amounts 0 through target, filled with infinity to mean unreachable.",
      "Set dp[0] to zero - zero coins make amount zero.",
      "Iterate over every amount from 1 to the target.",
      "For each coin no larger than the current amount, consider using it.",
      "Set dp[amount] to the smaller of its current value and dp[amount - coin] + 1.",
      "After the loop, return dp[target], or -1 if it is still infinity."
    ],
    fixes: ['Initialize unreachable amounts above any possible answer.', 'Add one for the coin chosen last.'],
    complexity: 'Time O(amount · number of coins); space O(amount).',
    intuition: 'The fewest coins for an amount is just one more coin than the best you could do for some smaller amount — so build answers up from zero, and any amount you can never reach stays flagged impossible.',
    exercises: [
      { prompt: 'Which line sets the base case that every amount builds on?', correct: 'dp[0] = 0;', choices: ['dp[0] = 0;', 'dp[0] = 1;', 'dp[0] = Infinity;'], why: 'Making amount 0 takes zero coins; every larger amount is derived from it.' },
      { prompt: 'Which line reports an amount that no combination of coins can make?', correct: 'return dp.at(-1) === Infinity ? -1 : dp.at(-1);', choices: ['return dp.at(-1) === Infinity ? -1 : dp.at(-1);', 'return dp.at(-1);', 'return dp.at(-1) === 0 ? -1 : dp.at(-1);'], why: 'A leftover Infinity means the amount was never reached, so return -1.' },
    ],
    complexityGuide: { work: 'For each amount, what set is tried?', workChoices: [['coins', 'Every coin denomination'], ['constant', 'Only one coin']], workCorrect: 'coins', workWhy: 'Each state checks every denomination that could be used last.', memory: 'What grows with the target amount?', memoryChoices: [['dp', 'The dp array of amounts'], ['constant', 'Only coin and amount']], memoryCorrect: 'dp', memoryWhy: 'dp stores one best answer per amount through target.', final: [['amount-coins', 'Time O(amount · coins), space O(amount)'], ['linear-constant', 'Time O(amount), space O(1)'], ['quadratic-linear', 'Time O(amount²), space O(amount)']], finalCorrect: 'amount-coins' },
  }),
  'Distinct Subsequences': lesson('Distinct Subsequences', {
    brief: 'Count how many distinct ways target can be formed as a subsequence of source string s.',
    concepts: ['Dynamic-programming prefix count', 'Backward iteration'],
    inputOutput: ['s: source string; t: target string.', 'Return the number of subsequences of s equal to t.', 'Input: s = "rabbbit", t = "rabbit"\nOutput: 3'],
    conceptChoices: ['Count matches with a DP table', 'Two pointers over both strings', 'Generate every subsequence'],
    algorithm: [
      "Create dp over indices 0 through t.length, where dp[j] counts ways to spell t's first j characters.",
      "Initialize dp[0] to one - the empty target is spelled exactly one way - and the rest to zero.",
      "Iterate over each character of the source string s.",
      "For that source character, iterate j downward from t.length to 1.",
      "When the source character equals t[j - 1], add dp[j - 1] into dp[j].",
      "Return dp[t.length], the count of distinct subsequences."
    ],
    fixes: ['Iterate j backward so one source character is used once.', 'Keep dp[0] equal to one as the empty-prefix base case.'],
    complexity: 'Time O(|s| · |t|); space O(|t|).',
    intuition: 'Carry, for each target prefix, how many ways it can be spelled so far — every time a source character matches, it lets every shorter match grow by one, so the counts flow forward through the source string.',
    exercises: [
      { prompt: 'Which line seeds the one way to form the empty target?', correct: 'dp[0] = 1;', choices: ['dp[0] = 1;', 'dp[0] = 0;', 'dp[t.length] = 1;'], why: 'There is exactly one way to form the empty target — the base every count builds on.' },
      { prompt: 'Which line walks the target backward so a source char is used once per step?', correct: 'for (let j = t.length; j >= 1; j--) {', choices: ['for (let j = t.length; j >= 1; j--) {', 'for (let j = 1; j <= t.length; j++) {', 'for (let j = t.length; j >= 0; j--) {'], why: 'Iterating j downward keeps one source character from extending the same prefix twice.' },
    ],
    complexityGuide: { work: 'For each source character, which target positions can be visited?', workChoices: [['target', 'Every target position'], ['constant', 'Only one target position']], workCorrect: 'target', workWhy: 'The inner loop considers every possible target-prefix extension.', memory: 'What grows with the target length?', memoryChoices: [['dp', 'The dp count array'], ['constant', 'Only j']], memoryCorrect: 'dp', memoryWhy: 'There is one count for each target prefix.', final: [['source-target', 'Time O(|s| · |t|), space O(|t|)'], ['linear-constant', 'Time O(|s|), space O(1)'], ['quadratic-linear', 'Time O(|s|²), space O(|t|)']], finalCorrect: 'source-target' },
  }),
  'Single Number': lesson('Single Number', {
    brief: 'Every value appears twice except one; find the single value using O(1) extra space.',
    concepts: ['XOR cancellation', 'Bit manipulation'],
    intuition: 'XOR of a number with itself is 0, and XOR with 0 leaves the number unchanged — so XORing the whole array cancels every value that appears twice and leaves only the lone one.',
    inputOutput: ['nums: an array where every value appears twice except one.', 'Return the value that appears only once.', 'Input: nums = [4, 1, 2, 1, 2]\nOutput: 4'],
    conceptChoices: ['XOR all the values together', 'A hash map of counts', 'Sort, then scan for the loner'],
    algorithm: ['Start a running result at 0.', 'XOR each value into the result.', 'Every duplicated pair cancels to 0.', 'The value left in the result is the single one.'],
    fixes: ['Use XOR (^), not addition — only XOR makes the pairs cancel.', 'Start the accumulator at 0 so it does not disturb the first value.'],
    complexity: 'Time O(n); space O(1).',
    exercises: [
      { prompt: 'Which line folds each value into the running XOR?', correct: 'result ^= n;', choices: ['result ^= n;', 'result += n;', 'result |= n;'], why: 'XOR cancels any value seen an even number of times, leaving only the value seen once.', wrong: { 'result += n;': 'Adding sums the whole array; it does not isolate the unique value.', 'result |= n;': 'OR only ever sets bits, so duplicates never cancel out.' } },
    ],
    complexityGuide: { work: 'How many times is each value processed?', workChoices: [['once', 'A single pass'], ['nested', 'A pass per element']], workCorrect: 'once', workWhy: 'One XOR per element, each constant time.', memory: 'What extra storage is needed?', memoryChoices: [['constant', 'One integer accumulator'], ['linear', 'A count for every value']], memoryCorrect: 'constant', memoryWhy: 'Only the running result is kept.', final: [['linear-constant', 'Time O(n), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['quadratic-constant', 'Time O(n²), space O(1)']], finalCorrect: 'linear-constant' },
  }),
  'Plus One': lesson('Plus One', {
    brief: 'Add one to a number stored as an array of digits, handling the carry.',
    concepts: ['Digit carry', 'In-place array update'],
    intuition: 'Adding one only ripples a carry through trailing 9s — walk from the last digit and stop as soon as a digit stays below 9; if every digit was a 9, a new leading 1 appears.',
    inputOutput: ['digits: a non-empty array of decimal digits, most significant first.', 'Return the digit array representing the number plus one.', 'Input: digits = [1, 2, 3]\nOutput: [1, 2, 4]'],
    conceptChoices: ['Ripple a carry from the last digit', 'Convert to a number, add, convert back', 'Two pointers from both ends'],
    algorithm: ['Walk the digits from last to first.', 'If a digit is below 9, increment it and return — there is no carry.', 'Otherwise set it to 0 (it carried) and keep going.', 'If every digit carried, prepend a leading 1.'],
    fixes: ['Iterate from the LAST digit so the carry ripples in the right direction.', 'A carry out of the most significant digit needs a brand-new leading 1.'],
    complexity: 'Time O(n); space O(1) (a new digit is prepended only for all-9s input).',
    exercises: [
      { prompt: 'Which line detects a digit that can be bumped without carrying?', correct: 'if (digits[i] < 9) {', choices: ['if (digits[i] < 9) {', 'if (digits[i] <= 9) {', 'if (digits[i] > 9) {'], why: 'A digit below 9 can be incremented directly, so we bump it and return.', wrong: { 'if (digits[i] <= 9) {': 'A 9 does carry (it becomes 10), so <= 9 would wrongly increment it in place.', 'if (digits[i] > 9) {': 'Digits are never above 9, so this branch never runs.' } },
      { prompt: 'Which line handles a number of all 9s carrying out a new digit?', correct: 'return [1, ...digits];', choices: ['return [1, ...digits];', 'return [...digits, 1];', 'return digits;'], why: 'When every digit was a 9 they all became 0, so a leading 1 is prepended.', wrong: { 'return [...digits, 1];': 'That appends 1 at the end; the carry belongs at the front.', 'return digits;': 'Without the leading 1, [9, 9] would wrongly return [0, 0].' } },
    ],
    complexityGuide: { work: 'How many digits are touched in the worst case?', workChoices: [['once', 'Each digit at most once'], ['nested', 'Each digit repeatedly']], workCorrect: 'once', workWhy: 'One backward pass that stops early once a digit does not carry.', memory: 'What extra space is used?', memoryChoices: [['constant', 'It updates in place'], ['linear', 'A whole second array']], memoryCorrect: 'constant', memoryWhy: 'The array is mutated in place; only all-9s input adds one digit.', final: [['linear-constant', 'Time O(n), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['constant-constant', 'Time O(1), space O(1)']], finalCorrect: 'linear-constant' },
  }),
  'Min Cost Climbing Stairs': lesson('Min Cost Climbing Stairs', {
    brief: 'Reach the top of the stairs for the least total cost, stepping one or two stairs at a time.',
    concepts: ['1-D dynamic programming', 'Rolling state'],
    intuition: 'The cheapest way to stand on a stair is that stair’s own cost plus the cheaper of the two running totals just below it — so carry the last two totals forward, and the answer is the cheaper of the final two.',
    inputOutput: ['cost[i]: the cost of stepping on stair i; you may start at stair 0 or 1.', 'Return the minimum total cost to step past the top stair.', 'Input: cost = [10, 15, 20]\nOutput: 15'],
    conceptChoices: ['Cheapest cost to reach each stair (DP)', 'Greedily take the cheaper next stair', 'Try every path recursively'],
    algorithm: ['Keep the min cost to stand on the previous two stairs (both start at 0).', 'For each stair, add its cost to the cheaper of those two totals.', 'Slide the two running totals forward.', 'The answer is the cheaper of the final two totals — you can reach the top from either.'],
    fixes: ['Add cost[i] to the MINIMUM of the two prior totals, not the maximum.', 'The top is reachable from either of the last two stairs, so return the cheaper of them.'],
    complexity: 'Time O(n); space O(1).',
    exercises: [
      { prompt: 'Which line computes the cheapest cost to stand on the current stair?', correct: 'const current = Math.min(one, two) + cost[i];', choices: ['const current = Math.min(one, two) + cost[i];', 'const current = Math.max(one, two) + cost[i];', 'const current = one + two + cost[i];'], why: 'Standing on this stair costs its own cost plus the cheaper of the two ways to reach it.', wrong: { 'const current = Math.max(one, two) + cost[i];': 'We want the minimum-cost path, not the maximum.', 'const current = one + two + cost[i];': 'You arrive by only one of the two paths, so summing both overcounts.' } },
    ],
    complexityGuide: { work: 'How many stairs are evaluated?', workChoices: [['once', 'Each stair once'], ['nested', 'Each stair re-evaluated many times']], workCorrect: 'once', workWhy: 'A single pass with constant work per stair.', memory: 'What state is carried?', memoryChoices: [['constant', 'Just the last two totals'], ['linear', 'A full dp array']], memoryCorrect: 'constant', memoryWhy: 'Only the two previous totals are needed at any time.', final: [['linear-constant', 'Time O(n), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['quadratic-constant', 'Time O(n²), space O(1)']], finalCorrect: 'linear-constant' },
  }),
  'Same Tree': lesson('Same Tree', {
    brief: 'Decide whether two binary trees are identical in both shape and node values.',
    concepts: ['Tree recursion', 'Structural comparison'],
    intuition: 'Two trees match only if their roots match and, recursively, their left subtrees match and their right subtrees match — one local check repeated at every node.',
    inputOutput: ['p and q: the roots of two binary trees.', 'Return true when they have the same structure and the same values.', 'Input: p = [1, 2, 3], q = [1, 2, 3]\nOutput: true'],
    conceptChoices: ['Compare the trees node by node (DFS)', 'Compare their sorted value lists', 'Compare their heights'],
    algorithm: [
      'Compare the trees as pairs of nodes — one pair per recursive call.',
      'Base case: when both nodes in the pair are null, this pair matches.',
      [
        'If one node is null but the other is not, the shapes differ — not a match.',
        'If both nodes exist but hold different values — not a match.',
      ],
      [
        'Recurse to compare the two left children.',
        'Recurse to compare the two right children.',
      ],
      'This pair matches only when both child comparisons return true.',
    ],
    fixes: ['Handle the one-null case before reading .val, or it throws on a null node.', 'Both the left and right subtree checks must pass, so combine them with AND.'],
    complexity: 'Time O(n); space O(h) for the recursion stack (h = height).',
    exercises: [
      { prompt: 'Which line rejects a mismatch at the current pair of nodes?', correct: 'if (!p || !q || p.val !== q.val) return false;', choices: ['if (!p || !q || p.val !== q.val) return false;', 'if (!p && !q || p.val !== q.val) return false;', 'if (p.val !== q.val) return false;'], why: 'They differ if one node exists while the other is null, or their values disagree.', wrong: { 'if (!p && !q || p.val !== q.val) return false;': 'This still reads p.val when p is null (only the AND is guarded), so it throws.', 'if (p.val !== q.val) return false;': 'Reading p.val throws when one tree ended before the other.' } },
    ],
    complexityGuide: { work: 'How many nodes get compared?', workChoices: [['once', 'Each node once'], ['nested', 'Each node many times']], workCorrect: 'once', workWhy: 'Each pair of nodes is visited a single time.', memory: 'What drives the extra space?', memoryChoices: [['height', 'The recursion stack, up to the tree height'], ['constant', 'No extra space at all']], memoryCorrect: 'height', memoryWhy: 'Recursion descends as deep as the tree is tall.', final: [['linear-height', 'Time O(n), space O(h)'], ['linear-linear', 'Time O(n), space O(n) always'], ['quadratic-height', 'Time O(n²), space O(h)']], finalCorrect: 'linear-height' },
  }),
  'Linked List Cycle': lesson('Linked List Cycle', {
    brief: 'Detect whether a singly linked list contains a cycle, using O(1) extra space.',
    concepts: ['Fast and slow pointers', 'Cycle detection'],
    intuition: 'Send one pointer twice as fast as the other — if the list loops, the fast pointer keeps circling and eventually laps the slow one; if it reaches the end, there is no loop.',
    inputOutput: ['head: the first node of a singly linked list, which may loop back on itself.', 'Return true if the list contains a cycle.', 'Input: 3 → 2 → 0 → -4, with -4 linking back to 2\nOutput: true'],
    conceptChoices: ['Fast and slow pointers', 'A hash set of visited nodes', 'Reverse the list and compare'],
    algorithm: ['Start a slow and a fast pointer at the head.', 'Each step, move slow one node and fast two nodes.', 'If they ever land on the same node, there is a cycle.', 'If fast runs off the end, there is no cycle.'],
    fixes: ['Advance fast by two (fast.next.next), or it never catches slow.', 'Guard on fast and fast.next before stepping to avoid a null dereference.'],
    complexity: 'Time O(n); space O(1).',
    exercises: [
      { prompt: 'Which line moves the fast pointer two nodes ahead?', correct: 'fast = fast.next.next;', choices: ['fast = fast.next.next;', 'fast = fast.next;', 'fast = slow.next.next;'], why: 'Fast must travel twice as fast as slow so it laps slow inside any cycle.', wrong: { 'fast = fast.next;': 'Then both pointers move at the same speed and never meet in a cycle.', 'fast = slow.next.next;': 'Fast must advance from its own position, not from slow.' } },
    ],
    complexityGuide: { work: 'How far do the pointers travel before meeting?', workChoices: [['once', 'Linear in the list length'], ['nested', 'Quadratic in the length']], workCorrect: 'once', workWhy: 'The two pointers meet within one lap of the cycle.', memory: 'What extra storage is used?', memoryChoices: [['constant', 'Just two pointers'], ['linear', 'A set of visited nodes']], memoryCorrect: 'constant', memoryWhy: 'Only the two pointers are kept.', final: [['linear-constant', 'Time O(n), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['quadratic-constant', 'Time O(n²), space O(1)']], finalCorrect: 'linear-constant' },
  }),
  'Last Stone Weight': lesson('Last Stone Weight', {
    brief: 'Repeatedly smash the two heaviest stones; return the weight of the last stone left, or 0.',
    concepts: ['Max-heap / priority queue', 'Greedy simulation'],
    intuition: 'Only the two heaviest stones ever matter next, so keep pulling the two largest, smash them, and drop any leftover back — a max-heap surfaces those two quickly (here a re-sort stands in for the heap).',
    inputOutput: ['stones: an array of positive stone weights.', 'Return the weight of the last remaining stone, or 0 if none remains.', 'Input: stones = [2, 7, 4, 1, 8, 1]\nOutput: 1'],
    conceptChoices: ['Always smash the two heaviest (a max-heap)', 'Sum all the weights', 'Two pointers from both ends'],
    algorithm: ['While more than one stone remains, take the two heaviest.', 'Smash them together.', 'If their weights differ, the difference becomes a new stone.', 'Return the last stone, or 0 if none is left.'],
    fixes: ['Push back y - x, where y is the larger — not x - y.', 'Only add a leftover stone when the two weights differ.'],
    complexity: 'Time O(n² log n) by re-sorting each round (a max-heap makes it O(n log n)); space O(n).',
    exercises: [
      { prompt: 'Which line returns the leftover weight to the pile after a smash?', correct: 'stones.push(y - x);', choices: ['stones.push(y - x);', 'stones.push(y + x);', 'stones.push(x - y);'], why: 'The two heaviest smash; if unequal, the difference remains, and y is the larger.', wrong: { 'stones.push(y + x);': 'Smashing destroys weight; it does not add the two together.', 'stones.push(x - y);': 'x is the smaller weight, so x - y would be negative — keep y - x.' } },
    ],
    complexityGuide: { work: 'What dominates the cost each round?', workChoices: [['sort', 'Re-sorting all the stones'], ['once', 'A single constant-time step']], workCorrect: 'sort', workWhy: 'Re-sorting every round is the expensive part; a heap would avoid it.', memory: 'What holds the stones?', memoryChoices: [['linear', 'The stones array'], ['constant', 'Only a couple of variables']], memoryCorrect: 'linear', memoryWhy: 'All the stones are stored and shrink over time.', final: [['nsq-logn', 'Time O(n² log n), space O(n)'], ['nlogn', 'Time O(n log n), space O(n)'], ['linear-constant', 'Time O(n), space O(1)']], finalCorrect: 'nsq-logn' },
  }),
  'Missing Number': lesson('Missing Number', {
    brief: 'An array holds n distinct numbers from the range 0..n with exactly one missing; find it.',
    concepts: ['XOR of index and value', 'Bit manipulation'],
    intuition: 'XOR every index together with every value (seeded with n) — each number that is present cancels against its own index, so only the missing number is left uncancelled.',
    inputOutput: ['nums: n distinct values drawn from 0 to n, with one value missing.', 'Return the missing number.', 'Input: nums = [3, 0, 1]\nOutput: 2'],
    conceptChoices: ['XOR every index with every value', 'Sum 0..n and subtract the array sum', 'Sort, then find the gap'],
    algorithm: ['Seed the accumulator with n (the largest possible value).', 'XOR in each index i and each value nums[i].', 'Every present number cancels with its matching index.', 'The value left over is the missing number.'],
    fixes: ['Seed with n, since indices only go up to n-1 but the value range reaches n.', 'XOR the index and the value in each iteration.'],
    complexity: 'Time O(n); space O(1).',
    exercises: [
      { prompt: 'Which line cancels each present number against its index?', correct: 'missing ^= i ^ nums[i];', choices: ['missing ^= i ^ nums[i];', 'missing += i ^ nums[i];', 'missing ^= i + nums[i];'], why: 'XOR of a value with its equal index cancels to 0; the missing number has no index to cancel it.', wrong: { 'missing += i ^ nums[i];': 'Addition does not cancel matching pairs; only XOR does.', 'missing ^= i + nums[i];': 'The index and value must be XOR-ed separately, not added together first.' } },
    ],
    complexityGuide: { work: 'How many passes over the array?', workChoices: [['once', 'A single pass'], ['nested', 'A pass per element']], workCorrect: 'once', workWhy: 'One XOR-in per element, each constant time.', memory: 'What extra storage is needed?', memoryChoices: [['constant', 'One accumulator'], ['linear', 'A seen-array of size n']], memoryCorrect: 'constant', memoryWhy: 'Only the running XOR is stored.', final: [['linear-constant', 'Time O(n), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['nlogn-constant', 'Time O(n log n), space O(1)']], finalCorrect: 'linear-constant' },
  }),
  'Number of 1 Bits': lesson('Number of 1 Bits', {
    brief: 'Count the number of set bits (1s) in the binary form of a non-negative integer.',
    concepts: ['Bit masking', 'Right shift'],
    intuition: 'Inspect the lowest bit with n & 1, add it to the count, then shift the number right to expose the next bit — repeat until nothing is left.',
    inputOutput: ['n: a non-negative integer.', 'Return how many of its bits are set to 1.', 'Input: n = 11 (binary 1011)\nOutput: 3'],
    conceptChoices: ['Mask the lowest bit and shift right', 'Convert to a binary string and count', 'Divide by two repeatedly'],
    algorithm: ['Start a counter at 0.', 'Add the lowest bit (n & 1) to the counter.', 'Shift n right by one to drop that bit.', 'Repeat until n is 0, then return the counter.'],
    fixes: ['Use an unsigned right shift (>>>) so the sign bit does not fill in with 1s.', 'Add n & 1 (the isolated lowest bit), not n itself.'],
    complexity: 'Time O(number of bits) = O(32); space O(1).',
    exercises: [
      { prompt: 'Which line adds the current lowest bit to the count?', correct: 'count += n & 1;', choices: ['count += n & 1;', 'count += n | 1;', 'count += n % 1;'], why: 'n & 1 isolates the lowest bit (0 or 1); adding it counts a set bit.', wrong: { 'count += n | 1;': 'OR forces the bit on and yields a big number, not just the last bit.', 'count += n % 1;': 'Any integer mod 1 is 0, so nothing is ever counted.' } },
    ],
    complexityGuide: { work: 'How many iterations run?', workChoices: [['bits', 'One per bit (up to 32)'], ['value', 'One per unit of n']], workCorrect: 'bits', workWhy: 'Each shift drops one bit, so at most 32 iterations.', memory: 'What extra space is used?', memoryChoices: [['constant', 'Just a counter'], ['linear', 'A list of the bits']], memoryCorrect: 'constant', memoryWhy: 'Only the counter is kept.', final: [['const-const', 'Time O(32) = O(1), space O(1)'], ['linear-linear', 'Time O(n), space O(n)'], ['nlogn-constant', 'Time O(n log n), space O(1)']], finalCorrect: 'const-const' },
  }),
  'Happy Number': lesson('Happy Number', {
    brief: 'Decide whether repeatedly summing the squares of the digits eventually reaches 1.',
    concepts: ['Sum of digit squares', 'Cycle detection with a set'],
    intuition: 'Replace the number by the sum of the squares of its digits over and over — a happy number reaches 1, and an unhappy one falls into a repeating loop, so remember the values you have seen to detect that loop.',
    inputOutput: ['n: a positive integer.', 'Return true if the digit-square process reaches 1, false if it loops forever.', 'Input: n = 19\nOutput: true'],
    conceptChoices: ['Iterate digit-square sums, catching a cycle with a set', 'Fast and slow pointers over the sequence', 'Recurse without tracking seen values'],
    algorithm: ['Keep a set of numbers already seen.', 'Replace n with the sum of the squares of its digits.', 'Stop when n reaches 1 (happy) or repeats a seen value (a loop).', 'Return whether n ended at 1.'],
    fixes: ['Record each number in the seen set to catch the loop, or it runs forever.', 'Square each digit (digit * digit), not just the digit itself.'],
    complexity: 'The values quickly fall into a small bounded range, so time is bounded and extra space is O(1) in practice.',
    exercises: [
      { prompt: 'Which line adds the square of the current digit?', correct: 'sum += digit * digit;', choices: ['sum += digit * digit;', 'sum += digit;', 'sum += digit + digit;'], why: 'The process sums the SQUARE of each digit, so add digit * digit.', wrong: { 'sum += digit;': 'That sums the digits themselves, which is a different process.', 'sum += digit + digit;': 'digit + digit is two times the digit, not the digit squared.' } },
    ],
    complexityGuide: { work: 'What does each round do?', workChoices: [['digits', 'Sum the squares of the digits'], ['array', 'Scan a whole input array']], workCorrect: 'digits', workWhy: 'Each round only processes the digits of the current number.', memory: 'What is stored across rounds?', memoryChoices: [['seen', 'A set of numbers already seen'], ['none', 'Nothing extra']], memoryCorrect: 'seen', memoryWhy: 'The seen set is what catches a repeating cycle.', final: [['bounded-small', 'Bounded time; effectively O(1) space'], ['linear-linear', 'Time O(n), space O(n)'], ['quadratic-constant', 'Time O(n²), space O(1)']], finalCorrect: 'bounded-small' },
  }),
  'Balanced Binary Tree': lesson('Balanced Binary Tree', {
    brief: 'Decide whether a binary tree is height-balanced: at every node the two subtree heights differ by at most 1.',
    concepts: ['Bottom-up height', 'Sentinel for early exit'],
    intuition: 'Compute each height from the bottom up, and the moment any node is unbalanced, propagate a -1 sentinel so the whole tree fails fast without recomputing heights.',
    inputOutput: ['root: the root of a binary tree.', 'Return true if the tree is height-balanced.', 'Input: root = [3, 9, 20, null, null, 15, 7]\nOutput: true'],
    conceptChoices: ['Bottom-up height with a -1 balance sentinel', 'Measure each node height independently (top-down)', 'Compare the node counts on each side'],
    algorithm: [
      'Write one helper that returns a subtree height, reusing -1 to mean "already unbalanced".',
      'Base case: an empty node has height 0.',
      [
        'Recurse to get the left child height.',
        'Recurse to get the right child height.',
      ],
      'If either child came back -1, this subtree is unbalanced too — return -1.',
      'If the two child heights differ by more than 1, this node is unbalanced — return -1.',
      'Otherwise return 1 plus the taller child height.',
      'The whole tree is balanced when the helper on the root does not return -1.',
    ],
    fixes: ['Use -1 as an "unbalanced" signal so a bad subtree short-circuits the whole tree.', 'Compare the ABSOLUTE height difference against 1.'],
    complexity: 'Time O(n); space O(h) for the recursion (h = height).',
    exercises: [
      { prompt: 'Which line flags a node whose two subtrees are too different in height?', correct: 'if (Math.abs(leftHeight - rightHeight) > 1) return -1;', choices: ['if (Math.abs(leftHeight - rightHeight) > 1) return -1;', 'if (leftHeight - rightHeight > 1) return -1;', 'if (Math.abs(leftHeight - rightHeight) >= 1) return -1;'], why: 'The heights may differ by at most 1 in either direction, so compare the absolute difference against 1.', wrong: { 'if (leftHeight - rightHeight > 1) return -1;': 'That misses the case where the right subtree is the taller one.', 'if (Math.abs(leftHeight - rightHeight) >= 1) return -1;': 'A difference of exactly 1 is still balanced; only more than 1 fails.' } },
    ],
    complexityGuide: { work: 'How many nodes are visited?', workChoices: [['once', 'Each node once, bottom-up'], ['nested', 'Each node re-measured many times']], workCorrect: 'once', workWhy: 'The -1 sentinel avoids recomputing heights, so it is one pass.', memory: 'What drives the extra space?', memoryChoices: [['height', 'The recursion stack, up to the height'], ['constant', 'No extra space']], memoryCorrect: 'height', memoryWhy: 'Recursion descends as deep as the tree is tall.', final: [['linear-height', 'Time O(n), space O(h)'], ['quadratic-height', 'Time O(n²), space O(h)'], ['linear-linear', 'Time O(n), space O(n) always']], finalCorrect: 'linear-height' },
  }),
  'Subtree of Another Tree': lesson('Subtree of Another Tree', {
    brief: 'Return true when subRoot appears as an identical subtree somewhere inside root.',
    concepts: ['Tree recursion', 'Same-tree check'],
    intuition: 'At every node ask one question: is the tree hanging from here identical to subRoot? Walk every node of root and reuse a strict same-tree comparison to answer it.',
    inputOutput: ['root: a binary tree; subRoot: a smaller binary tree.', 'Return true if subRoot matches some subtree of root exactly.', 'Input: root = [3, 4, 5, 1, 2], subRoot = [4, 1, 2]\nOutput: true'],
    conceptChoices: ['Try a same-tree check at every node', 'Compare the two in-order traversals', 'Count the nodes on each side and compare'],
    algorithm: [
      'At each node of root, ask one question: is the subtree rooted here identical to subRoot?',
      'Base case: an empty subRoot matches anything, so report a match.',
      'If root is exhausted but subRoot is not, there is nothing left to match.',
      'Run a strict same-tree check between the current node and subRoot; a full match succeeds here.',
      [
        'Otherwise recurse into the left child, looking for the subtree.',
        'Otherwise recurse into the right child, looking for the subtree.',
      ],
      'A match in either child (OR) is enough to succeed.',
    ],
    fixes: ['An empty subRoot is a subtree of anything, so return true first.', 'Use a strict node-by-node equality, not just a root-value check.'],
    complexity: 'Time O(n·m) worst case; space O(h).',
    exercises: [
      { prompt: 'Which line checks whether the subtree rooted here matches subRoot exactly?', correct: 'if (isSameTree(root, subRoot)) return true;', choices: ['if (isSameTree(root, subRoot)) return true;', 'if (root.val === subRoot.val) return true;', 'if (isSubtree(root, subRoot)) return true;'], why: 'A match means the entire subtree here equals subRoot, so compare them node by node.', wrong: { 'if (root.val === subRoot.val) return true;': 'Equal roots do not guarantee the rest of the subtrees match.', 'if (isSubtree(root, subRoot)) return true;': 'Calling isSubtree on the same node just recurses forever.' } },
      { prompt: 'Which line searches the children when the current node does not match?', correct: 'return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);', choices: ['return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);', 'return isSubtree(root.left, subRoot) && isSubtree(root.right, subRoot);', 'return isSameTree(root.left, subRoot) || isSameTree(root.right, subRoot);'], why: 'The subtree can sit under either child, so a match in one branch is enough.', wrong: { 'return isSubtree(root.left, subRoot) && isSubtree(root.right, subRoot);': 'It only needs to appear once, so AND wrongly demands it on both sides.', 'return isSameTree(root.left, subRoot) || isSameTree(root.right, subRoot);': 'That only checks the child itself, not every deeper node.' } },
    ],
    complexityGuide: { work: 'In the worst case, how often is a same-tree check triggered?', workChoices: [['pernode', 'Once per node of root'], ['once', 'Only once in total']], workCorrect: 'pernode', workWhy: 'Each of the n nodes may launch a comparison that costs up to m, giving O(n·m).', memory: 'What sets the extra space?', memoryChoices: [['height', 'The recursion stack, up to the height'], ['constant', 'No extra space']], memoryCorrect: 'height', memoryWhy: 'Both recursions descend at most as deep as the tree is tall.', final: [['nm-height', 'Time O(n·m), space O(h)'], ['linear-height', 'Time O(n), space O(h)'], ['quadratic-constant', 'Time O(n²), space O(1)']], finalCorrect: 'nm-height' },
  }),
  'Counting Bits': lesson('Counting Bits', {
    brief: 'Return an array where entry i is the number of 1 bits in i, for every i from 0 to n.',
    concepts: ['Dynamic programming', 'Bit shifting'],
    intuition: 'Dropping the last bit of i (that is i >> 1) gives a smaller number you already solved, and the bit you dropped is i & 1 — so each answer is a smaller answer plus that one bit.',
    inputOutput: ['n: a non-negative integer.', 'Return an array of length n + 1 with the set-bit count of each index.', 'Input: n = 5\nOutput: [0, 1, 1, 2, 1, 2]'],
    conceptChoices: ['Reuse the count of i >> 1 plus its last bit', 'Count the bits of each number independently', 'Convert every number to a binary string and count'],
    algorithm: ['Make a result array of length n + 1, all zeros (0 has no bits).', 'For each i from 1 to n, look up the already-computed count for i >> 1.', 'Add the lowest bit of i, which is i & 1.', 'Store that as result[i] and continue.'],
    fixes: ['result[i >> 1] is always computed earlier because i >> 1 is smaller than i.', 'i & 1 is the single bit you removed by shifting i right.'],
    complexity: 'Time O(n); space O(n) for the output.',
    exercises: [
      { prompt: 'Which line builds the count for i from a smaller, known answer?', correct: 'result[i] = result[i >> 1] + (i & 1);', choices: ['result[i] = result[i >> 1] + (i & 1);', 'result[i] = result[i - 1] + (i & 1);', 'result[i] = result[i >> 1] + 1;'], why: 'The count for i is the count for i with its last bit removed, plus that last bit.', wrong: { 'result[i] = result[i - 1] + (i & 1);': 'i - 1 is not i with a bit dropped, so its count does not carry over.', 'result[i] = result[i >> 1] + 1;': 'The dropped bit may be 0, so add i & 1, not always 1.' } },
      { prompt: 'Which line allocates room for every answer from 0 to n?', correct: 'const result = new Array(n + 1).fill(0);', choices: ['const result = new Array(n + 1).fill(0);', 'const result = new Array(n).fill(0);', 'const result = new Array(n + 1).fill(1);'], why: 'Indices run from 0 through n, so the array needs n + 1 slots, and 0 has zero bits.', wrong: { 'const result = new Array(n).fill(0);': 'That leaves no slot for index n, so the last answer is missing.', 'const result = new Array(n + 1).fill(1);': 'result[0] must be 0 because zero has no set bits.' } },
    ],
    complexityGuide: { work: 'How much work does each index take?', workChoices: [['constant', 'A constant-time lookup and add'], ['logn', 'A loop over its bits']], workCorrect: 'constant', workWhy: 'Each answer reuses a prior result in O(1), so filling n + 1 of them is linear.', memory: 'What grows with n?', memoryChoices: [['array', 'The result array of size n + 1'], ['constant', 'Only a couple of counters']], memoryCorrect: 'array', memoryWhy: 'The output itself holds n + 1 counts.', final: [['linear-linear', 'Time O(n), space O(n)'], ['nlogn-linear', 'Time O(n log n), space O(n)'], ['linear-constant', 'Time O(n), space O(1)']], finalCorrect: 'linear-linear' },
  }),
  'Reverse Bits': lesson('Reverse Bits', {
    brief: 'Reverse the order of the 32 bits of an unsigned integer and return the result.',
    concepts: ['Bit shifting', 'Build the result bit by bit'],
    intuition: 'Peel the lowest bit off the input and push it onto the low end of the result each step — after 32 shifts the first bit you took ends up in the highest position, which is exactly a reversal.',
    inputOutput: ['n: a 32-bit unsigned integer.', 'Return the value formed by reversing its 32 bits.', 'Input: n = 43261596 (00000010100101000001111010011100)\nOutput: 964176192 (00111001011110000010100101000000)'],
    conceptChoices: ['Shift bits off one end and onto the other', 'Reverse the decimal digits of the number', 'Swap the top and bottom halves of the number'],
    algorithm: ['Start the result at 0.', 'Repeat 32 times: shift the result left to open a slot.', 'Drop in the current lowest bit of n with an OR.', 'Shift n right to expose the next bit, and return the result at the end.'],
    fixes: ['Shift the result left BEFORE adding the bit so earlier bits move toward the top.', 'Loop exactly 32 times so every bit position is placed.'],
    complexity: 'Time O(1) (always 32 iterations); space O(1).',
    exercises: [
      { prompt: 'Which line appends the current lowest bit onto the reversed result?', correct: 'result = (result << 1) | (n & 1);', choices: ['result = (result << 1) | (n & 1);', 'result = (result >> 1) | (n & 1);', 'result = (result << 1) | n;'], why: 'Open a new low slot with a left shift, then OR in the current lowest bit of n.', wrong: { 'result = (result >> 1) | (n & 1);': 'Shifting the result right loses bits already placed instead of making room.', 'result = (result << 1) | n;': 'You must add just the lowest bit (n & 1), not all of n.' } },
      { prompt: 'Which line exposes the next bit of the input for the following step?', correct: 'n >>= 1;', choices: ['n >>= 1;', 'n <<= 1;', 'n >>= 2;'], why: 'After consuming the lowest bit, shift n right so the next bit becomes the lowest.', wrong: { 'n <<= 1;': 'Shifting left moves away from the bit you need next and never terminates.', 'n >>= 2;': 'Skipping two bits at a time drops half of them unreversed.' } },
    ],
    complexityGuide: { work: 'How many iterations does the loop run?', workChoices: [['fixed', 'Exactly 32, regardless of input'], ['variable', 'As many as there are set bits']], workCorrect: 'fixed', workWhy: 'It always processes all 32 bit positions, so the time is constant.', memory: 'What extra storage is needed?', memoryChoices: [['constant', 'Just the result accumulator'], ['linear', 'An array of the bits']], memoryCorrect: 'constant', memoryWhy: 'Only a single result number is maintained.', final: [['constant-constant', 'Time O(1), space O(1)'], ['linear-constant', 'Time O(n), space O(1)'], ['constant-linear', 'Time O(1), space O(n)']], finalCorrect: 'constant-constant' },
  }),
  'Container With Most Water': lesson('Container With Most Water', {
    brief: 'Each array value is a vertical line’s height; pick the two lines that trap the most water between them and return that area.',
    concepts: ['Two pointers', 'Move the shorter wall'],
    intuition: 'Start as wide as possible; since the shorter wall caps the area, moving the taller wall inward can never help — so always advance the shorter side, hunting for a taller wall.',
    inputOutput: ['height: an array of non-negative wall heights.', 'Return the largest area of water trapped between any two walls.', 'Input: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\nOutput: 49'],
    conceptChoices: ['Two pointers, always moving the shorter wall inward', 'Try every pair of walls', 'Sort the walls by height first'],
    algorithm: ['Put one pointer at each end of the array.', 'Compute the area: width times the shorter of the two walls.', 'Keep the best area seen so far.', 'Move the pointer at the shorter wall inward, and stop when the pointers meet.'],
    fixes: ['The area is limited by the SHORTER wall, so use the minimum of the two heights.', 'Advance the shorter wall — moving the taller one can only shrink the width without raising the cap.'],
    complexity: 'Time O(n); space O(1).',
    exercises: [
      { prompt: 'Which line measures the water held by the current pair of walls?', correct: 'best = Math.max(best, (right - left) * Math.min(height[left], height[right]));', choices: ['best = Math.max(best, (right - left) * Math.min(height[left], height[right]));', 'best = Math.max(best, (right - left) * Math.max(height[left], height[right]));', 'best = Math.max(best, (right + left) * Math.min(height[left], height[right]));'], why: 'Water is bounded by the shorter wall, so the area is the width times the minimum height.', wrong: { 'best = Math.max(best, (right - left) * Math.max(height[left], height[right]));': 'The taller wall would overflow; the shorter wall sets the water level.', 'best = Math.max(best, (right + left) * Math.min(height[left], height[right]));': 'Width is the distance between the walls, right - left, not their sum.' } },
      { prompt: 'Which line moves the pointer that could actually improve the area?', correct: 'if (height[left] <= height[right]) left++;', choices: ['if (height[left] <= height[right]) left++;', 'if (height[left] <= height[right]) right--;', 'if (height[left] >= height[right]) left++;'], why: 'Only moving the shorter wall can find a taller one; moving the taller wall just narrows the container.', wrong: { 'if (height[left] <= height[right]) right--;': 'That moves the taller wall inward, which can never increase the area.', 'if (height[left] >= height[right]) left++;': 'This advances the taller side when left is taller, discarding the better wall.' } },
    ],
    complexityGuide: { work: 'How many times does each pointer move?', workChoices: [['once', 'Each index is passed once as the pointers converge'], ['nested', 'Every pair of walls is compared']], workCorrect: 'once', workWhy: 'The two pointers only move inward and meet once, so it is a single linear pass.', memory: 'What extra space is used?', memoryChoices: [['constant', 'Two indices and a running best'], ['linear', 'A copy of the walls']], memoryCorrect: 'constant', memoryWhy: 'Only a couple of pointers and the best area are stored.', final: [['linear-constant', 'Time O(n), space O(1)'], ['quadratic-constant', 'Time O(n²), space O(1)'], ['nlogn-constant', 'Time O(n log n), space O(1)']], finalCorrect: 'linear-constant' },
  }),
  'Find Minimum in Rotated Sorted Array': lesson('Find Minimum in Rotated Sorted Array', {
    brief: 'A sorted array was rotated at some pivot; find its minimum element in O(log n).',
    concepts: ['Binary search', 'Compare mid to the right end'],
    intuition: 'The minimum is the single place where the ascending order breaks. Comparing the middle with the right end tells you which half still contains that break, so you can discard the other half each step.',
    inputOutput: ['nums: a sorted array rotated an unknown number of times, all values distinct.', 'Return the smallest element.', 'Input: nums = [4, 5, 6, 7, 0, 1, 2]\nOutput: 0'],
    conceptChoices: ['Binary search comparing mid with the right end', 'Scan every element for the smallest', 'Binary search comparing mid with the left end'],
    algorithm: ['Keep a left and right index over the whole array.', 'Take the middle and compare nums[mid] with nums[right].', 'If mid is greater, the dip lies to its right, so move left past mid.', 'Otherwise the dip is at mid or to its left, so keep mid in range; when left meets right, that is the minimum.'],
    fixes: ['Compare mid to the RIGHT end, not the left, so an already-sorted slice resolves correctly.', 'Use right = mid (not mid - 1) because mid itself may be the minimum.'],
    complexity: 'Time O(log n); space O(1).',
    exercises: [
      { prompt: 'When the middle is bigger than the right end, which line discards the sorted left half?', correct: 'if (nums[mid] > nums[right]) left = mid + 1;', choices: ['if (nums[mid] > nums[right]) left = mid + 1;', 'if (nums[mid] > nums[right]) right = mid;', 'if (nums[mid] < nums[right]) left = mid + 1;'], why: 'If the middle exceeds the right end, the minimum must lie strictly to the right of mid.', wrong: { 'if (nums[mid] > nums[right]) right = mid;': 'That keeps the larger left half and discards the side holding the minimum.', 'if (nums[mid] < nums[right]) left = mid + 1;': 'A smaller mid means the minimum is at mid or to its left, not to the right.' } },
      { prompt: 'Otherwise, which line keeps mid as a possible minimum?', correct: 'else right = mid;', choices: ['else right = mid;', 'else right = mid - 1;', 'else left = mid;'], why: 'When mid is not greater than the right end, mid itself could be the minimum, so keep it in range.', wrong: { 'else right = mid - 1;': 'mid itself might be the minimum, so mid - 1 can skip past the answer.', 'else left = mid;': 'Moving left up would drop the smaller half that contains the minimum.' } },
    ],
    complexityGuide: { work: 'How does the search space change each step?', workChoices: [['half', 'It is halved every iteration'], ['one', 'It shrinks by one each iteration']], workCorrect: 'half', workWhy: 'Each comparison discards half the remaining range, giving O(log n).', memory: 'What extra storage is used?', memoryChoices: [['constant', 'Only the two indices and mid'], ['linear', 'A copy of half the array']], memoryCorrect: 'constant', memoryWhy: 'The search works in place with a few indices.', final: [['logn-constant', 'Time O(log n), space O(1)'], ['linear-constant', 'Time O(n), space O(1)'], ['logn-logn', 'Time O(log n), space O(log n)']], finalCorrect: 'logn-constant' },
  }),
  'Remove Nth Node From End of List': lesson('Remove Nth Node From End of List', {
    brief: 'Remove the nth node counting from the end of a singly linked list and return its head.',
    concepts: ['Two pointers', 'Dummy head node'],
    intuition: 'Give one pointer an n-node head start, then move both together — when the leader reaches the end, the follower sits right before the node to drop, all in a single pass.',
    inputOutput: ['head: the head of a singly linked list; n: the position from the end.', 'Return the head of the list after removing that node.', 'Input: head = [1, 2, 3, 4, 5], n = 2\nOutput: [1, 2, 3, 5]'],
    conceptChoices: ['Two pointers held n nodes apart', 'Count the length, then remove on a second pass', 'Store every node in an array by index'],
    algorithm: ['Put a dummy node before the head so removing the first node is uniform.', 'Advance a fast pointer n nodes ahead of a slow pointer.', 'Move both one step at a time until fast reaches the last node.', 'Unlink the node after slow, and return the node after the dummy.'],
    fixes: ['A dummy head makes deleting the first real node need no special case.', 'Stop advancing both when fast.next is null, so slow lands just before the target.'],
    complexity: 'Time O(L); space O(1).',
    exercises: [
      { prompt: 'Which line opens the n-node gap between the two pointers?', correct: 'for (let i = 0; i < n; i++) fast = fast.next;', choices: ['for (let i = 0; i < n; i++) fast = fast.next;', 'for (let i = 0; i <= n; i++) fast = fast.next;', 'for (let i = 0; i < n; i++) slow = slow.next;'], why: 'Advancing fast n steps first opens the exact gap that leaves slow just before the target.', wrong: { 'for (let i = 0; i <= n; i++) fast = fast.next;': 'That is n + 1 steps, so slow ends up one node too far.', 'for (let i = 0; i < n; i++) slow = slow.next;': 'Moving slow instead of fast never creates the gap between them.' } },
      { prompt: 'Which line splices the target node out of the list?', correct: 'slow.next = slow.next.next;', choices: ['slow.next = slow.next.next;', 'slow = slow.next.next;', 'slow.next = slow.next;'], why: 'Pointing slow.next past the target node removes it from the chain.', wrong: { 'slow = slow.next.next;': 'That just moves the pointer; the target is still linked in.', 'slow.next = slow.next;': 'Assigning next to itself changes nothing, so the node stays.' } },
    ],
    complexityGuide: { work: 'How many passes over the list does it take?', workChoices: [['one', 'A single pass with both pointers'], ['nested', 'A pass for each node']], workCorrect: 'one', workWhy: 'Fast walks the list once while slow trails, so it is one linear pass.', memory: 'What extra space is used?', memoryChoices: [['constant', 'A dummy node and two pointers'], ['linear', 'An array of all the nodes']], memoryCorrect: 'constant', memoryWhy: 'Only the dummy and the two pointers are kept, regardless of length.', final: [['linear-constant', 'Time O(L), space O(1)'], ['quadratic-constant', 'Time O(L²), space O(1)'], ['linear-linear', 'Time O(L), space O(L)']], finalCorrect: 'linear-constant' },
  }),
  'Subsets': lesson('Subsets', {
    brief: 'Return every possible subset (the power set) of an array of distinct integers.',
    concepts: ['Backtracking', 'Include-or-skip choice tree'],
    intuition: 'Each element is either in a subset or not, so walk a decision tree: record where you are, add an element and recurse, then remove it and try the next — that choose / recurse / un-choose rhythm lists every subset exactly once.',
    inputOutput: ['nums: an array of distinct integers.', 'Return a list of every subset, including the empty set and nums itself.', 'Input: nums = [1, 2, 3]\nOutput: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]'],
    conceptChoices: ['Build a choice tree, adding then removing each element', 'Greedily keep the largest elements first', 'Two pointers from both ends of the array'],
    algorithm: [
      'Keep a growing "current" subset and a "result" list of finished subsets.',
      'At the start of each recursive call, add a COPY of current to result — every node of the search is a valid subset.',
      'Loop i from the start index up to the end of nums.',
      'Choose nums[i] by pushing it onto current.',
      'Recurse with start = i + 1 so only later elements can be added.',
      'Un-choose by popping nums[i] before the next i.',
      'Begin the recursion at start = 0 and return result once it finishes.',
    ],
    fixes: ['Store a COPY of current (e.g. [...current]); pushing current itself saves a reference that later changes overwrite.', 'Recurse from i + 1, not i, so each element is used at most once and no subset repeats.'],
    complexity: 'Time O(n · 2ⁿ) — 2ⁿ subsets, each up to n long to copy; space O(n) for the recursion depth, beyond the output.',
    exercises: [
      { prompt: 'Which line records the current subset so later changes cannot corrupt it?', correct: 'result.push([...current]);', choices: ['result.push([...current]);', 'result.push(current);', 'current.push([...result]);'], why: 'Copying current freezes this subset; pushing current itself stores a reference that the later push/pop mutate.', wrong: { 'result.push(current);': 'This stores a live reference, so every later push and pop rewrites the saved subset.', 'current.push([...result]);': 'This mutates current with a copy of result — backwards, and it never records an answer.' } },
      { prompt: 'Which line recurses so each element is used at most once?', correct: 'backtrack(i + 1);', choices: ['backtrack(i + 1);', 'backtrack(i);', 'backtrack(start + 1);'], why: 'Starting the next call at i + 1 considers only later elements, so no element repeats and no subset is duplicated.', wrong: { 'backtrack(i);': 'Passing i lets the same element be chosen again, producing duplicates and infinite recursion.', 'backtrack(start + 1);': 'start does not advance with the loop, so it skips and repeats the wrong elements.' } },
    ],
    complexityGuide: { work: 'How many subsets are generated?', workChoices: [['exp', 'Two to the n'], ['quadratic', 'About n squared']], workCorrect: 'exp', workWhy: 'Each element is independently in or out, giving 2ⁿ subsets.', memory: 'What sets the extra space beyond the output?', memoryChoices: [['depth', 'The recursion depth, up to n'], ['exp', 'Two to the n at once']], memoryCorrect: 'depth', memoryWhy: 'Only one root-to-node path (length ≤ n) is active at a time; finished subsets go to the output.', final: [['n2n-n', 'Time O(n · 2ⁿ), space O(n)'], ['exp-exp', 'Time O(2ⁿ), space O(2ⁿ)'], ['quad-const', 'Time O(n²), space O(1)']], finalCorrect: 'n2n-n' },
  }),
  'Maximum Subarray': lesson('Maximum Subarray', {
    brief: 'Find the contiguous subarray with the largest sum and return that sum.',
    concepts: ['Kadane’s algorithm', 'Best sum ending here'],
    intuition: 'At each position make one choice: extend the subarray you have been building, or start fresh at the current element — whichever sum is larger. Track the best total seen and a single pass finds the answer.',
    inputOutput: ['nums: an array of integers, which may be negative.', 'Return the largest sum of any one contiguous subarray.', 'Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6, from [4, -1, 2, 1]'],
    conceptChoices: ['Track the best sum ending at each position', 'Sort the values and add the largest ones', 'Two pointers from both ends'],
    algorithm: [
      'Keep two values: "current" = the best sum ending at the position you are on, and "best" = the largest sum seen anywhere.',
      'Seed both with the first element, then scan from the second element onward.',
      'At each element, extend or restart: current = max(nums[i], current + nums[i]).',
      'Taking nums[i] alone is what discards a running sum that has gone negative.',
      'After updating current, update best = max(best, current).',
      'Return best once the scan finishes.',
    ],
    fixes: ['Compare nums[i] alone against current + nums[i] — a negative running sum should be dropped.', 'Update best after current each step, so a new peak is never missed.'],
    complexity: 'Time O(n); space O(1).',
    exercises: [
      { prompt: 'Which line makes the extend-or-restart choice at each element?', correct: 'current = Math.max(nums[i], current + nums[i]);', choices: ['current = Math.max(nums[i], current + nums[i]);', 'current = Math.max(best, current + nums[i]);', 'current = current + nums[i];'], why: 'The best subarray ending here is either this element alone (a restart) or the previous run extended by it.', wrong: { 'current = Math.max(best, current + nums[i]);': 'best is the global answer, not the option to restart from — compare against nums[i] alone.', 'current = current + nums[i];': 'Always extending never lets a negative running sum reset, so it underperforms.' } },
      { prompt: 'Which line records the best subarray sum seen so far?', correct: 'best = Math.max(best, current);', choices: ['best = Math.max(best, current);', 'best = Math.max(best, nums[i]);', 'best = current;'], why: 'best keeps the largest current value ever reached across the whole scan.', wrong: { 'best = Math.max(best, nums[i]);': 'That compares against a single element, not the running subarray sum.', 'best = current;': 'Overwriting drops earlier peaks when current later shrinks.' } },
    ],
    complexityGuide: { work: 'How many passes over the array are needed?', workChoices: [['once', 'A single pass'], ['nested', 'A pass for each element']], workCorrect: 'once', workWhy: 'One scan does constant work per element.', memory: 'What extra storage grows with the input?', memoryChoices: [['constant', 'Only current and best'], ['linear', 'A sum for every prefix']], memoryCorrect: 'constant', memoryWhy: 'Two running values are enough.', final: [['linear-constant', 'Time O(n), space O(1)'], ['quadratic-constant', 'Time O(n²), space O(1)'], ['linear-linear', 'Time O(n), space O(n)']], finalCorrect: 'linear-constant' },
  }),
  'Merge Intervals': lesson('Merge Intervals', {
    brief: 'Merge all overlapping intervals and return the non-overlapping set covering the same ranges.',
    concepts: ['Sort by start', 'Sweep and merge'],
    intuition: 'Once intervals are sorted by start, an overlap can only be with the interval you just kept — so sweep left to right, extending the last kept interval whenever the next one overlaps it, and otherwise beginning a new one.',
    inputOutput: ['intervals: a list of [start, end] pairs in any order.', 'Return the merged, non-overlapping intervals sorted by start.', 'Input: [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]'],
    conceptChoices: ['Sort by start, then merge overlaps in one pass', 'Compare every pair of intervals', 'Sort by end, then use two pointers'],
    algorithm: [
      'Sort the intervals by their start value.',
      'Keep a "merged" list of the intervals decided so far.',
      'Scan the sorted intervals; for each, look at the last interval in merged.',
      [
        { seq: [
          'If the current start is ≤ the last interval’s end, the two overlap.',
          'Extend that last interval’s end to the larger of its end and the current end.',
        ] },
        'Otherwise they are disjoint — append the current interval as a new entry.',
      ],
      'Return merged after the scan.',
    ],
    fixes: ['Take the MAX of the two ends when merging — the current interval may end earlier than the kept one.', 'An overlap includes touching endpoints, so test start ≤ last end (not strictly <).'],
    complexity: 'Time O(n log n) for the sort; space O(n) for the output.',
    exercises: [
      { prompt: 'On an overlap, which line extends the kept interval correctly?', correct: 'last[1] = Math.max(last[1], end);', choices: ['last[1] = Math.max(last[1], end);', 'last[1] = end;', 'last[1] = Math.min(last[1], end);'], why: 'The merged interval must cover both, so its end is the larger of the two ends.', wrong: { 'last[1] = end;': 'The current interval can end earlier (e.g. [1,6] then [2,3]), which would shrink the range.', 'last[1] = Math.min(last[1], end);': 'Taking the min shrinks the interval instead of covering both.' } },
      { prompt: 'Which line detects that the current interval overlaps the last kept one?', correct: 'if (last && start <= last[1]) {', choices: ['if (last && start <= last[1]) {', 'if (last && start < last[1]) {', 'if (last && start <= last[0]) {'], why: 'Sorted by start, an overlap means the current start reaches the last interval’s end; touching endpoints count, so use ≤.', wrong: { 'if (last && start < last[1]) {': 'A strict < fails to merge touching intervals like [1,4] and [4,5].', 'if (last && start <= last[0]) {': 'Comparing against the start, not the end, is the wrong boundary.' } },
    ],
    complexityGuide: { work: 'What dominates the running time?', workChoices: [['sort', 'Sorting the intervals'], ['scan', 'The single merge pass']], workCorrect: 'sort', workWhy: 'The one merge pass is linear; sorting is the O(n log n) part.', memory: 'What grows with the input?', memoryChoices: [['output', 'The merged output list'], ['constant', 'Only a couple of variables']], memoryCorrect: 'output', memoryWhy: 'In the worst case nothing merges, so the output holds all n intervals.', final: [['nlogn-linear', 'Time O(n log n), space O(n)'], ['linear-constant', 'Time O(n), space O(1)'], ['quadratic-linear', 'Time O(n²), space O(n)']], finalCorrect: 'nlogn-linear' },
  }),
  'Implement Trie (Prefix Tree)': lesson('Implement Trie (Prefix Tree)', {
    brief: 'Build a prefix tree supporting insert, exact-word search, and prefix search.',
    concepts: ['Prefix tree (trie)', 'End-of-word marker'],
    intuition: 'Words that share a prefix should share a path — store one node per character, branching only where words diverge, and mark the node where a whole word ends so a complete word is distinguishable from a mere prefix.',
    inputOutput: ['Operations: insert(word), search(word), startsWith(prefix).', 'search is true only for whole inserted words; startsWith is true for any inserted prefix.', 'Input: insert("apple"); search("apple"); search("app"); startsWith("app")\nOutput: true; false; true'],
    conceptChoices: ['A tree of nodes keyed by character, with an end-of-word flag', 'A hash set of every inserted word', 'A sorted list searched with binary search'],
    algorithm: [
      'Represent each node as a map from a character to a child node, plus an is-end flag.',
      'To insert, start at the root and walk the word one character at a time.',
      'Create a child node when the character has no branch yet, then step into it.',
      'After the final character, mark that node as the end of a word.',
      'To look up a string, walk the same way; a missing character means it is absent.',
      [
        'search succeeds only when the walk lands on a node whose is-end flag is set.',
        'startsWith succeeds whenever the walk completes at all, end flag or not.',
      ],
    ],
    fixes: ['Set the is-end flag on the node reached after the LAST character, not the root.', 'A found prefix node only counts as a whole word when its is-end flag is set.'],
    complexity: 'Each operation is O(L) in the word length L; space O(total characters inserted).',
    exercises: [
      { prompt: 'After inserting every character, which line marks a complete word?', correct: 'node.isEnd = true;', choices: ['node.isEnd = true;', 'node.isEnd = false;', 'this.root.isEnd = true;'], why: 'Only the node reached after the last character represents the end of that word.', wrong: { 'node.isEnd = false;': 'That leaves the word unmarked, so search would never find it.', 'this.root.isEnd = true;': 'Marking the root claims the empty string is a word, not this one.' } },
      { prompt: 'In the shared lookup, which line reports a missing path?', correct: 'if (!node.children[char]) return null;', choices: ['if (!node.children[char]) return null;', 'if (!node.children[char]) node.children[char] = new TrieNode();', 'if (!node.children[char]) continue;'], why: 'During a lookup a missing character means the string is not stored, so stop and report absence.', wrong: { 'if (!node.children[char]) node.children[char] = new TrieNode();': 'That is insert behavior — creating nodes while searching would store strings never inserted.', 'if (!node.children[char]) continue;': 'Skipping the character keeps walking as if it matched, giving false positives.' } },
    ],
    complexityGuide: { work: 'How long does insert or search take for a word of length L?', workChoices: [['len', 'About L steps, one per character'], ['count', 'It scans every stored word']], workCorrect: 'len', workWhy: 'Each operation walks one node per character, so O(L).', memory: 'What grows as more words are stored?', memoryChoices: [['chars', 'One node per new character on a path'], ['const', 'A fixed amount']], memoryCorrect: 'chars', memoryWhy: 'Every new character on a fresh path adds a node.', final: [['l-chars', 'Time O(L) per op, space O(total characters)'], ['n-n', 'Time O(n), space O(n)'], ['l2-const', 'Time O(L²) per op, space O(1)']], finalCorrect: 'l-chars' },
  }),
  'Network Delay Time': lesson('Network Delay Time', {
    brief: 'Find how long a signal from node k takes to reach every node, or -1 if some node is unreachable.',
    concepts: ['Dijkstra shortest paths', 'Greedy nearest-unvisited node'],
    intuition: 'The time for all nodes to receive the signal is the longest of the shortest arrival times — so run Dijkstra from k to get each node’s earliest arrival, then the answer is the largest of those (or -1 if any node never arrives).',
    inputOutput: ['times: directed edges [u, v, w]; n nodes labeled 1..n; k the source node.', 'Return the time for every node to receive the signal, or -1 if impossible.', 'Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2\nOutput: 2'],
    conceptChoices: ['Dijkstra from the source, then take the farthest arrival', 'One breadth-first pass ignoring the weights', 'Sort the edges and take the largest weight'],
    algorithm: [
      'Build an adjacency list: for each node, its outgoing (neighbor, weight) edges.',
      'Set every node’s best arrival time to infinity, except the source k which is 0.',
      'Repeat until every reachable node is finalized:',
      'Pick the unvisited node with the smallest current arrival time.',
      'Mark it visited — its arrival time is now final (the greedy step).',
      'Relax each outgoing edge: if arriving through this node is faster, lower the neighbor’s time.',
      'The answer is the largest finalized time, or -1 if any node stayed at infinity.',
    ],
    fixes: ['Always finalize the unvisited node with the SMALLEST tentative time, not the largest.', 'Lower a neighbor’s time only when the path through the current node is shorter.'],
    complexity: 'Time O(V²) with this scan-based selection (O(E log V) with a heap); space O(V + E).',
    exercises: [
      { prompt: 'Which line relaxes an edge — improving a neighbor’s arrival time?', correct: 'if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;', choices: ['if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;', 'if (dist[u] + w > dist[v]) dist[v] = dist[u] + w;', 'dist[v] = dist[u] + w;'], why: 'Only lower the neighbor’s time when the route through u is shorter than its current best.', wrong: { 'if (dist[u] + w > dist[v]) dist[v] = dist[u] + w;': 'That would overwrite a shorter path with a longer one.', 'dist[v] = dist[u] + w;': 'Overwriting unconditionally can replace an already-shorter arrival.' } },
      { prompt: 'Which line picks the next node to finalize?', correct: 'if (!visited.has(i) && (u === -1 || dist[i] < dist[u])) u = i;', choices: ['if (!visited.has(i) && (u === -1 || dist[i] < dist[u])) u = i;', 'if (!visited.has(i) && (u === -1 || dist[i] > dist[u])) u = i;', 'if (!visited.has(i)) u = i;'], why: 'Dijkstra always finalizes the unvisited node with the smallest tentative distance.', wrong: { 'if (!visited.has(i) && (u === -1 || dist[i] > dist[u])) u = i;': 'Choosing the largest breaks the greedy invariant and gives wrong distances.', 'if (!visited.has(i)) u = i;': 'Taking any unvisited node ignores distance, so finalized values are not minimal.' } },
    ],
    complexityGuide: { work: 'How is the next node to finalize chosen here?', workChoices: [['scan', 'Scan all nodes each round → about V² total'], ['const', 'In constant time']], workCorrect: 'scan', workWhy: 'Selecting the minimum by scanning is O(V) per round across V rounds.', memory: 'What storage grows with the graph?', memoryChoices: [['graph', 'Adjacency list plus one distance per node'], ['const', 'A fixed amount']], memoryCorrect: 'graph', memoryWhy: 'Edges live in the adjacency list and each node keeps a distance.', final: [['v2', 'Time O(V²), space O(V + E)'], ['e-const', 'Time O(E), space O(1)'], ['v3', 'Time O(V³), space O(V)']], finalCorrect: 'v2' },
  }),
  'Contains Duplicate': lesson('Contains Duplicate', {
    brief: "Given an array of integers, return true if any value appears at least twice; otherwise return false.",
    concepts: ["One pass through the array","Set membership"],
    intuition: "You never need to compare every pair — the instant you meet a value you have already met, you have your answer. So carry a memory of everything you have passed and let each new number check itself against that memory.",
    inputOutput: ["nums: an array of integers.","Return true if any value appears at least twice; otherwise return false.","Input: nums = [1, 2, 3, 1]\nOutput: true, because 1 appears more than once."],
    conceptChoices: ["A hash set of seen values","Sort, then check neighbors","Compare every pair"],
    algorithm: ["Keep a set of the values seen so far.","Iterate over the numbers one at a time.","Check whether the set already contains the current number.","A number already in the set means the array has a duplicate, so return true.","A number not yet in the set is added to it.","If the iteration completes with no match, return false."],
    fixes: ["Check membership before adding the current value.","A Set stores prior values directly, so it is enough for a duplicate check."],
    complexity: "Time O(n); space O(n) in the worst case.",
    exercises: [{"prompt":"Which line returns as soon as the current number was already seen?","correct":"if (seen.has(n)) return true;","choices":["if (seen.has(n)) return true;","if (seen.add(n)) return true;","if (!seen.has(n)) return true;"],"why":"seen.has(n) tests membership without changing the set, so a value from an earlier position ends the scan.","wrong":{"if (seen.add(n)) return true;":"add returns the Set itself, which is always truthy, so this returns true on the first number.","if (!seen.has(n)) return true;":"This fires for brand-new values — the opposite of a duplicate."}},{"prompt":"Which line records the current number so a later repeat can be caught?","correct":"seen.add(n);","choices":["seen.add(n);","seen.has(n);","seen.delete(n);"],"why":"Storing n now lets a later occurrence be found by the membership check.","wrong":{"seen.has(n);":"This only checks membership; it saves nothing, so no duplicate is ever detected.","seen.delete(n);":"This removes n instead of remembering it."}}],
    complexityGuide: {"code":"const seen = new Set();\nfor (const n of nums) {\n  if (seen.has(n)) return true;\n  seen.add(n);\n}\nreturn false;","work":"Across the for loop, how many times can one array value be checked and added to the set?","workChoices":[["once","At most once"],["nested","Once for every other array value"]],"workCorrect":"once","workWhy":"The loop advances through nums once. Set membership and insertion are constant time on average, so each value contributes constant work.","memory":"In the worst case, what extra storage can grow with the array?","memoryChoices":[["set","The set of distinct values seen so far"],["constant","Only n and the loop index"]],"memoryCorrect":"set","memoryWhy":"If no number repeats, seen stores every input value before the loop finishes.","final":[["linear-linear","Time O(n), space O(n)"],["quadratic-linear","Time O(n²), space O(n)"],["linear-constant","Time O(n), space O(1)"]],"finalCorrect":"linear-linear"},
  }),
  'Reverse Linked List': lesson('Reverse Linked List', {
    brief: "Given the head of a singly linked list, reverse its links in place and return the new head.",
    concepts: ["Pointer rewiring","The prev / current / next invariant"],
    intuition: "Reversing the list is just flipping one arrow at a time, but each flip destroys your way forward — so grab the next node before you rewire, and drag a 'previous' marker along behind you as you go.",
    inputOutput: ["head: the first node of a singly linked list. Each node has a value and a next pointer.","Return the head of the same nodes in reverse order.","Input: 1 → 2 → 3 → null\nOutput: 3 → 2 → 1 → null"],
    conceptChoices: ["Rewire next-pointers with a prev cursor","Recurse to the tail, then relink","Copy to an array and reverse"],
    algorithm: [["Initialize prev to null.","Initialize current to the head."],"Loop while current is not null.","Save current.next in a temporary before rewiring any link.","Point current.next back to prev.","Advance prev to current.","Advance current to the saved next node.","Return prev as the new head once current is null."],
    fixes: ["Save next before overwriting current.next, or the unreversed list is lost.","Return prev, not head: the original head becomes the final node."],
    complexity: "Time O(n); space O(1) for the iterative version.",
    exercises: [{"prompt":"Which line saves the rest of the list before the next link is overwritten?","correct":"const next = current.next;","choices":["const next = current.next;","const next = current.prev;","const next = prev;"],"why":"current.next still points at the unvisited remainder; saving it keeps that list reachable after the link flips.","wrong":{"const next = current.prev;":"A singly linked node has no prev pointer.","const next = prev;":"prev is the already-reversed side, not the remaining nodes."}},{"prompt":"Which line moves prev forward to the node just reversed?","correct":"prev = current;","choices":["prev = current;","prev = next;","prev = head;"],"why":"current is now the front of the reversed portion, so it becomes prev for the next iteration.","wrong":{"prev = next;":"next is still unprocessed; using it skips the node just reversed.","prev = head;":"head never advances, so it cannot track the growing reversed list."}}],
    complexityGuide: {"code":"let prev = null, current = head;\nwhile (current) {\n  const next = current.next;\n  current.next = prev;\n  prev = current;\n  current = next;\n}\nreturn prev;","work":"During the while loop, how many times can a single node become current?","workChoices":[["once","At most once"],["revisit","Once for every other node"]],"workCorrect":"once","workWhy":"The current pointer moves to the saved next node and never moves backward, so each node is processed once.","memory":"Besides the input list, what storage can grow as the list gets longer?","memoryChoices":[["constant","Only prev, current, and next"],["nodes","A second list of all nodes"]],"memoryCorrect":"constant","memoryWhy":"The algorithm changes links in the original list and holds only three node references.","final":[["linear-constant","Time O(n), space O(1)"],["quadratic-constant","Time O(n²), space O(1)"],["linear-linear","Time O(n), space O(n)"]],"finalCorrect":"linear-constant"},
  }),
  'Invert Binary Tree': lesson('Invert Binary Tree', {
    brief: "Given a binary tree, swap the left and right child of every node and return the same root.",
    concepts: ["Tree DFS","Recursive child swapping"],
    intuition: "Inverting the whole tree is the same tiny action repeated everywhere: swap a node's two children, then ask each child to do the same to itself. The full mirror image falls out of that one local swap.",
    inputOutput: ["root: the root node of a binary tree. Each node has left and right children.","Return the root after every node’s left and right subtrees have been swapped.","Input:    4\n       / \\ \n      2   7\nOutput:   4\n       / \\ \n      7   2"],
    conceptChoices: ["Swap every node's children","Swap only the leaf nodes","Sort each level left to right"],
    algorithm: ["Base case: an empty node inverts to null, so return null.","Stash the original left child in a temp — you are about to overwrite root.left, and root.right still needs it.","Recursively invert the ORIGINAL right subtree.","Assign that inverted right subtree to root.left.","Recursively invert the STASHED left subtree.","Assign that inverted left subtree to root.right.","Return root, now holding both inverted subtrees swapped."],
    fixes: ["Save one child before its reference is overwritten.","Handle the null base case before reading a child."],
    complexity: "Time O(n); space O(h) for the recursion stack, where h is the tree height.",
    exercises: [{"prompt":"Which line handles the empty subtree that ends the recursion?","correct":"if (!root) return null;","choices":["if (!root) return null;","if (!root) return root;","if (!root) return [];"],"why":"A missing child stays missing; returning null stops recursion at the edge of the tree.","wrong":{"if (!root) return root;":"There is no node to return when this branch is empty.","if (!root) return [];":"The function returns tree nodes or null, not an array."}},{"prompt":"Which line preserves the original left child before it is overwritten?","correct":"const oldLeft = root.left;","choices":["const oldLeft = root.left;","const oldLeft = root.right;","const oldLeft = root.val;"],"why":"The original left subtree must be saved so it can become the new right after both sides invert.","wrong":{"const oldLeft = root.right;":"Saving right loses the original left subtree, which still needs to move.","const oldLeft = root.val;":"val is the node’s payload, not a child subtree."}}],
    complexityGuide: {"code":"function invertTree(root) {\n  if (!root) return null;\n  const oldLeft = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(oldLeft);\n  return root;\n}","work":"How many times does the recursive function process a real tree node?","workChoices":[["once","At most once"],["nested","Once for every other node"]],"workCorrect":"once","workWhy":"Each call handles one node, swaps its two child references, and recurses into each child once.","memory":"What extra storage can grow as the tree gets taller?","memoryChoices":[["stack","The recursion call stack"],["constant","Only oldLeft"]],"memoryCorrect":"stack","memoryWhy":"The recursive calls wait for child calls to finish. Their depth follows the tree height h.","final":[["tree-height","Time O(n), space O(h)"],["tree-constant","Time O(n), space O(1)"],["quadratic-height","Time O(n²), space O(h)"]],"finalCorrect":"tree-height"},
  }),
  'Two Sum': lesson('Two Sum', {
    brief: "Given an array of integers and a target, return the indices of two different numbers whose values add up to that target.",
    concepts: ["Complement lookup","Hash map: value → index"],
    intuition: "As you scan, the only thing that unlocks an answer is having already seen the number that completes the pair — so remember each value you pass and check for its complement, not future values.",
    inputOutput: ["nums: an integer array; target: an integer.","Return two indices whose values sum to target.","Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]"],
    conceptChoices: ["A hash map of complements","Sort, then two pointers","Check every pair"],
    algorithm: ["Walk through the array once.","For the current value n, calculate target − n.","If that complement is already saved, return its saved index and the current index.","Otherwise save n and its index for a future match."],
    fixes: ["Save after checking, so you cannot use the same element twice.","Map values to indices—not booleans—because the result needs positions."],
    complexity: "Time O(n); space O(n) for the map.",
    exercises: [{"prompt":"Which line returns the two indices the moment the complement is found?","correct":"if (seen.has(need)) return [seen.get(need), i];","choices":["if (seen.has(need)) return [seen.get(need), i];","if (seen.has(nums[i])) return [seen.get(need), i];","if (seen.has(need)) return [i, seen.get(need)];"],"why":"When the complement need is already stored, its saved index and the current index are the answer.","wrong":{"if (seen.has(nums[i])) return [seen.get(need), i];":"Looking up nums[i] checks whether the current value was seen, not the value that completes the pair.","if (seen.has(need)) return [i, seen.get(need)];":"The saved index comes first (it is the earlier position), so the order is reversed here."}},{"prompt":"Which line remembers the current value so a later element can find it?","correct":"seen.set(nums[i], i);","choices":["seen.set(nums[i], i);","seen.set(i, nums[i]);","seen.set(need, i);"],"why":"Store value → index so a future element can look up this value as its complement.","wrong":{"seen.set(i, nums[i]);":"This maps index → value, but the lookup is by value, so the complement check would never hit.","seen.set(need, i);":"Storing the complement instead of the actual value corrupts later lookups."}}],
    complexityGuide: {"code":"const seen = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const need = target - nums[i];\n  if (seen.has(need)) return [seen.get(need), i];\n  seen.set(nums[i], i);\n}","work":"How many times is each array value examined?","workChoices":[["once","At most once"],["nested","Once for every other value"]],"workCorrect":"once","workWhy":"One pass over the array; each map lookup and insert is constant time on average.","memory":"What extra storage can grow with the array?","memoryChoices":[["map","The map of values seen so far"],["constant","Only need and i"]],"memoryCorrect":"map","memoryWhy":"Up to n values are stored before a matching pair is found.","final":[["linear-linear","Time O(n), space O(n)"],["quadratic-constant","Time O(n²), space O(1)"],["linear-constant","Time O(n), space O(1)"]],"finalCorrect":"linear-linear"},
  }),
  'Two Sum II': lesson('Two Sum II', {
    brief: "Given a sorted array and a target, return the two positions whose values add up to the target.",
    concepts: ["Sorted order","Two pointers"],
    intuition: "Because the values are sorted, the outer pair's sum tells you everything: too small can never be fixed by shrinking, too large can never be fixed by growing — so each comparison lets you retire one end for good.",
    inputOutput: ["numbers: a sorted integer array; target: an integer.","Return the two 1-indexed positions.","Input: [2, 7, 11, 15], target = 9\nOutput: [1, 2]"],
    conceptChoices: ["Two pointers from both ends","A hash map of complements","Binary search for each complement"],
    algorithm: ["Initialize a left pointer at the first index and a right pointer at the last.","Loop while left is less than right.","Compute the sum of the values at left and right.",["A sum equal to the target means left and right are the answer — return them as 1-based indices.","A sum less than the target needs a larger value, so increment left.","A sum greater than the target needs a smaller value, so decrement right."]],
    fixes: ["Move only one pointer per comparison.","The input is already sorted; do not sort it again."],
    complexity: "Time O(n); space O(1).",
    exercises: [{"prompt":"The array is sorted ascending. Which line moves the right pointer inward from a match?","correct":"if (sum < target) left++; else right--;","choices":["if (sum < target) left++; else right--;","if (sum < target) right--; else left++;","if (sum < target) left--; else right++;"],"why":"A too-small sum needs a larger value (left++); a too-large sum needs a smaller value (right--).","wrong":{"if (sum < target) right--; else left++;":"Lowering right on a too-small sum makes it even smaller.","if (sum < target) left--; else right++;":"Both moves leave the active window and can run out of bounds."}},{"prompt":"Positions must be 1-indexed. Which line returns the correct answer on a match?","correct":"if (sum === target) return [left + 1, right + 1];","choices":["if (sum === target) return [left + 1, right + 1];","if (sum === target) return [left, right];","if (sum === target) return [left + 1, right];"],"why":"left and right are zero-indexed, and the problem wants 1-indexed positions, so both need + 1.","wrong":{"if (sum === target) return [left, right];":"These are zero-indexed positions, off by one on both.","if (sum === target) return [left + 1, right];":"This corrects only the left index."}}],
    complexityGuide: {"code":"let left = 0, right = numbers.length - 1;\nwhile (left < right) {\n  const sum = numbers[left] + numbers[right];\n  if (sum === target) return [left + 1, right + 1];\n  if (sum < target) left++;\n  else right--;\n}","work":"Across the full search, how many times can either pointer move?","workChoices":[["once","At most once per array position"],["nested","Once for every other array position"]],"workCorrect":"once","workWhy":"left only moves right and right only moves left. Together they can cross the array only once.","memory":"Besides the input array, what storage can grow as the input gets longer?","memoryChoices":[["constant","Only left, right, and sum"],["map","A map of every value"]],"memoryCorrect":"constant","memoryWhy":"The algorithm keeps a fixed number of variables and uses the sorted input directly.","final":[["linear-constant","Time O(n), space O(1)"],["quadratic-constant","Time O(n²), space O(1)"],["linear-linear","Time O(n), space O(n)"]],"finalCorrect":"linear-constant"},
  }),
  'Longest Substring Without Repeating Characters': lesson('Longest Substring Without Repeating Characters', {
    brief: "Given a string, find the length of its longest contiguous substring with no repeated characters.",
    concepts: ["Sliding window","Set of characters inside the current window"],
    intuition: "A repeat can only ever appear at the newest character you add, so instead of restarting you just pull the left edge forward until the clash is gone — and the window keeps sliding without ever rechecking old ground.",
    inputOutput: ["s: a string.","Return the longest valid substring length.","Input: \"abcabcbb\"\nOutput: 3, from \"abc\""],
    conceptChoices: ["A sliding window with a seen-set","Check every substring for repeats","Sort the characters"],
    algorithm: [["Keep a set of the characters currently in the window.","Track the window's left edge and the best length, both starting at zero."],"Expand the window by moving right across the string one character at a time.","While the incoming character is already in the set, delete the leftmost character and advance left.","Add the incoming character to the set.","Update the best length with the current window size, right - left + 1."],
    fixes: ["Delete s[left], not the incoming duplicate.","Measure after the window is repaired."],
    complexity: "Time O(n); space O(min(n, alphabet size)).",
    exercises: [{"prompt":"The incoming character is already inside the window. Which line repairs the window from the left?","correct":"while (seen.has(s[right])) seen.delete(s[left++]);","choices":["while (seen.has(s[right])) seen.delete(s[left++]);","while (seen.has(s[right])) seen.delete(s[right++]);","while (seen.has(s[right])) seen.add(s[left++]);"],"why":"The duplicate must leave from the left edge, so remove s[left] and advance left until the window is valid.","wrong":{"while (seen.has(s[right])) seen.delete(s[right++]);":"This removes the incoming character and skips input, leaving the earlier duplicate inside.","while (seen.has(s[right])) seen.add(s[left++]);":"Adding instead of deleting never makes the window valid, so the loop never ends."}},{"prompt":"The window is valid again. Which line records its length?","correct":"best = Math.max(best, right - left + 1);","choices":["best = Math.max(best, right - left + 1);","best = Math.max(best, right - left);","best = Math.max(best, best + 1);"],"why":"Both ends are inside the window, so its length is right − left + 1.","wrong":{"best = Math.max(best, right - left);":"This drops one endpoint, undercounting every window.","best = Math.max(best, best + 1);":"The window can change by more than one; measure it from its bounds."}}],
    complexityGuide: {"code":"const seen = new Set();\nlet left = 0, best = 0;\nfor (let right = 0; right < s.length; right++) {\n  while (seen.has(s[right])) seen.delete(s[left++]);\n  seen.add(s[right]);\n  best = Math.max(best, right - left + 1);\n}\nreturn best;","work":"Although there is a while loop inside the for loop, how many total times can one character leave the window?","workChoices":[["once","At most once"],["nested","Once for every later character"]],"workCorrect":"once","workWhy":"left only moves forward. Each character is added once and removed at most once, so the two pointers make one total pass.","memory":"In the worst case, what extra storage can grow with the input string?","memoryChoices":[["set","The set of characters in the current window"],["constant","Only left, right, and best"]],"memoryCorrect":"set","memoryWhy":"When all characters are distinct, the current window and its set can contain the whole string.","final":[["linear-linear","Time O(n), space O(n)"],["quadratic-linear","Time O(n²), space O(n)"],["linear-constant","Time O(n), space O(1)"]],"finalCorrect":"linear-linear"},
  }),
  'Binary Search': lesson('Binary Search', {
    brief: "Given a sorted list and a target, return its index or -1 without checking every value.",
    concepts: ["Sorted order","Binary search interval"],
    intuition: "Because the array is sorted, one comparison against the middle tells you which half the target cannot be in — so you can throw away half the remaining range every step.",
    inputOutput: ["nums: sorted integer array; target: an integer.","Return the target index or -1.","Input: [-1, 0, 3, 5, 9], target = 9\nOutput: 4"],
    conceptChoices: ["Halve the interval each step","Scan left to right","Jump in fixed-size blocks"],
    algorithm: ["Set a left boundary at index 0 and a right boundary at the last index.","Loop while left is less than or equal to right.","Compute the middle index and read the value there.",["A middle value equal to the target returns its index.","A middle value below the target discards the left half: set left to mid + 1.","A middle value above the target discards the right half: set right to mid - 1."],"Return -1 once the boundaries cross with no match."],
    fixes: ["Use left <= right so a single remaining value is checked.","Move past mid; mid was already tested."],
    complexity: "Time O(log n); space O(1).",
    exercises: [{"prompt":"mid is too small and already tested. Which line keeps only the values that could still match?","correct":"if (nums[mid] < target) left = mid + 1;","choices":["if (nums[mid] < target) left = mid + 1;","if (nums[mid] < target) left = mid - 1;","if (nums[mid] < target) left = mid;"],"why":"mid was checked and is too small, so the next possible answer starts right after it.","wrong":{"if (nums[mid] < target) left = mid - 1;":"That moves toward even smaller values, which cannot help.","if (nums[mid] < target) left = mid;":"Leaving mid in the range can repeat the same midpoint forever."}},{"prompt":"mid is too large and already tested. Which line ends the interval just before it?","correct":"else right = mid - 1;","choices":["else right = mid - 1;","else right = mid + 1;","else right = mid;"],"why":"mid was checked and is too large, so the remaining interval ends one before it.","wrong":{"else right = mid + 1;":"That keeps values above an already too-large midpoint.","else right = mid;":"Leaving mid in the range can stop the bounds from shrinking."}}],
    complexityGuide: {"code":"let left = 0, right = nums.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (nums[mid] === target) return mid;\n  if (nums[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;","work":"After each unsuccessful comparison, what happens to the remaining search interval?","workChoices":[["halve","It is cut roughly in half"],["one","It loses only one value"]],"workCorrect":"halve","workWhy":"Each comparison proves an entire half of the sorted interval cannot contain the target.","memory":"Besides the input array, what storage can grow as the array gets longer?","memoryChoices":[["constant","Only left, right, and mid"],["copy","A copy of the remaining half"]],"memoryCorrect":"constant","memoryWhy":"The active interval is represented by indexes; no new array is created.","final":[["log-constant","Time O(log n), space O(1)"],["linear-constant","Time O(n), space O(1)"],["log-linear","Time O(log n), space O(n)"]],"finalCorrect":"log-constant"},
  }),
  'Valid Parentheses': lesson('Valid Parentheses', {
    brief: "Given brackets, decide whether every opening bracket is closed in the correct order.",
    concepts: ["Last-in, first-out order","Stack"],
    intuition: "Only the most recently opened bracket can be the next one legally closed — that 'last opened, first closed' rule is exactly what a stack enforces, so push every opener and match each closer against the top.",
    inputOutput: ["s: a bracket string.","Return true when every opening bracket closes in order.","Input: \"([])\"\nOutput: true"],
    conceptChoices: ["A stack of open brackets","Count each bracket type","Delete matched pairs repeatedly"],
    algorithm: ["Keep a stack of opening brackets awaiting their match.","Iterate over the string one character at a time.",["An opening bracket is pushed onto the stack.",{"seq":["A closing bracket pops the opener off the top of the stack.","Check that popped opener is the correct partner for the closer.","An empty stack or a mismatched partner means the string is invalid."]}],"After iterating, the string is valid only if the stack is empty."],
    fixes: ["Check the result of pop; an empty stack is invalid.","Do not only compare counts—order matters."],
    complexity: "Time O(n); space O(n).",
    exercises: [{"prompt":"A closing bracket must resolve the most recent opener. Which line checks that?","correct":"if (stack.pop() !== pairs[ch]) return false;","choices":["if (stack.pop() !== pairs[ch]) return false;","if (stack.shift() !== pairs[ch]) return false;","if (stack.push(ch) !== pairs[ch]) return false;"],"why":"pop() removes the most recently pushed opener, the only one this closing bracket may match.","wrong":{"if (stack.shift() !== pairs[ch]) return false;":"shift() removes the oldest opener, breaking nested last-in, first-out order.","if (stack.push(ch) !== pairs[ch]) return false;":"push adds another item and returns the new length; it resolves nothing."}},{"prompt":"Which line reports whether every opener was matched?","correct":"return stack.length === 0;","choices":["return stack.length === 0;","return stack.length === 1;","return stack.length === s.length;"],"why":"An empty stack means every opening bracket found its match.","wrong":{"return stack.length === 1;":"One leftover opener is still unmatched, so the string is invalid.","return stack.length === s.length;":"The stack holds only unresolved openers, not every character."}}],
    complexityGuide: {"code":"const pairs = { \")\":\"(\", \"]\":\"[\", \"}\":\"{\" };\nconst stack = [];\nfor (const char of s) {\n  if (char in pairs) {\n    if (stack.pop() !== pairs[char]) return false;\n  } else stack.push(char);\n}\nreturn stack.length === 0;","work":"How many times can one bracket be read by the for loop?","workChoices":[["once","At most once"],["nested","Once for every other bracket"]],"workCorrect":"once","workWhy":"The loop makes one pass through the string, and each stack push or pop is constant time.","memory":"In the worst case, what extra storage can grow with the string?","memoryChoices":[["stack","The stack of unmatched opening brackets"],["constant","Only the pairs object"]],"memoryCorrect":"stack","memoryWhy":"A string of only opening brackets leaves every bracket on the stack, so the stack can hold n values.","final":[["linear-linear","Time O(n), space O(n)"],["quadratic-linear","Time O(n²), space O(n)"],["linear-constant","Time O(n), space O(1)"]],"finalCorrect":"linear-linear"},
  }),
  'Number of Islands': lesson('Number of Islands', {
    brief: "Given a grid of land and water, count the distinct groups of connected land.",
    concepts: ["Grid graph","DFS or BFS","Visited set / in-place marking"],
    intuition: "Each new patch of land you stumble on is the start of a fresh island — so count it once, then flood outward to erase every cell connected to it, guaranteeing you never count the same island twice.",
    inputOutput: ["grid: a matrix of \"1\" land and \"0\" water.","Return the number of connected land groups.","Input: [[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"1\",\"0\",\"1\"]]\nOutput: 3"],
    conceptChoices: ["Flood-fill each new land cell","Union-find over adjacent land","Scan rows counting land"],
    algorithm: ["Scan every cell of the grid.","On reaching unvisited land, increment the island count and start a flood fill from that cell.","The flood fill returns immediately for a cell out of bounds, on water, or already visited.","Otherwise mark the current land cell as visited.","Recurse the flood fill into the four neighboring cells - up, down, left, and right."],
    fixes: ["Mark a cell visited when it is discovered, not later.","Check grid boundaries before indexing."],
    complexity: "Time O(rows × cols); space O(rows × cols) in the worst case.",
    exercises: [{"prompt":"Flood fill has just reached land. Which line marks it so it is not counted again?","correct":"grid[r][c] = \"0\";","choices":["grid[r][c] = \"0\";","grid[r][c] = \"1\";","grid[r][c] = r + 1;"],"why":"Turning visited land into water records that this cell already belongs to the current island.","wrong":{"grid[r][c] = \"1\";":"Leaving it as land lets a later scan or call visit it again.","grid[r][c] = r + 1;":"A grid cell holds a value, not a coordinate."}},{"prompt":"Three neighbors are already visited. Which line explores the left neighbor?","correct":"visit(r, c - 1);","choices":["visit(r, c - 1);","visit(c, c - 1);","visit(r + 1, c - 1);"],"why":"Keeping r and decreasing c reaches the cell immediately to the left.","wrong":{"visit(c, c - 1);":"This passes a column where the row is expected.","visit(r + 1, c - 1);":"This moves diagonally, skipping the direct left cell."}}],
    complexityGuide: {"code":"function visit(r, c) {\n  if (r < 0 || c < 0 || r === rows || c === cols || grid[r][c] !== \"1\") return;\n  grid[r][c] = \"0\";\n  visit(r + 1, c); visit(r - 1, c);\n  visit(r, c + 1); visit(r, c - 1);\n}\nfor (let r = 0; r < rows; r++)\n  for (let c = 0; c < cols; c++)\n    if (grid[r][c] === \"1\") { count++; visit(r, c); }","work":"Across the scan and all flood fills, how many times can one grid cell be visited as land?","workChoices":[["once","At most once"],["nested","Once for every other cell"]],"workCorrect":"once","workWhy":"Flood fill marks a land cell the first time it visits it, so later scans and calls skip it.","memory":"What extra storage can grow with the size of the grid in this recursive version?","memoryChoices":[["callstack","The recursion call stack"],["constant","Only the island counter"]],"memoryCorrect":"callstack","memoryWhy":"A large connected island can create a recursive path containing many cells.","final":[["grid-grid","Time O(rows × cols), space O(rows × cols)"],["quadratic-constant","Time O((rows × cols)²), space O(1)"],["grid-constant","Time O(rows × cols), space O(1)"]],"finalCorrect":"grid-grid"},
  }),
  'Jump Game': lesson('Jump Game', {
    brief: "Given the maximum jump length at each index, decide whether you can reach the last index starting from the first.",
    concepts: ["Greedy reachability","Furthest reachable index"],
    intuition: "You never need to plan a path — just track the furthest index you could reach so far. If you ever stand past that furthest reach you are stuck; if the reach ever covers the last index you win.",
    inputOutput: ["nums[i]: the maximum jump length from index i.","Return true if the last index is reachable from index 0.","Input: nums = [2, 3, 1, 1, 4]\nOutput: true"],
    conceptChoices: ["Track the furthest index reachable so far","Try every jump sequence recursively","Work backward from the last index with two pointers"],
    algorithm: ["Track the furthest index reachable so far, starting at 0.","Scan each index i from the start of the array.","If i is beyond the furthest reach, it can never be stood on — return false.","Otherwise extend the reach to the larger of itself and i + nums[i].","If the scan finishes, every index was reachable, so the last one is too — return true."],
    fixes: ["Fail the instant an index sits beyond the furthest reach.","Extend the reach with i + nums[i] (the landing index), not nums[i] alone."],
    complexity: "Time O(n); space O(1).",
    exercises: [{"prompt":"Which line detects that the current index can't be reached?","correct":"if (i > reach) return false;","choices":["if (i > reach) return false;","if (i < reach) return false;","if (i > nums[i]) return false;"],"why":"If the current index is past everything reachable so far, no earlier jump can land here.","wrong":{"if (i < reach) return false;":"Indexes within reach are fine — this fails on reachable positions.","if (i > nums[i]) return false;":"That compares an index to a jump length, which is unrelated to reachability."}},{"prompt":"Which line extends how far you can reach?","correct":"reach = Math.max(reach, i + nums[i]);","choices":["reach = Math.max(reach, i + nums[i]);","reach = Math.max(reach, nums[i]);","reach = i + nums[i];"],"why":"From index i you can land as far as i + nums[i]; keep the best reach seen.","wrong":{"reach = Math.max(reach, nums[i]);":"nums[i] is a length, not an index — the landing index is i + nums[i].","reach = i + nums[i];":"Overwriting can shrink the reach; keep the maximum."}}],
    complexityGuide: {"work":"How many passes over the array are needed?","workChoices":[["once","A single pass"],["nested","A pass per index"]],"workCorrect":"once","workWhy":"One scan with constant work per index.","memory":"What extra storage grows with the input?","memoryChoices":[["constant","Only the reach value"],["linear","A reachable-flag per index"]],"memoryCorrect":"constant","memoryWhy":"Only the furthest reach is tracked.","final":[["linear-constant","Time O(n), space O(1)"],["quadratic-constant","Time O(n²), space O(1)"],["linear-linear","Time O(n), space O(n)"]],"finalCorrect":"linear-constant"},
  }),
  'Unique Paths': lesson('Unique Paths', {
    brief: "Count the distinct paths from the top-left to the bottom-right of an m by n grid, moving only right or down.",
    concepts: ["Grid dynamic programming","Paths = above + left"],
    intuition: "The only ways into a cell are from directly above or directly to the left, so the paths into it equal the sum of the paths into those two neighbors. Fill the grid once and the bottom-right holds the answer.",
    inputOutput: ["m: number of rows; n: number of columns.","Return the number of distinct right/down paths from corner to corner.","Input: m = 3, n = 7\nOutput: 28"],
    conceptChoices: ["Each cell's paths = paths from above + paths from the left","Multiply the row count by the column count","Enumerate every path with backtracking"],
    algorithm: ["Keep a single row of counts, one per column, all initialized to 1 — the first grid row has exactly one path to each cell.","Sweep down each row from the second onward.","Within a row, move across each column from the second onward.","Set row[c] to row[c] (paths from the cell above) plus row[c-1] (paths from the cell to the left).","After the last row, row[n-1] holds the total number of distinct paths."],
    fixes: ["Add the just-updated left value (row[c-1]) to the not-yet-overwritten above value (row[c]).","Initialize the row to all 1s, since the first row and first column each have a single path."],
    complexity: "Time O(m · n); space O(n).",
    exercises: [{"prompt":"Which line combines the paths from above and from the left?","correct":"row[c] = row[c] + row[c - 1];","choices":["row[c] = row[c] + row[c - 1];","row[c] = row[c] * row[c - 1];","row[c] = row[c - 1];"],"why":"Before it is overwritten, row[c] is the count from the cell above and row[c-1] the count from the left; a cell is reached from either.","wrong":{"row[c] = row[c] * row[c - 1];":"Paths add, they do not multiply.","row[c] = row[c - 1];":"This ignores the paths coming from directly above."}},{"prompt":"Which line sets up one path to every cell of the first row?","correct":"const row = new Array(n).fill(1);","choices":["const row = new Array(n).fill(1);","const row = new Array(n).fill(0);","const row = new Array(m).fill(1);"],"why":"There is exactly one straight path along the first row, so every column starts at 1.","wrong":{"const row = new Array(n).fill(0);":"Starting at 0 leaves no paths to build on.","const row = new Array(m).fill(1);":"The row has one entry per column (n), not per row (m)."}}],
    complexityGuide: {"work":"How much work does each grid cell take?","workChoices":[["constant","One constant-time add"],["linear","A scan of the whole row"]],"workCorrect":"constant","workWhy":"Each of the m·n cells is updated once in O(1).","memory":"What storage grows with the grid width?","memoryChoices":[["row","One row of counts (n)"],["grid","The full m·n grid"]],"memoryCorrect":"row","memoryWhy":"Only a single rolling row is kept, not the whole grid.","final":[["mn-n","Time O(m · n), space O(n)"],["mn-mn","Time O(m · n), space O(m · n)"],["n-constant","Time O(n), space O(1)"]],"finalCorrect":"mn-n"},
  }),
  'Koko Eating Bananas': lesson('Koko Eating Bananas', {
    brief: "Find the smallest integer eating speed that lets Koko finish every banana pile within h hours.",
    concepts: ["Binary search on the answer","Monotonic feasibility"],
    intuition: "Eating faster never makes her miss the deadline, so the speeds that finish in time form a clean \"too slow… too slow… fast enough… fast enough\" split. Binary-search the speed and test each candidate by summing the hours it would need.",
    inputOutput: ["piles: bananas in each pile; h: the available hours.","Return the minimum integer speed (bananas per hour) that finishes within h hours.","Input: piles = [3, 6, 7, 11], h = 8\nOutput: 4"],
    conceptChoices: ["Binary-search the speed, testing feasibility at each mid","Try every speed from 1 upward until one fits","Sort the piles and always eat the largest first"],
    algorithm: ["The answer is between 1 and the largest pile, so set lo = 1 and hi = max(piles).","Binary search while lo is less than hi.","Take mid as a candidate speed, and add up the hours it needs: the ceiling of pile / mid for every pile.",["If those hours fit within h, mid is fast enough (maybe too fast) — keep it as the new hi.","Otherwise mid is too slow — move lo just past it (lo = mid + 1)."],"When lo meets hi it is the smallest feasible speed — return it."],
    fixes: ["Round each pile’s hours UP (ceil): a partial pile still costs a whole hour.","On a feasible mid, keep it as hi rather than discarding it — it may be the minimum."],
    complexity: "Time O(n · log(max pile)); space O(1).",
    exercises: [{"prompt":"Which line counts the hours needed at speed mid?","correct":"for (const p of piles) hours += Math.ceil(p / mid);","choices":["for (const p of piles) hours += Math.ceil(p / mid);","for (const p of piles) hours += Math.floor(p / mid);","for (const p of piles) hours += p / mid;"],"why":"A pile takes ceil(pile / speed) hours — the leftover bananas still cost a full hour.","wrong":{"for (const p of piles) hours += Math.floor(p / mid);":"Flooring drops the final partial hour, undercounting the time.","for (const p of piles) hours += p / mid;":"Fractional hours are impossible; each pile rounds up to whole hours."}},{"prompt":"On a fast-enough speed, which line keeps searching for a smaller one?","correct":"if (hours <= h) hi = mid;","choices":["if (hours <= h) hi = mid;","if (hours <= h) lo = mid;","if (hours <= h) hi = mid - 1;"],"why":"mid might itself be the minimum, so keep it in range by setting hi = mid (not below it).","wrong":{"if (hours <= h) lo = mid;":"Raising lo searches for a larger speed — the wrong direction.","if (hours <= h) hi = mid - 1;":"Dropping below mid can skip the true minimum when mid is the answer."}}],
    complexityGuide: {"work":"How many candidate speeds are tested, and what does each cost?","workChoices":[["logn-scan","About log(max pile) speeds, each an O(n) scan"],["linear","Every speed once"]],"workCorrect":"logn-scan","workWhy":"Binary search halves the speed range each step; each test scans all piles.","memory":"What extra storage is used?","memoryChoices":[["constant","Just a few counters"],["linear","A copy of the piles"]],"memoryCorrect":"constant","memoryWhy":"Only lo, hi, mid, and an hours accumulator are kept.","final":[["nlogm-constant","Time O(n · log(max pile)), space O(1)"],["n-constant","Time O(n), space O(1)"],["nm-constant","Time O(n · max pile), space O(1)"]],"finalCorrect":"nlogm-constant"},
  }),
  'Combination Sum': lesson('Combination Sum', {
    brief: "Return every unique combination of the candidates that sums to the target; each candidate may be reused any number of times.",
    concepts: ["Backtracking with reuse","Start index to avoid duplicate sets"],
    intuition: "Grow a running combination by trying each candidate. Allow reuse by recursing from the same index, and avoid duplicate sets by never looking back to earlier candidates. Stop a branch when the remaining target reaches 0 (record it) or drops below 0 (dead end).",
    inputOutput: ["candidates: distinct positive integers; target: the sum to reach.","Return all unique combinations that sum to target (a candidate may repeat within one).","Input: candidates = [2, 3, 6, 7], target = 7\nOutput: [[2, 2, 3], [7]]"],
    conceptChoices: ["Backtrack, recursing from the same index to allow reuse","Sort, then greedily take the largest candidates first","Enumerate every subset and keep those that sum to target"],
    algorithm: ["Keep a running combination and a list of completed ones.","Define backtrack(start, remaining): candidates you may still use begin at index start, and remaining is the target minus what you have chosen.",["Base case: remaining is 0 — record a COPY of the current combination and stop this branch.","Dead end: remaining is below 0 — abandon this branch."],"Loop i over the candidates from index start onward.",{"seq":["Choose candidates[i]: push it onto the current combination.","Recurse from the SAME index i so the candidate can repeat, with remaining reduced by candidates[i].","Un-choose: pop candidates[i] before trying the next i."]},"Start with backtrack(0, target), then return the completed combinations."],
    fixes: ["Recurse from i (not i + 1) so the same candidate can be reused.","Record a COPY of the current combination, or later push/pop mutations corrupt it."],
    complexity: "Time exponential in the worst case (bounded by the number of valid combinations); space O(target / smallest candidate) for the recursion depth.",
    exercises: [{"prompt":"Which line lets a candidate be reused within the same combination?","correct":"backtrack(i, remaining - candidates[i]);","choices":["backtrack(i, remaining - candidates[i]);","backtrack(i + 1, remaining - candidates[i]);","backtrack(i, remaining);"],"why":"Recursing from i (not i + 1) allows candidates[i] to be chosen again; reducing remaining tracks the running sum.","wrong":{"backtrack(i + 1, remaining - candidates[i]);":"Advancing to i + 1 forbids reuse, so combinations that repeat a number are missed.","backtrack(i, remaining);":"Not reducing remaining never makes progress toward 0 — it recurses forever."}},{"prompt":"Which line records a finished combination without aliasing it?","correct":"result.push([...current]);","choices":["result.push([...current]);","result.push(current);","current.push([...result]);"],"why":"A copy freezes this combination; pushing current itself stores a reference the later push/pop mutate.","wrong":{"result.push(current);":"This stores a live reference, so every later push and pop rewrites the saved combination.","current.push([...result]);":"This mutates current with a copy of result — backwards, and it records nothing."}}],
    complexityGuide: {"work":"What bounds the number of recursive calls?","workChoices":[["tree","The size of the choice tree (exponential)"],["linear","One call per candidate"]],"workCorrect":"tree","workWhy":"Each call branches over the remaining candidates, so the work tracks the combination tree.","memory":"What sets the extra space (besides the output)?","memoryChoices":[["depth","The recursion depth, ~target / smallest candidate"],["constant","A fixed amount"]],"memoryCorrect":"depth","memoryWhy":"One running combination is active along the current root-to-leaf path.","final":[["exp-depth","Time exponential, space O(depth)"],["n-constant","Time O(n), space O(1)"],["nlogn-depth","Time O(n log n), space O(depth)"]],"finalCorrect":"exp-depth"},
  }),
  'House Robber': lesson('House Robber', {
    brief: "Rob houses in a row for the maximum total, but never two adjacent houses.",
    concepts: ["1-D dynamic programming","Take-vs-skip running totals"],
    intuition: "Carry two running totals: 'take' (the best if you rob the current house) and 'skip' (the best if you don't). Robbing the current house adds its value to whatever was best when the previous house was skipped, so slide both totals forward one house at a time.",
    inputOutput: ["nums[i]: the money in house i.","Return the maximum total with no two adjacent houses robbed.","Input: nums = [2, 7, 9, 3, 1]\nOutput: 12, from houses 2 + 9 + 1"],
    conceptChoices: ["Track a rob-this vs skip-this running total","Greedily take every other house","Sort houses by value and take the top half"],
    algorithm: ["Keep two running totals: take (best ending by robbing the current house) and skip (best ending by skipping it), both starting at 0.","Scan each house value.","Capture current — the best total up to the previous house, the larger of take and skip.","Robbing this house sets take = skip + value (its adjacent previous house had to be skipped).","Skipping this house sets skip = current (carry the previous best forward).","After the scan, the answer is the larger of take and skip."],
    fixes: ["Rob the current house by adding value to skip (previous skipped), never to take (that would be adjacent).","Save the previous best into current before overwriting take and skip."],
    complexity: "Time O(n); space O(1).",
    exercises: [{"prompt":"Which line's value is the best total that robs the current house?","correct":"take = skip + value;","choices":["take = skip + value;","take = take + value;","skip = skip + value;"],"why":"Robbing this house means its value plus the best total where the previous (adjacent) house was skipped.","wrong":{"take = take + value;":"Adding to take would rob two adjacent houses.","skip = skip + value;":"skip means this house is NOT robbed, so its value should not be added."}},{"prompt":"Which line captures the best total up to the previous house?","correct":"const current = Math.max(take, skip);","choices":["const current = Math.max(take, skip);","const current = Math.min(take, skip);","const current = take + skip;"],"why":"Before updating, the best total up to the previous house is the larger of the two running totals.","wrong":{"const current = Math.min(take, skip);":"The best is the maximum, not the minimum.","const current = take + skip;":"These are alternative totals, not additive."}}],
    complexityGuide: {"work":"How many passes over the houses are needed?","workChoices":[["once","A single pass"],["nested","A pass per house"]],"workCorrect":"once","workWhy":"One scan with constant work per house.","memory":"What extra storage grows with the input?","memoryChoices":[["constant","Only two running totals"],["linear","A total per house"]],"memoryCorrect":"constant","memoryWhy":"Just take and skip are kept.","final":[["linear-constant","Time O(n), space O(1)"],["linear-linear","Time O(n), space O(n)"],["quadratic-constant","Time O(n²), space O(1)"]],"finalCorrect":"linear-constant"},
  }),
  'House Robber II': lesson('House Robber II', {
    brief: "Same as House Robber, but the houses form a circle — the first and last are adjacent.",
    concepts: ["Circular DP","Reduce to two linear passes"],
    intuition: "Because the row wraps into a circle, the first and last houses are neighbors, so you can never take both. Solve two ordinary line problems — one dropping the last house, one dropping the first — and take the better.",
    inputOutput: ["nums[i]: the money in house i, arranged in a circle.","Return the maximum total with no two adjacent (including first/last) robbed.","Input: nums = [2, 3, 2]\nOutput: 3, since houses 0 and 2 are adjacent"],
    conceptChoices: ["Run the linear solution twice, excluding the first or last house","Rob every other house around the circle","Break the smallest house and solve one line"],
    algorithm: ["Reuse the linear House Robber solution as a helper on any slice of houses.","Handle the single-house edge case: with one house there is no neighbor, so return it directly.","Otherwise run the helper on the houses excluding the last one.","Run the helper again on the houses excluding the first one.","Return the larger of the two results — the best that never robs both ends."],
    fixes: ["Exclude the first OR the last house from each pass — never rob both ends.","Special-case a single house, whose one slice would otherwise be empty."],
    complexity: "Time O(n); space O(1).",
    exercises: [{"prompt":"Which line combines the two passes that each drop one end?","correct":"return Math.max(rob(nums.slice(0, -1)), rob(nums.slice(1)));","choices":["return Math.max(rob(nums.slice(0, -1)), rob(nums.slice(1)));","return Math.max(rob(nums.slice(0, -1)), rob(nums));","return rob(nums);"],"why":"One pass excludes the last house and one excludes the first, so the first and last are never both taken.","wrong":{"return Math.max(rob(nums.slice(0, -1)), rob(nums));":"The second call still includes both ends, which the circle forbids.","return rob(nums);":"Running the plain linear solution ignores the first/last adjacency."}},{"prompt":"Which line handles the single-house circle?","correct":"if (nums.length === 1) return nums[0];","choices":["if (nums.length === 1) return nums[0];","if (nums.length === 1) return 0;","if (nums.length === 0) return nums[0];"],"why":"With one house there is no neighbor to conflict, so just take it — and it avoids an empty slice.","wrong":{"if (nums.length === 1) return 0;":"Returning 0 throws away the only house available.","if (nums.length === 0) return nums[0];":"nums[0] on an empty array is undefined; this guards the wrong size."}}],
    complexityGuide: {"work":"How much work beyond a couple of linear scans?","workChoices":[["linear","Two linear passes → still O(n)"],["quadratic","A pass per house"]],"workCorrect":"linear","workWhy":"Two O(n) passes are still O(n) overall.","memory":"What extra storage is used?","memoryChoices":[["constant","A few running values"],["linear","A DP array per pass"]],"memoryCorrect":"constant","memoryWhy":"Each pass keeps only rob1/rob2.","final":[["linear-constant","Time O(n), space O(1)"],["quadratic-constant","Time O(n²), space O(1)"],["linear-linear","Time O(n), space O(n)"]],"finalCorrect":"linear-constant"},
  }),
  'Max Area of Island': lesson('Max Area of Island', {
    brief: "Return the number of cells in the largest connected group of land (1s) in a grid.",
    concepts: ["Grid flood fill (DFS)","Sink-and-count visited land"],
    intuition: "Every unvisited land cell starts a new island; flood-fill outward counting cells and sinking each one to 0 as you go, so no cell is counted twice. The largest such count is the answer.",
    inputOutput: ["grid: a matrix of 1 (land) and 0 (water).","Return the size (in cells) of the largest connected island, or 0.","Input: grid = [[1,1,0],[1,0,0],[0,0,1]]\nOutput: 3"],
    conceptChoices: ["Flood-fill each island, sinking cells and counting","Count the total land cells","Scan each row for the longest run of 1s"],
    algorithm: ["Define a flood fill area(r, c) that returns the size of the island reachable from a cell.","Its base case returns 0 for anything out of bounds or on water (a 0 cell).","Otherwise sink the current land cell to 0 so it is never counted again.","Return 1 for this cell plus the areas flooded from its four neighbors.","Scan every cell, take the flood-fill area from each, and keep the largest."],
    fixes: ["Sink the cell to 0 the moment you enter it, or the four recursions revisit it forever.","Count this cell as 1 plus the four neighbor areas, not just the neighbors."],
    complexity: "Time O(rows · cols); space O(rows · cols) for the recursion in the worst case.",
    exercises: [{"prompt":"Which line stops the same cell from being counted twice?","correct":"grid[r][c] = 0;","choices":["grid[r][c] = 0;","grid[r][c] = 1;","return 0;"],"why":"Sinking the visited land cell to water means the recursions never flood back into it.","wrong":{"grid[r][c] = 1;":"Leaving it as land lets the neighbors recurse back in endlessly.","return 0;":"Returning here counts nothing and abandons the island early."}},{"prompt":"Which line returns this island's size from the cell and its neighbors?","correct":"return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);","choices":["return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);","return area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);","return 1;"],"why":"This cell counts as 1, plus everything flooded from its four neighbors.","wrong":{"return area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);":"Dropping the + 1 never counts the current cell.","return 1;":"This counts only the current cell and never floods outward."}}],
    complexityGuide: {"work":"How many times is each cell visited?","workChoices":[["once","At most once (then sunk)"],["nested","Once per neighbor of every cell"]],"workCorrect":"once","workWhy":"Sinking each cell to 0 means it is entered a single time.","memory":"What can grow with the grid?","memoryChoices":[["stack","The recursion stack, up to all cells"],["constant","Only r and c"]],"memoryCorrect":"stack","memoryWhy":"A single snaking island can push a call per cell.","final":[["area-area","Time O(rows · cols), space O(rows · cols)"],["area-constant","Time O(rows · cols), space O(1)"],["quadratic-area","Time O((rows · cols)²), space O(rows · cols)"]],"finalCorrect":"area-area"},
  }),
  'Clone Graph': lesson('Clone Graph', {
    brief: "Deep-copy a connected undirected graph, returning the clone of the given start node.",
    concepts: ["DFS with a visited map","Original → clone lookup"],
    intuition: "Walk the graph once, and the moment you first see a node make its clone and record original→clone before recursing — so when a cycle leads back to it you return the existing clone instead of copying forever.",
    inputOutput: ["node: a node in a connected undirected graph (val + neighbors).","Return the corresponding node in a full deep copy of the graph.","Input: adjacency [[2,4],[1,3],[2,4],[1,3]]\nOutput: an identical, independent graph"],
    conceptChoices: ["DFS, mapping each original node to its clone","Copy each node ignoring shared neighbors","Serialize to a string and parse it back"],
    algorithm: ["Keep a map from each original node to its clone.","Define dfs(node): return null for a null node.","If the node is already cloned, return the stored clone (this breaks cycles).","Otherwise create the clone and record original → clone BEFORE recursing.","Recurse into each neighbor, pushing the cloned neighbor onto the clone.","Kick off the DFS from the start node and return its clone."],
    fixes: ["Register the clone in the map before recursing, or a cycle clones the node endlessly.","Recurse to clone each neighbor rather than sharing the original neighbor objects."],
    complexity: "Time O(V + E); space O(V) for the map and recursion.",
    exercises: [{"prompt":"Which line stops a cycle from cloning a node again?","correct":"if (clones.has(node)) return clones.get(node);","choices":["if (clones.has(node)) return clones.get(node);","if (clones.has(node)) return node;","if (!clones.has(node)) return clones.get(node);"],"why":"Once a node is cloned, returning that clone breaks the cycle instead of recursing forever.","wrong":{"if (clones.has(node)) return node;":"Returning the original mixes source and copy into one graph.","if (!clones.has(node)) return clones.get(node);":"Inverted: it returns a missing clone for brand-new nodes."}},{"prompt":"Which line lets cycles resolve to the right clone?","correct":"clones.set(node, copy);","choices":["clones.set(node, copy);","clones.set(copy, node);","clones.set(node.val, copy);"],"why":"Recording original → clone before recursing means a neighbor that loops back finds this clone.","wrong":{"clones.set(copy, node);":"The key must be the original node, not its clone.","clones.set(node.val, copy);":"Keying by val collides when two nodes share a value."}}],
    complexityGuide: {"work":"How many nodes and edges are processed?","workChoices":[["ve","Each node once, each edge once"],["quadratic","Every node against every other"]],"workCorrect":"ve","workWhy":"The DFS visits each node once and walks each edge once.","memory":"What grows with the graph size?","memoryChoices":[["nodes","The map and recursion, one entry per node"],["constant","A fixed amount"]],"memoryCorrect":"nodes","memoryWhy":"Every node gets a map entry and can sit on the call stack.","final":[["ve-v","Time O(V + E), space O(V)"],["v2-v","Time O(V²), space O(V)"],["ve-constant","Time O(V + E), space O(1)"]],"finalCorrect":"ve-v"},
  }),
  'K Closest Points to Origin': lesson('K Closest Points to Origin', {
    brief: "Return the k points closest to the origin (0, 0).",
    concepts: ["Rank by squared distance","Partial selection (a heap of size k does it in O(n log k))"],
    intuition: "Closeness is fully decided by squared distance, so you never need the square root. Order points by that value and the k nearest are simply the first k.",
    inputOutput: ["points: a list of [x, y]; k: how many to return.","Return the k points nearest the origin, in any order.","Input: points = [[1, 3], [-2, 2]], k = 1\nOutput: [[-2, 2]]"],
    conceptChoices: ["Order by squared distance and take the first k","Compute exact distances with square roots first","Return the k points with the smallest x value"],
    algorithm: ["Define a distance key for a point: x² + y² (no square root needed for comparison).","Sort the points ascending by that squared distance.","The k nearest are now the first k points — return that prefix."],
    fixes: ["Rank by squared distance; the square root is monotonic and only wastes work.","Take the first k after sorting ascending, not the last k."],
    complexity: "Time O(n log n) by sorting (O(n log k) with a size-k max-heap); space O(n).",
    exercises: [{"prompt":"Which line ranks a point by its closeness to the origin?","correct":"return p[0] * p[0] + p[1] * p[1];","choices":["return p[0] * p[0] + p[1] * p[1];","return p[0] + p[1];","return Math.abs(p[0]) + Math.abs(p[1]);"],"why":"Squared Euclidean distance orders points identically to true distance, without a square root.","wrong":{"return p[0] + p[1];":"A raw coordinate sum is not distance and can be negative.","return Math.abs(p[0]) + Math.abs(p[1]);":"That is Manhattan distance, a different metric that reorders points."}},{"prompt":"Which line returns the k nearest points?","correct":"return points.slice(0, k);","choices":["return points.slice(0, k);","return points.slice(0, k + 1);","return points.slice(k);"],"why":"After sorting ascending, the closest k points are the first k.","wrong":{"return points.slice(0, k + 1);":"That returns one point too many.","return points.slice(k);":"That drops the nearest k and returns the rest."}}],
    complexityGuide: {"work":"What dominates the running time?","workChoices":[["sort","Sorting all n points"],["constant","A single scan"]],"workCorrect":"sort","workWhy":"Sorting is O(n log n); slicing is linear.","memory":"What storage grows with the input?","memoryChoices":[["linear","The list of points / sort"],["constant","Only k"]],"memoryCorrect":"linear","memoryWhy":"The points array (and sort) scales with n.","final":[["nlogn-linear","Time O(n log n), space O(n)"],["linear-constant","Time O(n), space O(1)"],["quadratic-linear","Time O(n²), space O(n)"]],"finalCorrect":"nlogn-linear"},
  }),
  'Permutation in String': lesson('Permutation in String', {
    brief: "Decide whether any permutation of s1 appears as a contiguous substring of s2.",
    concepts: ["Fixed-size sliding window","Letter-frequency match"],
    intuition: "A permutation is just a letter-count match, so slide a window of s1’s length across s2 and compare letter counts — add the incoming letter and drop the outgoing one at each step instead of recounting.",
    inputOutput: ["s1, s2: lowercase strings.","Return true if some window of s2 is a permutation of s1.","Input: s1 = \"ab\", s2 = \"eidbaooo\"\nOutput: true, from \"ba\""],
    conceptChoices: ["Slide a fixed window and compare letter counts","Sort s1 and check every substring of s2","Two pointers from both ends of s2"],
    algorithm: ["If s1 is longer than s2, no window can hold it — return false.","Build letter counts for s1 (need) and for the first window of s2 (win).","Slide the window across the rest of s2, checking for a count match before each move.","Add the incoming right-edge letter to the window counts.","Remove the outgoing left-edge letter (the one s1.length positions back).","Return whether the final window matches."],
    fixes: ["Drop the letter leaving the LEFT edge (index i - s1.length), not the incoming one.","Compare full 26-letter counts; equal counts mean a permutation, regardless of order."],
    complexity: "Time O(n) over s2 (each step compares 26 fixed counts); space O(1).",
    exercises: [{"prompt":"Which line drops the letter that just left the window?","correct":"win[code(s2[i - s1.length])]--;","choices":["win[code(s2[i - s1.length])]--;","win[code(s2[i - s1.length])]++;","win[code(s2[i])]--;"],"why":"As the window slides right, the letter s1.length positions back leaves the window and its count drops.","wrong":{"win[code(s2[i - s1.length])]++;":"Incrementing the outgoing letter keeps it in the window forever.","win[code(s2[i])]--;":"That removes the letter you just added on the right edge."}},{"prompt":"Which line tallies s1's target letter counts?","correct":"need[code(s1[i])]++;","choices":["need[code(s1[i])]++;","win[code(s1[i])]++;","need[code(s2[i])]++;"],"why":"need holds the letter frequencies the window must match, taken from s1.","wrong":{"win[code(s1[i])]++;":"That adds s1’s letters to the window instead of the target.","need[code(s2[i])]++;":"The target counts come from s1, not s2."}}],
    complexityGuide: {"work":"How many times is each character of s2 handled?","workChoices":[["once","Added and removed at most once"],["nested","Compared against every other"]],"workCorrect":"once","workWhy":"Each edge moves forward only; the count compare is a fixed 26 work.","memory":"What bounds the extra storage?","memoryChoices":[["alphabet","Two 26-length count arrays"],["string","A copy of s2"]],"memoryCorrect":"alphabet","memoryWhy":"Only fixed 26-entry frequency arrays are kept.","final":[["linear-constant","Time O(n), space O(1)"],["linear-linear","Time O(n), space O(n)"],["quadratic-constant","Time O(n²), space O(1)"]],"finalCorrect":"linear-constant"},
  }),
  'Add Two Numbers': lesson('Add Two Numbers', {
    brief: "Add two numbers stored as digit-per-node linked lists in reverse order; return the sum as the same kind of list.",
    concepts: ["Elementary addition with carry","Dummy head + tail pointer"],
    intuition: "It is grade-school addition: walk both lists together adding digit + digit + carry, write the ones digit into a new node, carry the tens, and keep going while either list or a leftover carry remains.",
    inputOutput: ["l1, l2: heads of reverse-order digit lists.","Return the head of the reverse-order sum list.","Input: 2→4→3 and 5→6→4 (342 + 465)\nOutput: 7→0→8 (807)"],
    conceptChoices: ["Add digit by digit with a running carry","Convert both lists to integers, add, and rebuild","Reverse both lists first, then add"],
    algorithm: ["Make a dummy head node and point a tail at it to build the result.","Loop while either list has nodes or a carry remains.","Sum the two current digits (0 when a list is exhausted) plus the carry.","The new carry is the tens part; append a node holding the ones part.","Advance the tail, and advance each input list that still has nodes.","Return dummy.next, the head of the built list."],
    fixes: ["Keep looping while a carry remains, even after both lists end.","Append the ones digit (sum % 10) and carry the tens digit (sum / 10 floored)."],
    complexity: "Time O(max(m, n)); space O(max(m, n)) for the output list.",
    exercises: [{"prompt":"Which line computes the digit carried into the next place?","correct":"carry = Math.floor(sum / 10);","choices":["carry = Math.floor(sum / 10);","carry = sum % 10;","carry = sum / 10;"],"why":"The carry is the tens part of the column sum, i.e. sum divided by 10, floored.","wrong":{"carry = sum % 10;":"sum % 10 is the ones digit you write down, not the carry.","carry = sum / 10;":"Without flooring this keeps a fraction, corrupting later digits."}},{"prompt":"Which line writes the current output digit?","correct":"tail.next = new ListNode(sum % 10);","choices":["tail.next = new ListNode(sum % 10);","tail.next = new ListNode(sum);","tail.next = new ListNode(carry);"],"why":"Each node stores a single digit — the ones part of the column sum.","wrong":{"tail.next = new ListNode(sum);":"sum can be two digits (e.g. 13), which is not a valid single-digit node.","tail.next = new ListNode(carry);":"The carry belongs in the NEXT column, not this node."}}],
    complexityGuide: {"work":"How many nodes are processed?","workChoices":[["max","About max(m, n) columns"],["product","m times n"]],"workCorrect":"max","workWhy":"One pass down the longer list (plus a possible final carry).","memory":"What grows with the inputs?","memoryChoices":[["output","The output list, ~max(m, n) nodes"],["constant","Only a few pointers"]],"memoryCorrect":"output","memoryWhy":"A node is created per output digit.","final":[["max-max","Time O(max(m, n)), space O(max(m, n))"],["product-constant","Time O(m · n), space O(1)"],["max-constant","Time O(max(m, n)), space O(1)"]],"finalCorrect":"max-max"},
  }),
  'Non-overlapping Intervals': lesson('Non-overlapping Intervals', {
    brief: "Return the minimum number of intervals to remove so the rest do not overlap.",
    concepts: ["Greedy by earliest end","Keep-vs-drop count"],
    intuition: "Sorting by earliest finish is the classic activity-selection greedy: always keep the interval that ends soonest, because it leaves the most room for the rest — every interval that starts before the last kept one ends must be removed.",
    inputOutput: ["intervals: a list of [start, end] pairs.","Return the fewest removals so no two remaining intervals overlap.","Input: [[1,2],[2,3],[3,4],[1,3]]\nOutput: 1, removing [1,3]"],
    conceptChoices: ["Sort by end time; keep the earliest-ending non-overlapping intervals","Sort by start time and keep the longest intervals","Remove the interval that overlaps the most others, repeatedly"],
    algorithm: ["Sort the intervals by their end value.","Track the end of the last interval you kept, starting at negative infinity.","Scan the sorted intervals.",["If the current interval starts at or after the last kept end, keep it — advance prevEnd to its end.","Otherwise it overlaps, so count one removal and leave prevEnd unchanged."],"Return the number of removals."],
    fixes: ["Sort by END, not start — keeping the earliest finisher maximizes room.","Touching intervals ([1,2] then [2,3]) do not overlap, so keep when start ≥ prevEnd."],
    complexity: "Time O(n log n) for the sort; space O(1).",
    exercises: [{"prompt":"Which line orders the intervals for the greedy choice?","correct":"intervals.sort((a, b) => a[1] - b[1]);","choices":["intervals.sort((a, b) => a[1] - b[1]);","intervals.sort((a, b) => a[0] - b[0]);","intervals.sort((a, b) => b[1] - a[1]);"],"why":"Sorting by earliest end lets you always keep the interval that frees up the most room.","wrong":{"intervals.sort((a, b) => a[0] - b[0]);":"Sorting by start can keep a long early interval that blocks many others.","intervals.sort((a, b) => b[1] - a[1]);":"Descending by end keeps the latest finisher — the opposite of the greedy rule."}},{"prompt":"Which line decides an interval can be kept?","correct":"if (start >= prevEnd) {","choices":["if (start >= prevEnd) {","if (start > prevEnd) {","if (start <= prevEnd) {"],"why":"An interval starting at or after the last kept end does not overlap it, so keep it (touching is allowed).","wrong":{"if (start > prevEnd) {":"A strict > wrongly removes touching intervals like [1,2] and [2,3].","if (start <= prevEnd) {":"This keeps the overlapping ones and drops the good ones."}}],
    complexityGuide: {"work":"What dominates the running time?","workChoices":[["sort","Sorting the intervals"],["scan","The single scan"]],"workCorrect":"sort","workWhy":"The scan is linear; sorting is the O(n log n) part.","memory":"What extra storage is used?","memoryChoices":[["constant","A count and the last end"],["linear","A copy of the intervals"]],"memoryCorrect":"constant","memoryWhy":"Only prevEnd and count are kept.","final":[["nlogn-constant","Time O(n log n), space O(1)"],["linear-constant","Time O(n), space O(1)"],["quadratic-constant","Time O(n²), space O(1)"]],"finalCorrect":"nlogn-constant"},
  }),
};

// Single source of authored lesson records (all self-contained; migrated from the former featuredCore).
export const featured = { ...walkthroughUpgrades };
