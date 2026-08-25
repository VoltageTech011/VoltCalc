// js/history/search.js
export function historySearch(items, query) {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(item => item.expression.toLowerCase().includes(q) || item.result.includes(q));
}
