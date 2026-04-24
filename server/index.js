// Load .env from the server directory regardless of where Node is invoked from
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const goalRoutes = require('./routes/goals');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ── Database Connection — serverless-safe ────────────────────────────────────
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // already connected

  if (mongoose.connection.readyState === 2) {
    // already connecting — wait for it
    await new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    });
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in Environment Variables');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 20000,
    connectTimeoutMS: 20000,
    socketTimeoutMS: 45000,
    maxPoolSize: 1,
  });
};

// ── DB middleware MUST come BEFORE routes ────────────────────────────────────
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    return res.status(500).json({
      error: 'Database connection failed',
      details: err.message,
      hint: 'Check MONGODB_URI in Vercel Environment Variables and Atlas Network Access (allow 0.0.0.0/0)'
    });
  }
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', connected: mongoose.connection.readyState === 1 });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch(err => console.error('Failed to start server:', err.message));
}

// Export for Vercel Serverless
module.exports = app;
