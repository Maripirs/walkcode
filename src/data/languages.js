// Language-specific lesson variants.
export const pythonSolutions = {
  "Contains Duplicate": "seen = set()\nfor n in nums:\n    if n in seen:\n        return True\n    seen.add(n)\nreturn False",
  "Two Sum II": "left, right = 0, len(numbers) - 1\nwhile left < right:\n    total = numbers[left] + numbers[right]\n    if total == target:\n        return [left + 1, right + 1]\n    if total < target:\n        left += 1\n    else:\n        right -= 1",
  "Longest Substring Without Repeating Characters": "seen = set()\nleft = best = 0\nfor right in range(len(s)):\n    while s[right] in seen:\n        seen.remove(s[left])\n        left += 1\n    seen.add(s[right])\n    best = max(best, right - left + 1)\nreturn best",
  "Valid Parentheses": "pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\nstack = []\nfor char in s:\n    if char in pairs:\n        if not stack or stack.pop() != pairs[char]:\n            return False\n    else:\n        stack.append(char)\nreturn not stack",
  "Binary Search": "left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target:\n        return mid\n    if nums[mid] < target:\n        left = mid + 1\n    else:\n        right = mid - 1\nreturn -1",
  "Reverse Linked List": "prev, current = None, head\nwhile current:\n    next_node = current.next\n    current.next = prev\n    prev = current\n    current = next_node\nreturn prev",
  "Number of Islands": "def visit(r, c):\n    if r < 0 or c < 0 or r == rows or c == cols or grid[r][c] != \"1\":\n        return\n    grid[r][c] = \"0\"\n    visit(r + 1, c); visit(r - 1, c)\n    visit(r, c + 1); visit(r, c - 1)",
  "Invert Binary Tree": "def invert_tree(root):\n    if root is None:\n        return None\n    old_left = root.left\n    root.left = invert_tree(root.right)\n    root.right = invert_tree(old_left)\n    return root"
};

export const pythonExercises = {
  "Contains Duplicate:0": {
    "prompt": "Use Python set membership before adding the current number.",
    "code": "for n in nums:\n    if ___:\n        return True\n    seen.add(n)",
    "choices": [
      "n in seen",
      "seen.add(n)",
      "n not in seen"
    ],
    "correct": "n in seen",
    "why": "in checks membership without changing the set.",
    "wrong": {
      "seen.add(n)": "add changes the set; it does not answer whether n was already present.",
      "n not in seen": "That condition identifies a new value, not a duplicate."
    }
  },
  "Contains Duplicate:1": {
    "code": "if n in seen:\n    return True\nseen.___(n)",
    "choices": [
      "add",
      "remove",
      "clear"
    ],
    "correct": "add",
    "why": "add records this new value for a later membership check.",
    "wrong": {
      "remove": "remove deletes a value instead of remembering it.",
      "clear": "clear erases every earlier value, so repeats can no longer be found."
    }
  },
  "Two Sum II:0": {
    "prompt": "numbers is sorted ascending. If the pair sum is too small, move the left pointer toward a larger number.",
    "code": "total = numbers[left] + numbers[right]\nif total < target:\n    ___\nelse:\n    right -= 1",
    "choices": [
      "left += 1",
      "right -= 1",
      "left -= 1"
    ],
    "correct": "left += 1",
    "why": "Incrementing left selects a larger value and can increase the sum.",
    "wrong": {
      "right -= 1": "Decrementing right selects a smaller value and makes the too-small sum worse.",
      "left -= 1": "left already marks the smallest remaining candidate."
    }
  },
  "Two Sum II:1": {
    "prompt": "Python list indexes are zero-based, while this problem asks for one-based positions.",
    "code": "if total == target:\n    return [left + 1, ___]",
    "choices": [
      "right + 1",
      "right",
      "left"
    ],
    "correct": "right + 1",
    "why": "Both pointers need one added before they are returned.",
    "wrong": {
      "right": "right is still a zero-based index.",
      "left": "left is the first matching position, not the right-side one."
    }
  },
  "Longest Substring Without Repeating Characters:0": {
    "code": "while s[right] in seen:\n    seen.remove(s[___])",
    "choices": [
      "left",
      "right",
      "right + 1"
    ],
    "correct": "left",
    "why": "The character leaving the window is at index left.",
    "wrong": {
      "right": "right is the incoming duplicate, not the character at the window’s left edge.",
      "right + 1": "That points outside the incoming side of the window."
    }
  },
  "Longest Substring Without Repeating Characters:1": {
    "code": "seen.add(s[right])\nbest = max(best, ___)",
    "choices": [
      "right - left + 1",
      "right - left",
      "best + 1"
    ],
    "correct": "right - left + 1",
    "why": "Both endpoints are included in the current window.",
    "wrong": {
      "right - left": "This drops one endpoint from the length.",
      "best + 1": "Compute the current window length from its boundaries."
    }
  },
  "Valid Parentheses:0": {
    "code": "if char in pairs:\n    if stack.___() != pairs[char]:\n        return False",
    "choices": [
      "pop",
      "append",
      "pop(0)"
    ],
    "correct": "pop",
    "why": "pop returns the most recently opened bracket.",
    "wrong": {
      "append": "append adds another item instead of resolving one.",
      "pop(0)": "Removing the oldest item breaks nested last-in, first-out matching."
    }
  },
  "Valid Parentheses:1": {
    "code": "for char in s:\n    # match or save each bracket\nreturn len(stack) == ___",
    "choices": [
      "0",
      "1",
      "len(s)"
    ],
    "correct": "0",
    "why": "No unmatched opening brackets may remain.",
    "wrong": {
      "1": "One remaining bracket is still unmatched.",
      "len(s)": "The stack holds only unresolved openings, not every input character."
    }
  },
  "Binary Search:0": {
    "code": "if nums[mid] < target:\n    left = ___",
    "choices": [
      "mid + 1",
      "mid - 1",
      "mid"
    ],
    "correct": "mid + 1",
    "why": "mid is too small and already tested, so the search starts just after it.",
    "wrong": {
      "mid - 1": "That moves toward smaller values.",
      "mid": "Keeping mid can repeat the same interval."
    }
  },
  "Binary Search:1": {
    "code": "if nums[mid] > target:\n    right = ___",
    "choices": [
      "mid - 1",
      "mid + 1",
      "mid"
    ],
    "correct": "mid - 1",
    "why": "mid is too large and already tested, so the interval ends just before it.",
    "wrong": {
      "mid + 1": "That moves toward larger values.",
      "mid": "Keeping mid can prevent the interval from shrinking."
    }
  },
  "Reverse Linked List:0": {
    "code": "while current:\n    next_node = current.___\n    current.next = prev",
    "choices": [
      "next",
      "value",
      "prev"
    ],
    "correct": "next",
    "why": "next_node preserves the remaining unvisited list before the link is reversed.",
    "wrong": {
      "value": "value is node data, not the link to the remaining nodes.",
      "prev": "prev points backward into the reversed part, not forward into the unvisited part."
    }
  },
  "Reverse Linked List:1": {
    "code": "next_node = current.next\ncurrent.next = prev\nprev = ___\ncurrent = next_node",
    "choices": [
      "current",
      "next_node",
      "head"
    ],
    "correct": "current",
    "why": "current is now the newest node in the reversed portion.",
    "wrong": {
      "next_node": "next_node is still unprocessed; using it skips the node just reversed.",
      "head": "head does not advance with the reversed portion."
    }
  },
  "Number of Islands:0": {
    "code": "if grid[r][c] != \"1\":\n    return\ngrid[r][c] = ___",
    "choices": [
      "\"0\"",
      "\"1\"",
      "r + 1"
    ],
    "correct": "\"0\"",
    "why": "Changing land to water marks it visited.",
    "wrong": {
      "\"1\"": "Leaving it as land allows it to be counted again.",
      "r + 1": "A grid cell needs a value, not a coordinate."
    }
  },
  "Number of Islands:1": {
    "code": "visit(r + 1, c)\nvisit(r - 1, c)\nvisit(r, c + 1)\nvisit(___, c - 1)",
    "choices": [
      "r",
      "c",
      "r + 1"
    ],
    "correct": "r",
    "why": "Keeping r and decreasing c reaches the left neighbor.",
    "wrong": {
      "c": "The first argument is a row, not a column.",
      "r + 1": "That repeats the downward neighbor."
    }
  },
  "Invert Binary Tree:0": {
    "code": "def invert_tree(root):\n    if root is None:\n        return ___",
    "choices": [
      "None",
      "root",
      "[]"
    ],
    "correct": "None",
    "why": "An empty subtree remains empty and ends that recursive branch.",
    "wrong": {
      "root": "There is no root node in this branch.",
      "[]": "This function returns a tree node or None, not a list."
    }
  },
  "Invert Binary Tree:1": {
    "code": "old_left = root.___\nroot.left = invert_tree(root.right)\nroot.right = invert_tree(old_left)",
    "choices": [
      "left",
      "right",
      "value"
    ],
    "correct": "left",
    "why": "The original left subtree must be saved before root.left is overwritten.",
    "wrong": {
      "right": "Saving right loses the original left subtree.",
      "value": "value is the payload, not a child subtree."
    }
  }
};
