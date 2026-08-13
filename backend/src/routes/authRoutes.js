const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Dedicated rate limiter for login to protect against brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login (with brute-force rate limiting)
router.post('/login', loginLimiter, loginUser);

// GET /api/auth/me - Authenticated user details
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      userId: req.user.userId,
      role: req.user.role
    }
  });
});

// Temporary RBAC test endpoint: CITIZEN only
router.get('/citizen-only', authMiddleware, allowRoles('CITIZEN'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome Citizen! You have access to this route.'
  });
});

// Temporary RBAC test endpoint: ADMIN only
router.get('/admin-only', authMiddleware, allowRoles('ADMIN'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome Admin! You have access to this route.'
  });
});

module.exports = router;
