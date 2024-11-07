import express from 'express';
import Recipe from '../models/recipeModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

export default router;