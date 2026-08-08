// Curated interview-practice tracks. Each track is an ordered list of EXISTING built-problem
// titles, chosen for the topic mix and difficulty ramp of a particular interview style (kept
// deliberately generic — not named after any company). The titles here must match built cards;
// `cardsForTitles` (model.js) resolves them and re-sorts by difficulty so the ramp is always
// easy→hard even if this list is edited, and `validate-content.mjs` fails on any title that isn't
// a certified/built problem so a typo can't silently drop a problem from a track.
//
// This is pure data (no localStorage/DOM), so both the browser and Node (validate) can import it.
// Tracks reference shared content only — there is no per-track authoring, DB table, or API change.

export const collections = [
  {
    id: 'deep-algorithms',
    name: 'Algorithm Deep Dive',
    tagline: 'Search · graphs · DP · backtracking',
    description: 'Fewer problems, more depth. Graph traversal, dynamic programming, backtracking, '
      + 'and search — the kind that reward reasoning up from first principles rather than recalling '
      + 'a template. Work them in order; each leans on the ideas before it.',
    titles: [
      'Binary Search',
      'Number of Islands',
      'Course Schedule',
      'Clone Graph',
      'Coin Change',
      'Combination Sum',
      'Word Search',
      'Longest Increasing Subsequence',
      'Implement Trie (Prefix Tree)',
      'Rotting Oranges',
      'Network Delay Time',
      'Word Ladder',
      'Alien Dictionary',
      'Word Search II',
      'Median of Two Sorted Arrays',
    ],
  },
  {
    id: 'rapid-rounds',
    name: 'Rapid Rounds',
    tagline: 'Arrays · strings · hashing · trees',
    description: 'The high-frequency core: arrays, strings, hashing, two-pointers, sliding windows, '
      + 'and trees. These come up again and again — the goal is to recognize the pattern fast and '
      + 'write it cleanly under time pressure. Start easy and build up speed.',
    titles: [
      'Valid Palindrome',
      'Two Sum',
      'Best Time to Buy and Sell Stock',
      'Valid Parentheses',
      'Merge Two Sorted Lists',
      'Group Anagrams',
      'Product of Array Except Self',
      'Longest Substring Without Repeating Characters',
      '3Sum',
      'Binary Tree Level Order Traversal',
      'Lowest Common Ancestor of a Binary Search Tree',
      'Binary Tree Right Side View',
      'Subsets',
      'Kth Largest Element in an Array',
      'Merge Intervals',
    ],
  },
];

export const collectionsById = new Map(collections.map((c) => [c.id, c]));
