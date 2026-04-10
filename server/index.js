import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import entriesRoutes from './routes/entries.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const CLIENT_URLS = process.env.CLIENT_URLS || '';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance-tracker';

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:8080',
  ...CLIENT_URLS.split(',').map((origin) => origin.trim()).filter(Boolean),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS origin not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Finance Tracker API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/contact', contactRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
