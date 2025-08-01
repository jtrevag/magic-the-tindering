# CubeCobra Integration Upgrade Plan

## Project Overview

This document outlines the incremental plan to upgrade the Magic: The Gathering Tinder Draft Simulator to support importing cube lists from CubeCobra. The goal is to allow users to copy/paste a CubeCobra cube URL and draft with that specific cube instead of the hardcoded peasant cube.

## Updated Requirements

- **ELO Ratings**: CubeCobra cubes will have ELO ratings available (walkthrough needed for extraction process)
- **Cube Size Limit**: Support cubes up to 600 cards maximum
- **Proxy Service**: Can add simple proxy service similar to existing PDF generation
- **Mobile-First**: Prioritize mobile experience with desktop support

## Current State Analysis

### Existing Architecture
- **Frontend**: React 19 + TypeScript SPA
- **State Management**: localStorage with usehooks-ts
- **Data Source**: Static JSON file (`src/data/peasantCube.json`) with ~5,700 cards
- **Card Data**: Each card has: name, scryfallId, manaCost, type, rarity, colors, elo
- **No Backend**: Pure client-side application deployed to GitHub Pages
- **No Database**: All data stored in static JSON and localStorage

### Current Data Flow
1. App loads → reads peasantCube.json → shuffles cards → starts draft
2. Cards displayed with Scryfall images via scryfallId
3. Draft state persisted to localStorage
4. ELO ratings used for skip reward calculations

## Target Architecture

### Phase 1: Database Setup & Card Data Management
**Goal**: Establish data infrastructure for dynamic cube management

#### 1.1 Database Technology Selection
**Recommended**: **IndexedDB with Dexie.js**
- **Pros**: Client-side, no backend required, maintains GitHub Pages deployment
- **Cons**: Limited to browser storage, no server-side persistence
- **Alternative**: Firebase Firestore (requires backend setup)

#### 1.2 Database Schema Design
```typescript
// Core Tables
interface CubeList {
  id: string;                    // CubeCobra cube ID
  name: string;                  // Cube name
  description?: string;          // Cube description
  cards: string[];              // Array of card names/IDs
  lastUpdated: Date;            // Cache timestamp
  isDefault?: boolean;          // Mark default cube
}

interface CardDatabase {
  scryfallId: string;           // Primary key
  name: string;                 // Card name
  manaCost: string;             // Mana cost
  type: string;                 // Card type
  rarity: string;               // Card rarity
  colors: string[];             // Color identity
  elo?: number;                 // ELO rating (optional)
  imageUrl?: string;            // Cached image URL
  lastUpdated: Date;            // Cache timestamp
}

interface UserSettings {
  defaultCubeId?: string;       // User's preferred cube
  recentCubes: string[];        // Recently used cubes
}
```

#### 1.3 Data Access Layer
```typescript
// src/services/DatabaseService.ts
class DatabaseService {
  // Cube management
  saveCube(cube: CubeList): Promise<void>
  getCube(id: string): Promise<CubeList | null>
  listCubes(): Promise<CubeList[]>
  deleteCube(id: string): Promise<void>
  
  // Card management
  saveCards(cards: CardDatabase[]): Promise<void>
  getCard(scryfallId: string): Promise<CardDatabase | null>
  getCards(scryfallIds: string[]): Promise<CardDatabase[]>
  
  // Cache management
  clearOldCache(olderThan: Date): Promise<void>
}
```

### Phase 2: CubeCobra Integration
**Goal**: Implement CubeCobra API integration and data import

#### 2.1 CubeCobra API Client
```typescript
// src/services/CubeCobraService.ts
interface CubeCobraAPI {
  fetchCubeList(cubeId: string): Promise<CubeCobraResponse>
  extractCubeId(url: string): string | null
  validateCubeId(cubeId: string): boolean
}

interface CubeCobraResponse {
  // Structure based on API research - need to validate actual format
  cards: Array<{
    name: string;
    // Other properties from CubeCobra
  }>;
  // Other cube metadata
}
```

#### 2.2 Scryfall Integration Service
```typescript
// src/services/ScryfallService.ts
interface ScryfallAPI {
  searchCardsByName(names: string[]): Promise<ScryfallCard[]>
  getCardById(scryfallId: string): Promise<ScryfallCard>
  bulkCardLookup(identifiers: CardIdentifier[]): Promise<ScryfallCard[]>
}
```

#### 2.3 Card Resolution Pipeline
```typescript
// src/services/CardResolutionService.ts
class CardResolutionService {
  async resolveCubeCards(cubeCobraCards: CubeCobraCard[]): Promise<CardDatabase[]> {
    // 1. Validate cube size (max 600 cards)
    if (cubeCobraCards.length > 600) {
      throw new Error(`Cube too large: ${cubeCobraCards.length} cards (max 600)`);
    }
    
    // 2. Check local cache first
    // 3. Extract ELO ratings from CubeCobra data (walkthrough needed)
    // 4. Query Scryfall for missing card details
    // 5. Transform to internal format with ELO preserved
    // 6. Cache results
    // 7. Return resolved cards with ELO ratings
  }
}

interface CubeCobraCard {
  name: string;
  elo?: number;  // CubeCobra provides ELO - extraction walkthrough needed
  // Other CubeCobra-specific fields (structure TBD)
}
```

### Phase 3: User Interface Updates
**Goal**: Add cube import/selection UI

#### 3.1 Cube Management Interface
```typescript
// src/components/CubeSelector.tsx
interface CubeSelectorProps {
  onCubeSelected: (cube: CubeList) => void;
  currentCube?: CubeList;
}

// Features:
// - Input field for CubeCobra URL/ID
// - List of saved/recent cubes
// - Default cube selection
// - Delete/manage cubes
```

#### 3.2 Main Menu Enhancement
```typescript
// src/components/MainMenu.tsx (new component)
// Features:
// - Start draft with selected cube
// - Cube management
// - Settings
// - About/Help
```

#### 3.3 Loading States & Error Handling
```typescript
// src/components/CubeImport.tsx
// Features:
// - Import progress indicator
// - Error messages for invalid URLs/IDs
// - Retry mechanisms
// - Cache status indicators
```

### Phase 4: Draft Engine Updates
**Goal**: Modify draft logic to work with dynamic cubes

#### 4.1 Dynamic Card Loading
```typescript
// src/hooks/useCubeData.ts
interface UseCubeDataReturn {
  cards: Card[];
  loading: boolean;
  error: string | null;
  refreshCube: () => Promise<void>;
}

// Replace static import with dynamic loading
// Handle loading states during cube switching
```

#### 4.2 ELO Rating Strategy
**Challenge**: CubeCobra cubes may not have ELO ratings
**Solutions**:
1. **Default ELO**: Assign default ELO based on rarity/card type
2. **Community ELO**: Integrate with external rating services
3. **Disable Skip Rewards**: Make skip rewards optional when ELO unavailable
4. **User ELO**: Allow users to manually assign ratings

#### 4.3 Backward Compatibility
```typescript
// Ensure existing peasant cube still works
// Migration path for existing localStorage data
// Default fallback when no cubes available
```

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
1. **Database Setup**
   - Install Dexie.js
   - Create database schema
   - Implement DatabaseService
   - Write unit tests

2. **Data Migration**
   - Convert peasantCube.json to database
   - Create migration utilities
   - Test data integrity

### Phase 2: API Integration (Week 2-3)
1. **CubeCobra Integration**
   - Research actual API response format
   - Implement CubeCobraService
   - Handle CORS issues (may need proxy)
   - Add error handling

2. **Scryfall Integration**
   - Implement ScryfallService
   - Add rate limiting
   - Implement bulk lookup optimization
   - Add caching strategy

### Phase 3: UI Development (Week 3-4) - Mobile-First
1. **Cube Management UI**
   - Create mobile-first CubeSelector component
   - Add cube import workflow optimized for touch
   - Implement cube list management with mobile UX
   - Add validation and error states for mobile
   - Ensure 600 card limit validation in UI

2. **Main Menu Redesign - Mobile-First**
   - Create mobile-first MainMenu component
   - Update app routing/navigation for mobile
   - Add settings management with touch-friendly controls
   - Implement responsive design (mobile → desktop)

### Phase 4: Integration & Testing (Week 4-5)
1. **Draft Engine Updates**
   - Modify DraftInterface for dynamic cubes
   - Update card loading logic
   - Handle ELO rating scenarios
   - Test with various cube sizes

2. **Performance & Polish**
   - Optimize card loading performance
   - Add progressive loading
   - Implement cache management
   - Add analytics/metrics

## Technical Considerations

### CORS Issues & Proxy Service
CubeCobra API may have CORS restrictions. **Solution**: Create simple proxy service similar to existing PDF generation pattern:

```typescript
// Similar to existing pdfGenerator.ts pattern
// src/services/CubeCobraProxy.ts
class CubeCobraProxy {
  private static readonly PROXY_ENDPOINT = '/api/cubecobra-proxy';
  
  static async fetchCubeData(cubeId: string): Promise<CubeCobraResponse> {
    // Proxy CubeCobra API calls through our service
    // Handle CORS and rate limiting
    // Validate 600 card limit
  }
}
```

**Deployment Options**:
1. **Netlify Functions** (matches current PDF service pattern)
2. **Vercel API routes**
3. **Cloudflare Workers**

**Existing Pattern**: The codebase already has `ProxyPDFGenerator` in `src/utils/pdfGenerator.ts` which demonstrates the pattern for handling external service integration.

### Performance Optimizations
1. **Lazy Loading**: Load cards progressively during draft
2. **Image Caching**: Cache Scryfall images in IndexedDB
3. **Background Sync**: Pre-load popular cubes
4. **Compression**: Compress cached data

### Error Handling Strategy
1. **Network Failures**: Graceful degradation to cached data
2. **Invalid Cubes**: Clear error messages and suggestions
3. **API Rate Limits**: Implement backoff and retry logic
4. **Data Corruption**: Automatic cache invalidation and refresh

### Data Privacy & Storage
1. **Local Storage**: All data stored client-side
2. **Cache Limits**: Implement LRU cache eviction
3. **User Control**: Allow users to clear cache
4. **No Personal Data**: Only store cube preferences

## Migration Strategy

### Existing Users
1. **Seamless Transition**: App continues working with peasant cube
2. **Opt-in Upgrade**: Users choose when to try new features
3. **Data Preservation**: Existing draft progress maintained
4. **Backward Compatibility**: Old URLs continue working

### Testing Strategy
1. **Unit Tests**: All services and components
2. **Integration Tests**: End-to-end cube import workflow
3. **Performance Tests**: Large cube handling
4. **Browser Tests**: Cross-browser compatibility
5. **User Testing**: Beta test with Magic community

## Risks & Mitigation

### High-Risk Items
1. **CubeCobra API Changes**: Regular monitoring and fallback strategies
2. **Performance with Large Cubes**: Progressive loading and optimization
3. **Browser Storage Limits**: Cache management and user notifications
4. **Scryfall Rate Limits**: Respect API limits and implement caching

### Medium-Risk Items
1. **User Experience Complexity**: Maintain simple default workflow
2. **Data Synchronization**: Clear cache invalidation strategies
3. **Mobile Performance**: Optimize for mobile devices

## Success Metrics

### Functional Goals
- [ ] Successfully import any public CubeCobra cube
- [ ] Maintain <3 second load time for typical cubes (360-720 cards)
- [ ] Support offline drafting after initial cube load
- [ ] Preserve all existing functionality

### User Experience Goals
- [ ] Intuitive cube import process (≤3 clicks)
- [ ] Clear loading states and error messages
- [ ] Mobile-responsive design
- [ ] Accessible interface (WCAG 2.1 AA)

## Future Enhancements (Post-MVP)

1. **Advanced Features**
   - Custom card pools and restrictions
   - Multiple draft formats (Winston, Grid, etc.)
   - Cube analysis and statistics
   - Export drafted decks to various formats

2. **Community Features** 
   - Share draft results
   - Cube recommendations
   - Draft replay/analysis
   - Integration with other MTG tools

3. **Data Features**
   - Advanced card filtering
   - Custom ELO/rating systems
   - Draft analytics and insights
   - Machine learning recommendations

## Questions for Clarification

1. **CubeCobra API Format**: Need to verify actual JSON response structure from `cubecobra.com/cube/api/cubelist/:id`

~~2. **ELO Handling**: How should we handle cubes without ELO ratings? Default values or disable skip rewards?~~ ✅ **ANSWERED: CubeCobra has ELO ratings - need walkthrough for extraction**

~~3. **Cube Size Limits**: What's the maximum cube size we should support? (Some cubes have 1000+ cards)~~ ✅ **ANSWERED: 600 cards maximum**

4. **Authentication**: Do we need to support private CubeCobra cubes? (Would require OAuth)

5. **Offline Support**: How important is offline functionality after initial cube load?

~~6. **Mobile Priority**: Should mobile experience be prioritized equally with desktop?~~ ✅ **ANSWERED: Mobile-first development**

7. **ELO Extraction**: Need walkthrough on how to extract ELO ratings from CubeCobra API response

## Conclusion

This plan provides a structured approach to incrementally upgrade the application to support CubeCobra integration while maintaining the existing functionality and user experience. The phased approach allows for early testing and validation of core assumptions, particularly around the CubeCobra API format and performance characteristics.

The key architectural decision is to use IndexedDB for client-side storage, which maintains the current deployment model while providing the flexibility needed for dynamic cube management. This approach minimizes infrastructure complexity while maximizing feature capabilities.