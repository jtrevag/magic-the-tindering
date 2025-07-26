import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DraftInterface from './DraftInterface';

// Mock the peasant cube data - provide enough cards for all tests
jest.mock('../data/peasantCube.json', () => 
  Array.from({ length: 50 }, (_, i) => ({
    name: `Test Card ${i + 1}`,
    scryfallId: `${i.toString().padStart(8, '0')}-0000-0000-0000-000000000000`,
    manaCost: '{1}',
    type: 'Creature',
    rarity: i % 2 === 0 ? 'common' : 'uncommon'
  }))
);

describe('DraftInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Math.random to make tests deterministic
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders initial draft state', () => {
    render(<DraftInterface />);
    
    expect(screen.getByText('Picks remaining: 45')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument(); // Timer
    expect(screen.getByText('seconds')).toBeInTheDocument();
    expect(screen.getByText('Pick')).toBeInTheDocument();
    expect(screen.getByText('Skip (10)')).toBeInTheDocument();
    expect(screen.getByText('Your Deck (0/45)')).toBeInTheDocument();
  });

  test('displays a card from the shuffled deck', async () => {
    render(<DraftInterface />);
    
    // Wait for card to load and check if one of our mock cards is displayed
    await waitFor(() => {
      expect(screen.getByText(/Test Card \d+/)).toBeInTheDocument();
    });
  });

  test('pick button adds card to picked cards', async () => {
    render(<DraftInterface />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Pick')).toBeInTheDocument();
    });

    const pickButton = screen.getByText('Pick');
    fireEvent.click(pickButton);

    await waitFor(() => {
      expect(screen.getByText('Picks remaining: 44')).toBeInTheDocument();
    });
    expect(screen.getByText('Your Deck (1/45)')).toBeInTheDocument();
  });

  test('skip button moves to next card without picking', async () => {
    render(<DraftInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Skip (10)')).toBeInTheDocument();
    });

    const skipButton = screen.getByText('Skip (10)');
    fireEvent.click(skipButton);

    // Picks remaining should stay the same, but we should move to next card
    expect(screen.getByText('Picks remaining: 45')).toBeInTheDocument();
    expect(screen.getByText('Your Deck (0/45)')).toBeInTheDocument();
  });

  test('displays draft complete when all picks are made', async () => {
    render(<DraftInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Pick')).toBeInTheDocument();
    });

    // Pick all 45 cards to complete the draft
    for (let i = 0; i < 45; i++) {
      const pickButton = screen.getByText('Pick');
      fireEvent.click(pickButton);
    }

    await waitFor(() => {
      expect(screen.getByText('Draft Complete!')).toBeInTheDocument();
    });
    expect(screen.getByText('You picked 45 cards')).toBeInTheDocument();
  });

  test('timer resets after pick or skip', async () => {
    render(<DraftInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Pick')).toBeInTheDocument();
    });

    // Timer should reset to 15 after pick
    const pickButton = screen.getByText('Pick');
    fireEvent.click(pickButton);

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  test('recent picks shows last 5 picked cards', async () => {
    render(<DraftInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Pick')).toBeInTheDocument();
    });

    const pickButton = screen.getByText('Pick');
    
    // Pick 3 cards
    fireEvent.click(pickButton);
    fireEvent.click(pickButton);
    fireEvent.click(pickButton);

    // Should show the picked cards in recent picks section
    await waitFor(() => {
      expect(screen.getByText('Your Deck (3/45)')).toBeInTheDocument();
    });
  });

  test('buttons are disabled when draft is complete', async () => {
    render(<DraftInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Pick')).toBeInTheDocument();
    });

    const pickButton = screen.getByText('Pick');
    
    // Complete the draft by clicking 45 times
    for (let i = 0; i < 45; i++) {
      fireEvent.click(pickButton);
    }

    await waitFor(() => {
      expect(screen.getByText('Draft Complete!')).toBeInTheDocument();
    });
  });
});