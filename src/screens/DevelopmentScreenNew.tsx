import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  getCurrentDevelopmentInfo, 
  wonderWeeksLeaps, 
  monthlyDevelopments 
} from '../data/developmentData';

const { width } = Dimensions.get('window');

// Animated Category Section Component
interface AnimatedCategorySectionProps {
  sectionKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  items: string[];
  isExpanded: boolean;
  onToggle: () => void;
  colors: any;
  typography: any;
  itemPrefix?: string;
}

const AnimatedCategorySection: React.FC<AnimatedCategorySectionProps> = ({
  sectionKey,
  icon,
  iconColor,
  title,
  items,
  isExpanded,
  onToggle,
  colors,
  typography,
  itemPrefix = '•',
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 200,
        delay: isExpanded ? 100 : 0,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded]);

  const chevronRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const iconScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity 
      style={styles.categorySection}
      onPress={onToggle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.categoryHeader, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={[styles.categoryTitle, typography.bodyBold, { color: colors.text }]}>
          {title} ({items.length})
        </Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={colors.textSecondary} 
          />
        </Animated.View>
      </Animated.View>

      {isExpanded && (
        <Animated.View style={{ opacity: opacityAnim }}>
          {items.map((item, idx) => {
            const itemOpacity = opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            });
            
            const itemTranslateY = opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            });

            return (
              <Animated.Text 
                key={idx} 
                style={[
                  styles.categoryItem, 
                  typography.body, 
                  { 
                    color: colors.textSecondary,
                    opacity: itemOpacity,
                    transform: [{ translateY: itemTranslateY }],
                  }
                ]}
              >
                {itemPrefix} {item}
              </Animated.Text>
            );
          })}
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

// Animated Progress Card Component
interface AnimatedProgressCardProps {
  completed: number;
  total: number;
  colors: any;
  typography: any;
  shadows: any;
}

const AnimatedProgressCard: React.FC<AnimatedProgressCardProps> = ({
  completed,
  total,
  colors,
  typography,
  shadows,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;
  const [displayCount, setDisplayCount] = useState(0);

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  useEffect(() => {
    // Animate progress bar
    Animated.spring(progressAnim, {
      toValue: percentage,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();

    // Animate number count-up
    Animated.timing(countAnim, {
      toValue: completed,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [completed, percentage]);

  // Listen to count animation value
  useEffect(() => {
    const listenerId = countAnim.addListener(({ value }) => {
      setDisplayCount(Math.round(value));
    });

    return () => {
      countAnim.removeListener(listenerId);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.progressCard, { backgroundColor: 'white' }, shadows.small]}>
      <Text style={[styles.progressTitle, typography.h3, { color: colors.text }]}>
        İlerleme
      </Text>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary[500],
              width: progressWidth,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary[400], colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </View>
      <Text style={[styles.progressText, typography.body, { color: colors.textSecondary }]}>
        {displayCount} / {total} kilometre taşı tamamlandı
      </Text>
      
      {/* Percentage Badge */}
      {percentage > 0 && (
        <View style={[styles.percentageBadge, { backgroundColor: colors.primary[100] }]}>
          <Text style={[styles.percentageText, typography.bodyBold, { color: colors.primary[700] }]}>
            %{Math.round(percentage)}
          </Text>
        </View>
      )}
    </View>
  );
};

interface Milestone {
  id: string;
  month: number;
  category: 'physical' | 'cognitive' | 'social' | 'language';
  title: string;
  description: string;
  completed: boolean;
  completedDate?: string;
}

interface GrowthRecord {
  id: string;
  date: string;
  weight: number; // in kg
  height: number; // in cm
  headCircumference?: number; // in cm
  notes?: string;
}

// Standard WHO growth milestones
const standardMilestones: Omit<Milestone, 'id' | 'completed' | 'completedDate'>[] = [
  // 0-3 months
  { month: 0, category: 'physical', title: 'Başını kaldırıyor', description: 'Yüzüstü yatarken başını kısa süreliğine kaldırabiliyor' },
  { month: 1, category: 'social', title: 'Göz teması kuruyor', description: 'Yüzlere bakıyor ve göz teması kuruyor' },
  { month: 2, category: 'language', title: 'Gülümsüyor', description: 'Sosyal gülümseme gösteriyor' },
  { month: 3, category: 'physical', title: 'Başını dik tutuyor', description: 'Oturur pozisyonda başını dik tutuyor' },
  
  // 4-6 months
  { month: 4, category: 'physical', title: 'Yönlendirilmiş hareket', description: 'Nesnelere uzanıyor ve yakalıyor' },
  { month: 5, category: 'cognitive', title: 'Nesneleri keşfediyor', description: 'Nesneleri ağzına götürüyor ve inceliyor' },
  { month: 6, category: 'physical', title: 'Desteksiz oturuyor', description: 'Kısa süre desteksiz oturabiliyor' },
  
  // 7-9 months
  { month: 7, category: 'language', title: 'Sesler çıkarıyor', description: '"ba-ba", "ma-ma" gibi heceler söylüyor' },
  { month: 8, category: 'physical', title: 'Emekliyor', description: 'Eller ve dizler üzerinde emekliyor' },
  { month: 9, category: 'cognitive', title: 'Nesne sürekliliği', description: 'Saklanan nesneleri arıyor' },
  
  // 10-12 months
  { month: 10, category: 'physical', title: 'Tutunarak ayakta duruyor', description: 'Mobilyalara tutunarak ayakta duruyor' },
  { month: 11, category: 'social', title: 'El sallıyor', description: 'Hoşça kal için el sallıyor' },
  { month: 12, category: 'physical', title: 'İlk adımlar', description: 'Bağımsız olarak birkaç adım atıyor' },
  
  // 13-18 months
  { month: 15, category: 'language', title: 'İlk kelimeler', description: '2-3 anlamlı kelime söylüyor' },
  { month: 16, category: 'physical', title: 'Güvenli yürüyor', description: 'Güvenle yürüyor, nadiren düşüyor' },
  { month: 18, category: 'cognitive', title: 'Taklit ediyor', description: 'Ev işlerini taklit ediyor' },
];

export default function DevelopmentScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);

  const [selectedTab, setSelectedTab] = useState<'growth' | 'milestones'>('growth');
  const [showAddGrowth, setShowAddGrowth] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  // Animation refs for each section
  const animationRefs = useRef<{[key: string]: {
    height: Animated.Value;
    rotate: Animated.Value;
    opacity: Animated.Value;
  }}>({});

  // Initialize animation values for a section if not exists
  const getAnimationValues = (sectionKey: string) => {
    if (!animationRefs.current[sectionKey]) {
      animationRefs.current[sectionKey] = {
        height: new Animated.Value(0),
        rotate: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    }
    return animationRefs.current[sectionKey];
  };

  // Toggle section expansion with animation
  const toggleSection = (sectionKey: string) => {
    const isExpanded = expandedSections[sectionKey];
    const animations = getAnimationValues(sectionKey);

    // Update state
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));

    // Animate expansion/collapse
    Animated.parallel([
      Animated.timing(animations.height, {
        toValue: isExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1), // Material Design easing
        useNativeDriver: false,
      }),
      Animated.timing(animations.rotate, {
        toValue: isExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(animations.opacity, {
        toValue: isExpanded ? 0 : 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const [milestones, setMilestones] = useState<Milestone[]>(
    standardMilestones.map((m, i) => ({
      ...m,
      id: `milestone-${i}`,
      completed: false,
    }))
  );
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([
    { id: '1', date: '2024-01-15', weight: 3.5, height: 50, headCircumference: 35 },
    { id: '2', date: '2024-02-15', weight: 4.2, height: 54, headCircumference: 37 },
    { id: '3', date: '2024-03-15', weight: 5.0, height: 58, headCircumference: 39 },
    { id: '4', date: '2024-04-15', weight: 5.8, height: 62, headCircumference: 40.5 },
    { id: '5', date: '2024-05-15', weight: 6.5, height: 65, headCircumference: 42 },
  ]);

  const [newGrowth, setNewGrowth] = useState<Partial<GrowthRecord>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    height: 0,
    headCircumference: 0,
    notes: '',
  });

  // Calculate baby's age and get development info
  const developmentInfo = useMemo(() => {
    if (!currentBaby?.birthDate) return null;
    return getCurrentDevelopmentInfo(new Date(currentBaby.birthDate));
  }, [currentBaby]);

  const babyAgeInMonths = developmentInfo?.months || 0;
  const babyAgeInWeeks = developmentInfo?.weeks || 0;
  const currentLeap = developmentInfo?.leapInfo;
  const currentMonthInfo = developmentInfo?.monthlyInfo;

  // Get relevant milestones for baby's age
  const relevantMilestones = useMemo(() => {
    const startMonth = Math.max(0, babyAgeInMonths - 2);
    const endMonth = babyAgeInMonths + 4;
    return milestones.filter((m) => m.month >= startMonth && m.month <= endMonth);
  }, [milestones, babyAgeInMonths]);

  // Calculate growth stats
  const growthStats = useMemo(() => {
    if (growthRecords.length === 0) return null;

    const latest = growthRecords[growthRecords.length - 1];
    const previous = growthRecords.length > 1 ? growthRecords[growthRecords.length - 2] : null;

    const weightGain = previous ? latest.weight - previous.weight : 0;
    const heightGain = previous ? latest.height - previous.height : 0;

    return {
      currentWeight: latest.weight,
      currentHeight: latest.height,
      currentHead: latest.headCircumference,
      weightGain,
      heightGain,
    };
  }, [growthRecords]);

  // Handle milestone toggle
  const toggleMilestone = (id: string) => {
    setMilestones(
      milestones.map((m) =>
        m.id === id
          ? {
              ...m,
              completed: !m.completed,
              completedDate: !m.completed ? new Date().toISOString() : undefined,
            }
          : m
      )
    );
  };

  // Handle add growth record
  const handleAddGrowth = () => {
    if (!newGrowth.weight || !newGrowth.height) {
      Alert.alert('Hata', 'Lütfen en az kilo ve boy bilgilerini girin');
      return;
    }

    const record: GrowthRecord = {
      id: Date.now().toString(),
      date: newGrowth.date!,
      weight: newGrowth.weight!,
      height: newGrowth.height!,
      headCircumference: newGrowth.headCircumference || undefined,
      notes: newGrowth.notes || undefined,
    };

    setGrowthRecords([...growthRecords, record].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewGrowth({ date: new Date().toISOString().split('T')[0], weight: 0, height: 0, headCircumference: 0, notes: '' });
    setShowAddGrowth(false);
    Alert.alert('Başarılı', 'Büyüme kaydı eklendi');
  };

  // Get milestone category info
  const getMilestoneCategory = (category: Milestone['category']) => {
    switch (category) {
      case 'physical':
        return { icon: 'fitness' as const, color: colors.activity.health, label: 'Fiziksel' };
      case 'cognitive':
        return { icon: 'bulb' as const, color: colors.secondary[500], label: 'Bilişsel' };
      case 'social':
        return { icon: 'people' as const, color: colors.primary[500], label: 'Sosyal' };
      case 'language':
        return { icon: 'chatbubbles' as const, color: colors.activity.feeding, label: 'Dil' };
    }
  };

  // Render simple growth chart (mock visualization)
  const renderGrowthChart = () => {
    if (growthRecords.length === 0) return null;

    const maxWeight = Math.max(...growthRecords.map((r) => r.weight));
    const maxHeight = Math.max(...growthRecords.map((r) => r.height));

    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, typography.h4, { color: colors.text }]}>
          Büyüme Grafiği
        </Text>
        
        {/* Weight Chart */}
        <View style={styles.chart}>
          <Text style={[styles.chartLabel, typography.caption, { color: colors.textSecondary }]}>
            Kilo (kg)
          </Text>
          <View style={styles.chartBars}>
            {growthRecords.map((record, index) => {
              const heightPercent = (record.weight / maxWeight) * 100;
              return (
                <View key={record.id} style={styles.barContainer}>
                  <LinearGradient
                    colors={colors.gradients.pink}
                    style={[styles.bar, { height: `${heightPercent}%` }]}
                  />
                  <Text style={[styles.barLabel, typography.caption, { color: colors.textSecondary }]}>
                    {new Date(record.date).toLocaleDateString('tr-TR', { month: 'short' })}
                  </Text>
                  <Text style={[styles.barValue, typography.caption, { color: colors.text }]}>
                    {record.weight}kg
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Height Chart */}
        <View style={[styles.chart, { marginTop: 24 }]}>
          <Text style={[styles.chartLabel, typography.caption, { color: colors.textSecondary }]}>
            Boy (cm)
          </Text>
          <View style={styles.chartBars}>
            {growthRecords.map((record, index) => {
              const heightPercent = (record.height / maxHeight) * 100;
              return (
                <View key={record.id} style={styles.barContainer}>
                  <LinearGradient
                    colors={colors.gradients.blue}
                    style={[styles.bar, { height: `${heightPercent}%` }]}
                  />
                  <Text style={[styles.barLabel, typography.caption, { color: colors.textSecondary }]}>
                    {new Date(record.date).toLocaleDateString('tr-TR', { month: 'short' })}
                  </Text>
                  <Text style={[styles.barValue, typography.caption, { color: colors.text }]}>
                    {record.height}cm
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradients.purple}
        style={[styles.header, shadows.medium]}
      >
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>
          Gelişim Takibi
        </Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          {babyAgeInMonths} Aylık • {babyAgeInWeeks} Haftalık
        </Text>
        {currentLeap && (
          <View style={styles.leapBadge}>
            <Ionicons name="trending-up" size={16} color="white" />
            <Text style={[styles.leapText, { color: 'white' }]}>
              Wonder Week {currentLeap.leap}: {currentLeap.name}
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'growth' && [styles.tabActive, { borderBottomColor: colors.primary[500] }],
          ]}
          onPress={() => setSelectedTab('growth')}
        >
          <Ionicons
            name="trending-up"
            size={24}
            color={selectedTab === 'growth' ? colors.primary[500] : colors.neutral[400]}
          />
          <Text
            style={[
              styles.tabText,
              typography.bodyBold,
              { color: selectedTab === 'growth' ? colors.primary[500] : colors.neutral[600] },
            ]}
          >
            Büyüme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'milestones' && [styles.tabActive, { borderBottomColor: colors.primary[500] }],
          ]}
          onPress={() => setSelectedTab('milestones')}
        >
          <Ionicons
            name="flag"
            size={24}
            color={selectedTab === 'milestones' ? colors.primary[500] : colors.neutral[400]}
          />
          <Text
            style={[
              styles.tabText,
              typography.bodyBold,
              { color: selectedTab === 'milestones' ? colors.primary[500] : colors.neutral[600] },
            ]}
          >
            Kilometre Taşları
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedTab === 'growth' ? (
          <>
            {/* Growth Stats Card */}
            {growthStats && (
              <View style={[styles.statsCard, { backgroundColor: 'white' }, shadows.small]}>
                <Text style={[styles.statsTitle, typography.h3, { color: colors.text }]}>
                  Güncel Ölçümler
                </Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <LinearGradient colors={colors.gradients.pink} style={styles.statIcon}>
                      <Ionicons name="barbell" size={32} color="white" />
                    </LinearGradient>
                    <Text style={[styles.statValue, typography.h2, { color: colors.text }]}>
                      {growthStats.currentWeight} kg
                    </Text>
                    <Text style={[styles.statLabel, typography.caption, { color: colors.textSecondary }]}>
                      Kilo
                    </Text>
                    {growthStats.weightGain !== 0 && (
                      <Text style={[styles.statChange, { color: colors.success[500] }]}>
                        +{growthStats.weightGain.toFixed(1)} kg
                      </Text>
                    )}
                  </View>

                  <View style={styles.statItem}>
                    <LinearGradient colors={colors.gradients.blue} style={styles.statIcon}>
                      <Ionicons name="resize" size={32} color="white" />
                    </LinearGradient>
                    <Text style={[styles.statValue, typography.h2, { color: colors.text }]}>
                      {growthStats.currentHeight} cm
                    </Text>
                    <Text style={[styles.statLabel, typography.caption, { color: colors.textSecondary }]}>
                      Boy
                    </Text>
                    {growthStats.heightGain !== 0 && (
                      <Text style={[styles.statChange, { color: colors.success[500] }]}>
                        +{growthStats.heightGain.toFixed(1)} cm
                      </Text>
                    )}
                  </View>

                  {growthStats.currentHead && (
                    <View style={styles.statItem}>
                      <LinearGradient colors={colors.gradients.purple} style={styles.statIcon}>
                        <Ionicons name="ellipse-outline" size={32} color="white" />
                      </LinearGradient>
                      <Text style={[styles.statValue, typography.h2, { color: colors.text }]}>
                        {growthStats.currentHead} cm
                      </Text>
                      <Text style={[styles.statLabel, typography.caption, { color: colors.textSecondary }]}>
                        Baş Çevresi
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity onPress={() => setShowAddGrowth(true)}>
                  <LinearGradient colors={colors.gradients.primary} style={styles.addButton}>
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={[styles.addButtonText, { color: 'white' }]}>
                      Yeni Ölçüm Ekle
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Growth Chart */}
            <View style={[styles.chartCard, { backgroundColor: 'white' }, shadows.small]}>
              {renderGrowthChart()}
            </View>

            {/* Growth Records */}
            <View style={[styles.recordsCard, { backgroundColor: 'white' }, shadows.small]}>
              <Text style={[styles.recordsTitle, typography.h3, { color: colors.text }]}>
                Geçmiş Ölçümler
              </Text>
              {growthRecords.slice().reverse().map((record) => (
                <View
                  key={record.id}
                  style={[styles.recordItem, { borderBottomColor: colors.neutral[200] }]}
                >
                  <View style={styles.recordLeft}>
                    <Text style={[styles.recordDate, typography.bodyBold, { color: colors.text }]}>
                      {new Date(record.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                    {record.notes && (
                      <Text style={[styles.recordNotes, typography.caption, { color: colors.textSecondary }]}>
                        {record.notes}
                      </Text>
                    )}
                  </View>
                  <View style={styles.recordRight}>
                    <Text style={[styles.recordValue, typography.body, { color: colors.text }]}>
                      {record.weight}kg • {record.height}cm
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Milestones Progress Card with Animation */}
            <AnimatedProgressCard
              completed={relevantMilestones.filter((m) => m.completed).length}
              total={relevantMilestones.length}
              colors={colors}
              typography={typography}
              shadows={shadows}
            />

            {/* Current Month Development Info */}
            {currentMonthInfo && (
              <View style={[styles.monthInfoCard, { backgroundColor: 'white' }, shadows.small]}>
                <Text style={[styles.monthInfoTitle, typography.h3, { color: colors.text }]}>
                  {currentMonthInfo.title}
                </Text>
                <Text style={[styles.monthInfoSubtitle, typography.body, { color: colors.textSecondary }]}>
                  {currentMonthInfo.subtitle}
                </Text>
                <Text style={[styles.monthInfoSummary, typography.body, { color: colors.text }]}>
                  {currentMonthInfo.summary}
                </Text>

                {/* Development Categories - Expandable with Animations */}
                {currentMonthInfo.physical.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="physical"
                    icon="fitness"
                    iconColor={colors.primary[500]}
                    title="Fiziksel Gelişim"
                    items={currentMonthInfo.physical}
                    isExpanded={expandedSections['physical'] || false}
                    onToggle={() => toggleSection('physical')}
                    colors={colors}
                    typography={typography}
                  />
                )}

                {currentMonthInfo.cognitive.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="cognitive"
                    icon="bulb"
                    iconColor={colors.secondary[500]}
                    title="Bilişsel Gelişim"
                    items={currentMonthInfo.cognitive}
                    isExpanded={expandedSections['cognitive'] || false}
                    onToggle={() => toggleSection('cognitive')}
                    colors={colors}
                    typography={typography}
                  />
                )}

                {currentMonthInfo.activities.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="activities"
                    icon="game-controller"
                    iconColor={colors.success[500]}
                    title="Önerilen Aktiviteler"
                    items={currentMonthInfo.activities}
                    isExpanded={expandedSections['activities'] || false}
                    onToggle={() => toggleSection('activities')}
                    colors={colors}
                    typography={typography}
                  />
                )}

                {currentMonthInfo.toys.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="toys"
                    icon="cube"
                    iconColor={colors.activity.feeding}
                    title="Önerilen Oyuncaklar"
                    items={currentMonthInfo.toys}
                    isExpanded={expandedSections['toys'] || false}
                    onToggle={() => toggleSection('toys')}
                    colors={colors}
                    typography={typography}
                  />
                )}

                {/* Social Development */}
                {currentMonthInfo.social.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="social"
                    icon="people"
                    iconColor={colors.primary[500]}
                    title="Sosyal Gelişim"
                    items={currentMonthInfo.social}
                    isExpanded={expandedSections['social'] || false}
                    onToggle={() => toggleSection('social')}
                    colors={colors}
                    typography={typography}
                  />
                )}

                {/* Language Development */}
                {currentMonthInfo.language.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="language"
                    icon="chatbubbles"
                    iconColor={colors.activity.feeding}
                    title="Dil Gelişimi"
                    items={currentMonthInfo.language}
                    isExpanded={expandedSections['language'] || false}
                    onToggle={() => toggleSection('language')}
                    colors={colors}
                    typography={typography}
                  />
                )}

                {/* Play Skills */}
                {currentMonthInfo.play.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="play"
                    icon="game-controller"
                    iconColor={colors.success[500]}
                    title="Oyun Becerileri"
                    items={currentMonthInfo.play}
                    isExpanded={expandedSections['play'] || false}
                    onToggle={() => toggleSection('play')}
                    colors={colors}
                    typography={typography}
                  />
                )}

                {/* Nutrition */}
                {currentMonthInfo.nutrition.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="nutrition"
                    icon="restaurant"
                    iconColor={colors.activity.feeding}
                    title="Beslenme"
                    items={currentMonthInfo.nutrition}
                    isExpanded={expandedSections['nutrition'] || false}
                    onToggle={() => toggleSection('nutrition')}
                    colors={colors}
                    typography={typography}
                  />
                )}

                {/* Tips */}
                {currentMonthInfo.tips.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="tips"
                    icon="bulb"
                    iconColor={colors.secondary[500]}
                    title="İpuçları"
                    items={currentMonthInfo.tips}
                    isExpanded={expandedSections['tips'] || false}
                    onToggle={() => toggleSection('tips')}
                    colors={colors}
                    typography={typography}
                    itemPrefix="💡"
                  />
                )}

                {/* Warnings */}
                {currentMonthInfo.warnings.length > 0 && (
                  <AnimatedCategorySection
                    sectionKey="warnings"
                    icon="warning"
                    iconColor="#F59E0B"
                    title="Dikkat Edilmesi Gerekenler"
                    items={currentMonthInfo.warnings}
                    isExpanded={expandedSections['warnings'] || false}
                    onToggle={() => toggleSection('warnings')}
                    colors={colors}
                    typography={typography}
                    itemPrefix="⚠️"
                  />
                )}
              </View>
            )}

            {/* Milestones List */}
            <View style={[styles.milestonesCard, { backgroundColor: 'white' }, shadows.small]}>
              <Text style={[styles.milestonesTitle, typography.h3, { color: colors.text }]}>
                Kilometre Taşları
              </Text>

              {relevantMilestones.map((milestone) => {
                const categoryInfo = getMilestoneCategory(milestone.category);
                return (
                  <TouchableOpacity
                    key={milestone.id}
                    style={[
                      styles.milestoneItem,
                      { borderLeftColor: categoryInfo.color },
                      milestone.completed && styles.milestoneCompleted,
                    ]}
                    onPress={() => toggleMilestone(milestone.id)}
                  >
                    <View style={[styles.milestoneIcon, { backgroundColor: categoryInfo.color + '20' }]}>
                      <Ionicons name={categoryInfo.icon} size={24} color={categoryInfo.color} />
                    </View>
                    <View style={styles.milestoneInfo}>
                      <View style={styles.milestoneHeader}>
                        <Text
                          style={[
                            styles.milestoneTitle,
                            typography.bodyBold,
                            { color: colors.text },
                            milestone.completed && styles.milestoneTitleCompleted,
                          ]}
                        >
                          {milestone.title}
                        </Text>
                        <Text style={[styles.milestoneMonth, typography.caption, { color: colors.textSecondary }]}>
                          {milestone.month}. ay
                        </Text>
                      </View>
                      <Text style={[styles.milestoneDescription, typography.caption, { color: colors.textSecondary }]}>
                        {milestone.description}
                      </Text>
                      <Text style={[styles.milestoneCategory, typography.caption, { color: categoryInfo.color }]}>
                        {categoryInfo.label}
                      </Text>
                    </View>
                    <Ionicons
                      name={milestone.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={32}
                      color={milestone.completed ? colors.success[500] : colors.neutral[300]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Add Growth Modal */}
      <Modal
        visible={showAddGrowth}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddGrowth(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: 'white' }, shadows.large]}>
            <Text style={[styles.modalTitle, typography.h2, { color: colors.text }]}>
              Yeni Ölçüm Ekle
            </Text>

            <View style={styles.form}>
              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Tarih (YYYY-MM-DD)"
                placeholderTextColor={colors.textSecondary}
                value={newGrowth.date}
                onChangeText={(text) => setNewGrowth({ ...newGrowth, date: text })}
              />

              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Kilo (kg)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={newGrowth.weight ? newGrowth.weight.toString() : ''}
                onChangeText={(text) => setNewGrowth({ ...newGrowth, weight: parseFloat(text) || 0 })}
              />

              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Boy (cm)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={newGrowth.height ? newGrowth.height.toString() : ''}
                onChangeText={(text) => setNewGrowth({ ...newGrowth, height: parseFloat(text) || 0 })}
              />

              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Baş Çevresi (cm) - Opsiyonel"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={newGrowth.headCircumference ? newGrowth.headCircumference.toString() : ''}
                onChangeText={(text) => setNewGrowth({ ...newGrowth, headCircumference: parseFloat(text) || 0 })}
              />

              <TextInput
                style={[styles.input, styles.textArea, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Notlar (opsiyonel)"
                placeholderTextColor={colors.textSecondary}
                value={newGrowth.notes}
                onChangeText={(text) => setNewGrowth({ ...newGrowth, notes: text })}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.neutral[200] }]}
                onPress={() => setShowAddGrowth(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAddGrowth}>
                <LinearGradient colors={colors.gradients.primary} style={styles.modalButton}>
                  <Text style={[styles.modalButtonText, { color: 'white' }]}>Kaydet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  leapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  leapText: {
    fontSize: 13,
    fontWeight: '600',
  },
  monthInfoCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  monthInfoTitle: {
    marginBottom: 4,
  },
  monthInfoSubtitle: {
    marginBottom: 12,
    fontStyle: 'italic',
  },
  monthInfoSummary: {
    marginBottom: 20,
    lineHeight: 22,
  },
  categorySection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingVertical: 8,
  },
  categoryTitle: {
    flex: 1,
  },
  categoryItem: {
    marginLeft: 8,
    marginBottom: 8,
    lineHeight: 20,
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
  statsCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  statsTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {},
  statLabel: {},
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  chartCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  chartContainer: {},
  chartTitle: {
    marginBottom: 16,
  },
  chart: {},
  chartLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  chartBars: {
    flexDirection: 'row',
    height: 150,
    gap: 8,
    alignItems: 'flex-end',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: '100%',
    minHeight: 20,
    borderRadius: 4,
  },
  barLabel: {
    marginTop: 4,
  },
  barValue: {
    fontWeight: '600',
  },
  recordsCard: {
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  recordsTitle: {
    marginBottom: 16,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  recordLeft: {
    flex: 1,
    gap: 4,
  },
  recordDate: {},
  recordNotes: {
    fontStyle: 'italic',
  },
  recordRight: {},
  recordValue: {},
  progressCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  progressTitle: {
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    marginTop: 12,
    textAlign: 'center',
  },
  milestonesCard: {
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  milestonesTitle: {
    marginBottom: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
  },
  milestoneCompleted: {
    opacity: 0.6,
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneInfo: {
    flex: 1,
    gap: 4,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneTitle: {},
  milestoneTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  milestoneMonth: {},
  milestoneDescription: {},
  milestoneCategory: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 24,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  percentageBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 14,
  },
});
