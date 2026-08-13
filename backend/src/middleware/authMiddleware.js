const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  // 2. & 3. If Authorization header is missing or doesn't contain a Bearer token, return 401
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No valid token provided' });
  }

  // 4. Extract the JWT token
  const token = authHeader.split(' ')[1];

  // 5. Ensure JWT_SECRET exists
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('Configuration Error: JWT_SECRET is not configured on the server.');
    return res.status(500).json({ message: 'Authentication configuration error' });
  }

  try {
    // 6. Verify the token with explicit HS256 algorithm enforcement
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });

    // 7. Attach the decoded payload (userId, role) to req.user
    req.user = decoded;

    // 8. Call next() so the request continues to the protected controller
    next();
  } catch (error) {
    // Return safe unauthorized response without exposing internal errors
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = authMiddleware;
