# Biological Development Data - TODO

## Current Status
- ✅ Month 0-1: COMPLETE (Full 10 organ systems)
- ⏳ Months 2-6: NEEDED (Priority for short-term)
- ⏳ Months 7-24: NEEDED (Long-term expansion)

## Data Requirements for Months 2-6

### Key Developmental Changes by Month

#### Month 2 (1-2 months)
**Critical Systems:**
- **Growth**: Weight doubles check-in, rapid brain growth
- **Cardiovascular**: Heart rate stabilizing (120-160 bpm)
- **Nervous**: Social smile appears, can track objects 180°
- **Immune**: 2-month vaccinations (DTP, polio, Hib, hepatitis B)
- **Sensory**: Color vision developing, recognizes familiar faces
- **Musculoskeletal**: Holds head up 45° when prone

#### Month 3 (2-3 months)
**Critical Systems:**
- **Growth**: Steady gain, 150-200g/week
- **Digestive**: Feeding consolidates to 6-8 times/day
- **Nervous**: Sleeps 14-16 hours (longer night stretches)
- **Musculoskeletal**: Holds head steady, brings hands together
- **Sensory**: Depth perception improving

#### Month 4 (3-4 months)
**Critical Systems:**
- **Growth**: Birth weight doubled (WHO milestone)
- **Digestive**: Ready for solid food introduction (some pediatricians)
- **Cardiovascular**: Heart rate 110-150 bpm
- **Nervous**: Laughs out loud, babbles consonants
- **Immune**: 4-month vaccinations (DTP booster)
- **Musculoskeletal**: Rolls over front to back

#### Month 5 (4-5 months)
**Critical Systems:**
- **Digestive**: Introduction of first foods (iron-fortified cereals)
- **Musculoskeletal**: Sits with support, bears weight on legs
- **Nervous**: Responds to own name
- **Sensory**: Full color vision, hand-eye coordination improves

#### Month 6 (5-6 months)
**Critical Systems:**
- **Growth**: Birth weight doubled permanently
- **Digestive**: Multiple foods introduced, 3 meals pattern emerging
- **Immune**: 6-month vaccinations (DTP, hepatitis B boosters)
- **Dental**: First tooth may erupt (lower central incisors)
- **Musculoskeletal**: Sits independently, rolls both ways
- **Nervous**: Understands object permanence begins

## Data Structure Template

Each month should include:

```typescript
{
  month: 2, // 3, 4, 5, 6
  ageRange: '1-2 ay', // Turkish age range
  
  growth: {
    weight: { male: {...}, female: {...} }, // WHO growth charts
    height: { male: {...}, female: {...} },
    headCircumference: { male: {...}, female: {...} },
  },
  
  cardiovascular: {
    heartRate: { min, max, average, unit },
    bloodPressure: {...}, // Optional
    description: [...], // 3-5 sentences
    normalSigns: [...], // 3-5 items
    warningSigns: [...], // 3-5 critical signs
    checkpoints: [...], // 3-5 check items
  },
  
  respiratory: {...}, // Similar structure
  digestive: {...},
  renal: {...},
  nervous: {...},
  immune: {...}, // Include vaccination schedule
  musculoskeletal: {...},
  sensory: {...},
  integumentary: {...},
  dental: {...}, // Important: teething timeline
  
  healthChecklist: [
    {
      category: 'Büyüme',
      items: [
        {
          check: 'Kilo alımı',
          normal: '150-200g/hafta',
          concern: '100g/hafta altı',
        },
        // 5-8 items per category
      ],
    },
    // 5-6 categories
  ],
}
```

## Priority Guidelines

### MUST HAVE (Critical Safety):
1. **Immune System**: Vaccination schedule (exact dates/ages)
2. **Growth Metrics**: WHO percentile charts (detect failure to thrive)
3. **Warning Signs**: Red flags requiring immediate medical attention
4. **Dental**: Teething timeline and pain management

### SHOULD HAVE (Clinical Value):
1. **Cardiovascular**: Heart rate norms (detect tachycardia)
2. **Respiratory**: Breathing rate norms (detect respiratory distress)
3. **Digestive**: Feeding patterns (solid food introduction)
4. **Nervous**: Sleep patterns (support parental expectations)

### NICE TO HAVE (Educational):
1. **Sensory**: Development milestones
2. **Integumentary**: Skin care recommendations
3. **Musculoskeletal**: Motor skill progression

## Data Sources

1. **WHO Growth Charts**: https://www.who.int/tools/child-growth-standards
2. **Turkish Vaccination Schedule**: T.C. Sağlık Bakanlığı Aşı Takvimi
3. **AAP (American Academy of Pediatrics)**: Bright Futures Guidelines
4. **CDC Growth Charts**: https://www.cdc.gov/growthcharts/
5. **Turkish Pediatric Association**: Türk Pediatri Kurumu standartları

## Estimated Effort

- **Month 2**: ~600 lines (50-80 data points per system)
- **Month 3**: ~600 lines
- **Month 4**: ~600 lines (+ solid food details)
- **Month 5**: ~600 lines
- **Month 6**: ~650 lines (+ teething + vaccination)

**Total**: ~3,050 lines for months 2-6

## Implementation Notes

1. Copy month 0-1 structure as template
2. Update all numerical values based on WHO/CDC data
3. Adjust descriptions for age-appropriate milestones
4. Verify vaccination schedule against Turkish Ministry of Health
5. Include regional variations in notes (e.g., solid food introduction timing varies)

## Testing Requirements

After adding data:
1. Create unit tests for data integrity
2. Validate growth percentiles match WHO charts
3. Cross-reference vaccination ages with official schedule
4. Verify all warning signs are medically accurate
