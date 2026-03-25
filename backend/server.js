require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const pathRoutes = require('./routes/path');
const testRoutes = require('./routes/test');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnsphere')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/path', pathRoutes);
app.use('/api/test', testRoutes);

app.get('/', (req, res) => res.json({ message: '🚀 LEARNSPHERE API is running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Server running on http://localhost:${PORT}`));
