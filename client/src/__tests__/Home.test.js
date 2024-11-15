import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Home from '../components/Home';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('Home Component', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    localStorage.setItem('token', 'mockToken');
    useNavigate.mockReturnValue(navigate);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('redirects to login if no token is found', () => {
    localStorage.removeItem('token');
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  test('renders loading message while fetching data', async () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('displays fetched meal data on success', async () => {
    const mockMeal = {
      success: true,
      meal: {
        imageUrl: '/mockImage.jpg',
        nutritionData: {
          calories: { value: 500 },
          protein: { value: 25 },
          carbohydrates: { value: 60 },
          fat: { value: 15 },
        },
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    };
    axios.get.mockResolvedValueOnce({ data: mockMeal });

    render(<MemoryRouter><Home /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText(/My Last Meal/i)).toBeInTheDocument());
    expect(screen.getByText(/500 kcal/i)).toBeInTheDocument();
    expect(screen.getByText(/25g/i)).toBeInTheDocument();
    expect(screen.getByText(/60g/i)).toBeInTheDocument();
    expect(screen.getByText(/15g/i)).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<MemoryRouter><Home /></MemoryRouter>);

    await waitFor(() => expect(screen.getByText(/Failed to fetch last meal/i)).toBeInTheDocument());
  });
});
