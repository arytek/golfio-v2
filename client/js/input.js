let canvas;

export function setupInput(socket, state) {
  canvas = document.getElementById('gameCanvas');

  canvas.addEventListener('mousedown', e => {
    if (state.gameState !== 'AIMING') return;
    const ball = state.balls.find(b => b.playerId === state.playerId);
    if (!ball) return;
    const dx = e.offsetX - ball.position.x;
    const dy = e.offsetY - ball.position.y;
    if (dx * dx + dy * dy > 15 * 15) return;
    state.aim.dragging = true;
    state.aim.startX = ball.position.x;
    state.aim.startY = ball.position.y;
    state.aim.currentX = ball.position.x;
    state.aim.currentY = ball.position.y;
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
