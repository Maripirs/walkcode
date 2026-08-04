// Language-specific lesson variants.
import { supplementalFullCode } from './supplemental-solutions.js';
import { blankLine, genericWrong } from './blank-line.js';

export const pythonSolutions = {
  "Contains Duplicate": "seen = set()\nfor n in nums:\n    if n in seen:\n        return True\n    seen.add(n)\nreturn False",
  "Two Sum II": "left, right = 0, len(numbers) - 1\nwhile left < right:\n    total = numbers[left] + numbers[right]\n    if total == target:\n        return [left + 1, right + 1]\n    if total < target:\n        left += 1\n    else:\n        right -= 1",
  "Longest Substring Without Repeating Characters": "seen = set()\nleft = best = 0\nfor right in range(len(s)):\n    while s[right] in seen:\n        seen.remove(s[left])\n        left += 1\n    seen.add(s[right])\n    best = max(best, right - left + 1)\nreturn best",
  "Valid Parentheses": "pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\nstack = []\nfor char in s:\n    if char in pairs:\n        if not stack:\n            return False\n        if stack.pop() != pairs[char]:\n            return False\n    else:\n        stack.append(char)\nreturn len(stack) == 0",
  "Binary Search": "left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target:\n        return mid\n    if nums[mid] < target:\n        left = mid + 1\n    else:\n        right = mid - 1\nreturn -1",
  "Reverse Linked List": "prev, current = None, head\nwhile current:\n    next_node = current.next\n    current.next = prev\n    prev = current\n    current = next_node\nreturn prev",
  "Number of Islands": "def visit(r, c):\n    if r < 0 or c < 0 or r == rows or c == cols or grid[r][c] != \"1\":\n        return\n    grid[r][c] = \"0\"\n    visit(r + 1, c); visit(r - 1, c)\n    visit(r, c + 1); visit(r, c - 1)",
  "Invert Binary Tree": "def invert_tree(root):\n    if root is None:\n        return None\n    old_left = root.left\n    root.left = invert_tree(root.right)\n    root.right = invert_tree(old_left)\n    return root"
};

// Python whole-line drill variants. Each fully overrides the JS exercise at the same index:
// `code` is the full Python solution with one line blanked, `choices` are complete lines.
export const pythonExercises = {
  "Contains Duplicate:0": {
    prompt: "Which line guards the early return when the current number was already seen?",
    code: "seen = set()\nfor n in nums:\n    ___\n        return True\n    seen.add(n)\nreturn False",
    choices: [
      "if n in seen:",
      "if n not in seen:",
      "if seen.add(n):"
    ],
    correct: "if n in seen:",
    why: "n in seen is true exactly when an earlier position already stored n.",
    wrong: {
      "if n not in seen:": "This is true for brand-new values — the opposite of a duplicate.",
      "if seen.add(n):": "add returns None, so this branch would never run."
    }
  },
  "Contains Duplicate:1": {
    prompt: "Which line records the current number so a later repeat can be caught?",
    code: "seen = set()\nfor n in nums:\n    if n in seen:\n        return True\n    ___\nreturn False",
    choices: [
      "seen.add(n)",
      "seen.remove(n)",
      "seen.discard(n)"
    ],
    correct: "seen.add(n)",
    why: "Storing n now lets a later occurrence be found by the membership test.",
    wrong: {
      "seen.remove(n)": "remove deletes n (and raises an error if it is absent) instead of storing it.",
      "seen.discard(n)": "discard removes n rather than recording it, so repeats are never seen."
    }
  },
  "Two Sum II:0": {
    prompt: "The list is sorted ascending. Which line reacts to a too-small total?",
    code: "left, right = 0, len(numbers) - 1\nwhile left < right:\n    total = numbers[left] + numbers[right]\n    if total == target:\n        return [left + 1, right + 1]\n    if total < target:\n        ___\n    else:\n        right -= 1",
    choices: [
      "left += 1",
      "right -= 1",
      "left -= 1"
    ],
    correct: "left += 1",
    why: "A too-small total needs a larger value, and moving left rightward selects one.",
    wrong: {
      "right -= 1": "Lowering right makes an already too-small total smaller.",
      "left -= 1": "left is already at the smallest candidate and would leave the range."
    }
  },
  "Two Sum II:1": {
    prompt: "Positions must be 1-indexed. Which line returns the answer on a match?",
    code: "left, right = 0, len(numbers) - 1\nwhile left < right:\n    total = numbers[left] + numbers[right]\n    if total == target:\n        ___\n    if total < target:\n        left += 1\n    else:\n        right -= 1",
    choices: [
      "return [left + 1, right + 1]",
      "return [left, right]",
      "return [left + 1, right]"
    ],
    correct: "return [left + 1, right + 1]",
    why: "left and right are zero-based, and the problem wants 1-based positions, so both need + 1.",
    wrong: {
      "return [left, right]": "These are zero-based indexes, off by one on both.",
      "return [left + 1, right]": "This corrects only the left index."
    }
  },
  "Longest Substring Without Repeating Characters:0": {
    prompt: "The incoming character is already in the window. Which line removes the one at the left edge?",
    code: "seen = set()\nleft = best = 0\nfor right in range(len(s)):\n    while s[right] in seen:\n        ___\n        left += 1\n    seen.add(s[right])\n    best = max(best, right - left + 1)\nreturn best",
    choices: [
      "seen.remove(s[left])",
      "seen.remove(s[right])",
      "seen.add(s[left])"
    ],
    correct: "seen.remove(s[left])",
    why: "The character leaving the window is at index left.",
    wrong: {
      "seen.remove(s[right])": "That removes the incoming duplicate, leaving the earlier one inside.",
      "seen.add(s[left])": "Adding instead of removing never makes the window valid, so the loop never ends."
    }
  },
  "Longest Substring Without Repeating Characters:1": {
    prompt: "The window is valid again. Which line records its length?",
    code: "seen = set()\nleft = best = 0\nfor right in range(len(s)):\n    while s[right] in seen:\n        seen.remove(s[left])\n        left += 1\n    seen.add(s[right])\n    ___\nreturn best",
    choices: [
      "best = max(best, right - left + 1)",
      "best = max(best, right - left)",
      "best = max(best, best + 1)"
    ],
    correct: "best = max(best, right - left + 1)",
    why: "Both ends are inside the window, so its length is right − left + 1.",
    wrong: {
      "best = max(best, right - left)": "This drops one endpoint, undercounting every window.",
      "best = max(best, best + 1)": "The window can change by more than one; measure it from its bounds."
    }
  },
  "Valid Parentheses:0": {
    prompt: "A closing bracket must match the most recent opener. Which line checks that?",
    code: "pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\nstack = []\nfor char in s:\n    if char in pairs:\n        if not stack:\n            return False\n        ___\n            return False\n    else:\n        stack.append(char)\nreturn len(stack) == 0",
    choices: [
      "if stack.pop() != pairs[char]:",
      "if stack.pop(0) != pairs[char]:",
      "if stack.append(char) != pairs[char]:"
    ],
    correct: "if stack.pop() != pairs[char]:",
    why: "pop() removes the most recently pushed opener, the only one this bracket may match.",
    wrong: {
      "if stack.pop(0) != pairs[char]:": "pop(0) removes the oldest opener, breaking nested last-in, first-out order.",
      "if stack.append(char) != pairs[char]:": "append adds an item and returns None; it resolves nothing."
    }
  },
  "Valid Parentheses:1": {
    prompt: "Which line reports whether every opener was matched?",
    code: "pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\nstack = []\nfor char in s:\n    if char in pairs:\n        if not stack:\n            return False\n        if stack.pop() != pairs[char]:\n            return False\n    else:\n        stack.append(char)\n___",
    choices: [
      "return len(stack) == 0",
      "return len(stack) == 1",
      "return len(stack) == len(s)"
    ],
    correct: "return len(stack) == 0",
    why: "An empty stack means every opening bracket found its match.",
    wrong: {
      "return len(stack) == 1": "One leftover opener is still unmatched, so the string is invalid.",
      "return len(stack) == len(s)": "The stack holds only unresolved openers, not every character."
    }
  },
  "Binary Search:0": {
    prompt: "mid is too small and already tested. Which line keeps only values that could still match?",
    code: "left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target:\n        return mid\n    if nums[mid] < target:\n        ___\n    else:\n        right = mid - 1\nreturn -1",
    choices: [
      "left = mid + 1",
      "left = mid - 1",
      "left = mid"
    ],
    correct: "left = mid + 1",
    why: "mid was checked and is too small, so the next candidate starts right after it.",
    wrong: {
      "left = mid - 1": "That moves toward even smaller values, which cannot help.",
      "left = mid": "Leaving mid in the range can repeat the same midpoint forever."
    }
  },
  "Binary Search:1": {
    prompt: "mid is too large and already tested. Which line ends the interval just before it?",
    code: "left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target:\n        return mid\n    if nums[mid] < target:\n        left = mid + 1\n    else:\n        ___\nreturn -1",
    choices: [
      "right = mid - 1",
      "right = mid + 1",
      "right = mid"
    ],
    correct: "right = mid - 1",
    why: "mid was checked and is too large, so the remaining interval ends one before it.",
    wrong: {
      "right = mid + 1": "That keeps values above an already too-large midpoint.",
      "right = mid": "Leaving mid in the range can stop the bounds from shrinking."
    }
  },
  "Reverse Linked List:0": {
    prompt: "Which line saves the rest of the list before the next link is overwritten?",
    code: "prev, current = None, head\nwhile current:\n    ___\n    current.next = prev\n    prev = current\n    current = next_node\nreturn prev",
    choices: [
      "next_node = current.next",
      "next_node = current.prev",
      "next_node = prev"
    ],
    correct: "next_node = current.next",
    why: "current.next still points at the unvisited remainder; saving it keeps that list reachable after the link flips.",
    wrong: {
      "next_node = current.prev": "A singly linked node has no prev pointer.",
      "next_node = prev": "prev is the already-reversed side, not the remaining nodes."
    }
  },
  "Reverse Linked List:1": {
    prompt: "Which line moves prev forward to the node just reversed?",
    code: "prev, current = None, head\nwhile current:\n    next_node = current.next\n    current.next = prev\n    ___\n    current = next_node\nreturn prev",
    choices: [
      "prev = current",
      "prev = next_node",
      "prev = head"
    ],
    correct: "prev = current",
    why: "current is now the front of the reversed portion, so it becomes prev for the next iteration.",
    wrong: {
      "prev = next_node": "next_node is still unprocessed; using it skips the node just reversed.",
      "prev = head": "head never advances, so it cannot track the growing reversed list."
    }
  },
  "Number of Islands:0": {
    prompt: "Flood fill has just reached land. Which line marks it so it is not counted again?",
    code: "def visit(r, c):\n    if r < 0 or c < 0 or r == rows or c == cols or grid[r][c] != \"1\":\n        return\n    ___\n    visit(r + 1, c)\n    visit(r - 1, c)\n    visit(r, c + 1)\n    visit(r, c - 1)",
    choices: [
      "grid[r][c] = \"0\"",
      "grid[r][c] = \"1\"",
      "grid[r][c] = r + 1"
    ],
    correct: "grid[r][c] = \"0\"",
    why: "Turning visited land into water records that this cell already belongs to the current island.",
    wrong: {
      "grid[r][c] = \"1\"": "Leaving it as land lets a later scan or call visit it again.",
      "grid[r][c] = r + 1": "A grid cell holds a value, not a coordinate."
    }
  },
  "Number of Islands:1": {
    prompt: "Three neighbors are already visited. Which line explores the left neighbor?",
    code: "def visit(r, c):\n    if r < 0 or c < 0 or r == rows or c == cols or grid[r][c] != \"1\":\n        return\n    grid[r][c] = \"0\"\n    visit(r + 1, c)\n    visit(r - 1, c)\n    visit(r, c + 1)\n    ___",
    choices: [
      "visit(r, c - 1)",
      "visit(c, c - 1)",
      "visit(r + 1, c - 1)"
    ],
    correct: "visit(r, c - 1)",
    why: "Keeping r and decreasing c reaches the cell immediately to the left.",
    wrong: {
      "visit(c, c - 1)": "This passes a column where the row is expected.",
      "visit(r + 1, c - 1)": "This moves diagonally, skipping the direct left cell."
    }
  },
  "Invert Binary Tree:0": {
    prompt: "Which line handles the empty subtree that ends the recursion?",
    code: "def invert_tree(root):\n    if root is None:\n        ___\n    old_left = root.left\n    root.left = invert_tree(root.right)\n    root.right = invert_tree(old_left)\n    return root",
    choices: [
      "return None",
      "return root",
      "return []"
    ],
    correct: "return None",
    why: "A missing child stays missing; returning None stops recursion at the edge of the tree.",
    wrong: {
      "return root": "There is no node to return when this branch is empty.",
      "return []": "The function returns tree nodes or None, not a list."
    }
  },
  "Invert Binary Tree:1": {
    prompt: "Which line preserves the original left child before it is overwritten?",
    code: "def invert_tree(root):\n    if root is None:\n        return None\n    ___\n    root.left = invert_tree(root.right)\n    root.right = invert_tree(old_left)\n    return root",
    choices: [
      "old_left = root.left",
      "old_left = root.right",
      "old_left = root.val"
    ],
    correct: "old_left = root.left",
    why: "The original left subtree must be saved so it can become the new right after both sides invert.",
    wrong: {
      "old_left = root.right": "Saving right loses the original left subtree, which still needs to move.",
      "old_left = root.val": "val is the node’s payload, not a child subtree."
    }
  }
};

// Whole-line Python variants for the Built walkthrough lessons. The JavaScript versions live in
// walkthrough-upgrades.js; here we blank one line of the Python reference solution so the two
// languages stay parallel. Specs are { prompt, correct, choices, why }.
function pyEx(title, spec) {
  return {
    prompt: spec.prompt,
    code: blankLine(supplementalFullCode[title].Python, spec.correct),
    choices: spec.choices,
    correct: spec.correct,
    why: spec.why,
    wrong: spec.wrong || genericWrong(spec.choices, spec.correct),
  };
}

const walkthroughPythonExercises = {
  'Valid Anagram': [
    { prompt: 'Which line rejects strings that can’t be anagrams before counting?', correct: 'if len(s) != len(t):', choices: ['if len(s) != len(t):', 'if len(s) == len(t):', 'if s != t:'], why: 'Unequal lengths cannot have equal character counts.' },
    { prompt: 'Each character of t consumes one available count. Which line?', correct: 'counts[char] = counts.get(char, 0) - 1', choices: ['counts[char] = counts.get(char, 0) - 1', 'counts[char] = counts.get(char, 0) + 1', 'counts[char] = counts.get(char, 0)'], why: 'Subtracting consumes one matching character; a later negative count signals a mismatch.' },
  ],
  'Valid Palindrome': [
    { prompt: 'Which line rejects a mismatched mirrored pair?', correct: 'if s[left].lower() != s[right].lower():', choices: ['if s[left].lower() != s[right].lower():', 'if s[left].lower() == s[right].lower():', 'if s[left] != s[right]:'], why: 'One mismatched alphanumeric pair, compared case-insensitively, disproves the palindrome.' },
    { prompt: 'Which line skips non-alphanumeric characters on the left edge?', correct: 'while left < right and not s[left].isalnum():', choices: ['while left < right and not s[left].isalnum():', 'while left < right and s[left].isalnum():', 'while left < right and not s[right].isalnum():'], why: 'Advance left past non-alphanumeric characters, staying in bounds, before comparing.' },
  ],
  'Best Time to Buy and Sell Stock': [
    { prompt: 'Which line records the best profit from selling at today’s price?', correct: 'best = max(best, price - min_price)', choices: ['best = max(best, price - min_price)', 'best = max(best, min_price - price)', 'best = max(best, price - best)'], why: 'Selling today after buying at the cheapest earlier price gives profit price − min_price.' },
    { prompt: 'Which line keeps the cheapest purchase price for future days?', correct: 'min_price = min(min_price, price)', choices: ['min_price = min(min_price, price)', 'min_price = max(min_price, price)', 'min_price = price'], why: 'A future sale needs the smallest earlier price, so keep the running minimum.' },
  ],
  'Min Stack': [
    { prompt: 'On push, which line keeps the running minimum correct at the new depth?', correct: 'min_stack.append(min(val, min_stack[-1]))', choices: ['min_stack.append(min(val, min_stack[-1]))', 'min_stack.append(min(val, self.stack[-1]))', 'min_stack.append(val)'], why: 'Compare the new value with the previous minimum, which sits on top of min_stack.' },
    { prompt: 'Which line returns the current minimum in O(1)?', correct: 'return self.min_stack[-1]', choices: ['return self.min_stack[-1]', 'return self.stack[-1]', 'return min(self.stack)'], why: 'The current minimum is kept on top of min_stack, so getMin just reads that top.' },
  ],
  'Maximum Depth of Binary Tree': [
    { prompt: 'Which line returns this node’s depth from its children’s depths?', correct: 'return 1 + max(max_depth(root.left), max_depth(root.right))', choices: ['return 1 + max(max_depth(root.left), max_depth(root.right))', 'return 1 + min(max_depth(root.left), max_depth(root.right))', 'return max(max_depth(root.left), max_depth(root.right))'], why: 'A node’s depth is one more than the depth of its deeper child.' },
    { prompt: 'Which line gives an empty subtree its depth?', correct: 'return 0', choices: ['return 0', 'return 1', 'return None'], why: 'An empty subtree has depth zero, which lets a leaf become depth one.' },
  ],
  'Group Anagrams': [
    { prompt: 'Which line builds one stable key shared by all anagrams of word?', correct: "key = ''.join(sorted(word))", choices: ["key = ''.join(sorted(word))", 'key = sorted(word)', "key = ''.join(word)"], why: 'Sorting the letters and joining them yields the same string for every anagram.' },
    { prompt: 'Which line adds the word to the group for its signature?', correct: 'groups.setdefault(key, []).append(word)', choices: ['groups.setdefault(key, []).append(word)', 'groups[key] = word', 'groups.setdefault(word, []).append(key)'], why: 'Append the original word to the bucket keyed by its sorted-letter signature.' },
  ],
  '3Sum': [
    { prompt: 'Which line skips a repeated fixed value while keeping later distinct ones?', correct: 'if i > 0 and nums[i] == nums[i - 1]:', choices: ['if i > 0 and nums[i] == nums[i - 1]:', 'if i > 0 and nums[i] != nums[i - 1]:', 'if nums[i] == nums[i - 1]:'], why: 'The continue below skips just this duplicate fixed value while later distinct ones still run.' },
    { prompt: 'The array is sorted. Which line reacts to a total below zero?', correct: 'if total < 0:', choices: ['if total < 0:', 'if total > 0:', 'if total == 0:'], why: 'A too-small total needs a larger value, so the branch below moves left rightward.' },
  ],
  'Daily Temperatures': [
    { prompt: 'Which line records how long the earlier day waited?', correct: 'result[prev] = i - prev', choices: ['result[prev] = i - prev', 'result[prev] = prev - i', 'result[prev] = i + prev'], why: 'Today (i) is the first warmer day after prev, so the wait is i − prev.' },
    { prompt: 'Which line keeps today’s index unresolved for a later warmer day?', correct: 'stack.append(i)', choices: ['stack.append(i)', 'stack.pop()', 'stack.append(prev)'], why: 'Push today’s index so a future warmer day can resolve it.' },
  ],
  'Merge Two Sorted Lists': [
    { prompt: 'After attaching a node, which line advances the tail?', correct: 'tail = tail.next', choices: ['tail = tail.next', 'tail = tail.val', 'tail = dummy'], why: 'tail must move to the node just attached so the next one links onto the end.' },
    { prompt: 'One list runs out first. Which line appends the leftover nodes?', correct: 'tail.next = list1 or list2', choices: ['tail.next = list1 or list2', 'tail.next = list1 and list2', 'tail.next = None'], why: 'Whichever list still has nodes is already sorted, so attach it whole.' },
  ],
  'Climbing Stairs': [
    { prompt: 'Which line combines the two previous step counts?', correct: 'current = one + two', choices: ['current = one + two', 'current = one * two', 'current = max(one, two)'], why: 'The two disjoint ways to arrive — a one-step or a two-step move — are added.' },
    { prompt: 'Which line shifts the older saved state forward?', correct: 'two = one', choices: ['two = one', 'two = current', 'two = one + two'], why: 'The previous one-step-back state becomes two steps back for the next iteration.' },
  ],
  'Course Schedule': [
    { prompt: 'While building the graph, which line counts a prerequisite for a course?', correct: 'indegree[course] += 1', choices: ['indegree[course] += 1', 'indegree[prereq] += 1', 'indegree[course] -= 1'], why: 'Each prerequisite pair adds one incoming edge to the dependent course.' },
    { prompt: 'Which line enqueues a course once its prerequisites are gone?', correct: 'if indegree[next_course] == 0:', choices: ['if indegree[next_course] == 0:', 'if indegree[next_course] > 0:', 'if indegree[course] == 0:'], why: 'A course is ready exactly when its remaining prerequisite count reaches zero.' },
  ],
  'Diameter of Binary Tree': [
    { prompt: 'Which line updates the best path turning through this node?', correct: 'best = max(best, left + right)', choices: ['best = max(best, left + right)', 'best = max(best, max(left, right))', 'best = max(best, left * right)'], why: 'A path turning through a node joins both child paths, so their edge counts add.' },
    { prompt: 'Which line returns this node’s height to its parent?', correct: 'return 1 + max(left, right)', choices: ['return 1 + max(left, right)', 'return 1 + min(left, right)', 'return 1 + left + right'], why: 'A node’s height is one plus the height of its deeper child.' },
  ],
  'Kth Largest Element in an Array': [
    { prompt: 'Which line converts rank k to the ascending target index?', correct: 'target = len(nums) - k', choices: ['target = len(nums) - k', 'target = k', 'target = len(nums) - k - 1'], why: 'The kth-largest value sits at ascending index n − k after partitioning.' },
    { prompt: 'The pivot is left of target. Which line searches the right partition?', correct: 'if pivot_index < target:', choices: ['if pivot_index < target:', 'if pivot_index > target:', 'if pivot_index < k:'], why: 'The target is past this pivot, so the next search starts to its right.' },
  ],
  'Coin Change': [
    { prompt: 'Which line sets the base case that every amount builds on?', correct: 'dp[0] = 0', choices: ['dp[0] = 0', 'dp[0] = 1', 'dp[0] = float("inf")'], why: 'Making amount 0 takes zero coins; every larger amount is derived from it.' },
    { prompt: 'Which line reports an amount that no coins can make?', correct: 'return -1 if dp[-1] == float("inf") else dp[-1]', choices: ['return -1 if dp[-1] == float("inf") else dp[-1]', 'return dp[-1]', 'return -1 if dp[-1] == 0 else dp[-1]'], why: 'A leftover infinity means the amount was never reached, so return -1.' },
  ],
  'Distinct Subsequences': [
    { prompt: 'Which line seeds the one way to form the empty target?', correct: 'dp[0] = 1', choices: ['dp[0] = 1', 'dp[0] = 0', 'dp[len(t)] = 1'], why: 'There is exactly one way to form the empty target — the base every count builds on.' },
    { prompt: 'Which line walks the target backward so a source char is used once per step?', correct: 'for j in range(len(t), 0, -1):', choices: ['for j in range(len(t), 0, -1):', 'for j in range(1, len(t) + 1):', 'for j in range(len(t), -1, -1):'], why: 'Iterating j downward keeps one source character from extending the same prefix twice.' },
  ],
  'Single Number': [
    { prompt: 'Which line folds each value into the running XOR?', correct: 'result ^= n', choices: ['result ^= n', 'result += n', 'result |= n'], why: 'XOR cancels any value seen an even number of times, leaving only the value seen once.', wrong: { 'result += n': 'Adding sums the whole array; it does not isolate the unique value.', 'result |= n': 'OR only ever sets bits, so duplicates never cancel out.' } },
  ],
  'Plus One': [
    { prompt: 'Which line detects a digit that can be bumped without carrying?', correct: 'if digits[i] < 9:', choices: ['if digits[i] < 9:', 'if digits[i] <= 9:', 'if digits[i] > 9:'], why: 'A digit below 9 can be incremented directly, so we bump it and return.', wrong: { 'if digits[i] <= 9:': 'A 9 does carry (it becomes 10), so <= 9 would wrongly increment it in place.', 'if digits[i] > 9:': 'Digits are never above 9, so this branch never runs.' } },
    { prompt: 'Which line handles a number of all 9s carrying out a new digit?', correct: 'return [1] + digits', choices: ['return [1] + digits', 'return digits + [1]', 'return digits'], why: 'When every digit was a 9 they all became 0, so a leading 1 is prepended.', wrong: { 'return digits + [1]': 'That appends 1 at the end; the carry belongs at the front.', 'return digits': 'Without the leading 1, [9, 9] would wrongly return [0, 0].' } },
  ],
  'Min Cost Climbing Stairs': [
    { prompt: 'Which line computes the cheapest cost to stand on the current stair?', correct: 'current = min(one, two) + cost[i]', choices: ['current = min(one, two) + cost[i]', 'current = max(one, two) + cost[i]', 'current = one + two + cost[i]'], why: 'Standing on this stair costs its own cost plus the cheaper of the two ways to reach it.', wrong: { 'current = max(one, two) + cost[i]': 'We want the minimum-cost path, not the maximum.', 'current = one + two + cost[i]': 'You arrive by only one of the two paths, so summing both overcounts.' } },
  ],
  'Same Tree': [
    { prompt: 'Which line rejects a mismatch at the current pair of nodes?', correct: 'if not p or not q or p.val != q.val:', choices: ['if not p or not q or p.val != q.val:', 'if not p and not q or p.val != q.val:', 'if p.val != q.val:'], why: 'They differ if one node exists while the other is None, or their values disagree.', wrong: { 'if not p and not q or p.val != q.val:': 'This still reads p.val when p is None (only the and is guarded), so it throws.', 'if p.val != q.val:': 'Reading p.val throws when one tree ended before the other.' } },
  ],
  'Linked List Cycle': [
    { prompt: 'Which line moves the fast pointer two nodes ahead?', correct: 'fast = fast.next.next', choices: ['fast = fast.next.next', 'fast = fast.next', 'fast = slow.next.next'], why: 'Fast must travel twice as fast as slow so it laps slow inside any cycle.', wrong: { 'fast = fast.next': 'Then both pointers move at the same speed and never meet in a cycle.', 'fast = slow.next.next': 'Fast must advance from its own position, not from slow.' } },
  ],
  'Last Stone Weight': [
    { prompt: 'Which line returns the leftover weight to the pile after a smash?', correct: 'stones.append(y - x)', choices: ['stones.append(y - x)', 'stones.append(y + x)', 'stones.append(x - y)'], why: 'The two heaviest smash; if unequal, the difference remains, and y is the larger.', wrong: { 'stones.append(y + x)': 'Smashing destroys weight; it does not add the two together.', 'stones.append(x - y)': 'x is the smaller weight, so x - y would be negative — keep y - x.' } },
  ],
  'Missing Number': [
    { prompt: 'Which line cancels each present number against its index?', correct: 'missing ^= i ^ nums[i]', choices: ['missing ^= i ^ nums[i]', 'missing += i ^ nums[i]', 'missing ^= i + nums[i]'], why: 'XOR of a value with its equal index cancels to 0; the missing number has no index to cancel it.', wrong: { 'missing += i ^ nums[i]': 'Addition does not cancel matching pairs; only XOR does.', 'missing ^= i + nums[i]': 'The index and value must be XOR-ed separately, not added together first.' } },
  ],
  'Number of 1 Bits': [
    { prompt: 'Which line adds the current lowest bit to the count?', correct: 'count += n & 1', choices: ['count += n & 1', 'count += n | 1', 'count += n % 1'], why: 'n & 1 isolates the lowest bit (0 or 1); adding it counts a set bit.', wrong: { 'count += n | 1': 'OR forces the bit on and yields a big number, not just the last bit.', 'count += n % 1': 'Any integer mod 1 is 0, so nothing is ever counted.' } },
  ],
  'Happy Number': [
    { prompt: 'Which line adds the square of the current digit?', correct: 'total += digit * digit', choices: ['total += digit * digit', 'total += digit', 'total += digit + digit'], why: 'The process sums the SQUARE of each digit, so add digit * digit.', wrong: { 'total += digit': 'That sums the digits themselves, which is a different process.', 'total += digit + digit': 'digit + digit is two times the digit, not the digit squared.' } },
  ],
  'Balanced Binary Tree': [
    { prompt: 'Which line flags a node whose two subtrees are too different in height?', correct: 'if abs(left_height - right_height) > 1:', choices: ['if abs(left_height - right_height) > 1:', 'if left_height - right_height > 1:', 'if abs(left_height - right_height) >= 1:'], why: 'The heights may differ by at most 1 in either direction, so compare the absolute difference against 1.', wrong: { 'if left_height - right_height > 1:': 'That misses the case where the right subtree is the taller one.', 'if abs(left_height - right_height) >= 1:': 'A difference of exactly 1 is still balanced; only more than 1 fails.' } },
  ],
  'Subtree of Another Tree': [
    { prompt: 'Which line checks whether the subtree rooted here matches sub_root exactly?', correct: 'if is_same_tree(root, sub_root):', choices: ['if is_same_tree(root, sub_root):', 'if root.val == sub_root.val:', 'if is_subtree(root, sub_root):'], why: 'A match means the entire subtree here equals sub_root, so compare them node by node.', wrong: { 'if root.val == sub_root.val:': 'Equal roots do not guarantee the rest of the subtrees match.', 'if is_subtree(root, sub_root):': 'Calling is_subtree on the same node just recurses forever.' } },
    { prompt: 'Which line searches the children when the current node does not match?', correct: 'return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)', choices: ['return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)', 'return is_subtree(root.left, sub_root) and is_subtree(root.right, sub_root)', 'return is_same_tree(root.left, sub_root) or is_same_tree(root.right, sub_root)'], why: 'The subtree can sit under either child, so a match in one branch is enough.', wrong: { 'return is_subtree(root.left, sub_root) and is_subtree(root.right, sub_root)': 'It only needs to appear once, so and wrongly demands it on both sides.', 'return is_same_tree(root.left, sub_root) or is_same_tree(root.right, sub_root)': 'That only checks the child itself, not every deeper node.' } },
  ],
  'Counting Bits': [
    { prompt: 'Which line builds the count for i from a smaller, known answer?', correct: 'result[i] = result[i >> 1] + (i & 1)', choices: ['result[i] = result[i >> 1] + (i & 1)', 'result[i] = result[i - 1] + (i & 1)', 'result[i] = result[i >> 1] + 1'], why: 'The count for i is the count for i with its last bit removed, plus that last bit.', wrong: { 'result[i] = result[i - 1] + (i & 1)': 'i - 1 is not i with a bit dropped, so its count does not carry over.', 'result[i] = result[i >> 1] + 1': 'The dropped bit may be 0, so add i & 1, not always 1.' } },
    { prompt: 'Which line allocates room for every answer from 0 to n?', correct: 'result = [0] * (n + 1)', choices: ['result = [0] * (n + 1)', 'result = [0] * n', 'result = [1] * (n + 1)'], why: 'Indices run from 0 through n, so the list needs n + 1 slots, and 0 has zero bits.', wrong: { 'result = [0] * n': 'That leaves no slot for index n, so the last answer is missing.', 'result = [1] * (n + 1)': 'result[0] must be 0 because zero has no set bits.' } },
  ],
  'Reverse Bits': [
    { prompt: 'Which line appends the current lowest bit onto the reversed result?', correct: 'result = (result << 1) | (n & 1)', choices: ['result = (result << 1) | (n & 1)', 'result = (result >> 1) | (n & 1)', 'result = (result << 1) | n'], why: 'Open a new low slot with a left shift, then OR in the current lowest bit of n.', wrong: { 'result = (result >> 1) | (n & 1)': 'Shifting the result right loses bits already placed instead of making room.', 'result = (result << 1) | n': 'You must add just the lowest bit (n & 1), not all of n.' } },
    { prompt: 'Which line exposes the next bit of the input for the following step?', correct: 'n >>= 1', choices: ['n >>= 1', 'n <<= 1', 'n >>= 2'], why: 'After consuming the lowest bit, shift n right so the next bit becomes the lowest.', wrong: { 'n <<= 1': 'Shifting left moves away from the bit you need next and never terminates.', 'n >>= 2': 'Skipping two bits at a time drops half of them unreversed.' } },
  ],
  'Container With Most Water': [
    { prompt: 'Which line measures the water held by the current pair of walls?', correct: 'best = max(best, (right - left) * min(height[left], height[right]))', choices: ['best = max(best, (right - left) * min(height[left], height[right]))', 'best = max(best, (right - left) * max(height[left], height[right]))', 'best = max(best, (right + left) * min(height[left], height[right]))'], why: 'Water is bounded by the shorter wall, so the area is the width times the minimum height.', wrong: { 'best = max(best, (right - left) * max(height[left], height[right]))': 'The taller wall would overflow; the shorter wall sets the water level.', 'best = max(best, (right + left) * min(height[left], height[right]))': 'Width is the distance between the walls, right - left, not their sum.' } },
    { prompt: 'Which line advances the pointer that could actually improve the area?', correct: 'if height[left] <= height[right]:', choices: ['if height[left] <= height[right]:', 'if height[left] > height[right]:', 'while height[left] <= height[right]:'], why: 'When the left wall is the shorter or equal, advance it inward to look for a taller one.', wrong: { 'if height[left] > height[right]:': 'That advances left when it is the TALLER wall, discarding the better side.', 'while height[left] <= height[right]:': 'A while here loops on a fixed condition and never lets right move.' } },
  ],
  'Find Minimum in Rotated Sorted Array': [
    { prompt: 'When the middle is bigger than the right end, which line discards the sorted left half?', correct: 'if nums[mid] > nums[right]:', choices: ['if nums[mid] > nums[right]:', 'if nums[mid] > nums[left]:', 'if nums[mid] < nums[right]:'], why: 'A middle bigger than the right end means the minimum lies strictly to the right of mid.', wrong: { 'if nums[mid] > nums[left]:': 'Comparing to the left end fails on an already-sorted range.', 'if nums[mid] < nums[right]:': 'A smaller mid means the minimum is at mid or to its left, so this branch is inverted.' } },
    { prompt: 'Otherwise, which line keeps mid as a possible minimum?', correct: 'right = mid', choices: ['right = mid', 'right = mid - 1', 'left = mid'], why: 'When mid is not greater than the right end, mid itself could be the minimum, so keep it in range.', wrong: { 'right = mid - 1': 'mid itself might be the minimum, so mid - 1 can skip past the answer.', 'left = mid': 'Moving left up would drop the smaller half that contains the minimum.' } },
  ],
  'Remove Nth Node From End of List': [
    { prompt: 'Which line opens the n-node gap between the two pointers?', correct: 'for _ in range(n):', choices: ['for _ in range(n):', 'for _ in range(n + 1):', 'for _ in range(n - 1):'], why: 'Advancing fast exactly n times opens the gap that leaves slow just before the target.', wrong: { 'for _ in range(n + 1):': 'That advances fast one time too many, so slow ends up past the target.', 'for _ in range(n - 1):': 'One step short leaves slow on the target instead of before it.' } },
    { prompt: 'Which line splices the target node out of the list?', correct: 'slow.next = slow.next.next', choices: ['slow.next = slow.next.next', 'slow = slow.next.next', 'slow.next = slow.next'], why: 'Pointing slow.next past the target node removes it from the chain.', wrong: { 'slow = slow.next.next': 'That just moves the pointer; the target is still linked in.', 'slow.next = slow.next': 'Assigning next to itself changes nothing, so the node stays.' } },
  ],
};

for (const [title, specs] of Object.entries(walkthroughPythonExercises)) {
  specs.forEach((spec, index) => {
    pythonExercises[`${title}:${index}`] = pyEx(title, spec);
  });
}
