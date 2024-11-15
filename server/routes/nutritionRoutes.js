import express from 'express';
import multer from 'multer';
import axios from 'axios';
import protect from '../middleware/authMiddleware.js';
import { processImageAndGetNutrition, getNutritionFacts } from '../api/nutrition.js';

const router = express.Router();
const upload = multer();

// Route for food detection using FatSecret image recognition
router.post('/detect', protect, upload.single('image'), async (req, res) => {
    console.log('Detect endpoint hit');
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image provided' });
        }

        const result = await processImageAndGetNutrition(req.file.buffer);

        res.json({
            success: true,
            foods: [{
                food_name: result.food_name,
                confidence: result.confidence,
                calories: result.nutrition.calories,
                protein: result.nutrition.protein,
                carbs: result.nutrition.carbs,
                fat: result.nutrition.fat
            }]
        });
    } catch (error) {
        console.error('Error detecting foods:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to detect foods',
            details: error.message
        });
    }
});

// Route for nutrition facts using Nutritionix API
router.post('/facts', protect, async (req, res) => {
    console.log('Facts endpoint hit');
    try {
        const { query } = req.body;
        console.log('Query received:', query);
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'No food query provided'
            });
        }

        const nutritionFacts = await getNutritionFacts(query);
        
        res.json({
            success: true,
            calories: nutritionFacts.calories,
            protein: nutritionFacts.protein,
            carbs: nutritionFacts.carbs,
            fat: nutritionFacts.fat
        });
    } catch (error) {
        console.error('Error getting nutrition facts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get nutrition facts'
        });
    }
});

// Route for FatSecret API search
router.post('/search', protect, async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'No food query provided'
            });
        }

        // FatSecret API request
        const response = await axios.post(
            'https://platform.fatsecret.com/rest/server.api',
            null,
            {
                params: {
                    method: 'foods.search',
                    search_expression: query,
                    format: 'json',
                    max_results: 5
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FATSECRET_ACCESS_TOKEN}`
                }
            }
        );

        res.json({
            success: true,
            foods: response.data.foods.food
        });
    } catch (error) {
        console.error('Error searching foods:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search foods'
        });
    }
});

export default router;



