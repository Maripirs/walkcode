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
};
