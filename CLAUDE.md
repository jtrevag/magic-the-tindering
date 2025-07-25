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
- **NEW: Recent Cards Display** - Last 5 picked cards display on the right side with:
  - Opacity gradient: 100% → 84% → 68% → 52% → 36% → 20%
  - Progressive positioning and rotation for visual depth
  - Smooth exit animation when 6th card pushes oldest off screen
- Draft completes when pick limit is reached

## Recent Updates (Session End)

### ✅ Completed Features
- **Recent Cards Display**: Implemented visual card history with 5-card limit
- **Opacity Gradients**: Cards fade from 100% to 20% opacity as they age  
- **Positioning System**: Cards display with increasing X offset and rotation
- **Exit Animations**: Smooth 300ms animation when cards rotate off screen
- **State Management**: Added RecentCard interface with unique IDs for animations
- **Fixed React Hooks**: Resolved ESLint warning with useCallback for handleSkip

### 🔧 Technical Implementation
- Modified `DraftInterface.tsx` to track recent cards with unique IDs
- Added exit animation state management with setTimeout cleanup
- Updated CSS with fixed positioning for card display effect
- Cards positioned on right side with transform-origin bottom right
- Mobile responsive adjustments for smaller screens

### 🚀 Next Steps / Future Enhancements
1. **Main Menu**: Create a main menu screen where users can start a new draft game
2. **Game State Persistence**: Save draft progress to cookies or localStorage so users must complete their current game
3. **Quit Game Feature**: Add ability to quit/forfeit a game in progress and return to main menu
4. **End Game Card Gallery**: Display all picked cards as images at the end of the draft for final review
5. **Keyboard Navigation**: Add left/right arrow key support for swiping cards (left = skip, right = pick)
6. **Mobile Layout Optimization**: Reorganize mobile view to show card interface above the recent cards decklist
7. **Performance Testing**: Test with rapid card picking to ensure smooth animations
8. **Visual Polish**: Consider adding subtle glow/shadow effects to recent cards
9. **Audio Feedback**: Add sound effects for pick/skip/card rotation
10. **Accessibility**: Add ARIA labels and keyboard navigation for recent cards
11. **Configuration**: Make recent card count (currently 5) configurable
12. **Card Preview**: Add hover effects to show larger version of recent cards
13. **Statistics**: Track and display pick timing statistics
14. **Undo Feature**: Allow undoing last pick (would need to restore recent cards state)

### External Dependencies

- **Scryfall API**: Card images fetched dynamically using Scryfall ID patterns
- **React 19**: Latest React with TypeScript support
- **Create React App**: Standard CRA setup with ESLint configuration

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