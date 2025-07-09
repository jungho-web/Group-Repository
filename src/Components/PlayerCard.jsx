// PlayerCard.jsx
import React from 'react';

export default function PlayerCard({ player, onSelectMove }) {
  return (
    <div>
      <h2>{player.name} ({player.lives} lives)</h2>
      <button onClick={() => onSelectMove('rock')}>🪨 Rock</button>
      <button onClick={() => onSelectMove('paper')}>📄 Paper</button>
      <button onClick={() => onSelectMove('scissors')}>✂️ Scissors</button>
    </div>
  );
}