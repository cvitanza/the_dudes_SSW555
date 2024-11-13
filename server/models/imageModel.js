// server/models/imageModel.js
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  nutritionData: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const Image = mongoose.model('Image', imageSchema);
export default Image;