// server/routes/nutritionRoutes.js
import express from 'express';
import multer from 'multer';
import protect from '../middleware/authMiddleware.js';
import Meal from '../models/mealModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Save meal with image and nutrition data
router.post('/save', protect, upload.single('image'), async (req, res) => {
    try {
        console.log('Save endpoint hit');
        console.log('Request body:', req.body);
        console.log('File:', req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        const { nutritionData } = req.body;
        
        if (!nutritionData) {
            return res.status(400).json({
                success: false,
                error: 'No nutrition data provided'
            });
        }

        // Parse nutrition data if it's a string
        const parsedNutritionData = typeof nutritionData === 'string' 
            ? JSON.parse(nutritionData) 
            : nutritionData;

        // Create image URL
        const imageUrl = `/uploads/${req.file.filename}`;

        console.log('Creating new meal with:', {
            user: req.user._id,
            imageUrl,
            nutritionData: parsedNutritionData
        });

        const newMeal = new Meal({
            user: req.user._id,
            imageUrl,
            nutritionData: parsedNutritionData
        });

        const savedMeal = await newMeal.save();
        console.log('Meal saved successfully:', savedMeal);

        res.json({
            success: true,
            meal: savedMeal
        });
    } catch (error) {
        console.error('Error saving meal:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save meal',
            details: error.message
        });
    }
});

// Get latest meal
router.get('/latest', protect, async (req, res) => {
    try {
        const latestMeal = await Meal.findOne({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(1);

        if (!latestMeal) {
            return res.status(404).json({
                success: false,
                message: 'No meals found'
            });
        }

        res.json({
            success: true,
            meal: latestMeal
        });
    } catch (error) {
        console.error('Error fetching latest meal:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch latest meal'
        });
    }
});

export default router;
