import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Recipes from '../components/Recipes';
import RecipeDetail from '../components/RecipeDetail';
import { RecipesContext } from '../context/RecipesContext';
import axios from 'axios';

// Mock fetch setup using environment variables
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      hits: [
        {
          recipe: {
            label: 'Test Recipe',
            uri: 'test-uri',
            ingredients: [{ text: '1 cup of rice' }],
            image: 'test-image-url',
            cuisineType: ['American'],
            mealType: ['Lunch/Dinner'],
            totalNutrients: {
              ENERC_KCAL: { quantity: 300 },
              PROCNT: { quantity: 20 },
              FAT: { quantity: 10 },
              CHOCDF: { quantity: 50 }
            },
            healthLabels: ['Gluten-Free', 'Low-Sugar'],
            url: 'https://test-recipe-url.com'
          }
        }
      ]
    })
  })
);

// Mock axios
jest.mock('axios');

describe('Recipes Component Tests', () => {
  const setRecipesMock = jest.fn();
  const mockContextValue = {
    recipes: [],
    setRecipes: setRecipesMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error
  });

  test('renders the search bar and button', () => {
    render(
      <RecipesContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <Recipes />
        </MemoryRouter>
      </RecipesContext.Provider>
    );

    expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('displays loading message while fetching recipes', async () => {
    render(
      <RecipesContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <Recipes />
        </MemoryRouter>
      </RecipesContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Search recipes...'), { target: { value: 'chicken' } });
    fireEvent.click(screen.getByText('Search'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
  });

  test('shows "No recipes found" when API returns no results', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ hits: [] }),
      })
    );

    render(
      <RecipesContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <Recipes />
        </MemoryRouter>
      </RecipesContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Search recipes...'), { target: { value: 'chicken' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('No recipes found.')).toBeInTheDocument();
    });
  });

  test('handles fetch error and logs an error message', async () => {
    // Mock the error response
    const errorMessage = 'API error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const { getByPlaceholderText, getByText, getByRole } = render(
      <MemoryRouter>
        <RecipesContext.Provider value={mockContextValue}>
          <Recipes />
        </RecipesContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Search recipes...'), {
      target: { value: 'chicken' }
    });

    fireEvent.click(getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(getByText('Failed to fetch recipes. Please try again.')).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith('Error fetching recipes:', errorMessage);
    });
  });

  test('navigates to recipe detail when the recipe link is clicked', async () => {
    render(
      <RecipesContext.Provider value={{ ...mockContextValue, recipes: [{ recipe: { label: 'Test Recipe', uri: 'test-uri' } }] }}>
        <MemoryRouter>
          <Recipes />
        </MemoryRouter>
      </RecipesContext.Provider>
    );

    const link = screen.getByText('Test Recipe');
    expect(link).toHaveAttribute('href', '/recipe/test-uri');
  });
});

describe('RecipeDetail Component Tests', () => {
  const mockRecipe = {
    label: 'Test Recipe',
    image: 'test-image-url',
    cuisineType: ['American'],
    mealType: ['Lunch/Dinner'],
    url: 'https://test-recipe-url.com',
    ingredients: [{ text: '1 cup of rice' }],
    totalNutrients: {
      ENERC_KCAL: { quantity: 300 },
      PROCNT: { quantity: 20 },
      FAT: { quantity: 10 },
      CHOCDF: { quantity: 50 }
    },
    healthLabels: ['Gluten-Free', 'Low-Sugar']
  };

  const mockRecipes = [
    { recipe: { label: 'Test Recipe 1', uri: 'test-uri-1' } },
    { recipe: { label: 'Test Recipe 2', uri: 'test-uri-2' } }
  ];

  test('renders recipe details correctly', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/recipe/test-uri', state: { recipe: mockRecipe } }]}>
        <Routes>
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('- 1 cup of rice')).toBeInTheDocument(); // Matches the rendered format
    expect(screen.getByText(/calories/i)).toBeInTheDocument();
  });

  test('back button navigates to the previous page', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/', '/recipe/test-uri']} initialIndex={1}>
        <Routes>
          <Route path="/" element={<div>Recipe List Page</div>} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const backButton = screen.getByText(/back/i);
    fireEvent.click(backButton);

    expect(container.textContent).toContain('Recipe List Page');
  });

  test('retains the list of API results when back button is clicked', () => {
    const setRecipesMock = jest.fn();
    const mockContextValue = {
      recipes: mockRecipes,
      setRecipes: setRecipesMock,
    };

    render(
      <RecipesContext.Provider value={mockContextValue}>
        <MemoryRouter initialEntries={['/', '/recipe/test-uri-1']} initialIndex={1}>
          <Routes>
            <Route path="/" element={<Recipes />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </MemoryRouter>
      </RecipesContext.Provider>
    );

    const backButton = screen.getByText(/back/i);
    fireEvent.click(backButton);

    expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
  });

  test('renders a message if no recipe data is available', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/recipe/test-uri', state: { recipe: null } }]}>
        <Routes>
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('No recipe details found.')).toBeInTheDocument();
  });
});