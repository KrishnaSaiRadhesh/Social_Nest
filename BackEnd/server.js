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
app.use('/api/stories', require('./Routes/StoryRouter')(io));

// Socket.IO
let onlineUsers = [];
const userSocketMap = new Map(); // Map socket.id to userId

io.on('connection', (socket) => {


  // Handle user joining
  socket.on('join', (userId) => {

  userSocketMap.set(socket.id, userId);
  if (!onlineUsers.includes(userId)) {
    onlineUsers.push(userId);
  }
  console.log('Current online users:', onlineUsers); // Debug
  io.emit('onlineUsers', onlineUsers);
});

  // Join chat room
  socket.on('joinRoom', (roomId) => {

    socket.join(roomId);
  });

  // Send message
  socket.on('sendMessage', ({ roomId, ...message }) => {
 
    io.to(roomId).emit('receiveMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = userSocketMap.get(socket.id);
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