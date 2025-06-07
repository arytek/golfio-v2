export function setupHUD(state) {
  const instructionsEl = document.getElementById('instructions');
  const scoreboardEl = document.getElementById('scoreboard');

  function update() {
    // update instructions based on game state
    switch (state.gameState) {
      case 'WAITING':
        instructionsEl.textContent = 'Waiting for players...';
        break;
      case 'AIMING':
        instructionsEl.textContent = 'Click and drag on the canvas to aim, release to shoot';
        break;
      case 'SIMULATING':
        instructionsEl.textContent = 'Ball in motion...';
        break;
      case 'SCORECARD':
        instructionsEl.textContent = 'Scorecard';
        break;
      case 'GAMEOVER':
        instructionsEl.textContent = 'Game Over';
        break;
      default:
        instructionsEl.textContent = '';
    }

    // update scoreboard
    scoreboardEl.innerHTML = '';
    if (Array.isArray(state.scores) && state.scores.length) {
      const ul = document.createElement('ul');
      for (const s of state.scores) {
        const li = document.createElement('li');
        li.textContent = `${s.id.substring(0, 4)}: ${s.strokes}`;
        ul.appendChild(li);
      }
      scoreboardEl.appendChild(ul);
    }

    requestAnimationFrame(update);
  }

  update();
}
