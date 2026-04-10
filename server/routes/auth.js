import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const createToken = (user) => {
  const secret = process.env.JWT_SECRET || 'change-this-secret';
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '7d' });
};

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    const token = createToken(user);

    return res.status(201).json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user);
    return res.json({ user: { id: user._id, email: user.email }, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to sign in' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email createdAt');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
