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

router.post('/', protect, async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the incoming request body
        const { label, imageUrl, nutritionData, ingredients, cuisineType, mealType, url, healthLabels } = req.body;

        if (!label || !imageUrl || !nutritionData || !ingredients || !cuisineType || !mealType || !url) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        const newFoodItem = new FoodItem({
            user: req.user._id,
            label,
            imageUrl,
            nutritionData,
            ingredients,
            cuisineType,
            mealType,
            url,
            healthLabels,
        });

        const savedFoodItem = await newFoodItem.save();
        res.status(201).json({ success: true, data: savedFoodItem });
    } catch (error) {
        console.error('Error saving food item:', error);
        res.status(500).json({ success: false, message: 'Failed to save food item.' });
    }
});

export default router