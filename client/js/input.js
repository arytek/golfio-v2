let canvas;
let isDragging = false;
let startX = 0;
let startY = 0;

export function setupInput(socket, state) {
  canvas = document.getElementById('gameCanvas');

  canvas.addEventListener('mousedown', e => {
    if (state.gameState !== 'AIMING') return;
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
  });

  canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    // we could draw the line here using a separate canvas overlay
  });

  canvas.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const dx = startX - e.offsetX;
    const dy = startY - e.offsetY;
    const velocity = { x: dx * 0.1, y: dy * 0.1 };
    socket.emit('playerInput', { velocity });
  });
}
