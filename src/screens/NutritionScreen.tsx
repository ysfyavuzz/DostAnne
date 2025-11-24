import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';

interface NutritionGuide {
  id: string;
  ageRange: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tips: string[];
}

interface Recipe {
  id: string;
  name: string;
  ageMonths: number;
  prepTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  nutritionFacts: {
    calories: string;
    protein: string;
    carbs: string;
  };
}

const nutritionGuides: NutritionGuide[] = [
  {
    id: '1',
    ageRange: '0-6 Ay',
    title: 'Sadece Anne Sütü',
    description: 'İlk 6 ay bebek için en ideal beslenme anne sütüdür',
    icon: 'water-outline',
    color: '#FF6B9D',
    tips: [
      'İlk 6 ay sadece anne sütü yeterlidir',
      'Günde 8-12 kez emzirme önerilir',
      'Su dahil hiçbir ek gıda verilmemelidir',
      'Anne sütü bebek için en güvenli besindir',
    ],
  },
  {
    id: '2',
    ageRange: '6-8 Ay',
    title: 'Ek Gıdaya Başlama',
    description: '6. aydan itibaren ek gıdalara geçiş başlar',
    icon: 'nutrition-outline',
    color: '#10B981',
    tips: [
      'Püre kıvamında yiyeceklerle başlayın',
      'Tek tek yeni besinler tanıtın',
      'Her yeni besin 3 gün aralıkla verilmeli',
      'Anne sütüne devam edilmelidir',
    ],
  },
  {
    id: '3',
    ageRange: '8-12 Ay',
    title: 'Çeşitlilik Artırma',
    description: 'Yiyecek çeşitliliği ve kıvam artırılır',
    icon: 'restaurant-outline',
    color: '#F59E0B',
    tips: [
      'Daha kalın kıvamlı yiyecekler verilebilir',
      'Parmakla yenebilecek atıştırmalıklar ekleyin',
      'Günde 3 ana öğün + 2 ara öğün',
      'Aile yemeklerine adaptasyon başlar',
    ],
  },
  {
    id: '4',
    ageRange: '12-24 Ay',
    title: 'Aile Yemeklerine Geçiş',
    description: 'Bebek aile sofrası yemeklerine adapte olur',
    icon: 'people-outline',
    color: '#8B5CF6',
    tips: [
      'Aile yemeklerinden pay alabilir',
      'Tuz ve şeker minimal kullanılmalı',
      'Kendi kendine yemeyi öğrenir',
      'Günde 3 ana + 2-3 ara öğün',
    ],
  },
];

const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Elma Püresi',
    ageMonths: 6,
    prepTime: '10 dk',
    difficulty: 'easy',
    ingredients: ['1 adet organik elma', '2 yemek kaşığı su'],
    instructions: [
      'Elmayı yıkayın, soyun ve küp şeklinde doğrayın',
      'Küçük bir tencereye elmaları ve suyu ekleyin',
      'Orta ateşte yumuşayana kadar pişirin (yaklaşık 10 dakika)',
      'Blender ile püre haline getirin',
      'Oda sıcaklığına soğutun ve servis edin',
    ],
    nutritionFacts: {
      calories: '50 kcal',
      protein: '0.3g',
      carbs: '13g',
    },
  },
  {
    id: '2',
    name: 'Havuç Püresi',
    ageMonths: 6,
    prepTime: '15 dk',
    difficulty: 'easy',
    ingredients: ['2 adet orta boy havuç', '3 yemek kaşığı su'],
    instructions: [
      'Havuçları yıkayın, soyun ve küçük parçalara bölün',
      'Buharda veya haşlayarak yumuşatın',
      'Blender ile püre haline getirin, gerekirse su ekleyin',
      'Oda sıcaklığına soğutun',
    ],
    nutritionFacts: {
      calories: '35 kcal',
      protein: '0.8g',
      carbs: '8g',
    },
  },
  {
    id: '3',
    name: 'Kabak ve Pirinç Çorbası',
    ageMonths: 7,
    prepTime: '20 dk',
    difficulty: 'easy',
    ingredients: [
      '1 dilim kabak',
      '2 yemek kaşığı pirinç',
      '1 su bardağı su',
      '1 tatlı kaşığı zeytinyağı',
    ],
    instructions: [
      'Pirinci yıkayın ve suda bekletin',
      'Kabağı küp şeklinde doğrayın',
      'Tüm malzemeleri tencereye ekleyin',
      'Yumuşayana kadar pişirin (15-20 dakika)',
      'Blender ile çorba kıvamına getirin',
    ],
    nutritionFacts: {
      calories: '80 kcal',
      protein: '2g',
      carbs: '15g',
    },
  },
  {
    id: '4',
    name: 'Muz-Avokado Püresi',
    ageMonths: 8,
    prepTime: '5 dk',
    difficulty: 'easy',
    ingredients: ['1/2 olgun muz', '1/4 avokado', '1 yemek kaşığı anne sütü (opsiyonel)'],
    instructions: [
      'Muz ve avokadoyu ezin',
      'İyi karıştırın',
      'Gerekirse anne sütü ekleyerek kıvam ayarlayın',
      'Hemen servis edin',
    ],
    nutritionFacts: {
      calories: '110 kcal',
      protein: '1.5g',
      carbs: '18g',
    },
  },
  {
    id: '5',
    name: 'Yoğurtlu Meyve Salatası',
    ageMonths: 10,
    prepTime: '10 dk',
    difficulty: 'easy',
    ingredients: [
      '3 yemek kaşığı süzme yoğurt',
      '1/2 muz',
      '3-4 çilek',
      '1 tatlı kaşığı kayısı',
    ],
    instructions: [
      'Meyveleri küçük parçalara bölün',
      'Yoğurt ile karıştırın',
      'Kayısıyı üzerine ekleyin',
      'Hemen servis edin veya buzdolabında muhafaza edin',
    ],
    nutritionFacts: {
      calories: '95 kcal',
      protein: '4g',
      carbs: '18g',
    },
  },
];

export default function NutritionScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows, isDark } = useThemedStyles();
  const [selectedTab, setSelectedTab] = useState<'guides' | 'recipes'>('guides');
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const getDifficultyInfo = (difficulty: Recipe['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return { label: 'Kolay', color: colors.success[500] };
      case 'medium':
        return { label: 'Orta', color: colors.warning[500] };
      case 'hard':
        return { label: 'Zor', color: colors.error[500] };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={[styles.header, shadows.medium]}
      >
        <Ionicons name="nutrition" size={48} color="white" />
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>
          Beslenme Rehberi
        </Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          Sağlıklı gelişim için beslenme önerileri
        </Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'guides' && [styles.tabActive, { borderBottomColor: colors.success[500] }],
          ]}
          onPress={() => setSelectedTab('guides')}
        >
          <Ionicons
            name="book"
            size={24}
            color={selectedTab === 'guides' ? colors.success[500] : colors.neutral[400]}
          />
          <Text
            style={[
              styles.tabText,
              typography.bodyBold,
              { color: selectedTab === 'guides' ? colors.success[500] : colors.neutral[600] },
            ]}
          >
            Rehber
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'recipes' && [styles.tabActive, { borderBottomColor: colors.success[500] }],
          ]}
          onPress={() => setSelectedTab('recipes')}
        >
          <Ionicons
            name="restaurant"
            size={24}
            color={selectedTab === 'recipes' ? colors.success[500] : colors.neutral[400]}
          />
          <Text
            style={[
              styles.tabText,
              typography.bodyBold,
              { color: selectedTab === 'recipes' ? colors.success[500] : colors.neutral[600] },
            ]}
          >
            Tarifler
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedTab === 'guides' ? (
          <>
            {/* Introduction Card */}
            <View style={[styles.introCard, { backgroundColor: colors.success[50] }]}>
              <Ionicons name="information-circle" size={32} color={colors.success[600]} />
              <Text style={[styles.introText, typography.body, { color: colors.success[700] }]}>
                Bebeğinizin yaşına uygun beslenme rehberini inceleyin. Her bebeğin gelişimi farklıdır, öneriler için
                mutlaka doktorunuza danışın.
              </Text>
            </View>

            {/* Nutrition Guides */}
            {nutritionGuides.map((guide) => (
              <TouchableOpacity
                key={guide.id}
                style={[styles.guideCard, { backgroundColor: 'white' }, shadows.small]}
                onPress={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
              >
                <View style={styles.guideHeader}>
                  <View style={[styles.guideIcon, { backgroundColor: guide.color + '20' }]}>
                    <Ionicons name={guide.icon} size={32} color={guide.color} />
                  </View>
                  <View style={styles.guideHeaderText}>
                    <Text style={[styles.guideAgeRange, typography.caption, { color: guide.color }]}>
                      {guide.ageRange}
                    </Text>
                    <Text style={[styles.guideTitle, typography.h3, { color: colors.text }]}>
                      {guide.title}
                    </Text>
                    <Text style={[styles.guideDescription, typography.body, { color: colors.textSecondary }]}>
                      {guide.description}
                    </Text>
                  </View>
                  <Ionicons
                    name={expandedGuide === guide.id ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={colors.neutral[400]}
                  />
                </View>

                {expandedGuide === guide.id && (
                  <View style={[styles.guideTips, { borderTopColor: colors.neutral[200] }]}>
                    <Text style={[styles.guideTipsTitle, typography.bodyBold, { color: colors.text }]}>
                      Öneriler:
                    </Text>
                    {guide.tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <View style={[styles.tipBullet, { backgroundColor: guide.color }]} />
                        <Text style={[styles.tipText, typography.body, { color: colors.text }]}>
                          {tip}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Important Note */}
            <View style={[styles.noteCard, { backgroundColor: colors.warning[50] }]}>
              <Ionicons name="warning" size={24} color={colors.warning[600]} />
              <Text style={[styles.noteText, typography.caption, { color: colors.warning[700] }]}>
                Bal 1 yaşından önce verilmemelidir. Alerji riski taşıyan besinler dikkatli şekilde tanıtılmalıdır.
                Tuz ve şeker 1 yaşına kadar kullanılmamalıdır.
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Recipe Filter Info */}
            <View style={[styles.filterCard, { backgroundColor: 'white' }, shadows.small]}>
              <Text style={[styles.filterTitle, typography.h4, { color: colors.text }]}>
                Kolay ve Sağlıklı Tarifler
              </Text>
              <Text style={[styles.filterText, typography.body, { color: colors.textSecondary }]}>
                Yaş grubuna uygun, besleyici tarifler
              </Text>
            </View>

            {/* Recipes */}
            {recipes.map((recipe) => {
              const difficultyInfo = getDifficultyInfo(recipe.difficulty);
              return (
                <TouchableOpacity
                  key={recipe.id}
                  style={[styles.recipeCard, { backgroundColor: 'white' }, shadows.small]}
                  onPress={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                >
                  <View style={styles.recipeHeader}>
                    <View style={styles.recipeHeaderTop}>
                      <Text style={[styles.recipeName, typography.h3, { color: colors.text }]}>
                        {recipe.name}
                      </Text>
                      <Ionicons
                        name={expandedRecipe === recipe.id ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={colors.neutral[400]}
                      />
                    </View>

                    <View style={styles.recipeMetadata}>
                      <View style={styles.recipeMetaItem}>
                        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                        <Text style={[styles.recipeMetaText, typography.caption, { color: colors.textSecondary }]}>
                          {recipe.prepTime}
                        </Text>
                      </View>

                      <View style={styles.recipeMetaItem}>
                        <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                        <Text style={[styles.recipeMetaText, typography.caption, { color: colors.textSecondary }]}>
                          {recipe.ageMonths}+ ay
                        </Text>
                      </View>

                      <View style={[styles.recipeDifficulty, { backgroundColor: difficultyInfo.color + '20' }]}>
                        <Text style={[styles.recipeDifficultyText, { color: difficultyInfo.color }]}>
                          {difficultyInfo.label}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {expandedRecipe === recipe.id && (
                    <View style={[styles.recipeDetails, { borderTopColor: colors.neutral[200] }]}>
                      {/* Ingredients */}
                      <View style={styles.recipeSection}>
                        <Text style={[styles.recipeSectionTitle, typography.bodyBold, { color: colors.text }]}>
                          Malzemeler:
                        </Text>
                        {recipe.ingredients.map((ingredient, index) => (
                          <View key={index} style={styles.recipeListItem}>
                            <View style={[styles.recipeBullet, { backgroundColor: colors.success[500] }]} />
                            <Text style={[styles.recipeListText, typography.body, { color: colors.text }]}>
                              {ingredient}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Instructions */}
                      <View style={styles.recipeSection}>
                        <Text style={[styles.recipeSectionTitle, typography.bodyBold, { color: colors.text }]}>
                          Hazırlanışı:
                        </Text>
                        {recipe.instructions.map((instruction, index) => (
                          <View key={index} style={styles.recipeStepItem}>
                            <View style={[styles.recipeStepNumber, { backgroundColor: colors.success[500] }]}>
                              <Text style={[styles.recipeStepNumberText, { color: 'white' }]}>
                                {index + 1}
                              </Text>
                            </View>
                            <Text style={[styles.recipeStepText, typography.body, { color: colors.text }]}>
                              {instruction}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Nutrition Facts */}
                      <View style={[styles.nutritionFacts, { backgroundColor: colors.success[50] }]}>
                        <Text style={[styles.nutritionTitle, typography.bodyBold, { color: colors.success[700] }]}>
                          Besin Değerleri:
                        </Text>
                        <View style={styles.nutritionGrid}>
                          <View style={styles.nutritionItem}>
                            <Text style={[styles.nutritionLabel, typography.caption, { color: colors.success[600] }]}>
                              Kalori
                            </Text>
                            <Text style={[styles.nutritionValue, typography.bodyBold, { color: colors.success[700] }]}>
                              {recipe.nutritionFacts.calories}
                            </Text>
                          </View>
                          <View style={styles.nutritionItem}>
                            <Text style={[styles.nutritionLabel, typography.caption, { color: colors.success[600] }]}>
                              Protein
                            </Text>
                            <Text style={[styles.nutritionValue, typography.bodyBold, { color: colors.success[700] }]}>
                              {recipe.nutritionFacts.protein}
                            </Text>
                          </View>
                          <View style={styles.nutritionItem}>
                            <Text style={[styles.nutritionLabel, typography.caption, { color: colors.success[600] }]}>
                              Karbonhidrat
                            </Text>
                            <Text style={[styles.nutritionValue, typography.bodyBold, { color: colors.success[700] }]}>
                              {recipe.nutritionFacts.carbs}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 3,
  },
  tabText: {},
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  introCard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  introText: {
    flex: 1,
  },
  guideCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  guideHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  guideIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideHeaderText: {
    flex: 1,
    gap: 4,
  },
  guideAgeRange: {
    fontWeight: '700',
  },
  guideTitle: {},
  guideDescription: {},
  guideTips: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  guideTipsTitle: {
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
  },
  noteCard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
  },
  filterCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  filterTitle: {},
  filterText: {
    marginTop: 4,
  },
  recipeCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  recipeHeader: {
    gap: 12,
  },
  recipeHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeName: {},
  recipeMetadata: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  recipeMetaItem: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  recipeMetaText: {},
  recipeDifficulty: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  recipeDifficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  recipeDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 20,
  },
  recipeSection: {
    gap: 12,
  },
  recipeSectionTitle: {},
  recipeListItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  recipeBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  recipeListText: {
    flex: 1,
  },
  recipeStepItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  recipeStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeStepNumberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  recipeStepText: {
    flex: 1,
  },
  nutritionFacts: {
    padding: 16,
    borderRadius: 12,
  },
  nutritionTitle: {
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  nutritionLabel: {},
  nutritionValue: {},
});
