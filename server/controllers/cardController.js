const Card = require('../models/Card');

// CREATE a card
exports.createCard = async (req, res) => {
  try {
    const { title, description, columnId, boardId, order } = req.body;
    if (!title || !columnId || !boardId) {
      return res.status(400).json({ message: 'Title, columnId, and boardId are required' });
    }

    const card = await Card.create({
      title,
      description: description || '',
      columnId,
      boardId,
      order: order || 0,
      createdBy: req.userId,
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all cards for a board
exports.getCardsByBoard = async (req, res) => {
  try {
    const cards = await Card.find({ boardId: req.params.boardId }).sort({ order: 1 });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a card (edit title/description, or move it to a new column/order)
exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a card
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.status(200).json({ message: 'Card deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
