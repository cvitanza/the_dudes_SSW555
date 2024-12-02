import mongoose from 'mongoose';

const foodItemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to a user
      required: true,
      ref: 'User',
    },
    label: {
      type: String,
      required: true, // Food name, e.g., "Pizza"
    },
    imageUrl: {
      type: String, // URL or path to the image
      required: true,
    },
    nutritionData: {
      calories: {
        value: { type: Number, required: true }, // Calorie count
        unit: { type: String, default: 'kcal' }, // Default unit for calories
      },
      protein: {
        value: { type: Number, required: true }, // Protein amount
        unit: { type: String, default: 'g' }, // Default unit for protein
      },
      carbohydrates: {
        value: { type: Number, required: true }, // Carbohydrate amount
        unit: { type: String, default: 'g' }, // Default unit for carbohydrates
      },
      fat: {
        value: { type: Number, required: true }, // Fat amount
        unit: { type: String, default: 'g' }, // Default unit for fat
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;