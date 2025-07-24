import React, { useState, useEffect } from 'react';
import { Card, DraftState, DraftSettings } from '../types/Card';
import peasantCube from '../data/peasantCube.json';
import CardDisplay from './CardDisplay';
import Timer from './Timer';
import './DraftInterface.css';

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

  // Shuffle cards on component mount
  useEffect(() => {
    const shuffled = [...(peasantCube as Card[])].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setIsTimerRunning(true);
  }, []);

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
  }, [isTimerRunning, timeRemaining, draftState.isComplete]);

  const handlePick = () => {
    if (draftState.isComplete || draftState.currentCardIndex >= shuffledCards.length) return;

    const currentCard = shuffledCards[draftState.currentCardIndex];
    const newPickedCards = [...draftState.pickedCards, currentCard];
    const newPicksRemaining = draftState.picksRemaining - 1;

    setDraftState({
      currentCardIndex: draftState.currentCardIndex + 1,
      pickedCards: newPickedCards,
      picksRemaining: newPicksRemaining,
      isComplete: newPicksRemaining === 0
    });

    if (newPicksRemaining === 0) {
      setIsTimerRunning(false);
    } else {
      setTimeRemaining(defaultSettings.timerSeconds);
    }
  };

  const handleSkip = () => {
    if (draftState.isComplete || draftState.currentCardIndex >= shuffledCards.length) return;

    setDraftState(prev => ({
      ...prev,
      currentCardIndex: prev.currentCardIndex + 1
    }));

    setTimeRemaining(defaultSettings.timerSeconds);
  };

  const getCurrentCard = (): Card | null => {
    if (draftState.currentCardIndex >= shuffledCards.length) return null;
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

      <div className="recent-picks">
        <h3>Recent Picks</h3>
        <div className="recent-picks-list">
          {draftState.pickedCards.slice(-5).reverse().map((card, index) => (
            <div key={index} className="recent-pick-item">
              <img 
                src={`https://cards.scryfall.io/small/front/${card.scryfallId.charAt(0)}/${card.scryfallId.charAt(1)}/${card.scryfallId}.jpg`}
                alt={card.name}
                className="recent-pick-image"
              />
              <div className="recent-pick-name">{card.name}</div>
            </div>
          ))}
        </div>
        <div className="picked-count">
          Total picked: {draftState.pickedCards.length}
        </div>
      </div>
    </div>
  );
};

export default DraftInterface;