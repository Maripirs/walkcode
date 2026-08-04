// Extra worked examples and optional fuller problem descriptions for the Understand step.
// Kept in one place, keyed by problem title, so the Recognize panel can show more than the
// single primary example in `inputOutput[2]`.
//
//   examplesByTitle[title]  -> [{ input, output, note? }, ...]   additional cases beyond the
//                             primary example; rendered in a collapsible "More examples" panel.
//                             input/output show as a code block; note is a short plain remark.
//   descriptionsByTitle[title] -> string   a fuller problem statement (framing + constraints,
//                             no approach spoilers), shown under "What you're solving".
//
// Neither field affects `isComplete` — they're enrichment, not part of the Built gate. Author
// every output from the real solution so it stays correct; see the matching lesson record.

export const examplesByTitle = {
  'Contains Duplicate': [
    { input: 'nums = [1, 2, 3, 4]', output: 'false', note: 'Every value is distinct, so nothing repeats.' },
    { input: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', output: 'true', note: 'Many values repeat — the first repeat you meet is enough.' },
  ],
  'Valid Anagram': [
    { input: 's = "rat", t = "car"', output: 'false', note: 'Same length, but the letters and their counts differ.' },
    { input: 's = "a", t = "ab"', output: 'false', note: 'Different lengths can never be anagrams.' },
  ],
  'Group Anagrams': [
    { input: 'strs = ["abc", "bca", "xyz"]', output: '[["abc", "bca"], ["xyz"]]', note: '"abc" and "bca" share a sorted fingerprint; "xyz" stands alone.' },
    { input: 'strs = [""]', output: '[[""]]', note: 'A single empty string is its own one-member group.' },
  ],
  'Top K Frequent Elements': [
    { input: 'nums = [4, 4, 4, 6, 6, 7, 7, 7, 7], k = 2', output: '[7, 4]', note: '7 appears 4 times and 4 appears 3 times — the two most frequent.' },
    { input: 'nums = [1], k = 1', output: '[1]', note: 'One value, asked for the top 1.' },
  ],
  'Product of Array Except Self': [
    { input: 'nums = [1, 2, 0, 4]', output: '[0, 0, 8, 0]', note: 'Only the zero’s slot gets the product of the others (1×2×4 = 8); every other slot is 0.' },
    { input: 'nums = [-1, 1, 0, -3, 3]', output: '[0, 0, 9, 0, 0]', note: 'A single zero plus negatives: the zero’s slot is (-1)(1)(-3)(3) = 9.' },
  ],
  'Longest Consecutive Sequence': [
    { input: 'nums = []', output: '0', note: 'No numbers, so the longest run has length 0.' },
    { input: 'nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', output: '9', note: '0 through 8 form one run; the duplicate 0 does not extend it.' },
  ],
  'Valid Palindrome': [
    { input: 's = "race a car"', output: 'false', note: 'Ignoring the space it reads "raceacar", which is not the same backward.' },
    { input: 's = "  ,  "', output: 'true', note: 'With no letters or digits left, it is vacuously a palindrome.' },
  ],
  '3Sum': [
    { input: 'nums = [0, 1, 1]', output: '[]', note: 'No three values add to zero.' },
    { input: 'nums = [0, 0, 0]', output: '[[0, 0, 0]]', note: 'The only triple is three zeros, listed once.' },
  ],
  'Best Time to Buy and Sell Stock': [
    { input: 'prices = [7, 6, 4, 3, 1]', output: '0', note: 'Prices only fall, so no trade beats doing nothing.' },
    { input: 'prices = [2, 4, 1]', output: '2', note: 'Buy at 2, sell at 4; the later dip to 1 is irrelevant.' },
  ],
  'Longest Repeating Character Replacement': [
    { input: 's = "AAAA", k = 0', output: '4', note: 'Already one repeated letter — no replacements needed.' },
    { input: 's = "ABCDE", k = 1', output: '2', note: 'All distinct: one replacement can only unify a pair.' },
  ],
  'Min Stack': [
    { input: 'push(2), push(1), getMin(), pop(), getMin()', output: '1, then 2', note: 'getMin returns 1; popping the 1 uncovers the earlier minimum, 2.' },
    { input: 'push(5), top(), getMin()', output: '5, then 5', note: 'With one value, both the top and the minimum are it.' },
  ],
  'Evaluate Reverse Polish Notation': [
    { input: 'tokens = ["4", "13", "5", "/", "+"]', output: '6', note: '13 / 5 truncates toward zero to 2, then 4 + 2 = 6.' },
    { input: 'tokens = ["3", "4", "-"]', output: '-1', note: 'Order matters: the earlier value minus the later one, 3 - 4.' },
  ],
  'Daily Temperatures': [
    { input: 'temperatures = [30, 40, 50, 60]', output: '[1, 1, 1, 0]', note: 'Each next day is warmer; the last day has no warmer day ahead.' },
    { input: 'temperatures = [60, 50, 40, 30]', output: '[0, 0, 0, 0]', note: 'It only cools, so no day ever waits for warmth.' },
  ],
  'Reverse Linked List': [
    { input: '1 → null', output: '1 → null', note: 'A single node reverses to itself.' },
    { input: 'null', output: 'null', note: 'An empty list stays empty.' },
  ],
  'Merge Two Sorted Lists': [
    { input: 'list1 = [], list2 = 5 → 7', output: '5 → 7', note: 'Merging with an empty list returns the other unchanged.' },
    { input: 'list1 = [], list2 = []', output: '[]', note: 'Two empty lists merge to an empty list.' },
  ],
  'Invert Binary Tree': [
    { input: 'root = [4, 2, 7, 1, 3, 6, 9]', output: '[4, 7, 2, 9, 6, 3, 1]', note: 'Every node’s children swap, top to bottom.' },
    { input: 'root = []', output: '[]', note: 'An empty tree has nothing to invert.' },
  ],
  'Maximum Depth of Binary Tree': [
    { input: 'root = []', output: '0', note: 'An empty tree has depth 0.' },
    { input: 'root = [1, 2, null, 3]', output: '3', note: 'A lopsided chain 1 → 2 → 3 is as deep as it is long.' },
  ],
  'Diameter of Binary Tree': [
    { input: 'root = [1]', output: '0', note: 'One node has no edges, so the diameter is 0.' },
    { input: 'root = [1, 2]', output: '1', note: 'A single parent-child link is one edge.' },
  ],
  'Kth Largest Element in an Array': [
    { input: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4', output: '4', note: 'Sorted descending is 6, 5, 5, 4, … — duplicates each take a rank, so the 4th is 4.' },
    { input: 'nums = [1], k = 1', output: '1', note: 'The largest of one value is that value.' },
  ],
  'Course Schedule': [
    { input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]', output: 'false', note: '0 needs 1 and 1 needs 0 — a cycle, so neither can start.' },
    { input: 'numCourses = 3, prerequisites = []', output: 'true', note: 'With no prerequisites, any order works.' },
  ],
  'Climbing Stairs': [
    { input: 'n = 2', output: '2', note: 'Two ways: 1 + 1, or a single 2-step.' },
    { input: 'n = 5', output: '8', note: 'The counts grow like Fibonacci: 1, 2, 3, 5, 8.' },
  ],
  'Coin Change': [
    { input: 'coins = [2], amount = 3', output: '-1', note: 'Only 2s can never total an odd amount.' },
    { input: 'coins = [1, 2, 5], amount = 0', output: '0', note: 'Zero amount needs zero coins.' },
  ],
  'Distinct Subsequences': [
    { input: 's = "babgbag", t = "bag"', output: '5', note: 'Five different position-choices in s spell "bag".' },
    { input: 's = "abc", t = "abcd"', output: '0', note: 't is longer than s, so it cannot appear at all.' },
  ],
  'Two Sum II': [
    { input: 'numbers = [2, 3, 4], target = 6', output: '[1, 3]', note: 'Values 2 and 4 sum to 6; positions are 1-indexed.' },
    { input: 'numbers = [-1, 0], target = -1', output: '[1, 2]', note: 'Negatives are fine as long as the array stays sorted.' },
  ],
  'Longest Substring Without Repeating Characters': [
    { input: 's = "bbbbb"', output: '1', note: 'Every character is the same, so the best window is a single letter.' },
    { input: 's = "pwwkew"', output: '3', note: 'The answer "wke" is a contiguous substring, not the subsequence "pwke".' },
  ],
  'Binary Search': [
    { input: 'nums = [-1, 0, 3, 5, 9], target = 2', output: '-1', note: '2 is absent, so the search reports -1.' },
    { input: 'nums = [5], target = 5', output: '0', note: 'A single matching element sits at index 0.' },
  ],
  'Valid Parentheses': [
    { input: 's = "(]"', output: 'false', note: 'The closer does not match the most recent opener.' },
    { input: 's = "([)]"', output: 'false', note: 'Brackets must nest, not interleave.' },
  ],
  'Number of Islands': [
    { input: 'grid = [["0", "0"], ["0", "0"]]', output: '0', note: 'All water — there are no islands.' },
    { input: 'grid = [["1", "1"], ["1", "1"]]', output: '1', note: 'All land is connected, so it counts as one island.' },
  ],
};

export const descriptionsByTitle = {
  '3Sum': 'Given an integer array nums, find every group of three values at different positions that sum to zero. Each distinct numeric triple must appear only once even when the array repeats values, so [-1, -1, 2] is listed a single time. The order of the triples, and of the numbers within each triple, does not matter.',
  'Product of Array Except Self': 'For each index i, return the product of every element except nums[i]. You may not use the division operator, and the array can contain zeros and negative numbers — exactly the cases a naive "multiply everything, then divide" approach gets wrong.',
  'Longest Repeating Character Replacement': 'You may change at most k characters of the uppercase string s, each to any uppercase letter. Return the length of the longest substring that can be turned into a single repeated letter after those changes. The replacements may target different letters, and you do not have to use all k.',
  'Min Stack': 'Design a stack supporting push, pop, top, and getMin, where getMin returns the smallest value currently held. Every operation — getMin included — must run in constant time, so you cannot scan the stack when the minimum is requested. pop, top, and getMin are only called on a non-empty stack.',
  'Kth Largest Element in an Array': 'Return the kth largest element by value in sorted order — not the kth distinct value. If the array were sorted from largest to smallest, it is the element at position k; repeated values each take their own rank, so in [3, 2, 3, 1, 2, 4, 5, 5, 6] the 4th largest is 4.',
  'Course Schedule': 'There are numCourses courses labeled 0 to numCourses - 1. Each pair [a, b] in prerequisites means course b must be finished before course a. Return true if some order lets you complete every course, and false if the requirements make that impossible.',
  'Coin Change': 'You have an unlimited supply of coins in each given denomination. Return the fewest coins whose values sum exactly to amount, or -1 if no combination reaches it. An amount of 0 needs zero coins.',
  'Distinct Subsequences': 'A subsequence is formed by deleting zero or more characters of s without reordering the rest. Count how many distinct choices of positions in s spell out t exactly — two ways differ if they pick different positions, even when the letters they land on are identical. The answer is guaranteed to fit in a 32-bit signed integer.',
};
