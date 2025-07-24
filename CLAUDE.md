# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start the development server (runs on http://localhost:3000)
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Build the app for production
- `npm run eject` - Eject from Create React App (one-way operation)

## Project Architecture

This is a React-based Magic: The Gathering draft simulator built with TypeScript. The application simulates a "Tinder-style" drafting experience where users pick or skip cards with a timer.

### Core Architecture

- **Single Page Application**: The main app (`src/App.tsx`) renders a single `DraftInterface` component
- **TypeScript Configuration**: Strict mode enabled with standard React settings
- **Data Source**: Card data is stored in `src/data/peasantCube.json` containing MTG card information with Scryfall IDs
- **Component Structure**: Modular components in `src/components/` with accompanying CSS files

### Key Components

- **DraftInterface** (`src/components/DraftInterface.tsx`): Main game logic component that handles:
  - Card shuffling and presentation
  - Timer management (15-second default per pick)
  - Draft state (picks remaining, selected cards)
  - Pick/skip functionality
  - End-of-draft summary
  
- **CardDisplay** (`src/components/CardDisplay.tsx`): Renders individual cards with:
  - Scryfall image integration with fallback handling
  - Card information display (name, mana cost, type, rarity)
  
- **Timer** (`src/components/Timer.tsx`): Countdown timer component

### Data Model

Core types defined in `src/types/Card.ts`:
- `Card`: MTG card with Scryfall ID, mana cost, type, and rarity
- `DraftState`: Current draft progress and selections  
- `DraftSettings`: Configurable draft parameters (timer, total picks, deck size)

### Draft Logic

- Cards are shuffled from the peasant cube data on component mount
- Default settings: 15-second timer, 45 total picks, 40-card deck target
- Timer auto-skips cards when time expires
- Recent picks (last 5) are displayed with small card images
- Draft completes when pick limit is reached

### External Dependencies

- **Scryfall API**: Card images fetched dynamically using Scryfall ID patterns
- **React 19**: Latest React with TypeScript support
- **Create React App**: Standard CRA setup with ESLint configuration