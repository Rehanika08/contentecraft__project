import dns from 'dns';
// Force Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import historyRoutes from './routes/historyRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/;
app.use(express.json());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOriginRegex.test(origin) || origin === FRONTEND_URL) return callback(null, true);
  return callback(new Error('CORS policy: Origin not allowed'));
}, credentials: true }));
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
  res.send('ContentCraft AI API is running.');
});

// Database connection
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/contentcraft';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas / Cloud');
  } catch (error) {
    console.error('MongoDB Atlas Connection Error (falling back to local MongoDB):', error);
    try {
      await mongoose.connect('mongodb://localhost:27017/contentcraft');
      console.log('Connected to local MongoDB fallback');
    } catch (localErr) {
      console.error('Local MongoDB fallback error:', localErr);
    }
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

connectDB();
