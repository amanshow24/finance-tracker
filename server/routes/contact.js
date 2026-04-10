import express from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const contactMessage = await ContactMessage.create({ name, email, message });
    return res.status(201).json({ contactMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;
