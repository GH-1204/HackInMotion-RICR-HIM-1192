/**
 * Middleware to restrict access based on user roles.
 * Must be used AFTER authMiddleware so req.user is populated.
 * 
 * @param  {...string} allowedRoles - List of roles that are allowed to access the route
 */
const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. If req.user is missing or does not have a role, reject safely.
    // (This usually means authMiddleware was forgotten or the token payload is bad)
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        message: 'Forbidden: Access denied. User role information is missing.' 
      });
    }

    // 2. Check if the user's role is in the allowedRoles array.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden: Insufficient permissions to access this resource.' 
      });
    }

    // 3. If everything is fine, proceed to the next middleware or controller
    next();
  };
};

module.exports = {
  allowRoles
};
