/**
 * QuestionCard Component
 * Reusable card for displaying questions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { Question } from '../../types/QnA';
import { QUESTION_CATEGORIES } from '../../constants/QnA';

interface QuestionCardProps {
  question: Question;
  onPress: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onPress }) => {
  const { colors, typography, spacing, borderRadius, shadows } = useThemedStyles();
  
  const category = QUESTION_CATEGORIES.find(c => c.id === question.category);
  const timeAgo = formatTimeAgo(question.createdAt);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.background.card,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginBottom: spacing.md,
        },
        shadows.sm,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Soru: ${question.title}. ${question.author} tarafından ${timeAgo} soruldu. ${question.answerCount} cevap, ${question.views} görüntülenme${question.isResolved ? '. Çözüldü' : ''}`}
      accessibilityHint="Soru detaylarını görmek için dokunun"
    >
      {/* Header with author and time */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary[200] }]}>
          <Text style={styles.avatarText}>{question.author[0].toUpperCase()}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[typography.bodySmall, { color: colors.text.primary, fontWeight: '600' }]}>
            {question.author}
          </Text>
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            {timeAgo}
          </Text>
        </View>
        {question.isResolved && (
          <View style={[styles.resolvedBadge, { backgroundColor: colors.success[100] }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success[600]} />
          </View>
        )}
      </View>

      {/* Question Title */}
      <Text
        style={[
          styles.title,
          typography.bodyLarge,
          { color: colors.text.primary, fontWeight: '600', marginTop: spacing.md },
        ]}
        numberOfLines={2}
      >
        {question.title}
      </Text>

      {/* Question Description */}
      {question.description && (
        <Text
          style={[
            typography.body,
            { color: colors.text.secondary, marginTop: spacing.sm },
          ]}
          numberOfLines={2}
        >
          {question.description}
        </Text>
      )}

      {/* Footer with category and stats */}
      <View style={[styles.footer, { marginTop: spacing.md }]}>
        {category && (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: category.color + '20' },
            ]}
          >
            <Ionicons name={category.icon as any} size={14} color={category.color} />
            <Text style={[typography.caption, { color: category.color, fontWeight: '600' }]}>
              {category.title}
            </Text>
          </View>
        )}
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.text.secondary} />
            <Text style={[typography.caption, { color: colors.text.secondary }]}>
              {question.answerCount}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={16} color={colors.text.secondary} />
            <Text style={[typography.caption, { color: colors.text.secondary }]}>
              {question.views}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Az önce';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} dakika önce`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat önce`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} gün önce`;
  return date.toLocaleDateString('tr-TR');
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resolvedBadge: {
    padding: 4,
    borderRadius: 12,
  },
  title: {
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
