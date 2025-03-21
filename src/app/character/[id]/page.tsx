"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import Link from "next/link";
import Image from "next/image";
import { FaHeart } from "react-icons/fa6";
import styles from "../../page.module.css"; // Import styles

// Define Character interface with all required properties
interface Character {
  name: string;
  gender: string;
  birth_year: string;
  hair_color: string;
  height: string;
  mass: string;
  url: string; // Ensure 'url' is included to prevent TypeScript error
}

export default function CharacterPage({ params }: { params: { id: string } }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    async function fetchCharacter() {
      const res = await fetch(`https://swapi.dev/api/people/${params.id}/`);
      if (!res.ok) return;
      const data = await res.json();

      // Ensure 'url' property exists in the character object
      setCharacter({ ...data, url: `https://swapi.dev/api/people/${params.id}/` });
    }

    fetchCharacter();
  }, [params.id]);

  // Check if character is in favorites
  const isFavorite = character && favorites.some((fav) => fav.name === character.name);

  const toggleFavorite = () => {
    if (character) {
      isFavorite ? removeFavorite(character.name) : addFavorite(character);
    }
  };

  if (!character) return <p>Loading...</p>;

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.navbar}>
          {/* Star Wars Logo */}
          <Image
            className={styles.logo}
            src="/star-wars.png"
            alt="Star Wars Logo"
            width={100}
            height={40}
            priority
          />

          {/* Favorite Icon Link */}
          <div className={styles.favIconContainer}>
            <Link href="/favorites">
              <FaHeart className={styles.favIcon} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>{character.name}</h1>
        <p><strong>Gender:</strong> {character.gender}</p>
        <p><strong>Birth Year:</strong> {character.birth_year}</p>
        <p><strong>Hair Color:</strong> {character.hair_color}</p>
        <p><strong>Height:</strong> {character.height} cm</p>
        <p><strong>Mass:</strong> {character.mass} kg</p>

        <button 
          onClick={toggleFavorite} 
          className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteRemove : styles.favoriteAdd}`}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 Star Wars App. All rights reserved.</p>
      </footer>
    </div>
  );
}
