// js/ui/navigation.js
export function navigateTo(section) {
  document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active-section'));
  const target = document.getElementById(section + 'Section');
  if (target) target.classList.add('active-section');
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-item[data-section="${section}"]`);
  if (navBtn) navBtn.classList.add('active');
}
