const express = require('express');
const router = express.Router();

const {
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  resolveIssue
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// GET /api/admin/issues - Retrieve all civic issues (ADMIN only)
router.get(
  '/issues',
  authMiddleware,
  allowRoles('ADMIN'),
  getAllIssues
);

// GET /api/admin/issues/:id - Retrieve single civic issue details (ADMIN only)
router.get(
  '/issues/:id',
  authMiddleware,
  allowRoles('ADMIN'),
  getIssueById
);

// PATCH /api/admin/issues/:id/status - Update civic issue status (ADMIN only)
router.patch(
  '/issues/:id/status',
  authMiddleware,
  allowRoles('ADMIN'),
  updateIssueStatus
);

// PATCH /api/admin/issues/:id/resolve - Provide resolution details and resolve issue (ADMIN only)
router.patch(
  '/issues/:id/resolve',
  authMiddleware,
  allowRoles('ADMIN'),
  resolveIssue
);

module.exports = router;


