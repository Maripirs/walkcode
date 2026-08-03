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
};

for (const [title, specs] of Object.entries(walkthroughPythonExercises)) {
  specs.forEach((spec, index) => {
    pythonExercises[`${title}:${index}`] = pyEx(title, spec);
  });
}
