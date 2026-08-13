const express = require('express');
const router = express.Router();

const { getAllIssues } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// GET /api/admin/issues - Retrieve all civic issues (ADMIN only)
router.get(
  '/issues',
  authMiddleware,
  allowRoles('ADMIN'),
  getAllIssues
);

module.exports = router;
