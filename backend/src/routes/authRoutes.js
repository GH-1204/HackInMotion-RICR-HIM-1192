const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

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
