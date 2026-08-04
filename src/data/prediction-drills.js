// Behavior-prediction drills (M10): show a complete, self-contained function and a call, and ask
// the learner to predict the return value. This trains code tracing, complementing the fill-blank
// drills that train line synthesis. Keyed by problem title; each spec carries a JS and a Python
// variant of the same function (so it renders in the learner's language), while the value-level
// fields (choices/correct/why/wrong) are language-agnostic.
//
// The functions are kept deliberately simple and traceable by hand — no quickselect/DP tables —
// and every JS answer is EXECUTION-VERIFIED by server/scripts/validate-content.mjs (it runs the
// code against `input` and asserts it equals `correct`). Author the Python variant to mirror the
// JS logic exactly.

export const predictionDrills = {
  'Best Time to Buy and Sell Stock': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function maxProfit(prices) {\n  let minPrice = Infinity;\n  let best = 0;\n  for (const price of prices) {\n    best = Math.max(best, price - minPrice);\n    minPrice = Math.min(minPrice, price);\n  }\n  return best;\n}',
      pythonCode: 'def max_profit(prices):\n    min_price = float("inf")\n    best = 0\n    for price in prices:\n        best = max(best, price - min_price)\n        min_price = min(min_price, price)\n    return best',
      input: 'maxProfit([2, 4, 1, 7])',
      pythonInput: 'max_profit([2, 4, 1, 7])',
      choices: ['6', '5', '3', '7'],
      correct: '6',
      why: 'The cheapest price behind each day drops to 1; selling at 7 gives 7 − 1 = 6, the biggest gap.',
      wrong: {
        '5': '5 is 7 − 2, but 1 is a cheaper buy than 2.',
        '3': '3 is 4 − 1, but selling later at 7 beats that.',
        '7': '7 is the highest price, not a profit — you still had to buy first.',
      },
    },
  ],
  'Binary Search': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function search(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
      pythonCode: 'def search(nums, target):\n    left = 0\n    right = len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
      input: 'search([-1, 0, 3, 5, 9], 5)',
      pythonInput: 'search([-1, 0, 3, 5, 9], 5)',
      choices: ['3', '5', '2', '-1'],
      correct: '3',
      why: 'mid starts at index 2 (value 3 < 5), so left jumps to 3; index 3 holds 5, which is returned.',
      wrong: {
        '5': '5 is the target value, but the function returns its index, not the value.',
        '2': 'Index 2 holds 3, not the target — the search moves right from there.',
        '-1': '-1 means "not found", but 5 is present in the array.',
      },
    },
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function search(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
      pythonCode: 'def search(nums, target):\n    left = 0\n    right = len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
      input: 'search([1, 3, 5, 7], 4)',
      pythonInput: 'search([1, 3, 5, 7], 4)',
      choices: ['-1', '2', '1', '4'],
      correct: '-1',
      why: '4 is never found: the window narrows to nothing (left passes right), so the loop ends and returns -1.',
      wrong: {
        '2': 'Index 2 holds 5, not 4 — the target isn’t there.',
        '1': 'Index 1 holds 3, not 4; 4 isn’t in the array at all.',
        '4': '4 is the target value being searched for, not an index, and it isn’t present anyway.',
      },
    },
  ],
  'Daily Temperatures': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function dailyTemperatures(temperatures) {\n  const result = Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack.at(-1)]) {\n      const prev = stack.pop();\n      result[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return result;\n}',
      pythonCode: 'def daily_temperatures(temperatures):\n    result = [0] * len(temperatures)\n    stack = []\n    for i, temp in enumerate(temperatures):\n        while stack and temp > temperatures[stack[-1]]:\n            prev = stack.pop()\n            result[prev] = i - prev\n        stack.append(i)\n    return result',
      input: 'dailyTemperatures([50, 40, 60])',
      pythonInput: 'daily_temperatures([50, 40, 60])',
      choices: ['[2, 1, 0]', '[1, 1, 0]', '[0, 1, 0]', '[2, 2, 0]'],
      correct: '[2, 1, 0]',
      why: 'Day 0 (50) waits until day 2 for 60 → 2; day 1 (40) waits one day for 60 → 1; day 2 has none → 0.',
      wrong: {
        '[1, 1, 0]': 'Day 0 (50) isn’t beaten by day 1 (40); it waits two days for 60.',
        '[0, 1, 0]': 'Day 0 does reach a warmer day (60 at index 2), so it isn’t 0.',
        '[2, 2, 0]': 'Day 1 (40) waits only one day — 60 is the very next day.',
      },
    },
  ],
  'Product of Array Except Self': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function productExceptSelf(nums) {\n  const answer = Array(nums.length).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < nums.length; i++) {\n    answer[i] = prefix;\n    prefix *= nums[i];\n  }\n  let postfix = 1;\n  for (let i = nums.length - 1; i >= 0; i--) {\n    answer[i] *= postfix;\n    postfix *= nums[i];\n  }\n  return answer;\n}',
      pythonCode: 'def product_except_self(nums):\n    answer = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        answer[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        answer[i] *= postfix\n        postfix *= nums[i]\n    return answer',
      input: 'productExceptSelf([2, 3, 4])',
      pythonInput: 'product_except_self([2, 3, 4])',
      choices: ['[12, 8, 6]', '[12, 8, 4]', '[1, 2, 6]', '[6, 8, 12]'],
      correct: '[12, 8, 6]',
      why: 'Each slot is the product of the others: 3·4, 2·4, 2·3 = 12, 8, 6.',
      wrong: {
        '[12, 8, 4]': 'The last slot is 2·3 = 6, not 4 — it must exclude its own value.',
        '[1, 2, 6]': 'These are the running prefix products, before the suffix pass folds in the right side.',
        '[6, 8, 12]': 'Right values, but in reverse order — the first slot excludes the first value, giving 12.',
      },
    },
  ],
  'Two Sum II': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function twoSum(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}',
      pythonCode: 'def two_sum(numbers, target):\n    left = 0\n    right = len(numbers) - 1\n    while left < right:\n        total = numbers[left] + numbers[right]\n        if total == target:\n            return [left + 1, right + 1]\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n    return []',
      input: 'twoSum([1, 3, 4, 5, 7, 11], 9)',
      pythonInput: 'two_sum([1, 3, 4, 5, 7, 11], 9)',
      choices: ['[3, 4]', '[2, 3]', '[4, 5]', '[3, 5]'],
      correct: '[3, 4]',
      why: 'Values 4 and 5 sit at positions 3 and 4 (1-indexed) and add to 9.',
      wrong: {
        '[2, 3]': 'Those are the 0-indexed positions; this problem returns them 1-indexed.',
        '[4, 5]': 'Those are the values that sum to the target, not their positions.',
        '[3, 5]': 'Position 5 holds 7, and 4 + 7 is not 9.',
      },
    },
  ],
  'Longest Substring Without Repeating Characters': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function lengthOfLongestSubstring(s) {\n  const seen = new Set();\n  let left = 0;\n  let best = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) seen.delete(s[left++]);\n    seen.add(s[right]);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',
      pythonCode: 'def length_of_longest_substring(s):\n    seen = set()\n    left = 0\n    best = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        best = max(best, right - left + 1)\n    return best',
      input: 'lengthOfLongestSubstring("abba")',
      pythonInput: 'length_of_longest_substring("abba")',
      choices: ['2', '3', '1', '4'],
      correct: '2',
      why: 'The longest repeat-free run is "ab" (or "ba"), length 2; the repeated letters force the left edge forward.',
      wrong: {
        '3': 'No run of three distinct-in-a-row characters exists here.',
        '1': '"ab" is already a repeat-free run of length 2.',
        '4': 'The string repeats a and b, so the whole thing can’t qualify.',
      },
    },
  ],
  'Climbing Stairs': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function climbStairs(n) {\n  let one = 1;\n  let two = 1;\n  for (let step = 2; step <= n; step++) {\n    const current = one + two;\n    two = one;\n    one = current;\n  }\n  return one;\n}',
      pythonCode: 'def climb_stairs(n):\n    one = 1\n    two = 1\n    for step in range(2, n + 1):\n        current = one + two\n        two = one\n        one = current\n    return one',
      input: 'climbStairs(5)',
      pythonInput: 'climb_stairs(5)',
      choices: ['8', '5', '6', '13'],
      correct: '8',
      why: 'Each value is the sum of the previous two: 1, 2, 3, 5, 8 — so climbStairs(5) is 8.',
      wrong: {
        '5': '5 is the answer for n = 4; one more step adds the next Fibonacci value.',
        '6': 'The counts grow like Fibonacci (…3, 5, 8), not by adding 1 each time.',
        '13': '13 is the value for n = 6, one step too far.',
      },
    },
  ],
  'Evaluate Reverse Polish Notation': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function evalRPN(tokens) {\n  const stack = [];\n  const ops = {\n    "+": (a, b) => a + b,\n    "-": (a, b) => a - b,\n    "*": (a, b) => a * b,\n    "/": (a, b) => Math.trunc(a / b),\n  };\n  for (const token of tokens) {\n    if (token in ops) {\n      const b = stack.pop();\n      const a = stack.pop();\n      stack.push(ops[token](a, b));\n    } else {\n      stack.push(Number(token));\n    }\n  }\n  return stack.pop();\n}',
      pythonCode: 'import math\n\ndef eval_rpn(tokens):\n    stack = []\n    ops = {\n        "+": lambda a, b: a + b,\n        "-": lambda a, b: a - b,\n        "*": lambda a, b: a * b,\n        "/": lambda a, b: math.trunc(a / b),\n    }\n    for token in tokens:\n        if token in ops:\n            b = stack.pop()\n            a = stack.pop()\n            stack.append(ops[token](a, b))\n        else:\n            stack.append(int(token))\n    return stack.pop()',
      input: 'evalRPN(["2", "3", "+", "4", "*"])',
      pythonInput: 'eval_rpn(["2", "3", "+", "4", "*"])',
      choices: ['20', '14', '9', '5'],
      correct: '20',
      why: 'The + comes first: 2 + 3 = 5 is pushed back, then 5 * 4 = 20.',
      wrong: {
        '14': 'That is 2 + 3·4 — but here + runs before *, since it appears first in the tokens.',
        '9': 'That adds all three (2 + 3 + 4); the final operator is ×, not +.',
        '5': 'That is just 2 + 3, before the × 4 step.',
      },
    },
  ],
  'Contains Duplicate': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function hasDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}',
      pythonCode: 'def has_duplicate(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False',
      input: 'hasDuplicate([4, 1, 2, 1])',
      pythonInput: 'has_duplicate([4, 1, 2, 1])',
      choices: ['true', 'false'],
      correct: 'true',
      why: 'The second 1 is already in the set, so it returns true the moment that repeat is seen.',
      wrong: {
        'false': 'It only returns false if every value is distinct, but 1 appears twice here.',
      },
    },
  ],
  'Valid Parentheses': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function isValid(s) {\n  const pairs = { ")": "(", "]": "[", "}": "{" };\n  const stack = [];\n  for (const ch of s) {\n    if (ch in pairs) {\n      if (stack.pop() !== pairs[ch]) return false;\n    } else {\n      stack.push(ch);\n    }\n  }\n  return stack.length === 0;\n}',
      pythonCode: 'def is_valid(s):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in s:\n        if ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return len(stack) == 0',
      input: 'isValid("([)]")',
      pythonInput: 'is_valid("([)]")',
      choices: ['false', 'true'],
      correct: 'false',
      why: 'When ")" arrives the top of the stack is "[", not "(", so the brackets interleave and it returns false.',
      wrong: {
        'true': 'The brackets cross rather than nest — ")" closes before "]" does — so it can’t be valid.',
      },
    },
  ],
  'Valid Palindrome': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function isPalindrome(s) {\n  let left = 0;\n  let right = s.length - 1;\n  while (left < right) {\n    while (left < right && !/[a-z0-9]/i.test(s[left])) left++;\n    while (left < right && !/[a-z0-9]/i.test(s[right])) right--;\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;\n    left++;\n    right--;\n  }\n  return true;\n}',
      pythonCode: 'def is_palindrome(s):\n    left = 0\n    right = len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True',
      input: 'isPalindrome("Was it a car or a cat I saw?")',
      pythonInput: 'is_palindrome("Was it a car or a cat I saw?")',
      choices: ['true', 'false'],
      correct: 'true',
      why: 'Ignoring case and punctuation it reads "wasitacaroracatisaw", which is the same forward and backward.',
      wrong: {
        'false': 'After dropping spaces and punctuation the letters mirror around the center, so it is a palindrome.',
      },
    },
  ],
  'Coin Change': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const coin of coins) {\n      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
      pythonCode: 'def coin_change(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for coin in coins:\n            if coin <= a:\n                dp[a] = min(dp[a], dp[a - coin] + 1)\n    return -1 if dp[amount] == float("inf") else dp[amount]',
      input: 'coinChange([1, 2, 5], 6)',
      pythonInput: 'coin_change([1, 2, 5], 6)',
      choices: ['2', '3', '6', '1'],
      correct: '2',
      why: '5 + 1 = 6 uses just 2 coins, fewer than any other combination.',
      wrong: {
        '3': '2 + 2 + 2 is 3 coins, but 5 + 1 does it in fewer.',
        '6': 'Six 1-coins works but isn’t the minimum.',
        '1': 'No single coin equals 6, so one coin is impossible.',
      },
    },
  ],
  'Longest Consecutive Sequence': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let best = 0;\n  for (const n of set) {\n    if (set.has(n - 1)) continue;\n    let length = 1;\n    while (set.has(n + length)) length++;\n    best = Math.max(best, length);\n  }\n  return best;\n}',
      pythonCode: 'def longest_consecutive(nums):\n    num_set = set(nums)\n    best = 0\n    for n in num_set:\n        if n - 1 in num_set:\n            continue\n        length = 1\n        while n + length in num_set:\n            length += 1\n        best = max(best, length)\n    return best',
      input: 'longestConsecutive([9, 1, 8, 2, 7, 3])',
      pythonInput: 'longest_consecutive([9, 1, 8, 2, 7, 3])',
      choices: ['3', '4', '6', '2'],
      correct: '3',
      why: 'The runs 1-2-3 and 7-8-9 are each length 3; nothing links them, so the best is 3.',
      wrong: {
        '4': 'No four consecutive values are present — 4, 5, 6 are missing.',
        '6': 'The six values aren’t all consecutive; they split into two separate runs.',
        '2': '1-2-3 already forms a run of 3, beating any length-2 run.',
      },
    },
  ],
  'Number of Islands': [
    {
      prompt: 'Trace this and predict the return value.',
      code: 'function numIslands(grid) {\n  let count = 0;\n  const rows = grid.length;\n  const cols = grid[0].length;\n  function sink(r, c) {\n    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") return;\n    grid[r][c] = "0";\n    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === "1") { count++; sink(r, c); }\n    }\n  }\n  return count;\n}',
      pythonCode: 'def num_islands(grid):\n    count = 0\n    rows, cols = len(grid), len(grid[0])\n\n    def sink(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":\n            return\n        grid[r][c] = "0"\n        sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                count += 1\n                sink(r, c)\n    return count',
      input: 'numIslands([["1","0","1"],["0","0","0"],["1","0","1"]])',
      pythonInput: 'num_islands([["1","0","1"],["0","0","0"],["1","0","1"]])',
      choices: ['4', '1', '2', '5'],
      correct: '4',
      why: 'The four corner cells are land, and none touch (all edges between them are water), so each is its own island.',
      wrong: {
        '1': 'The land cells don’t connect to each other, so they aren’t one island.',
        '2': 'All four corners are separate; there’s no pairing that merges them.',
        '5': 'There are only four land cells, so there can’t be five islands.',
      },
    },
  ],
};
