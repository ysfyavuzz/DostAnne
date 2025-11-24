import React, { useState, useMemo } from 'react';
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

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const categories = [
  { id: 'all', label: 'Tümü', icon: 'grid' as const },
  { id: 'health', label: 'Sağlık', icon: 'medical' as const },
  { id: 'nutrition', label: 'Beslenme', icon: 'restaurant' as const },
  { id: 'sleep', label: 'Uyku', icon: 'moon' as const },
  { id: 'development', label: 'Gelişim', icon: 'trending-up' as const },
];

const articles: Article[] = [
  {
    id: '1',
    title: 'Yenidoğan Bebeğinizin İlk Haftası',
    category: 'health',
    excerpt: 'İlk hafta bebeğiniz için uyum dönemidir. Bu süreçte dikkat edilmesi gerekenler...',
    readTime: '5 dk',
    icon: 'heart',
    color: '#EF4444',
  },
  {
    id: '2',
    title: 'Anne Sütü ve Beslenme İpuçları',
    category: 'nutrition',
    excerpt: 'Anne sütünün önemi ve başarılı emzirme için bilinmesi gerekenler...',
    readTime: '8 dk',
    icon: 'restaurant',
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Uyku Düzeni Oluşturma',
    category: 'sleep',
    excerpt: 'Bebeğiniz için sağlıklı uyku rutini nasıl oluşturulur?',
    readTime: '6 dk',
    icon: 'moon',
    color: '#8B5CF6',
  },
  {
    id: '4',
    title: '0-12 Ay Gelişim Dönemleri',
    category: 'development',
    excerpt: 'Bebeğinizin ilk yılında hangi gelişim aşamalarını geçecek?',
    readTime: '10 dk',
    icon: 'trending-up',
    color: '#F59E0B',
  },
  {
    id: '5',
    title: 'Aşı Takvimi ve Önemi',
    category: 'health',
    excerpt: 'Bebeğinizin sağlığı için aşıların önemi ve Türkiye aşı takvimi...',
    readTime: '7 dk',
    icon: 'fitness',
    color: '#3B82F6',
  },
  {
    id: '6',
    title: 'Ek Gıdaya Geçiş Rehberi',
    category: 'nutrition',
    excerpt: '6. aydan sonra ek gıdalara nasıl başlanır? İlk yiyecekler neler olmalı?',
    readTime: '9 dk',
    icon: 'nutrition',
    color: '#EC4899',
  },
];

const tips: Tip[] = [
  {
    id: '1',
    title: 'Düzenli Muayene',
    description: 'İlk 1 yıl düzenli doktor kontrollerini aksatmayın',
    icon: 'medical',
    color: '#EF4444',
  },
  {
    id: '2',
    title: 'Hijyen',
    description: 'El yıkama bebeğinizin sağlığı için kritik öneme sahip',
    icon: 'water',
    color: '#3B82F6',
  },
  {
    id: '3',
    title: 'Ten Teması',
    description: 'Bebeğinizle ten temas kurmak bağlanmayı güçlendirir',
    icon: 'heart',
    color: '#EC4899',
  },
  {
    id: '4',
    title: 'Konuşun',
    description: 'Bebeğinizle sürekli konuşmak dil gelişimini destekler',
    icon: 'chatbubbles',
    color: '#10B981',
  },
];

export default function ExploreScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredArticles = useMemo(() => {
    return selectedCategory === 'all'
      ? articles
      : articles.filter(a => a.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradients.purple}
        style={[styles.header, shadows.medium]}
      >
        <Ionicons name="compass" size={48} color="white" />
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>
          Keşfet
        </Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          Makaleler, ipuçları ve rehberler
        </Text>
      </LinearGradient>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && [
                styles.categoryChipActive,
                { backgroundColor: colors.primary[500] },
              ],
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon}
              size={20}
              color={selectedCategory === cat.id ? 'white' : colors.neutral[600]}
            />
            <Text
              style={[
                styles.categoryChipText,
                {
                  color: selectedCategory === cat.id ? 'white' : colors.neutral[600],
                },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Daily Tips */}
        <View style={[styles.tipsCard, { backgroundColor: colors.primary[50] }]}>
          <Text style={[styles.tipsTitle, typography.h3, { color: colors.primary[700] }]}>
            Günün İpuçları
          </Text>
          <View style={styles.tipsGrid}>
            {tips.map((tip) => (
              <View key={tip.id} style={[styles.tipItem, { backgroundColor: 'white' }, shadows.small]}>
                <View style={[styles.tipIcon, { backgroundColor: tip.color + '20' }]}>
                  <Ionicons name={tip.icon} size={24} color={tip.color} />
                </View>
                <Text style={[styles.tipTitle, typography.bodyBold, { color: colors.text }]}>
                  {tip.title}
                </Text>
                <Text style={[styles.tipDescription, typography.caption, { color: colors.textSecondary }]}>
                  {tip.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Articles */}
        <View style={styles.articlesSection}>
          <Text style={[styles.articlesTitle, typography.h3, { color: colors.text }]}>
            {selectedCategory === 'all' ? 'Tüm Makaleler' : categories.find(c => c.id === selectedCategory)?.label}
          </Text>

          {filteredArticles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={colors.neutral[300]} />
              <Text style={[styles.emptyText, typography.body, { color: colors.textSecondary }]}>
                Bu kategoride makale bulunamadı
              </Text>
            </View>
          ) : (
            filteredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={[styles.articleCard, { backgroundColor: 'white' }, shadows.small]}
              >
                <View style={[styles.articleIcon, { backgroundColor: article.color + '20' }]}>
                  <Ionicons name={article.icon} size={32} color={article.color} />
                </View>
                <View style={styles.articleContent}>
                  <View style={styles.articleHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: article.color + '20' }]}>
                      <Text style={[styles.categoryBadgeText, { color: article.color }]}>
                        {categories.find(c => c.id === article.category)?.label}
                      </Text>
                    </View>
                    <View style={styles.readTime}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text style={[styles.readTimeText, typography.caption, { color: colors.textSecondary }]}>
                        {article.readTime}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.articleTitle, typography.h4, { color: colors.text }]}>
                    {article.title}
                  </Text>
                  <Text style={[styles.articleExcerpt, typography.body, { color: colors.textSecondary }]}>
                    {article.excerpt}
                  </Text>
                  <TouchableOpacity style={styles.readMoreButton}>
                    <Text style={[styles.readMoreText, typography.bodyBold, { color: article.color }]}>
                      Devamını Oku
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={article.color} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.warning[50] }]}>
          <Ionicons name="information-circle" size={32} color={colors.warning[600]} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, typography.h4, { color: colors.warning[700] }]}>
              Önemli Not
            </Text>
            <Text style={[styles.infoText, typography.body, { color: colors.warning[600] }]}>
              Bu makaleler genel bilgi amaçlıdır. Sağlık sorunları için mutlaka doktorunuza danışın.
            </Text>
          </View>
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
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  categoriesScroll: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryChipActive: {},
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tipsCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  tipsTitle: {
    marginBottom: 16,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tipItem: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  tipIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: {
    textAlign: 'center',
  },
  tipDescription: {
    textAlign: 'center',
  },
  articlesSection: {
    marginTop: 16,
  },
  articlesTitle: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
  articleCard: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  articleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleContent: {
    flex: 1,
    gap: 8,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {},
  articleTitle: {},
  articleExcerpt: {
    lineHeight: 20,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  readMoreText: {},
  infoCard: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    gap: 8,
  },
  infoTitle: {},
  infoText: {},
});
