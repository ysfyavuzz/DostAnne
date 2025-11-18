# DostAnne - Project Structure

This document describes the organized file and folder structure of the DostAnne mobile application.

## 📁 Root Directory Structure

```
DostAnne/
├── app/                    # Expo Router screens (app entry points)
├── src/                    # Core application code
├── components/             # Reusable UI primitives (Expo template)
├── hooks/                  # Root-level React hooks
├── constants/              # Root-level constants
├── assets/                 # Static assets (images, guides)
├── docs/                   # All project documentation
├── __tests__/              # Test files
├── scripts/                # Utility scripts
└── [config files]          # Configuration files
```

## 📱 App Directory (`/app`)

Contains Expo Router-based navigation and screen entry points.

```
app/
├── (tabs)/                 # Tab-based navigation
│   ├── _layout.tsx         # Tab navigation layout
│   ├── index.tsx           # Home tab
│   ├── activities.tsx      # Activities tab
│   ├── astronomy.tsx       # Astronomy tab
│   ├── calendar.tsx        # Calendar tab
│   ├── development.tsx     # Development tab
│   ├── emergency.tsx       # Emergency tab
│   ├── explore.tsx         # Explore tab
│   ├── feeding.tsx         # Feeding tab
│   ├── health.tsx          # Health tab
│   ├── menstrual.tsx       # Menstrual tab
│   ├── mother-world.tsx    # Mother World tab
│   ├── notifications.tsx   # Notifications tab
│   ├── nutrition.tsx       # Nutrition tab
│   ├── planner.tsx         # Planner tab
│   ├── profile.tsx         # Profile tab
│   ├── sleep.tsx           # Sleep tab
│   └── statistics.tsx      # Statistics tab
├── _layout.tsx             # Root layout
├── modal.tsx               # Modal screen
└── onboarding.tsx          # Onboarding screen
```

**Note:** Files in `app/(tabs)/` are thin wrappers that import actual screen implementations from `src/screens/`.

## 🎯 Source Directory (`/src`)

Contains all core application logic and components.

### `/src/screens`

Main screen implementations:
- `ActivitiesScreen.tsx` - Activities tracking
- `AstronomyScreen.tsx` - Moon cycle tracking
- `BiologicalDevelopmentScreen.tsx` - Biological development tracking
- `CalendarScreen.tsx` - Calendar and events
- `DevelopmentScreen.tsx` - Baby development milestones
- `EmergencyScreen.tsx` - Emergency information hub
- `ExploreScreen.tsx` - Content exploration
- `FeedingScreen.tsx` - Feeding tracking and analysis
- `FirstAidScreen.tsx` - First aid guides list
- `FirstAidDetailScreen.tsx` - First aid guide details
- `HealthScreen.tsx` - Health tracking and metrics
- `HomeScreen.tsx` - Main dashboard with widgets
- `HomeScreenWidgets.tsx` - Widget components
- `LoginScreen.tsx` - User login
- `MenstrualScreen.tsx` - Menstrual cycle tracking
- `MotherWorldScreen.tsx` - Mother community
- `NotificationsScreen.tsx` - Notifications center
- `NutritionScreen.tsx` - Nutrition planning
- `OnboardingScreen.tsx` - App onboarding flow
- `PlannerScreen.tsx` - Task planning
- `ProfileScreen.tsx` - User profile
- `RegistrationScreen.tsx` - User registration
- `SleepScreen.tsx` - Sleep tracking
- `StatisticsScreen.tsx` - Analytics and statistics

### `/src/components`

Reusable application components organized by category:

```
src/components/
├── ai/                     # AI-powered components
│   ├── AIRecommendationComponent.tsx
│   └── AIRecommendations.ts
├── advanced/               # Advanced features
│   ├── SmartReminderSystem.tsx
│   └── WidgetSystem.tsx
├── charts/                 # Data visualization
│   ├── ChartComponents.tsx
│   ├── FeedingAnalysisChart.tsx
│   ├── GrowthChartComponent.tsx
│   ├── HealthMetricsDashboard.tsx
│   ├── SleepAnalysisChart.tsx
│   └── VaccinationScheduleChart.tsx
├── export/                 # Export functionality
│   ├── ExportComponent.tsx
│   └── ExportService.ts
├── ui/                     # UI components
│   ├── LanguageSettingsComponent.tsx
│   ├── LoadingComponents.tsx
│   ├── RefreshComponents.tsx
│   ├── ThemeSettingsComponent.tsx
│   ├── ThemedButton.tsx
│   └── ThemedInput.tsx
├── ActivityChart.tsx       # Activity visualizations
├── DashboardCharts.tsx     # Dashboard charts
├── GrowthChart.tsx         # Growth tracking chart
├── OneHandedMode.tsx       # One-handed mode UI
├── SleepChart.tsx          # Sleep pattern chart
├── ThemedText.tsx          # Re-export wrapper
└── ThemedView.tsx          # Re-export wrapper
```

### Other `/src` directories

- `/src/hooks/` - Custom React hooks (useDatabase, useNotifications, useTheme, etc.)
- `/src/store/` - Redux store slices (activities, database, notifications, profile)
- `/src/services/` - Service layer (NotificationService)
- `/src/database/` - Database layer (DatabaseService)
- `/src/constants/` - App constants (Colors, Spacing, Typography)
- `/src/data/` - Static data files (developmentData, firstAidData, biologicalDevelopmentData)
- `/src/utils/` - Utility functions (ErrorHandler)
- `/src/assets/` - App-specific assets

## 🎨 Components Directory (`/components`)

Root-level reusable UI primitives from Expo template:

- `themed-text.tsx` - Themed text component
- `themed-view.tsx` - Themed view component
- `hello-wave.tsx` - Animated wave component
- `haptic-tab.tsx` - Haptic feedback tab
- `external-link.tsx` - External link handler
- `parallax-scroll-view.tsx` - Parallax scroll view
- `ui/` - UI utilities (icon-symbol, collapsible)

## 🪝 Hooks Directory (`/hooks`)

Root-level hooks:

- `use-color-scheme.ts` - Color scheme detection
- `use-color-scheme.web.ts` - Web-specific color scheme
- `use-theme-color.ts` - Theme color management

## 📚 Documentation (`/docs`)

All project documentation:

- `PROJECT_STRUCTURE.md` - This file
- `MASTER_PLAN.md` - Project roadmap and vision
- `USER_GUIDE.md` - User manual
- `BIOLOGICAL_DEVELOPMENT_TODO.md` - Development feature specs
- `COMPLETION_SUMMARY_2024-11-16.md` - Feature completion summary
- `TEST_REPORT.md` - Testing documentation
- `DEMO_PRESENTATION.md` - Demo presentation content
- `DOSYA_LISTESI.md` - File list (Turkish)
- `MIGRATION_README.md` - Migration guide
- `demo_video_script.md` - Video script
- `pitch_deck_content.md` - Pitch deck content

## ⚙️ Configuration Files

Root-level configuration files:

- `package.json` - NPM dependencies and scripts
- `package-lock.json` - Dependency lock file
- `tsconfig.json` - TypeScript configuration
- `babel.config.js` - Babel configuration
- `eslint.config.js` - ESLint rules
- `app.json` - Expo app configuration
- `.gitignore` - Git ignore rules
- `.prettierrc` - Prettier formatting rules
- `.env.example` - Environment variables example

## 🧪 Testing

- `__tests__/` - Test files
  - `setup.ts` - Test setup
  - `data/firstAidData.test.ts` - First aid data tests

## 🖼️ Assets

- `assets/images/` - App icons, logos, splash screens
- `assets/guides/` - User guide assets
- `src/assets/images/` - App-specific images

## 🔧 Scripts

- `scripts/reset-project.js` - Project reset utility

## 🏗️ Architecture Patterns

### Navigation Pattern
- **Expo Router**: File-based routing in `/app` directory
- **Tab Navigation**: Main navigation via `(tabs)` folder
- **Screen Wrappers**: Thin wrappers in `/app` import implementations from `/src/screens`

### Component Organization
1. **Root Components** (`/components`): Generic, reusable UI primitives
2. **App Components** (`/src/components`): Feature-specific components
3. **Screen Components** (`/src/screens`): Full screen implementations

### State Management
- **Redux Toolkit**: Global state management (`/src/store`)
- **Custom Hooks**: Encapsulated logic (`/src/hooks`, `/hooks`)

### Data Layer
- **SQLite**: Local database (`/src/database`)
- **Static Data**: Pre-defined data sets (`/src/data`)
- **Services**: Business logic layer (`/src/services`)

## 📝 Naming Conventions

- **Screen files**: `[Name]Screen.tsx` (e.g., `HomeScreen.tsx`)
- **Component files**: `[Name].tsx` or `[Name]Component.tsx`
- **Hook files**: `use[Name].ts` (e.g., `useDatabase.ts`)
- **Service files**: `[Name]Service.ts` (e.g., `NotificationService.ts`)
- **Slice files**: `[name]Slice.ts` (e.g., `profileSlice.ts`)

## 🚀 Development Workflow

1. **Screen Development**: Create screen in `/src/screens/`
2. **Route Creation**: Add wrapper in `/app/(tabs)/` or `/app/`
3. **Component Creation**: Add reusable components to `/src/components/`
4. **State Management**: Add slices to `/src/store/` if needed
5. **Testing**: Add tests to `__tests__/`
6. **Documentation**: Update relevant docs in `/docs/`

## 📊 Statistics

- **Total Screens**: 23 screen files
- **Components**: 30+ reusable components
- **Hooks**: 10+ custom hooks
- **Redux Slices**: 4 state slices
- **Tab Screens**: 17 navigable tabs
- **Documentation Files**: 10+ docs

## 🎯 Clean Code Principles Applied

1. ✅ **Single Responsibility**: Each file has one clear purpose
2. ✅ **DRY (Don't Repeat Yourself)**: Reusable components and hooks
3. ✅ **Separation of Concerns**: Clear separation between UI, logic, and data
4. ✅ **Consistent Naming**: Predictable file and component names
5. ✅ **Organized Structure**: Logical grouping by feature/type

---

**Last Updated**: 2024-11-18  
**Version**: 1.0.0  
**Maintained by**: DostAnne Team
