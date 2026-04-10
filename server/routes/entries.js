import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Entry from '../models/Entry.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = { userId: req.user.id };

    if (start || end) {
      query.date = {};
      if (start) {
        query.date.$gte = new Date(start);
      }
      if (end) {
        query.date.$lte = new Date(end);
      }
    }

    const entries = await Entry.find(query).sort({ date: -1 });
    return res.json({ entries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load entries' });
  }
});

router.post('/', async (req, res) => {
  const { title, amount, category, type, notes, date } = req.body;

  if (!title || !amount || !category || !type || !date) {
    return res.status(400).json({ error: 'Missing required entry fields' });
  }

  try {
    const entry = await Entry.create({
      userId: req.user.id,
      title,
      amount,
      category,
      type,
      notes: notes || '',
      date: new Date(date),
    });
    return res.status(201).json({ entry });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create entry' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    return res.json({ entry });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update entry' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete entry' });
  }
});

export default router;
