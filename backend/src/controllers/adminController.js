const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const StatusHistory = require('../models/StatusHistory');
const { updateStatusSchema, resolveIssueSchema } = require('../utils/validators');
const { isValidStatusTransition } = require('../utils/statusTransition');

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

/**
 * Controller for administrators to get single civic issue details by ID.
 * Protected by authMiddleware and allowRoles('ADMIN').
 */
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate if the parameter is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID format'
      });
    }

    // 2. Query for the issue and populate citizen and department references
    const issue = await Issue.findById(id)
      .populate('citizen', '_id name email')
      .populate('department', '_id name code category');

    // 3. Return 404 if issue does not exist
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // 4. Query status history records for audit trail
    const history = await StatusHistory.find({ issue: id })
      .sort({ createdAt: -1 })
      .populate('changedBy', 'name email role');

    // 5. Return the complete issue details and history
    return res.status(200).json({
      success: true,
      issue,
      history
    });

  } catch (error) {
    console.error('Error fetching admin issue details:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving issue details'
    });
  }
};

/**
 * Controller for administrators to update an issue's status.
 * Protected by authMiddleware and allowRoles('ADMIN').
 * Validates issue ID, request body, and state transition rules.
 * Creates an immutable StatusHistory record on successful transition.
 */
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID format'
      });
    }

    // 2. Validate request body against schema
    const validationResult = updateStatusSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const { status: newStatus, note } = validationResult.data;

    // 3. Find the Issue
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // 4. Validate transition using the Status Transition Engine
    if (!isValidStatusTransition(issue.status, newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${issue.status} to ${newStatus}`
      });
    }

    const previousStatus = issue.status;

    // 5. Update Issue status
    issue.status = newStatus;
    const updatedIssue = await issue.save();

    // 6. Create StatusHistory record with rollback safeguard on failure
    try {
      await StatusHistory.create({
        issue: issue._id,
        previousStatus,
        newStatus,
        changedBy: req.user.userId,
        note: note || undefined
      });
    } catch (historyError) {
      // Revert issue status if history creation fails to maintain data consistency
      issue.status = previousStatus;
      await issue.save();
      throw historyError;
    }

    // 7. Return response with updated issue
    return res.status(200).json({
      success: true,
      message: 'Issue status updated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    console.error('Error updating issue status:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating issue status'
    });
  }
};

/**
 * Controller for administrators to resolve an issue.
 * Protected by authMiddleware and allowRoles('ADMIN').
 * Validates issue ID, resolution notes, and ensures current status is IN_PROGRESS.
 * Transitions status to RESOLVED, saves resolution details (notes, resolvedAt),
 * and creates a StatusHistory record.
 */
const resolveIssue = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID format'
      });
    }

    // 2. Validate request body against resolveIssueSchema
    const validationResult = resolveIssueSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const { notes } = validationResult.data;

    // 3. Find the Issue
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // 4. Validate transition using the Status Transition Engine (current -> RESOLVED)
    // Issue must currently be IN_PROGRESS
    if (!isValidStatusTransition(issue.status, 'RESOLVED')) {
      return res.status(400).json({
        success: false,
        message: `Cannot resolve issue: invalid transition from ${issue.status} to RESOLVED. Issue must be IN_PROGRESS.`
      });
    }

    const previousStatus = issue.status;
    const previousResolution = issue.resolution ? issue.resolution.toObject?.() || { ...issue.resolution } : undefined;

    // 5. Update Issue status and resolution details
    issue.status = 'RESOLVED';
    issue.resolution = {
      notes,
      resolvedAt: new Date()
    };
    const updatedIssue = await issue.save();

    // 6. Create StatusHistory record with rollback safeguard on failure
    try {
      await StatusHistory.create({
        issue: issue._id,
        previousStatus,
        newStatus: 'RESOLVED',
        changedBy: req.user.userId,
        note: notes
      });
    } catch (historyError) {
      // Revert issue state if history creation fails to maintain data consistency
      issue.status = previousStatus;
      issue.resolution = previousResolution;
      await issue.save();
      throw historyError;
    }

    // 7. Return response with updated issue
    return res.status(200).json({
      success: true,
      message: 'Issue resolved successfully',
      issue: updatedIssue
    });
  } catch (error) {
    console.error('Error resolving issue:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while resolving issue'
    });
  }
};

module.exports = {
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  resolveIssue
};



