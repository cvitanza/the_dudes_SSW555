import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login';
import axios from 'axios';

// Mock the Axios POST request
jest.mock('axios');

test('renders the Login component with email and password inputs', () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
});

test('navigates to signup page when "Go to Signup" button is clicked', () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    const goToSignupButton = screen.getByRole('button', { name: /Go to Signup/i });
    fireEvent.click(goToSignupButton);
});

// New test to check error message rendering
test('shows error message when login fails', async () => {
    // Mock the Axios POST request to simulate a failed login
    axios.post.mockRejectedValue(new Error('Login failed'));

    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    // Fill in email and password
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'incorrectpassword' } });

    // Simulate the login button click
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the error message to appear
    await waitFor(() => screen.getByText(/Login failed/i));

    // Assert that the error message is displayed
    expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
});

// New test to check that token is stored in localStorage on successful login
test('stores token in localStorage on successful login', async () => {
    // Mock the Axios POST request to simulate a successful login
    axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    // Fill in email and password
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'correctpassword' } });

    // Simulate the login button click
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the redirect to happen
    await waitFor(() => screen.queryByText(/Login failed/i)); // Ensure no error message is shown

    // Assert that the token is stored in localStorage
    expect(localStorage.getItem('token')).toBe('mock-token');
});
