import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface FirstAidTopic {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  steps: string[];
  warnings?: string[];
}

const emergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Acil Yardım',
    number: '112',
    icon: 'medical',
    color: '#EF4444',
  },
  {
    id: '2',
    name: 'İtfaiye',
    number: '110',
    icon: 'flame',
    color: '#F59E0B',
  },
  {
    id: '3',
    name: 'Polis',
    number: '155',
    icon: 'shield',
    color: '#3B82F6',
  },
  {
    id: '4',
    name: 'Zehir Danışma',
    number: '114',
    icon: 'warning',
    color: '#8B5CF6',
  },
];

const firstAidTopics: FirstAidTopic[] = [
  {
    id: '1',
    title: 'Boğulma',
    icon: 'alert-circle',
    color: '#EF4444',
    steps: [
      'Bebeği yüzüstü elinize yerleştirin, başını gövdesinden aşağıda tutun',
      'Avuç içinizle sırt kürek kemikleri arasına 5 kez sert vurun',
      'Eğer nesne çıkmazsa bebeği sırtüstü çevirin',
      'İki parmağınızla göğüs kemiğinin ortasına 5 kez basın',
      'Nesne çıkana veya yardım gelene kadar devam edin',
      'Acil yardım çağırın (112)',
    ],
    warnings: [
      'Parmağınızı bebeğin boğazına sokmayın',
      'Baş aşağı tutup sallamayın',
    ],
  },
  {
    id: '2',
    title: 'Yanık',
    icon: 'flame',
    color: '#F59E0B',
    steps: [
      'Yanık bölgeyi hemen akan soğuk su altında tutun (10-20 dakika)',
      'Giysileri çıkarın (yapışmışsa çıkarmayın)',
      'Yanık bölgeyi temiz bir bezle örtün',
      'Ağrı için doktor önerisi ile ağrı kesici verin',
      'Ciddi yanıklarda mutlaka doktora götürün',
    ],
    warnings: [
      'Buz uygulamayın',
      'Diş macunu, yoğurt gibi şeyler sürmeyin',
      'Kabarcıkları patlatmayın',
    ],
  },
  {
    id: '3',
    title: 'Düşme ve Kafa Travması',
    icon: 'body',
    color: '#8B5CF6',
    steps: [
      'Bebeği hareket ettirmeden sakin kalın',
      'Kanama varsa temiz bir bezle hafif baskı uygulayın',
      'Şuur kaybı varsa hemen 112 arayın',
      'Kusma, uykuya eğilim, görme problemleri varsa acil servise gidin',
      'İlk 24 saat bebeği yakından izleyin',
    ],
    warnings: [
      'Boyun veya sırt yaralanması şüphesinde hareket ettirmeyin',
      'Kafa içi kanama belirtilerine dikkat edin',
    ],
  },
  {
    id: '4',
    title: 'Zehirlenme',
    icon: 'warning',
    color: '#DC2626',
    steps: [
      'Hemen Zehir Danışma Merkezi\'ni arayın (114)',
      'Maddenin ne olduğunu tespit edin',
      'Bebeğin ağzındaki kalıntıları temizleyin',
      'Doktorun önerisini bekleyin, kendiniz müdahale etmeyin',
      'Kustu ise başını yana çevirin',
    ],
    warnings: [
      'Kendiniz kusturmaya çalışmayın',
      'Süt ya da başka bir şey içirmeyin',
      'İnternet tavsiyelerine uymayın',
    ],
  },
  {
    id: '5',
    title: 'Ateş Krizi (Febril Konvülziyon)',
    icon: 'thermometer',
    color: '#F97316',
    steps: [
      'Sakin kalın ve zamanı not edin',
      'Bebeği sert bir yüzeye sırtüstü yatırın',
      'Başını yana çevirin',
      'Çevredeki sert nesneleri uzaklaştırın',
      '5 dakikadan uzun sürerse 112 arayın',
      'Kriz bitince kontrol için doktora götürün',
    ],
    warnings: [
      'Ağzına bir şey koymayın',
      'Tutmaya veya sarsarak durdurmaya çalışmayın',
      'Soğuk su veya alkol ile ovmayın',
    ],
  },
  {
    id: '6',
    title: 'Alerjik Reaksiyon',
    icon: 'fitness',
    color: '#EC4899',
    steps: [
      'Alerjik reaksiyona neden olan maddeyi durdurun',
      'Hafif döküntü için antihistaminik verin (doktor önerisi)',
      'Şişlik veya nefes darlığı varsa hemen acil servise gidin',
      'Anafilaksi belirtileri varsa 112 arayın',
      'Epipen varsa kullanın',
    ],
    warnings: [
      'Nefes darlığını hafife almayın',
      'Dudak ve dil şişmesi acil durumdur',
    ],
  },
];

export default function EmergencyScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const handleCall = async (number: string, name: string) => {
    const phoneNumber = Platform.OS === 'ios' ? `telprompt:${number}` : `tel:${number}`;
    
    Alert.alert(
      'Arama Onayı',
      `${name} (${number}) numarasını aramak istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ara',
          onPress: async () => {
            try {
              const canOpen = await Linking.canOpenURL(phoneNumber);
              if (canOpen) {
                await Linking.openURL(phoneNumber);
              } else {
                Alert.alert('Hata', 'Arama yapılamıyor');
              }
            } catch (error) {
              Alert.alert('Hata', 'Arama başlatılamadı');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Emergency Header */}
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        style={[styles.header, shadows.medium]}
      >
        <Ionicons name="alert-circle" size={48} color="white" />
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>
          Acil Durumlar
        </Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          İlk yardım rehberi ve acil numaralar
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Emergency Contacts */}
        <View style={[styles.contactsCard, { backgroundColor: 'white' }, shadows.medium]}>
          <Text style={[styles.contactsTitle, typography.h3, { color: colors.text }]}>
            Acil Numaralar
          </Text>
          <View style={styles.contactsGrid}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactItem, shadows.small]}
                onPress={() => handleCall(contact.number, contact.name)}
              >
                <LinearGradient
                  colors={[contact.color, contact.color + 'CC']}
                  style={styles.contactGradient}
                >
                  <View style={styles.contactIcon}>
                    <Ionicons name={contact.icon} size={32} color="white" />
                  </View>
                  <Text style={[styles.contactNumber, typography.h2, { color: 'white' }]}>
                    {contact.number}
                  </Text>
                  <Text style={[styles.contactName, typography.caption, { color: 'white' }]}>
                    {contact.name}
                  </Text>
                  <View style={styles.contactCallIcon}>
                    <Ionicons name="call" size={20} color="white" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Important Note */}
        <View style={[styles.noteCard, { backgroundColor: colors.warning[50] }]}>
          <Ionicons name="information-circle" size={24} color={colors.warning[600]} />
          <Text style={[styles.noteText, typography.body, { color: colors.warning[700] }]}>
            Acil durumlarda panik yapmayın. Bu rehber genel bilgi içindir, mutlaka sağlık profesyoneline danışın.
          </Text>
        </View>

        {/* First Aid Topics */}
        <View style={[styles.topicsCard, { backgroundColor: 'white' }, shadows.small]}>
          <Text style={[styles.topicsTitle, typography.h3, { color: colors.text }]}>
            İlk Yardım Rehberi
          </Text>

          {firstAidTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicItem,
                { borderLeftColor: topic.color },
              ]}
              onPress={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
            >
              <View style={styles.topicHeader}>
                <View style={[styles.topicIcon, { backgroundColor: topic.color + '20' }]}>
                  <Ionicons name={topic.icon} size={28} color={topic.color} />
                </View>
                <Text style={[styles.topicTitle, typography.h4, { color: colors.text }]}>
                  {topic.title}
                </Text>
                <Ionicons
                  name={expandedTopic === topic.id ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.neutral[400]}
                />
              </View>

              {expandedTopic === topic.id && (
                <View style={[styles.topicContent, { borderTopColor: colors.neutral[200] }]}>
                  {/* Steps */}
                  <View style={styles.topicSection}>
                    <Text style={[styles.topicSectionTitle, typography.bodyBold, { color: topic.color }]}>
                      Yapılması Gerekenler:
                    </Text>
                    {topic.steps.map((step, index) => (
                      <View key={index} style={styles.stepItem}>
                        <View style={[styles.stepNumber, { backgroundColor: topic.color }]}>
                          <Text style={[styles.stepNumberText, { color: 'white' }]}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text style={[styles.stepText, typography.body, { color: colors.text }]}>
                          {step}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Warnings */}
                  {topic.warnings && topic.warnings.length > 0 && (
                    <View style={[styles.warningSection, { backgroundColor: colors.error[50] }]}>
                      <View style={styles.warningHeader}>
                        <Ionicons name="warning" size={20} color={colors.error[600]} />
                        <Text style={[styles.warningSectionTitle, typography.bodyBold, { color: colors.error[700] }]}>
                          Dikkat!
                        </Text>
                      </View>
                      {topic.warnings.map((warning, index) => (
                        <View key={index} style={styles.warningItem}>
                          <View style={[styles.warningBullet, { backgroundColor: colors.error[500] }]} />
                          <Text style={[styles.warningText, typography.body, { color: colors.error[700] }]}>
                            {warning}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Bag Checklist */}
        <View style={[styles.checklistCard, { backgroundColor: 'white' }, shadows.small]}>
          <Text style={[styles.checklistTitle, typography.h3, { color: colors.text }]}>
            Acil Çanta Kontrol Listesi
          </Text>
          <Text style={[styles.checklistSubtitle, typography.body, { color: colors.textSecondary }]}>
            Acil durumlarda hazır bulundurmanız gerekenler:
          </Text>

          <View style={styles.checklistItems}>
            {[
              'İlaç listesi ve reçeteler',
              'Alerji kartı',
              'Kan grubu bilgisi',
              'Aşı kartı fotokopisi',
              'Doktor iletişim bilgileri',
              'Sağlık sigortası bilgileri',
              'Ateş ölçer',
              'El feneri ve piller',
              'İlk yardım malzemeleri',
              'Dezenfektan',
            ].map((item, index) => (
              <View key={index} style={styles.checklistItem}>
                <Ionicons name="checkmark-circle-outline" size={24} color={colors.success[500]} />
                <Text style={[styles.checklistItemText, typography.body, { color: colors.text }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Emergency App Recommendations */}
        <View style={[styles.appsCard, { backgroundColor: colors.primary[50] }]}>
          <Ionicons name="phone-portrait" size={32} color={colors.primary[600]} />
          <View style={styles.appsContent}>
            <Text style={[styles.appsTitle, typography.h4, { color: colors.primary[700] }]}>
              Önerilen Uygulamalar
            </Text>
            <Text style={[styles.appsText, typography.body, { color: colors.primary[600] }]}>
              Akıllı telefonunuza Sağlık Bakanlığı'nın resmi "e-Nabız" uygulamasını ve "İlk Yardım" uygulamasını indirmenizi öneririz.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Emergency Call Button */}
      <TouchableOpacity
        style={[styles.emergencyButton, shadows.large]}
        onPress={() => handleCall('112', 'Acil Yardım')}
      >
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          style={styles.emergencyButtonGradient}
        >
          <Ionicons name="call" size={28} color="white" />
          <Text style={[styles.emergencyButtonText, typography.h3, { color: 'white' }]}>
            112 Acil Ara
          </Text>
        </LinearGradient>
      </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contactsCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  contactsTitle: {
    marginBottom: 16,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactItem: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  contactGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
    minHeight: 150,
  },
  contactIcon: {
    marginBottom: 8,
  },
  contactNumber: {
    fontWeight: '700',
  },
  contactName: {
    opacity: 0.9,
  },
  contactCallIcon: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  noteCard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
  },
  topicsCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  topicsTitle: {
    marginBottom: 16,
  },
  topicItem: {
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: {
    flex: 1,
  },
  topicContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 16,
  },
  topicSection: {
    gap: 12,
  },
  topicSectionTitle: {
    marginBottom: 8,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
  },
  warningSection: {
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningSectionTitle: {},
  warningItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  warningBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  warningText: {
    flex: 1,
  },
  checklistCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  checklistTitle: {
    marginBottom: 8,
  },
  checklistSubtitle: {
    marginBottom: 16,
  },
  checklistItems: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  checklistItemText: {},
  appsCard: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    marginBottom: 100,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  appsContent: {
    flex: 1,
    gap: 8,
  },
  appsTitle: {},
  appsText: {},
  emergencyButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emergencyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  emergencyButtonText: {
    fontWeight: '700',
  },
});
