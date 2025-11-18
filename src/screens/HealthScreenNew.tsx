import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '../hooks/useDatabase';

const { width } = Dimensions.get('window');

interface VaccineSchedule {
  id: string;
  name: string;
  month: number;
  completed: boolean;
  date?: string;
}

const HealthScreenNew = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useThemedStyles();
  const { addHealthRecord, addGrowthRecord } = useDatabase();
  
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  const healthRecords = useSelector((state: RootState) => state.database.healthRecords);
  const growthRecords = useSelector((state: RootState) => state.database.growthRecords);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'vaccine' | 'checkup' | 'growth'>('vaccine');
  const [formData, setFormData] = useState({
    title: '',
    weight: '',
    height: '',
    temperature: '',
    notes: '',
  });

  // Vaccine Schedule (Turkey standard)
  const vaccineSchedule: VaccineSchedule[] = useMemo(() => [
    { id: '1', name: 'Hepatit B (1. doz)', month: 0, completed: false },
    { id: '2', name: 'KPA, DaBT-İPA-Hib (1. doz)', month: 2, completed: false },
    { id: '3', name: 'KPA, DaBT-İPA-Hib (2. doz)', month: 4, completed: false },
    { id: '4', name: 'KPA, DaBT-İPA-Hib (3. doz)', month: 6, completed: false },
    { id: '5', name: 'KKK (1. doz)', month: 12, completed: false },
    { id: '6', name: 'Su Çiçeği', month: 12, completed: false },
    { id: '7', name: 'Hepatit A (1. doz)', month: 18, completed: false },
    { id: '8', name: 'DaBT-İPA-Hib Rapel', month: 18, completed: false },
  ], []);

  // Calculate health score
  const healthScore = useMemo(() => {
    if (!currentBaby) return 0;
    
    let score = 85; // Base score
    
    // Add points for recent checkups
    const recentCheckups = healthRecords.filter(r => 
      r.type === 'checkup' && 
      new Date(r.date).getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000 // Last 3 months
    );
    score += Math.min(recentCheckups.length * 5, 15);
    
    return Math.min(score, 100);
  }, [currentBaby, healthRecords]);

  // Latest growth data
  const latestGrowth = useMemo(() => {
    if (growthRecords.length === 0) return null;
    return growthRecords[growthRecords.length - 1];
  }, [growthRecords]);

  const handleOpenModal = useCallback((type: typeof modalType) => {
    setModalType(type);
    setFormData({
      title: '',
      weight: '',
      height: '',
      temperature: '',
      notes: '',
    });
    setModalVisible(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!currentBaby?.id) {
      Alert.alert('Hata', 'Bebek profili bulunamadı');
      return;
    }

    try {
      if (modalType === 'growth') {
        if (!formData.weight || !formData.height) {
          Alert.alert('Uyarı', 'Lütfen kilo ve boy bilgilerini girin');
          return;
        }

        await addGrowthRecord({
          babyId: currentBaby.id,
          date: new Date().toISOString(),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          notes: formData.notes || undefined,
        });
      } else {
        if (!formData.title) {
          Alert.alert('Uyarı', 'Lütfen başlık girin');
          return;
        }

        await addHealthRecord({
          babyId: currentBaby.id,
          type: modalType === 'vaccine' ? 'vaccine' : 'checkup',
          title: formData.title,
          date: new Date().toISOString(),
          notes: formData.notes || undefined,
        });
      }

      setModalVisible(false);
      Alert.alert('Başarılı', 'Kayıt eklendi!');
    } catch (error) {
      Alert.alert('Hata', 'Kayıt eklenirken bir hata oluştu');
      console.error(error);
    }
  }, [currentBaby, modalType, formData, addGrowthRecord, addHealthRecord]);

  const stylesObj = styles(colors, typography, spacing, borderRadius, shadows, isDark);

  return (
    <View style={stylesObj.container}>
      <ScrollView>
        {/* Health Score Card */}
        <View style={stylesObj.section}>
          <LinearGradient
            colors={colors.gradients.success}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={stylesObj.scoreCard}
          >
            <View style={stylesObj.scoreContent}>
              <Text style={stylesObj.scoreLabel}>Sağlık Skoru</Text>
              <Text style={stylesObj.scoreValue}>{healthScore}/100</Text>
              <Text style={stylesObj.scoreDescription}>Harika gidiyorsunuz! 🎉</Text>
            </View>
            <View style={stylesObj.scoreCircle}>
              <Ionicons name="heart" size={48} color="white" />
            </View>
          </LinearGradient>
        </View>

        {/* Growth Tracking */}
        <View style={stylesObj.section}>
          <View style={stylesObj.sectionHeader}>
            <Text style={stylesObj.sectionTitle}>Büyüme Takibi</Text>
            <TouchableOpacity onPress={() => handleOpenModal('growth')}>
              <Ionicons name="add-circle" size={24} color={colors.primary[500]} />
            </TouchableOpacity>
          </View>
          
          <View style={stylesObj.growthCard}>
            <View style={stylesObj.growthItem}>
              <View style={[stylesObj.growthIcon, { backgroundColor: colors.secondary[100] }]}>
                <Ionicons name="speedometer" size={28} color={colors.secondary[600]} />
              </View>
              <Text style={stylesObj.growthLabel}>Kilo</Text>
              <Text style={stylesObj.growthValue}>
                {latestGrowth?.weight || currentBaby?.weight || '-'} kg
              </Text>
            </View>

            <View style={stylesObj.growthDivider} />

            <View style={stylesObj.growthItem}>
              <View style={[stylesObj.growthIcon, { backgroundColor: colors.primary[100] }]}>
                <Ionicons name="resize" size={28} color={colors.primary[600]} />
              </View>
              <Text style={stylesObj.growthLabel}>Boy</Text>
              <Text style={stylesObj.growthValue}>
                {latestGrowth?.height || currentBaby?.height || '-'} cm
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={stylesObj.section}>
          <Text style={stylesObj.sectionTitle}>Hızlı İşlemler</Text>
          <View style={stylesObj.quickActionsGrid}>
            <TouchableOpacity
              style={stylesObj.quickActionCard}
              onPress={() => handleOpenModal('vaccine')}
            >
              <LinearGradient
                colors={[colors.primary[400], colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={stylesObj.quickActionGradient}
              >
                <Ionicons name="medical" size={32} color="white" />
                <Text style={stylesObj.quickActionLabel}>Aşı Ekle</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesObj.quickActionCard}
              onPress={() => handleOpenModal('checkup')}
            >
              <LinearGradient
                colors={[colors.success[400], colors.success[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={stylesObj.quickActionGradient}
              >
                <Ionicons name="calendar" size={32} color="white" />
                <Text style={stylesObj.quickActionLabel}>Kontrol</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vaccine Schedule */}
        <View style={stylesObj.section}>
          <Text style={stylesObj.sectionTitle}>Aşı Takvimi</Text>
          <View style={stylesObj.vaccineList}>
            {vaccineSchedule.map((vaccine, index) => (
              <View key={vaccine.id} style={stylesObj.vaccineItem}>
                <View style={stylesObj.vaccineMonth}>
                  <Text style={stylesObj.vaccineMonthText}>{vaccine.month}</Text>
                  <Text style={stylesObj.vaccineMonthLabel}>ay</Text>
                </View>
                <View style={stylesObj.vaccineContent}>
                  <Text style={stylesObj.vaccineName}>{vaccine.name}</Text>
                  {vaccine.completed && vaccine.date && (
                    <Text style={stylesObj.vaccineDate}>
                      Yapıldı: {new Date(vaccine.date).toLocaleDateString('tr-TR')}
                    </Text>
                  )}
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name={vaccine.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={vaccine.completed ? colors.success[500] : colors.neutral[300]}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Health Records */}
        <View style={stylesObj.section}>
          <Text style={stylesObj.sectionTitle}>Son Kayıtlar</Text>
          {healthRecords.length > 0 ? (
            <View style={stylesObj.recordsList}>
              {healthRecords.slice(-5).reverse().map((record) => (
                <View key={record.id} style={stylesObj.recordItem}>
                  <View style={[
                    stylesObj.recordIcon,
                    { backgroundColor: record.type === 'vaccine' ? colors.primary[100] : colors.success[100] }
                  ]}>
                    <Ionicons
                      name={record.type === 'vaccine' ? 'medical' : 'calendar'}
                      size={20}
                      color={record.type === 'vaccine' ? colors.primary[600] : colors.success[600]}
                    />
                  </View>
                  <View style={stylesObj.recordContent}>
                    <Text style={stylesObj.recordTitle}>{record.title}</Text>
                    <Text style={stylesObj.recordDate}>
                      {new Date(record.date).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={stylesObj.emptyState}>
              <Text style={stylesObj.emptyStateText}>Henüz kayıt yok</Text>
            </View>
          )}
        </View>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>

      {/* Add Record Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={stylesObj.modalOverlay}>
          <View style={stylesObj.modalContent}>
            <View style={stylesObj.modalHeader}>
              <Text style={stylesObj.modalTitle}>
                {modalType === 'vaccine' ? '💉 Aşı Ekle' :
                 modalType === 'checkup' ? '📋 Kontrol Ekle' : '📏 Ölçüm Ekle'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[600]} />
              </TouchableOpacity>
            </View>

            {modalType === 'growth' ? (
              <>
                <Text style={stylesObj.inputLabel}>Kilo (kg)</Text>
                <TextInput
                  style={stylesObj.textInput}
                  value={formData.weight}
                  onChangeText={(text) => setFormData({ ...formData, weight: text })}
                  placeholder="Örn: 5.2"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.neutral[400]}
                />

                <Text style={stylesObj.inputLabel}>Boy (cm)</Text>
                <TextInput
                  style={stylesObj.textInput}
                  value={formData.height}
                  onChangeText={(text) => setFormData({ ...formData, height: text })}
                  placeholder="Örn: 62"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.neutral[400]}
                />
              </>
            ) : (
              <>
                <Text style={stylesObj.inputLabel}>
                  {modalType === 'vaccine' ? 'Aşı Adı' : 'Kontrol Türü'}
                </Text>
                <TextInput
                  style={stylesObj.textInput}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder={modalType === 'vaccine' ? 'Örn: Hepatit B' : 'Örn: Genel muayene'}
                  placeholderTextColor={colors.neutral[400]}
                />
              </>
            )}

            <Text style={stylesObj.inputLabel}>Notlar (Opsiyonel)</Text>
            <TextInput
              style={[stylesObj.textInput, stylesObj.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Ek bilgiler..."
              placeholderTextColor={colors.neutral[400]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={stylesObj.saveButton}
              onPress={handleSave}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={stylesObj.saveButtonGradient}
              >
                <Text style={stylesObj.saveButtonText}>Kaydet</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (colors: any, typography: any, spacing: any, borderRadius: any, shadows: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? colors.background.dark : colors.background.light,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  scoreCard: {
    padding: spacing['2xl'],
    borderRadius: borderRadius['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.lg,
  },
  scoreContent: {
    flex: 1,
  },
  scoreLabel: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xs,
  },
  scoreValue: {
    ...typography.display,
    color: 'white',
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  scoreDescription: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthCard: {
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    ...shadows.md,
  },
  growthItem: {
    flex: 1,
    alignItems: 'center',
  },
  growthIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  growthLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  growthValue: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  growthDivider: {
    width: 1,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  quickActionGradient: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  quickActionLabel: {
    ...typography.labelLarge,
    color: 'white',
    marginTop: spacing.md,
    fontWeight: '600',
  },
  vaccineList: {
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderRadius: borderRadius.xl,
    ...shadows.sm,
    overflow: 'hidden',
  },
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  vaccineMonth: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  vaccineMonthText: {
    ...typography.h4,
    color: colors.primary[600],
    fontWeight: '700',
  },
  vaccineMonthLabel: {
    ...typography.caption,
    color: colors.primary[600],
  },
  vaccineContent: {
    flex: 1,
  },
  vaccineName: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  vaccineDate: {
    ...typography.caption,
    color: colors.success[600],
  },
  recordsList: {
    gap: spacing.md,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  recordContent: {
    flex: 1,
  },
  recordTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recordDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  emptyState: {
    padding: spacing['4xl'],
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    padding: spacing['2xl'],
    paddingBottom: spacing['4xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  inputLabel: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  textInput: {
    ...typography.body,
    backgroundColor: isDark ? colors.background.dark : colors.neutral[50],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  textArea: {
    minHeight: 100,
  },
  saveButton: {
    marginTop: spacing['2xl'],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  saveButtonGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...typography.button,
    color: 'white',
  },
});

export default React.memo(HealthScreenNew);
