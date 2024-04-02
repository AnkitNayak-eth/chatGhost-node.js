const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Define a route handler for the root endpoint
app.get('/', (req, res) => {
  res.send('hello ankit');
});

const server = app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

const io = socketIO(server, {
  cors: {
    origin: "https://chat-ghost.netlify.app/",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const users = {};

io.on('connection', socket => {
  socket.on('newUserJoined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('userJoined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('out', users[socket.id]);
    delete users[socket.id];
  });
});
