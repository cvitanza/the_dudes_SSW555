import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User SignUp
export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Hashed Password (during signup):", hashedPassword);

        // Save the user with the hashed password
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();
        console.log("User saved in DB:", newUser);

        // Verify what is saved in DB after saving
        const savedUser = await User.findOne({ email });
        console.log("Retrieved user after save (for verification):", savedUser);

        // Generate JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.status(201).json({
            message: "User registered successfully.",
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ message: "Error occurred." });
    }
};

// User Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }

        // Use bcrypt.compare to compare plain text password with hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Is Password Valid?", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.status(200).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
        console.log("Login success");
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Error occurred." });
    }
};