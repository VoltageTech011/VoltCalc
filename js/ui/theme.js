// js/ui/theme.js
export function loadTheme() {
  return localStorage.getItem('voltcalc-theme') || 'dark';
}
export function toggleTheme() {
  const current = loadTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('voltcalc-theme', next);
  return next;
}
