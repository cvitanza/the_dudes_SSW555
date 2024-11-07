// authController.test.js
import request from 'supertest';
import User from '../models/userModel.js';

// Import mock server directly from `MockServer.js`
import app from '../__mocks__/MockServer.js'
// Mock bcrypt, jwt, and User model to avoid database and hashing dependencies
jest.mock('bcryptjs', () => ({
    hash: jest.fn(() => 'hashed_password'),
    compare: jest.fn((plain, hashed) => plain === 'Password123')
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'fake_jwt_token'),
    verify: jest.fn(() => ({ id: 'user_id' }))
}));

jest.mock('../models/userModel.js', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn()
}));

describe('User Authentication', () => {
    describe('User Signup', () => {
        it('should successfully sign up a new user', async () => {
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({
                _id: 'user_id',
                firstName: 'Xavier',
                lastName: 'Carty',
                email: 'xavier.carty@example.com'
            });

            const res = await request(app).post('/signup').send({
                firstName: 'Xavier',
                lastName: 'Carty',
                email: 'xavier.carty@example.com',
                password: 'Password123'
            });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully.');
            expect(res.body).toHaveProperty('token', 'fake_jwt_token');
            expect(res.body.user).toHaveProperty('email', 'xavier.carty@example.com');
        });

        it('should return error if user already exists', async () => {
            User.findOne.mockResolvedValue({
                _id: 'existing_user_id',
                email: 'cory.vitanza@example.com'
            });

            const res = await request(app).post('/signup').send({
                firstName: 'Cory',
                lastName: 'Vitanza',
                email: 'cory.vitanza@example.com',
                password: 'Password123'
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already exists.');
        });
    });

    describe('User Login', () => {
        it('should successfully log in an existing user', async () => {
            User.findOne.mockResolvedValue({
                _id: 'user_id',
                email: 'gleb.mshkin@example.com',
                password: 'hashed_password'
            });

            const res = await request(app).post('/login').send({
                email: 'gleb.mshkin@example.com',
                password: 'Password123'
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token', 'fake_jwt_token');
        });

        it('should return error if credentials are invalid', async () => {
            User.findOne.mockResolvedValue({
                _id: 'user_id',
                email: 'gleb.mshkin@example.com',
                password: 'hashed_password'
            });

            const res = await request(app).post('/login').send({
                email: 'gleb.mshkin@example.com',
                password: 'WrongPassword'
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid credentials.');
        });

        it('should return error if user does not exist', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app).post('/login').send({
                email: 'lucas.hope@example.com',
                password: 'Password123'
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'User does not exist.');
        });
    });
});