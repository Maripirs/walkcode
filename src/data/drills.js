// Code-drill and code-fix content.
//
// Drill shape (whole-line selection): `code` is the full short solution with exactly one line
// replaced by `___`; `choices` are complete candidate lines (one equals `correct`); `wrong`
// gives per-line feedback that explains the flaw without naming the correct line. Nothing is
// masked, so there is nothing to reverse-engineer.
export const drillContext = {
  "Contains Duplicate": "nums is the input array. n is the current number as we scan left to right, and seen is a Set containing only numbers from earlier positions.",
  "Two Sum II": "numbers is sorted in ascending order. left and right are zero-indexed pointers to the first and last still-possible positions; sum is the pair they currently point to. The result must use 1-indexed positions, so each returned pointer needs + 1.",
  "Longest Substring Without Repeating Characters": "s is the input string. left and right are indexes that bound the current substring, and seen contains exactly the characters currently inside that window.",
  "Valid Parentheses": "s is the bracket string. pairs maps each closing bracket to the opening bracket it requires, and stack holds opening brackets that have not been matched yet.",
  "Binary Search": "nums is sorted. left and right are inclusive indexes of the only range where target could still be; mid is the index being tested this iteration.",
  "Reverse Linked List": "current is the node being rewired now, prev is the already-reversed part of the list, and next temporarily saves the still-unvisited part before current.next changes.",
  "Number of Islands": "grid contains \"1\" for land and \"0\" for water. r and c are a cell’s row and column; visit flood-fills one island and marks every land cell it reaches.",
  "Invert Binary Tree": "root is the current tree node. root.left and root.right are child subtrees; the task is to swap them at every node while preserving both references."
};

export const extraCodeDrills = [
  {
    title: "Trapping Rain Water",
    topic: "Two Pointers",
    difficulty: "Hard",
    context: "height is the elevation array. left and right are pointers at the unprocessed ends; leftMax and rightMax are the tallest walls seen from each side. At a side, its maximum wall determines how much water that bar can hold.",
    exercise: {
      prompt: "The left side is being processed. Which line adds only the water that sits above the current bar?",
      code: "while (left < right) {\n  if (height[left] <= height[right]) {\n    leftMax = Math.max(leftMax, height[left]);\n    ___\n    left++;\n  } else {\n    rightMax = Math.max(rightMax, height[right]);\n    water += rightMax - height[right];\n    right--;\n  }\n}",
      choices: [
        "water += leftMax - height[left];",
        "water += height[left] - leftMax;",
        "water += leftMax + height[left];"
      ],
      correct: "water += leftMax - height[left];",
      why: "The water level over this bar is leftMax, so leftMax − height[left] is the trapped depth above it.",
      wrong: {
        "water += height[left] - leftMax;": "height[left] is never taller than leftMax after the update, so this is zero or negative.",
        "water += leftMax + height[left];": "Both terms are heights; adding them is not a depth of water."
      }
    },
    pythonExercise: {
      prompt: "The left side is being processed. Which line adds only the water that sits above the current bar?",
      code: "while left < right:\n    if height[left] <= height[right]:\n        left_max = max(left_max, height[left])\n        ___\n        left += 1\n    else:\n        right_max = max(right_max, height[right])\n        water += right_max - height[right]\n        right -= 1",
      choices: [
        "water += left_max - height[left]",
        "water += height[left] - left_max",
        "water += left_max + height[left]"
      ],
      correct: "water += left_max - height[left]",
      why: "The water level over this bar is left_max, so left_max − height[left] is the trapped depth above it.",
      wrong: {
        "water += height[left] - left_max": "height[left] is never taller than left_max after the update, so this is zero or negative.",
        "water += left_max + height[left]": "Both terms are heights; adding them is not a depth of water."
      }
    }
  },
  {
    title: "Largest Rectangle in Histogram",
    topic: "Stack",
    difficulty: "Hard",
    context: "heights contains bar heights. stack holds indexes of bars with increasing heights. i is the first index where a popped bar can no longer extend right, while left is the nearest shorter bar to its left.",
    exercise: {
      prompt: "The popped bar h can extend from just after left to just before i. Which line uses the correct inclusive width?",
      code: "while (stack.length && heights[stack.at(-1)] > current) {\n  const h = heights[stack.pop()];\n  const left = stack.length ? stack.at(-1) : -1;\n  ___\n}",
      choices: [
        "best = Math.max(best, h * (i - left - 1));",
        "best = Math.max(best, h * (i - left));",
        "best = Math.max(best, h * (left - i - 1));"
      ],
      correct: "best = Math.max(best, h * (i - left - 1));",
      why: "The rectangle starts immediately after left and ends immediately before i, so both boundary bars are excluded: i − left − 1.",
      wrong: {
        "best = Math.max(best, h * (i - left));": "That counts one of the shorter boundary bars in the width.",
        "best = Math.max(best, h * (left - i - 1));": "The endpoints are reversed, producing a negative width."
      }
    },
    pythonExercise: {
      prompt: "The popped bar h can extend from just after left to just before i. Which line uses the correct inclusive width?",
      code: "while stack and heights[stack[-1]] > current:\n    h = heights[stack.pop()]\n    left = stack[-1] if stack else -1\n    ___\nstack.append(i)",
      choices: [
        "best = max(best, h * (i - left - 1))",
        "best = max(best, h * (i - left))",
        "best = max(best, h * (left - i - 1))"
      ],
      correct: "best = max(best, h * (i - left - 1))",
      why: "The rectangle starts immediately after left and ends immediately before i, so both boundary bars are excluded: i − left − 1.",
      wrong: {
        "best = max(best, h * (i - left))": "That counts one of the shorter boundary bars in the width.",
        "best = max(best, h * (left - i - 1))": "The endpoints are reversed, producing a negative width."
      }
    }
  }
];

export const codeExercises = {
  "Contains Duplicate": [
    {
      prompt: "Which line returns as soon as the current number was already seen?",
      code: "const seen = new Set();\nfor (const n of nums) {\n  ___\n  seen.add(n);\n}\nreturn false;",
      choices: [
        "if (seen.has(n)) return true;",
        "if (seen.add(n)) return true;",
        "if (!seen.has(n)) return true;"
      ],
      correct: "if (seen.has(n)) return true;",
      why: "seen.has(n) tests membership without changing the set, so a value from an earlier position ends the scan.",
      wrong: {
        "if (seen.add(n)) return true;": "add returns the Set itself, which is always truthy, so this returns true on the first number.",
        "if (!seen.has(n)) return true;": "This fires for brand-new values — the opposite of a duplicate."
      }
    },
    {
      prompt: "Which line records the current number so a later repeat can be caught?",
      code: "const seen = new Set();\nfor (const n of nums) {\n  if (seen.has(n)) return true;\n  ___\n}\nreturn false;",
      choices: [
        "seen.add(n);",
        "seen.has(n);",
        "seen.delete(n);"
      ],
      correct: "seen.add(n);",
      why: "Storing n now lets a later occurrence be found by the membership check.",
      wrong: {
        "seen.has(n);": "This only checks membership; it saves nothing, so no duplicate is ever detected.",
        "seen.delete(n);": "This removes n instead of remembering it."
      }
    }
  ],
  "Reverse Linked List": [
    {
      prompt: "Which line saves the rest of the list before the next link is overwritten?",
      code: "let prev = null;\nlet current = head;\nwhile (current) {\n  ___\n  current.next = prev;\n  prev = current;\n  current = next;\n}\nreturn prev;",
      choices: [
        "const next = current.next;",
        "const next = current.prev;",
        "const next = prev;"
      ],
      correct: "const next = current.next;",
      why: "current.next still points at the unvisited remainder; saving it keeps that list reachable after the link flips.",
      wrong: {
        "const next = current.prev;": "A singly linked node has no prev pointer.",
        "const next = prev;": "prev is the already-reversed side, not the remaining nodes."
      }
    },
    {
      prompt: "Which line moves prev forward to the node just reversed?",
      code: "let prev = null;\nlet current = head;\nwhile (current) {\n  const next = current.next;\n  current.next = prev;\n  ___\n  current = next;\n}\nreturn prev;",
      choices: [
        "prev = current;",
        "prev = next;",
        "prev = head;"
      ],
      correct: "prev = current;",
      why: "current is now the front of the reversed portion, so it becomes prev for the next iteration.",
      wrong: {
        "prev = next;": "next is still unprocessed; using it skips the node just reversed.",
        "prev = head;": "head never advances, so it cannot track the growing reversed list."
      }
    }
  ],
  "Two Sum II": [
    {
      prompt: "The array is sorted ascending. Which line moves the right pointer inward from a match?",
      code: "let left = 0, right = numbers.length - 1;\nwhile (left < right) {\n  const sum = numbers[left] + numbers[right];\n  if (sum === target) return [left + 1, right + 1];\n  ___\n}",
      choices: [
        "if (sum < target) left++; else right--;",
        "if (sum < target) right--; else left++;",
        "if (sum < target) left--; else right++;"
      ],
      correct: "if (sum < target) left++; else right--;",
      why: "A too-small sum needs a larger value (left++); a too-large sum needs a smaller value (right--).",
      wrong: {
        "if (sum < target) right--; else left++;": "Lowering right on a too-small sum makes it even smaller.",
        "if (sum < target) left--; else right++;": "Both moves leave the active window and can run out of bounds."
      }
    },
    {
      prompt: "Positions must be 1-indexed. Which line returns the correct answer on a match?",
      code: "let left = 0, right = numbers.length - 1;\nwhile (left < right) {\n  const sum = numbers[left] + numbers[right];\n  ___\n  if (sum < target) left++; else right--;\n}",
      choices: [
        "if (sum === target) return [left + 1, right + 1];",
        "if (sum === target) return [left, right];",
        "if (sum === target) return [left + 1, right];"
      ],
      correct: "if (sum === target) return [left + 1, right + 1];",
      why: "left and right are zero-indexed, and the problem wants 1-indexed positions, so both need + 1.",
      wrong: {
        "if (sum === target) return [left, right];": "These are zero-indexed positions, off by one on both.",
        "if (sum === target) return [left + 1, right];": "This corrects only the left index."
      }
    }
  ],
  "Longest Substring Without Repeating Characters": [
    {
      prompt: "The incoming character is already inside the window. Which line repairs the window from the left?",
      code: "const seen = new Set();\nlet left = 0, best = 0;\nfor (let right = 0; right < s.length; right++) {\n  ___\n  seen.add(s[right]);\n  best = Math.max(best, right - left + 1);\n}",
      choices: [
        "while (seen.has(s[right])) seen.delete(s[left++]);",
        "while (seen.has(s[right])) seen.delete(s[right++]);",
        "while (seen.has(s[right])) seen.add(s[left++]);"
      ],
      correct: "while (seen.has(s[right])) seen.delete(s[left++]);",
      why: "The duplicate must leave from the left edge, so remove s[left] and advance left until the window is valid.",
      wrong: {
        "while (seen.has(s[right])) seen.delete(s[right++]);": "This removes the incoming character and skips input, leaving the earlier duplicate inside.",
        "while (seen.has(s[right])) seen.add(s[left++]);": "Adding instead of deleting never makes the window valid, so the loop never ends."
      }
    },
    {
      prompt: "The window is valid again. Which line records its length?",
      code: "const seen = new Set();\nlet left = 0, best = 0;\nfor (let right = 0; right < s.length; right++) {\n  while (seen.has(s[right])) seen.delete(s[left++]);\n  seen.add(s[right]);\n  ___\n}",
      choices: [
        "best = Math.max(best, right - left + 1);",
        "best = Math.max(best, right - left);",
        "best = Math.max(best, best + 1);"
      ],
      correct: "best = Math.max(best, right - left + 1);",
      why: "Both ends are inside the window, so its length is right − left + 1.",
      wrong: {
        "best = Math.max(best, right - left);": "This drops one endpoint, undercounting every window.",
        "best = Math.max(best, best + 1);": "The window can change by more than one; measure it from its bounds."
      }
    }
  ],
  "Valid Parentheses": [
    {
      prompt: "A closing bracket must resolve the most recent opener. Which line checks that?",
      code: "const pairs = { \")\": \"(\", \"]\": \"[\", \"}\": \"{\" };\nconst stack = [];\nfor (const ch of s) {\n  if (ch in pairs) {\n    ___\n  } else {\n    stack.push(ch);\n  }\n}\nreturn stack.length === 0;",
      choices: [
        "if (stack.pop() !== pairs[ch]) return false;",
        "if (stack.shift() !== pairs[ch]) return false;",
        "if (stack.push(ch) !== pairs[ch]) return false;"
      ],
      correct: "if (stack.pop() !== pairs[ch]) return false;",
      why: "pop() removes the most recently pushed opener, the only one this closing bracket may match.",
      wrong: {
        "if (stack.shift() !== pairs[ch]) return false;": "shift() removes the oldest opener, breaking nested last-in, first-out order.",
        "if (stack.push(ch) !== pairs[ch]) return false;": "push adds another item and returns the new length; it resolves nothing."
      }
    },
    {
      prompt: "Which line reports whether every opener was matched?",
      code: "const pairs = { \")\": \"(\", \"]\": \"[\", \"}\": \"{\" };\nconst stack = [];\nfor (const ch of s) {\n  if (ch in pairs) {\n    if (stack.pop() !== pairs[ch]) return false;\n  } else {\n    stack.push(ch);\n  }\n}\n___",
      choices: [
        "return stack.length === 0;",
        "return stack.length === 1;",
        "return stack.length === s.length;"
      ],
      correct: "return stack.length === 0;",
      why: "An empty stack means every opening bracket found its match.",
      wrong: {
        "return stack.length === 1;": "One leftover opener is still unmatched, so the string is invalid.",
        "return stack.length === s.length;": "The stack holds only unresolved openers, not every character."
      }
    }
  ],
  "Binary Search": [
    {
      prompt: "mid is too small and already tested. Which line keeps only the values that could still match?",
      code: "let left = 0, right = nums.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (nums[mid] === target) return mid;\n  ___\n  else right = mid - 1;\n}\nreturn -1;",
      choices: [
        "if (nums[mid] < target) left = mid + 1;",
        "if (nums[mid] < target) left = mid - 1;",
        "if (nums[mid] < target) left = mid;"
      ],
      correct: "if (nums[mid] < target) left = mid + 1;",
      why: "mid was checked and is too small, so the next possible answer starts right after it.",
      wrong: {
        "if (nums[mid] < target) left = mid - 1;": "That moves toward even smaller values, which cannot help.",
        "if (nums[mid] < target) left = mid;": "Leaving mid in the range can repeat the same midpoint forever."
      }
    },
    {
      prompt: "mid is too large and already tested. Which line ends the interval just before it?",
      code: "let left = 0, right = nums.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (nums[mid] === target) return mid;\n  if (nums[mid] < target) left = mid + 1;\n  ___\n}\nreturn -1;",
      choices: [
        "else right = mid - 1;",
        "else right = mid + 1;",
        "else right = mid;"
      ],
      correct: "else right = mid - 1;",
      why: "mid was checked and is too large, so the remaining interval ends one before it.",
      wrong: {
        "else right = mid + 1;": "That keeps values above an already too-large midpoint.",
        "else right = mid;": "Leaving mid in the range can stop the bounds from shrinking."
      }
    }
  ],
  "Number of Islands": [
    {
      prompt: "Flood fill has just reached land. Which line marks it so it is not counted again?",
      code: "function visit(r, c) {\n  if (r < 0 || c < 0 || r === rows || c === cols || grid[r][c] !== \"1\") return;\n  ___\n  visit(r + 1, c);\n  visit(r - 1, c);\n  visit(r, c + 1);\n  visit(r, c - 1);\n}",
      choices: [
        "grid[r][c] = \"0\";",
        "grid[r][c] = \"1\";",
        "grid[r][c] = r + 1;"
      ],
      correct: "grid[r][c] = \"0\";",
      why: "Turning visited land into water records that this cell already belongs to the current island.",
      wrong: {
        "grid[r][c] = \"1\";": "Leaving it as land lets a later scan or call visit it again.",
        "grid[r][c] = r + 1;": "A grid cell holds a value, not a coordinate."
      }
    },
    {
      prompt: "Three neighbors are already visited. Which line explores the left neighbor?",
      code: "function visit(r, c) {\n  if (r < 0 || c < 0 || r === rows || c === cols || grid[r][c] !== \"1\") return;\n  grid[r][c] = \"0\";\n  visit(r + 1, c);\n  visit(r - 1, c);\n  visit(r, c + 1);\n  ___\n}",
      choices: [
        "visit(r, c - 1);",
        "visit(c, c - 1);",
        "visit(r + 1, c - 1);"
      ],
      correct: "visit(r, c - 1);",
      why: "Keeping r and decreasing c reaches the cell immediately to the left.",
      wrong: {
        "visit(c, c - 1);": "This passes a column where the row is expected.",
        "visit(r + 1, c - 1);": "This moves diagonally, skipping the direct left cell."
      }
    }
  ],
  "Invert Binary Tree": [
    {
      prompt: "Which line handles the empty subtree that ends the recursion?",
      code: "function invertTree(root) {\n  ___\n  const oldLeft = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(oldLeft);\n  return root;\n}",
      choices: [
        "if (!root) return null;",
        "if (!root) return root;",
        "if (!root) return [];"
      ],
      correct: "if (!root) return null;",
      why: "A missing child stays missing; returning null stops recursion at the edge of the tree.",
      wrong: {
        "if (!root) return root;": "There is no node to return when this branch is empty.",
        "if (!root) return [];": "The function returns tree nodes or null, not an array."
      }
    },
    {
      prompt: "Which line preserves the original left child before it is overwritten?",
      code: "function invertTree(root) {\n  if (!root) return null;\n  ___\n  root.left = invertTree(root.right);\n  root.right = invertTree(oldLeft);\n  return root;\n}",
      choices: [
        "const oldLeft = root.left;",
        "const oldLeft = root.right;",
        "const oldLeft = root.val;"
      ],
      correct: "const oldLeft = root.left;",
      why: "The original left subtree must be saved so it can become the new right after both sides invert.",
      wrong: {
        "const oldLeft = root.right;": "Saving right loses the original left subtree, which still needs to move.",
        "const oldLeft = root.val;": "val is the node’s payload, not a child subtree."
      }
    }
  ]
};
