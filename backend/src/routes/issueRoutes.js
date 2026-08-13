const express = require('express');
const router = express.Router();

const {
  createIssue,
  getMyIssues,
  getIssueById
} = require('../controllers/issueController');
const authMiddleware = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// POST /api/issues - Report a new civic issue (CITIZEN only)
router.post(
  '/',
  authMiddleware,
  allowRoles('CITIZEN'),
  createIssue
);

// GET /api/issues/my - Get all issues reported by the authenticated citizen
router.get(
  '/my',
  authMiddleware,
  allowRoles('CITIZEN'),
  getMyIssues
);

// GET /api/issues/:id - Get single issue details by ID (CITIZEN only, owner only)
router.get(
  '/:id',
  authMiddleware,
  allowRoles('CITIZEN'),
  getIssueById
);

module.exports = router;
