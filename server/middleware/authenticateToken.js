import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the header

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded payload (user data) to req.user
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

export default authenticateToken;