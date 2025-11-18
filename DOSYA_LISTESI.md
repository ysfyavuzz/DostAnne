# new_repo/ Klasörü - Dosya Listesi

Bu belge, yeni depoya taşınacak tüm dosyaların listesini içerir.

## 📂 Klasör Yapısı

```
new_repo/
│
├── MIGRATION_README.md                  # Taşıma rehberi
├── README.md                            # Ana proje README
├── package.json                         # NPM bağımlılıkları
├── package-lock.json                    # Bağımlılık kilidi
├── tsconfig.json                        # TypeScript config
├── babel.config.js                      # Babel config
├── eslint.config.js                     # ESLint kuralları
├── app.json                             # Expo config
├── expo-env.d.ts                        # TypeScript types
├── .gitignore                           # Git ignore kuralları
│
├── 📱 app/                              # Uygulama ekranları (Expo Router)
│   ├── _layout.tsx                      # Root layout
│   ├── modal.tsx                        # Modal screen
│   ├── onboarding.tsx                   # Onboarding screen
│   └── (tabs)/                          # Tab ekranları
│       ├── _layout.tsx                  # Tab layout
│       ├── index.tsx                    # Ana sayfa
│       ├── activities.tsx               # Aktiviteler
│       ├── astronomy.tsx                # Astronomi (ay döngüsü)
│       ├── calendar.tsx                 # Takvim
│       ├── development.tsx              # Gelişim takibi
│       ├── emergency.tsx                # Acil durum
│       ├── explore.tsx                  # Keşfet
│       ├── feeding.tsx                  # Beslenme
│       ├── health.tsx                   # Sağlık
│       ├── menstrual.tsx                # Menstrüel döngü
│       ├── mother-world.tsx             # Anne dünyası
│       ├── notifications.tsx            # Bildirimler
│       ├── nutrition.tsx                # Beslenme planı
│       ├── planner.tsx                  # Planlayıcı
│       ├── profile.tsx                  # Profil
│       ├── sleep.tsx                    # Uyku takibi
│       └── statistics.tsx               # İstatistikler
│
├── 🎨 components/                       # Temel bileşenler
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.tsx
│       └── icon-symbol.ios.tsx
│
├── 🪝 hooks/                            # Özel React hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── 🎯 constants/                        # Global sabitler
│   └── theme.ts
│
├── 🖼️ assets/                           # Statik dosyalar
│   ├── images/
│   │   ├── adaptive-icon.png
│   │   ├── android-icon-background.png
│   │   ├── android-icon-foreground.png
│   │   ├── android-icon-monochrome.png
│   │   ├── favicon.png
│   │   ├── icon.png
│   │   ├── partial-react-logo.png
│   │   ├── react-logo.png
│   │   ├── react-logo@2x.png
│   │   ├── react-logo@3x.png
│   │   └── splash-icon.png
│   └── guides/
│       └── README.md
│
├── 🔧 src/                              # Ana kaynak kod
│   ├── assets/
│   │   └── images/
│   │       └── logo.png
│   │
│   ├── components/                      # Gelişmiş bileşenler
│   │   ├── ActivityChart.tsx
│   │   ├── DashboardCharts.tsx
│   │   ├── GrowthChart.tsx
│   │   ├── OneHandedMode.tsx
│   │   ├── SleepChart.tsx
│   │   ├── ThemedText.tsx
│   │   ├── ThemedView.tsx
│   │   ├── ai/                          # AI bileşenleri
│   │   │   ├── AIRecommendationComponent.tsx
│   │   │   └── AIRecommendations.ts
│   │   ├── advanced/                    # Gelişmiş özellikler
│   │   │   ├── SmartReminderSystem.tsx
│   │   │   └── WidgetSystem.tsx
│   │   ├── charts/                      # Grafik bileşenleri
│   │   │   ├── ChartComponents.tsx
│   │   │   ├── FeedingAnalysisChart.tsx
│   │   │   ├── GrowthChartComponent.tsx
│   │   │   ├── HealthMetricsDashboard.tsx
│   │   │   ├── SleepAnalysisChart.tsx
│   │   │   └── VaccinationScheduleChart.tsx
│   │   ├── export/                      # Export özellikleri
│   │   │   ├── ExportComponent.tsx
│   │   │   └── ExportService.ts
│   │   └── ui/                          # UI bileşenleri
│   │       ├── LanguageSettingsComponent.tsx
│   │       ├── LoadingComponents.tsx
│   │       ├── RefreshComponents.tsx
│   │       ├── ThemeSettingsComponent.tsx
│   │       ├── ThemedButton.tsx
│   │       └── ThemedInput.tsx
│   │
│   ├── screens/                         # Ekran bileşenleri
│   │   ├── ActivitiesScreen.tsx
│   │   ├── ActivitiesScreenNew.tsx
│   │   ├── AstronomyScreen.tsx
│   │   ├── AstronomyScreenNew.tsx
│   │   ├── BiologicalDevelopmentScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── CalendarScreenNew.tsx
│   │   ├── DevelopmentScreen.tsx
│   │   ├── DevelopmentScreenNew.tsx
│   │   ├── DevelopmentScreenNew.backup.tsx
│   │   ├── EmergencyScreen.tsx
│   │   ├── EmergencyScreenNew.tsx
│   │   ├── ExploreScreenNew.tsx
│   │   ├── FeedingScreen.tsx
│   │   ├── FeedingScreenNew.tsx
│   │   ├── FirstAidDetailScreen.tsx
│   │   ├── FirstAidScreen.tsx
│   │   ├── HealthScreen.tsx
│   │   ├── HealthScreenNew.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── HomeScreenNew.tsx
│   │   ├── HomeScreenWidgets.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MenstrualScreen.tsx
│   │   ├── MenstrualScreenNew.tsx
│   │   ├── MotherWorldScreen.tsx
│   │   ├── MotherWorldScreenNew.tsx
│   │   ├── NotificationsScreenNew.tsx
│   │   ├── NutritionScreen.tsx
│   │   ├── NutritionScreenNew.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── PlannerScreen.tsx
│   │   ├── PlannerScreenNew.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ProfileScreenNew.tsx
│   │   ├── RegistrationScreen.tsx
│   │   ├── SleepScreen.tsx
│   │   ├── SleepScreenNew.tsx
│   │   ├── StatisticsScreen.tsx
│   │   ├── StatisticsScreenNew.tsx
│   │   └── _old/                        # Eski versiyonlar (backup)
│   │       ├── FeedingScreenEnhanced.tsx
│   │       ├── FeedingScreenFixed2.tsx
│   │       ├── HealthScreenEnhanced.tsx
│   │       ├── HealthScreenFixed.tsx
│   │       ├── NotificationSettingsScreenFixed.tsx
│   │       ├── SleepScreenFixed.tsx
│   │       └── StatisticsScreenEnhanced.tsx
│   │
│   ├── services/                        # Servisler
│   │   └── NotificationService.ts
│   │
│   ├── store/                           # Redux store
│   │   ├── activitiesSlice.ts
│   │   ├── databaseSlice.ts
│   │   ├── notificationSlice.ts
│   │   ├── profileSlice.ts
│   │   └── store.ts
│   │
│   ├── database/                        # Veritabanı
│   │   └── DatabaseService.ts
│   │
│   ├── hooks/                           # Özel hooks
│   │   ├── useDatabase.ts
│   │   ├── useNotifications.ts
│   │   ├── useTheme.ts
│   │   ├── useThemedStyles.ts
│   │   └── useTranslation.ts
│   │
│   ├── navigation/                      # Navigasyon
│   │   └── AppNavigator.tsx
│   │
│   ├── utils/                           # Yardımcı fonksiyonlar
│   │   └── ErrorHandler.ts
│   │
│   ├── constants/                       # Sabitler
│   │   ├── Colors.ts
│   │   ├── Spacing.ts
│   │   └── Typography.ts
│   │
│   └── data/                            # Statik veri
│       ├── biologicalDevelopmentData.ts
│       ├── developmentData.ts
│       └── firstAidData.ts
│
├── 🧪 __tests__/                        # Test dosyaları
│   ├── setup.ts                         # Test kurulumu
│   └── data/
│       └── firstAidData.test.ts
│
├── 📜 scripts/                          # Yardımcı scriptler
│   └── reset-project.js
│
└── 📚 docs/                             # Dokümantasyon
    ├── BIOLOGICAL_DEVELOPMENT_TODO.md   # Gelişim özellikleri
    ├── COMPLETION_SUMMARY_2024-11-16.md # Tamamlanan özellikler
    ├── DEMO_PRESENTATION.md             # Demo sunumu
    ├── MASTER_PLAN.md                   # Proje yol haritası
    ├── TEST_REPORT.md                   # Test raporu
    ├── USER_GUIDE.md                    # Kullanıcı rehberi
    ├── demo_video_script.md             # Video senaryosu
    └── pitch_deck_content.md            # Yatırım sunumu
```

## 📊 Dosya Sayıları

| Kategori | Adet |
|----------|------|
| TypeScript Dosyaları (.ts, .tsx) | 129 |
| JavaScript Dosyaları (.js) | 3 |
| Markdown Dosyaları (.md) | 11 |
| JSON Dosyaları (.json) | 4 |
| Görsel Dosyaları (.png) | 12 |
| **TOPLAM** | **160+** |

## ✅ Önemli Konfigürasyon Dosyaları

- ✅ **package.json** - Tüm bağımlılıklar ve scriptler
- ✅ **tsconfig.json** - TypeScript ayarları
- ✅ **babel.config.js** - Babel transpiler
- ✅ **eslint.config.js** - Kod kalitesi kuralları
- ✅ **app.json** - Expo konfigürasyonu
- ✅ **.gitignore** - Git ignore kuralları

## 🎯 Ana Özellikler (Ekranlar)

1. **Ana Sayfa** (index.tsx) - Dashboard
2. **Aktiviteler** (activities.tsx) - Aktivite takibi
3. **Astronomi** (astronomy.tsx) - Ay döngüsü takibi
4. **Takvim** (calendar.tsx) - Etkinlik takvimi
5. **Gelişim** (development.tsx) - Bebek gelişimi
6. **Acil Durum** (emergency.tsx) - İlk yardım
7. **Keşfet** (explore.tsx) - İçerik keşfi
8. **Beslenme** (feeding.tsx) - Beslenme kaydı
9. **Sağlık** (health.tsx) - Sağlık takibi
10. **Menstrüel** (menstrual.tsx) - Döngü takibi
11. **Anne Dünyası** (mother-world.tsx) - Topluluk
12. **Bildirimler** (notifications.tsx) - Bildirimler
13. **Beslenme Planı** (nutrition.tsx) - Beslenme rehberi
14. **Planlayıcı** (planner.tsx) - Görev planlama
15. **Profil** (profile.tsx) - Kullanıcı profili
16. **Uyku** (sleep.tsx) - Uyku takibi
17. **İstatistikler** (statistics.tsx) - Grafikler ve analizler

## 🔧 Teknoloji Stack

- **Framework:** React Native + Expo (~54.0.20)
- **Dil:** TypeScript (~5.9.2)
- **State Management:** Redux Toolkit
- **Routing:** Expo Router
- **Database:** SQLite (expo-sqlite)
- **Bildirimler:** Expo Notifications
- **Charts:** React Native Chart Kit
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint

## 📦 Ana Bağımlılıklar

```json
{
  "expo": "~54.0.20",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@reduxjs/toolkit": "^2.9.2",
  "expo-router": "~6.0.13",
  "expo-sqlite": "^16.0.8",
  "react-native-chart-kit": "^6.12.0"
}
```

## 🎨 UI Bileşenleri

- **Themed Components** - Dinamik tema desteği
- **Charts** - Grafik bileşenleri
- **AI Components** - AI öneri sistemi
- **Advanced UI** - Widget ve akıllı hatırlatıcılar
- **Export System** - Veri dışa aktarma

## 🚀 Kullanılabilir NPM Scriptler

```bash
npm start              # Development server
npm run android        # Android emulator
npm run ios            # iOS simulator
npm run web            # Web browser
npm run lint           # ESLint
npm test               # Jest testler
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage raporu
npm run reset-project  # Proje sıfırlama
```

---

**Not:** Bu liste yeni depoya taşınacak tüm dosyaları içerir. Herhangi bir dosya eksikse veya eklemek istediğiniz dosya varsa, bu listeyi güncelleyebilirsiniz.
