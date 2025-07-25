import React, { useState, useEffect, useCallback } from 'react';
import { Card, DraftState, DraftSettings } from '../types/Card';
import peasantCube from '../data/peasantCube.json';
import CardDisplay from './CardDisplay';
import Timer from './Timer';
import './DraftInterface.css';
import arrayShuffle from 'array-shuffle';
import { calculateStats } from '../helpers/statsHelper';
import StatsDisplay from './StatsDisplay';
import { useLocalStorage } from 'usehooks-ts';

// Removed RecentCard interface - now using direct picked cards display

const defaultSettings: DraftSettings = {
  timerSeconds: 15,
  totalPicks: 45,
  deckSize: 40
};

const getSkipReward = (elo: number): number => {
  if (elo >= 1650) return 3; // Premium bombs (3.7% of cards)
  if (elo >= 1500) return 2; // Very strong cards (6.1% of cards)
  if (elo >= 1350) return 1; // Strong cards (12% of cards)
  return 0; // Standard cards (75% of cards)
};

const DraftInterface: React.FC = () => {
  const [draftState, setDraftState, removeDraftState] = useLocalStorage<DraftState>('draft-state', {
    currentCardIndex: 0,
    pickedCards: [],
    picksRemaining: defaultSettings.totalPicks,
    skipsRemaining: 10,
    isComplete: false,
    stats: null,
  });

  const [shuffledCards, setShuffledCards, removeShuffledCards] = useLocalStorage<Card[]>('shuffled-cards', []);
  const [timeRemaining, setTimeRemaining, removeTimeRemaining] = useLocalStorage('time-remaining', defaultSettings.timerSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [triggerPickAnimation, setTriggerPickAnimation] = useState(false);
  const [triggerSkipAnimation, setTriggerSkipAnimation] = useState(false);
  
  const shuffleCards = useCallback(() => {
    console.log('DraftInterface: peasantCube length:', (peasantCube as Card[]).length);
    const shuffled = arrayShuffle([...(peasantCube as Card[])]);
    console.log('DraftInterface: shuffled cards length:', shuffled.length);
    setShuffledCards(shuffled);
  }, [setShuffledCards]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('DraftState changed:', draftState);
  }, [draftState]);

  // Shuffle cards on component mount
  useEffect(() => {
    console.log('DraftInterface: Component mounting');
    if(shuffledCards.length === 0) {
      shuffleCards();
    }
    setIsTimerRunning(true);
    console.log('DraftInterface: Initial setup complete');
  }, [shuffleCards, shuffledCards.length]);

  const handlePick = useCallback(() => {
    if (draftState.isComplete || draftState.currentCardIndex >= shuffledCards.length || isPicking) return;

    setIsPicking(true);
    
    setTimeout(() => {
      const currentCard = shuffledCards[draftState.currentCardIndex];
      const newPickedCards = [...draftState.pickedCards, currentCard];
      const newPicksRemaining = draftState.picksRemaining - 1;
      const skipReward = getSkipReward(currentCard?.elo || 0);

      const nextIndex = draftState.currentCardIndex + 1;
      const isComplete = newPicksRemaining === 0 || nextIndex >= shuffledCards.length;

      const stats = calculateStats(newPickedCards)
      
      setDraftState({
        currentCardIndex: nextIndex,
        pickedCards: newPickedCards,
        picksRemaining: newPicksRemaining,
        // Only grant +1 skip if card gives no skip reward (low-ELO cards)
        skipsRemaining: skipReward === 0 ? draftState.skipsRemaining + 1 : draftState.skipsRemaining,
        isComplete,
        stats,
      });

      if (newPicksRemaining === 0) {
        setIsTimerRunning(false);
      } else {
        setTimeRemaining(defaultSettings.timerSeconds);
      }
      setIsPicking(false);
      setTriggerPickAnimation(false);
    }, 250);
  }, [draftState.isComplete, draftState.currentCardIndex, draftState.picksRemaining, draftState.skipsRemaining, draftState.pickedCards, shuffledCards, isPicking, setDraftState, setTimeRemaining]);

  const handlePickButton = useCallback(() => {
    if (draftState.isComplete || draftState.currentCardIndex >= shuffledCards.length || isPicking) return;
    setTriggerPickAnimation(true);
  }, [draftState.isComplete, draftState.currentCardIndex, shuffledCards.length, isPicking]);

  const handleSkip = useCallback(() => {
    if (draftState.isComplete || draftState.currentCardIndex >= shuffledCards.length || isSkipping || draftState.skipsRemaining === 0) return;

    setIsSkipping(true);
    
    setTimeout(() => {
      const currentCard = shuffledCards[draftState.currentCardIndex];
      const skipReward = getSkipReward(currentCard?.elo || 0);
      const nextIndex = draftState.currentCardIndex + 1;
      const isComplete = nextIndex >= shuffledCards.length || draftState.picksRemaining === 0;
      
      setDraftState(prev => ({
        ...prev,
        currentCardIndex: nextIndex,
        // If card gives skip reward, don't decrement skip count, just add reward
        // If card gives no reward, decrement skip count by 1
        skipsRemaining: skipReward > 0 
          ? prev.skipsRemaining + skipReward 
          : prev.skipsRemaining - 1,
        isComplete
      }));

      setTimeRemaining(defaultSettings.timerSeconds);
      setIsSkipping(false);
      setTriggerSkipAnimation(false);
    }, 250);
  }, [draftState.isComplete, draftState.currentCardIndex, draftState.picksRemaining, draftState.skipsRemaining, shuffledCards, isSkipping, setDraftState, setTimeRemaining]);

  const handleSkipButton = useCallback(() => {
    if (draftState.isComplete || draftState.currentCardIndex >= shuffledCards.length || isSkipping || draftState.skipsRemaining === 0) return;
    setTriggerSkipAnimation(true);
  }, [draftState.isComplete, draftState.currentCardIndex, shuffledCards.length, isSkipping, draftState.skipsRemaining]);

  const resetDraft = useCallback(() => {
    removeDraftState();
    removeShuffledCards();
    removeTimeRemaining();
    shuffleCards();
  }, [removeDraftState, removeShuffledCards, removeTimeRemaining, shuffleCards]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0 && !draftState.isComplete) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handlePick();
            return defaultSettings.timerSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, draftState.isComplete, handlePick, setTimeRemaining]);

  

  const getCurrentCard = (): Card | null => {
    console.log('getCurrentCard: currentCardIndex:', draftState.currentCardIndex);
    console.log('getCurrentCard: shuffledCards.length:', shuffledCards.length);
    console.log('getCurrentCard: isComplete:', draftState.isComplete);
    console.log('getCurrentCard: picksRemaining:', draftState.picksRemaining);
    
    // If we've run out of cards, complete the draft
    if (draftState.currentCardIndex >= shuffledCards.length) {
      console.log('getCurrentCard: Ran out of cards, completing draft');
      if (!draftState.isComplete) {
        setDraftState(prev => ({ ...prev, isComplete: true }));
      }
      return null;
    }
    if (draftState.isComplete) {
      console.log('getCurrentCard: Draft already complete');
      return null;
    }
    const card = shuffledCards[draftState.currentCardIndex];
    console.log('getCurrentCard: Returning card:', card?.name);
    return card;
  };

  // Don't call getCurrentCard until cards are loaded
  if (shuffledCards.length === 0) {
    return <div className="loading">Loading cards...</div>;
  }

  const currentCard = getCurrentCard();

  if (draftState.isComplete) {
    return (
      <div className="draft-complete">
        <h2>Draft Complete!</h2>
        <p>You picked {draftState.pickedCards.length} cards</p>
        <button 
          className="pick-button" 
          onClick={resetDraft}
        >
          Start a new Draft?
        </button>
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

      <StatsDisplay stats={draftState.stats} />

      <div className="draft-main-content">
        <div className="draft-header">
          <div className="picks-counter">
            Picks remaining: {draftState.picksRemaining}
          </div>
          <div className="skips-counter">
            Skips remaining: {draftState.skipsRemaining}
          </div>
          <Timer seconds={timeRemaining} />
        </div>
        
        <CardDisplay card={currentCard} handleSkip={handleSkip} handlePick={handlePick} isSkipping={isSkipping} isPicking={isPicking} triggerPickAnimation={triggerPickAnimation} triggerSkipAnimation={triggerSkipAnimation} />
        
        <div className="draft-actions">
          <button 
            className="skip-button" 
            onClick={handleSkipButton}
            disabled={draftState.isComplete || draftState.skipsRemaining === 0}
          >
            Skip ({draftState.skipsRemaining})
          </button>
          <button 
            className="pick-button" 
            onClick={handlePickButton}
            disabled={draftState.isComplete}
          >
            Pick
          </button>
          <button 
            className="reset-button" 
            onClick={resetDraft}
          >
            Reset Draft
          </button>
        </div>
      </div>

      <div className="deck-sidebar">
        <div className="deck-header">
          <h3>Your Deck ({draftState.pickedCards.length}/{defaultSettings.totalPicks})</h3>
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
          {Array.from({ length: Math.max(0, defaultSettings.totalPicks - draftState.pickedCards.length) }).map((_, index) => (
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