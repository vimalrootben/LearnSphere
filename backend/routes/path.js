const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LearningPath = require('../models/LearningPath');
const { generateLearningPath } = require('../services/AIEngine');

// Middleware
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required.' });
  jwt.verify(token, process.env.JWT_SECRET || 'learnsphere_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// POST /api/path/generate  – Generate AI learning path
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const aiData = await generateLearningPath(
      user.currentSkills.join(', '),
      user.learningGoal,
      user.targetCertification,
      user.experienceLevel
    );

    // Count total topics
    const totalTopics = aiData.phases.reduce((sum, p) => sum + p.topics.length, 0);

    // Delete old path if exists
    await LearningPath.deleteOne({ userId: user._id });

    const path = new LearningPath({
      userId: user._id,
      goal: user.learningGoal,
      certification: user.targetCertification,
      readinessScore: aiData.readinessScore,
      totalTopics,
      completedCount: 0,
      phases: aiData.phases
    });
    await path.save();

    // Write back readiness to user
    user.readinessScore = aiData.readinessScore;
    user.completedTopics = [];
    await user.save();

    res.json({ path, skillGapSummary: aiData.skillGapSummary });
  } catch (err) {
    console.error('Generate path error:', err);
    res.status(500).json({ error: 'AI path generation failed: ' + err.message });
  }
});

// GET /api/path/me – Fetch existing path
router.get('/me', auth, async (req, res) => {
  try {
    const path = await LearningPath.findOne({ userId: req.user.userId });
    if (!path) return res.status(404).json({ error: 'No learning path found. Please generate one.' });
    res.json({ path });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch path.' });
  }
});

// POST /api/path/complete-topic – Mark a topic as complete
router.post('/complete-topic', auth, async (req, res) => {
  try {
    const { phaseIndex, topicIndex } = req.body;
    const path = await LearningPath.findOne({ userId: req.user.userId });
    if (!path) return res.status(404).json({ error: 'No learning path found.' });

    path.phases[phaseIndex].topics[topicIndex].completed = true;

    // Recalculate completed count and readiness score
    let completedCount = 0;
    path.phases.forEach(phase => phase.topics.forEach(t => { if (t.completed) completedCount++; }));
    path.completedCount = completedCount;

    const newReadiness = Math.min(100, Math.round((completedCount / path.totalTopics) * 100));
    // Blend AI initial score with progress
    const initialScore = path.readinessScore;
    path.readinessScore = Math.max(initialScore, newReadiness + initialScore * (1 - newReadiness / 100));
    path.readinessScore = Math.min(100, Math.round(path.readinessScore));
    path.updatedAt = new Date();

    await path.save();

    // Sync user readiness score
    await User.findByIdAndUpdate(req.user.userId, { readinessScore: path.readinessScore });

    res.json({ path, newReadiness: path.readinessScore });
  } catch (err) {
    console.error('Complete topic error:', err);
    res.status(500).json({ error: 'Failed to update progress.' });
  }
});

module.exports = router;
