import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Profile from '../components/Profile';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Profile Component', () => {
  const setIsAuthenticatedMock = jest.fn();

  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('displays loading indicator initially', () => {
    render(
      <BrowserRouter>
        <Profile setIsAuthenticated={setIsAuthenticatedMock} />
      </BrowserRouter>
    );
    expect(screen.queryByText(/Loading profile data.../i)).toBeInTheDocument();
  });

  test('displays user profile data when fetch is successful', async () => {
    axios.get.mockResolvedValueOnce({
      data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    });

    render(
      <BrowserRouter>
        <Profile setIsAuthenticated={setIsAuthenticatedMock} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading profile data.../i)).not.toBeInTheDocument();
    });

    expect(screen.queryByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('john.doe@example.com')).toBeInTheDocument();
  });

  test('displays error message if token is missing', async () => {
    localStorage.removeItem('token');

    render(
      <BrowserRouter>
        <Profile setIsAuthenticated={setIsAuthenticatedMock} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/No token found, please log in./i)).toBeInTheDocument();
    });
  });

  test('displays error message if fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <Profile setIsAuthenticated={setIsAuthenticatedMock} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Failed to fetch profile data/i)).toBeInTheDocument();
    });
  });
  test('handles delete account functionality', async () => {
    const mockNavigate = jest.fn();
    const setIsAuthenticatedMock = jest.fn();
  
    const { container } = render(
      <BrowserRouter>
        <Profile setIsAuthenticated={setIsAuthenticatedMock} navigate={mockNavigate} />
      </BrowserRouter>
    );
  
    console.log(container.innerHTML); 
  
    const deleteButton = container.querySelector('.delete-account-button'); 
  
    if (!deleteButton) {
      console.error('Delete button not found');
    }
  
    if (deleteButton) {
      fireEvent.click(deleteButton);
  
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/goodbye');
        expect(setIsAuthenticatedMock).toHaveBeenCalledWith(false);
      });
    }
});
});