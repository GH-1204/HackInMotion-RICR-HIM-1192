const Department = require('../models/Department');

/**
 * Service to automatically route and resolve the active department for an issue category.
 *
 * Mapping:
 * ROADS           -> Active Department with category ROADS
 * SANITATION      -> Active Department with category SANITATION
 * ELECTRICITY     -> Active Department with category ELECTRICITY
 * WATER           -> Active Department with category WATER
 * PUBLIC_PROPERTY -> Active Department with category PUBLIC_PROPERTY
 * DRAINAGE        -> Active Department with category DRAINAGE
 * OTHER           -> Active Department with category OTHER
 *
 * @param {string} category - Issue category
 * @returns {Promise<import('../models/Department')|null>} The active Department document or null
 */
const getDepartmentByCategory = async (category) => {
  if (!category || typeof category !== 'string') {
    return null;
  }

  const normalizedCategory = category.trim().toUpperCase();

  const department = await Department.findOne({
    category: normalizedCategory,
    isActive: true
  });

  return department;
};

module.exports = {
  getDepartmentByCategory
};
