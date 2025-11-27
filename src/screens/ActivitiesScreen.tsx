import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { GlassView } from '../components/ui/GlassView';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { addActivity } from '../store/activitiesSlice';
import { useDatabase } from '../hooks/useDatabase';

const ActivitiesScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { addActivity: addActivityToDb } = useDatabase();
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useThemedStyles();
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);

  const handleQuickAdd = async (type: 'diaper' | 'feeding' | 'sleep') => {
    if (!currentBaby) {
      Alert.alert('Hata', 'Lütfen önce bir bebek seçin.');
      return;
    }

    try {
      const newActivity = {
        babyId: currentBaby.id!,
        type,
        startTime: new Date().toISOString(),
        notes: 'Hızlı ekleme',
        actor: 'parent' as const,
        createdAt: new Date().toISOString(),
      };

      // Cast to any to bypass strict Redux action type checks for the thunk result
      const resultAction = await addActivityToDb(newActivity) as any;

      if (resultAction && resultAction.payload) {
        const id = resultAction.payload.id;
        // Update local store immediately for UI responsiveness
        dispatch(addActivity({ ...newActivity, id: String(id), babyId: String(newActivity.babyId) }));
        Alert.alert('Başarılı', 'Aktivite kaydedildi!');
      }
    } catch (error) {
      Alert.alert('Hata', 'Aktivite kaydedilirken bir sorun oluştu.');
    }
  };

  const styles = createStyles(colors, typography, spacing, borderRadius, shadows, isDark);

  const renderQuickAddButton = (
    type: 'diaper' | 'feeding' | 'sleep',
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    gradient: string[]
  ) => (
    <TouchableOpacity
      style={styles.quickAddButton}
      onPress={() => handleQuickAdd(type)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradient as any}
        style={styles.quickAddGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={32} color="white" />
        <Text style={styles.quickAddLabel}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.soft, colors.background.light]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Aktiviteler</Text>
          <Text style={styles.headerSubtitle}>Bebeğinizin gününü takip edin</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Hızlı Ekle</Text>
          <View style={styles.quickAddContainer}>
            {renderQuickAddButton('feeding', 'restaurant', 'Emzirme', colors.gradients.feeding)}
            {renderQuickAddButton('sleep', 'moon', 'Uyku', colors.gradients.sleep)}
            {renderQuickAddButton('diaper', 'water', 'Bez', colors.gradients.diaper)}
          </View>

          <Text style={styles.sectionTitle}>Detaylı Ekleme</Text>
          <View style={styles.detailedList}>
            <TouchableOpacity
              style={styles.detailedItem}
              onPress={() => router.push('/(tabs)/feeding')}
            >
              <GlassView style={styles.detailedGlass} intensity={20}>
                <View style={[styles.iconBox, { backgroundColor: colors.activity.feeding + '20' }]}>
                  <Ionicons name="restaurant" size={24} color={colors.activity.feeding} />
                </View>
                <View style={styles.detailedContent}>
                  <Text style={styles.detailedTitle}>Beslenme Detayları</Text>
                  <Text style={styles.detailedDesc}>Emzirme, mama, ek gıda...</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.neutral[400]} />
              </GlassView>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailedItem}
              onPress={() => router.push('/(tabs)/sleep')}
            >
              <GlassView style={styles.detailedGlass} intensity={20}>
                <View style={[styles.iconBox, { backgroundColor: colors.activity.sleep + '20' }]}>
                  <Ionicons name="moon" size={24} color={colors.activity.sleep} />
                </View>
                <View style={styles.detailedContent}>
                  <Text style={styles.detailedTitle}>Uyku Takibi</Text>
                  <Text style={styles.detailedDesc}>Uyku süresi ve kalitesi</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.neutral[400]} />
              </GlassView>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailedItem}
              onPress={() => router.push('/(tabs)/health')}
            >
              <GlassView style={styles.detailedGlass} intensity={20}>
                <View style={[styles.iconBox, { backgroundColor: colors.activity.health + '20' }]}>
                  <Ionicons name="medical" size={24} color={colors.activity.health} />
                </View>
                <View style={styles.detailedContent}>
                  <Text style={styles.detailedTitle}>Sağlık Kayıtları</Text>
                  <Text style={styles.detailedDesc}>Aşı, ilaç, doktor kontrolü</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.neutral[400]} />
              </GlassView>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (colors: any, typography: any, spacing: any, borderRadius: any, shadows: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  quickAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickAddButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  quickAddGradient: {
    flex: 1,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  quickAddLabel: {
    ...typography.label,
    color: 'white',
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  detailedList: {
    gap: spacing.md,
  },
  detailedItem: {
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  detailedGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  detailedContent: {
    flex: 1,
  },
  detailedTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: 2,
  },
  detailedDesc: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default ActivitiesScreen;
