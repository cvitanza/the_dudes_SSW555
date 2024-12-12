import React, { createContext, useState } from 'react';

export const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  return (
    <RecipesContext.Provider value={{ recipes, setRecipes, favorites, setFavorites }}>
      {children}
    </RecipesContext.Provider>
  );
};
