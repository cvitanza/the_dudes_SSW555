import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import Meal from "../models/mealModel.js";
import FoodItem from "../models/favoritesModel.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Save meal with image and nutrition data
router.post("/save", protect, upload.single("image"), async (req, res) => {
  try {
    console.log("Save endpoint hit");
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided",
      });
    }

    const { nutritionData } = req.body;

    if (!nutritionData) {
      return res.status(400).json({
        success: false,
        error: "No nutrition data provided",
      });
    }

    const parsedNutritionData =
      typeof nutritionData === "string"
        ? JSON.parse(nutritionData)
        : nutritionData;
    const firstNutritionData = parsedNutritionData[0];

    // Format the data to include only the relevant fields
    const reformattedData = {
        calories: {
          value: parseFloat(firstNutritionData.nutrients.ENERC_KCAL),
          unit: 'kcal',
        },
        protein: {
          value: parseFloat(firstNutritionData.nutrients.PROCNT),
          unit: 'g',
        },
        carbohydrates: {
          value: parseFloat(firstNutritionData.nutrients.CHOCDF),
          unit: 'g',
        },
        fat: {
          value: parseFloat(firstNutritionData.nutrients.FAT),
          unit: 'g',
        },
      };

    const imageUrl = `/uploads/${req.file.filename}`;

    const newMeal = new Meal({
      user: req.user._id,
      imageUrl,
      nutritionData: reformattedData,
    });

    const savedMeal = await newMeal.save();

    res.json({
      success: true,
      meal: savedMeal,
    });
  } catch (error) {
    console.error("Error saving meal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save meal",
      details: error.message,
    });
  }
});

// Get latest meal
router.get("/latest", protect, async (req, res) => {
  try {
    const latestMeal = await Meal.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!latestMeal) {
      return res.status(404).json({
        success: false,
        message: "No meals found",
      });
    }

    res.json({
      success: true,
      meal: latestMeal,
    });
  } catch (error) {
    console.error("Error fetching latest meal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch latest meal",
    });
  }
});

router.post("/get-nutrition", async (req, res) => {
  const { foodItem } = req.body;

  // Validate input
  if (!foodItem) {
    return res.status(400).json({ error: "Food item is required." });
  }

  try {
    // Call the Edamam Food Database API
    const response = await axios.get(
      "https://api.edamam.com/api/food-database/v2/parser",
      {
        params: {
          ingr: foodItem,
          app_id: process.env.EDAMAM_APP_ID,
          app_key: process.env.EDAMAM_APP_KEY,
        },
      }
    );

    // Extract relevant food results
    const foodResults = response.data.hints.map((hint) => ({
      label: hint.food.label,
      nutrients: hint.food.nutrients,
    }));

    console.log(foodResults);
    // Respond with processed food results
    res.json({ success: true, foodResults });
  } catch (error) {
    console.error(
      "Error fetching food data:",
      error.response?.data || error.message
    );

    // Handle specific errors
    if (error.response?.status === 401) {
      res
        .status(401)
        .json({ error: "Unauthorized. Check your Edamam API credentials." });
    } else if (error.response?.status === 400) {
      res
        .status(400)
        .json({ error: "Bad request. Ensure your input is valid." });
    } else {
      res
        .status(500)
        .json({ error: "Failed to fetch food data. Try again later." });
    }
  }
});

router.post('/favorites', protect, async (req, res) => {
  try {
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

export default router;
