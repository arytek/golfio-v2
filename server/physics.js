const Matter = require('matter-js');

function createEngine(course, players) {
  const engine = Matter.Engine.create();
  const world = engine.world;

  // create boundaries
  const ground = Matter.Bodies.rectangle(400, 610, 800, 60, { isStatic: true });
  Matter.World.add(world, ground);

  if (course && course.holes && course.holes.length) {
    const hole = course.holes[0];
    // add staticShapes
    for (const s of hole.staticShapes || []) {
      let body;
      if (s.type === 'rectangle') {
        body = Matter.Bodies.rectangle(
          s.position.x,
          s.position.y,
          s.size.width,
          s.size.height,
          Object.assign({ isStatic: true }, s.options || {})
        );
      } else if (s.type === 'circle') {
        body = Matter.Bodies.circle(
          s.position.x,
          s.position.y,
          s.radius,
          Object.assign({ isStatic: true }, s.options || {})
        );
      }
      if (body) Matter.World.add(world, body);
    }
  }

  // create player balls
  for (const p of players) {
    const start = course.holes[0].startPosition;
    const ball = Matter.Bodies.circle(start.x, start.y, 10, {
      restitution: 0.8,
      friction: 0.01,
      label: p.id
    });
    p.ball = ball;
    Matter.World.add(world, ball);
  }

  return engine;
}

function step(engine, dt) {
  Matter.Engine.update(engine, dt);
}

module.exports = { createEngine, step };
