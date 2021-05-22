const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRouter');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

//Mount routes
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: [
    'websocket',
    'flashsocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling',
    'polling',
  ],
});

io.on('connection', (socket) => {
  console.log('We have a new connection');

  socket.on('join', (room) => {
    console.log(room.id);
    socket.on('message', (message, callback) => {
      socket.broadcast.emit('message', { message });
    });
  });

  io.on('disconnect', (socket) => {
    console.log('User had left!!');
  });
});
//ws://localhost:3000/socket.io/?EIO=3&transport=websocket

server.listen(3000, () => {
  console.log('Listening at port 3000');
});
