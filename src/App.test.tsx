import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the peasant cube data to make test deterministic
jest.mock('./data/peasantCube.json', () => [
  {
    name: 'Lightning Bolt',
    scryfallId: '6ce3aa6a-0b2c-49aa-a320-de7a0f085d52',
    manaCost: '{R}',
    type: 'Instant',
    rarity: 'common'
  }
]);

test('renders draft interface', () => {
  render(<App />);
  expect(screen.getByText('Picks remaining: 45')).toBeInTheDocument();
  expect(screen.getByText('Pick')).toBeInTheDocument();
  expect(screen.getByText('Skip (10)')).toBeInTheDocument();
});
