import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const zodiacSigns = [
  { sign: 'Koç', dates: '21 Mar - 19 Nis', icon: '♈', color: '#EF4444', element: 'Ateş' },
  { sign: 'Boğa', dates: '20 Nis - 20 May', icon: '♉', color: '#10B981', element: 'Toprak' },
  { sign: 'İkizler', dates: '21 May - 20 Haz', icon: '♊', color: '#F59E0B', element: 'Hava' },
  { sign: 'Yengeç', dates: '21 Haz - 22 Tem', icon: '♋', color: '#3B82F6', element: 'Su' },
  { sign: 'Aslan', dates: '23 Tem - 22 Ağu', icon: '♌', color: '#F59E0B', element: 'Ateş' },
  { sign: 'Başak', dates: '23 Ağu - 22 Eyl', icon: '♍', color: '#10B981', element: 'Toprak' },
  { sign: 'Terazi', dates: '23 Eyl - 22 Eki', icon: '♎', color: '#EC4899', element: 'Hava' },
  { sign: 'Akrep', dates: '23 Eki - 21 Kas', icon: '♏', color: '#EF4444', element: 'Su' },
  { sign: 'Yay', dates: '22 Kas - 21 Ara', icon: '♐', color: '#8B5CF6', element: 'Ateş' },
  { sign: 'Oğlak', dates: '22 Ara - 19 Oca', icon: '♑', color: '#6B7280', element: 'Toprak' },
  { sign: 'Kova', dates: '20 Oca - 18 Şub', icon: '♒', color: '#3B82F6', element: 'Hava' },
  { sign: 'Balık', dates: '19 Şub - 20 Mar', icon: '♓', color: '#8B5CF6', element: 'Su' },
];

const horoscopeTraits: Record<string, { characteristics: string[]; parenting: string[] }> = {
  'Koç': {
    characteristics: ['Enerjik', 'Cesur', 'Hızlı öğrenir'],
    parenting: ['Aktif oyunlar sunun', 'Bağımsızlığını destekleyin', 'Sabırlı olun'],
  },
  'Boğa': {
    characteristics: ['Sakin', 'Kararlı', 'Sevgi dolu'],
    parenting: ['Rutin oluşturun', 'Fiziksel temas önemli', 'Yavaş geçişler yapın'],
  },
  'İkizler': {
    characteristics: ['Meraklı', 'İletişim yeteneği güçlü', 'Hareketli'],
    parenting: ['Çeşitli aktiviteler sunun', 'Konuşarak iletişim kurun', 'Stimülasyon sağlayın'],
  },
  'Yengeç': {
    characteristics: ['Duygusal', 'Korumacı', 'Sevecen'],
    parenting: ['Güvenli ortam yaratın', 'Duyguları anlayın', 'Sarılıp sevgi gösterin'],
  },
  'Aslan': {
    characteristics: ['Özgüvenli', 'Neşeli', 'Lider ruhlu'],
    parenting: ['İlgi gösterin', 'Başarılarını kutlayın', 'Yaratıcılığını destekleyin'],
  },
  'Başak': {
    characteristics: ['Düzenli', 'Detaycı', 'Pratik'],
    parenting: ['Düzen ve temizliğe dikkat', 'Net kurallar koyun', 'Organize olun'],
  },
  'Terazi': {
    characteristics: ['Dengeli', 'Sosyal', 'Uyumlu'],
    parenting: ['Adil olun', 'Sosyalleşmeyi destekleyin', 'Güzel ortam yaratın'],
  },
  'Akrep': {
    characteristics: ['Yoğun', 'Kararlı', 'Duygusal derinlik'],
    parenting: ['Duyguları ciddiye alın', 'Güven oluşturun', 'Mahremiyet verin'],
  },
  'Yay': {
    characteristics: ['İyimser', 'Maceracı', 'Özgür ruhlu'],
    parenting: ['Keşfetmeye izin verin', 'Dış mekân aktiviteleri', 'Esneklik gösterin'],
  },
  'Oğlak': {
    characteristics: ['Sorumlu', 'Disiplinli', 'Kararlı'],
    parenting: ['Yapı ve düzen önemli', 'Hedefler koyun', 'Başarıyı takdir edin'],
  },
  'Kova': {
    characteristics: ['Bağımsız', 'Yaratıcı', 'Farklı'],
    parenting: ['Özgünlüğü kabul edin', 'Yenilikçi düşünmeyi destekleyin', 'Sosyal sorumluluk öğretin'],
  },
  'Balık': {
    characteristics: ['Hayal gücü kuvvetli', 'Empatik', 'Sanatsal'],
    parenting: ['Yaratıcılığı besleyin', 'Duygusal destek verin', 'Hayallerini dinleyin'],
  },
};

export default function AstronomyScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows, isDark } = useThemedStyles();
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const babyZodiacSign = useMemo(() => {
    if (!currentBaby?.birthDate) return null;
    
    const birthDate = new Date(currentBaby.birthDate);
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Koç';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Boğa';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'İkizler';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Yengeç';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Aslan';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Başak';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Terazi';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Akrep';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Yay';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Oğlak';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Kova';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Balık';
    
    return null;
  }, [currentBaby]);

  const signToDisplay = selectedSign || babyZodiacSign;
  const signInfo = signToDisplay ? zodiacSigns.find(z => z.sign === signToDisplay) : null;
  const traits = signToDisplay ? horoscopeTraits[signToDisplay] : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background.dark : colors.background.light }]} edges={['bottom']}>
      <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={[styles.header, shadows.medium]}>
        <Ionicons name="sparkles" size={48} color="white" />
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>Burçlar</Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          Bebeğinizin burç özellikleri
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentBaby && babyZodiacSign && (
          <View style={[styles.babySignCard, { backgroundColor: 'white' }, shadows.medium]}>
            <Text style={[styles.babySignTitle, typography.h3, { color: colors.text }]}>
              {currentBaby.name}'in Burcu
            </Text>
            <View style={[styles.babySignContent, { backgroundColor: signInfo?.color + '10' }]}>
              <Text style={[styles.signIcon, { color: signInfo?.color }]}>{signInfo?.icon}</Text>
              <Text style={[styles.signName, typography.h2, { color: signInfo?.color }]}>
                {babyZodiacSign}
              </Text>
              <Text style={[styles.signDates, typography.body, { color: colors.textSecondary }]}>
                {signInfo?.dates}
              </Text>
              <View style={[styles.elementBadge, { backgroundColor: signInfo?.color + '20' }]}>
                <Text style={[styles.elementText, { color: signInfo?.color }]}>
                  {signInfo?.element} Elementi
                </Text>
              </View>
            </View>
          </View>
        )}

        {signToDisplay && traits && (
          <>
            <View style={[styles.traitsCard, { backgroundColor: 'white' }, shadows.small]}>
              <Text style={[styles.traitsTitle, typography.h3, { color: colors.text }]}>
                Kişilik Özellikleri
              </Text>
              {traits.characteristics.map((trait, index) => (
                <View key={index} style={styles.traitItem}>
                  <Ionicons name="star" size={20} color={signInfo?.color} />
                  <Text style={[styles.traitText, typography.body, { color: colors.text }]}>
                    {trait}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.parentingCard, { backgroundColor: 'white' }, shadows.small]}>
              <Text style={[styles.parentingTitle, typography.h3, { color: colors.text }]}>
                Ebeveynlik İpuçları
              </Text>
              {traits.parenting.map((tip, index) => (
                <View key={index} style={styles.parentingItem}>
                  <View style={[styles.parentingNumber, { backgroundColor: signInfo?.color }]}>
                    <Text style={styles.parentingNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.parentingText, typography.body, { color: colors.text }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={[styles.allSignsCard, { backgroundColor: 'white' }, shadows.small]}>
          <Text style={[styles.allSignsTitle, typography.h3, { color: colors.text }]}>
            Tüm Burçlar
          </Text>
          <View style={styles.signsGrid}>
            {zodiacSigns.map((zodiac) => (
              <TouchableOpacity
                key={zodiac.sign}
                style={[
                  styles.signCard,
                  { borderColor: zodiac.color },
                  selectedSign === zodiac.sign && { backgroundColor: zodiac.color + '10' },
                ]}
                onPress={() => setSelectedSign(zodiac.sign)}
              >
                <Text style={[styles.signCardIcon, { color: zodiac.color }]}>{zodiac.icon}</Text>
                <Text style={[styles.signCardName, typography.bodyBold, { color: colors.text }]}>
                  {zodiac.sign}
                </Text>
                <Text style={[styles.signCardDates, typography.caption, { color: colors.textSecondary }]}>
                  {zodiac.dates}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.warning[50] }]}>
          <Ionicons name="information-circle" size={24} color={colors.warning[600]} />
          <Text style={[styles.infoText, typography.caption, { color: colors.warning[700] }]}>
            Burç bilgileri eğlence amaçlıdır. Her bebek benzersizdir ve kendi kişiliğini geliştirir.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 16, alignItems: 'center' },
  headerTitle: { marginTop: 12, textAlign: 'center' },
  headerSubtitle: { marginTop: 8, textAlign: 'center', opacity: 0.9 },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  babySignCard: { marginTop: 16, padding: 20, borderRadius: 16 },
  babySignTitle: { marginBottom: 16 },
  babySignContent: { padding: 24, borderRadius: 12, alignItems: 'center', gap: 12 },
  signIcon: { fontSize: 64 },
  signName: { fontWeight: '700' },
  signDates: {},
  elementBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginTop: 8 },
  elementText: { fontSize: 14, fontWeight: '600' },
  traitsCard: { marginTop: 16, padding: 20, borderRadius: 16 },
  traitsTitle: { marginBottom: 16 },
  traitItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  traitText: {},
  parentingCard: { marginTop: 16, padding: 20, borderRadius: 16 },
  parentingTitle: { marginBottom: 16 },
  parentingItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  parentingNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  parentingNumberText: { color: 'white', fontSize: 14, fontWeight: '700' },
  parentingText: { flex: 1 },
  allSignsCard: { marginTop: 16, padding: 20, borderRadius: 16 },
  allSignsTitle: { marginBottom: 16 },
  signsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  signCard: { flex: 1, minWidth: '30%', padding: 16, borderWidth: 2, borderRadius: 12, alignItems: 'center', gap: 8 },
  signCardIcon: { fontSize: 32 },
  signCardName: {},
  signCardDates: { textAlign: 'center' },
  infoCard: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 16, padding: 16, borderRadius: 12, alignItems: 'flex-start' },
  infoText: { flex: 1 },
});
