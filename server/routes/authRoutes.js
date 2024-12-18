import express from 'express';
import { signup, login, deleteAccountHandler } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import Blacklist from '../models/blacklistModel.js';
import { validateLogin } from '../middleware/validateLogin.js';
import  authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router();

// POST request for signup
router.post('/signup', signup);
router.post('/login', validateLogin, login);
router.delete('/delete', authenticateToken, deleteAccountHandler);

// Get user profile (protected route)
router.get('/profile', protect, (req, res) => {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
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