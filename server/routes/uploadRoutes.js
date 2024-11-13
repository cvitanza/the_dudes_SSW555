// server/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Image from '../models/imageModel.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();

// Define file filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'), false); // Reject the file
  }
};

const upload = multer({ 
  storage,
  fileFilter // Use the file filter
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    // Configure cloudinary if not already configured
    if (!cloudinary.config().cloud_name) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }

    const fileStr = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    
    // Add console.log statements to debug
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    console.log('Cloudinary response:', uploadResponse);

    // Create new image document
    const newImage = new Image({
      userId: req.user._id,
      cloudinaryUrl: uploadResponse.secure_url,
      nutritionData: {
        calories: req.body.calories || 0,
        protein: req.body.protein || 0,
        carbohydrates: req.body.carbohydrates || 0,
        fat: req.body.fat || 0
      }
    });

    await newImage.save();
    console.log('Saved image:', newImage);

    res.json({ 
      url: uploadResponse.secure_url,
      imageId: newImage._id
    });
  } catch (error) {
    console.error('Detailed upload error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get user's upload history
router.get('/history', protect, async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user._id })
      .sort({ uploadDate: -1 }); // Most recent first
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image history' });
  }
});

// Add this route after the existing POST route
router.get('/latest', protect, async (req, res) => {
  try {
    const latestImage = await Image.findOne({ userId: req.user._id })
      .sort({ uploadDate: -1 }) // Sort by upload date descending
      .limit(1);

    if (!latestImage) {
      return res.status(404).json({ message: 'No meals found' });
    }

    res.json({
      imageUrl: latestImage.cloudinaryUrl,
      nutritionInfo: {
        calories: latestImage.nutritionData.calories,
        protein: latestImage.nutritionData.protein,
        carbs: latestImage.nutritionData.carbohydrates,
        fat: latestImage.nutritionData.fat
      },
      uploadDate: latestImage.uploadDate
    });
  } catch (error) {
    console.error('Error fetching latest meal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;