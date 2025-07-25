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
  rarity: 'common'
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

  test('renders card rarity', () => {
    render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('common')).toBeInTheDocument();
  });

  test('renders card image with correct src', () => {
    render(<CardDisplay card={mockCard} />);
    const image = screen.getByAltText('Lightning Bolt') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe('https://cards.scryfall.io/normal/front/6/c/6ce3aa6a-0b2c-49aa-a320-de7a0f085d52.jpg');
  });

  test('applies correct rarity class', () => {
    render(<CardDisplay card={mockCard} />);
    const rarityElement = screen.getByText('common');
    expect(rarityElement).toHaveClass('card-rarity', 'rarity-common');
  });

  test('renders uncommon rarity correctly', () => {
    const uncommonCard: Card = { ...mockCard, rarity: 'uncommon' };
    render(<CardDisplay card={uncommonCard} />);
    const rarityElement = screen.getByText('uncommon');
    expect(rarityElement).toHaveClass('card-rarity', 'rarity-uncommon');
  });
});