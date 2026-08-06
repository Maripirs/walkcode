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

