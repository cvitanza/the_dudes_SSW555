import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// Initialize express
const app = express();
app.use(express.json()); // Body parser for JSON requests

// Connect to MongoDB
connectDB();

// User routes
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});