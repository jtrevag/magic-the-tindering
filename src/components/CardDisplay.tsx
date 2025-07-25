import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { Card } from '../types/Card';
import './CardDisplay.css';

interface CardDisplayProps {
  card: Card;
  handlePick?: () => void
  handleSkip?: () => void
  isSkipping?: boolean;
  isPicking?: boolean;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, handlePick, handleSkip, isSkipping = false, isPicking = false }) => {
  const getImageUrl = (scryfallId: string) => {
    return `https://cards.scryfall.io/normal/front/${scryfallId.charAt(0)}/${scryfallId.charAt(1)}/${scryfallId}.jpg`;
  };

  const getSkipReward = (elo: number): number => {
    if (elo >= 1650) return 6;
    if (elo >= 1500) return 4;
    if (elo >= 1350) return 2;
    return 0;
  };
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSkip,
    onSwipedRight: handlePick,
    trackMouse: true,
  });

  return (
    <div className={`card-display ${isSkipping ? 'skipping' : ''} ${isPicking ? 'picking' : ''}`} {...swipeHandlers}>
      <div className="card-image-container">
        <img 
          src={getImageUrl(card.scryfallId)} 
          alt={card.name}
          className="card-image"
          draggable={false}
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
        {card.elo && (
          <div className="card-elo">
            ELO: {card.elo}
          </div>
        )}
        {card.elo && getSkipReward(card.elo) > 0 && (
          <div className="skip-reward">
            Skip Reward: +{getSkipReward(card.elo)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDisplay;