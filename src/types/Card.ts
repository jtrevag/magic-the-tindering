export interface Card {
  name: string;
  scryfallId: string;
  manaCost: string;
  type: string;
  rarity: 'common' | 'uncommon';
  colors: string[];
  elo?: number;
  imageUrl?: string;
}

export interface DraftState {
  currentCardIndex: number;
  pickedCards: Card[];
  picksRemaining: number;
  skipsRemaining: number;
  isComplete: boolean;
  stats: Statistics | null;
}

export interface DraftSettings {
  timerSeconds: number;
  totalPicks: number;
  deckSize: number;
}

export interface ColorPreference {
  color: string;
  count: number;
  percentage: number;
}

export interface Statistics {
  colorPrefs: ColorPreference[]
}
