require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const boardRoutes = require('./routes/boards');
app.use('/api/boards', boardRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const socketHandler = require('./sockets/socketHandler');
socketHandler(io);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log('Server running on port ' + PORT));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
