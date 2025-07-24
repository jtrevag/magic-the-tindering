# MTG Tinder Draft - Complete Development Specification

## 1. Core Gameplay Mechanics (Final)

### Primary Game Loop
1. **Pod Creation**: Host creates draft room for 2-8 friends
2. **Join Phase**: Friends join via room code/link
3. **Draft Phase**: Each player gets 100 swipes through the Peasant Cube
4. **Timed Decisions**: 5 seconds per swipe (configurable by host)
5. **Card Presentation**: One card at a time with Scryfall images
6. **Matching Algorithm**: Distribute cards based on swipe competition
7. **Deck Building**: Validate 40-card requirement
8. **Proxy Generation**: Create 9-card-per-page PDF with card images
9. **Physical Play**: Print and play at meetup

### Game Rules (Confirmed)
- **Cube**: Peasant Cube (commons and uncommons only)
- **Pod Size**: 2-8 players
- **Pick Budget**: 100 swipes maximum per player
- **Timing**: 5 seconds per swipe (host configurable)
- **Deck Size**: Exactly 40 cards required
- **Output**: 9 cards per page PDF for home printing
- **Scaling**: No room limits initially

### Peasant Cube Specifications
- **Card Pool**: ~360-450 cards (standard cube size)
- **Rarity**: Commons and uncommons only
- **Power Level**: Accessible, balanced gameplay
- **Source**: Research popular peasant cube lists (Cube Cobra, MTG Cube subreddit)

## 2. User Interface Requirements (Mobile-First)

### Mobile Draft Interface (Primary)
- **Full-screen card display** with Scryfall image
- **Timer display** showing 5-second countdown per card
- **Pick counter**: "47/100 picks remaining"
- **Large swipe gesture area** covering entire card
- **Auto-advance** after 5 seconds (counts as "pass")
- **Pause/resume functionality** for host

### Room Configuration (Host Options)
- **Timer Setting**: Adjustable from 3-30 seconds per swipe
- **Player Count**: Display current players (X/8)
- **Draft Controls**: Start, pause, resume draft
- **Room Settings**: Private/public room toggle

### Desktop Adaptations
- **Keyboard Controls**: 
  - Right arrow or Enter = swipe right (pick)
  - Left arrow or Spacebar = swipe left (pass)
  - P = pause (host only)
- **Mouse Support**: Click left/right sides of card
- **Larger Timer**: More prominent countdown display

### Post-Draft Interface
- **Deck Review**: Grid view of selected cards
- **40-Card Validation**: Clear indication if under/over 40
- **PDF Generation**: "Generate Proxy Sheet" button
- **Download Options**: PDF download with filename "[PlayerName]_Draft_[Date].pdf"

## 3. Technical Requirements (Specification)

### Peasant Cube Integration
**Cube Data Source**
- Research and compile popular peasant cube lists
- Target ~400 cards for optimal draft diversity
- Store as JSON with Scryfall IDs for each card
- Include mana curve analysis for balanced drafting

**Scryfall API Integration**
- **Endpoints**: `/cards/{id}` for card data
- **Image URLs**: High-res for PDF generation (large format)
- **Rate Limiting**: Respect 50-100 requests per second limit
- **Caching Strategy**: Store card images locally after first fetch
- **Fallback**: Local card name/mana cost if image fails

### Real-Time Draft Management
**Timer System**
- WebSocket-based synchronized countdown
- Host controls: pause/resume for all players
- Auto-pass when timer expires
- Grace period for network lag (500ms)

**Pick Tracking**
- Real-time card "pickiness" calculation
- Broadcast pick counts without revealing who picked what
- Queue system for simultaneous picks on same card
- Draft completion detection (all players finished or timed out)

### PDF Generation (Home Printer Optimized)
**Layout Specifications**
- **Page Size**: 8.5" x 11" (standard US letter)
- **Cards Per Page**: 9 (3x3 grid)
- **Card Size**: ~2.5" x 3.5" (standard Magic card proportions)
- **Margins**: 0.5" on all sides for printer margins
- **Resolution**: 300 DPI for clear text readability

**PDF Structure**
```
Page 1: Cards 1-9
Page 2: Cards 10-18
...
Final Page: Cards 37-40 (with empty spaces)
Footer: Player name, draft date, cube type
```

### Performance Requirements (Mobile-First)
**Image Loading**
- Preload next 3 cards during current swipe
- Progressive image loading (low-res placeholder → high-res)
- Fallback to text-only cards if images fail
- Maximum 2MB cache per user session

**Real-Time Performance**
- Sub-100ms swipe response time
- Timer accuracy within 100ms across all clients
- Graceful degradation on poor connections
- Offline queue for picks during disconnection

## 4. User Flows (Complete)

### Room Setup Flow
1. **Host Creates Room**
   - Set timer (default 5 seconds)
   - Generate shareable room code (6 digits)
   - Copy room link for sharing
2. **Friends Join**
   - Enter room code OR click shared link
   - See lobby with current players
   - Ready/unready status
3. **Draft Start**
   - Host clicks "Start Draft" when ready
   - 3-second countdown for all players
   - Synchronized draft begins

### Draft Experience Flow
1. **Card Presentation**
   - Scryfall image loads with smooth transition
   - Timer starts countdown (5 seconds default)
   - Player can swipe or wait for auto-pass
2. **Decision Making**
   - Swipe right = spend 1 pick, get card
   - Swipe left = pass, no cost
   - Auto-pass = no cost, moves to next card
3. **Progress Feedback**
   - Pick counter updates immediately
   - Visual confirmation of choice
   - Smooth transition to next card
4. **Draft Completion**
   - Automatic transition to deck builder
   - Display final card count
   - Show if under 40 cards (auto-fill needed)

### Proxy Generation Flow
1. **Deck Validation**
   - Ensure exactly 40 cards
   - Auto-fill from undrafted pool if needed
   - Sort by mana cost for easier deck building
2. **PDF Creation**
   - Click "Generate Proxy Sheet"
   - Client-side PDF generation (no server upload)
   - Progress indicator during generation
3. **Download & Print**
   - Automatic download or save dialog
   - Print instructions: "Print at 100% scale, no scaling"
   - Recommended paper: cardstock or heavy paper

## 5. Development Priorities (Action Items)

### Sprint 1: Core Mechanics (Week 1-2)
**Must-Have**
- [ ] Peasant cube data compilation and Scryfall ID mapping
- [ ] Basic swipe interface with timer
- [ ] Single-player draft mode for testing
- [ ] PDF generation with 9-card layout
- [ ] Mobile-responsive card display

**Success Criteria**
- Can complete solo draft and generate printable PDF
- All 400+ peasant cube cards load correctly
- PDF prints correctly on standard home printer

### Sprint 2: Multiplayer Foundation (Week 3-4)
**Must-Have**
- [ ] Room creation and joining system
- [ ] WebSocket real-time synchronization
- [ ] Multi-player draft with timer sync
- [ ] Pick conflict resolution algorithm
- [ ] Basic error handling and reconnection

**Success Criteria**
- 2-8 players can draft simultaneously
- Timer stays synchronized across all clients
- Cards distributed fairly based on picks

### Sprint 3: Polish & Edge Cases (Week 5-6)
**Should-Have**
- [ ] Host controls (pause/resume, timer config)
- [ ] Improved mobile UX (haptic feedback, animations)
- [ ] Connection loss recovery
- [ ] Draft history and statistics
- [ ] Performance optimization

**Success Criteria**
- Smooth user experience on mobile devices
- Graceful handling of network issues
- Ready for friend group testing

## 6. Technical Architecture

### Recommended Stack
**Frontend**: React with TypeScript
- Mobile-first responsive design
- PWA capabilities for offline functionality
- React Query for Scryfall API caching

**Backend**: Node.js with Express
- Socket.io for real-time communication
- Redis for session storage
- Simple JSON file for cube data initially

**Database**: 
- Redis: Draft sessions, player state
- Local Storage: User preferences, draft history
- No permanent user accounts needed initially

### Key API Endpoints
```javascript
// Room Management
POST /api/rooms - Create new draft room
GET /api/rooms/:code - Join room by code
DELETE /api/rooms/:code - End draft room

// Draft Data
GET /api/cube/peasant - Get peasant cube card list
GET /api/draft/:roomId/status - Get current draft state

// WebSocket Events
'draft-start' - Begin draft for all players
'card-present' - Show next card to player
'player-pick' - Broadcast pick (anonymous)
'draft-complete' - All players finished
'timer-sync' - Synchronize countdown timers
```

### Deployment Considerations
**Initial Hosting**: Simple cloud hosting (Vercel, Netlify + Railway)
**Scaling**: Monitor concurrent users, add rate limiting if needed
**Monitoring**: Basic error tracking and performance metrics

## 7. Success Metrics & Testing

### Definition of Done
- [ ] Friends can create and join draft rooms reliably
- [ ] Draft completes successfully for 2-8 players
- [ ] Generated PDFs print clearly on home printers
- [ ] Mobile experience is smooth and intuitive
- [ ] No major bugs during 10+ test drafts

### User Testing Plan
1. **Alpha Testing**: Solo drafts with PDF generation
2. **Beta Testing**: Small friend groups (2-4 players)
3. **Stress Testing**: Full 8-player pods
4. **Print Testing**: Various home printer types and paper

This specification provides everything needed to start development while maintaining the fun, accessible nature of the project!