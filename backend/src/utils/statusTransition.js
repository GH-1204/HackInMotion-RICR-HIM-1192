const ISSUE_STATUSES = Object.freeze({
  REPORTED: 'REPORTED',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
});

const ALL_STATUSES = Object.freeze(Object.values(ISSUE_STATUSES));

/**
 * Strict forward lifecycle map:
 * REPORTED -> ACKNOWLEDGED -> IN_PROGRESS -> RESOLVED -> CLOSED
 */
const VALID_TRANSITIONS = Object.freeze({
  [ISSUE_STATUSES.REPORTED]: Object.freeze([ISSUE_STATUSES.ACKNOWLEDGED]),
  [ISSUE_STATUSES.ACKNOWLEDGED]: Object.freeze([ISSUE_STATUSES.IN_PROGRESS]),
  [ISSUE_STATUSES.IN_PROGRESS]: Object.freeze([ISSUE_STATUSES.RESOLVED]),
  [ISSUE_STATUSES.RESOLVED]: Object.freeze([ISSUE_STATUSES.CLOSED]),
  [ISSUE_STATUSES.CLOSED]: Object.freeze([])
});

/**
 * Determines whether a requested status transition is valid.
 *
 * @param {string} currentStatus - Current issue status
 * @param {string} newStatus - Requested target status
 * @returns {boolean} True if the transition is allowed, false otherwise
 */
const isValidStatusTransition = (currentStatus, newStatus) => {
  if (
    typeof currentStatus !== 'string' ||
    typeof newStatus !== 'string' ||
    !currentStatus ||
    !newStatus
  ) {
    return false;
  }

  // Reject same status to same status
  if (currentStatus === newStatus) {
    return false;
  }

  // Reject unknown statuses
  if (!ALL_STATUSES.includes(currentStatus) || !ALL_STATUSES.includes(newStatus)) {
    return false;
  }

  const allowedNext = VALID_TRANSITIONS[currentStatus];
  if (!allowedNext || !Array.isArray(allowedNext)) {
    return false;
  }

  return allowedNext.includes(newStatus);
};

/**
 * Retrieves the list of valid next statuses for a given current status.
 *
 * @param {string} currentStatus - Current issue status
 * @returns {string[]} Array of allowed next status strings (empty array if none or invalid)
 */
const getNextAllowedStatuses = (currentStatus) => {
  if (typeof currentStatus !== 'string' || !ALL_STATUSES.includes(currentStatus)) {
    return [];
  }
  return VALID_TRANSITIONS[currentStatus] || [];
};

module.exports = {
  ISSUE_STATUSES,
  ALL_STATUSES,
  VALID_TRANSITIONS,
  isValidStatusTransition,
  getNextAllowedStatuses
};
