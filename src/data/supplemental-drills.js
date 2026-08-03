import { supplementalFullCode } from './supplemental-solutions.js';
import { blankLine, genericWrong } from './blank-line.js';

// Additional standalone drills (whole-line selection). The shown code is the real reference
// solution with exactly one line blanked; the learner picks the complete correct line. The
// blanked line is derived from the solution itself, so it is never shown elsewhere and there
// is nothing to reverse-engineer. Each prompt is original instructional copy; the source link
// in the UI points learners to the corresponding LeetCode task.

// spec = { prompt, correct, choices, why }
function exercise(fullCode, spec) {
  return {
    prompt: spec.prompt,
    code: blankLine(fullCode, spec.correct),
    choices: spec.choices,
    correct: spec.correct,
    why: spec.why,
    wrong: spec.wrong || genericWrong(spec.choices, spec.correct),
  };
}

function drill(title, topic, difficulty, context, jsSpec, pySpec) {
  const full = supplementalFullCode[title];
  return {
    title,
    topic,
    difficulty,
    context,
    exercise: exercise(full.JavaScript, jsSpec),
    pythonExercise: exercise(full.Python, pySpec),
  };
}

const d = drill;

export const supplementalCodeDrills = [
  d('Valid Palindrome', 'Two Pointers', 'Easy', 's is the original string. left and right move inward only across alphanumeric characters; comparisons are case-insensitive.',
    { prompt: 'Which line rejects the string when a mirrored pair does not match?', correct: 'if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;', choices: ['if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;', 'if (s[left].toLowerCase() === s[right].toLowerCase()) return false;', 'if (s[left] !== s[right]) return false;'], why: 'A single mismatched alphanumeric pair, compared case-insensitively, disproves the palindrome.' },
    { prompt: 'Which line rejects the string when a mirrored pair does not match?', correct: 'if s[left].lower() != s[right].lower():', choices: ['if s[left].lower() != s[right].lower():', 'if s[left].lower() == s[right].lower():', 'if s[left] != s[right]:'], why: 'A single mismatched alphanumeric pair, compared case-insensitively, disproves the palindrome.' }),

  d('Best Time to Buy and Sell Stock', 'Sliding Window', 'Easy', 'minPrice is the cheapest price seen before today. price is today’s sell price, and best is the largest valid profit so far.',
    { prompt: 'Which line records the best profit from selling at today’s price?', correct: 'best = Math.max(best, price - minPrice);', choices: ['best = Math.max(best, price - minPrice);', 'best = Math.max(best, minPrice - price);', 'best = Math.max(best, price - best);'], why: 'Selling today after buying at the cheapest earlier price gives profit price − minPrice.' },
    { prompt: 'Which line records the best profit from selling at today’s price?', correct: 'best = max(best, price - min_price)', choices: ['best = max(best, price - min_price)', 'best = max(best, min_price - price)', 'best = max(best, price - best)'], why: 'Selling today after buying at the cheapest earlier price gives profit price − min_price.' }),

  d('Merge Two Sorted Lists', 'Linked List', 'Easy', 'list1 and list2 point to the first unmerged nodes. tail is the last node already attached to the merged result.',
    { prompt: 'Which line decides that list1’s node should be attached next?', correct: 'if (list1.val <= list2.val) {', choices: ['if (list1.val <= list2.val) {', 'if (list1.val >= list2.val) {', 'if (list1.val <= list2.next) {'], why: 'The smaller current value is attached first, so compare list1.val with list2.val.' },
    { prompt: 'Which line decides that list1’s node should be attached next?', correct: 'if list1.val <= list2.val:', choices: ['if list1.val <= list2.val:', 'if list1.val >= list2.val:', 'if list1.val <= list2.next:'], why: 'The smaller current value is attached first, so compare list1.val with list2.val.' }),

  d('Maximum Depth of Binary Tree', 'Trees', 'Easy', 'root is the current node. The depth of a node is one plus the deeper of its left and right subtrees.',
    { prompt: 'Which line returns this subtree’s depth from its children’s depths?', correct: 'return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));', choices: ['return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));', 'return 1 + Math.min(maxDepth(root.left), maxDepth(root.right));', 'return Math.max(maxDepth(root.left), maxDepth(root.right));'], why: 'A node’s depth is one more than the depth of its deeper child.' },
    { prompt: 'Which line returns this subtree’s depth from its children’s depths?', correct: 'return 1 + max(max_depth(root.left), max_depth(root.right))', choices: ['return 1 + max(max_depth(root.left), max_depth(root.right))', 'return 1 + min(max_depth(root.left), max_depth(root.right))', 'return max(max_depth(root.left), max_depth(root.right))'], why: 'A node’s depth is one more than the depth of its deeper child.' }),

  d('Balanced Binary Tree', 'Trees', 'Easy', 'leftHeight and rightHeight are subtree heights. A difference greater than one means the current node is unbalanced.',
    { prompt: 'Which line flags this subtree as unbalanced?', correct: 'if (Math.abs(leftHeight - rightHeight) > 1) return -1;', choices: ['if (Math.abs(leftHeight - rightHeight) > 1) return -1;', 'if (Math.abs(leftHeight - rightHeight) > 1) return 0;', 'if (leftHeight - rightHeight > 1) return -1;'], why: 'A height gap over one anywhere makes the tree unbalanced; the -1 sentinel signals it to every ancestor.' },
    { prompt: 'Which line flags this subtree as unbalanced?', correct: 'if abs(left_height - right_height) > 1:', choices: ['if abs(left_height - right_height) > 1:', 'if abs(left_height - right_height) >= 1:', 'if left_height - right_height > 1:'], why: 'A height gap over one anywhere makes the tree unbalanced; the -1 sentinel signals it to every ancestor.' }),

  d('Diameter of Binary Tree', 'Trees', 'Easy', 'left and right are the longest downward paths from this node. best stores the largest path through any node seen so far.',
    { prompt: 'Which line updates the best path that turns through this node?', correct: 'best = Math.max(best, left + right);', choices: ['best = Math.max(best, left + right);', 'best = Math.max(best, Math.max(left, right));', 'best = Math.max(best, left * right);'], why: 'A path through a node joins its two child paths, so their edge counts add.' },
    { prompt: 'Which line updates the best path that turns through this node?', correct: 'best = max(best, left + right)', choices: ['best = max(best, left + right)', 'best = max(best, max(left, right))', 'best = max(best, left * right)'], why: 'A path through a node joins its two child paths, so their edge counts add.' }),

  d('Climbing Stairs', '1-D Dynamic Programming', 'Easy', 'one and two are the number of ways to reach the two previous steps. The current step can be reached from either one.',
    { prompt: 'Which line combines the two previous step counts?', correct: 'const current = one + two;', choices: ['const current = one + two;', 'const current = one * two;', 'const current = Math.max(one, two);'], why: 'The two disjoint ways to arrive — a one-step or a two-step move — are added.' },
    { prompt: 'Which line combines the two previous step counts?', correct: 'current = one + two', choices: ['current = one + two', 'current = one * two', 'current = max(one, two)'], why: 'The two disjoint ways to arrive — a one-step or a two-step move — are added.' }),

  d('Min Cost Climbing Stairs', '1-D Dynamic Programming', 'Easy', 'one and two hold the cheapest total cost to reach the previous two positions. cost[i] is paid when stepping on i.',
    { prompt: 'Which line reaches stair i from the cheaper prior landing and pays for it?', correct: 'const current = Math.min(one, two) + cost[i];', choices: ['const current = Math.min(one, two) + cost[i];', 'const current = Math.max(one, two) + cost[i];', 'const current = Math.min(one, two) + i;'], why: 'Arrive from the cheaper of the two prior stairs, then add the cost of the stair entered.' },
    { prompt: 'Which line reaches stair i from the cheaper prior landing and pays for it?', correct: 'current = min(one, two) + cost[i]', choices: ['current = min(one, two) + cost[i]', 'current = max(one, two) + cost[i]', 'current = min(one, two) + i'], why: 'Arrive from the cheaper of the two prior stairs, then add the cost of the stair entered.' }),

  d('House Robber', '1-D Dynamic Programming', 'Easy', 'take is the best total if the current house is robbed; skip is the best total if it is skipped. Adjacent houses cannot both be taken.',
    { prompt: 'Robbing this house is legal only after skipping the previous one. Which line?', correct: 'take = skip + value;', choices: ['take = skip + value;', 'take = take + value;', 'take = skip + take;'], why: 'You may add this house’s value only to the total that skipped the previous house.' },
    { prompt: 'Robbing this house is legal only after skipping the previous one. Which line?', correct: 'take = skip + value', choices: ['take = skip + value', 'take = take + value', 'take = skip + take'], why: 'You may add this house’s value only to the total that skipped the previous house.' }),

  d('Missing Number', 'Bit Manipulation', 'Easy', 'missing starts at nums.length. Pairing every index with its value under XOR cancels every present number and leaves the absent one.',
    { prompt: 'Which line folds both the index and its value into the XOR accumulator?', correct: 'missing ^= i ^ nums[i];', choices: ['missing ^= i ^ nums[i];', 'missing ^= i;', 'missing ^= nums[i];'], why: 'XOR-ing every index with every value cancels all present numbers, leaving only the missing one.' },
    { prompt: 'Which line folds both the index and its value into the XOR accumulator?', correct: 'missing ^= i ^ nums[i]', choices: ['missing ^= i ^ nums[i]', 'missing ^= i', 'missing ^= nums[i]'], why: 'XOR-ing every index with every value cancels all present numbers, leaving only the missing one.' }),

  d('3Sum', 'Two Pointers', 'Medium', 'nums is sorted first. i fixes one value, while left and right search the remaining suffix for the complementary pair.',
    { prompt: 'Which line skips a repeated fixed value while keeping later distinct ones?', correct: 'if (i > 0 && nums[i] === nums[i - 1]) continue;', choices: ['if (i > 0 && nums[i] === nums[i - 1]) continue;', 'if (i > 0 && nums[i] === nums[i - 1]) break;', 'if (i > 0 && nums[i] === nums[i - 1]) return triplets;'], why: 'continue ignores just this duplicate i while later distinct fixed values still run.' },
    { prompt: 'Which line skips a repeated fixed value while keeping later distinct ones?', correct: 'continue', choices: ['continue', 'break', 'return triplets'], why: 'continue ignores just this duplicate i while later distinct fixed values still run.' }),

  d('Container With Most Water', 'Two Pointers', 'Medium', 'left and right are the walls being considered. The shorter wall limits the area, so only moving it can possibly improve that limit.',
    { prompt: 'The left wall is shorter. Which line discards it to look for a taller one?', correct: 'if (height[left] <= height[right]) left++;', choices: ['if (height[left] <= height[right]) left++;', 'if (height[left] <= height[right]) right--;', 'if (height[left] <= height[right]) left--;'], why: 'Keeping the shorter left wall cannot raise the limiting height as width shrinks, so move left in.' },
    { prompt: 'The left wall is shorter. Which line discards it to look for a taller one?', correct: 'if height[left] <= height[right]:', choices: ['if height[left] <= height[right]:', 'if height[left] >= height[right]:', 'if height[left] <= height[left]:'], why: 'Keeping the shorter left wall cannot raise the limiting height as width shrinks, so move left in.' }),

  d('Product of Array Except Self', 'Arrays & Hashing', 'Medium', 'answer[i] already holds the product to the left of i. postfix is the product of values strictly to the right of i.',
    { prompt: 'The second pass multiplies each saved prefix by the running suffix. Which line?', correct: 'answer[i] *= postfix;', choices: ['answer[i] *= postfix;', 'answer[i] *= nums[i];', 'answer[i] *= prefix;'], why: 'postfix supplies exactly the right-side values the prefix pass left out.' },
    { prompt: 'The second pass multiplies each saved prefix by the running suffix. Which line?', correct: 'answer[i] *= postfix', choices: ['answer[i] *= postfix', 'answer[i] *= nums[i]', 'answer[i] *= prefix'], why: 'postfix supplies exactly the right-side values the prefix pass left out.' }),

  d('Group Anagrams', 'Arrays & Hashing', 'Medium', 'word is one input string. key is a canonical signature; all anagrams must produce the same key before being grouped.',
    { prompt: 'Which line turns a word into one stable key shared by all its anagrams?', correct: "const key = [...word].sort().join('');", choices: ["const key = [...word].sort().join('');", 'const key = [...word].sort();', "const key = word.join('');"], why: 'Sorting the letters and joining them yields the same string for every anagram.' },
    { prompt: 'Which line turns a word into one stable key shared by all its anagrams?', correct: "key = ''.join(sorted(word))", choices: ["key = ''.join(sorted(word))", 'key = sorted(word)', "key = ''.join(word)"], why: 'Sorting the letters and joining them yields the same string for every anagram.' }),

  d('Top K Frequent Elements', 'Arrays & Hashing', 'Medium', 'counts maps each number to its frequency. buckets[count] holds every number with exactly that frequency.',
    { prompt: 'Which line files each number into the bucket for its frequency?', correct: 'for (const [num, count] of counts) buckets[count].push(num);', choices: ['for (const [num, count] of counts) buckets[count].push(num);', 'for (const [num, count] of counts) buckets[num].push(count);', 'for (const [num, count] of counts) buckets[num].push(num);'], why: 'The bucket index is the frequency (count); the value stored is the number.' },
    { prompt: 'Which line files each number into the bucket for its frequency?', correct: 'buckets[count].append(num)', choices: ['buckets[count].append(num)', 'buckets[num].append(count)', 'buckets[num].append(num)'], why: 'The bucket index is the frequency (count); the value stored is the number.' }),

  d('Kth Largest Element in an Array', 'Heap / Priority Queue', 'Medium', 'target is the zero-based index of the kth largest value after partitioning. pivotIndex is where the chosen pivot finishes.',
    { prompt: 'Which line stops Quickselect once the pivot lands at the requested rank?', correct: 'if (pivotIndex === target) return nums[pivotIndex];', choices: ['if (pivotIndex === target) return nums[pivotIndex];', 'if (pivotIndex === k) return nums[pivotIndex];', 'if (pivotIndex === left) return nums[pivotIndex];'], why: 'target = n − k is the ascending index of the kth-largest value.' },
    { prompt: 'Which line stops Quickselect once the pivot lands at the requested rank?', correct: 'if pivot_index == target:', choices: ['if pivot_index == target:', 'if pivot_index == k:', 'if pivot_index == left:'], why: 'target = n − k is the ascending index of the kth-largest value.' }),

  d('Search in Rotated Sorted Array', 'Binary Search', 'Medium', 'left, mid, and right are indexes in a rotated sorted array. At least one half around mid is still sorted.',
    { prompt: 'Which line detects that the left half is the normally sorted half?', correct: 'if (nums[left] <= nums[mid]) {', choices: ['if (nums[left] <= nums[mid]) {', 'if (nums[left] <= nums[right]) {', 'if (nums[mid] <= target) {'], why: 'When nums[left] ≤ nums[mid], values rise normally across the left half.' },
    { prompt: 'Which line detects that the left half is the normally sorted half?', correct: 'if nums[left] <= nums[mid]:', choices: ['if nums[left] <= nums[mid]:', 'if nums[left] <= nums[right]:', 'if nums[mid] <= target:'], why: 'When nums[left] ≤ nums[mid], values rise normally across the left half.' }),

  d('Find Minimum in Rotated Sorted Array', 'Binary Search', 'Medium', 'right is a possible minimum. If nums[mid] is larger than nums[right], the rotation point must lie strictly to mid’s right.',
    { prompt: 'mid is in the larger left run. Which line discards it and everything before it?', correct: 'if (nums[mid] > nums[right]) left = mid + 1;', choices: ['if (nums[mid] > nums[right]) left = mid + 1;', 'if (nums[mid] > nums[right]) left = mid - 1;', 'if (nums[mid] < nums[right]) left = mid + 1;'], why: 'If nums[mid] > nums[right], the minimum is strictly right of mid, so search after it.' },
    { prompt: 'mid is in the larger left run. Which line discards it and everything before it?', correct: 'if nums[mid] > nums[right]:', choices: ['if nums[mid] > nums[right]:', 'if nums[mid] < nums[right]:', 'if nums[mid] > nums[left]:'], why: 'If nums[mid] > nums[right], the minimum is strictly right of mid, so search after it.' }),

  d('Min Stack', 'Stack', 'Medium', 'stack stores values. minStack stores the minimum value at the matching stack depth, so the current minimum is always on top.',
    { prompt: 'On push, which line keeps the running minimum correct at the new depth?', correct: 'minStack.push(Math.min(val, minStack.at(-1)));', choices: ['minStack.push(Math.min(val, minStack.at(-1)));', 'minStack.push(Math.min(val, stack.at(-1)));', 'minStack.push(val);'], why: 'Compare the new value with the previous minimum, which sits on top of minStack.' },
    { prompt: 'On push, which line keeps the running minimum correct at the new depth?', correct: 'min_stack.append(min(val, min_stack[-1]))', choices: ['min_stack.append(min(val, min_stack[-1]))', 'min_stack.append(min(val, self.stack[-1]))', 'min_stack.append(val)'], why: 'Compare the new value with the previous minimum, which sits on top of min_stack.' }),

  d('Daily Temperatures', 'Stack', 'Medium', 'stack holds indexes whose next warmer day is unknown. i is today’s index, and prev is an earlier, cooler day just popped from the stack.',
    { prompt: 'Which line records how long the earlier day waited for a warmer one?', correct: 'result[prev] = i - prev;', choices: ['result[prev] = i - prev;', 'result[prev] = prev - i;', 'result[prev] = i + prev;'], why: 'Today (i) is the first warmer day after prev, so the wait is i − prev.' },
    { prompt: 'Which line records how long the earlier day waited for a warmer one?', correct: 'result[prev] = i - prev', choices: ['result[prev] = i - prev', 'result[prev] = prev - i', 'result[prev] = i + prev'], why: 'Today (i) is the first warmer day after prev, so the wait is i − prev.' }),

  d('Course Schedule', 'Graphs', 'Medium', 'indegree[course] counts prerequisites not yet completed. nextCourse is unlocked only after every incoming prerequisite edge is removed.',
    { prompt: 'Finishing one prerequisite removes one incoming edge. Which line?', correct: 'indegree[nextCourse] -= 1;', choices: ['indegree[nextCourse] -= 1;', 'indegree[nextCourse] += 1;', 'indegree[nextCourse] = 0;'], why: 'Each satisfied prerequisite lowers the dependent course’s remaining count by exactly one.' },
    { prompt: 'Finishing one prerequisite removes one incoming edge. Which line?', correct: 'indegree[next_course] -= 1', choices: ['indegree[next_course] -= 1', 'indegree[next_course] += 1', 'indegree[next_course] = 0'], why: 'Each satisfied prerequisite lowers the dependent course’s remaining count by exactly one.' }),

  d('Clone Graph', 'Graphs', 'Medium', 'clones maps each original node to its copied node. copy is the new node that will receive cloned neighbors.',
    { prompt: 'Which line records the clone before exploring neighbors, so a cycle reuses it?', correct: 'clones.set(node, copy);', choices: ['clones.set(node, copy);', 'clones.set(node, node);', 'clones.set(copy, node);'], why: 'Mapping the original to its new copy first stops a cyclic path from cloning it again.' },
    { prompt: 'Which line records the clone before exploring neighbors, so a cycle reuses it?', correct: 'clones[node] = copy', choices: ['clones[node] = copy', 'clones[node] = node', 'clones[copy] = node'], why: 'Mapping the original to its new copy first stops a cyclic path from cloning it again.' }),

  d('Validate Binary Search Tree', 'Trees', 'Medium', 'low and high are exclusive bounds inherited from ancestors. node.val must fit between both, not just its direct parent.',
    { prompt: 'Which line rejects a node that violates the inherited bounds?', correct: 'if (node.val <= low || node.val >= high) return false;', choices: ['if (node.val <= low || node.val >= high) return false;', 'if (node.val < low || node.val > high) return false;', 'if (node.val <= node.left || node.val >= node.right) return false;'], why: 'Every node must lie strictly between the low and high bounds carried down from ancestors.' },
    { prompt: 'Which line rejects a node that violates the inherited bounds?', correct: 'if node.val <= low or node.val >= high:', choices: ['if node.val <= low or node.val >= high:', 'if node.val < low or node.val > high:', 'if node.val <= node.left or node.val >= node.right:'], why: 'Every node must lie strictly between the low and high bounds carried down from ancestors.' }),

  d('Coin Change', '1-D Dynamic Programming', 'Medium', 'dp[amount] is the fewest coins needed for that exact amount. coin is one denomination that can be placed last.',
    { prompt: 'Which line uses one more coin on an already-solved smaller amount?', correct: 'if (coin <= amount) dp[amount] = Math.min(dp[amount], dp[amount - coin] + 1);', choices: ['if (coin <= amount) dp[amount] = Math.min(dp[amount], dp[amount - coin] + 1);', 'if (coin <= amount) dp[amount] = Math.min(dp[amount], dp[amount - coin] + coin);', 'if (coin <= amount) dp[amount] = Math.min(dp[amount], dp[coin] + 1);'], why: 'Adding one chosen coin to the best for amount − coin increases the coin count by exactly one.' },
    { prompt: 'Which line uses one more coin on an already-solved smaller amount?', correct: 'dp[amount] = min(dp[amount], dp[amount - coin] + 1)', choices: ['dp[amount] = min(dp[amount], dp[amount - coin] + 1)', 'dp[amount] = min(dp[amount], dp[amount - coin] + coin)', 'dp[amount] = min(dp[amount], dp[coin] + 1)'], why: 'Adding one chosen coin to the best for amount − coin increases the coin count by exactly one.' }),

  d('Median of Two Sorted Arrays', 'Binary Search', 'Hard', 'aLeft/aRight border the chosen partition of the first array; bLeft/bRight border the other. A valid partition has every left value no larger than every right value.',
    { prompt: 'At a valid partition, which line takes the lower median from the left halves?', correct: 'const leftMax = Math.max(aLeft, bLeft);', choices: ['const leftMax = Math.max(aLeft, bLeft);', 'const leftMax = Math.min(aRight, bRight);', 'const leftMax = aLeft + bLeft;'], why: 'The combined left half ends at the larger of its two boundary values.' },
    { prompt: 'At a valid partition, which line takes the lower median from the left halves?', correct: 'left_max = max(a_left, b_left)', choices: ['left_max = max(a_left, b_left)', 'left_max = min(a_right, b_right)', 'left_max = a_left + b_left'], why: 'The combined left half ends at the larger of its two boundary values.' }),

  d('Minimum Window Substring', 'Sliding Window', 'Hard', 'formed counts how many required character types currently meet their needed frequency. required is the number of distinct types in t.',
    { prompt: 'Which line lets the window shrink only while it is still fully valid?', correct: 'while (formed === required) {', choices: ['while (formed === required) {', 'while (formed < required) {', 'while (left < right) {'], why: 'A window may shrink only while every required character count is still satisfied.' },
    { prompt: 'Which line lets the window shrink only while it is still fully valid?', correct: 'while formed == required:', choices: ['while formed == required:', 'while formed < required:', 'while left < right:'], why: 'A window may shrink only while every required character count is still satisfied.' }),

  d('Sliding Window Maximum', 'Sliding Window', 'Hard', 'deque holds candidate indexes in decreasing value order. Its front must always be the largest value still inside the current window.',
    { prompt: 'Which line drops a front index that has slid out of the window?', correct: 'if (deque[0] < left) deque.shift();', choices: ['if (deque[0] < left) deque.shift();', 'if (deque[0] < left) deque.pop();', 'if (deque[0] < left) deque.push(left);'], why: 'The expired index is at the front, so remove it from the front.' },
    { prompt: 'Which line drops a front index that has slid out of the window?', correct: 'deque.popleft()', choices: ['deque.popleft()', 'deque.pop()', 'deque.append(left)'], why: 'The expired index is at the front, so remove it from the front.' }),

  d('Serialize and Deserialize Binary Tree', 'Trees', 'Hard', 'node is the current tree node. The serializer must record an explicit marker for a missing child so the tree shape can be rebuilt.',
    { prompt: 'Which line emits a marker for a missing child instead of recursing?', correct: "if (!node) return '#';", choices: ["if (!node) return '#';", "if (!node) return '';", 'if (!node) return node.val;'], why: 'The marker preserves the empty child’s position in the preorder stream.' },
    { prompt: 'Which line emits a marker for a missing child instead of recursing?', correct: "return '#'", choices: ["return '#'", "return ''", 'return node.val'], why: 'The marker preserves the empty child’s position in the preorder stream.' }),

  d('Binary Tree Maximum Path Sum', 'Trees', 'Hard', 'left and right are nonnegative gains returned by the child subtrees. best tracks the strongest path that may turn through the current node.',
    { prompt: 'Which line updates the answer with a path turning through this node?', correct: 'best = Math.max(best, node.val + left + right);', choices: ['best = Math.max(best, node.val + left + right);', 'best = Math.max(best, Math.max(left, right));', 'best = Math.max(best, left + right);'], why: 'A turning path uses this node plus one nonnegative gain from each side.' },
    { prompt: 'Which line updates the answer with a path turning through this node?', correct: 'best = max(best, node.val + left + right)', choices: ['best = max(best, node.val + left + right)', 'best = max(best, max(left, right))', 'best = max(best, left + right)'], why: 'A turning path uses this node plus one nonnegative gain from each side.' }),

  d('Word Search II', 'Backtracking', 'Hard', 'node is the current trie node after following the board path. node.word is set only when that path completes one requested word.',
    { prompt: 'Which line records a completed word found along this path?', correct: 'if (node.word) result.push(node.word);', choices: ['if (node.word) result.push(node.word);', 'if (node.word) result.push(node.children);', 'if (node.word) result.push(board[r][c]);'], why: 'The trie stores the finished word at its terminal node.' },
    { prompt: 'Which line records a completed word found along this path?', correct: 'result.append(node.word)', choices: ['result.append(node.word)', 'result.append(node.children)', 'result.append(board[r][c])'], why: 'The trie stores the finished word at its terminal node.' }),

  d('Merge K Sorted Lists', 'Heap / Priority Queue', 'Hard', 'heap always exposes the smallest current node among k lists. node is the one just removed and appended to the answer.',
    { prompt: 'After using a node, which line offers its successor as the next candidate?', correct: 'if (node.next) heap.push(node.next);', choices: ['if (node.next) heap.push(node.next);', 'if (node.next) heap.push(node.val);', 'if (node.next) heap.push(tail);'], why: 'Only the successor can be that list’s next smallest node.' },
    { prompt: 'After using a node, which line offers its successor as the next candidate?', correct: 'heappush(heap, (node.next.val, index, node.next))', choices: ['heappush(heap, (node.next.val, index, node.next))', 'heappush(heap, (node.val, index, node))', 'heappush(heap, node.next)'], why: 'The heap needs a comparable value and list index alongside the successor node.' }),

  d('Reverse Nodes in K-Group', 'Linked List', 'Hard', 'groupPrev points before the k-node block. prev becomes the reversed head of that block after its nodes are rewired.',
    { prompt: 'Which line links the preceding part to the reversed block’s new front?', correct: 'groupPrev.next = prev;', choices: ['groupPrev.next = prev;', 'groupPrev.next = groupNext;', 'groupPrev.next = current;'], why: 'After the reversal loop, prev is the block’s new first node.' },
    { prompt: 'Which line links the preceding part to the reversed block’s new front?', correct: 'group_prev.next = prev', choices: ['group_prev.next = prev', 'group_prev.next = group_next', 'group_prev.next = current'], why: 'After the reversal loop, prev is the block’s new first node.' }),

  d('N-Queens', 'Backtracking', 'Hard', 'cols, diag1, and diag2 record attacked columns and diagonals from queens already placed in earlier rows.',
    { prompt: 'Which line skips a square attacked by an earlier queen?', correct: 'if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;', choices: ['if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;', 'if (cols.has(col) || diag1.has(row - col) || diag2.has(row - col)) continue;', 'if (cols.has(col) || diag1.has(row + col) || diag2.has(row + col)) continue;'], why: 'A square is attacked if its column, its row − col diagonal, or its row + col diagonal is taken.' },
    { prompt: 'Which line skips a square attacked by an earlier queen?', correct: 'if col in cols or row - col in diag1 or row + col in diag2:', choices: ['if col in cols or row - col in diag1 or row + col in diag2:', 'if col in cols or row - col in diag1 or row - col in diag2:', 'if col in cols or row + col in diag1 or row + col in diag2:'], why: 'A square is attacked if its column, its row − col diagonal, or its row + col diagonal is taken.' }),

  d('Regular Expression Matching', '2-D Dynamic Programming', 'Hard', 'dp[i][j] says whether the first i input characters match the first j pattern characters. A star can represent zero copies of its preceding token.',
    { prompt: 'For a starred token, which line covers zero copies plus one-more-copy?', correct: 'dp[i][j] = dp[i][j - 2] || (matches && dp[i - 1][j]);', choices: ['dp[i][j] = dp[i][j - 2] || (matches && dp[i - 1][j]);', 'dp[i][j] = dp[i][j - 1] || (matches && dp[i - 1][j]);', 'dp[i][j] = dp[i - 1][j - 2] || (matches && dp[i - 1][j]);'], why: 'j − 2 skips the token and its star (zero copies); matches && dp[i − 1][j] consumes one more copy.' },
    { prompt: 'For a starred token, which line covers zero copies plus one-more-copy?', correct: 'dp[i][j] = dp[i][j - 2] or (matches and dp[i - 1][j])', choices: ['dp[i][j] = dp[i][j - 2] or (matches and dp[i - 1][j])', 'dp[i][j] = dp[i][j - 1] or (matches and dp[i - 1][j])', 'dp[i][j] = dp[i - 1][j - 2] or (matches and dp[i - 1][j])'], why: 'j − 2 skips the token and its star (zero copies); matches and dp[i − 1][j] consumes one more copy.' }),

  d('Edit Distance', '2-D Dynamic Programming', 'Hard', 'dp[i][j] is the fewest edits to turn the first i letters of word1 into the first j letters of word2.',
    { prompt: 'When the last letters differ, which line pays one edit plus the cheapest option?', correct: 'else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);', choices: ['else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);', 'else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i][j]);', 'else dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);'], why: 'Delete, insert, or replace: one edit plus the cheapest of the three smaller subproblems.' },
    { prompt: 'When the last letters differ, which line pays one edit plus the cheapest option?', correct: 'dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])', choices: ['dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])', 'dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i][j])', 'dp[i][j] = min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])'], why: 'Delete, insert, or replace: one edit plus the cheapest of the three smaller subproblems.' }),

  d('Distinct Subsequences', '2-D Dynamic Programming', 'Hard', 'dp[j] counts ways to form the first j target letters. Scanning j backward prevents one source character from being reused twice.',
    { prompt: 'On a match, which line extends every way that formed the shorter target?', correct: 'if (sourceChar === t[j - 1]) dp[j] += dp[j - 1];', choices: ['if (sourceChar === t[j - 1]) dp[j] += dp[j - 1];', 'if (sourceChar === t[j - 1]) dp[j] += dp[j + 1];', 'if (sourceChar === t[j - 1]) dp[j] += 1;'], why: 'Each way to form the first j − 1 target letters can append this matching source letter.' },
    { prompt: 'On a match, which line extends every way that formed the shorter target?', correct: 'dp[j] += dp[j - 1]', choices: ['dp[j] += dp[j - 1]', 'dp[j] += dp[j + 1]', 'dp[j] += 1'], why: 'Each way to form the first j − 1 target letters can append this matching source letter.' }),

  d('Interleaving String', '2-D Dynamic Programming', 'Hard', 'i and j are how many letters were consumed from s1 and s2. k equals i + j, the next index in s3.',
    { prompt: 'If s1 supplies the next matching letter, which line advances only s1?', correct: 'if (i < s1.length && s1[i] === s3[k] && dfs(i + 1, j)) return true;', choices: ['if (i < s1.length && s1[i] === s3[k] && dfs(i + 1, j)) return true;', 'if (i < s1.length && s1[i] === s3[k] && dfs(i, j + 1)) return true;', 'if (i < s1.length && s1[i] === s3[k] && dfs(k + 1, j)) return true;'], why: 'Taking from s1 consumes one more of s1 while s2 stays at j.' },
    { prompt: 'If s1 supplies the next matching letter, which line advances only s1?', correct: 'if i < len(s1) and s1[i] == s3[k] and dfs(i + 1, j):', choices: ['if i < len(s1) and s1[i] == s3[k] and dfs(i + 1, j):', 'if i < len(s1) and s1[i] == s3[k] and dfs(i, j + 1):', 'if i < len(s1) and s1[i] == s3[k] and dfs(k + 1, j):'], why: 'Taking from s1 consumes one more of s1 while s2 stays at j.' }),

  d('Burst Balloons', '2-D Dynamic Programming', 'Hard', 'left and right are fixed boundary balloons of an interval. mid is the balloon chosen to burst last inside that interval.',
    { prompt: 'mid bursts last in this interval. Which line scores it with its fixed neighbors?', correct: 'dp[left][right] = Math.max(dp[left][right], coins[left] * coins[mid] * coins[right] + dp[left][mid] + dp[mid][right]);', choices: ['dp[left][right] = Math.max(dp[left][right], coins[left] * coins[mid] * coins[right] + dp[left][mid] + dp[mid][right]);', 'dp[left][right] = Math.max(dp[left][right], coins[left] * coins[left] * coins[right] + dp[left][mid] + dp[mid][right]);', 'dp[left][right] = Math.max(dp[left][right], coins[mid] * coins[mid] * coins[right] + dp[left][mid] + dp[mid][right]);'], why: 'The last burst earns coins[left] * coins[mid] * coins[right] — its two fixed boundaries times itself.' },
    { prompt: 'mid bursts last in this interval. Which line scores it with its fixed neighbors?', correct: 'dp[left][right] = max(dp[left][right], coins[left] * coins[mid] * coins[right] + dp[left][mid] + dp[mid][right])', choices: ['dp[left][right] = max(dp[left][right], coins[left] * coins[mid] * coins[right] + dp[left][mid] + dp[mid][right])', 'dp[left][right] = max(dp[left][right], coins[left] * coins[left] * coins[right] + dp[left][mid] + dp[mid][right])', 'dp[left][right] = max(dp[left][right], coins[mid] * coins[mid] * coins[right] + dp[left][mid] + dp[mid][right])'], why: 'The last burst earns coins[left] * coins[mid] * coins[right] — its two fixed boundaries times itself.' }),

  d('Maximum Profit in Job Scheduling', '1-D Dynamic Programming', 'Hard', 'dp[i] is the best profit using jobs through i. prev is the latest non-overlapping job before job i.',
    { prompt: 'Taking job i adds its profit to the best compatible earlier schedule. Which line?', correct: 'dp[i] = Math.max(dp[i - 1] || 0, jobs[i][2] + (dp[prev] || 0));', choices: ['dp[i] = Math.max(dp[i - 1] || 0, jobs[i][2] + (dp[prev] || 0));', 'dp[i] = Math.max(dp[i - 1] || 0, jobs[i][2] + (dp[i - 1] || 0));', 'dp[i] = Math.max(dp[i - 1] || 0, jobs[i][2]);'], why: 'prev is the latest non-overlapping job, so dp[prev] is the best profit legally combinable with job i.' },
    { prompt: 'Taking job i adds its profit to the best compatible earlier schedule. Which line?', correct: 'dp[i] = max(dp[i - 1] if i else 0, earned + (dp[prev] if prev >= 0 else 0))', choices: ['dp[i] = max(dp[i - 1] if i else 0, earned + (dp[prev] if prev >= 0 else 0))', 'dp[i] = max(dp[i - 1] if i else 0, earned + (dp[i - 1] if i else 0))', 'dp[i] = max(dp[i - 1] if i else 0, earned)'], why: 'prev is the latest non-overlapping job, so dp[prev] is the best profit legally combinable with job i.' }),

  d('Longest Increasing Path in a Matrix', 'Graphs', 'Hard', 'dfs(r, c) returns the longest increasing path starting at one cell. nextR and nextC are a strictly larger neighboring cell.',
    { prompt: 'Which line extends the path into a strictly larger neighbor?', correct: 'if (matrix[nextR]?.[nextC] > matrix[r][c]) best = Math.max(best, 1 + dfs(nextR, nextC));', choices: ['if (matrix[nextR]?.[nextC] > matrix[r][c]) best = Math.max(best, 1 + dfs(nextR, nextC));', 'if (matrix[nextR]?.[nextC] > matrix[r][c]) best = Math.max(best, dfs(nextR, nextC));', 'if (matrix[nextR]?.[nextC] > matrix[r][c]) best = Math.max(best, 1 + dfs(r, c));'], why: 'One step plus the best path continuing from that strictly larger neighbor.' },
    { prompt: 'Which line extends the path into a strictly larger neighbor?', correct: 'best = max(best, 1 + dfs(next_r, next_c))', choices: ['best = max(best, 1 + dfs(next_r, next_c))', 'best = max(best, dfs(next_r, next_c))', 'best = max(best, 1 + dfs(r, c))'], why: 'One step plus the best path continuing from that strictly larger neighbor.' }),

  d('Alien Dictionary', 'Graphs', 'Hard', 'first and second are the first different letters in two adjacent words. graph records the precedence edge that must hold in the alien alphabet.',
    { prompt: 'The first differing letters set an order. Which line records it?', correct: 'graph.get(first).add(second);', choices: ['graph.get(first).add(second);', 'graph.get(second).add(first);', 'graph.get(first).add(first);'], why: 'The mismatch means first must precede second — a directed edge first → second.' },
    { prompt: 'The first differing letters set an order. Which line records it?', correct: 'graph[first].add(second)', choices: ['graph[first].add(second)', 'graph[second].add(first)', 'graph[first].add(first)'], why: 'The mismatch means first must precede second — a directed edge first → second.' }),

  d('Reconstruct Itinerary', 'Graphs', 'Hard', 'airport is the current airport. route is built after exhausting outgoing edges so it is produced in reverse Eulerian order.',
    { prompt: 'Which line appends an airport only after all its flights are used?', correct: 'route.push(airport);', choices: ['route.push(airport);', 'route.push(graph.get(airport));', 'route.unshift(airport);'], why: 'Postorder append (then reverse) places an airport after every flight that must follow it.' },
    { prompt: 'Which line appends an airport only after all its flights are used?', correct: 'route.append(airport)', choices: ['route.append(airport)', 'route.append(graph[airport])', 'route.insert(0, airport)'], why: 'Postorder append (then reverse) places an airport after every flight that must follow it.' }),
];
