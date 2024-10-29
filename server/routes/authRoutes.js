import express from 'express';
import { signup, login } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import Blacklist from '../models/blacklistModel.js';

const router = express.Router();

// POST request for signup
router.post('/signup', signup);
router.post('/login', login);
// Get user profile (protected route)
router.get('/profile', protect, (req, res) => {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      message: 'This is your profile page ',
    });
  });

router.post('/signout', protect, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    // Add the token to the blacklist
    const blacklistedToken = new Blacklist({
      token,
      expiresAt: new Date(Date.now() + 3600000), // Match the token's expiration time
    });

    await blacklistedToken.save();

    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during signout' });
  }
});
  

export default router;