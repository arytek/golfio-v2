class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name || `Player-${id.substring(0,4)}`;
    this.ball = null; // Matter.js body reference
    this.strokes = 0;
    this.finished = false;
  }
}

module.exports = Player;
