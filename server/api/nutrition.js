import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

// Nutritionix API credentials
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;
const NUTRITIONIX_API_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

// List of 20 common foods/meals
const COMMON_FOODS = [
    "chicken and rice",
    "turkey sandwich",
    "caesar salad",
    "spaghetti and meatballs",
    "hamburger and fries",
    "grilled chicken salad",
    "tuna sandwich",
    "pizza slice",
    "steak and potatoes",
    "fish and vegetables",
    "burrito bowl",
    "vegetable stir fry",
    "peanut butter sandwich",
    "greek salad with chicken",
    "turkey wrap",
    "pasta with marinara sauce",
    "grilled salmon",
    "chicken curry with rice",
    "club sandwich",
    "mixed vegetables with quinoa"
];

// Simulate food detection by randomly selecting a common food
const getFoodsFromImage = async () => {
    try {
        // Randomly select a food from the list
        const randomFood = COMMON_FOODS[Math.floor(Math.random() * COMMON_FOODS.length)];
        
        return {
            food_name: randomFood,
            confidence: 1
        };
    } catch (error) {
        console.error('Error in food detection:', error);
        return {
            food_name: "mixed meal",
            confidence: 1
        };
    }
};

// Get nutrition facts from Nutritionix API
const getNutritionFacts = async (foodName) => {
    try {
        const response = await axios.post(
            NUTRITIONIX_API_URL,
            { query: foodName },
            {
                headers: {
                    'x-app-id': NUTRITIONIX_APP_ID,
                    'x-app-key': NUTRITIONIX_API_KEY,
                    'Content-Type': 'application/json',
                }
            }
        );

        const food = response.data.foods[0];
        return {
            calories: food.nf_calories,
            protein: food.nf_protein,
            carbs: food.nf_total_carbohydrate,
            fat: food.nf_total_fat
        };
    } catch (error) {
        console.error('Error getting nutrition facts:', error);
        // Return default values if there's an error
        return {
            calories: 500,
            protein: 20,
            carbs: 50,
            fat: 25
        };
    }
};

// Combined function to process image and get nutrition facts
const processImageAndGetNutrition = async (imageBuffer) => {
    try {
        // Get random food selection
        const detectedFood = await getFoodsFromImage();
        console.log('Selected food:', detectedFood);

        // Get nutrition facts using Nutritionix
        const nutritionFacts = await getNutritionFacts(detectedFood.food_name);
        console.log('Nutrition facts:', nutritionFacts);

        return {
            food_name: detectedFood.food_name,
            confidence: detectedFood.confidence,
            nutrition: nutritionFacts
        };
    } catch (error) {
        console.error('Error processing image and getting nutrition:', error);
        // Return default values if there's an error
        return {
            food_name: "mixed meal",
            confidence: 1,
            nutrition: {
                calories: 500,
                protein: 20,
                carbs: 50,
                fat: 25
            }
        };
    }
};

export { getFoodsFromImage, getNutritionFacts, processImageAndGetNutrition };
