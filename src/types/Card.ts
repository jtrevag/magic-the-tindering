export interface Card {
  name: string;
  scryfallId: string;
  manaCost: string;
  type: string;
  rarity: 'common' | 'uncommon';
  elo?: number;
  imageUrl?: string;
}

export interface DraftState {
  currentCardIndex: number;
  pickedCards: Card[];
  picksRemaining: number;
  skipsRemaining: number;
  isComplete: boolean;
}

export interface DraftSettings {
  timerSeconds: number;
  totalPicks: number;
  deckSize: number;
}