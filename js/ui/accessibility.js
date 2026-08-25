// js/ui/accessibility.js
export function announceMessage(message) {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  setTimeout(() => announcer.remove(), 1000);
}

export function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Focus management for modal
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal-overlay');
      if (modal) modal.remove();
    }
    
    // Trap focus in modal
    if (e.key === 'Tab' && document.querySelector('.modal-overlay')) {
      // Simple focus trap logic
      const focusableElements = document.querySelectorAll('.modal-overlay button, .modal-overlay input, .modal-overlay select');
      if (focusableElements.length > 0) {
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  });
}

export function setReducedMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.documentElement.style.setProperty('--transition', '0s');
  }
}
