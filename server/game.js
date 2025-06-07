const { createEngine, step } = require('./physics');
const Player = require('./player');
const { loadCourse } = require('./course');

class GameRoom {
  constructor(id) {
    this.roomId = id;
    this.players = new Map();
    this.courseData = loadCourse('course1');
    this.currentHole = 0;
    this.gameState = 'WAITING';
    this.engine = null;
    this.aimTimer = null;
    this.simTimer = null;
    this.holeData = this.courseData.holes[this.currentHole];
  }

  addPlayer(socket) {
    const p = new Player(socket.id);
    this.players.set(socket.id, p);
  }

  removePlayer(id) {
    const p = this.players.get(id);
    if (p) {
      if (p.ball && this.engine) {
        const Matter = require('matter-js');
        Matter.World.remove(this.engine.world, p.ball);
      }
      this.players.delete(id);
    }
  }

  startGame(io) {
    this.io = io;
    this.gameState = 'AIMING';
    this.engine = createEngine(this.courseData, Array.from(this.players.values()));
    io.to(this.roomId).emit('gameJoined', {
      roomId: this.roomId,
      players: Array.from(this.players.values()).map(p => ({ id: p.id, name: p.name })),
      courseData: this.courseData,
      initialGameState: this.serializeState()
    });
    this.startAiming(io);
  }

  startAiming(io) {
    this.gameState = 'AIMING';
    for (const p of this.players.values()) {
      p.lockedShot = null;
    }
    io.to(this.roomId).emit('gameStateUpdate', { gameState: 'AIMING' });
    this.aimTimer = setTimeout(() => this.startSim(io), 60000);
  }

  handleInput(id, velocity) {
    const player = this.players.get(id);
    if (player && this.gameState === 'AIMING') {
      player.lockedShot = velocity;
      clearTimeout(this.aimTimer);
      this.startSim(this.io);
    }
  }

  startSim(io) {
    this.io = io;
    this.gameState = 'SIMULATING';
    // apply locked shots
    const Matter = require('matter-js');
    for (const p of this.players.values()) {
      if (p.lockedShot) {
        Matter.Body.setVelocity(p.ball, p.lockedShot);
        p.strokes += 1;
        p.lockedShot = null;
      }
    }
    const interval = 1000 / 60; // physics step 60Hz
    this.simTimer = setInterval(() => {
      step(this.engine, interval);
      io.to(this.roomId).emit('gameStateUpdate', this.serializeState());
      // check stop condition
      const moving = [...this.players.values()].some(p => {
        const v = p.ball.velocity;
        return Math.abs(v.x) > 0.05 || Math.abs(v.y) > 0.05;
      });
      if (!moving) {
        clearInterval(this.simTimer);
        this.startScore(io);
      }
    }, interval);
  }

  startScore(io) {
    this.gameState = 'SCORECARD';
    io.to(this.roomId).emit('gameStateUpdate', { gameState: 'SCORECARD', scores: this.getScores() });
    setTimeout(() => this.nextHole(io), 5000);
  }

  nextHole(io) {
    this.currentHole += 1;
    if (this.currentHole >= this.courseData.holes.length) {
      this.endGame(io);
    } else {
      this.holeData = this.courseData.holes[this.currentHole];
      // reset engine and balls
      const players = Array.from(this.players.values());
      this.engine = createEngine(this.courseData, players);
      this.startAiming(io);
    }
  }

  endGame(io) {
    this.gameState = 'GAMEOVER';
    io.to(this.roomId).emit('gameOver', { finalScores: this.getScores() });
  }

  serializeState() {
    return {
      gameState: this.gameState,
      balls: Array.from(this.players.values()).map(p => ({
        playerId: p.id,
        position: { x: p.ball.position.x, y: p.ball.position.y },
        velocity: { x: p.ball.velocity.x, y: p.ball.velocity.y }
      }))
    };
  }

  getScores() {
    return Array.from(this.players.values()).map(p => ({ id: p.id, strokes: p.strokes }));
  }
}

module.exports = GameRoom;
