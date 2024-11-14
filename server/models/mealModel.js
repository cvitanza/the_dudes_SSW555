import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    nutritionData: {
        calories: {
            value: Number,
            unit: String
        },
        protein: {
            value: Number,
            unit: String
        },
        carbohydrates: {
            value: Number,
            unit: String
        },
        fat: {
            value: Number,
            unit: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Meal = mongoose.model('Meal', mealSchema);

export default Meal; 