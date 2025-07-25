import { Card, DraftState, DraftSettings } from './Card';

describe('Card Types', () => {
  describe('Card interface', () => {
    test('creates valid Card with common rarity', () => {
      const card: Card = {
        name: 'Lightning Bolt',
        scryfallId: '6ce3aa6a-0b2c-49aa-a320-de7a0f085d52',
        manaCost: '{R}',
        type: 'Instant',
        rarity: 'common'
      };

      expect(card.name).toBe('Lightning Bolt');
      expect(card.scryfallId).toBe('6ce3aa6a-0b2c-49aa-a320-de7a0f085d52');
      expect(card.manaCost).toBe('{R}');
      expect(card.type).toBe('Instant');
      expect(card.rarity).toBe('common');
    });

    test('creates valid Card with uncommon rarity', () => {
      const card: Card = {
        name: 'Counterspell',
        scryfallId: '5062eeae-8480-4173-a977-d5cd46ee47c3',
        manaCost: '{UU}',
        type: 'Instant',
        rarity: 'uncommon'
      };

      expect(card.rarity).toBe('uncommon');
    });

    test('creates valid Card with optional imageUrl', () => {
      const card: Card = {
        name: 'Giant Growth',
        scryfallId: '06ec9e8b-4bd8-4caf-a559-6514b7ab4ca4',
        manaCost: '{G}',
        type: 'Instant',
        rarity: 'common',
        imageUrl: 'https://example.com/image.jpg'
      };

      expect(card.imageUrl).toBe('https://example.com/image.jpg');
    });
  });

  describe('DraftState interface', () => {
    test('creates valid DraftState', () => {
      const mockCard: Card = {
        name: 'Lightning Bolt',
        scryfallId: '6ce3aa6a-0b2c-49aa-a320-de7a0f085d52',
        manaCost: '{R}',
        type: 'Instant',
        rarity: 'common'
      };

      const draftState: DraftState = {
        currentCardIndex: 5,
        pickedCards: [mockCard],
        picksRemaining: 44,
        skipsRemaining: 10,
        isComplete: false
      };

      expect(draftState.currentCardIndex).toBe(5);
      expect(draftState.pickedCards).toHaveLength(1);
      expect(draftState.pickedCards[0]).toEqual(mockCard);
      expect(draftState.picksRemaining).toBe(44);
      expect(draftState.skipsRemaining).toBe(10);
      expect(draftState.isComplete).toBe(false);
    });

    test('creates valid completed DraftState', () => {
      const draftState: DraftState = {
        currentCardIndex: 45,
        pickedCards: [],
        picksRemaining: 0,
        skipsRemaining: 5,
        isComplete: true
      };

      expect(draftState.isComplete).toBe(true);
      expect(draftState.skipsRemaining).toBe(5);
      expect(draftState.picksRemaining).toBe(0);
    });
  });

  describe('DraftSettings interface', () => {
    test('creates valid DraftSettings', () => {
      const settings: DraftSettings = {
        timerSeconds: 30,
        totalPicks: 60,
        deckSize: 40
      };

      expect(settings.timerSeconds).toBe(30);
      expect(settings.totalPicks).toBe(60);
      expect(settings.deckSize).toBe(40);
    });

    test('creates DraftSettings with different values', () => {
      const settings: DraftSettings = {
        timerSeconds: 15,
        totalPicks: 45,
        deckSize: 40
      };

      expect(settings.timerSeconds).toBe(15);
      expect(settings.totalPicks).toBe(45);
      expect(settings.deckSize).toBe(40);
    });
  });
});