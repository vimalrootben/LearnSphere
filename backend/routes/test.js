const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const LearningPath = require('../models/LearningPath');
const { generateMockTest } = require('../services/AIEngine');

function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required.' });
  jwt.verify(token, process.env.JWT_SECRET || 'learnsphere_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// POST /api/test/generate – Generate mock test MCQs
router.post('/generate', auth, async (req, res) => {
  try {
    const path = await LearningPath.findOne({ userId: req.user.userId });
    if (!path) return res.status(404).json({ error: 'No learning path found. Generate a path first.' });

    // Gather topic titles from incomplete topics
    const incompleteTopics = [];
    path.phases.forEach(phase =>
      phase.topics.forEach(t => { if (!t.completed) incompleteTopics.push(t.title); })
    );

    const testTopics = incompleteTopics.slice(0, 5).length > 0
      ? incompleteTopics.slice(0, 5)
      : path.phases[0]?.topics.map(t => t.title) || [];

    const questions = await generateMockTest(path.goal, '', testTopics);
    res.json({ questions });
  } catch (err) {
    console.error('Mock test error:', err);
    res.status(500).json({ error: 'Failed to generate test: ' + err.message });
  }
});

module.exports = router;
