let canvas;
let isDragging = false;
let startX = 0;
let startY = 0;
let stateRef;

export function setupInput(socket, state) {
  canvas = document.getElementById('gameCanvas');
  stateRef = state;

  canvas.addEventListener('mousedown', e => {
    if (state.gameState !== 'AIMING') return;
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
    state.aimLine = { startX, startY, currentX: startX, currentY: startY };
  });

  canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    if (state.aimLine) {
      state.aimLine.currentX = e.offsetX;
      state.aimLine.currentY = e.offsetY;
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const dx = startX - e.offsetX;
    const dy = startY - e.offsetY;
    const velocity = { x: dx * 0.1, y: dy * 0.1 };
    socket.emit('playerInput', { velocity });
    state.aimLine = null;
  });

  canvas.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      stateRef.aimLine = null;
    }
  });
}
