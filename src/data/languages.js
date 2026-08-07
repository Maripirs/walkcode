// Language-specific lesson variants.
import { supplementalFullCode } from './supplemental-solutions.js';
import { blankLine, genericWrong } from './blank-line.js';


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
// lesson-records.js (the upgraded records); here we blank one line of the Python reference solution
// so the two languages stay parallel. Specs are { prompt, correct, choices, why }.
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
  'Longest Increasing Subsequence': [
    {"prompt":"Which line extends an earlier increasing subsequence?","correct":"if nums[j] < nums[i]:","choices":["if nums[j] < nums[i]:","if nums[j] > nums[i]:","if nums[j] <= nums[i]:"],"why":"Only a strictly smaller earlier value can precede nums[i].","wrong":{"if nums[j] > nums[i]:":"A larger earlier value cannot come before nums[i] in an increasing run.","if nums[j] <= nums[i]:":"Allowing equal values breaks the strictly-increasing requirement."}},
    {"prompt":"Which line seeds each index correctly?","correct":"dp = [1] * len(nums)","choices":["dp = [1] * len(nums)","dp = [0] * len(nums)","dp = [len(nums)] * len(nums)"],"why":"Every element by itself is an increasing subsequence of length 1.","wrong":{"dp = [0] * len(nums)":"Length 0 would undercount every subsequence by one.","dp = [len(nums)] * len(nums)":"No subsequence starts longer than 1."}},
  ],
  'Word Break': [
    {"prompt":"Which line marks a prefix as breakable?","correct":"if dp[j] and s[j:i] in word_set:","choices":["if dp[j] and s[j:i] in word_set:","if s[j:i] in word_set:","if dp[j] and s[0:i] in word_set:"],"why":"The chunk s[j:i] must be a word AND everything before j must already segment.","wrong":{"if s[j:i] in word_set:":"Ignoring dp[j] allows a valid word after an unsegmentable prefix.","if dp[j] and s[0:i] in word_set:":"The new chunk starts at j, not at 0."}},
    {"prompt":"Which line seeds the base case?","correct":"dp[0] = True","choices":["dp[0] = True","dp[0] = False","dp[len(s)] = True"],"why":"The empty prefix is breakable, giving the first real word somewhere to build from.","wrong":{"dp[0] = False":"Then no prefix is ever breakable and the answer is always false.","dp[len(s)] = True":"That assumes the answer instead of computing it."}},
  ],
  'Maximum Product Subarray': [
    {"prompt":"Which line forms the candidates that handle negatives?","correct":"candidates = [n, cur_max * n, cur_min * n]","choices":["candidates = [n, cur_max * n, cur_min * n]","candidates = [n, cur_max * n]","candidates = [cur_max * n, cur_min * n]"],"why":"Extending from the min matters because a negative n makes cur_min*n large; n alone allows a restart.","wrong":{"candidates = [n, cur_max * n]":"Dropping cur_min*n misses the case where a negative flips the min into the max.","candidates = [cur_max * n, cur_min * n]":"Omitting n alone forbids restarting the subarray at n."}},
    {"prompt":"Which line keeps the running minimum product?","correct":"cur_min = min(candidates)","choices":["cur_min = min(candidates)","cur_min = max(candidates)","cur_min = cur_min * n"],"why":"The smallest product so far can become the largest once multiplied by a future negative.","wrong":{"cur_min = max(candidates)":"That duplicates cur_max and loses the minimum entirely.","cur_min = cur_min * n":"This ignores restarting and the interaction with cur_max."}},
  ],
  'Longest Common Subsequence': [
    {"prompt":"Which line handles two matching characters?","correct":"dp[i][j] = dp[i - 1][j - 1] + 1","choices":["dp[i][j] = dp[i - 1][j - 1] + 1","dp[i][j] = dp[i - 1][j - 1]","dp[i][j] = dp[i][j] + 1"],"why":"A shared character extends the LCS of the two shorter prefixes (the diagonal) by one.","wrong":{"dp[i][j] = dp[i - 1][j - 1]":"Forgetting the + 1 never counts the matched character.","dp[i][j] = dp[i][j] + 1":"dp[i][j] is still 0 here; you must build from the diagonal."}},
    {"prompt":"Which line handles a mismatch?","correct":"dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])","choices":["dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])","dp[i][j] = dp[i - 1][j - 1]","dp[i][j] = min(dp[i - 1][j], dp[i][j - 1])"],"why":"With no match, the best is to drop one character from either string and keep the larger result.","wrong":{"dp[i][j] = dp[i - 1][j - 1]":"Using the diagonal on a mismatch skips a character from both strings unfairly.","dp[i][j] = min(dp[i - 1][j], dp[i][j - 1])":"You want the longer of the two options, not the shorter."}},
  ],
  'Gas Station': [
    {"prompt":"When the tank runs dry, which line picks the next candidate start?","correct":"start = i + 1","choices":["start = i + 1","start = i","start = 0"],"why":"If you cannot reach station i + 1, no start from the old candidate up to i works, so the earliest new hope is i + 1.","wrong":{"start = i":"Station i is where you ran dry, so it also fails as a start.","start = 0":"Restarting at 0 re-tries stations already proven to fail."}},
    {"prompt":"Which line reports the result correctly?","correct":"return start if total >= 0 else -1","choices":["return start if total >= 0 else -1","return start","return -1 if total >= 0 else start"],"why":"A full loop is possible only when total gas is at least total cost; otherwise return -1.","wrong":{"return start":"This ignores whether the whole route is even feasible.","return -1 if total >= 0 else start":"The branches are swapped — it returns -1 on success."}},
  ],
  'Partition Labels': [
    {"prompt":"Which line stretches the partition to contain the current letter fully?","correct":"end = max(end, last[s[i]])","choices":["end = max(end, last[s[i]])","end = last[s[i]]","end = max(end, i)"],"why":"The part cannot end before the last occurrence of every letter it contains.","wrong":{"end = last[s[i]]":"Overwriting can shrink the end below an earlier letter’s last occurrence.","end = max(end, i)":"i is the current index, which never extends past letters seen so far."}},
    {"prompt":"Which line decides a partition can be closed?","correct":"if i == end:","choices":["if i == end:","if i == start:","if i > end:"],"why":"Once the scan index reaches end, every letter inside has had its last occurrence.","wrong":{"if i == start:":"That closes immediately at the first character.","if i > end:":"The scan index never passes end before the cut is made."}},
  ],
  'Insert Interval': [
    {"prompt":"Which line detects an interval that overlaps the new one?","correct":"while i < n and intervals[i][0] <= new_interval[1]:","choices":["while i < n and intervals[i][0] <= new_interval[1]:","while i < n and intervals[i][0] < new_interval[1]:","while i < n and intervals[i][1] <= new_interval[1]:"],"why":"Sorted by start, an interval overlaps while its start is within the new interval’s end (touching merges).","wrong":{"while i < n and intervals[i][0] < new_interval[1]:":"A strict < fails to merge intervals that just touch the new end.","while i < n and intervals[i][1] <= new_interval[1]:":"Comparing ends misidentifies which intervals overlap."}},
    {"prompt":"Which line widens the merged interval’s end?","correct":"new_interval[1] = max(new_interval[1], intervals[i][1])","choices":["new_interval[1] = max(new_interval[1], intervals[i][1])","new_interval[1] = intervals[i][1]","new_interval[1] = min(new_interval[1], intervals[i][1])"],"why":"The merged end must cover both, so take the larger of the two ends.","wrong":{"new_interval[1] = intervals[i][1]":"The current interval may end earlier, which would shrink the merge.","new_interval[1] = min(new_interval[1], intervals[i][1])":"Taking the min shrinks the interval instead of covering both."}},
  ],
  'Spiral Matrix': [
    {"prompt":"Which line walks the top edge of the current ring?","correct":"result.append(matrix[top][c])","choices":["result.append(matrix[top][c])","result.append(matrix[bottom][c])","result.append(matrix[c][top])"],"why":"The spiral starts by going left to right across the top row.","wrong":{"result.append(matrix[bottom][c])":"That reads the bottom row during the top-row phase.","result.append(matrix[c][top])":"That swaps row and column indexing."}},
    {"prompt":"Which line guards against revisiting a lone middle row?","correct":"if top <= bottom:","choices":["if top <= bottom:","if top < bottom:","if top >= bottom:"],"why":"After moving top down, only walk the bottom row if a distinct row still remains.","wrong":{"if top < bottom:":"A strict < skips the bottom row when exactly one row is left, dropping values.","if top >= bottom:":"That inverts the condition and traverses when it should not."}},
  ],
  'Pow(x, n)': [
    {"prompt":"Which line halves the problem for O(log n) time?","correct":"half = power(base, exp // 2)","choices":["half = power(base, exp // 2)","half = power(base, exp - 1)","half = power(base, exp / 2)"],"why":"Recursing on exp // 2 halves the exponent each step, giving logarithmic depth.","wrong":{"half = power(base, exp - 1)":"Decrementing by one makes it O(n), not O(log n).","half = power(base, exp / 2)":"True division gives a float exponent, breaking the recursion."}},
    {"prompt":"Which line reassembles the answer from the half-power?","correct":"return half * half if exp % 2 == 0 else half * half * base","choices":["return half * half if exp % 2 == 0 else half * half * base","return half * half","return half if exp % 2 == 0 else half * base"],"why":"Square the half-power, and for an odd exponent multiply in one more base.","wrong":{"return half * half":"This drops the extra base needed when the exponent is odd.","return half if exp % 2 == 0 else half * base":"Failing to square the half-power gives the wrong magnitude."}},
  ],
  'Course Schedule II': [
    {"prompt":"Which line makes a course available once its prerequisites are done?","correct":"if indegree[nxt] == 0:","choices":["if indegree[nxt] == 0:","if indegree[nxt] > 0:","if indegree[nxt] < 0:"],"why":"A dependent can be taken only after every prerequisite is removed, i.e. its indegree hits 0.","wrong":{"if indegree[nxt] > 0:":"Enqueuing while prerequisites remain produces an invalid order.","if indegree[nxt] < 0:":"Indegree never goes negative, so this never fires."}},
    {"prompt":"Which line detects an impossible (cyclic) schedule?","correct":"return order if len(order) == num_courses else []","choices":["return order if len(order) == num_courses else []","return order","return [] if len(order) == num_courses else order"],"why":"If a cycle blocks some courses, fewer than num_courses get ordered, so return [].","wrong":{"return order":"A partial order from a cyclic graph is not a valid schedule.","return [] if len(order) == num_courses else order":"The branches are swapped — it returns [] on success."}},
  ],
  'Lowest Common Ancestor of a Binary Search Tree': [
    {"prompt":"Which line steps toward the subtree that could hold both targets?","correct":"if p.val < current.val and q.val < current.val:","choices":["if p.val < current.val and q.val < current.val:","if p.val > current.val and q.val > current.val:","if p.val < current.val or q.val < current.val:"],"why":"When both targets are smaller than the current node, both lie in its left subtree.","wrong":{"if p.val > current.val and q.val > current.val:":"That is the go-right condition, not go-left.","if p.val < current.val or q.val < current.val:":"Only one being smaller means they split here."}},
    {"prompt":"Which line returns the lowest common ancestor?","correct":"return current","choices":["return current","return None","return current.left"],"why":"Once the targets fall on different sides (or one equals the node), the current node is their LCA.","wrong":{"return None":"The split node IS the answer, not None.","return current.left":"Descending past the split point overshoots the LCA."}},
  ],
  'Binary Tree Level Order Traversal': [
    {"prompt":"Which line records the current level's values?","correct":"result.append([node.val for node in level])","choices":["result.append([node.val for node in level])","result.append(level)","result.append(next_level)"],"why":"Each output entry is the list of values across the current level.","wrong":{"result.append(level)":"That stores node objects, not their values.","result.append(next_level)":"next_level is not built yet on this line."}},
    {"prompt":"Which line advances to the next level?","correct":"level = next_level","choices":["level = next_level","level = result","level = level"],"why":"The gathered children become the level processed on the following pass.","wrong":{"level = result":"result holds value-lists, not nodes to traverse.","level = level":"That never advances, looping forever."}},
  ],
  'Binary Tree Right Side View': [
    {"prompt":"Which line records the value visible from the right at this level?","correct":"result.append(level[-1].val)","choices":["result.append(level[-1].val)","result.append(level[0].val)","result.append(len(level))"],"why":"The rightmost node of the level is its last element.","wrong":{"result.append(level[0].val)":"level[0] is the leftmost node, the opposite side.","result.append(len(level))":"That records a count, not a node value."}},
    {"prompt":"Which line enqueues a right child for the next level?","correct":"next_level.append(node.right)","choices":["next_level.append(node.right)","next_level.append(node.left)","next_level.append(node)"],"why":"Adding right children after left keeps the rightmost node at the end of the next level.","wrong":{"next_level.append(node.left)":"The right-child branch must enqueue the right child.","next_level.append(node)":"That enqueues the parent again, not its child."}},
  ],
  'Count Good Nodes in Binary Tree': [
    {"prompt":"Which line counts a node as \"good\"?","correct":"if node.val >= max_so_far:","choices":["if node.val >= max_so_far:","if node.val > max_so_far:","if node.val <= max_so_far:"],"why":"A node is good when nothing above it is larger, i.e. it is >= the path maximum (equal counts).","wrong":{"if node.val > max_so_far:":"A strict > wrongly excludes a node equal to the path maximum.","if node.val <= max_so_far:":"That counts the non-good nodes instead."}},
    {"prompt":"Which line updates the maximum passed to the children?","correct":"next_max = max(max_so_far, node.val)","choices":["next_max = max(max_so_far, node.val)","next_max = min(max_so_far, node.val)","next_max = node.val"],"why":"Children must know the largest value on the path including this node.","wrong":{"next_max = min(max_so_far, node.val)":"The path maximum can only grow, never shrink.","next_max = node.val":"This forgets larger ancestors above the current node."}},
  ],
  'Kth Smallest Element in a BST': [
    {"prompt":"Which line drives the traversal to the smallest values first?","correct":"current = current.left","choices":["current = current.left","current = current.right","current = stack.pop()"],"why":"Pushing nodes while going left means the leftmost (smallest) node is popped first.","wrong":{"current = current.right":"Going right first visits larger values before smaller ones.","current = stack.pop()":"Popping here skips descending to the smallest node."}},
    {"prompt":"Which line returns the answer once k values have been seen?","correct":"if k == 0:","choices":["if k == 0:","if k == 1:","if k < 0:"],"why":"After k decrements reach 0, the just-popped node is the kth smallest value.","wrong":{"if k == 1:":"That returns the (k-1)th value, off by one.","if k < 0:":"k never goes negative before the answer is found."}},
  ],
  'Permutations': [
    {"prompt":"Which line skips an element already in the current permutation?","correct":"if used[i]:","choices":["if used[i]:","if not used[i]:","if i in used:"],"why":"Each element appears once per permutation, so skip indices already placed.","wrong":{"if not used[i]:":"This skips the AVAILABLE elements — backwards.","if i in used:":"used holds booleans by index; testing membership of i is wrong."}},
    {"prompt":"Which line frees an element after exploring its branch?","correct":"used[i] = False","choices":["used[i] = False","used[i] = True","used[0] = False"],"why":"Un-marking on the way back lets other permutations use this element again.","wrong":{"used[i] = True":"Leaving it used blocks the element in every sibling branch.","used[0] = False":"This clears the wrong index, corrupting the state."}},
  ],
  'Generate Parentheses': [
    {"prompt":"Which line adds an opening bracket when it is still allowed?","correct":"if open_count < n:","choices":["if open_count < n:","if open_count <= n:","if open_count < close_count:"],"why":"You may open another pair while fewer than n opens have been placed.","wrong":{"if open_count <= n:":"<= n would place an (n+1)th open bracket.","if open_count < close_count:":"Opens should be bounded by n, not by the close count."}},
    {"prompt":"Which line adds a closing bracket only when valid?","correct":"if close_count < open_count:","choices":["if close_count < open_count:","if close_count < n:","if close_count <= open_count:"],"why":"A \")\" is legal only when there are more opens than closes so far.","wrong":{"if close_count < n:":"Comparing to n lets a close outrun its opens.","if close_count <= open_count:":"<= permits an equal count, creating \")(\" style invalids."}},
  ],
  'Letter Combinations of a Phone Number': [
    {"prompt":"Which line explores one letter and moves to the next digit?","correct":"backtrack(index + 1, current + letter)","choices":["backtrack(index + 1, current + letter)","backtrack(index, current + letter)","backtrack(index + 1, current)"],"why":"Choosing a letter for this digit means appending it and advancing to the next digit.","wrong":{"backtrack(index, current + letter)":"Not advancing the index loops on the same digit forever.","backtrack(index + 1, current)":"Advancing without the letter drops this digit’s choice."}},
    {"prompt":"Which line recognizes a finished combination?","correct":"if index == len(digits):","choices":["if index == len(digits):","if index == len(digits) - 1:","if index == 0:"],"why":"When the index passes the last digit, every digit has contributed a letter.","wrong":{"if index == len(digits) - 1:":"This stops one digit early, missing the last letter.","if index == 0:":"That records at the very start, before any letter is chosen."}},
  ],
  'Rotting Oranges': [
    {"prompt":"Which line rots a fresh neighbor?","correct":"grid[nr][nc] = 2","choices":["grid[nr][nc] = 2","grid[nr][nc] = 1","grid[r][c] = 2"],"why":"The reached fresh neighbor becomes rotten (2).","wrong":{"grid[nr][nc] = 1":"Setting it back to fresh never makes progress.","grid[r][c] = 2":"That re-marks the source cell, not the neighbor."}},
    {"prompt":"Which line reports the result correctly?","correct":"return minutes if fresh == 0 else -1","choices":["return minutes if fresh == 0 else -1","return minutes","return -1 if fresh == 0 else minutes"],"why":"If any orange stayed fresh (unreachable), the task is impossible → -1.","wrong":{"return minutes":"This ignores oranges that could never rot.","return -1 if fresh == 0 else minutes":"The branches are swapped — it returns -1 on success."}},
  ],
  'Number of Connected Components in an Undirected Graph': [
    {"prompt":"Which line detects that an edge joins two separate components?","correct":"if ra != rb:","choices":["if ra != rb:","if ra == rb:","if a != b:"],"why":"Different roots mean the endpoints are not yet connected, so this edge merges two components.","wrong":{"if ra == rb:":"Equal roots mean already connected — no merge should happen.","if a != b:":"Comparing raw endpoints ignores transitive connections."}},
    {"prompt":"Which line reflects that two components became one?","correct":"count -= 1","choices":["count -= 1","count += 1","count = 0"],"why":"Each successful union reduces the number of components by exactly one.","wrong":{"count += 1":"A merge decreases the count, it does not increase it.","count = 0":"One merge does not connect the entire graph."}},
  ],
  'House Robber': [
    {"prompt":"Which line's value is the best total that robs the current house?","correct":"take = skip + value","choices":["take = skip + value","take = take + value","skip = skip + value"],"why":"Robbing this house means its value plus the best total where the previous (adjacent) house was skipped.","wrong":{"take = take + value":"Adding to take would rob two adjacent houses.","skip = skip + value":"skip means this house is NOT robbed, so its value should not be added."}},
    {"prompt":"Which line captures the best total up to the previous house?","correct":"current = max(take, skip)","choices":["current = max(take, skip)","current = min(take, skip)","current = take + skip"],"why":"Before updating, the best total up to the previous house is the larger of the two running totals.","wrong":{"current = min(take, skip)":"The best is the maximum, not the minimum.","current = take + skip":"These are alternative totals, not additive."}},
  ],
  'House Robber II': [
    {"prompt":"Which line combines the two passes that each drop one end?","correct":"return max(rob(nums[:-1]), rob(nums[1:]))","choices":["return max(rob(nums[:-1]), rob(nums[1:]))","return max(rob(nums[:-1]), rob(nums))","return rob(nums)"],"why":"One pass excludes the last house and one excludes the first, so the first and last are never both taken.","wrong":{"return max(rob(nums[:-1]), rob(nums))":"The second call still includes both ends, which the circle forbids.","return rob(nums)":"Running the plain linear solution ignores the first/last adjacency."}},
    {"prompt":"Which line handles the single-house circle?","correct":"if len(nums) == 1:","choices":["if len(nums) == 1:","if len(nums) == 0:","if len(nums) > 1:"],"why":"With one house there is no neighbor to conflict, so return it directly and avoid an empty slice.","wrong":{"if len(nums) == 0:":"That guards the empty case, not the single-house one.","if len(nums) > 1:":"This inverts the check, taking the shortcut for the wrong sizes."}},
  ],
  'Max Area of Island': [
    {"prompt":"Which line stops the same cell from being counted twice?","correct":"grid[r][c] = 0","choices":["grid[r][c] = 0","grid[r][c] = 1","return 0"],"why":"Sinking the visited land cell to water means the recursions never flood back into it.","wrong":{"grid[r][c] = 1":"Leaving it as land lets the neighbors recurse back in endlessly.","return 0":"Returning here counts nothing and abandons the island early."}},
    {"prompt":"Which line returns this island's size from the cell and its neighbors?","correct":"return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1)","choices":["return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1)","return area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1)","return 1"],"why":"This cell counts as 1, plus everything flooded from its four neighbors.","wrong":{"return area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1)":"Dropping the + 1 never counts the current cell.","return 1":"This counts only the current cell and never floods outward."}},
  ],
  'Clone Graph': [
    {"prompt":"Which line stops a cycle from cloning a node again?","correct":"if node in clones:","choices":["if node in clones:","if node not in clones:","if node.val in clones:"],"why":"Once a node is cloned, returning that clone breaks the cycle instead of recursing forever.","wrong":{"if node not in clones:":"Inverted: it takes the shortcut for brand-new nodes.","if node.val in clones:":"Keying by val collides when two nodes share a value."}},
    {"prompt":"Which line lets cycles resolve to the right clone?","correct":"clones[node] = copy","choices":["clones[node] = copy","clones[copy] = node","clones[node.val] = copy"],"why":"Recording original → clone before recursing means a neighbor that loops back finds this clone.","wrong":{"clones[copy] = node":"The key must be the original node, not its clone.","clones[node.val] = copy":"Keying by val collides when two nodes share a value."}},
  ],
  'K Closest Points to Origin': [
    {"prompt":"Which line ranks a point by its closeness to the origin?","correct":"return p[0] * p[0] + p[1] * p[1]","choices":["return p[0] * p[0] + p[1] * p[1]","return p[0] + p[1]","return abs(p[0]) + abs(p[1])"],"why":"Squared Euclidean distance orders points identically to true distance, without a square root.","wrong":{"return p[0] + p[1]":"A raw coordinate sum is not distance and can be negative.","return abs(p[0]) + abs(p[1])":"That is Manhattan distance, a different metric that reorders points."}},
    {"prompt":"Which line returns the k nearest points?","correct":"return points[:k]","choices":["return points[:k]","return points[:k + 1]","return points[k:]"],"why":"After sorting ascending, the closest k points are the first k.","wrong":{"return points[:k + 1]":"That returns one point too many.","return points[k:]":"That drops the nearest k and returns the rest."}},
  ],
  'Permutation in String': [
    {"prompt":"Which line drops the letter that just left the window?","correct":"win[code(s2[i - len(s1)])] -= 1","choices":["win[code(s2[i - len(s1)])] -= 1","win[code(s2[i - len(s1)])] += 1","win[code(s2[i])] -= 1"],"why":"As the window slides right, the letter len(s1) positions back leaves the window and its count drops.","wrong":{"win[code(s2[i - len(s1)])] += 1":"Incrementing the outgoing letter keeps it in the window forever.","win[code(s2[i])] -= 1":"That removes the letter you just added on the right edge."}},
    {"prompt":"Which line tallies s1's target letter counts?","correct":"need[code(s1[i])] += 1","choices":["need[code(s1[i])] += 1","win[code(s1[i])] += 1","need[code(s2[i])] += 1"],"why":"need holds the letter frequencies the window must match, taken from s1.","wrong":{"win[code(s1[i])] += 1":"That adds s1’s letters to the window instead of the target.","need[code(s2[i])] += 1":"The target counts come from s1, not s2."}},
  ],
  'Add Two Numbers': [
    {"prompt":"Which line computes the digit carried into the next place?","correct":"carry = total // 10","choices":["carry = total // 10","carry = total % 10","carry = total / 10"],"why":"The carry is the tens part of the column sum, i.e. integer division by 10.","wrong":{"carry = total % 10":"total % 10 is the ones digit you write down, not the carry.","carry = total / 10":"True division keeps a float, corrupting later digits."}},
    {"prompt":"Which line writes the current output digit?","correct":"tail.next = ListNode(total % 10)","choices":["tail.next = ListNode(total % 10)","tail.next = ListNode(total)","tail.next = ListNode(carry)"],"why":"Each node stores a single digit — the ones part of the column sum.","wrong":{"tail.next = ListNode(total)":"total can be two digits (e.g. 13), not a valid single-digit node.","tail.next = ListNode(carry)":"The carry belongs in the NEXT column, not this node."}},
  ],
  'Non-overlapping Intervals': [
    {"prompt":"Which line orders the intervals for the greedy choice?","correct":"intervals.sort(key=lambda iv: iv[1])","choices":["intervals.sort(key=lambda iv: iv[1])","intervals.sort(key=lambda iv: iv[0])","intervals.sort(key=lambda iv: -iv[1])"],"why":"Sorting by earliest end lets you always keep the interval that frees up the most room.","wrong":{"intervals.sort(key=lambda iv: iv[0])":"Sorting by start can keep a long early interval that blocks many others.","intervals.sort(key=lambda iv: -iv[1])":"Descending by end keeps the latest finisher — the opposite of the greedy rule."}},
    {"prompt":"Which line decides an interval can be kept?","correct":"if start >= prev_end:","choices":["if start >= prev_end:","if start > prev_end:","if start <= prev_end:"],"why":"An interval starting at or after the last kept end does not overlap it, so keep it (touching is allowed).","wrong":{"if start > prev_end:":"A strict > wrongly removes touching intervals like [1,2] and [2,3].","if start <= prev_end:":"This keeps the overlapping ones and drops the good ones."}},
  ],
  'Jump Game': [
    {"prompt":"Which line detects that the current index can't be reached?","correct":"if i > reach:","choices":["if i > reach:","if i < reach:","if i > nums[i]:"],"why":"If the current index is past everything reachable so far, no earlier jump can land here.","wrong":{"if i < reach:":"Indexes within reach are fine — this fails on reachable positions.","if i > nums[i]:":"That compares an index to a jump length, which is unrelated to reachability."}},
    {"prompt":"Which line extends how far you can reach?","correct":"reach = max(reach, i + nums[i])","choices":["reach = max(reach, i + nums[i])","reach = max(reach, nums[i])","reach = i + nums[i]"],"why":"From index i you can land as far as i + nums[i]; keep the best reach seen.","wrong":{"reach = max(reach, nums[i])":"nums[i] is a length, not an index — the landing index is i + nums[i].","reach = i + nums[i]":"Overwriting can shrink the reach; keep the maximum."}},
  ],
  'Unique Paths': [
    {"prompt":"Which line combines the paths from above and from the left?","correct":"row[c] = row[c] + row[c - 1]","choices":["row[c] = row[c] + row[c - 1]","row[c] = row[c] * row[c - 1]","row[c] = row[c - 1]"],"why":"Before it is overwritten, row[c] is the count from above and row[c-1] the count from the left; a cell is reached from either.","wrong":{"row[c] = row[c] * row[c - 1]":"Paths add, they do not multiply.","row[c] = row[c - 1]":"This ignores the paths coming from directly above."}},
    {"prompt":"Which line sets up one path to every cell of the first row?","correct":"row = [1] * n","choices":["row = [1] * n","row = [0] * n","row = [1] * m"],"why":"There is exactly one straight path along the first row, so every column starts at 1.","wrong":{"row = [0] * n":"Starting at 0 leaves no paths to build on.","row = [1] * m":"The row has one entry per column (n), not per row (m)."}},
  ],
  'Koko Eating Bananas': [
    {"prompt":"Which line counts the hours needed at speed mid?","correct":"hours = sum((p + mid - 1) // mid for p in piles)","choices":["hours = sum((p + mid - 1) // mid for p in piles)","hours = sum(p // mid for p in piles)","hours = sum(p / mid for p in piles)"],"why":"(p + mid - 1) // mid is integer ceiling — the leftover bananas still cost a whole hour.","wrong":{"hours = sum(p // mid for p in piles)":"Floor division drops the final partial hour, undercounting the time.","hours = sum(p / mid for p in piles)":"True division gives fractional hours, but each pile rounds up to whole hours."}},
    {"prompt":"On a fast-enough speed, which line keeps searching for a smaller one?","correct":"hi = mid","choices":["hi = mid","lo = mid","hi = mid - 1"],"why":"mid might itself be the minimum, so keep it in range by setting hi = mid (not below it).","wrong":{"lo = mid":"Raising lo searches for a larger speed — the wrong direction.","hi = mid - 1":"Dropping below mid can skip the true minimum when mid is the answer."}},
  ],
  'Combination Sum': [
    {"prompt":"Which line lets a candidate be reused within the same combination?","correct":"backtrack(i, remaining - candidates[i])","choices":["backtrack(i, remaining - candidates[i])","backtrack(i + 1, remaining - candidates[i])","backtrack(i, remaining)"],"why":"Recursing from i (not i + 1) allows candidates[i] to be chosen again; reducing remaining tracks the running sum.","wrong":{"backtrack(i + 1, remaining - candidates[i])":"Advancing to i + 1 forbids reuse, so combinations that repeat a number are missed.","backtrack(i, remaining)":"Not reducing remaining never makes progress toward 0 — it recurses forever."}},
    {"prompt":"Which line records a finished combination without aliasing it?","correct":"result.append(current[:])","choices":["result.append(current[:])","result.append(current)","current.append(result[:])"],"why":"current[:] copies the list, freezing this combination; appending current itself stores a reference the later append/pop mutate.","wrong":{"result.append(current)":"This stores a live reference, so every later append and pop rewrites the saved combination.","current.append(result[:])":"This mutates current with a copy of result — backwards, and it records nothing."}},
  ],
  'Two Sum': [
    {"prompt":"Which line detects that the complement was already seen?","correct":"if need in seen:","choices":["if need in seen:","if nums[i] in seen:","if need not in seen:"],"why":"A stored complement means the pair is complete, so its index and the current index are the answer.","wrong":{"if nums[i] in seen:":"That checks the current value, not the value that completes the pair.","if need not in seen:":"The inverted test returns before a real match is ever found."}},
    {"prompt":"Which line remembers the current value for a future match?","correct":"seen[nums[i]] = i","choices":["seen[nums[i]] = i","seen[i] = nums[i]","seen[need] = i"],"why":"Map value → index so a later element can look this value up as its complement.","wrong":{"seen[i] = nums[i]":"This maps index → value, but lookups are by value.","seen[need] = i":"Storing the complement instead of the value corrupts later lookups."}},
  ],
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
  'Subsets': [
    { prompt: 'Which line records the current subset so later changes cannot corrupt it?', correct: 'result.append(current[:])', choices: ['result.append(current[:])', 'result.append(current)', 'current.append(result[:])'], why: 'current[:] copies the list, freezing this subset; appending current itself stores a reference the later append/pop mutate.', wrong: { 'result.append(current)': 'This stores a live reference, so every later append and pop rewrites the saved subset.', 'current.append(result[:])': 'This mutates current with a copy of result — backwards, and it never records an answer.' } },
    { prompt: 'Which line recurses so each element is used at most once?', correct: 'backtrack(i + 1)', choices: ['backtrack(i + 1)', 'backtrack(i)', 'backtrack(start + 1)'], why: 'Starting the next call at i + 1 considers only later elements, so no element repeats and no subset is duplicated.', wrong: { 'backtrack(i)': 'Passing i lets the same element be chosen again, producing duplicates and infinite recursion.', 'backtrack(start + 1)': 'start does not advance with the loop, so it skips and repeats the wrong elements.' } },
  ],
  'Maximum Subarray': [
    { prompt: 'Which line makes the extend-or-restart choice at each element?', correct: 'current = max(nums[i], current + nums[i])', choices: ['current = max(nums[i], current + nums[i])', 'current = max(best, current + nums[i])', 'current = current + nums[i]'], why: 'The best subarray ending here is either this element alone (a restart) or the previous run extended by it.', wrong: { 'current = max(best, current + nums[i])': 'best is the global answer, not the restart option — compare against nums[i] alone.', 'current = current + nums[i]': 'Always extending never lets a negative running sum reset.' } },
    { prompt: 'Which line records the best subarray sum seen so far?', correct: 'best = max(best, current)', choices: ['best = max(best, current)', 'best = max(best, nums[i])', 'best = current'], why: 'best keeps the largest current value reached across the whole scan.', wrong: { 'best = max(best, nums[i])': 'That compares against a single element, not the running subarray sum.', 'best = current': 'Overwriting drops earlier peaks when current later shrinks.' } },
  ],
  'Merge Intervals': [
    { prompt: 'On an overlap, which line extends the kept interval correctly?', correct: 'merged[-1][1] = max(merged[-1][1], end)', choices: ['merged[-1][1] = max(merged[-1][1], end)', 'merged[-1][1] = end', 'merged[-1][1] = min(merged[-1][1], end)'], why: 'The merged interval must cover both, so its end is the larger of the two ends.', wrong: { 'merged[-1][1] = end': 'The current interval can end earlier (e.g. [1,6] then [2,3]), which would shrink the range.', 'merged[-1][1] = min(merged[-1][1], end)': 'Taking the min shrinks the interval instead of covering both.' } },
    { prompt: 'Which line detects that the current interval overlaps the last kept one?', correct: 'if merged and start <= merged[-1][1]:', choices: ['if merged and start <= merged[-1][1]:', 'if merged and start < merged[-1][1]:', 'if merged and start <= merged[-1][0]:'], why: 'Sorted by start, an overlap means the current start reaches the last end; touching endpoints count, so use ≤.', wrong: { 'if merged and start < merged[-1][1]:': 'A strict < fails to merge touching intervals like [1,4] and [4,5].', 'if merged and start <= merged[-1][0]:': 'Comparing against the start, not the end, is the wrong boundary.' } },
  ],
  'Implement Trie (Prefix Tree)': [
    { prompt: 'After inserting every character, which line marks a complete word?', correct: 'node.is_end = True', choices: ['node.is_end = True', 'node.is_end = False', 'self.root.is_end = True'], why: 'Only the node reached after the last character represents the end of that word.', wrong: { 'node.is_end = False': 'That leaves the word unmarked, so search would never find it.', 'self.root.is_end = True': 'Marking the root claims the empty string is a word, not this one.' } },
    { prompt: 'During lookup, which line reports that the path is missing?', correct: 'return None', choices: ['return None', 'continue', 'return node'], why: 'A missing character means the string was never inserted, so stop and report absence.', wrong: { 'continue': 'Skipping the character keeps walking as if it matched, giving false positives.', 'return node': 'Returning the current node claims a match on a path that does not exist.' } },
  ],
  'Network Delay Time': [
    { prompt: 'Which line relaxes an edge — improving a neighbor’s arrival time?', correct: 'if dist[u] + w < dist[v]:', choices: ['if dist[u] + w < dist[v]:', 'if dist[u] + w > dist[v]:', 'if dist[u] + w == dist[v]:'], why: 'Only lower the neighbor’s time when the route through u is shorter than its current best.', wrong: { 'if dist[u] + w > dist[v]:': 'That would overwrite a shorter path with a longer one.', 'if dist[u] + w == dist[v]:': 'Equal distance is no improvement, so nothing should change.' } },
    { prompt: 'Which line picks the next node to finalize?', correct: 'if i not in visited and (u == -1 or dist[i] < dist[u]):', choices: ['if i not in visited and (u == -1 or dist[i] < dist[u]):', 'if i not in visited and (u == -1 or dist[i] > dist[u]):', 'if i not in visited:'], why: 'Dijkstra always finalizes the unvisited node with the smallest tentative distance.', wrong: { 'if i not in visited and (u == -1 or dist[i] > dist[u]):': 'Choosing the largest breaks the greedy invariant and gives wrong distances.', 'if i not in visited:': 'Taking any unvisited node ignores distance, so finalized values are not minimal.' } },
  ],
};

for (const [title, specs] of Object.entries(walkthroughPythonExercises)) {
  specs.forEach((spec, index) => {
    pythonExercises[`${title}:${index}`] = pyEx(title, spec);
  });
}
