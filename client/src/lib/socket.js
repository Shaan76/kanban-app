import { io } from 'socket.io-client';

const socket = io('https://kanban-app-3k08.onrender.com', {
  autoConnect: false,
});

export default socket;
