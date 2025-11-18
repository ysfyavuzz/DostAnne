/**
 * Q&A Screen (formerly MotherWorld)
 * Questions and Answers section for mothers
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { AppHeader } from '../components/ui/AppHeader';
import { QuestionCard } from '../components/ui/QuestionCard';
import { FilterTabs } from '../components/ui/FilterTabs';
import { Question, QuestionFilter, QuestionCategory } from '../types/QnA';
import { MOCK_QUESTIONS } from '../data/mockQuestions';
import { FILTER_OPTIONS, QUESTION_CATEGORIES } from '../constants/QnA';

export default function MotherWorldScreen() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [activeFilter, setActiveFilter] = useState<QuestionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: 'other' as QuestionCategory,
  });

  // Filter questions
  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query)
      );
    }

    // Apply filter
    switch (activeFilter) {
      case 'new':
        filtered = filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'mine':
        // Mock: Filter by current user (in real app, check author)
        filtered = filtered.filter((q) => q.author === 'Ayşe Yılmaz');
        break;
      default:
        break;
    }

    return filtered;
  }, [questions, searchQuery, activeFilter]);

  const handleQuestionPress = (question: Question) => {
    // TODO: Navigate to QuestionDetailScreen
    Alert.alert('Soru Detayı', `"${question.title}" detayına gidilecek.`);
  };

  const handleCreateQuestion = () => {
    if (!newQuestion.title.trim()) {
      Alert.alert('Hata', 'Lütfen soru başlığı girin.');
      return;
    }

    const question: Question = {
      id: String(Date.now()),
      title: newQuestion.title,
      description: newQuestion.description,
      author: 'Ben',
      category: newQuestion.category,
      createdAt: new Date().toISOString(),
      views: 0,
      answerCount: 0,
      likes: 0,
      isResolved: false,
    };

    setQuestions([question, ...questions]);
    setNewQuestion({ title: '', description: '', category: 'other' });
    setShowNewQuestionModal(false);
    Alert.alert('Başarılı', 'Sorunuz başarıyla eklendi!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.light }]} edges={['bottom']}>
      <AppHeader title="Soru & Cevap" />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.neutral[100],
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={[
              styles.searchInput,
              typography.body,
              { color: colors.text.primary, marginLeft: spacing.sm },
            ]}
            placeholder="Soru ara..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <FilterTabs
        tabs={FILTER_OPTIONS}
        activeTab={activeFilter}
        onTabPress={(id) => setActiveFilter(id as QuestionFilter)}
      />

      {/* Questions List */}
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestionCard question={item} onPress={() => handleQuestionPress(item)} />
        )}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing['6xl'],
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="help-circle-outline" size={64} color={colors.text.tertiary} />
            <Text style={[typography.h4, { color: colors.text.secondary, marginTop: spacing.md }]}>
              Henüz soru yok
            </Text>
            <Text style={[typography.body, { color: colors.text.tertiary, textAlign: 'center', marginTop: spacing.sm }]}>
              İlk soruyu sormak için aşağıdaki + butonuna tıklayın
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, shadows.xl]}
        onPress={() => setShowNewQuestionModal(true)}
        activeOpacity={0.8}
      >
        <LinearGradient colors={colors.gradients.green} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* New Question Modal */}
      <Modal
        visible={showNewQuestionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewQuestionModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowNewQuestionModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.background.card }, shadows.xl]}>
            <View style={styles.modalHeader}>
              <Text style={[typography.h3, { color: colors.text.primary }]}>Yeni Soru</Text>
              <TouchableOpacity onPress={() => setShowNewQuestionModal(false)}>
                <Ionicons name="close" size={28} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={[typography.label, { color: colors.text.primary, marginBottom: spacing.sm }]}>
                  Başlık *
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    typography.body,
                    {
                      backgroundColor: colors.neutral[100],
                      color: colors.text.primary,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    },
                  ]}
                  placeholder="Sorunuzu kısaca özetleyin"
                  placeholderTextColor={colors.text.tertiary}
                  value={newQuestion.title}
                  onChangeText={(text) => setNewQuestion({ ...newQuestion, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[typography.label, { color: colors.text.primary, marginBottom: spacing.sm }]}>
                  Açıklama
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    typography.body,
                    {
                      backgroundColor: colors.neutral[100],
                      color: colors.text.primary,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      minHeight: 100,
                    },
                  ]}
                  placeholder="Sorunuzu detaylı açıklayın (isteğe bağlı)"
                  placeholderTextColor={colors.text.tertiary}
                  value={newQuestion.description}
                  onChangeText={(text) => setNewQuestion({ ...newQuestion, description: text })}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[typography.label, { color: colors.text.primary, marginBottom: spacing.sm }]}>
                  Kategori
                </Text>
                <FlatList
                  data={QUESTION_CATEGORIES}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor:
                            newQuestion.category === item.id ? item.color : colors.neutral[100],
                          borderRadius: borderRadius.full,
                          paddingVertical: spacing.sm,
                          paddingHorizontal: spacing.lg,
                          marginRight: spacing.sm,
                        },
                      ]}
                      onPress={() => setNewQuestion({ ...newQuestion, category: item.id })}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={16}
                        color={newQuestion.category === item.id ? 'white' : item.color}
                      />
                      <Text
                        style={[
                          typography.caption,
                          {
                            color: newQuestion.category === item.id ? 'white' : colors.text.primary,
                            fontWeight: '600',
                            marginLeft: spacing.xs,
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  {
                    backgroundColor: colors.neutral[200],
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.md,
                  },
                ]}
                onPress={() => setShowNewQuestionModal(false)}
              >
                <Text style={[typography.button, { color: colors.text.primary }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  {
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.md,
                  },
                ]}
                onPress={handleCreateQuestion}
              >
                <LinearGradient colors={colors.gradients.green} style={styles.submitGradient}>
                  <Text style={[typography.button, { color: 'white' }]}>Gönder</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  searchInput: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
    overflow: 'hidden',
  },
  fabGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalBody: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {},
  textInput: {},
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {},
  submitButton: {
    overflow: 'hidden',
  },
  submitGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
