const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    // Map _id to id for frontend compatibility
    const formatted = transactions.map(t => ({
      id: t._id.toString(),
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date,
      recurring: t.recurring
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a transaction
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    description: req.body.description,
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
    date: req.body.date,
    recurring: req.body.recurring || false
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json({
      id: newTransaction._id.toString(),
      description: newTransaction.description,
      amount: newTransaction.amount,
      type: newTransaction.type,
      category: newTransaction.category,
      date: newTransaction.date,
      recurring: newTransaction.recurring
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
      id: updated._id.toString(),
      description: updated.description,
      amount: updated.amount,
      type: updated.type,
      category: updated.category,
      date: updated.date,
      recurring: updated.recurring
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
