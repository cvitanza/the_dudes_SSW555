import express from 'express';
import axios from 'axios';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/search', authenticateToken, async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const appId = process.env.EDAMAM_APP_ID;
        const appKey = process.env.EDAMAM_APP_KEY;

        const response = await axios.get(
            `https://api.edamam.com/api/recipes/v2?type=public&q=${searchTerm}&app_id=${appId}&app_key=${appKey}`
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

export default router; 