"use client";

import { useFavorites } from "@/context/FavoritesContext";
import Link from "next/link";
import Image from "next/image";
import { FaHeart } from "react-icons/fa6";
import styles from "../page.module.css"; // Import same styles

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  // Debugging logs
  console.log("Favorites from Context:", favorites);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.navbar}>
          <Image
            className={styles.logo}
            src="/star-wars.png"
            alt="Star Wars Logo"
            width={100}
            height={40}
            priority
          />
          <div className={styles.favIconContainer}>
            <Link href="/favorites">
              <FaHeart className={styles.favIcon} />
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Favorites</h1>

        {favorites.length === 0 ? (
          <p>No favorite characters added.</p>
        ) : (
          <ul className={styles.favList}>
            {favorites.map((character) => {
              console.log("Character Data:", character); // Debugging log

              return (
                <li key={character.url} className={styles.favItem}>
                  <Link href={`/character/${character.name ?? "unknown"}`} className={styles.favLink}>
                    {character?.name || "Unknown Character"}
                  </Link>
                  <button
                    onClick={() => removeFavorite(character.url)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2025 Star Wars App. All rights reserved.</p>
      </footer>
    </div>
  );
}
