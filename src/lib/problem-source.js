const leetCodeSlugOverrides = {
  '3Sum': '3sum',
  'Non-Cyclical Number': 'happy-number',
  'Reverse Nodes in K-Group': 'reverse-nodes-in-k-group',
  'Implement Trie (Prefix Tree)': 'implement-trie-prefix-tree',
};

export function leetCodeUrl(title) {
  const slug = leetCodeSlugOverrides[title] || title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `https://leetcode.com/problems/${slug}/`;
}

export function sourceLink(title) {
  return `<footer class="problem-source"><a href="${leetCodeUrl(title)}" target="_blank" rel="noreferrer">Source: LeetCode ↗</a></footer>`;
}
