const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');

const boardController = require('../controllers/boardController');
const columnController = require('../controllers/columnController');
const cardController = require('../controllers/cardController');

// Board routes
router.post('/', protect, boardController.createBoard);
router.get('/', protect, boardController.getBoards);
router.get('/:id', protect, boardController.getBoardById);
router.put('/:id', protect, boardController.updateBoard);
router.delete('/:id', protect, boardController.deleteBoard);

// Column routes
router.post('/columns', protect, columnController.createColumn);
router.get('/:boardId/columns', protect, columnController.getColumnsByBoard);
router.put('/columns/:id', protect, columnController.updateColumn);
router.delete('/columns/:id', protect, columnController.deleteColumn);

// Card routes
router.post('/cards', protect, cardController.createCard);
router.get('/:boardId/cards', protect, cardController.getCardsByBoard);
router.put('/cards/:id', protect, cardController.updateCard);
router.delete('/cards/:id', protect, cardController.deleteCard);

module.exports = router;
