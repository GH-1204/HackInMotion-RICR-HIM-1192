const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const { createIssueSchema } = require('../utils/validators');

/**
 * Controller to report/create a new civic issue.
 * Runs after authMiddleware and roleMiddleware (CITIZEN).
 */
const createIssue = async (req, res) => {
  try {
    // 1. Validate request body using Zod schema
    const validationResult = createIssueSchema.safeParse(req.body);

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

    const { title, description, category, location } = validationResult.data;

    // 2. Create the Issue document
    // IMPORTANT: citizen is taken strictly from req.user.userId (from JWT)
    const newIssue = new Issue({
      title,
      description,
      category,
      location,
      citizen: req.user.userId
    });

    // 3. Save to MongoDB
    const savedIssue = await newIssue.save();

    // 4. Return successful response
    return res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      issue: savedIssue
    });
  } catch (error) {
    console.error('Error creating issue:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating issue'
    });
  }
};

/**
 * Controller to get all civic issues reported by the authenticated citizen.
 * Runs after authMiddleware and roleMiddleware (CITIZEN).
 */
const getMyIssues = async (req, res) => {
  try {
    // Query issues belonging strictly to the authenticated citizen, sorted by newest first
    const issues = await Issue.find({ citizen: req.user.userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error('Error fetching citizen issues:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching issues'
    });
  }
};

/**
 * Controller to get a single civic issue by ID for the authenticated citizen.
 * Runs after authMiddleware and roleMiddleware (CITIZEN).
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

    // 2. Query for the issue ensuring it strictly belongs to the authenticated citizen
    const issue = await Issue.findOne({
      _id: id,
      citizen: req.user.userId
    });

    // 3. If issue does not exist OR belongs to another citizen, return 404
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // 4. Return the issue details
    return res.status(200).json({
      success: true,
      issue
    });
  } catch (error) {
    console.error('Error fetching issue details:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching issue'
    });
  }
};

module.exports = {
  createIssue,
  getMyIssues,
  getIssueById
};
