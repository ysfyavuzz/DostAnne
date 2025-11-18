import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  firstAidGuides,
  FirstAidGuide,
  EmergencyLevel,
  searchFirstAidGuides,
  getFirstAidByCategory,
  getFirstAidByEmergencyLevel,
} from '../data/firstAidData';

/**
 * First Aid Screen - Emergency Medical Guidance
 * 
 * Features:
 * - Quick emergency access buttons (112, 114)
 * - Life-threatening guides at top
 * - Category filtering
 * - Search functionality
 * - Color-coded severity levels
 */

const FirstAidScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<EmergencyLevel | 'all'>('all');

  // Filter guides based on search, category, and severity
  const filteredGuides = useMemo(() => {
    let guides = firstAidGuides;

    // Search filter
    if (searchQuery.trim()) {
      guides = searchFirstAidGuides(searchQuery);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      guides = guides.filter((guide) => guide.category === selectedCategory);
    }

    // Severity filter
    if (selectedSeverity !== 'all') {
      guides = guides.filter((guide) => guide.emergency === selectedSeverity);
    }

    // Sort by severity (life-threatening first)
    return guides.sort((a, b) => {
      const severityOrder = { 'life-threatening': 0, urgent: 1, 'non-urgent': 2 };
      return severityOrder[a.emergency] - severityOrder[b.emergency];
    });
  }, [searchQuery, selectedCategory, selectedSeverity]);

  const handleEmergencyCall = (number: string) => {
    Alert.alert(
      'Acil Arama',
      `${number} numarasını aramak istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ara',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          },
        },
      ]
    );
  };

  const handleGuidePress = (guide: FirstAidGuide) => {
    // Navigate to detail screen (to be created)
    // @ts-ignore - Navigation typing
    navigation.navigate('FirstAidDetail', { guideId: guide.id });
  };

  const getSeverityColor = (level: EmergencyLevel): string => {
    switch (level) {
      case 'life-threatening':
        return '#DC2626'; // Red
      case 'urgent':
        return '#F59E0B'; // Orange
      case 'non-urgent':
        return '#10B981'; // Green
    }
  };

  const getSeverityLabel = (level: EmergencyLevel): string => {
    switch (level) {
      case 'life-threatening':
        return 'HAYATI TEHLİKE';
      case 'urgent':
        return 'ACİL';
      case 'non-urgent':
        return 'ACİL DEĞİL';
    }
  };

  const getCategoryLabel = (category: FirstAidGuide['category']): string => {
    switch (category) {
      case 'acil':
        return 'Acil Durumlar';
      case 'yaralanma':
        return 'Yaralanmalar';
      case 'zehirlenme':
        return 'Zehirlenmeler';
      case 'hastalik':
        return 'Hastalıklar';
      case 'onlem':
        return 'Önlemler';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={['#DC2626', '#B91C1C']} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="medkit" size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}>İlk Yardım</Text>
        </View>
        <Text style={styles.headerSubtitle}>Acil Durum Rehberi</Text>
      </LinearGradient>

      {/* Emergency Call Buttons */}
      <View style={styles.emergencyButtons}>
        <TouchableOpacity
          style={[styles.emergencyButton, { backgroundColor: '#DC2626' }]}
          onPress={() => handleEmergencyCall('112')}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={28} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>112</Text>
          <Text style={styles.emergencyButtonLabel}>Acil Sağlık</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.emergencyButton, { backgroundColor: '#7C3AED' }]}
          onPress={() => handleEmergencyCall('114')}
          activeOpacity={0.8}
        >
          <Ionicons name="warning" size={28} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>114</Text>
          <Text style={styles.emergencyButtonLabel}>Zehir Danışma</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="İlk yardım ara... (örn: boğulma, ateş)"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {/* Severity Filters */}
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedSeverity === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setSelectedSeverity('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedSeverity === 'all' && styles.filterChipTextActive,
            ]}
          >
            Tümü
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedSeverity === 'life-threatening' && styles.filterChipActive,
            { borderColor: '#DC2626' },
          ]}
          onPress={() => setSelectedSeverity('life-threatening')}
        >
          <Ionicons name="alert-circle" size={16} color="#DC2626" />
          <Text style={[styles.filterChipText, { color: '#DC2626' }]}>
            Hayati Tehlike
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedSeverity === 'urgent' && styles.filterChipActive,
            { borderColor: '#F59E0B' },
          ]}
          onPress={() => setSelectedSeverity('urgent')}
        >
          <Ionicons name="warning" size={16} color="#F59E0B" />
          <Text style={[styles.filterChipText, { color: '#F59E0B' }]}>Acil</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Guides List */}
      <ScrollView
        style={styles.guidesContainer}
        contentContainerStyle={styles.guidesContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredGuides.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Aradığınız kriterlere uygun rehber bulunamadı'
                : 'Henüz rehber eklenmemiş'}
            </Text>
          </View>
        ) : (
          filteredGuides.map((guide) => (
            <TouchableOpacity
              key={guide.id}
              style={styles.guideCard}
              onPress={() => handleGuidePress(guide)}
              activeOpacity={0.7}
            >
              {/* Severity Badge */}
              <View
                style={[
                  styles.severityBadge,
                  { backgroundColor: getSeverityColor(guide.emergency) },
                ]}
              >
                <Text style={styles.severityBadgeText}>
                  {getSeverityLabel(guide.emergency)}
                </Text>
              </View>

              {/* Guide Icon and Title */}
              <View style={styles.guideHeader}>
                <View
                  style={[
                    styles.guideIcon,
                    { backgroundColor: `${guide.color}20` },
                  ]}
                >
                  <Ionicons name={guide.icon as any} size={32} color={guide.color} />
                </View>
                <View style={styles.guideTitleContainer}>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.guideSubtitle}>{guide.subtitle}</Text>
                  <Text style={styles.guideAgeRange}>
                    <Ionicons name="person" size={12} color="#6B7280" />{' '}
                    {guide.ageRange}
                  </Text>
                </View>
              </View>

              {/* Quick Summary */}
              <Text style={styles.guideSummary} numberOfLines={2}>
                {guide.recognition.mainSymptoms.slice(0, 3).join(' • ')}
              </Text>

              {/* Category Tag */}
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>
                  {getCategoryLabel(guide.category)}
                </Text>
              </View>

              {/* Arrow */}
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#9CA3AF"
                style={styles.guideArrow}
              />
            </TouchableOpacity>
          ))
        )}

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <Ionicons name="information-circle" size={20} color="#6B7280" />
          <Text style={styles.infoFooterText}>
            Bu rehberler acil durum rehberliği içindir. Ciddi durumlarda 112'yi arayın.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FECACA',
    marginTop: 4,
  },
  emergencyButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyButtonText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 8,
  },
  emergencyButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  filterContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#6366F1',
  },
  guidesContainer: {
    flex: 1,
  },
  guidesContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  severityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginRight: 100,
  },
  guideIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  guideTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  guideTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  guideSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  guideAgeRange: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  guideSummary: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  guideArrow: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 40,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 12,
  },
  infoFooterText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
});

export default FirstAidScreen;
