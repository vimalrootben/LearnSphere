const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },

  // Onboarding
  name: { type: String, default: '' },
  currentSkills: [{ type: String }],        // e.g. ['Python', 'HTML']
  learningGoal: { type: String, default: '' }, // e.g. 'Full Stack Developer'
  targetCertification: { type: String, default: '' }, // e.g. 'AWS Cloud Practitioner'
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  onboardingComplete: { type: Boolean, default: false },

  // Progress
  completedTopics: [{ type: String }],
  readinessScore: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
