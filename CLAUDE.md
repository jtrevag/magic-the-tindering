# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start the development server (runs on http://localhost:3000)
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Build the app for production
- `npm run eject` - Eject from Create React App (one-way operation)
- `npm run prepare` - Set up Husky pre-commit hooks

## Project Architecture

This is a React-based Magic: The Gathering draft simulator built with TypeScript. The application simulates a "Tinder-style" drafting experience where users pick or skip cards with a timer, featuring skip rewards, local storage persistence, and draft statistics.

### Core Architecture

- **Single Page Application**: The main app (`src/App.tsx`) renders a single `DraftInterface` component
- **TypeScript Configuration**: Strict mode enabled with standard React settings
- **Data Source**: Card data is stored in `src/data/peasantCube.json` containing ~5,700+ MTG cards with Scryfall IDs, ELO ratings, and complete card information
- **Component Structure**: Modular components in `src/components/` with accompanying CSS and test files
- **State Persistence**: Uses `usehooks-ts` library for localStorage-based state management

### Key Components

- **DraftInterface** (`src/components/DraftInterface.tsx`): Main game logic component that handles:
  - Card shuffling and presentation using `array-shuffle`
  - Timer management (15-second default per pick)
  - Draft state with localStorage persistence
  - Pick/skip functionality with skip rewards system
  - End-of-draft statistics and summary
  - Animation states for picking/skipping
  
- **CardDisplay** (`src/components/CardDisplay.tsx`): Renders individual cards with:
  - Scryfall image integration with fallback handling
  - Card information display (name, mana cost, type, rarity)
  - Responsive design for mobile and desktop
  
- **Timer** (`src/components/Timer.tsx`): Countdown timer component with precise timing
  
- **StatsDisplay** (`src/components/StatsDisplay.tsx`): End-of-draft statistics visualization using:
  - Recharts library for pie chart color preference display
  - Color-coded MTG mana symbols

### Data Model

Core types defined in `src/types/Card.ts`:
- `Card`: MTG card with Scryfall ID, mana cost, type, rarity, colors array, and optional ELO rating
- `DraftState`: Current draft progress including picked cards, remaining picks/skips, completion status, and statistics
- `DraftSettings`: Configurable draft parameters (timer, total picks, deck size)
- `ColorPreference`: Color statistics with count and percentage data
- `Statistics`: Draft analytics including color preferences

### Draft Logic & Features

- **Card Pool**: ~5,700+ cards from peasant cube format (commons and uncommons)
- **Default Settings**: 15-second timer, 45 total picks, 10 skips, 40-card deck target
- **Skip Reward System**: Based on card ELO ratings:
  - Premium bombs (ELO ≥1650): +3 skips
  - Very strong cards (ELO ≥1500): +2 skips  
  - Strong cards (ELO ≥1350): +1 skip
  - Standard cards: +0 skips
- **State Persistence**: Draft progress, shuffled cards, and timer state saved to localStorage
- **Statistics**: Color preference analysis with visual pie chart display
- **Animation System**: Pick/skip animations with proper state management

### Helper Functions

- **statsHelper** (`src/helpers/statsHelper.tsx`): Calculates color preferences and draft statistics
- Comprehensive test coverage for components and utilities

## Current State

### ✅ Implemented Features
- **Complete Draft System**: Full pick/skip mechanics with timer
- **Skip Rewards**: ELO-based skip reward system for strategic play
- **State Persistence**: localStorage integration for draft continuation
- **Statistics Display**: Color preference analysis with Recharts visualization
- **Animation System**: Smooth pick/skip animations with proper state management
- **Responsive Design**: Mobile and desktop optimized layouts
- **Testing Suite**: Comprehensive test coverage with React Testing Library
- **Development Tooling**: ESLint, Husky pre-commit hooks, and lint-staged

### 🔧 Technical Implementation
- Modified recent cards display system (no longer using RecentCard interface)
- Integrated `usehooks-ts` for localStorage state management
- Added `framer-motion` and `motion` libraries for advanced animations
- Implemented comprehensive testing with Jest and React Testing Library
- Set up Vercel deployment workflow
- Added Husky pre-commit hooks for code quality

### 🚀 Future Enhancement Ideas
1. **Main Menu**: Create a main menu screen where users can start a new draft game
2. **Quit Game Feature**: Add ability to quit/forfeit a game in progress and return to main menu
3. **End Game Card Gallery**: Display all picked cards as images at the end of the draft for final review
4. **Keyboard Navigation**: Add left/right arrow key support for swiping cards (left = skip, right = pick)
5. **Mobile Layout Optimization**: Reorganize mobile view to show card interface above the recent cards decklist
6. **Performance Testing**: Test with rapid card picking to ensure smooth animations
7. **Visual Polish**: Consider adding subtle glow/shadow effects to recent cards
8. **Audio Feedback**: Add sound effects for pick/skip/card rotation
9. **Accessibility**: Add ARIA labels and keyboard navigation for recent cards
10. **Configuration**: Make recent card count configurable
11. **Card Preview**: Add hover effects to show larger version of recent cards
12. **Undo Feature**: Allow undoing last pick (would need to restore recent cards state)

### External Dependencies

- **Core**: React 19, TypeScript, Create React App
- **UI/Animation**: framer-motion, motion  
- **Data**: array-shuffle for card randomization
- **Charts**: recharts for statistics visualization
- **State**: usehooks-ts for localStorage hooks
- **Testing**: @testing-library suite with Jest
- **Deployment**: Vercel with automatic deployments
- **Development**: Husky, lint-staged for pre-commit hooks
- **Images**: Scryfall API for card images via Scryfall IDs

## Coding Guidelines

- **TypeScript Best Practices**:
  - Act as an expert in TypeScript, writing code that prioritizes good typing and clearing all errors
  - Use strict typing wherever possible
  - Leverage TypeScript's advanced type features like union types, intersection types, and generics
  - Minimize the use of `any` type
  - Prefer type inference where clear, but explicitly define types for complex structures
  - Use type guards and type narrowing to improve type safety
  - Implement exhaustive type checking with discriminated unions
  - Write type-safe functions with clear input and output type definitions

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.