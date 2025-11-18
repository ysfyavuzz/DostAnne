# First Aid Guide Assets

This directory contains visual assets for the first aid guides.

## Required Images

### 1. Choking Guide (`boğulma-0-12-ay`)
- `choking-back-blows.png` - Back blow technique demonstration
- `choking-chest-thrusts.png` - Chest thrust technique
- `choking-position.png` - Correct baby positioning

### 2. CPR Guide (`bebek-cpr-0-12-ay`)
- `cpr-hand-position.png` - Two-finger placement on chest
- `cpr-compression-depth.png` - 4cm compression depth illustration
- `cpr-head-tilt.png` - Head tilt chin lift technique
- `cpr-rescue-breath.png` - Mouth-to-mouth technique

### 3. Fever Guide (`high-fever-infant-0-24`)
- `fever-thermometer-types.png` - Different thermometer types
- `fever-measurement-rectal.png` - Rectal temperature measurement
- `fever-cooling-lukewarm.png` - Lukewarm water cooling technique
- `fever-medication-dosage.png` - Medication dosing chart

### 4. Head Trauma Guide (`head-trauma-fall-0-24`)
- `head-trauma-assessment.png` - Warning signs to watch
- `head-trauma-observation.png` - 24-hour monitoring checklist
- `head-trauma-danger-signs.png` - Emergency symptoms

### 5. Burns Guide (`burns-treatment-0-24`)
- `burns-cooling-water.png` - Running water cooling technique
- `burns-degree-classification.png` - 1st, 2nd, 3rd degree identification
- `burns-bandaging.png` - Proper non-stick bandage application
- `chemical-eye-wash.png` - Eye wash technique for chemical burns

### 6. Poisoning Guide (`zehirlenme-yutma-0-24`)
- `poisoning-common-items.png` - Common household dangers
- `poisoning-call-114.png` - National Poison Control (114) hotline
- `poisoning-save-container.png` - Save packaging/container

### 7. Febrile Seizure Guide (`febrile-seizure-0-5yrs`)
- `seizure-recovery-position.png` - Safe side-lying position
- `seizure-timing.png` - How to time seizure duration
- `seizure-do-not.png` - What NOT to do during seizure
- `seizure-diazepam-rectal.png` - Rectal diazepam administration (if prescribed)

## Image Specifications

- **Format**: PNG with transparency where applicable
- **Resolution**: 1200x800px minimum (3:2 aspect ratio)
- **File Size**: < 500KB per image (optimized for mobile)
- **Style**: 
  - Clear, simple illustrations
  - Medically accurate
  - Turkish labels and annotations
  - Color-coded for severity (Red = Critical, Yellow = Warning, Blue = Info)
  - Suitable for all ages (no graphic imagery)

## Medical Accuracy Requirements

All images must be:
1. Reviewed by medical professional
2. Compliant with AHA 2020 CPR guidelines (for CPR images)
3. Compliant with Turkish Ministry of Health first aid protocols
4. Include source attribution in image metadata

## Usage in App

Images are referenced in `src/data/firstAidData.ts` using relative paths:
```typescript
image: '/guides/choking-back-blows.png'
```

These paths are resolved by Expo's asset system and bundled with the app.

## TODO

- [ ] Commission medical illustrator for accurate diagrams
- [ ] Get medical review approval for all illustrations
- [ ] Optimize images for mobile (WebP format consideration)
- [ ] Add video demonstrations (MP4, 10-30 seconds each)
- [ ] Create animated GIFs for critical techniques (CPR compressions, back blows)
