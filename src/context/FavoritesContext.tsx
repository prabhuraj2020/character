"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Character Interface
interface Character {
  name: string;
  gender: string;
  birth_year: string;
  hair_color: string;
  height: string;
  mass: string;
  url: string; // Unique identifier
}

// Context Type
interface FavoritesContextType {
  favorites: Character[];
  addFavorite: (character: Character) => void;
  removeFavorite: (url: string) => void;
  toggleFavorite: (character: Character) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Character[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

        if (Array.isArray(storedFavorites)) {
          console.log("Loaded favorites from localStorage:", storedFavorites);
          setFavorites(storedFavorites);
        } else {
          console.warn("Invalid favorites format in localStorage, resetting.");
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
        setFavorites([]);
      }
    }
  }, []);

  // Save to localStorage whenever `favorites` changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
      console.log("Updated favorites in localStorage:", favorites);
    }
  }, [favorites]);

  // Add to favorites
  const addFavorite = (character: Character) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.url === character.url)) return prevFavorites;
      const updatedFavorites = [...prevFavorites, character];
      console.log("Added to favorites:", updatedFavorites);
      return updatedFavorites;
    });
  };

  // Remove from favorites
  const removeFavorite = (url: string) => {
    console.log("Trying to remove:", url);
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((fav) => {
        console.log("Checking:", fav.url);
        return fav.url !== url;
      });
      console.log("Updated favorites after removal:", updatedFavorites);
      return updatedFavorites;
    });
  };
  
  

  // Toggle favorite
  const toggleFavorite = (character: Character) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.url === character.url);
      const updatedFavorites = isFavorite
        ? prevFavorites.filter((fav) => fav.url !== character.url) // Remove
        : [...prevFavorites, character]; // Add

      console.log(isFavorite ? "Removed from favorites:" : "Added to favorites:", updatedFavorites);
      return updatedFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook for using favorites
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
}
