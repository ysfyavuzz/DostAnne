import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';
import { 
  AIRecommendationService, 
  Recommendation, 
  BabyProfile 
} from './AIRecommendations';
import { LoadingOverlay } from '../ui/LoadingComponents';

const ThemedText = createText();
const { width: screenWidth } = Dimensions.get('window');

interface AIRecommendationComponentProps {
  visible: boolean;
  onClose: () => void;
  babyProfile: BabyProfile;
  recentData: {
    feeding?: any[];
    sleep?: any[];
    health?: any[];
  };
}

export default function AIRecommendationComponent({
  visible,
  onClose,
  babyProfile,
  recentData,
}: AIRecommendationComponentProps) {
  const { colors } = useTheme();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (visible && babyProfile) {
      loadRecommendations();
    }
  }, [visible, babyProfile, recentData]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiRecommendations = AIRecommendationService.generateRecommendations(
        babyProfile,
        recentData
      );
      
      setRecommendations(aiRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations
    : recommendations.filter(r => r.category === selectedCategory);

  const categories = [
    { key: 'all', label: 'Tümü', count: recommendations.length },
    { key: 'feeding', label: 'Beslenme', count: recommendations.filter(r => r.category === 'feeding').length },
    { key: 'sleep', label: 'Uyku', count: recommendations.filter(r => r.category === 'sleep').length },
    { key: 'health', label: 'Sağlık', count: recommendations.filter(r => r.category === 'health').length },
    { key: 'development', label: 'Gelişim', count: recommendations.filter(r => r.category === 'development').length },
    { key: 'safety', label: 'Güvenlik', count: recommendations.filter(r => r.category === 'safety').length },
  ];

  const months = AIRecommendationService.getBabyAgeInMonths(babyProfile.birthDate);
  const ageCategory = AIRecommendationService.getAgeCategory(months);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="bulb-outline" size={20} color="#FFA500" />
              <ThemedText style={styles.title}>AI Önerileri</ThemedText>
            </View>
            <ThemedText style={styles.subtitle}>{ageCategory}</ThemedText>
          </View>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Banner */}
          <View style={[styles.infoBanner, { backgroundColor: colors.card }]}>
            <View style={styles.infoBannerContent}>
              <Ionicons name="information-circle-outline" size={20} color="#4A90E2" />
              <ThemedText style={styles.infoBannerText}>
                Bu öneriler bebeğinizin yaşına ve genel gelişim patternlerine dayanmaktadır. 
                Tıbbi tavsiye niteliği taşımaz, doktorunuza danışın.
              </ThemedText>
            </View>
          </View>

          {/* Category Filters */}
          <View style={[styles.categoryContainer, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.categoryTitle}>Kategoriler</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryButtons}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: selectedCategory === category.key ? colors.primary : 'transparent',
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setSelectedCategory(category.key)}
                  >
                    <ThemedText
                      style={[
                        styles.categoryButtonText,
                        {
                          color: selectedCategory === category.key ? 'white' : colors.text,
                        },
                      ]}
                    >
                      {category.label} ({category.count})
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Recommendations List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ThemedText style={styles.loadingText}>
                🤖 Bebeğiniz için kişiselleştirilmiş öneriler hazırlanıyor...
              </ThemedText>
            </View>
          ) : filteredRecommendations.length > 0 ? (
            <View style={styles.recommendationsContainer}>
              {filteredRecommendations.map((recommendation) => (
                <View
                  key={recommendation.id}
                  style={[
                    styles.recommendationCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View style={styles.recommendationHeader}>
                    <View style={styles.recommendationHeaderLeft}>
                      <Text style={styles.recommendationIcon}>
                        {AIRecommendationService.getCategoryIcon(recommendation.category)}
                      </Text>
                      <View style={styles.recommendationTitleContainer}>
                        <ThemedText style={styles.recommendationTitle}>
                          {recommendation.title}
                        </ThemedText>
                        <ThemedText style={styles.recommendationCategory}>
                          {AIRecommendationService.getCategoryLabel(recommendation.category)} • {recommendation.ageRange}
                        </ThemedText>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: AIRecommendationService.getPriorityColor(recommendation.priority) },
                      ]}
                    >
                      <ThemedText style={styles.priorityText}>
                        {recommendation.priority === 'high' ? 'Yüksek' :
                         recommendation.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.recommendationDescription}>
                    {recommendation.description}
                  </ThemedText>

                  {recommendation.actionItems.length > 0 && (
                    <View style={styles.actionItemsContainer}>
                      <ThemedText style={styles.actionItemsTitle}>Önerilen Eylemler:</ThemedText>
                      {recommendation.actionItems.map((item, index) => (
                        <View key={index} style={styles.actionItem}>
                          <Ionicons name="checkmark-circle" size={14} color="#4ECDC4" />
                          <ThemedText style={styles.actionItemText}>{item}</ThemedText>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
              <Text style={styles.emptyIcon}>🤔</Text>
              <ThemedText style={styles.emptyTitle}>Öneri Bulunamadı</ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                Bu kategori için şu anda öneri bulunmamaktadır.
              </ThemedText>
            </View>
          )}

          {/* Disclaimer */}
          <View style={[styles.disclaimerContainer, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.disclaimerTitle}>
              ⚠️ Önemli Bilgilendirme
            </ThemedText>
            <ThemedText style={styles.disclaimerText}>
              Bu öneriler genel gelişim bilgileri içerir ve tıbbi teşhis veya tedavi niteliği taşımaz. 
              Bebeğinizin sağlığı ile ilgili endişelerinizde mutlaka pediatricianınıza danışın. 
              Acil durumlarda 112 veya en yakın sağlık kuruluşuna başvurun.
            </ThemedText>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        <LoadingOverlay visible={loading} message="Öneriler hazırlanıyor..." />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 6,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoBanner: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoBannerText: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
    flex: 1,
    opacity: 0.8,
  },
  categoryContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  recommendationsContainer: {
    gap: 16,
  },
  recommendationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  recommendationTitleContainer: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationCategory: {
    fontSize: 12,
    opacity: 0.7,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  recommendationDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.9,
  },
  actionItemsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  actionItemText: {
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  disclaimerContainer: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.8,
  },
  bottomPadding: {
    height: 20,
  },
});