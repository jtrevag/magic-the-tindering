export interface Card {
  name: string;
  scryfallId: string;
  manaCost: string;
  type: string;
  rarity: 'common' | 'uncommon';
  imageUrl?: string;
}

export interface DraftState {
  currentCardIndex: number;
  pickedCards: Card[];
  picksRemaining: number;
  isComplete: boolean;
}

export interface DraftSettings {
  timerSeconds: number;
  totalPicks: number;
  deckSize: number;
}