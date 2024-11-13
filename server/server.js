import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors';
import './models/imageModel.js';

dotenv.config();

// Initialize express
const app = express();
app.use(express.json()); // Body parser for JSON requests

// Connect to MongoDB
connectDB();

app.use(cors());

// User routes
// app.use('/api/users', userRoutes);
// Auth routes
app.use('/api/auth', authRoutes);
// Upload routes
app.use('/api/upload', uploadRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});