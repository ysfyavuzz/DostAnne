/**
 * QuestionDetailScreen
 * Screen to view question details and answers
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { AppHeader } from '../components/ui/AppHeader';
import { Question, Answer } from '../types/QnA';
import { QUESTION_CATEGORIES } from '../constants/QnA';

interface QuestionDetailScreenProps {
  question: Question;
  onBack?: () => void;
}

export default function QuestionDetailScreen({ question, onBack }: QuestionDetailScreenProps) {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  const [newAnswer, setNewAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>(question.answers || []);

  const category = QUESTION_CATEGORIES.find(c => c.id === question.category);

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) {
      Alert.alert('Hata', 'Lütfen yanıt metnini girin.');
      return;
    }

    const answer: Answer = {
      id: String(Date.now()),
      questionId: question.id,
      author: 'Ben',
      content: newAnswer,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setAnswers([...answers, answer]);
    setNewAnswer('');
    Alert.alert('Başarılı', 'Yanıtınız başarıyla eklendi!');
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.light }]} edges={['bottom']}>
      <AppHeader title="Soru Detayı" />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: spacing['6xl'],
          }}
        >
          {/* Question Card */}
          <View
            style={[
              styles.questionCard,
              {
                backgroundColor: colors.background.card,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
              },
              shadows.md,
            ]}
          >
            {/* Author Info */}
            <View style={styles.authorRow}>
              <View style={[styles.avatar, { backgroundColor: colors.primary[200] }]}>
                <Text style={styles.avatarText}>{question.author[0].toUpperCase()}</Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={[typography.bodySmall, { color: colors.text.primary, fontWeight: '600' }]}>
                  {question.author}
                </Text>
                <Text style={[typography.caption, { color: colors.text.secondary }]}>
                  {formatTimeAgo(question.createdAt)}
                </Text>
              </View>
            </View>

            {/* Question Title */}
            <Text
              style={[
                typography.h3,
                { color: colors.text.primary, marginTop: spacing.md },
              ]}
            >
              {question.title}
            </Text>

            {/* Question Description */}
            {question.description && (
              <Text
                style={[
                  typography.body,
                  { color: colors.text.secondary, marginTop: spacing.md, lineHeight: 24 },
                ]}
              >
                {question.description}
              </Text>
            )}

            {/* Category Badge */}
            {category && (
              <View style={[styles.categoryBadge, { marginTop: spacing.md }]}>
                <View
                  style={[
                    styles.categoryTag,
                    {
                      backgroundColor: category.color + '20',
                      paddingVertical: spacing.xs,
                      paddingHorizontal: spacing.md,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                >
                  <Ionicons name={category.icon as any} size={16} color={category.color} />
                  <Text
                    style={[
                      typography.caption,
                      { color: category.color, fontWeight: '600', marginLeft: spacing.xs },
                    ]}
                  >
                    {category.title}
                  </Text>
                </View>
              </View>
            )}

            {/* Stats */}
            <View style={[styles.statsRow, { marginTop: spacing.lg }]}>
              <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={18} color={colors.text.secondary} />
                <Text style={[typography.caption, { color: colors.text.secondary, marginLeft: spacing.xs }]}>
                  {question.views} görüntülenme
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="heart-outline" size={18} color={colors.text.secondary} />
                <Text style={[typography.caption, { color: colors.text.secondary, marginLeft: spacing.xs }]}>
                  {question.likes} beğeni
                </Text>
              </View>
            </View>
          </View>

          {/* Answers Section */}
          <View style={[styles.answersSection, { marginTop: spacing['2xl'] }]}>
            <Text style={[typography.h4, { color: colors.text.primary, marginBottom: spacing.lg }]}>
              Yanıtlar ({answers.length})
            </Text>

            {answers.length === 0 ? (
              <View style={styles.emptyAnswers}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.text.tertiary} />
                <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing.md, textAlign: 'center' }]}>
                  Henüz yanıt yok. İlk yanıtı siz verin!
                </Text>
              </View>
            ) : (
              answers.map((answer) => (
                <View
                  key={answer.id}
                  style={[
                    styles.answerCard,
                    {
                      backgroundColor: colors.neutral[50],
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      marginBottom: spacing.md,
                    },
                  ]}
                >
                  <View style={styles.answerHeader}>
                    <View style={[styles.answerAvatar, { backgroundColor: colors.secondary[200] }]}>
                      <Text style={styles.avatarText}>{answer.author[0].toUpperCase()}</Text>
                    </View>
                    <View style={styles.answerInfo}>
                      <Text style={[typography.caption, { color: colors.text.primary, fontWeight: '600' }]}>
                        {answer.author}
                      </Text>
                      <Text style={[typography.caption, { color: colors.text.secondary }]}>
                        {formatTimeAgo(answer.createdAt)}
                      </Text>
                    </View>
                    {answer.isAccepted && (
                      <View style={[styles.acceptedBadge, { backgroundColor: colors.success[100] }]}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.success[600]} />
                        <Text
                          style={[
                            typography.caption,
                            { color: colors.success[700], fontWeight: '600', marginLeft: spacing.xs },
                          ]}
                        >
                          Kabul Edildi
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      typography.body,
                      { color: colors.text.primary, marginTop: spacing.sm, lineHeight: 22 },
                    ]}
                  >
                    {answer.content}
                  </Text>
                  <View style={[styles.answerActions, { marginTop: spacing.sm }]}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="heart-outline" size={16} color={colors.text.secondary} />
                      <Text style={[typography.caption, { color: colors.text.secondary, marginLeft: spacing.xs }]}>
                        {answer.likes}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Answer Input */}
        <View
          style={[
            styles.answerInputContainer,
            {
              backgroundColor: colors.background.card,
              borderTopColor: colors.neutral[200],
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            },
            shadows.md,
          ]}
        >
          <TextInput
            style={[
              styles.answerInput,
              typography.body,
              {
                backgroundColor: colors.neutral[100],
                color: colors.text.primary,
                borderRadius: borderRadius.full,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
              },
            ]}
            placeholder="Yanıtınızı yazın..."
            placeholderTextColor={colors.text.tertiary}
            value={newAnswer}
            onChangeText={setNewAnswer}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: newAnswer.trim() ? colors.brand.green[500] : colors.neutral[300],
                borderRadius: borderRadius.full,
                padding: spacing.md,
                marginLeft: spacing.sm,
              },
            ]}
            onPress={handleSubmitAnswer}
            disabled={!newAnswer.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  questionCard: {},
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  authorInfo: {
    marginLeft: 12,
  },
  categoryBadge: {},
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answersSection: {},
  emptyAnswers: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  answerCard: {},
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerInfo: {
    marginLeft: 8,
    flex: 1,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  answerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  answerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  answerInput: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
