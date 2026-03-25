const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  description: String,
  resources: [{ label: String, url: String }],
  completed: { type: Boolean, default: false }
});

const phaseSchema = new mongoose.Schema({
  phaseName: String,
  duration: String,
  topics: [topicSchema]
});

const learningPathSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: String,
  certification: String,
  readinessScore: { type: Number, default: 0 },
  totalTopics: { type: Number, default: 0 },
  completedCount: { type: Number, default: 0 },
  phases: [phaseSchema],
  generatedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LearningPath', learningPathSchema);
