import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Signout from '../components/Signout';
import axios from 'axios';


jest.mock('axios');


jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: jest.fn(),
    };
});

describe('Signout Component', () => {
    let setIsAuthenticated;
    let navigate;

    beforeEach(() => {
        setIsAuthenticated = jest.fn();
        localStorage.setItem('token', 'mockToken');
        navigate = jest.fn();

        require('react-router-dom').useNavigate.mockImplementation(() => navigate); 

        render(
            <MemoryRouter>
                <Signout setIsAuthenticated={setIsAuthenticated} />
            </MemoryRouter>
        );
    });

    test('renders Sign Out button', () => {
        expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
    });

    test('handles sign out and removes token', async () => {
        axios.post.mockResolvedValueOnce({});

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));
        });

        expect(axios.post).toHaveBeenCalledWith(
            `http://localhost:${process.env.REACT_APP_PORT || 5000}/api/auth/signout`,
            {},
            {
                headers: {
                    Authorization: `Bearer mockToken`,
                },
            }
        );

        expect(localStorage.getItem('token')).toBeNull();
        expect(setIsAuthenticated).toHaveBeenCalledWith(false);
    });

    test('navigates to login if no token is found', async () => {
        localStorage.removeItem('token');

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));
        });

        expect(navigate).toHaveBeenCalledWith('/login');
    });

    test('handles error during sign out gracefully', async () => {
        axios.post.mockRejectedValueOnce(new Error('Sign out failed'));

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));
        });

        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    test('uses REACT_APP_API_BASE_URL when available', async () => {
        process.env.REACT_APP_API_BASE_URL = 'http://testurl.com';
        axios.post.mockResolvedValueOnce({});

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));
        });

        expect(axios.post).toHaveBeenCalledWith(
            `http://testurl.com/api/auth/signout`,
            {},
            {
                headers: {
                    Authorization: `Bearer mockToken`,
                },
            }
        );

        delete process.env.REACT_APP_API_BASE_URL;
    });
    
});
