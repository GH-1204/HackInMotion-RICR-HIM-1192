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

  try {
    // 5. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 7. & 8. If valid, attach the decoded payload to req.user
    req.user = decoded;

    // 9. Call next() so the request continues to the protected controller
    next();
  } catch (error) {
    // 6. If token is invalid or expired
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = authMiddleware;
