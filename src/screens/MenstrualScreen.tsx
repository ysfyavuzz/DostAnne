import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MenstrualScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<'calendar' | 'cycle' | 'symptoms' | 'tips'>('calendar');
  const [currentDay, setCurrentDay] = useState(15);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  // Simüle edilmiş adet döngüsü verileri
  const [cycleData, setCycleData] = useState({
    lastPeriod: '2024-01-01',
    nextPeriod: '2024-01-29',
    fertileWindow: '2024-01-13 - 2024-01-17',
    ovulationDay: '2024-01-15',
    currentCycleDay: 15,
    currentPhase: 'follicular',
  });

  // Simüle edilmiş ay takvimi
  const calendarDays = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    isPeriod: i >= 0 && i < 4, // 1-4 gün
    isFertile: i >= 12 && i <= 17, // 13-18 gün
    isOvulation: i === 14, // 15. gün
    isToday: i === 14, // Bugün 15. gün
    notes: i === 14 ? 'Ovulasyon günü' : '',
  }));

  const cyclePhases = [
    {
      id: 1,
      name: 'Foliküler Faz',
      days: '1-14',
      description: 'Yumurtalık yumurtayı olgunlaştırır',
      symptoms: [
        'Enerji artışı',
        'Cilt parlaklığı',
        'Libido artışı',
        'Pozitif ruh hali',
      ],
      hormone: 'Östrojen artışı',
      icon: 'sunny',
      color: '#34C759',
    },
    {
      id: 2,
      name: 'Ovulasyon',
      days: '14-16',
      description: 'Yumurta yumurtalıktan salınır',
      symptoms: [
        'Karın ağrısı',
        'Artan libido',
        'Vajinal akıntı',
        'Vücut ısısı artışı',
      ],
      hormone: 'LH zirvesi',
      icon: 'heart',
      color: '#FF3B30',
    },
    {
      id: 3,
      name: 'Luteal Faz',
      days: '15-28',
      description: 'Rahim duvarı kalınlaşır',
      symptoms: [
        'Öğretici belirtiler',
        'Göğüs hassasiyeti',
        'Yorgunluk',
        'İştah artışı',
      ],
      hormone: 'Progesteron artışı',
      icon: 'cloud',
      color: '#FF9500',
    },
    {
      id: 4,
      name: 'Menstrüel',
      days: '1-5',
      description: 'Gebelik olmadıysa döngü başlar',
      symptoms: [
        'Kanama',
        'Kramp',
        'Yorgunluk',
        'Ruh hali değişimleri',
      ],
      hormone: 'Progesteron düşüşü',
      icon: 'water',
      color: '#007AFF',
    },
  ];

  const commonSymptoms = [
    {
      id: 1,
      name: 'Karın Krampları',
      severity: 'Orta',
      tips: [
        'Sıcak su torbası uygulayın',
        'Hafif egzersiz yapın',
        'Ağrı kesici alın',
        'Rahatlayın',
      ],
      icon: 'medical',
      color: '#FF3B30',
    },
    {
      id: 2,
      name: 'Göğüs Hassasiyeti',
      severity: 'Hafif',
      tips: [
        'Sutyen seçimine dikkat edin',
        'Kafeini azaltın',
        'Vitamin E takviyesi',
        'Masaj yapın',
      ],
      icon: 'heart',
      color: '#FF9500',
    },
    {
      id: 3,
      name: 'Yorgunluk',
      severity: 'Orta',
      tips: [
        'Düzenli uyku',
        'Demir takviyesi',
        'Hafif egzersiz',
        'Stres yönetimi',
      ],
      icon: 'battery-half',
      color: '#8E8E93',
    },
    {
      id: 4,
      name: 'Baş Ağrısı',
      severity: 'Hafif',
      tips: [
        'Su tüketimini artırın',
        'Karanlık ortamda dinlenin',
        'Kafeini azaltın',
        'Düzenli yemek',
      ],
      icon: 'alert-circle',
      color: '#007AFF',
    },
  ];

  const menstrualTips = [
    {
      id: 1,
      title: 'Beslenme',
      description: 'Demir açısından zengin gıdalar tüketin: ıspanak, et, baklagiller',
      icon: 'restaurant',
      color: '#34C759',
    },
    {
      id: 2,
      title: 'Egzersiz',
      description: 'Hafif egzersizler yapın: yürüyüş, yoga, pilates',
      icon: 'fitness',
      color: '#007AFF',
    },
    {
      id: 3,
      title: 'Stres Yönetimi',
      description: 'Meditasyon, derin nefes egzersizleri, sıcak banyo',
      icon: 'leaf',
      color: '#AF52DE',
    },
    {
      id: 4,
      title: 'Uyku',
      description: 'Düzenli uyku düzeni, yatmadan önce ekranlardan uzaklaşın',
      icon: 'moon',
      color: '#5AC8FA',
    },
    {
      id: 5,
      title: 'Su Tüketimi',
      description: 'Günde en az 2-3 litre su için, şişkinliği azaltır',
      icon: 'water',
      color: '#5AC8FA',
    },
    {
      id: 6,
      title: 'Vitamin Takviyesi',
      description: 'B6 vitamini, magnezyum ve omega-3 takviyeleri',
      icon: 'medical',
      color: '#FF9500',
    },
  ];

  const handleLogPeriod = () => {
    Alert.alert('Adet Dönemi Kaydı', 'Adet dönemi başlangıcı kaydedildi');
  };

  const handleLogSymptoms = () => {
    Alert.alert('Belirti Kaydı', 'Belirti kayıt özelliği yakında eklenecek');
  };

  const CalendarDay = ({ day, isPeriod, isFertile, isOvulation, isToday, notes }: any) => (
    <View style={[
      styles.calendarDay,
      isPeriod && styles.periodDay,
      isFertile && !isOvulation && styles.fertileDay,
      isOvulation && styles.ovulationDay,
      isToday && styles.todayDay,
    ]}>
      <Text style={[
        styles.dayNumber,
        (isPeriod || isOvulation) && styles.specialDayNumber,
      ]}>
        {day}
      </Text>
      {isOvulation && <Ionicons name="heart" size={12} color="white" />}
      {isToday && <View style={styles.todayIndicator} />}
    </View>
  );

  const CyclePhaseCard = ({ phase }: any) => (
    <View style={styles.phaseCard}>
      <View style={styles.phaseHeader}>
        <Ionicons name={phase.icon as any} size={24} color={phase.color} />
        <View style={styles.phaseInfo}>
          <Text style={styles.phaseName}>{phase.name}</Text>
          <Text style={styles.phaseDays}>{phase.days} gün</Text>
        </View>
      </View>
      <Text style={styles.phaseDescription}>{phase.description}</Text>
      <View style={styles.phaseDetails}>
        <Text style={styles.phaseHormone}>{phase.hormone}</Text>
        <View style={styles.symptomsContainer}>
          {phase.symptoms.slice(0, 2).map((symptom: string, index: number) => (
            <Text key={index} style={styles.symptomText}>• {symptom}</Text>
          ))}
        </View>
      </View>
    </View>
  );

  const SymptomCard = ({ symptom }: any) => (
    <View style={styles.symptomCard}>
      <View style={styles.symptomHeader}>
        <Ionicons name={symptom.icon as any} size={24} color={symptom.color} />
        <View style={styles.symptomInfo}>
          <Text style={styles.symptomName}>{symptom.name}</Text>
          <Text style={styles.symptomSeverity}>Şiddet: {symptom.severity}</Text>
        </View>
      </View>
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>İpuçları:</Text>
        {symptom.tips.map((tip: string, index: number) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const MenstrualTipCard = ({ tip }: any) => (
    <View style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Ionicons name={tip.icon as any} size={24} color={tip.color} />
        <Text style={styles.tipTitle}>{tip.title}</Text>
      </View>
      <Text style={styles.tipDescription}>{tip.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Kadınsal Adet Takvimi</Text>
        <Text style={styles.subtitle}>Döngünüzü takip edin</Text>
      </View>

      <View style={styles.cycleInfo}>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sıradaki Adet</Text>
            <Text style={styles.infoValue}>29 Ocak</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Döngü Günü</Text>
            <Text style={styles.infoValue}>15. gün</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Verimli Pencere</Text>
            <Text style={styles.infoValue}>13-17 Ocak</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ovulasyon</Text>
            <Text style={styles.infoValue}>15 Ocak</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'calendar' && styles.activeTab]}
          onPress={() => setSelectedTab('calendar')}
        >
          <Ionicons 
            name="calendar" 
            size={20} 
            color={selectedTab === 'calendar' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'calendar' && styles.activeTabText]}>
            Takvim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'cycle' && styles.activeTab]}
          onPress={() => setSelectedTab('cycle')}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={selectedTab === 'cycle' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'cycle' && styles.activeTabText]}>
            Döngü
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'symptoms' && styles.activeTab]}
          onPress={() => setSelectedTab('symptoms')}
        >
          <Ionicons 
            name="medical" 
            size={20} 
            color={selectedTab === 'symptoms' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'symptoms' && styles.activeTabText]}>
            Belirtiler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'tips' && styles.activeTab]}
          onPress={() => setSelectedTab('tips')}
        >
          <Ionicons 
            name="bulb" 
            size={20} 
            color={selectedTab === 'tips' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'tips' && styles.activeTabText]}>
            İpuçları
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'calendar' && (
        <View style={styles.section}>
          <View style={styles.calendarHeader}>
            <Text style={styles.sectionTitle}>📅 Ocak 2024</Text>
            <TouchableOpacity 
              style={styles.logButton}
              onPress={handleLogPeriod}
            >
              <Ionicons name="add" size={16} color="white" />
              <Text style={styles.logButtonText}>Adet Başlat</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarContainer}>
            <View style={styles.weekDays}>
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {calendarDays.map((day) => (
                <CalendarDay key={day.day} {...day} />
              ))}
            </View>
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF3B30' }]} />
              <Text style={styles.legendText}>Adet</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#34C759' }]} />
              <Text style={styles.legendText}>Verimli</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9500' }]} />
              <Text style={styles.legendText}>Ovulasyon</Text>
            </View>
          </View>
        </View>
      )}

      {selectedTab === 'cycle' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 Döngü Fazları</Text>
          {cyclePhases.map((phase) => (
            <CyclePhaseCard key={phase.id} phase={phase} />
          ))}
        </View>
      )}

      {selectedTab === 'symptoms' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>😰 Yaygın Belirtiler</Text>
            <TouchableOpacity 
              style={styles.addSmallButton} 
              onPress={handleLogSymptoms}
            >
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
          {commonSymptoms.map((symptom) => (
            <SymptomCard key={symptom.id} symptom={symptom} />
          ))}
        </View>
      )}

      {selectedTab === 'tips' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Sağlık İpuçları</Text>
          {menstrualTips.map((tip) => (
            <MenstrualTipCard key={tip.id} tip={tip} />
          ))}
        </View>
      )}

      <View style={styles.infoSection}>
        <View style={styles.infoCardLarge}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Bu bilgiler genel rehberlik içindir. Adet döngüsü ile ilgili ciddi endişeleriniz için mutlaka doktorunuza danışın.
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
  cycleInfo: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
  },
  addSmallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  logButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#636E72',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  periodDay: {
    backgroundColor: '#FFEBEE',
  },
  fertileDay: {
    backgroundColor: '#E8F5E8',
  },
  ovulationDay: {
    backgroundColor: '#FFF3E0',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  dayNumber: {
    fontSize: 14,
    color: '#2D3436',
    fontWeight: '500',
  },
  specialDayNumber: {
    fontWeight: 'bold',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#636E72',
  },
  phaseCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  phaseDays: {
    fontSize: 14,
    color: '#636E72',
  },
  phaseDescription: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 8,
    lineHeight: 20,
  },
  phaseDetails: {
    gap: 4,
  },
  phaseHormone: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  symptomsContainer: {
    gap: 2,
  },
  symptomText: {
    fontSize: 14,
    color: '#636E72',
  },
  symptomCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  symptomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  symptomInfo: {
    flex: 1,
    marginLeft: 12,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  symptomSeverity: {
    fontSize: 14,
    color: '#636E72',
  },
  tipsContainer: {
    gap: 6,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
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
  tipCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  infoSection: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCardLarge: {
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

export default MenstrualScreen;