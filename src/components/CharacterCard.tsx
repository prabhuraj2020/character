"use client";

import React from "react";
import Link from "next/link";

interface Character {
  name: string;
  gender: string;
  homeworld: string;
  birth_year: string;
  hair_color: string;
  height: string;
  mass: string;
  url: string;
}

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const characterId = character.url.split("/").filter(Boolean).pop();

  return (
    <div className="character-card">
      <h2>{character.name}</h2>
      <p><strong>Gender:</strong> {character.gender}</p>
      <p><strong>Home Planet:</strong> {character.homeworld}</p>
      <p><strong>Birth Year:</strong> {character.birth_year}</p>
      <p><strong>Hair Color:</strong> {character.hair_color}</p>
      <p><strong>Height:</strong> {character.height} cm</p>
      <p><strong>Mass:</strong> {character.mass} kg</p>

      <Link href={`/character/${characterId}`}>
        <button className="view-details">View Details</button>
      </Link>
    </div>
  );
};

export default CharacterCard;

