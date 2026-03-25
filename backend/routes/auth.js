const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTP } = require('../services/AuthService');

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTP(email, otp);

    res.json({ message: 'OTP sent successfully.', isNewUser: !user.onboardingComplete });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: 'Failed to send OTP. Check server config.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (!user.otp || user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP.' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(401).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Clear OTP immediately after successful verification
    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'learnsphere_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      isNewUser: !user.onboardingComplete,
      user: {
        email: user.email,
        name: user.name,
        onboardingComplete: user.onboardingComplete
      }
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Server error during verification.' });
  }
});

// POST /api/auth/onboarding
router.post('/onboarding', authenticateToken, async (req, res) => {
  try {
    const { name, currentSkills, learningGoal, targetCertification, experienceLevel } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.name = name;
    user.currentSkills = currentSkills;
    user.learningGoal = learningGoal;
    user.targetCertification = targetCertification;
    user.experienceLevel = experienceLevel;
    user.onboardingComplete = true;
    await user.save();

    res.json({ message: 'Profile saved!', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-otp -otpExpiry');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required.' });

  jwt.verify(token, process.env.JWT_SECRET || 'learnsphere_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

module.exports = router;
