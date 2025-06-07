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

    if (state.aimLine) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(state.aimLine.startX, state.aimLine.startY);
      ctx.lineTo(state.aimLine.currentX, state.aimLine.currentY);
      ctx.stroke();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
