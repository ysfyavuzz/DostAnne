# DostAnne - GitHub Copilot Instructions

## Project Overview

DostAnne is a comprehensive baby care tracking mobile application designed for modern parents. It provides advanced data analysis, smart recommendations, and personalized experiences for tracking baby feeding, sleep, health, development, and more.

**Key Features:**
- 🚨 Emergency first aid guides (CPR, choking, fever, injuries, burns, poisoning, febrile seizures)
- 👐 One-handed mode optimized for breastfeeding
- 📊 Advanced data analytics with professional charts
- 🤖 AI-powered recommendations based on baby's age and data patterns
- 🧒 Comprehensive development tracking (24 months of detailed milestones)
- 🧬 Biological development tracking (10 organ systems)
- 🏥 Health metrics and vaccination schedule
- 🌙 Sleep and feeding pattern analysis
- 🎨 5 themes with dark mode support
- 🌍 Multi-language support (Turkish and English)

**Target Audience:** Parents and caregivers of babies and young children

## Tech Stack

### Frontend
- **Framework:** React Native (v0.81.5)
- **Platform:** Expo (v54.0.20)
- **Language:** TypeScript (v5.9.2) with strict mode enabled
- **Navigation:** Expo Router (v6.0.13) with React Navigation (v7.1.8) for tab-based navigation
- **UI Components:** React Native Elements, Expo Symbols
- **State Management:** Redux Toolkit (v2.9.2)

### Data & Storage
- **Database:** SQLite (expo-sqlite v16.0.8)
- **Persistent Storage:** AsyncStorage (@react-native-async-storage/async-storage)
- **Charts:** react-native-chart-kit, react-native-svg

### Development Tools
- **Testing:** Jest (v29.7.0) with ts-jest preset
- **Linting:** ESLint (v9.25.0) with expo config
- **Code Formatting:** Prettier with specific rules (see .prettierrc)
- **Build:** Expo build system

## Coding Guidelines

### TypeScript
- Use TypeScript strict mode for all code
- Define proper types for all props, state, and function parameters
- Avoid using `any` type; use `unknown` or proper types instead
- Use type inference when obvious, explicit types when clarity is needed
- Create type definitions in `src/types/` directory

### Code Style
- Follow Prettier configuration exactly:
  - Single quotes for strings
  - Semicolons required
  - 2 spaces for indentation
  - Max line width: 100 characters
  - Trailing commas in ES5 style
  - Arrow functions without parentheses for single params
- Use ESLint expo config; fix all linting errors before committing

### Naming Conventions
- **Files:** PascalCase for components (e.g., `FeedingScreen.tsx`), camelCase for utilities (e.g., `dateUtils.ts`)
- **Components:** PascalCase (e.g., `FirstAidCard`, `HealthWidget`)
- **Variables/Functions:** camelCase (e.g., `handleSubmit`, `feedingData`)
- **Constants:** UPPER_SNAKE_CASE for true constants (e.g., `MAX_RETRIES`)
- **Types/Interfaces:** PascalCase with descriptive names (e.g., `FeedingRecord`, `BabyProfile`)

### Component Structure
- Use functional components with hooks (no class components)
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks in `src/hooks/`
- Place screen components in `src/screens/`
- Place reusable UI components in `src/components/` (organized by category)
- Use Expo Router entry points in `app/` directory as thin wrappers

### State Management
- Use Redux Toolkit for global state
- Use local state (useState) for component-specific state
- Use custom hooks for shared stateful logic
- Keep Redux slices organized in `src/store/`

### Data Handling
- All data validation should be done in `src/services/` layer
- Use SQLite for persistent data storage
- Follow the database schema defined in `src/database/`
- Use AsyncStorage for app preferences and settings

### Error Handling
- Always handle errors gracefully with try-catch blocks
- Provide user-friendly error messages in Turkish and English
- Log errors for debugging but don't expose sensitive information
- Use error boundaries for React component error handling

### Internationalization
- All user-facing text must support both Turkish and English
- Use the i18n system consistently
- Keep translation keys organized and descriptive
- Test both languages for all new features

### Accessibility
- Use semantic component names and roles
- Provide meaningful labels for interactive elements
- Support large text sizes
- Ensure sufficient color contrast
- Test with screen readers when possible

## Project Structure

```
DostAnne/
├── app/                    # Expo Router screens (navigation entry points)
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   ├── modal.tsx          # Modal screens
│   └── onboarding.tsx     # Onboarding flow
├── src/                   # Core application code
│   ├── components/        # Reusable components (organized by category)
│   │   ├── ai/           # AI-powered components
│   │   ├── advanced/     # Advanced features
│   │   ├── charts/       # Data visualization
│   │   └── ...
│   ├── screens/          # Screen implementations (24 screens)
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Redux store and slices
│   ├── services/         # Business logic services
│   ├── database/         # Database schema and operations
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── constants/        # App-wide constants
│   └── data/             # Static data (guides, development data)
├── components/           # Root-level UI primitives (Expo template)
├── hooks/                # Root-level React hooks
├── constants/            # Root-level constants
├── assets/               # Static assets (images, guides)
├── docs/                 # Project documentation
├── __tests__/            # Test files
└── scripts/              # Utility scripts
```

### Key Directories

- **app/**: Expo Router entry points - keep these files minimal, import implementations from `src/screens/`
- **src/screens/**: Full screen implementations with business logic
- **src/components/**: Organized by category (ai/, advanced/, charts/, emergency/, etc.)
- **src/data/**: Static data like first aid guides, development milestones, biological data
- **src/services/**: Business logic layer (AIRecommendationService, DataExportService, etc.)

## Testing Guidelines

### Test Structure
- Use Jest with ts-jest preset
- Place tests in `__tests__/` directory
- Test file naming: `*.test.ts` or `*.test.tsx`
- Focus on data integrity, business logic, and critical paths

### Test Commands
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

### What to Test
- Data validation logic in services
- Utility functions
- Redux reducers and actions
- Critical user flows
- Data transformations
- API integrations

### What Not to Test
- Simple presentational components (unless complex logic)
- Third-party library functionality
- Expo/React Native core functionality

## Build and Development

### Commands
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Development Workflow
1. Create feature branch from main
2. Make minimal, focused changes
3. Write/update tests for business logic
4. Run linter and fix issues
5. Test on both iOS and Android when possible
6. Update documentation if needed
7. Create pull request with clear description

## Medical and Safety Guidelines

This app deals with baby health and emergency situations. When working on health-related features:

### First Aid Content
- All first aid information is in `src/data/firstAidData.ts`
- Content is medically reviewed and based on AHA 2020 guidelines
- Never modify medical instructions without expert consultation
- Maintain critical warnings and emergency contact numbers
- Test all first aid features thoroughly

### Development Data
- Baby development milestones are in `src/data/developmentData.ts`
- Based on WHO standards and pediatric research
- Respect age ranges and developmental categories
- Maintain accuracy and avoid medical claims

### Data Privacy
- All user data stays on device (no cloud sync currently)
- Use secure storage for sensitive information
- Never log personal health information
- Follow GDPR compliance practices

## Best Practices

### Performance
- Optimize list rendering with FlatList/SectionList
- Use React.memo for expensive components
- Lazy load screens and heavy components
- Minimize re-renders with proper memoization

### User Experience
- Provide immediate feedback for user actions
- Use loading states for async operations
- Handle offline scenarios gracefully
- Support one-handed mode for nursing parents
- Provide haptic feedback for important actions

### Code Quality
- Keep functions small and focused (< 50 lines when possible)
- Extract complex logic into utility functions
- Document complex algorithms and business logic
- Use meaningful variable and function names
- Avoid deep nesting (max 3 levels)

### Documentation
- Update README.md for new major features
- Document API changes in relevant files
- Keep inline comments minimal but meaningful
- Update user guides in docs/ when needed

## Common Patterns

### Adding a New Screen
1. Create screen component in `src/screens/ScreenName.tsx`
2. Add route in `app/(tabs)/` or appropriate location
3. Update navigation types if needed
4. Add to tab bar or navigation if applicable
5. Test navigation flow

### Adding a New Feature with Data
1. Define TypeScript types in `src/types/`
2. Create database schema updates in `src/database/`
3. Implement service layer in `src/services/`
4. Create UI components in `src/components/`
5. Add screen or integrate into existing screen
6. Write tests for data operations
7. Update documentation

### Working with Charts
- Use react-native-chart-kit for consistency
- Follow existing chart patterns in `src/components/charts/`
- Ensure responsive design for different screen sizes
- Test with real data ranges (empty, small, large datasets)

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Project Structure Documentation](docs/PROJECT_STRUCTURE.md)
- [User Guide](docs/USER_GUIDE.md)

## Language Notes

This is a bilingual project (Turkish/English):
- Primary user language: Turkish (Turkey)
- Documentation: Primarily English for developer collaboration
- Code comments: English preferred
- Commit messages: English
- User-facing content: Must support both Turkish and English
- When generating Turkish text, use proper Turkish grammar and formal tone appropriate for a parenting app
