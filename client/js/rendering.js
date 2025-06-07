let ctx;

export function startRendering(state) {
  const canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw balls
    for (const ball of state.balls) {
      ctx.beginPath();
      ctx.arc(ball.position.x, ball.position.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = ball.playerId === state.playerId ? '#e76f51' : '#264653';
      ctx.fill();
    }

    if (state.aim.dragging) {
      ctx.beginPath();
      ctx.moveTo(state.aim.startX, state.aim.startY);
      ctx.lineTo(state.aim.currentX, state.aim.currentY);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
