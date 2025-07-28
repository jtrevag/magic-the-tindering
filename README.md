# MTG Draft Simulator

A React-based Magic: The Gathering draft simulator that recreates the drafting experience with a "Tinder-style" pick-or-skip interface. Draft from a curated peasant cube of 5,700+ cards with timed decisions, skip rewards, and detailed statistics tracking.

## Features

- **Timed Draft Experience**: 15-second timer per pick creates authentic draft pressure
- **Smart Skip System**: ELO-based skip rewards encourage strategic decision making
- **Persistent State**: Draft progress automatically saved to continue later
- **Visual Statistics**: Color preference analysis with interactive pie charts
- **Responsive Design**: Optimized for both desktop and mobile play
- **Peasant Cube Format**: Curated collection of commons and uncommons with balanced power level

## How to Play

1. Start the app and begin your draft
2. Each card appears with a 15-second timer
3. **Pick** cards you want in your deck
4. **Skip** cards you don't want (limited skips available)
5. Earn bonus skips by skipping high-value cards
6. Complete your 40-card deck and view statistics

## Development

### Available Scripts

- `npm start` - Start development server (http://localhost:3000)
- `npm test` - Run tests in interactive watch mode  
- `npm run build` - Build for production
- `npm run deploy` - Deploy to GitHub Pages
- `npm run prepare` - Set up pre-commit hooks

### Tech Stack

- **React 19** with TypeScript for type safety
- **Framer Motion** for smooth animations
- **Recharts** for statistics visualization
- **usehooks-ts** for localStorage state management
- **Create React App** as the build foundation

### Project Structure

- `src/components/` - React components (DraftInterface, CardDisplay, Timer, StatsDisplay)
- `src/data/peasantCube.json` - Card database with Scryfall IDs and ELO ratings
- `src/types/Card.ts` - TypeScript type definitions
- `src/helpers/statsHelper.tsx` - Statistics calculation utilities
