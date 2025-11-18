import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';

const topics = [
  { id: '1', title: 'Doğum Sonrası Bakım', icon: 'heart', color: '#EC4899', posts: 245 },
  { id: '2', title: 'Emzirme Deneyimleri', icon: 'water', color: '#10B981', posts: 189 },
  { id: '3', title: 'Uyku Eğitimi', icon: 'moon', color: '#8B5CF6', posts: 156 },
  { id: '4', title: 'İlk Yıl Zorlukları', icon: 'fitness', color: '#F59E0B', posts: 203 },
  { id: '5', title: 'Annelik Hikayeleri', icon: 'book', color: '#3B82F6', posts: 312 },
  { id: '6', title: 'Sağlıklı Yaşam', icon: 'nutrition', color: '#10B981', posts: 178 },
];

const recentPosts = [
  { id: '1', author: 'Ayşe', title: 'İlk emzirme deneyimim nasıl geçti?', topic: 'Emzirme', time: '2 saat önce', replies: 12 },
  { id: '2', author: 'Elif', title: 'Gece uykusu için ipuçları', topic: 'Uyku', time: '5 saat önce', replies: 8 },
  { id: '3', author: 'Zeynep', title: 'Doğum sonrası ilk hafta', topic: 'Bakım', time: '1 gün önce', replies: 24 },
];

const tips = [
  { id: '1', text: 'Kendinize zaman ayırın', icon: 'time' },
  { id: '2', text: 'Destek isteyin', icon: 'people' },
  { id: '3', text: 'Dinlenmeye önem verin', icon: 'bed' },
  { id: '4', text: 'Duygularınızı paylaşın', icon: 'chatbubbles' },
];

export default function MotherWorldScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <LinearGradient colors={['#EC4899', '#DB2777']} style={[styles.header, shadows.medium]}>
        <Ionicons name="heart" size={48} color="white" />
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>Anne Dünyası</Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          Anneler için özel alan
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.welcomeCard, { backgroundColor: colors.primary[50] }]}>
          <Ionicons name="sparkles" size={32} color={colors.primary[600]} />
          <View style={styles.welcomeContent}>
            <Text style={[styles.welcomeTitle, typography.h3, { color: colors.primary[700] }]}>
              Hoş Geldiniz
            </Text>
            <Text style={[styles.welcomeText, typography.body, { color: colors.primary[600] }]}>
              Deneyimlerinizi paylaşın, diğer annelerle bağlantı kurun ve birlikte büyüyün.
            </Text>
          </View>
        </View>

        <View style={[styles.topicsCard, { backgroundColor: 'white' }, shadows.small]}>
          <Text style={[styles.sectionTitle, typography.h3, { color: colors.text }]}>Popüler Konular</Text>
          {topics.map((topic) => (
            <TouchableOpacity key={topic.id} style={[styles.topicItem, { borderLeftColor: topic.color }]}>
              <View style={[styles.topicIcon, { backgroundColor: topic.color + '20' }]}>
                <Ionicons name={topic.icon as any} size={24} color={topic.color} />
              </View>
              <View style={styles.topicInfo}>
                <Text style={[styles.topicTitle, typography.bodyBold, { color: colors.text }]}>
                  {topic.title}
                </Text>
                <Text style={[styles.topicPosts, typography.caption, { color: colors.textSecondary }]}>
                  {topic.posts} gönderi
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.postsCard, { backgroundColor: 'white' }, shadows.small]}>
          <Text style={[styles.sectionTitle, typography.h3, { color: colors.text }]}>Son Paylaşımlar</Text>
          {recentPosts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.postItem}>
              <View style={styles.postHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.primary[200] }]}>
                  <Text style={styles.avatarText}>{post.author[0]}</Text>
                </View>
                <View style={styles.postMeta}>
                  <Text style={[styles.postAuthor, typography.bodyBold, { color: colors.text }]}>
                    {post.author}
                  </Text>
                  <Text style={[styles.postTime, typography.caption, { color: colors.textSecondary }]}>
                    {post.time}
                  </Text>
                </View>
              </View>
              <Text style={[styles.postTitle, typography.body, { color: colors.text }]}>{post.title}</Text>
              <View style={styles.postFooter}>
                <View style={[styles.topicBadge, { backgroundColor: colors.primary[100] }]}>
                  <Text style={[styles.topicBadgeText, { color: colors.primary[700] }]}>
                    {post.topic}
                  </Text>
                </View>
                <View style={styles.replies}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.repliesText, { color: colors.textSecondary }]}>
                    {post.replies} yanıt
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.tipsCard, { backgroundColor: colors.success[50] }]}>
          <Text style={[styles.tipsTitle, typography.h3, { color: colors.success[700] }]}>
            Annelik İpuçları
          </Text>
          <View style={styles.tipsGrid}>
            {tips.map((tip) => (
              <View key={tip.id} style={[styles.tipItem, { backgroundColor: 'white' }]}>
                <Ionicons name={tip.icon as any} size={24} color={colors.success[500]} />
                <Text style={[styles.tipText, typography.body, { color: colors.text }]}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.warning[50] }]}>
          <Ionicons name="shield-checkmark" size={24} color={colors.warning[600]} />
          <Text style={[styles.infoText, typography.caption, { color: colors.warning[700] }]}>
            Bu alan annelerin deneyimlerini paylaştığı bir topluluk alanıdır. Sağlık sorunları için mutlaka doktorunuza danışın.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.fab, shadows.large]}>
        <LinearGradient colors={colors.gradients.pink} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 16, alignItems: 'center' },
  headerTitle: { marginTop: 12, textAlign: 'center' },
  headerSubtitle: { marginTop: 8, textAlign: 'center', opacity: 0.9 },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  welcomeCard: { flexDirection: 'row', gap: 16, marginTop: 16, padding: 16, borderRadius: 12 },
  welcomeContent: { flex: 1, gap: 8 },
  welcomeTitle: {},
  welcomeText: {},
  topicsCard: { marginTop: 16, padding: 20, borderRadius: 16 },
  sectionTitle: { marginBottom: 16 },
  topicItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderLeftWidth: 4, borderRadius: 12, backgroundColor: '#F8F9FA', marginBottom: 12 },
  topicIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  topicInfo: { flex: 1, gap: 4 },
  topicTitle: {},
  topicPosts: {},
  postsCard: { marginTop: 16, padding: 20, borderRadius: 16 },
  postItem: { padding: 16, borderRadius: 12, backgroundColor: '#F8F9FA', marginBottom: 12, gap: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontSize: 16, fontWeight: '700' },
  postMeta: { flex: 1 },
  postAuthor: {},
  postTime: {},
  postTitle: { lineHeight: 22 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topicBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  topicBadgeText: { fontSize: 12, fontWeight: '600' },
  replies: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  repliesText: { fontSize: 14 },
  tipsCard: { marginTop: 16, padding: 16, borderRadius: 16 },
  tipsTitle: { marginBottom: 16 },
  tipsGrid: { gap: 12 },
  tipItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12 },
  tipText: {},
  infoCard: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 80, padding: 16, borderRadius: 12, alignItems: 'flex-start' },
  infoText: { flex: 1 },
  fab: { position: 'absolute', bottom: 20, right: 20, borderRadius: 28, overflow: 'hidden' },
  fabGradient: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
});
