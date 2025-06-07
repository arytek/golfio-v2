# Golfio v2

Golfio v2 is a prototype multiplayer mini golf game. The server is built with Express and Socket.IO and uses Matter.js for physics simulation.

## Requirements

- Node.js
- npm

## Installation

Install the dependencies:

```bash
npm install
```

## Running the game

Start the server with:

```bash
npm start
```

Open `http://localhost:3000` in your browser to join a game. Each connection is placed into a room with up to four players.

## Project layout

- `client/` – browser assets (HTML, CSS and front-end JavaScript)
- `courses/` – JSON definitions of golf courses
- `server/` – Node.js server code

## Custom courses

Course data lives under `courses/` in JSON format. Edit `courses/course1.json` or add new files to create additional holes and obstacles.

## License

ISC
