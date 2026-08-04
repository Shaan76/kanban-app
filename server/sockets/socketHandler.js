const Card = require('../models/Card');

const boardUsers = {};

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-board', ({ boardId, userName }) => {
      socket.join(boardId);
      socket.data.boardId = boardId;
      socket.data.userName = userName || 'Anonymous';

      if (!boardUsers[boardId]) boardUsers[boardId] = {};
      boardUsers[boardId][socket.id] = socket.data.userName;

      io.to(boardId).emit('online-users', Object.values(boardUsers[boardId]));
      console.log(socket.data.userName + ' joined board ' + boardId);
    });

    socket.on('card-moved', async (data) => {
      try {
        const { cardId, columnId, order, boardId, version } = data;

        // Find the card and check its CURRENT version in the database
        const currentCard = await Card.findById(cardId);

        if (!currentCard) {
          socket.emit('card-move-error', { message: 'Card not found', cardId });
          return;
        }

        // CONFLICT CHECK: if the client's version is stale, reject the update
        if (currentCard.version !== version) {
          socket.emit('card-move-conflict', {
            message: 'This card was changed by someone else. Refreshing...',
            latestCard: currentCard,
          });
          return;
        }

        // No conflict — apply the update and bump the version
        const updatedCard = await Card.findByIdAndUpdate(
          cardId,
          { columnId, order, version: currentCard.version + 1 },
          { new: true }
        );

        // Broadcast to everyone else in the room, including the new version number
        socket.to(boardId).emit('card-updated', updatedCard);

        // Confirm success back to the sender too, with the new version
        socket.emit('card-move-success', updatedCard);
      } catch (error) {
        console.error('Error handling card-moved:', error.message);
      }
    });

    socket.on('disconnect', () => {
      const boardId = socket.data.boardId;
      if (boardId && boardUsers[boardId]) {
        delete boardUsers[boardId][socket.id];
        io.to(boardId).emit('online-users', Object.values(boardUsers[boardId]));
      }
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = socketHandler;
