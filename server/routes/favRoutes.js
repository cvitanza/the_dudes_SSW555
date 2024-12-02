import express from 'express';
import FoodItem from '../models/favoritesModel.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
    try {
      const favorites = await FoodItem.find({ user: req.user._id }); // Fetch items for the logged-in user
  
      if (!favorites || favorites.length === 0) {
        return res.status(404).json({ success: false, message: 'No favorites found.' });
      }
  
      res.status(200).json({ success: true, data: favorites });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch favorites.' });
    }
});

export default router