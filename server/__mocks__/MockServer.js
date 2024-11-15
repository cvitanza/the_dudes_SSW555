// server/App.js
import express from 'express';

const app = express();
app.use(express.json());

console.log("Using mock App.js from server directory");

app.post('/signup', (req, res) => {
    const { email } = req.body;
    if (email === 'cory.vitanza@example.com') {
        return res.status(400).json({ message: 'User already exists.' });
    }
    return res.status(201).json({
        message: 'User registered successfully.',
        token: 'fake_jwt_token',
        user: {
            id: 'user_id',
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'gleb.mshkin@example.com' && password === 'Password123') {
        return res.status(200).json({
            token: 'fake_jwt_token',
            user: { id: 'user_id', email }
        });
    } else if (email === 'gleb.mshkin@example.com') {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }
    return res.status(400).json({ message: 'User does not exist.' });
});

export default app;