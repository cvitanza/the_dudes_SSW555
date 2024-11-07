import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login';

test('renders the Login component with email and password inputs', () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument(); // Select button only
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
