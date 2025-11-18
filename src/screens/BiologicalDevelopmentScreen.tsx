import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  getBiologicalDevelopmentData,
  calculateAgeInMonths,
  getGrowthCategory,
} from '../data/biologicalDevelopmentData';

const { width } = Dimensions.get('window');

// Organ system configuration
const organSystems = [
  { key: 'cardiovascular', icon: 'heart', color: '#EF4444', label: 'Kalp' },
  { key: 'respiratory', icon: 'fitness', color: '#3B82F6', label: 'Solunum' },
  { key: 'digestive', icon: 'restaurant', color: '#F59E0B', label: 'Sindirim' },
  { key: 'renal', icon: 'water', color: '#06B6D4', label: 'Böbrek' },
  { key: 'nervous', icon: 'flash', color: '#8B5CF6', label: 'Sinir' },
  { key: 'immune', icon: 'shield', color: '#10B981', label: 'Bağışıklık' },
  { key: 'musculoskeletal', icon: 'body', color: '#F97316', label: 'Kas-İskelet' },
  { key: 'sensory', icon: 'eye', color: '#EC4899', label: 'Duyular' },
  { key: 'integumentary', icon: 'hand-left', color: '#14B8A6', label: 'Cilt' },
  { key: 'dental', icon: 'happy', color: '#6366F1', label: 'Diş' },
] as const;

export default function BiologicalDevelopmentScreen() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);

  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  // Calculate baby's age and get data
  const babyAge = useMemo(() => {
    if (!currentBaby?.birthDate) return 0;
    return calculateAgeInMonths(new Date(currentBaby.birthDate));
  }, [currentBaby]);

  const biologicalData = useMemo(() => {
    return getBiologicalDevelopmentData(babyAge);
  }, [babyAge]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!biologicalData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.noDataContainer}>
          <Ionicons name="information-circle" size={64} color={colors.neutral[400]} />
          <Text style={[styles.noDataText, typography.h3, { color: colors.text }]}>
            {babyAge} aylık verisi henüz eklenmedi
          </Text>
          <Text style={[styles.noDataSubtext, typography.body, { color: colors.textSecondary }]}>
            Yakında eklenecek...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render organ system card
  const renderOrganSystemCard = (system: typeof organSystems[number]) => {
    const systemData = biologicalData[system.key as keyof typeof biologicalData];
    if (!systemData || typeof systemData === 'string') return null;

    return (
      <TouchableOpacity
        key={system.key}
        style={[styles.systemCard, { backgroundColor: 'white' }, shadows.small]}
        onPress={() => setSelectedSystem(system.key)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[system.color + '20', system.color + '10']}
          style={styles.systemCardGradient}
        >
          <View style={[styles.systemIcon, { backgroundColor: system.color }]}>
            <Ionicons name={system.icon as any} size={24} color="white" />
          </View>
          <Text style={[styles.systemLabel, typography.bodyBold, { color: colors.text }]}>
            {system.label}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Render growth metrics
  const renderGrowthMetrics = () => {
    const { growth } = biologicalData;
    const gender = currentBaby?.gender || 'male';
    const genderData = growth.weight[gender];

    return (
      <View style={[styles.metricsCard, { backgroundColor: 'white' }, shadows.small]}>
        <Text style={[styles.sectionTitle, typography.h3, { color: colors.text }]}>
          📏 Büyüme Metrikleri
        </Text>

        {/* Weight */}
        <View style={styles.metricRow}>
          <View style={styles.metricIcon}>
            <Ionicons name="barbell" size={20} color={colors.primary[500]} />
          </View>
          <View style={styles.metricInfo}>
            <Text style={[styles.metricLabel, typography.body, { color: colors.textSecondary }]}>
              Kilo
            </Text>
            <Text style={[styles.metricValue, typography.h4, { color: colors.text }]}>
              {growth.weight[gender].average} {growth.weight[gender].unit}
            </Text>
            <Text style={[styles.metricRange, typography.caption, { color: colors.textSecondary }]}>
              Normal: {growth.weight[gender].min}-{growth.weight[gender].max} {growth.weight[gender].unit}
            </Text>
          </View>
        </View>

        {/* Height */}
        <View style={styles.metricRow}>
          <View style={styles.metricIcon}>
            <Ionicons name="resize" size={20} color={colors.secondary[500]} />
          </View>
          <View style={styles.metricInfo}>
            <Text style={[styles.metricLabel, typography.body, { color: colors.textSecondary }]}>
              Boy
            </Text>
            <Text style={[styles.metricValue, typography.h4, { color: colors.text }]}>
              {growth.height[gender].average} {growth.height[gender].unit}
            </Text>
            <Text style={[styles.metricRange, typography.caption, { color: colors.textSecondary }]}>
              Normal: {growth.height[gender].min}-{growth.height[gender].max} {growth.height[gender].unit}
            </Text>
          </View>
        </View>

        {/* Head Circumference */}
        <View style={styles.metricRow}>
          <View style={styles.metricIcon}>
            <Ionicons name="ellipse-outline" size={20} color={colors.activity.feeding} />
          </View>
          <View style={styles.metricInfo}>
            <Text style={[styles.metricLabel, typography.body, { color: colors.textSecondary }]}>
              Baş Çevresi
            </Text>
            <Text style={[styles.metricValue, typography.h4, { color: colors.text }]}>
              {growth.headCircumference[gender].average} {growth.headCircumference[gender].unit}
            </Text>
            <Text style={[styles.metricRange, typography.caption, { color: colors.textSecondary }]}>
              Normal: {growth.headCircumference[gender].min}-{growth.headCircumference[gender].max}{' '}
              {growth.headCircumference[gender].unit}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Render health checklist
  const renderHealthChecklist = () => {
    return (
      <View style={[styles.checklistCard, { backgroundColor: 'white' }, shadows.small]}>
        <Text style={[styles.sectionTitle, typography.h3, { color: colors.text }]}>
          ✅ Sağlık Kontrol Listesi
        </Text>

        {biologicalData.healthChecklist.map((category, idx) => (
          <View key={idx} style={styles.checklistCategory}>
            <TouchableOpacity
              style={styles.checklistHeader}
              onPress={() => toggleCategory(category.category)}
              activeOpacity={0.7}
            >
              <Text style={[styles.checklistCategoryTitle, typography.bodyBold, { color: colors.text }]}>
                {category.category}
              </Text>
              <Ionicons
                name={expandedCategories[category.category] ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {expandedCategories[category.category] &&
              category.items.map((item, itemIdx) => (
                <View key={itemIdx} style={styles.checklistItem}>
                  <Text style={[styles.checklistCheck, typography.body, { color: colors.text }]}>
                    • {item.check}
                  </Text>
                  <View style={styles.checklistAnswer}>
                    <Text style={[styles.checklistNormal, { color: colors.success[600] }]}>
                      ✓ {item.normal}
                    </Text>
                    <Text style={[styles.checklistConcern, { color: colors.error[600] }]}>
                      ✗ {item.concern}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <LinearGradient colors={colors.gradients.blue} style={[styles.header, shadows.medium]}>
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>
          Biyolojik Gelişim
        </Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          {biologicalData.ageRange}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Growth Metrics */}
        {renderGrowthMetrics()}

        {/* Organ Systems Grid */}
        <View style={[styles.systemsCard, { backgroundColor: 'white' }, shadows.small]}>
          <Text style={[styles.sectionTitle, typography.h3, { color: colors.text }]}>
            🧬 Organ Sistemleri
          </Text>
          <View style={styles.systemsGrid}>
            {organSystems.map((system) => renderOrganSystemCard(system))}
          </View>
        </View>

        {/* Health Checklist */}
        {renderHealthChecklist()}

        {/* Info Footer */}
        <View style={[styles.infoCard, { backgroundColor: colors.primary[50] }]}>
          <Ionicons name="information-circle" size={24} color={colors.primary[500]} />
          <Text style={[styles.infoText, typography.caption, { color: colors.primary[700] }]}>
            Bu veriler genel rehberlik içindir. Bebeğinizin gelişimi bireyseldir. Endişeleriniz için doktorunuza
            danışın.
          </Text>
        </View>
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
    textAlign: 'center',
  },
  headerSubtitle: {
    marginTop: 8,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  metricsCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    marginBottom: 4,
  },
  metricValue: {
    marginBottom: 2,
  },
  metricRange: {},
  systemsCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  systemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  systemCard: {
    width: (width - 64) / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  systemCardGradient: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  systemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemLabel: {
    textAlign: 'center',
  },
  checklistCard: {
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  checklistCategory: {
    marginBottom: 16,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checklistCategoryTitle: {},
  checklistItem: {
    marginTop: 12,
    paddingLeft: 16,
  },
  checklistCheck: {
    marginBottom: 4,
  },
  checklistAnswer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  checklistNormal: {
    fontSize: 14,
  },
  checklistConcern: {
    fontSize: 14,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noDataText: {
    marginTop: 16,
    textAlign: 'center',
  },
  noDataSubtext: {
    marginTop: 8,
    textAlign: 'center',
  },
});
