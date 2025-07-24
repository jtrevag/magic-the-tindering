import React, { useState, useEffect, useCallback } from 'react';
import { Card, DraftState, DraftSettings } from '../types/Card';
import peasantCube from '../data/peasantCube.json';
import CardDisplay from './CardDisplay';
import Timer from './Timer';
import './DraftInterface.css';

// Removed RecentCard interface - now using direct picked cards display

const defaultSettings: DraftSettings = {
  timerSeconds: 15,
  totalPicks: 45,
  deckSize: 40
};

const DraftInterface: React.FC = () => {
  const [draftState, setDraftState] = useState<DraftState>({
    currentCardIndex: 0,
    pickedCards: [],
    picksRemaining: defaultSettings.totalPicks,
    isComplete: false
  });

  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(defaultSettings.timerSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // Removed recentCards state - using direct picked cards display

  // Shuffle cards on component mount
  useEffect(() => {
    const shuffled = [...(peasantCube as Card[])].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setIsTimerRunning(true);
  }, []);

  const handleSkip = useCallback(() => {
    if (draftState.isComplete || draftState.currentCardIndex >= shuffledCards.length) return;

    const nextIndex = draftState.currentCardIndex + 1;
    const isComplete = nextIndex >= shuffledCards.length || draftState.picksRemaining <= 1;
    
    setDraftState(prev => ({
      ...prev,
      currentCardIndex: nextIndex,
      isComplete
    }));

    setTimeRemaining(defaultSettings.timerSeconds);
  }, [draftState.isComplete, draftState.currentCardIndex, draftState.picksRemaining, shuffledCards.length]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0 && !draftState.isComplete) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSkip();
            return defaultSettings.timerSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, draftState.isComplete, handleSkip]);

  const handlePick = () => {
    if (draftState.isComplete || draftState.currentCardIndex >= shuffledCards.length) return;

    const currentCard = shuffledCards[draftState.currentCardIndex];
    const newPickedCards = [...draftState.pickedCards, currentCard];
    const newPicksRemaining = draftState.picksRemaining - 1;

    const nextIndex = draftState.currentCardIndex + 1;
    const isComplete = newPicksRemaining === 0 || nextIndex >= shuffledCards.length;
    
    setDraftState({
      currentCardIndex: nextIndex,
      pickedCards: newPickedCards,
      picksRemaining: newPicksRemaining,
      isComplete
    });

    if (newPicksRemaining === 0) {
      setIsTimerRunning(false);
    } else {
      setTimeRemaining(defaultSettings.timerSeconds);
    }
  };

  const getCurrentCard = (): Card | null => {
    // If we've run out of cards, complete the draft
    if (draftState.currentCardIndex >= shuffledCards.length) {
      if (!draftState.isComplete) {
        setDraftState(prev => ({ ...prev, isComplete: true }));
      }
      return null;
    }
    if (draftState.isComplete) return null;
    return shuffledCards[draftState.currentCardIndex];
  };

  const currentCard = getCurrentCard();

  if (draftState.isComplete) {
    return (
      <div className="draft-complete">
        <h2>Draft Complete!</h2>
        <p>You picked {draftState.pickedCards.length} cards</p>
        <div className="picked-cards-summary">
          {draftState.pickedCards.map((card, index) => (
            <div key={index} className="picked-card-summary">
              {card.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return <div className="loading">Loading cards...</div>;
  }

  return (
    <div className="draft-interface">
      <div className="draft-main-content">
        <div className="draft-header">
          <div className="picks-counter">
            Picks remaining: {draftState.picksRemaining}
          </div>
          <Timer seconds={timeRemaining} />
        </div>
        
        <CardDisplay card={currentCard} />
        
        <div className="draft-actions">
          <button 
            className="skip-button" 
            onClick={handleSkip}
            disabled={draftState.isComplete}
          >
            Skip
          </button>
          <button 
            className="pick-button" 
            onClick={handlePick}
            disabled={draftState.isComplete}
          >
            Pick
          </button>
        </div>
      </div>

      <div className="deck-sidebar">
        <div className="deck-header">
          <h3>Your Deck ({draftState.pickedCards.length}/{defaultSettings.deckSize})</h3>
        </div>
        <div className="deck-cards-grid">
          {draftState.pickedCards.map((card, index) => (
            <div key={`${card.scryfallId}-${index}`} className="deck-card-thumbnail">
              <img 
                src={`https://cards.scryfall.io/normal/front/${card.scryfallId.charAt(0)}/${card.scryfallId.charAt(1)}/${card.scryfallId}.jpg`}
                alt={card.name}
                className="deck-card-image"
                title={`${card.name} - ${card.manaCost || 'No cost'}`}
              />
              <div className="deck-card-name">{card.name}</div>
            </div>
          ))}
          {/* Show empty slots for remaining cards */}
          {Array.from({ length: Math.max(0, defaultSettings.deckSize - draftState.pickedCards.length) }).map((_, index) => (
            <div key={`empty-${index}`} className="deck-card-empty">
              <div className="empty-slot-text">Empty</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraftInterface;