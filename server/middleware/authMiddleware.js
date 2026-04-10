import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'JWT_SECRET is not configured' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
