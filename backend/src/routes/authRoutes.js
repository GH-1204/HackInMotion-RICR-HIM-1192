const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Define the registration route
// This handles POST requests to /api/auth/register (the /api/auth part is defined in server.js)
router.post('/register', registerUser);

// Define the login route
router.post('/login', loginUser);

// Temporary test endpoint for JWT middleware
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      userId: req.user.userId,
      role: req.user.role
    }
  });
});

module.exports = router;
