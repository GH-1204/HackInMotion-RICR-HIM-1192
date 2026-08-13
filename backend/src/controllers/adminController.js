const Issue = require('../models/Issue');

/**
 * Controller for administrators to get all civic issues across the system.
 * Protected by authMiddleware and allowRoles('ADMIN').
 * Read-only endpoint sorted newest first.
 */
const getAllIssues = async (req, res) => {
  try {
    // Retrieve all issues sorted newest first (createdAt descending)
    // Populate safe fields from citizen and department (excluding passwords/hashes)
    const issues = await Issue.find({})
      .sort({ createdAt: -1 })
      .populate('citizen', 'name email')
      .populate('department', 'name code category');

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error('Error fetching admin issues:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving issues'
    });
  }
};

module.exports = {
  getAllIssues
};
