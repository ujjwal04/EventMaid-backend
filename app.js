const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
require('./database');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRouter');
const userConnection = require('./sockets/userConnection');

const app = express();

app.use(express.json());
app.use(cors());

// Mount routes
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
  socket.on('join', async (room, callback) => {
    const roomId = await userConnection.assignRoom(room);
    socket.join(`room-${roomId}`);
    callback();
  });

  socket.on('message', async (message, callback) => {
    const roomId = await userConnection.saveMessage(message);
    socket.to(`room-${roomId}`).emit('received', { message });
    callback();
  });

  io.on('disconnect', (socket) => {
    console.log('User had left!!');
  });
});
//ws://localhost:3000/socket.io/?EIO=3&transport=websocket
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});

module.exports = server;
