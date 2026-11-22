
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. Token is missing.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');

      return res.status(500).json({
        message: 'Internal server error'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ['HS256']
      }
    );

    req.user = decoded;

    next();

  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }

    console.error('Authentication error:', error);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};
