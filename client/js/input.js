let canvas;

export function setupInput(socket, state) {
  canvas = document.getElementById('gameCanvas');

  canvas.addEventListener('mousedown', e => {
    if (state.gameState !== 'AIMING') return;
    state.aim.dragging = true;
    state.aim.startX = e.offsetX;
    state.aim.startY = e.offsetY;
    state.aim.currentX = e.offsetX;
    state.aim.currentY = e.offsetY;
  });

  canvas.addEventListener('mousemove', e => {
    if (!state.aim.dragging) return;
    state.aim.currentX = e.offsetX;
    state.aim.currentY = e.offsetY;
  });

  canvas.addEventListener('mouseup', e => {
    if (!state.aim.dragging) return;
    state.aim.dragging = false;
    const dx = state.aim.startX - e.offsetX;
    const dy = state.aim.startY - e.offsetY;
    const velocity = { x: dx * 0.1, y: dy * 0.1 };
    socket.emit('playerInput', { velocity });
  });
}
