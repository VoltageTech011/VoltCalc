// js/graph/renderer.js
let scale = 30;
let offsetX = 0;
let offsetY = 0;

export function renderGraph(funcStr) {
  const canvas = document.getElementById('graphCanvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  
  // Background grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y <= h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  
  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  const centerX = w/2 + offsetX;
  const centerY = h/2 + offsetY;
  ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();

  // Plot function
  ctx.strokeStyle = '#D9FF43';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let first = true;
  for (let px = 0; px < w; px++) {
    const x = (px - centerX) / scale;
    let y;
    try {
      // Safe evaluation using Math only
      const sanitized = funcStr.replace(/\^/g, '**').replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(').replace(/sqrt\(/g, 'Math.sqrt(').replace(/log\(/g, 'Math.log(').replace(/abs\(/g, 'Math.abs(');
      y = new Function('x', 'Math', `return (${sanitized})`)(x, Math);
    } catch(e) { y = NaN; }
    if (!isNaN(y) && isFinite(y)) {
      const py = centerY - y * scale;
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
}

export function resetGraphView() { scale = 30; offsetX = 0; offsetY = 0; }
export function zoomIn() { scale *= 1.2; renderGraph(document.getElementById('graphFunction').value); }
export function zoomOut() { scale /= 1.2; renderGraph(document.getElementById('graphFunction').value); }
