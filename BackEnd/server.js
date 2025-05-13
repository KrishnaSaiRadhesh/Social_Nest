const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/db');
const authRouter = require('./Routes/AuthRouter');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const fileUpload = require('express-fileupload');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(fileUpload());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/api/auth', authRouter);
app.use('/api/user', require('./Routes/UserRoute'));
app.use('/api/posts', require('./Routes/PostRouter'));
app.use('/api/messages', require('./Routes/MessageRouter'));

// Socket.IO
let onlineUsers = [];
const userSocketMap = new Map(); // Map socket.id to userId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', (userId) => {
  console.log(`User ${userId} joined`);
  userSocketMap.set(socket.id, userId);
  if (!onlineUsers.includes(userId)) {
    onlineUsers.push(userId);
  }
  console.log('Current online users:', onlineUsers); // Debug
  io.emit('onlineUsers', onlineUsers);
});

  // Join chat room
  socket.on('joinRoom', (roomId) => {
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });

  // Send message
  socket.on('sendMessage', ({ roomId, ...message }) => {
    console.log(`Message sent to room ${roomId}:`, message);
    io.to(roomId).emit('receiveMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = userSocketMap.get(socket.id);
    console.log(`User disconnected: ${socket.id} (UserID: ${userId})`);
    if (userId) {
      onlineUsers = onlineUsers.filter((id) => id !== userId);
      userSocketMap.delete(socket.id);
      io.emit('onlineUsers', onlineUsers);
    }
  });
});

const Port = process.env.PORT || 3000;

server.listen(Port, () => {
  connectDB();
  console.log(`Server is running on port ${Port}`);
});