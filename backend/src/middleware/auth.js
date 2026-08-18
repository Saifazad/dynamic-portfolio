const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    return next();
  } catch (err) {
    // Fallback to check static API_AUTH_TOKEN
    const staticToken = process.env.API_AUTH_TOKEN || 'dev-token-12345';
    if (token === staticToken) {
      return next();
    }

    const message = err.name === 'TokenExpiredError'
      ? 'Unauthorized: Token has expired. Please log in again.'
      : 'Unauthorized: Invalid authentication token';
    return res.status(401).json({ error: message });
  }
};

module.exports = requireAuth;
