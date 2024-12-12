import mongoose from 'mongoose';

const foodItemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    label: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    nutritionData: {
      calories: {
        value: { type: Number, required: true },
        unit: { type: String, default: 'kcal' },
      },
      protein: {
        value: { type: Number, required: true },
        unit: { type: String, default: 'g' },
      },
      carbohydrates: {
        value: { type: Number, required: true },
        unit: { type: String, default: 'g' },
      },
      fat: {
        value: { type: Number, required: true },
        unit: { type: String, default: 'g' },
      },
    },
    ingredients: {
      type: [String],
      required: true,
    },
    cuisineType: {
      type: String,
      required: true,
    },
    mealType: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    healthLabels: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;