import React from 'react';
import { Card } from '../types/Card';
import './CardDisplay.css';

interface CardDisplayProps {
  card: Card;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  const getImageUrl = (scryfallId: string) => {
    return `https://cards.scryfall.io/normal/front/${scryfallId.charAt(0)}/${scryfallId.charAt(1)}/${scryfallId}.jpg`;
  };

  return (
    <div className="card-display">
      <div className="card-image-container">
        <img 
          src={getImageUrl(card.scryfallId)} 
          alt={card.name}
          className="card-image"
          onError={(e) => {
            // Fallback to a different Scryfall image format if the first fails
            const target = e.target as HTMLImageElement;
            target.src = `https://cards.scryfall.io/large/front/${card.scryfallId.charAt(0)}/${card.scryfallId.charAt(1)}/${card.scryfallId}.jpg`;
          }}
        />
      </div>
      
      <div className="card-info">
        <h3 className="card-name">{card.name}</h3>
        <div className="card-cost">{card.manaCost}</div>
        <div className="card-type">{card.type}</div>
        <div className={`card-rarity rarity-${card.rarity}`}>
          {card.rarity}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;