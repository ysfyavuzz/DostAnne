import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';

interface Period {
  id: string;
  startDate: string;
  endDate?: string;
  symptoms: string[];
  flow: 'light' | 'medium' | 'heavy';
}

const symptoms = ['Kramp', 'Şişkinlik', 'Baş Ağrısı', 'Yorgunluk', 'Hassasiyet', 'Aç Gözlülük'];

export default function MenstrualScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows, isDark } = useThemedStyles();
  const [periods, setPeriods] = useState<Period[]>([
    { id: '1', startDate: '2024-11-01', endDate: '2024-11-05', symptoms: ['Kramp', 'Yorgunluk'], flow: 'medium' },
    { id: '2', startDate: '2024-10-03', endDate: '2024-10-07', symptoms: ['Hassasiyet'], flow: 'light' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState<Partial<Period>>({
    startDate: '',
    symptoms: [],
    flow: 'medium',
  });

  const cycleStats = useMemo(() => {
    if (periods.length < 2) return null;
    const sorted = [...periods].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    const lastPeriod = sorted[0];
    const previousPeriod = sorted[1];
    
    const daysSinceStart = Math.floor((new Date().getTime() - new Date(lastPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const cycleLength = Math.floor((new Date(lastPeriod.startDate).getTime() - new Date(previousPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const nextPeriodDate = new Date(lastPeriod.startDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
    const daysUntilNext = Math.floor((nextPeriodDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return { daysSinceStart, cycleLength, nextPeriodDate, daysUntilNext };
  }, [periods]);

  const handleAddPeriod = () => {
    if (!newPeriod.startDate) {
      Alert.alert('Hata', 'Lütfen başlangıç tarihini girin');
      return;
    }

    const period: Period = {
      id: Date.now().toString(),
      startDate: newPeriod.startDate!,
      endDate: newPeriod.endDate,
      symptoms: newPeriod.symptoms || [],
      flow: newPeriod.flow || 'medium',
    };

    setPeriods([period, ...periods]);
    setNewPeriod({ startDate: '', symptoms: [], flow: 'medium' });
    setShowAddModal(false);
    Alert.alert('Başarılı', 'Dönem kaydedildi');
  };

  const toggleSymptom = (symptom: string) => {
    const symptoms = newPeriod.symptoms || [];
    if (symptoms.includes(symptom)) {
      setNewPeriod({ ...newPeriod, symptoms: symptoms.filter(s => s !== symptom) });
    } else {
      setNewPeriod({ ...newPeriod, symptoms: [...symptoms, symptom] });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <LinearGradient colors={['#EC4899', '#DB2777']} style={[styles.header, shadows.medium]}>
        <Ionicons name="calendar" size={48} color="white" />
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>Adet Takvimi</Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          Döngünüzü takip edin
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {cycleStats && (
          <View style={[styles.statsCard, { backgroundColor: 'white' }, shadows.medium]}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <LinearGradient colors={colors.gradients.pink} style={styles.statIcon}>
                  <Ionicons name="time" size={28} color="white" />
                </LinearGradient>
                <Text style={[styles.statValue, typography.h2, { color: colors.text }]}>
                  {cycleStats.daysSinceStart}
                </Text>
                <Text style={[styles.statLabel, typography.caption, { color: colors.textSecondary }]}>
                  Gün geçti
                </Text>
              </View>
              <View style={styles.statItem}>
                <LinearGradient colors={colors.gradients.purple} style={styles.statIcon}>
                  <Ionicons name="repeat" size={28} color="white" />
                </LinearGradient>
                <Text style={[styles.statValue, typography.h2, { color: colors.text }]}>
                  {cycleStats.cycleLength}
                </Text>
                <Text style={[styles.statLabel, typography.caption, { color: colors.textSecondary }]}>
                  Gün döngü
                </Text>
              </View>
              <View style={styles.statItem}>
                <LinearGradient colors={colors.gradients.blue} style={styles.statIcon}>
                  <Ionicons name="calendar-outline" size={28} color="white" />
                </LinearGradient>
                <Text style={[styles.statValue, typography.h2, { color: colors.text }]}>
                  {cycleStats.daysUntilNext}
                </Text>
                <Text style={[styles.statLabel, typography.caption, { color: colors.textSecondary }]}>
                  Gün kaldı
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.historyCard, { backgroundColor: 'white' }, shadows.small]}>
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, typography.h3, { color: colors.text }]}>Geçmiş</Text>
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <LinearGradient colors={colors.gradients.pink} style={styles.addButton}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={[styles.addButtonText, { color: 'white' }]}>Ekle</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {periods.map((period) => (
            <View key={period.id} style={styles.periodItem}>
              <View style={[styles.periodIndicator, { backgroundColor: period.flow === 'heavy' ? colors.error[500] : period.flow === 'medium' ? colors.warning[500] : colors.success[500] }]} />
              <View style={styles.periodInfo}>
                <Text style={[styles.periodDate, typography.bodyBold, { color: colors.text }]}>
                  {new Date(period.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {period.endDate && ` - ${new Date(period.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`}
                </Text>
                {period.symptoms.length > 0 && (
                  <View style={styles.symptoms}>
                    {period.symptoms.map((symptom, i) => (
                      <View key={i} style={[styles.symptomChip, { backgroundColor: colors.primary[100] }]}>
                        <Text style={[styles.symptomText, { color: colors.primary[700] }]}>{symptom}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <Text style={[styles.flowText, typography.caption, { color: colors.textSecondary }]}>
                  Akış: {period.flow === 'heavy' ? 'Yoğun' : period.flow === 'medium' ? 'Orta' : 'Hafif'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.tipsCard, { backgroundColor: colors.primary[50] }]}>
          <Ionicons name="information-circle" size={24} color={colors.primary[600]} />
          <View style={styles.tipsContent}>
            <Text style={[styles.tipsTitle, typography.h4, { color: colors.primary[700] }]}>İpucu</Text>
            <Text style={[styles.tipsText, typography.body, { color: colors.primary[600] }]}>
              Düzenli takip, döngünüzü daha iyi anlamanıza ve planlamanıza yardımcı olur.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: 'white' }, shadows.large]}>
            <Text style={[styles.modalTitle, typography.h2, { color: colors.text }]}>Dönem Ekle</Text>
            
            <TextInput
              style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
              placeholder="Başlangıç (YYYY-MM-DD)"
              placeholderTextColor={colors.textSecondary}
              value={newPeriod.startDate}
              onChangeText={(text) => setNewPeriod({ ...newPeriod, startDate: text })}
            />

            <TextInput
              style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
              placeholder="Bitiş (YYYY-MM-DD) - Opsiyonel"
              placeholderTextColor={colors.textSecondary}
              value={newPeriod.endDate}
              onChangeText={(text) => setNewPeriod({ ...newPeriod, endDate: text })}
            />

            <Text style={[styles.inputLabel, typography.bodyBold, { color: colors.text }]}>Akış:</Text>
            <View style={styles.flowButtons}>
              {['light', 'medium', 'heavy'].map((flow) => (
                <TouchableOpacity
                  key={flow}
                  style={[
                    styles.flowButton,
                    { borderColor: colors.neutral[300] },
                    newPeriod.flow === flow && { backgroundColor: colors.primary[100], borderColor: colors.primary[500] },
                  ]}
                  onPress={() => setNewPeriod({ ...newPeriod, flow: flow as Period['flow'] })}
                >
                  <Text style={[styles.flowButtonText, { color: newPeriod.flow === flow ? colors.primary[700] : colors.neutral[600] }]}>
                    {flow === 'light' ? 'Hafif' : flow === 'medium' ? 'Orta' : 'Yoğun'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, typography.bodyBold, { color: colors.text }]}>Belirtiler:</Text>
            <View style={styles.symptomButtons}>
              {symptoms.map((symptom) => (
                <TouchableOpacity
                  key={symptom}
                  style={[
                    styles.symptomButton,
                    { borderColor: colors.neutral[300] },
                    newPeriod.symptoms?.includes(symptom) && { backgroundColor: colors.primary[100], borderColor: colors.primary[500] },
                  ]}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text style={[styles.symptomButtonText, { color: newPeriod.symptoms?.includes(symptom) ? colors.primary[700] : colors.neutral[600] }]}>
                    {symptom}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.neutral[200] }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddPeriod}>
                <LinearGradient colors={colors.gradients.pink} style={styles.modalButton}>
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
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 16, alignItems: 'center' },
  headerTitle: { marginTop: 12, textAlign: 'center' },
  headerSubtitle: { marginTop: 8, textAlign: 'center', opacity: 0.9 },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  statsCard: { marginTop: 16, padding: 20, borderRadius: 16 },
  statsGrid: { flexDirection: 'row', gap: 16 },
  statItem: { flex: 1, alignItems: 'center', gap: 12 },
  statIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  statValue: {},
  statLabel: { textAlign: 'center' },
  historyCard: { marginTop: 16, padding: 20, borderRadius: 16 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  historyTitle: {},
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  addButtonText: { fontSize: 14, fontWeight: '600' },
  periodItem: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  periodIndicator: { width: 4, borderRadius: 2 },
  periodInfo: { flex: 1, gap: 8 },
  periodDate: {},
  symptoms: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  symptomChip: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  symptomText: { fontSize: 12, fontWeight: '600' },
  flowText: {},
  tipsCard: { flexDirection: 'row', gap: 16, marginTop: 16, marginBottom: 16, padding: 16, borderRadius: 12 },
  tipsContent: { flex: 1, gap: 8 },
  tipsTitle: {},
  tipsText: {},
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', maxWidth: 400, padding: 24, borderRadius: 24 },
  modalTitle: { textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 16 },
  inputLabel: { marginBottom: 8 },
  flowButtons: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  flowButton: { flex: 1, paddingVertical: 10, borderWidth: 1, borderRadius: 8, alignItems: 'center' },
  flowButtonText: { fontSize: 14, fontWeight: '600' },
  symptomButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  symptomButton: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 8 },
  symptomButtonText: { fontSize: 14, fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  modalButtonText: { fontSize: 16, fontWeight: '700' },
});
