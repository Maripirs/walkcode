// Code-drill and code-fix content.
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

export const drillDifficultyByTitle = {
  "Contains Duplicate": "Easy",
  "Two Sum II": "Medium",
  "Longest Substring Without Repeating Characters": "Medium",
  "Valid Parentheses": "Easy",
  "Binary Search": "Easy",
  "Reverse Linked List": "Easy",
  "Number of Islands": "Medium",
  "Invert Binary Tree": "Easy"
};

export const extraCodeDrills = [
  {
    "title": "Trapping Rain Water",
    "topic": "Two Pointers",
    "difficulty": "Hard",
    "context": "height is the elevation array. left and right are pointers at the unprocessed ends; leftMax and rightMax are the tallest walls seen from each side. At a side, its maximum wall determines how much water that bar can hold.",
    "fullCode": {
      "JavaScript": "let left = 0, right = height.length - 1;\nlet leftMax = 0, rightMax = 0, water = 0;\nwhile (left < right) {\n  if (height[left] <= height[right]) {\n    leftMax = Math.max(leftMax, height[left]);\n    water += leftMax - height[left];\n    left++;\n  } else {\n    rightMax = Math.max(rightMax, height[right]);\n    water += rightMax - height[right];\n    right--;\n  }\n}\nreturn water;",
      "Python": "left, right = 0, len(height) - 1\nleft_max = right_max = water = 0\nwhile left < right:\n    if height[left] <= height[right]:\n        left_max = max(left_max, height[left])\n        water += left_max - height[left]\n        left += 1\n    else:\n        right_max = max(right_max, height[right])\n        water += right_max - height[right]\n        right -= 1\nreturn water;"
    },
    "exercise": {
      "prompt": "The left maximum is the limiting wall for this bar. Add only the water above height[left].",
      "code": "leftMax = Math.max(leftMax, height[left]);\nwater += ___;\nleft++;",
      "choices": [
        "leftMax - height[left]",
        "height[left] - leftMax",
        "leftMax + height[left]"
      ],
      "correct": "leftMax - height[left]",
      "why": "The water level is leftMax, so subtracting the bar height gives the trapped water above this position.",
      "wrong": {
        "height[left] - leftMax": "The bar is never taller than leftMax after the update, so this reverses the needed difference.",
        "leftMax + height[left]": "Both values are heights; adding them does not represent water above the bar."
      }
    },
    "pythonExercise": {
      "prompt": "The left maximum is the limiting wall for this bar. Add only the water above height[left].",
      "code": "left_max = max(left_max, height[left])\nwater += ___\nleft += 1",
      "choices": [
        "left_max - height[left]",
        "height[left] - left_max",
        "left_max + height[left]"
      ],
      "correct": "left_max - height[left]",
      "why": "The water level is left_max, so subtracting the bar height gives the trapped water above this position.",
      "wrong": {
        "height[left] - left_max": "This reverses the needed difference.",
        "left_max + height[left]": "Adding heights does not represent water above the bar."
      }
    }
  },
  {
    "title": "Largest Rectangle in Histogram",
    "topic": "Stack",
    "difficulty": "Hard",
    "context": "heights contains bar heights. stack holds indexes of bars with increasing heights. i is the first index where a popped bar can no longer extend right, while left is the nearest shorter bar to its left.",
    "fullCode": {
      "JavaScript": "const stack = [];\nlet best = 0;\nfor (let i = 0; i <= heights.length; i++) {\n  const current = i === heights.length ? 0 : heights[i];\n  while (stack.length && heights[stack.at(-1)] > current) {\n    const h = heights[stack.pop()];\n    const left = stack.length ? stack.at(-1) : -1;\n    best = Math.max(best, h * (i - left - 1));\n  }\n  stack.push(i);\n}\nreturn best;",
      "Python": "stack = []\nbest = 0\nfor i in range(len(heights) + 1):\n    current = 0 if i == len(heights) else heights[i]\n    while stack and heights[stack[-1]] > current:\n        h = heights[stack.pop()]\n        left = stack[-1] if stack else -1\n        best = max(best, h * (i - left - 1))\n    stack.append(i)\nreturn best;"
    },
    "exercise": {
      "prompt": "After popping a bar, i is the first index that is too short and left is the nearest shorter bar on the other side. Compute the inclusive width between them.",
      "code": "const h = heights[stack.pop()];\nconst left = stack.length ? stack.at(-1) : -1;\nbest = Math.max(best, h * (___));",
      "choices": [
        "i - left - 1",
        "i - left",
        "left - i - 1"
      ],
      "correct": "i - left - 1",
      "why": "The rectangle starts immediately after left and ends immediately before i, so both boundary bars are excluded.",
      "wrong": {
        "i - left": "That includes one of the shorter boundary bars.",
        "left - i - 1": "The order is reversed, producing a negative width."
      }
    },
    "pythonExercise": {
      "prompt": "After popping a bar, i is the first index that is too short and left is the nearest shorter bar on the other side. Compute the inclusive width between them.",
      "code": "h = heights[stack.pop()]\nleft = stack[-1] if stack else -1\nbest = max(best, h * (___))",
      "choices": [
        "i - left - 1",
        "i - left",
        "left - i - 1"
      ],
      "correct": "i - left - 1",
      "why": "The rectangle starts immediately after left and ends immediately before i, so both boundary bars are excluded.",
      "wrong": {
        "i - left": "That includes one of the shorter boundary bars.",
        "left - i - 1": "The order is reversed, producing a negative width."
      }
    }
  }
];

export const codeExercises = {
  "Contains Duplicate": [
    {
      "prompt": "Complete the duplicate check before adding the current number.",
      "code": "for (const n of nums) {\n  if (seen.___(n)) return true;\n  seen.add(n);\n}",
      "choices": [
        "has",
        "add",
        "delete"
      ],
      "correct": "has",
      "why": "has checks membership without changing the set. add would mutate the set and always return the set itself."
    },
    {
      "prompt": "Complete the state update after you know this number is new.",
      "code": "if (seen.has(n)) return true;\nseen.___(n);",
      "choices": [
        "add",
        "has",
        "clear"
      ],
      "correct": "add",
      "why": "add records this new number so a later repeat can be detected."
    }
  ],
  "Reverse Linked List": [
    {
      "prompt": "Before reversing current.next, preserve the link to the unvisited part of the list.",
      "code": "while (current) {\n  const next = current.___;\n  current.next = prev;\n}",
      "choices": [
        "next",
        "value",
        "prev"
      ],
      "correct": "next",
      "why": "next saves the only pointer to the rest of the original list before current.next is overwritten.",
      "wrong": {
        "value": "value is the node’s data, not the link to the remaining nodes.",
        "prev": "prev points to the already reversed portion; using it here would lose the unreversed nodes."
      }
    },
    {
      "prompt": "After pointing current backward, move prev forward to the node you just processed.",
      "code": "const next = current.next;\ncurrent.next = prev;\nprev = ___;\ncurrent = next;",
      "choices": [
        "current",
        "next",
        "head"
      ],
      "correct": "current",
      "why": "current is now the front of the reversed portion, so it becomes prev for the next iteration.",
      "wrong": {
        "next": "next is still the first unprocessed node; assigning it to prev would skip the node you just reversed.",
        "head": "head never advances through the list, so it cannot represent the growing reversed portion."
      }
    }
  ],
  "Two Sum II": [
    {
      "prompt": "The array is sorted. When the pair sum is too small, choose the move that can make it larger.",
      "code": "const sum = numbers[left] + numbers[right];\nif (sum < target) {\n  ___;\n} else {\n  right--;\n}",
      "choices": [
        "left++",
        "right--",
        "left--"
      ],
      "correct": "left++",
      "why": "Moving left rightward chooses a larger value, so it is the only pointer move that can increase the sum.",
      "wrong": {
        "right--": "Moving right leftward chooses a smaller value and makes an already too-small sum even smaller.",
        "left--": "left is already at the smallest remaining candidate; moving it left leaves the active search range."
      }
    },
    {
      "prompt": "The prompt asks for 1-indexed positions, not JavaScript array indexes.",
      "code": "if (sum === target) {\n  return [left + 1, ___];\n}",
      "choices": [
        "right + 1",
        "right",
        "left"
      ],
      "correct": "right + 1",
      "why": "Both stored pointers are zero-indexed array positions, so both need one added before returning.",
      "wrong": {
        "right": "right is zero-indexed; returning it directly is off by one.",
        "left": "left is the first position again, not the right-side match."
      }
    }
  ],
  "Longest Substring Without Repeating Characters": [
    {
      "prompt": "When the incoming character is already in the window, remove the character at the left edge and advance left.",
      "code": "while (seen.has(s[right])) {\n  seen.delete(s[___]);\n}",
      "choices": [
        "left++",
        "right++",
        "right"
      ],
      "correct": "left++",
      "why": "left++ uses the outgoing character, then moves the left edge forward so the window can become valid again.",
      "wrong": {
        "right++": "right identifies the incoming duplicate. Removing it would leave the earlier duplicate inside the window.",
        "right": "right is the incoming character, not the character that must leave from the left edge."
      }
    },
    {
      "prompt": "After repairing the window, measure its inclusive length.",
      "code": "seen.add(s[right]);\nbest = Math.max(best, ___);",
      "choices": [
        "right - left + 1",
        "right - left",
        "best + 1"
      ],
      "correct": "right - left + 1",
      "why": "Both left and right are included in the current substring, so the length needs the +1.",
      "wrong": {
        "right - left": "That excludes one endpoint, so every non-empty window is counted too short.",
        "best + 1": "The window can change by more than one character between measurements; calculate its actual boundaries."
      }
    }
  ],
  "Valid Parentheses": [
    {
      "prompt": "A closing bracket must resolve the most recently opened bracket.",
      "code": "if (char in pairs) {\n  if (stack.___() !== pairs[char]) return false;\n}",
      "choices": [
        "pop",
        "push",
        "shift"
      ],
      "correct": "pop",
      "why": "pop removes and returns the most recently pushed opening bracket, which is the only one this closing bracket may match.",
      "wrong": {
        "push": "push adds another item; it does not inspect or resolve the pending opening bracket.",
        "shift": "shift removes the oldest opening bracket, but nested brackets must close in last-in, first-out order."
      }
    },
    {
      "prompt": "After reading every character, no opening bracket may remain unresolved.",
      "code": "for (const char of s) {\n  // match or push each bracket\n}\nreturn stack.length === ___;",
      "choices": [
        "0",
        "1",
        "s.length"
      ],
      "correct": "0",
      "why": "An empty stack means every opening bracket found a matching closing bracket.",
      "wrong": {
        "1": "One remaining opening bracket is still unmatched, so the string is invalid.",
        "s.length": "The stack stores only unresolved openings, not every character in the input."
      }
    }
  ],
  "Binary Search": [
    {
      "prompt": "mid is known to be too small, so remove it and every value to its left from the active interval.",
      "code": "if (nums[mid] < target) {\n  left = ___;\n}",
      "choices": [
        "mid + 1",
        "mid - 1",
        "mid"
      ],
      "correct": "mid + 1",
      "why": "mid was already checked and is too small. The next possible answer begins immediately after it.",
      "wrong": {
        "mid - 1": "That moves left in the direction of even smaller values, which cannot help after a too-small midpoint.",
        "mid": "Leaving mid in the interval can repeat the same midpoint forever."
      }
    },
    {
      "prompt": "When mid is too large, keep only values strictly before it.",
      "code": "if (nums[mid] > target) {\n  right = ___;\n}",
      "choices": [
        "mid - 1",
        "mid + 1",
        "mid"
      ],
      "correct": "mid - 1",
      "why": "mid was checked and is too large, so the remaining search interval ends just before it.",
      "wrong": {
        "mid + 1": "That keeps only values greater than an already too-large midpoint.",
        "mid": "Leaving mid in the interval can stop the bounds from shrinking."
      }
    }
  ],
  "Number of Islands": [
    {
      "prompt": "As soon as flood fill reaches land, mark it visited so another search cannot count it again.",
      "code": "if (grid[r][c] !== \"1\") return;\ngrid[r][c] = ___;",
      "choices": [
        "\"0\"",
        "\"1\"",
        "r + 1"
      ],
      "correct": "\"0\"",
      "why": "Changing visited land to water records that this cell already belongs to the island being explored.",
      "wrong": {
        "\"1\"": "Leaving the cell as land lets a later scan or recursive path visit it again.",
        "r + 1": "The grid stores cell values; r + 1 is a coordinate, not a visited marker."
      }
    },
    {
      "prompt": "Flood fill must explore horizontally adjacent land as well as vertically adjacent land.",
      "code": "visit(r + 1, c);\nvisit(r - 1, c);\nvisit(r, c + 1);\nvisit(___, c - 1);",
      "choices": [
        "r",
        "c",
        "r + 1"
      ],
      "correct": "r",
      "why": "Keeping r unchanged and decreasing c visits the left neighbor.",
      "wrong": {
        "c": "c is a column index, but the first argument to visit is the row.",
        "r + 1": "That repeats the downward neighbor instead of exploring left."
      }
    }
  ],
  "Invert Binary Tree": [
    {
      "prompt": "An empty subtree is already inverted, so it provides the recursive base case.",
      "code": "function invertTree(root) {\n  if (!root) return ___;\n}",
      "choices": [
        "null",
        "root",
        "[]"
      ],
      "correct": "null",
      "why": "A missing child stays missing; returning null stops recursion at the edge of the tree.",
      "wrong": {
        "root": "There is no root node when this branch is empty.",
        "[]": "The function returns tree nodes or null, not an array."
      }
    },
    {
      "prompt": "Preserve the original left child before replacing root.left with the inverted right subtree.",
      "code": "const oldLeft = root.___;\nroot.left = invertTree(root.right);\nroot.right = invertTree(oldLeft);",
      "choices": [
        "left",
        "right",
        "value"
      ],
      "correct": "left",
      "why": "oldLeft holds the original left subtree so it can become the new right subtree after both sides are inverted.",
      "wrong": {
        "right": "Saving right loses the original left subtree, which still needs to move to the right.",
        "value": "value is the node’s payload; the operation needs a child subtree reference."
      }
    }
  ]
};
