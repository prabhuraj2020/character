import { render, act } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext";
import { ReactNode } from "react";

// Mocking localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Test Character Data
const testCharacter = {
  name: "Luke Skywalker",
  gender: "male",
  birth_year: "19BBY",
  hair_color: "blond",
  height: "172",
  mass: "77",
  url: "https://swapi.dev/api/people/1/",
};

// Utility function to render with context
const renderWithProvider = (ui: ReactNode) =>
  render(<FavoritesProvider>{ui}</FavoritesProvider>);

// Test Component to consume context
const TestComponent = ({ action }: { action: (favorites: any) => void }) => {
  const favorites = useFavorites();
  action(favorites);
  return null;
};

// 📌 TEST CASES
describe("FavoritesContext", () => {
  beforeEach(() => {
    localStorage.clear(); // Clear mock localStorage before each test
  });

  test("initializes with empty favorites list", () => {
    let receivedFavorites;
    renderWithProvider(<TestComponent action={(fav) => (receivedFavorites = fav.favorites)} />);
    expect(receivedFavorites).toEqual([]);
  });

  test("loads favorites from localStorage", () => {
    localStorage.setItem("favorites", JSON.stringify([testCharacter]));

    let receivedFavorites;
    renderWithProvider(<TestComponent action={(fav) => (receivedFavorites = fav.favorites)} />);
    
    expect(receivedFavorites).toEqual([testCharacter]);
  });

  test("adds a character to favorites", () => {
    let receivedFavorites;
    renderWithProvider(
      <TestComponent action={(fav) => {
        act(() => fav.addFavorite(testCharacter));
        receivedFavorites = fav.favorites;
      }} />
    );

    expect(receivedFavorites).toContainEqual(testCharacter);
    expect(JSON.parse(localStorage.getItem("favorites")!)).toContainEqual(testCharacter);
  });

  test("does not add duplicate characters", () => {
    let receivedFavorites;
    renderWithProvider(
      <TestComponent action={(fav) => {
        act(() => {
          fav.addFavorite(testCharacter);
          fav.addFavorite(testCharacter);
        });
        receivedFavorites = fav.favorites;
      }} />
    );

    expect(receivedFavorites.length).toBe(1); // No duplicates
  });

  test("removes a character from favorites", () => {
    let receivedFavorites;
    renderWithProvider(
      <TestComponent action={(fav) => {
        act(() => {
          fav.addFavorite(testCharacter);
          fav.removeFavorite(testCharacter.url);
        });
        receivedFavorites = fav.favorites;
      }} />
    );

    expect(receivedFavorites).toEqual([]);
    expect(JSON.parse(localStorage.getItem("favorites")!)).toEqual([]);
  });

  test("toggleFavorite adds if not present", () => {
    let receivedFavorites;
    renderWithProvider(
      <TestComponent action={(fav) => {
        act(() => fav.toggleFavorite(testCharacter));
        receivedFavorites = fav.favorites;
      }} />
    );

    expect(receivedFavorites).toContainEqual(testCharacter);
  });

  test("toggleFavorite removes if already present", () => {
    let receivedFavorites;
    renderWithProvider(
      <TestComponent action={(fav) => {
        act(() => {
          fav.addFavorite(testCharacter);
          fav.toggleFavorite(testCharacter);
        });
        receivedFavorites = fav.favorites;
      }} />
    );

    expect(receivedFavorites).toEqual([]);
  });

  test("saves favorites to localStorage on change", () => {
    renderWithProvider(
      <TestComponent action={(fav) => {
        act(() => fav.addFavorite(testCharacter));
      }} />
    );

    expect(JSON.parse(localStorage.getItem("favorites")!)).toContainEqual(testCharacter);
  });
});
