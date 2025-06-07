const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const GameRoom = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'client')));

let rooms = [];
let roomCounter = 1;

function findOrCreateRoom() {
  let room = rooms.find(r => r.players.size < 4 && r.gameState === 'WAITING');
  if (!room) {
    room = new GameRoom('room' + roomCounter++);
    rooms.push(room);
  }
  return room;
}

io.on('connection', socket => {
  console.log('Socket connected', socket.id);
  let currentRoom = null;

  socket.on('joinGame', () => {
    const room = findOrCreateRoom();
    currentRoom = room;
    socket.join(room.roomId);
    room.addPlayer(socket);
    io.to(room.roomId).emit('gameStateUpdate', { message: `${socket.id} joined.` });
    if (room.players.size >= 1 && room.players.size <= 4 && room.gameState === 'WAITING') {
      // start game after small delay
      setTimeout(() => {
        if (room.gameState === 'WAITING') {
          room.startGame(io);
        }
      }, 1000);
    }
  });

  socket.on('playerInput', data => {
    if (currentRoom) {
      currentRoom.handleInput(socket.id, data.velocity);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
    if (currentRoom) {
      currentRoom.removePlayer(socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
