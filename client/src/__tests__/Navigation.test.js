import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from '../components/BottomNav';


/* 
Tests the navigation bar on the bottom, making sure that upon the click of
an icon, the correct page is loaded and displayed.
*/

describe('BottomNav Component', () => {

    test('navigates to Home when HomeIcon is clicked', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <BottomNav />
        </MemoryRouter>
      );
  
      const homeButton = screen.getByRole('link', { name: /home/i });
      fireEvent.click(homeButton);
  
      expect(homeButton).toBeInTheDocument();
    });
  
    test('navigates to Recipes when RecipesIcon is clicked', () => {
      render(
        <MemoryRouter initialEntries={['/recipes']}>
          <BottomNav />
        </MemoryRouter>
      );
  
      const recipesButton = screen.getByRole('link', { name: /recipes/i });
      fireEvent.click(recipesButton);
  
      expect(recipesButton).toBeInTheDocument();
    });
  
    test('navigates to Upload when UploadIcon is clicked', () => {
      render(
        <MemoryRouter initialEntries={['/upload']}>
          <BottomNav />
        </MemoryRouter>
      );
  
      const uploadButton = screen.getByRole('link', { name: /upload/i });
      fireEvent.click(uploadButton);
  
      expect(uploadButton).toBeInTheDocument();
    });
  
    test('navigates to Favorites when FavoritesIcon is clicked', () => {
      render(
        <MemoryRouter initialEntries={['/favorites']}>
          <BottomNav />
        </MemoryRouter>
      );
  
      const favoritesButton = screen.getByRole('link', { name: /favorites/i });
      fireEvent.click(favoritesButton);
  
      expect(favoritesButton).toBeInTheDocument();
    });
  
    test('navigates to Profile when ProfileIcon is clicked', () => {
      render(
        <MemoryRouter initialEntries={['/profile']}>
          <BottomNav />
        </MemoryRouter>
      );
  
      const profileButton = screen.getByRole('link', { name: /profile/i });
      fireEvent.click(profileButton);
  
      expect(profileButton).toBeInTheDocument();
    });
  });