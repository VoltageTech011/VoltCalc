// js/history/export.js
export function exportHistory(items) {
  const blob = new Blob([JSON.stringify(items)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'voltcalc-history.json';
  a.click();
  URL.revokeObjectURL(url);
}
