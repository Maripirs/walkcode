// Debugging drills (M10) — a two-step drill: the learner is shown a full function with exactly one
// wrong line, first spots which line is the bug, then chooses the correct replacement. Keyed by
// problem title.
//
// Authoring shape (per drill), language-neutral feedback + per-language code/line text:
//   prompt                       what the function is supposed to do
//   code / pythonCode            the full function WITH the bug present
//   input / pythonInput          a call used to verify behavior
//   correctReturns               what the FIXED function returns for that call (JSON-comparable)
//   bug   : { line, py }         the buggy line (trimmed), which must appear once in the code
//   fix   : { line, py }         the correct replacement (trimmed); must NOT already appear
//   whyLine / whyFix             feedback when the learner picks the bug / the fix correctly
//   otherLines: [{ line, py, note }]   innocent lines from the code (step-1 distractors) + why each is fine
//   otherFixes: [{ line, py, note }]   wrong replacements (step-2 distractors) + why each is wrong
//
// server/scripts/validate-content.mjs EXECUTES the JS variant: it runs the buggy code (must differ
// from correct) and the fixed code (must equal correctReturns), so a bug/fix that doesn't hold up
// can't ship. Author the Python variant to mirror the JS exactly.

export const debugDrills = {
  'Best Time to Buy and Sell Stock': [
    {
      prompt: 'This should return the best buy-then-sell profit, but it has a bug.',
      code: 'function maxProfit(prices) {\n  let minPrice = Infinity;\n  let best = 0;\n  for (const price of prices) {\n    best = Math.max(best, price - minPrice);\n    minPrice = Math.max(minPrice, price);\n  }\n  return best;\n}',
      pythonCode: 'def max_profit(prices):\n    min_price = float("inf")\n    best = 0\n    for price in prices:\n        best = max(best, price - min_price)\n        min_price = max(min_price, price)\n    return best',
      input: 'maxProfit([7, 1, 5, 3, 6, 4])',
      pythonInput: 'max_profit([7, 1, 5, 3, 6, 4])',
      correctReturns: '5',
      bug: { line: 'minPrice = Math.max(minPrice, price);', py: 'min_price = max(min_price, price)' },
      fix: { line: 'minPrice = Math.min(minPrice, price);', py: 'min_price = min(min_price, price)' },
      whyLine: 'This keeps the largest price seen so far, but to buy low we need the smallest.',
      whyFix: 'Tracking the minimum price lets each day sell against the cheapest earlier price.',
      otherLines: [
        { line: 'best = Math.max(best, price - minPrice);', py: 'best = max(best, price - min_price)', note: 'This correctly tracks the best profit seen so far.' },
        { line: 'let best = 0;', py: 'best = 0', note: 'Starting best at 0 is right — zero profit is always allowed.' },
      ],
      otherFixes: [
        { line: 'minPrice = price;', py: 'min_price = price', note: 'That drops earlier lows; only the current price would count.' },
        { line: 'minPrice = Math.min(best, price);', py: 'min_price = min(best, price)', note: 'That compares price against best (a profit), not the previous minimum price.' },
      ],
    },
  ],
  'Product of Array Except Self': [
    {
      prompt: 'This should return each slot’s product of all the other values, but it has a bug.',
      code: 'function productExceptSelf(nums) {\n  const answer = Array(nums.length).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < nums.length; i++) {\n    answer[i] = prefix * nums[i];\n    prefix *= nums[i];\n  }\n  let postfix = 1;\n  for (let i = nums.length - 1; i >= 0; i--) {\n    answer[i] *= postfix;\n    postfix *= nums[i];\n  }\n  return answer;\n}',
      pythonCode: 'def product_except_self(nums):\n    answer = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        answer[i] = prefix * nums[i]\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        answer[i] *= postfix\n        postfix *= nums[i]\n    return answer',
      input: 'productExceptSelf([1, 2, 3, 4])',
      pythonInput: 'product_except_self([1, 2, 3, 4])',
      correctReturns: '[24, 12, 8, 6]',
      bug: { line: 'answer[i] = prefix * nums[i];', py: 'answer[i] = prefix * nums[i]' },
      fix: { line: 'answer[i] = prefix;', py: 'answer[i] = prefix' },
      whyLine: 'This multiplies in nums[i], but each slot must exclude its own value — it should store just the prefix.',
      whyFix: 'The slot gets the product of everything to its left (the prefix); the second pass folds in the right side.',
      otherLines: [
        { line: 'prefix *= nums[i];', py: 'prefix *= nums[i]', note: 'Rolling the running prefix product forward is correct.' },
        { line: 'answer[i] *= postfix;', py: 'answer[i] *= postfix', note: 'Folding in the suffix product in the second pass is right.' },
      ],
      otherFixes: [
        { line: 'answer[i] = prefix - nums[i];', py: 'answer[i] = prefix - nums[i]', note: 'Subtraction isn’t part of a product; the slot should just store the prefix.' },
        { line: 'answer[i] = prefix / nums[i];', py: 'answer[i] = prefix / nums[i]', note: 'The problem forbids division, and it isn’t needed here.' },
      ],
    },
  ],
  'Two Sum II': [
    {
      prompt: 'This should return the two 1-indexed positions that sum to target, but it has a bug.',
      code: 'function twoSum(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left, right + 1];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}',
      pythonCode: 'def two_sum(numbers, target):\n    left = 0\n    right = len(numbers) - 1\n    while left < right:\n        total = numbers[left] + numbers[right]\n        if total == target:\n            return [left, right + 1]\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n    return []',
      input: 'twoSum([2, 7, 11, 15], 9)',
      pythonInput: 'two_sum([2, 7, 11, 15], 9)',
      correctReturns: '[1, 2]',
      bug: { line: 'if (sum === target) return [left, right + 1];', py: 'return [left, right + 1]' },
      fix: { line: 'if (sum === target) return [left + 1, right + 1];', py: 'return [left + 1, right + 1]' },
      whyLine: 'The left index isn’t converted to 1-indexed — it should be left + 1.',
      whyFix: 'Both positions are reported 1-indexed, so each gets a + 1.',
      otherLines: [
        { line: 'const sum = numbers[left] + numbers[right];', py: 'total = numbers[left] + numbers[right]', note: 'Summing the two ends is correct.' },
        { line: 'if (sum < target) left++;', py: 'left += 1', note: 'Moving the left pointer inward when the sum is too small is right.' },
      ],
      otherFixes: [
        { line: 'if (sum === target) return [left, right];', py: 'return [left, right]', note: 'Both indices need + 1 for 1-indexing.' },
        { line: 'if (sum === target) return [left + 1, right];', py: 'return [left + 1, right]', note: 'The right index also needs a + 1.' },
      ],
    },
  ],
  'Binary Search': [
    {
      prompt: 'This should return the index of target, or -1, but it has a bug.',
      code: 'function search(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid + 1;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
      pythonCode: 'def search(nums, target):\n    left = 0\n    right = len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid + 1\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
      input: 'search([-1, 0, 3, 5, 9], 5)',
      pythonInput: 'search([-1, 0, 3, 5, 9], 5)',
      correctReturns: '3',
      bug: { line: 'if (nums[mid] === target) return mid + 1;', py: 'return mid + 1' },
      fix: { line: 'if (nums[mid] === target) return mid;', py: 'return mid' },
      whyLine: 'When the target is found at mid, it returns one index too far (mid + 1).',
      whyFix: 'The match sits at mid, so it returns mid.',
      otherLines: [
        { line: 'if (nums[mid] < target) left = mid + 1;', py: 'left = mid + 1', note: 'Discarding the left half when the middle is too small is correct.' },
        { line: 'const mid = Math.floor((left + right) / 2);', py: 'mid = (left + right) // 2', note: 'Computing the midpoint this way is right.' },
      ],
      otherFixes: [
        { line: 'if (nums[mid] === target) return mid - 1;', py: 'return mid - 1', note: 'That returns one index before the match.' },
        { line: 'if (nums[mid] === target) return left;', py: 'return left', note: 'left isn’t guaranteed to point at the match.' },
      ],
    },
  ],
  'Longest Substring Without Repeating Characters': [
    {
      prompt: 'This should return the longest repeat-free substring length, but it has a bug.',
      code: 'function lengthOfLongestSubstring(s) {\n  const seen = new Set();\n  let left = 0;\n  let best = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) seen.delete(s[left++]);\n    seen.add(s[right]);\n    best = Math.max(best, right - left);\n  }\n  return best;\n}',
      pythonCode: 'def length_of_longest_substring(s):\n    seen = set()\n    left = 0\n    best = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        best = max(best, right - left)\n    return best',
      input: 'lengthOfLongestSubstring("abcabcbb")',
      pythonInput: 'length_of_longest_substring("abcabcbb")',
      correctReturns: '3',
      bug: { line: 'best = Math.max(best, right - left);', py: 'best = max(best, right - left)' },
      fix: { line: 'best = Math.max(best, right - left + 1);', py: 'best = max(best, right - left + 1)' },
      whyLine: 'The window spans indices left..right, whose length is right - left + 1; this is one short.',
      whyFix: 'Adding 1 counts both endpoints of the window.',
      otherLines: [
        { line: 'seen.add(s[right]);', py: 'seen.add(s[right])', note: 'Adding the new character to the window is correct.' },
        { line: 'while (seen.has(s[right])) seen.delete(s[left++]);', py: 'left += 1', note: 'Shrinking from the left until the repeat is gone is right.' },
      ],
      otherFixes: [
        { line: 'best = Math.max(best, left - right + 1);', py: 'best = max(best, left - right + 1)', note: 'left - right is negative; the length is right - left + 1.' },
        { line: 'best = right - left + 1;', py: 'best = right - left + 1', note: 'That overwrites best instead of keeping the largest window so far.' },
      ],
    },
  ],
  'Climbing Stairs': [
    {
      prompt: 'This should count the ways to climb n stairs (1 or 2 at a time), but it has a bug.',
      code: 'function climbStairs(n) {\n  let one = 1;\n  let two = 1;\n  for (let step = 2; step < n; step++) {\n    const current = one + two;\n    two = one;\n    one = current;\n  }\n  return one;\n}',
      pythonCode: 'def climb_stairs(n):\n    one = 1\n    two = 1\n    for step in range(2, n):\n        current = one + two\n        two = one\n        one = current\n    return one',
      input: 'climbStairs(5)',
      pythonInput: 'climb_stairs(5)',
      correctReturns: '8',
      bug: { line: 'for (let step = 2; step < n; step++) {', py: 'for step in range(2, n):' },
      fix: { line: 'for (let step = 2; step <= n; step++) {', py: 'for step in range(2, n + 1):' },
      whyLine: 'The loop stops at n - 1, so it computes one step too few.',
      whyFix: 'Running the loop through step n reaches the top stair.',
      otherLines: [
        { line: 'const current = one + two;', py: 'current = one + two', note: 'Summing the previous two counts is the right recurrence.' },
        { line: 'two = one;', py: 'two = one', note: 'Shifting the window of the last two values is correct.' },
      ],
      otherFixes: [
        { line: 'for (let step = 3; step <= n; step++) {', py: 'for step in range(3, n + 1):', note: 'Starting at step 3 skips an iteration, undercounting by one.' },
        { line: 'for (let step = 0; step <= n; step++) {', py: 'for step in range(0, n + 1):', note: 'Starting at 0 runs two extra iterations, overcounting.' },
      ],
    },
  ],
  'Daily Temperatures': [
    {
      prompt: 'For each day this should give the wait until a warmer day, but it has a bug.',
      code: 'function dailyTemperatures(temperatures) {\n  const result = Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack.at(-1)]) {\n      const prev = stack.pop();\n      result[prev] = prev - i;\n    }\n    stack.push(i);\n  }\n  return result;\n}',
      pythonCode: 'def daily_temperatures(temperatures):\n    result = [0] * len(temperatures)\n    stack = []\n    for i, temp in enumerate(temperatures):\n        while stack and temp > temperatures[stack[-1]]:\n            prev = stack.pop()\n            result[prev] = prev - i\n        stack.append(i)\n    return result',
      input: 'dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])',
      pythonInput: 'daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73])',
      correctReturns: '[1, 1, 4, 2, 1, 1, 0, 0]',
      bug: { line: 'result[prev] = prev - i;', py: 'result[prev] = prev - i' },
      fix: { line: 'result[prev] = i - prev;', py: 'result[prev] = i - prev' },
      whyLine: 'It subtracts in the wrong order — prev is the earlier day, so prev - i is negative.',
      whyFix: 'The wait is the later index minus the earlier one, i - prev.',
      otherLines: [
        { line: 'const prev = stack.pop();', py: 'prev = stack.pop()', note: 'Popping the last unresolved day to settle it is correct.' },
        { line: 'stack.push(i);', py: 'stack.append(i)', note: 'Recording the current day’s index for later is right.' },
      ],
      otherFixes: [
        { line: 'result[prev] = i + prev;', py: 'result[prev] = i + prev', note: 'Adding the indices doesn’t give the gap between them.' },
        { line: 'result[prev] = i - prev - 1;', py: 'result[prev] = i - prev - 1', note: 'That’s one short — the wait is exactly i - prev days.' },
      ],
    },
  ],
};
