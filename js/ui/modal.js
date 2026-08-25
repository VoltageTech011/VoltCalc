// js/ui/modal.js
export function showModal({ title, content, onConfirm, onCancel }) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
  `;

  const modalBox = document.createElement('div');
  modalBox.className = 'modal-box';
  modalBox.style.cssText = `
    background: var(--panel-solid); border: 1px solid var(--border);
    border-radius: 8px; padding: 24px; min-width: 300px; max-width: 500px;
  `;

  const modalTitle = document.createElement('h3');
  modalTitle.textContent = title;
  modalTitle.style.marginBottom = '16px';

  const modalContent = document.createElement('div');
  if (typeof content === 'string') modalContent.textContent = content;
  else modalContent.appendChild(content);
  modalContent.style.marginBottom = '20px';

  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '8px';
  buttonContainer.style.justifyContent = 'flex-end';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'CANCEL';
  cancelBtn.className = 'modal-btn';
  cancelBtn.onclick = () => { modalOverlay.remove(); if (onCancel) onCancel(); };

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'CONFIRM';
  confirmBtn.className = 'modal-btn accent';
  confirmBtn.onclick = () => { modalOverlay.remove(); if (onConfirm) onConfirm(); };

  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(confirmBtn);
  modalBox.appendChild(modalTitle);
  modalBox.appendChild(modalContent);
  modalBox.appendChild(buttonContainer);
  modalOverlay.appendChild(modalBox);
  document.body.appendChild(modalOverlay);
}
