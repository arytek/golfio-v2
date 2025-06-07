import { state } from './state.js';
import { setupInput } from './input.js';
import { startRendering } from './rendering.js';
import { setupHUD } from './hud.js';

const socket = io();
state.socket = socket;

socket.on('connect', () => {
  state.playerId = socket.id;
  socket.emit('joinGame');
});

socket.on('gameJoined', data => {
  state.courseData = data.courseData;
  state.gameState = data.initialGameState.gameState;
  state.balls = data.initialGameState.balls;
});

socket.on('gameStateUpdate', data => {
  if (data.balls) state.balls = data.balls;
  if (data.gameState) state.gameState = data.gameState;
  if (data.scores) state.scores = data.scores;
});

socket.on('gameOver', data => {
  state.finalScores = data.finalScores;
  alert('Game Over!');
});

setupInput(socket, state);
setupHUD(state);
startRendering(state);
