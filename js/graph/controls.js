// js/graph/controls.js
let currentScale = 30;
let currentOffsetX = 0;
let currentOffsetY = 0;

export function getViewState() {
  return { scale: currentScale, offsetX: currentOffsetX, offsetY: currentOffsetY };
}

export function setViewState(scale, offsetX, offsetY) {
  currentScale = scale;
  currentOffsetX = offsetX;
  currentOffsetY = offsetY;
}

export function resetView() {
  currentScale = 30;
  currentOffsetX = 0;
  currentOffsetY = 0;
}

export function zoomIn() {
  currentScale *= 1.2;
  return getViewState();
}

export function zoomOut() {
  currentScale /= 1.2;
  return getViewState();
}

export function panLeft() {
  currentOffsetX -= 10;
  return getViewState();
}

export function panRight() {
  currentOffsetX += 10;
  return getViewState();
}

export function panUp() {
  currentOffsetY -= 10;
  return getViewState();
}

export function panDown() {
  currentOffsetY += 10;
  return getViewState();
}
