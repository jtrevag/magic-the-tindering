import React from 'react';
import { render, screen } from '@testing-library/react';
import CardDisplay from './CardDisplay';
import { Card } from '../types/Card';

const mockCard: Card = {
  name: 'Lightning Bolt',
  scryfallId: '6ce3aa6a-0b2c-49aa-a320-de7a0f085d52',
  manaCost: '{R}',
  colors: ["R"],
  type: 'Instant',
  rarity: 'common',
  elo: 1200
};

describe('CardDisplay', () => {
  test('renders card name', () => {
    render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('Lightning Bolt')).toBeInTheDocument();
  });

  test('renders card mana cost', () => {
    render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('{R}')).toBeInTheDocument();
  });

  test('renders card type', () => {
    render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('Instant')).toBeInTheDocument();
  });

  test('renders card strength', () => {
    render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('Strength: C')).toBeInTheDocument();
  });

  test('renders card image with correct src', () => {
    render(<CardDisplay card={mockCard} />);
    const image = screen.getByAltText('Lightning Bolt') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe('https://cards.scryfall.io/normal/front/6/c/6ce3aa6a-0b2c-49aa-a320-de7a0f085d52.jpg');
  });

  test('applies correct strength class', () => {
    render(<CardDisplay card={mockCard} />);
    const strengthElement = screen.getByText('Strength: C');
    expect(strengthElement).toHaveClass('card-strength', 'strength-c');
  });

  test('renders high-elo card with S strength', () => {
    const highEloCard: Card = { ...mockCard, elo: 1700 };
    render(<CardDisplay card={highEloCard} />);
    const strengthElement = screen.getByText('Strength: S');
    expect(strengthElement).toHaveClass('card-strength', 'strength-s');
  });

  test('renders skip reward for high-elo cards', () => {
    const highEloCard: Card = { ...mockCard, elo: 1700 };
    render(<CardDisplay card={highEloCard} />);
    expect(screen.getByText('Skip: +3')).toBeInTheDocument();
  });

  test('renders pick reward for low-elo cards', () => {
    const lowEloCard: Card = { ...mockCard, elo: 1000 };
    render(<CardDisplay card={lowEloCard} />);
    expect(screen.getByText('Pick: +1 skip')).toBeInTheDocument();
  });
});