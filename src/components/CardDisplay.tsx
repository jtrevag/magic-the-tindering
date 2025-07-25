import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
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
  const controls = useAnimation();
  const x = useMotionValue(0);
  const PICK_THRESHOLD = 100;
  const SKIP_THRESHOLD = -100;

  const [showPick, setShowPick] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset animation and imageLoaded when card changes
  useEffect(() => {
    setImageLoaded(false);
  }, [card]);

  // Only reset card position after next image is loaded
  useEffect(() => {
    if (imageLoaded) {
      controls.set({ x: 0, opacity: 1 });
    }
  }, [imageLoaded, controls]);

  // Show pick/skip indicators based on motion value
  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      setShowPick(latest > PICK_THRESHOLD);
      setShowSkip(latest < SKIP_THRESHOLD);
    });
    return unsubscribe;
  }, [x]);

  const getImageUrl = (scryfallId: string) => {
    return `https://cards.scryfall.io/normal/front/${scryfallId.charAt(0)}/${scryfallId.charAt(1)}/${scryfallId}.jpg`;
  };

  const getSkipReward = (elo: number): number => {
    if (elo >= 1650) return 3;
    if (elo >= 1500) return 2;
    if (elo >= 1350) return 1;
    return 0;
  };

  const getStrengthScore = (elo: number): { score: string; class: string } => {
    if (elo >= 1650) return { score: "S", class: "strength-s" };
    if (elo >= 1500) return { score: "A", class: "strength-a" };
    if (elo >= 1350) return { score: "B", class: "strength-b" };
    if (elo >= 1200) return { score: "C", class: "strength-c" };
    if (elo >= 1000) return { score: "D", class: "strength-d" };
    return { score: "F", class: "strength-f" };
  };

// Handle drag end to determine pick, skip, or reset
const handleDragEnd = () => {
  const currentX = x.get();
  if (currentX > PICK_THRESHOLD) {
    controls.start({ x: 1000, opacity: 0, transition: { duration: 0.2 } }).then(() => {
      handlePick && handlePick();
    });
  } else if (currentX < SKIP_THRESHOLD) {
    controls.start({ x: -1000, opacity: 0, transition: { duration: 0.2 } }).then(() => {
      handleSkip && handleSkip();
    });
  } else {
    controls.start({ x: 0, opacity: 1 });
  }
};

  return (
    <div className={`card-display ${isSkipping ? 'skipping' : ''} ${isPicking ? 'picking' : ''}`}>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0, opacity: 1 }}
        style={{ x, touchAction: 'pan-x' }}
      >
        {/* Pick/Skip indicators */}
        {showPick && (
          <div className="swipe-indicator pick-indicator">Pick!</div>
        )}
        {showSkip && (
          <div className="swipe-indicator skip-indicator">Skip!</div>
        )}

        <div className="card-image-container">
          <img 
            src={getImageUrl(card.scryfallId)} 
            alt={card.name}
            className="card-image"
            draggable={false}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Fallback to a different Scryfall image format if the first fails
              const target = e.target as HTMLImageElement;
              target.src = `https://cards.scryfall.io/large/front/${card.scryfallId.charAt(0)}/${card.scryfallId.charAt(1)}/${card.scryfallId}.jpg`;
            }}
          />
        </div>
      </motion.div>

      <div className="card-info">
        <h3 className="card-name">{card.name}</h3>
        <div className="card-cost">{card.manaCost}</div>
        <div className="card-type">{card.type}</div>
        {card.elo && (
          <div className={`card-strength ${getStrengthScore(card.elo).class}`}>
            Strength: {getStrengthScore(card.elo).score}
          </div>
        )}
        <div className="reward-indicators">
          {card.elo && getSkipReward(card.elo) > 0 && (
            <div className="skip-reward left-reward">
              Skip: +{getSkipReward(card.elo)}
            </div>
          )}
          {card.elo && getSkipReward(card.elo) === 0 && (
            <div className="pick-reward right-reward">
              Pick: +1 skip
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;