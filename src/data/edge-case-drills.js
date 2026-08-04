// Edge-case drills (M10) — show a complete function and ask which input produces a notable result
// (an empty/boundary case, an "impossible" answer, a degenerate input). This trains reasoning about
// which inputs are special, complementing predict (trace one input) and debug (find a fault).
//
// Shape (per drill): the value-level fields are language-agnostic (the input literals are identical
// in JS and Python — lists, strings, ints), so only the function `code`/`call` differ per language.
//   prompt                        the question ("Which input makes f return X?")
//   code / pythonCode             the full function
//   call / pythonCall             the function name to invoke
//   choices                       candidate inputs, shown as argument literals (e.g. "[1, 2], 3")
//   correct                       the one input that yields `target`
//   target                        the return value the correct input produces (JSON-comparable)
//   why / wrong                   feedback (wrong keyed by the choice literal)
//
// The validator EXECUTES the JS variant: it runs `call(choice)` for every choice and requires the
// correct one to equal `target` and every other one to differ — so the question has a single answer.

export const edgeCaseDrills = {
  'Best Time to Buy and Sell Stock': [
    {
      prompt: 'Which input makes maxProfit return 0 (no profitable trade)?',
      code: 'function maxProfit(prices) {\n  let minPrice = Infinity;\n  let best = 0;\n  for (const price of prices) {\n    best = Math.max(best, price - minPrice);\n    minPrice = Math.min(minPrice, price);\n  }\n  return best;\n}',
      pythonCode: 'def max_profit(prices):\n    min_price = float("inf")\n    best = 0\n    for price in prices:\n        best = max(best, price - min_price)\n        min_price = min(min_price, price)\n    return best',
      call: 'maxProfit',
      pythonCall: 'max_profit',
      choices: ['[7, 6, 4, 3, 1]', '[1, 5]', '[2, 4, 1]', '[5, 10]'],
      correct: '[7, 6, 4, 3, 1]',
      target: '0',
      why: 'Prices only fall, so every later price is below an earlier one — no trade beats doing nothing.',
      wrong: {
        '[1, 5]': 'Buy at 1, sell at 5 → profit 4, not 0.',
        '[2, 4, 1]': 'Buy at 2, sell at 4 → profit 2.',
        '[5, 10]': 'Buy at 5, sell at 10 → profit 5.',
      },
    },
  ],
  'Binary Search': [
    {
      prompt: 'Which call returns -1 (the target isn’t found)?',
      code: 'function search(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
      pythonCode: 'def search(nums, target):\n    left = 0\n    right = len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
      call: 'search',
      pythonCall: 'search',
      choices: ['[1, 3, 5], 4', '[1, 3, 5], 5', '[1, 3, 5], 1', '[2, 4, 6], 4'],
      correct: '[1, 3, 5], 4',
      target: '-1',
      why: '4 isn’t in [1, 3, 5], so the window closes empty and the function returns -1.',
      wrong: {
        '[1, 3, 5], 5': '5 is present, at index 2.',
        '[1, 3, 5], 1': '1 is present, at index 0.',
        '[2, 4, 6], 4': '4 is present, at index 1.',
      },
    },
  ],
  'Longest Substring Without Repeating Characters': [
    {
      prompt: 'Which input makes lengthOfLongestSubstring return 1?',
      code: 'function lengthOfLongestSubstring(s) {\n  const seen = new Set();\n  let left = 0;\n  let best = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) seen.delete(s[left++]);\n    seen.add(s[right]);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',
      pythonCode: 'def length_of_longest_substring(s):\n    seen = set()\n    left = 0\n    best = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        best = max(best, right - left + 1)\n    return best',
      call: 'lengthOfLongestSubstring',
      pythonCall: 'length_of_longest_substring',
      choices: ['"aaaa"', '"abc"', '"abca"', '"ab"'],
      correct: '"aaaa"',
      target: '1',
      why: 'Every character is the same, so the longest repeat-free window is a single letter.',
      wrong: {
        '"abc"': 'All distinct — the whole string, length 3.',
        '"abca"': '"abc" (or "bca") gives a run of 3.',
        '"ab"': 'Two distinct letters give a window of 2.',
      },
    },
  ],
  'Coin Change': [
    {
      prompt: 'Which call returns -1 (the amount can’t be made)?',
      code: 'function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const coin of coins) {\n      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
      pythonCode: 'def coin_change(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for coin in coins:\n            if coin <= a:\n                dp[a] = min(dp[a], dp[a - coin] + 1)\n    return -1 if dp[amount] == float("inf") else dp[amount]',
      call: 'coinChange',
      pythonCall: 'coin_change',
      choices: ['[2], 3', '[1, 2], 3', '[5], 10', '[3, 5], 8'],
      correct: '[2], 3',
      target: '-1',
      why: 'With only a 2-coin you can reach even totals; 3 is odd and unreachable.',
      wrong: {
        '[1, 2], 3': '2 + 1 = 3, made in two coins.',
        '[5], 10': '5 + 5 = 10, made in two coins.',
        '[3, 5], 8': '3 + 5 = 8, made in two coins.',
      },
    },
  ],
  'Contains Duplicate': [
    {
      prompt: 'Which input makes hasDuplicate return false?',
      code: 'function hasDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}',
      pythonCode: 'def has_duplicate(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False',
      call: 'hasDuplicate',
      pythonCall: 'has_duplicate',
      choices: ['[1, 2, 3, 4]', '[1, 1]', '[2, 2, 3]', '[5, 6, 5]'],
      correct: '[1, 2, 3, 4]',
      target: 'false',
      why: 'Every value is distinct, so no repeat is ever found and it returns false.',
      wrong: {
        '[1, 1]': '1 appears twice, so it returns true.',
        '[2, 2, 3]': '2 repeats, so it returns true.',
        '[5, 6, 5]': '5 repeats, so it returns true.',
      },
    },
  ],
  'Valid Anagram': [
    {
      prompt: 'Which call returns false (not an anagram)?',
      code: 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const counts = {};\n  for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;\n  for (const ch of t) {\n    if (!counts[ch]) return false;\n    counts[ch]--;\n  }\n  return true;\n}',
      pythonCode: 'def is_anagram(s, t):\n    if len(s) != len(t):\n        return False\n    counts = {}\n    for ch in s:\n        counts[ch] = counts.get(ch, 0) + 1\n    for ch in t:\n        if counts.get(ch, 0) == 0:\n            return False\n        counts[ch] -= 1\n    return True',
      call: 'isAnagram',
      pythonCall: 'is_anagram',
      choices: ['"rat", "car"', '"listen", "silent"', '"a", "a"', '"ab", "ba"'],
      correct: '"rat", "car"',
      target: 'false',
      why: 'Their letters differ ("t" vs "c"), so a count hits zero and it returns false.',
      wrong: {
        '"listen", "silent"': 'Same letters rearranged — an anagram, so true.',
        '"a", "a"': 'Identical strings are anagrams, so true.',
        '"ab", "ba"': 'The same two letters swapped — an anagram, so true.',
      },
    },
  ],
  'Climbing Stairs': [
    {
      prompt: 'Which input makes climbStairs return 5?',
      code: 'function climbStairs(n) {\n  let one = 1;\n  let two = 1;\n  for (let step = 2; step <= n; step++) {\n    const current = one + two;\n    two = one;\n    one = current;\n  }\n  return one;\n}',
      pythonCode: 'def climb_stairs(n):\n    one = 1\n    two = 1\n    for step in range(2, n + 1):\n        current = one + two\n        two = one\n        one = current\n    return one',
      call: 'climbStairs',
      pythonCall: 'climb_stairs',
      choices: ['4', '3', '5', '2'],
      correct: '4',
      target: '5',
      why: 'The counts grow 1, 2, 3, 5, 8… — 5 ways is reached at n = 4.',
      wrong: {
        '3': 'n = 3 gives 3 ways.',
        '5': 'n = 5 gives 8 ways.',
        '2': 'n = 2 gives 2 ways.',
      },
    },
  ],
  'Longest Consecutive Sequence': [
    {
      prompt: 'Which input makes longestConsecutive return 1?',
      code: 'function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let best = 0;\n  for (const n of set) {\n    if (set.has(n - 1)) continue;\n    let length = 1;\n    while (set.has(n + length)) length++;\n    best = Math.max(best, length);\n  }\n  return best;\n}',
      pythonCode: 'def longest_consecutive(nums):\n    num_set = set(nums)\n    best = 0\n    for n in num_set:\n        if n - 1 in num_set:\n            continue\n        length = 1\n        while n + length in num_set:\n            length += 1\n        best = max(best, length)\n    return best',
      call: 'longestConsecutive',
      pythonCall: 'longest_consecutive',
      choices: ['[5, 1, 3]', '[1, 2, 3]', '[10, 11]', '[7, 8, 9, 10]'],
      correct: '[5, 1, 3]',
      target: '1',
      why: 'No two of 5, 1, 3 are consecutive, so the longest run is a single number.',
      wrong: {
        '[1, 2, 3]': '1-2-3 is a run of length 3.',
        '[10, 11]': '10-11 is a run of length 2.',
        '[7, 8, 9, 10]': '7-8-9-10 is a run of length 4.',
      },
    },
  ],
  'Number of Islands': [
    {
      prompt: 'Which grid makes numIslands return 0?',
      code: 'function numIslands(grid) {\n  let count = 0;\n  const rows = grid.length;\n  const cols = grid[0].length;\n  function sink(r, c) {\n    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") return;\n    grid[r][c] = "0";\n    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === "1") { count++; sink(r, c); }\n    }\n  }\n  return count;\n}',
      pythonCode: 'def num_islands(grid):\n    count = 0\n    rows, cols = len(grid), len(grid[0])\n\n    def sink(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":\n            return\n        grid[r][c] = "0"\n        sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                count += 1\n                sink(r, c)\n    return count',
      call: 'numIslands',
      pythonCall: 'num_islands',
      choices: ['[["0","0"],["0","0"]]', '[["1","0"],["0","0"]]', '[["1","1"],["1","1"]]', '[["1","0"],["0","1"]]'],
      correct: '[["0","0"],["0","0"]]',
      target: '0',
      why: 'The grid is all water, so there are no islands to count.',
      wrong: {
        '[["1","0"],["0","0"]]': 'One land cell is one island.',
        '[["1","1"],["1","1"]]': 'All the land is connected — one island.',
        '[["1","0"],["0","1"]]': 'Two land cells that don’t touch — two islands.',
      },
    },
  ],
  'Two Sum II': [
    {
      prompt: 'Which call returns [] (no pair sums to the target)?',
      code: 'function twoSum(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}',
      pythonCode: 'def two_sum(numbers, target):\n    left = 0\n    right = len(numbers) - 1\n    while left < right:\n        total = numbers[left] + numbers[right]\n        if total == target:\n            return [left + 1, right + 1]\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n    return []',
      call: 'twoSum',
      pythonCall: 'two_sum',
      choices: ['[2, 7, 11, 15], 100', '[2, 7, 11, 15], 9', '[1, 2, 3], 5', '[2, 7, 11, 15], 26'],
      correct: '[2, 7, 11, 15], 100',
      target: '[]',
      why: 'No two values reach 100, so the pointers cross and it returns an empty array.',
      wrong: {
        '[2, 7, 11, 15], 9': '2 + 7 = 9 → [1, 2].',
        '[1, 2, 3], 5': '2 + 3 = 5 → [2, 3].',
        '[2, 7, 11, 15], 26': '11 + 15 = 26 → [3, 4].',
      },
    },
  ],
  '3Sum': [
    {
      prompt: 'Which input makes threeSum return [] (no triple sums to zero)?',
      code: 'function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const triplets = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let left = i + 1;\n    let right = nums.length - 1;\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum < 0) left++;\n      else if (sum > 0) right--;\n      else {\n        triplets.push([nums[i], nums[left++], nums[right--]]);\n        while (nums[left] === nums[left - 1]) left++;\n        while (nums[right] === nums[right + 1]) right--;\n      }\n    }\n  }\n  return triplets;\n}',
      pythonCode: 'def three_sum(nums):\n    nums.sort()\n    triplets = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n            if total < 0:\n                left += 1\n            elif total > 0:\n                right -= 1\n            else:\n                triplets.append([nums[i], nums[left], nums[right]])\n                left += 1\n                right -= 1\n                while left < right and nums[left] == nums[left - 1]:\n                    left += 1\n                while left < right and nums[right] == nums[right + 1]:\n                    right -= 1\n    return triplets',
      call: 'threeSum',
      pythonCall: 'three_sum',
      choices: ['[1, 2, 4]', '[-1, 0, 1]', '[0, 0, 0]', '[-2, 1, 1]'],
      correct: '[1, 2, 4]',
      target: '[]',
      why: 'All the values are positive, so no three can sum to zero — the result is empty.',
      wrong: {
        '[-1, 0, 1]': '-1 + 0 + 1 = 0 → one triple.',
        '[0, 0, 0]': '0 + 0 + 0 = 0 → one triple.',
        '[-2, 1, 1]': '-2 + 1 + 1 = 0 → one triple.',
      },
    },
  ],
};
