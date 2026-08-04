import { create } from 'zustand';
import toast from 'react-hot-toast';
import socket from '../lib/socket';

const useBoardStore = create((set, get) => ({
  boardId: null,
  columns: [],
  cards: [],

  initBoard: (boardId, columns, cards) => {
    set({ boardId, columns, cards });

    socket.connect();
    socket.emit('join-board', { boardId, userName: 'You' });

    socket.off('card-updated');
    socket.off('card-move-conflict');
    socket.off('card-move-error');

    socket.on('card-updated', (updatedCard) => {
      if (!updatedCard) return;
      set((state) => ({
        cards: state.cards.map((c) =>
          c._id === updatedCard._id ? updatedCard : c
        ),
      }));
    });

    socket.on('card-move-conflict', ({ message, latestCard }) => {
      toast.error(message || 'This card was moved by someone else');
      set((state) => ({
        cards: state.cards.map((c) =>
          c._id === latestCard._id ? latestCard : c
        ),
      }));
    });

    socket.on('card-move-error', ({ message }) => {
      toast.error(message || 'Something went wrong moving that card');
    });
  },

  moveCard: (cardId, newColumnId, newOrder) => {
    const { cards, boardId } = get();
    const card = cards.find((c) => c._id === cardId);
    if (!card) return;

    set({
      cards: cards.map((c) =>
        c._id === cardId
          ? { ...c, columnId: newColumnId, order: newOrder }
          : c
      ),
    });

    socket.emit('card-moved', {
      cardId,
      columnId: newColumnId,
      order: newOrder,
      boardId,
      version: card.version,
    });
  },

  leaveBoard: () => {
    socket.off('card-updated');
    socket.off('card-move-conflict');
    socket.off('card-move-error');
    socket.disconnect();
  },
}));

export default useBoardStore;
