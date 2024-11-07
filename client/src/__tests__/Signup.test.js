import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../components/Signup';
import axios from 'axios';

jest.mock('axios');

describe('Signup Component', () => {
    const mockSetIsAuthenticated = jest.fn();

    beforeEach(() => {
        render(
            <MemoryRouter>
                <Signup setIsAuthenticated={mockSetIsAuthenticated} />
            </MemoryRouter>
        );
    });

    test('renders the Signup component with input fields and button', () => {
        expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    test('updates input fields when user types', () => {
        const firstNameInput = screen.getByPlaceholderText(/First Name/i);
        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        expect(firstNameInput.value).toBe('John');

        const lastNameInput = screen.getByPlaceholderText(/Last Name/i);
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
        expect(lastNameInput.value).toBe('Doe');

        const emailInput = screen.getByPlaceholderText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
        expect(emailInput.value).toBe('john.doe@example.com');

        const passwordInput = screen.getByPlaceholderText(/Password/i);
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

    test('submits form and handles successful signup', async () => {
        axios.post.mockResolvedValueOnce({ data: { token: 'test-token' } });

        const firstNameInput = screen.getByPlaceholderText(/First Name/i);
        const lastNameInput = screen.getByPlaceholderText(/Last Name/i);
        const emailInput = screen.getByPlaceholderText(/Email/i);
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        const signupButton = screen.getByRole('button', { name: /Sign Up/i });

        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(signupButton);

        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:5000/api/auth/signup',
            { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' }
        );

        await new Promise((r) => setTimeout(r, 0));
        expect(localStorage.getItem('token')).toBe('test-token');
        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
    });

    test('navigates to login when "Go to Login" button is clicked', () => {
        const goToLoginButton = screen.getByRole('button', { name: /Go to Login/i });
        fireEvent.click(goToLoginButton);

    });
});
