# MTG Tinder Draft - Game Design Document

## Core Concept
A Magic: The Gathering deckbuilding application that combines Tinder-style swiping mechanics with competitive drafting, creating risk/reward decisions around highly-contested cards.

## Game Modes

### Mode 1: Solo Deckbuilding Assistant
**Target**: Casual deck builders seeking recommendations
- Player selects a commander
- App presents ~500 EDHREC suggestions via swipe interface
- Preferences can be set (mana cost, subthemes, etc.)
- **Scoring Options**:
  - Synergy calculations
  - Mana curve optimization  
  - Bracket power level matching (2-4 scale)
- **Outcome**: Personalized deck recommendations with performance metrics

### Mode 2: Competitive Tinder Draft (Primary Focus)
**Target**: Players wanting a novel limited format experience

#### Setup
- **Card Pool**: 500 unique cards (cube-style, no duplicates)
- **Players**: Multiple players draft simultaneously 
- **Pick Budget**: 100 swipes per player
- **Deck Requirement**: Must draft exactly 40 cards for play

#### Core Mechanics

**Swiping Phase**:
- Players see one random card at a time
- Swipe right to "like" (spend 1/100 picks)
- Swipe left to pass (no cost)
- No card information about pick rates during drafting

**Matching Algorithm**:
- After all players complete swiping, algorithm determines matches
- Cards develop "pickiness" based on total swipes received
- Higher-picked cards have lower match probability
- System ensures each player receives close to 40 cards

**Risk/Reward Dynamic**:
- Popular cards (like format staples) become harder to obtain
- Players must decide whether to "waste" picks on contested cards
- Creates prisoner's dilemma scenarios

#### Balancing Mechanisms
- **Minimum Deck Size Guarantee**: If player doesn't reach 40 cards through matches, auto-fill from remaining pool
- **Pick Limits**: Optional left-swipe limits to prevent infinite browsing
- **Pool Size Scaling**: Larger pools (1000+ cards) increase randomness and reduce perfect information

## Technical Requirements

### Card Database Integration
- EDHREC API integration for recommendations
- Comprehensive MTG card database
- Real-time pickiness calculations

### User Interface
- Smooth swipe mechanics (touch/mouse)
- Card image display with zoom
- Pick counter and progress tracking
- Deck builder interface post-draft

### Multiplayer Infrastructure
- Simultaneous drafting sessions
- Matchmaking for draft pods
- Real-time pick tracking without revealing information

## Monetization Considerations
- Premium commanders/card pools
- Advanced analytics and deck insights
- Tournament modes with entry fees
- Cosmetic customizations

## Development Phases

**Phase 1**: Solo mode with basic swiping and EDHREC integration
**Phase 2**: Multiplayer drafting with matching algorithm
**Phase 3**: Advanced scoring systems and tournament features

## Open Design Questions
1. **Optimal pick budget** - 100 may be too high/low
2. **Pickiness curve** - How aggressively should match rates decrease?
3. **Alternative mechanics** - Bidding systems vs. swiping
4. **Deck construction** - 40-card limited vs. 100-card Commander decks
5. **Meta evolution** - How to prevent stale card pools over time

## Success Metrics
- Player retention in draft modes
- Deck diversity (avoiding solved metas)
- Positive feedback on recommendation quality
- Competitive balance in draft outcomes

---

*Note: This design synthesizes ideas from both conversation participants, with Mode 2 representing the primary innovative concept discussed.*