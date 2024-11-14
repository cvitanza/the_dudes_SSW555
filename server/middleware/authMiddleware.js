import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error('Auth Error:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expired',
                    isExpired: true
                });
            }
            res.status(401).json({
                success: false,
                error: 'Not authorized'
            });
        }
    } else {
        res.status(401).json({
            success: false,
            error: 'Not authorized, no token'
        });
    }
};

export default protect;