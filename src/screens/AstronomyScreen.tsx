import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AstronomyScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<'horoscope' | 'astronomy' | 'moon' | 'baby'>('horoscope');

  // Burçlar ve özellikleri
  const zodiacSigns = [
    {
      id: 1,
      name: 'Koç',
      dates: '21 Mart - 19 Nisan',
      element: 'Ateş',
      ruler: 'Mars',
      traits: ['Cesur', 'Enerjik', 'Lider', 'İstekli'],
      compatibility: ['Aslan', 'Yay', 'İkizler', 'Kova'],
      babyPersonality: 'Aktif, meraklı ve enerjik bebekler',
      icon: 'flame',
      color: '#FF3B30',
    },
    {
      id: 2,
      name: 'Boğa',
      dates: '20 Nisan - 20 Mayıs',
      element: 'Toprak',
      ruler: 'Venüs',
      traits: ['Sakin', 'Sabırlı', 'Pratik', 'Sadık'],
      compatibility: ['Başak', 'Oğlak', 'Yengeç', 'Balık'],
      babyPersonality: 'Sakin, huzurlu ve sevecen bebekler',
      icon: 'leaf',
      color: '#34C759',
    },
    {
      id: 3,
      name: 'İkizler',
      dates: '21 Mayıs - 20 Haziran',
      element: 'Hava',
      ruler: 'Merkür',
      traits: ['Zeki', 'İletişimci', 'Adaptif', 'Meraklı'],
      compatibility: ['Terazi', 'Kova', 'Koç', 'Aslan'],
      babyPersonality: 'Konuşkan, sosyal ve hızlı öğrenen bebekler',
      icon: 'sunny',
      color: '#FF9500',
    },
    {
      id: 4,
      name: 'Yengeç',
      dates: '21 Haziran - 22 Temmuz',
      element: 'Su',
      ruler: 'Ay',
      traits: ['Duygusal', 'Koruyucu', 'İçten', 'Intuitif'],
      compatibility: ['Boğa', 'Balık', 'Akrep', 'Başak'],
      babyPersonality: 'Duygusal, bağ kurmayı seven ve hassas bebekler',
      icon: 'water',
      color: '#007AFF',
    },
    {
      id: 5,
      name: 'Aslan',
      dates: '23 Temmuz - 22 Ağustos',
      element: 'Ateş',
      ruler: 'Güneş',
      traits: ['Kendine güvenen', 'Cömert', 'Lider', 'Samimi'],
      compatibility: ['Koç', 'Yay', 'İkizler', 'Terazi'],
      babyPersonality: 'İlgi odağı, neşeli ve karizmatik bebekler',
      icon: 'sunny',
      color: '#FF9500',
    },
    {
      id: 6,
      name: 'Başak',
      dates: '23 Ağustos - 22 Eylül',
      element: 'Toprak',
      ruler: 'Merkür',
      traits: ['Mükemmeliyetçi', 'Analitik', 'Çalışkan', 'Pratik'],
      compatibility: ['Boğa', 'Oğlak', 'Yengeç', 'Akrep'],
      babyPersonality: 'Düzenli, sakin ve gözlemci bebekler',
      icon: 'leaf',
      color: '#34C759',
    },
  ];

  // Astronomi bilgileri
  const astronomyFacts = [
    {
      id: 1,
      title: 'Ayın Evreleri',
      description: 'Yeni ay, hilal, ilk dördün, dolunay, son dördün, son hilal',
      babyImpact: 'Ay evreleri bebek uykusunu etkileyebilir',
      icon: 'moon',
      color: '#5AC8FA',
    },
    {
      id: 2,
      title: 'Gezegenler',
      description: 'Güneş sistemindeki 8 gezegen ve özellikleri',
      babyImpact: 'Mercury retrograde dönemlerinde bebekler daha huzursuz olabilir',
      icon: 'planet',
      color: '#AF52DE',
    },
    {
      id: 3,
      title: 'Yıldızlar',
      description: 'En parlak yıldızlar ve takımyıldızları',
      babyImpact: 'Bebekler yıldızları izlemeyi sever, uyku öncesi sakinleştirir',
      icon: 'star',
      color: '#FF9500',
    },
    {
      id: 4,
      title: 'Güneş Tutulması',
      description: 'Güneş ve ay tutulmalarının etkileri',
      babyImpact: 'Tutulma dönemlerinde bebekler daha hassas olabilir',
      icon: 'sunny',
      color: '#FF3B30',
    },
  ];

  // Ay fazları
  const moonPhases = [
    {
      id: 1,
      name: 'Yeni Ay',
      phase: '🌑',
      meaning: 'Yeni başlangıçlar',
      babyTips: [
        'Yeni rutinler için iyi zaman',
        'Bebekler daha uyumlu olabilir',
        'Yeni gıdaları denemek için uygun',
      ],
      icon: 'moon',
      color: '#8E8E93',
    },
    {
      id: 2,
      name: 'İlk Hilal',
      phase: '🌒',
      meaning: 'Büyüme ve gelişim',
      babyTips: [
        'Bebeklerin gelişim atakları',
        'Yeni beceriler öğrenme zamanı',
        'Enerji seviyesi artabilir',
      ],
      icon: 'moon',
      color: '#5AC8FA',
    },
    {
      id: 3,
      name: 'Dolunay',
      phase: '🌕',
      meaning: 'Zirve ve enerji',
      babyTips: [
        'Uyku düzeni etkilenebilir',
        'Bebekler daha aktif olabilir',
        'Daha fazla dikkat gerekli',
      ],
      icon: 'moon',
      color: '#FF9500',
    },
    {
      id: 4,
      name: 'Son Hilal',
      phase: '🌘',
      meaning: 'Salınım ve dinlenme',
      babyTips: [
        'Daha sakin ve huzurlu dönem',
        'Uyku kalitesi artabilir',
        'Dinlenmeye odaklanma zamanı',
      ],
      icon: 'moon',
      color: '#007AFF',
    },
  ];

  // Bebek isimleri anlamları
  const babyNames = [
    {
      id: 1,
      name: 'Luna',
      meaning: 'Ay',
      origin: 'Latince',
      zodiac: 'Yengeç',
      characteristics: ['Duygusal', 'Intuitif', 'Huzurlu'],
      icon: 'moon',
      color: '#5AC8FA',
    },
    {
      id: 2,
      name: 'Leo',
      meaning: 'Aslan',
      origin: 'Latince',
      zodiac: 'Aslan',
      characteristics: ['Cesur', 'Lider', 'Karizmatik'],
      icon: 'flame',
      color: '#FF9500',
    },
    {
      id: 3,
      name: 'Aurora',
      meaning: 'Şafak',
      origin: 'Latince',
      zodiac: 'Koç',
      characteristics: ['Enerjik', 'Umutlu', 'Yeni başlangıç'],
      icon: 'sunny',
      color: '#FF3B30',
    },
    {
      id: 4,
      name: 'Stella',
      meaning: 'Yıldız',
      origin: 'Latince',
      zodiac: 'Terazi',
      characteristics: ['Zeki', 'Dengeli', 'Parlak'],
      icon: 'star',
      color: '#AF52DE',
    },
  ];

  const ZodiacCard = ({ sign }: any) => (
    <View style={styles.zodiacCard}>
      <View style={styles.zodiacHeader}>
        <Ionicons name={sign.icon as any} size={32} color={sign.color} />
        <View style={styles.zodiacInfo}>
          <Text style={styles.zodiacName}>{sign.name}</Text>
          <Text style={styles.zodiacDates}>{sign.dates}</Text>
          <Text style={styles.zodiacElement}>{sign.element} • {sign.ruler}</Text>
        </View>
      </View>
      
      <View style={styles.zodiacSection}>
        <Text style={styles.sectionLabel}>Özellikler:</Text>
        <View style={styles.traitsContainer}>
          {sign.traits.map((trait: string, index: number) => (
            <View key={index} style={styles.traitBadge}>
              <Text style={styles.traitText}>{trait}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.zodiacSection}>
        <Text style={styles.sectionLabel}>Bebek Kişiliği:</Text>
        <Text style={styles.babyPersonality}>{sign.babyPersonality}</Text>
      </View>

      <View style={styles.zodiacSection}>
        <Text style={styles.sectionLabel}>Uyumlu Burçlar:</Text>
        <Text style={styles.compatibilityText}>{sign.compatibility.join(', ')}</Text>
      </View>
    </View>
  );

  const AstronomyCard = ({ fact }: any) => (
    <View style={styles.astronomyCard}>
      <View style={styles.astronomyHeader}>
        <Ionicons name={fact.icon as any} size={24} color={fact.color} />
        <Text style={styles.astronomyTitle}>{fact.title}</Text>
      </View>
      <Text style={styles.astronomyDescription}>{fact.description}</Text>
      <View style={styles.impactSection}>
        <Text style={styles.impactLabel}>Bebek Etkisi:</Text>
        <Text style={styles.impactText}>{fact.babyImpact}</Text>
      </View>
    </View>
  );

  const MoonPhaseCard = ({ phase }: any) => (
    <View style={styles.moonCard}>
      <View style={styles.moonHeader}>
        <Text style={styles.moonPhase}>{phase.phase}</Text>
        <View style={styles.moonInfo}>
          <Text style={styles.moonName}>{phase.name}</Text>
          <Text style={styles.moonMeaning}>{phase.meaning}</Text>
        </View>
      </View>
      <View style={styles.moonTips}>
        <Text style={styles.tipsLabel}>Bebek İpuçları:</Text>
        {phase.babyTips.map((tip: string, index: number) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const BabyNameCard = ({ name }: any) => (
    <View style={styles.nameCard}>
      <View style={styles.nameHeader}>
        <Ionicons name={name.icon as any} size={24} color={name.color} />
        <View style={styles.nameInfo}>
          <Text style={styles.nameText}>{name.name}</Text>
          <Text style={styles.nameOrigin}>{name.origin} • {name.zodiac}</Text>
        </View>
      </View>
      <Text style={styles.nameMeaning}>Anlam: {name.meaning}</Text>
      <View style={styles.characteristicsContainer}>
        <Text style={styles.characteristicsLabel}>Özellikler:</Text>
        {name.characteristics.map((char: string, index: number) => (
          <View key={index} style={styles.characteristicBadge}>
            <Text style={styles.characteristicText}>{char}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Astronomi & Burçlar</Text>
        <Text style={styles.subtitle}>Kozmik rehberiniz</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'horoscope' && styles.activeTab]}
          onPress={() => setSelectedTab('horoscope')}
        >
          <Ionicons 
            name="star" 
            size={20} 
            color={selectedTab === 'horoscope' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'horoscope' && styles.activeTabText]}>
            Burçlar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'astronomy' && styles.activeTab]}
          onPress={() => setSelectedTab('astronomy')}
        >
          <Ionicons 
            name="planet" 
            size={20} 
            color={selectedTab === 'astronomy' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'astronomy' && styles.activeTabText]}>
            Astronomi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'moon' && styles.activeTab]}
          onPress={() => setSelectedTab('moon')}
        >
          <Ionicons 
            name="moon" 
            size={20} 
            color={selectedTab === 'moon' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'moon' && styles.activeTabText]}>
            Ay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'baby' && styles.activeTab]}
          onPress={() => setSelectedTab('baby')}
        >
          <Ionicons 
            name="heart" 
            size={20} 
            color={selectedTab === 'baby' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'baby' && styles.activeTabText]}>
            İsimler
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'horoscope' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Burç Özellikleri</Text>
          {zodiacSigns.map((sign) => (
            <ZodiacCard key={sign.id} sign={sign} />
          ))}
        </View>
      )}

      {selectedTab === 'astronomy' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🪐 Astronomi Bilgileri</Text>
          {astronomyFacts.map((fact) => (
            <AstronomyCard key={fact.id} fact={fact} />
          ))}
        </View>
      )}

      {selectedTab === 'moon' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌙 Ay Evreleri</Text>
          {moonPhases.map((phase) => (
            <MoonPhaseCard key={phase.id} phase={phase} />
          ))}
        </View>
      )}

      {selectedTab === 'baby' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👶 Astronomik İsimler</Text>
          {babyNames.map((name) => (
            <BabyNameCard key={name.id} name={name} />
          ))}
        </View>
      )}

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Burçlar ve astronomi bilgileri eğlence amaçlıdır. Bilimsel dayanağı yoktur, sadece rehberlik içindir.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabText: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
  },
  zodiacCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zodiacHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zodiacInfo: {
    flex: 1,
    marginLeft: 12,
  },
  zodiacName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 2,
  },
  zodiacDates: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 2,
  },
  zodiacElement: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  zodiacSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 6,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  traitBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  traitText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  babyPersonality: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 20,
  },
  compatibilityText: {
    fontSize: 14,
    color: '#636E72',
  },
  astronomyCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  astronomyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  astronomyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 8,
  },
  astronomyDescription: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 8,
    lineHeight: 20,
  },
  impactSection: {
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 8,
  },
  impactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 4,
  },
  impactText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 18,
  },
  moonCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moonPhase: {
    fontSize: 24,
    marginRight: 12,
  },
  moonInfo: {
    flex: 1,
  },
  moonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  moonMeaning: {
    fontSize: 14,
    color: '#636E72',
    fontStyle: 'italic',
  },
  moonTips: {
    gap: 4,
  },
  tipsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 6,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#2D3436',
    marginLeft: 8,
    lineHeight: 18,
  },
  nameCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 2,
  },
  nameOrigin: {
    fontSize: 14,
    color: '#636E72',
  },
  nameMeaning: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  characteristicsContainer: {
    gap: 4,
  },
  characteristicsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 6,
  },
  characteristicBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  characteristicText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '500',
  },
  infoSection: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    marginLeft: 8,
    lineHeight: 20,
  },
});

export default AstronomyScreen;