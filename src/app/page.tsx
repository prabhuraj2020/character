"use client";

import { useState, useEffect, useCallback } from "react";
import { FaHeart } from "react-icons/fa6";
import Link from "next/link";
import styles from "./page.module.css";
import { useFavorites } from "@/context/FavoritesContext";

// Character Interface
interface Character {
  name: string;
  gender: string;
  birth_year: string;
  hair_color: string;
  height: string;
  mass: string;
  url: string;
}

export default function Home() {
  const { favorites, toggleFavorite } = useFavorites();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Characters
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch("https://swapi.dev/api/people/");
        if (!res.ok) throw new Error("Failed to fetch characters.");
        const data = await res.json();
        setCharacters(data.results);
      } catch (err) {
        setError("Failed to load characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  // Handle Favorite Toggle
  const handleToggleFavorite = useCallback(
    (character: Character) => {
      toggleFavorite(character); // Pass full character object
    },
    [toggleFavorite]
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.navbar}>
          <Link href="/">
            <img className={styles.logo} src="/star-wars.png" alt="Star Wars Logo" width={100} height={40} />
          </Link>
          <div className={styles.favIconContainer}>
            <Link href="/favorites">
              <FaHeart className={styles.favIcon} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Star Wars Characters</h1>

        {loading ? (
          <p className={styles.loading}>Loading characters...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.grid}>
            {characters.map((character) => {
              const characterId = character.url?.split("/").filter(Boolean).pop() || "";
              const isFavorite = favorites.some((fav) => fav.url === character.url);

              return (
                <div key={characterId} className={styles.characterCard}>
                  <FaHeart
                    className={`${styles.favoriteIcon} ${isFavorite ? styles.favActive : ""}`}
                    onClick={() => handleToggleFavorite(character)}
                  />
                  <h2>{character.name ?? "Unknown Character"}</h2>
                  <p><strong>Gender:</strong> {character.gender}</p>
                  <p><strong>Birth Year:</strong> {character.birth_year}</p>
                  <p><strong>Hair Color:</strong> {character.hair_color}</p>
                  <p><strong>Height:</strong> {character.height} cm</p>
                  <p><strong>Mass:</strong> {character.mass} kg</p>

                  <Link href={`/character/${characterId}`}>
                    <button className={styles.viewDetails}>View Details</button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 Star Wars App. All rights reserved.</p>
      </footer>
    </div>
  );
}
