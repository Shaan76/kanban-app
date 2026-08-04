const Column = require('../models/Column');

// CREATE a column
exports.createColumn = async (req, res) => {
  try {
    const { title, boardId, order } = req.body;
    if (!title || !boardId) {
      return res.status(400).json({ message: 'Title and boardId are required' });
    }

    const column = await Column.create({ title, boardId, order: order || 0 });
    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all columns for a board
exports.getColumnsByBoard = async (req, res) => {
  try {
    const columns = await Column.find({ boardId: req.params.boardId }).sort({ order: 1 });
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a column (rename or reorder)
exports.updateColumn = async (req, res) => {
  try {
    const column = await Column.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!column) return res.status(404).json({ message: 'Column not found' });
    res.status(200).json(column);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a column
exports.deleteColumn = async (req, res) => {
  try {
    const column = await Column.findByIdAndDelete(req.params.id);
    if (!column) return res.status(404).json({ message: 'Column not found' });
    res.status(200).json({ message: 'Column deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
