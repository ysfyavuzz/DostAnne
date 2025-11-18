import React, { useState, useEffect } from 'react';
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
import { useDatabase } from '../hooks/useDatabase';
import { useNotifications } from '../hooks/useNotifications';

const HealthScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<'vaccines' | 'appointments' | 'records'>('vaccines');
  
  const {
    currentBaby,
    healthRecords,
    createHealthRecord,
    loadHealthRecordsForBaby,
    loading,
  } = useDatabase();

  const {
    scheduleVaccine,
    scheduleMedical,
    scheduledNotifications,
    cancelScheduled,
  } = useNotifications();

  // Simüle edilmiş aşı takvimi
  const vaccineSchedule = [
    {
      id: 1,
      vaccine: 'Hepatit B (Doğum)',
      dueDate: 'Doğumda',
      givenDate: '15.01.2024',
      status: 'completed',
      nextDose: '-',
      description: 'İlk doz, doğumda uygulanır',
      scheduledDate: new Date('2024-01-14'),
    },
    {
      id: 2,
      vaccine: 'BCG',
      dueDate: 'Doğumdan sonraki 2 ay',
      givenDate: '15.03.2024',
      status: 'completed',
      nextDose: '-',
      description: 'Verem hastalığına karşı koruma',
      scheduledDate: new Date('2024-03-14'),
    },
    {
      id: 3,
      vaccine: 'DaBT-İPA-Hib (1. Doz)',
      dueDate: '2. Ay',
      givenDate: '15.03.2024',
      status: 'completed',
      nextDose: '4. Ay',
      description: 'Difteri, boğmaca, tetanoz, polio, hemofilus',
      scheduledDate: new Date('2024-03-14'),
    },
    {
      id: 4,
      vaccine: 'DaBT-İPA-Hib (2. Doz)',
      dueDate: '4. Ay',
      givenDate: '',
      status: 'upcoming',
      nextDose: '6. Ay',
      description: 'Difteri, boğmaca, tetanoz, polio, hemofilus',
      scheduledDate: new Date('2024-04-14'),
    },
    {
      id: 5,
      vaccine: 'DaBT-İPA-Hib (3. Doz)',
      dueDate: '6. Ay',
      givenDate: '',
      status: 'pending',
      nextDose: '18. Ay',
      description: 'Difteri, boğmaca, tetanoz, polio, hemofilus',
      scheduledDate: new Date('2024-06-14'),
    },
    {
      id: 6,
      vaccine: 'KPA (1. Doz)',
      dueDate: '2. Ay',
      givenDate: '15.03.2024',
      status: 'completed',
      nextDose: '4. Ay',
      description: 'Pnömokok hastalıklarına karşı koruma',
      scheduledDate: new Date('2024-03-14'),
    },
  ];

  // Simüle edilmiş doktor randevuları
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Ayşe Yılmaz',
      specialty: 'Çocuk Sağlığı ve Hastalıkları',
      date: '25.01.2024',
      time: '14:30',
      purpose: '2. Aylık kontrol',
      status: 'upcoming',
      location: 'Ankara Şehir Hastanesi',
      notes: 'Aşı takvimi kontrolü',
      appointmentDate: new Date('2024-01-25'),
    },
    {
      id: 2,
      doctor: 'Dr. Mehmet Kaya',
      specialty: 'Çocuk Sağlığı ve Hastalıkları',
      date: '15.03.2024',
      time: '10:00',
      purpose: '4. Aylık kontrol',
      status: 'upcoming',
      location: 'Ankara Şehir Hastanesi',
      notes: 'Büyüme gelişim takibi',
      appointmentDate: new Date('2024-03-15'),
    },
  ]);

  // Simüle edilmiş sağlık kayıtları
  const [healthRecordsList, setHealthRecordsList] = useState([
    {
      id: 1,
      type: 'Doktor Muayenesi',
      date: '15.01.2024',
      doctor: 'Dr. Zeynep Demir',
      diagnosis: 'Sağlıklı',
      notes: 'Doğumda normal fizik muayene',
      weight: '3.2 kg',
      height: '50 cm',
    },
    {
      id: 2,
      type: 'Aşı Uygulaması',
      date: '15.01.2024',
      doctor: 'Dr. Zeynep Demir',
      diagnosis: 'Aşı uygulandı',
      notes: 'Hepatit B ilk doz',
      weight: '',
      height: '',
    },
  ]);

  const healthTips = [
    {
      id: 1,
      title: 'Aşı Takvimi',
      description: 'Aşıları zamanında yaptırın, randevulari kaçırmayın',
      icon: 'medical',
      color: '#FF3B30',
    },
    {
      id: 2,
      title: 'Doktor Kontrolleri',
      description: '2. aydan itibaren düzenli doktor kontrolleri yapın',
      icon: 'person',
      color: '#007AFF',
    },
    {
      id: 3,
      title: 'Ateş Takibi',
      description: '38°C üzerinde ateşte hemen doktora başvurun',
      icon: 'thermometer',
      color: '#FF9500',
    },
    {
      id: 4,
      title: 'Beslenme',
      description: '6 aya kadar sadece anne sütü veya mama verin',
      icon: 'restaurant',
      color: '#34C759',
    },
  ];

  // useEffect for loading data and scheduling notifications
  useEffect(() => {
    if (currentBaby) {
      loadHealthRecordsForBaby(currentBaby.id);
      scheduleNotifications();
    }
  }, [currentBaby]);

  const scheduleNotifications = async () => {
    if (!currentBaby) return;

    // Schedule vaccine reminders
    for (const vaccine of vaccineSchedule) {
      if (vaccine.status === 'upcoming' && vaccine.scheduledDate) {
        try {
          await scheduleVaccine(vaccine.vaccine, currentBaby.name, vaccine.scheduledDate);
        } catch (error) {
          console.error('Failed to schedule vaccine reminder:', error);
        }
      }
    }

    // Schedule appointment reminders
    for (const appointment of appointments) {
      if (appointment.status === 'upcoming' && appointment.appointmentDate) {
        try {
          await scheduleMedical(appointment.appointmentDate, appointment.doctor, currentBaby.name);
        } catch (error) {
          console.error('Failed to schedule appointment reminder:', error);
        }
      }
    }
  };

  const handleAddAppointment = () => {
    Alert.alert('Yeni Randevu Ekle', 'Randevu ekleme özelliği yakında eklenecek');
  };

  const handleMarkVaccineGiven = async (vaccineId: number, vaccineName: string) => {
    if (!currentBaby) {
      Alert.alert('Hata', 'Bebek profili bulunamadı');
      return;
    }

    try {
      const record = {
        type: 'vaccine' as const,
        title: `${vaccineName} Aşı Yapıldı`,
        date: new Date().toISOString().split('T')[0],
        doctor: 'Aşı Hemşiresi',
        notes: 'Aşı başarıyla uygulandı',
        babyId: currentBaby.id,
      };

      await createHealthRecord(record).unwrap();
      
      // Show notification
      notificationService.notifyVaccineGiven(vaccineName, currentBaby.name);
      
      Alert.alert('Başarılı', `${vaccineName} aşısı kaydedildi`);
    } catch (error) {
      Alert.alert('Hata', 'Aşı kaydı oluşturulamadı');
      console.error('Failed to record vaccine:', error);
    }
  };

  const handleAddHealthRecord = () => {
    Alert.alert('Yeni Kayıt Ekle', 'Sağlık kaydı ekleme özelliği yakında eklenecek');
  };

  const VaccineCard = ({ vaccine }: any) => {
    const isReminderSet = scheduledNotifications.some(
      (n) => n.type === 'vaccine' && n.title.includes(vaccine.vaccine)
    );

    return (
      <View style={styles.vaccineCard}>
        <View style={styles.vaccineHeader}>
          <View style={styles.vaccineInfo}>
            <Text style={styles.vaccineName}>{vaccine.vaccine}</Text>
            <Text style={styles.vaccineDate}>{vaccine.dueDate}</Text>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: vaccine.status === 'completed' ? '#34C759' : 
                               vaccine.status === 'upcoming' ? '#FF9500' : '#E9ECEF' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: vaccine.status === 'completed' ? 'white' : 
                       vaccine.status === 'upcoming' ? 'white' : '#636E72' }
            ]}>
              {vaccine.status === 'completed' ? 'Yapıldı' : 
               vaccine.status === 'upcoming' ? 'Yaklaşan' : 'Beklemede'}
            </Text>
          </View>
        </View>
        <Text style={styles.vaccineDescription}>{vaccine.description}</Text>
        
        <View style={styles.vaccineDetails}>
          {vaccine.givenDate && (
            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={styles.detailText}>Yapılma: {vaccine.givenDate}</Text>
            </View>
          )}
          {vaccine.nextDose !== '-' && (
            <View style={styles.detailItem}>
              <Ionicons name="time" size={16} color="#FF9500" />
              <Text style={styles.detailText}>Sonraki Doz: {vaccine.nextDose}</Text>
            </View>
          )}
        </View>

        <View style={styles.notificationStatus}>
          {isReminderSet && vaccine.status === 'upcoming' && (
            <View style={styles.reminderIndicator}>
              <Ionicons name="notifications" size={16} color="#007AFF" />
              <Text style={styles.reminderText}>Hatırlatıcı ayarlandı</Text>
            </View>
          )}
        </View>

        {vaccine.status === 'upcoming' && (
          <TouchableOpacity 
            style={styles.markButton}
            onPress={() => handleMarkVaccineGiven(vaccine.id, vaccine.vaccine)}
          >
            <Text style={styles.markButtonText}>Yapıldı olarak işaretle</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const AppointmentCard = ({ appointment }: any) => {
    const isReminderSet = scheduledNotifications.some(
      (n) => n.type === 'medical' && n.title.includes(appointment.doctor)
    );

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>{appointment.doctor}</Text>
            <Text style={styles.doctorSpecialty}>{appointment.specialty}</Text>
          </View>
          <View style={[
            styles.appointmentStatus, 
            { backgroundColor: appointment.status === 'completed' ? '#34C759' : '#007AFF' }
          ]}>
            <Text style={styles.appointmentStatusText}>
              {appointment.status === 'completed' ? 'Tamamlandı' : 'Yaklaşan'}
            </Text>
          </View>
        </View>
        
        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color="#636E72" />
            <Text style={styles.detailText}>{appointment.date} - {appointment.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#636E72" />
            <Text style={styles.detailText}>{appointment.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="medical" size={16} color="#636E72" />
            <Text style={styles.detailText}>{appointment.purpose}</Text>
          </View>
        </View>

        <View style={styles.notificationStatus}>
          {isReminderSet && (
            <View style={styles.reminderIndicator}>
              <Ionicons name="notifications" size={16} color="#007AFF" />
              <Text style={styles.reminderText}>1 saat önce hatırlatılacak</Text>
            </View>
          )}
        </View>

        {appointment.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notlar:</Text>
            <Text style={styles.notesText}>{appointment.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  const HealthRecordCard = ({ record }: any) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.recordType}>
          <Ionicons 
            name={record.type === 'Doktor Muayenesi' ? 'person' : 'medical'} 
            size={20} 
            color="#007AFF" 
          />
          <Text style={styles.recordTitle}>{record.type}</Text>
        </View>
        <Text style={styles.recordDate}>{record.date}</Text>
      </View>
      <View style={styles.recordContent}>
        <View style={styles.recordDetail}>
          <Text style={styles.recordLabel}>Doktor:</Text>
          <Text style={styles.recordValue}>{record.doctor}</Text>
        </View>
        <View style={styles.recordDetail}>
          <Text style={styles.recordLabel}>Tanı:</Text>
          <Text style={styles.recordValue}>{record.diagnosis}</Text>
        </View>
        {record.weight && (
          <View style={styles.recordDetail}>
            <Text style={styles.recordLabel}>Kilo/Boy:</Text>
            <Text style={styles.recordValue}>{record.weight} / {record.height}</Text>
          </View>
        )}
        <View style={styles.recordDetail}>
          <Text style={styles.recordLabel}>Notlar:</Text>
          <Text style={styles.recordValue}>{record.notes}</Text>
        </View>
      </View>
    </View>
  );

  const HealthTipCard = ({ tip }: any) => (
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
        <Text style={styles.title}>Sağlık Kayıtları</Text>
        <Text style={styles.subtitle}>Bebeğinizin sağlığını takip edin</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'vaccines' && styles.activeTab]}
          onPress={() => setSelectedTab('vaccines')}
        >
          <Ionicons 
            name="medical" 
            size={20} 
            color={selectedTab === 'vaccines' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'vaccines' && styles.activeTabText]}>
            Aşılar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'appointments' && styles.activeTab]}
          onPress={() => setSelectedTab('appointments')}
        >
          <Ionicons 
            name="calendar" 
            size={20} 
            color={selectedTab === 'appointments' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'appointments' && styles.activeTabText]}>
            Randevular
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'records' && styles.activeTab]}
          onPress={() => setSelectedTab('records')}
        >
          <Ionicons 
            name="document-text" 
            size={20} 
            color={selectedTab === 'records' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'records' && styles.activeTabText]}>
            Kayıtlar
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'vaccines' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💉 Aşı Takvimi</Text>
          {currentBaby ? (
            vaccineSchedule.map((vaccine) => (
              <VaccineCard key={vaccine.id} vaccine={vaccine} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="medical" size={48} color="#E9ECEF" />
              <Text style={styles.emptyText}>Önce bebek profili oluşturun</Text>
            </View>
          )}
        </View>
      )}

      {selectedTab === 'appointments' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📅 Doktor Randevuları</Text>
            <TouchableOpacity 
              style={styles.addSmallButton} 
              onPress={handleAddAppointment}
            >
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
          {currentBaby ? (
            appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar" size={48} color="#E9ECEF" />
              <Text style={styles.emptyText}>Önce bebek profili oluşturun</Text>
            </View>
          )}
        </View>
      )}

      {selectedTab === 'records' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Tüm Sağlık Kayıtları</Text>
            <TouchableOpacity 
              style={styles.addSmallButton} 
              onPress={handleAddHealthRecord}
            >
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
          {currentBaby ? (
            healthRecords.length > 0 ? (
              healthRecords.map((record) => (
                <HealthRecordCard key={record.id} record={record} />
              ))
            ) : (
              healthRecordsList.map((record) => (
                <HealthRecordCard key={record.id} record={record} />
              ))
            )
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text" size={48} color="#E9ECEF" />
              <Text style={styles.emptyText}>Önce bebek profili oluşturun</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Sağlık İpuçları</Text>
        {healthTips.map((tip) => (
          <HealthTipCard key={tip.id} tip={tip} />
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Sağlık kayıtlarınızı düzenli olarak tutun ve aşı takvimine sadık kalın. Acil durumlar için 112'yi arayın.
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
    fontSize: 12,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#636E72',
    marginTop: 12,
  },
  vaccineCard: {
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
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  vaccineDate: {
    fontSize: 14,
    color: '#636E72',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vaccineDescription: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 8,
    lineHeight: 20,
  },
  vaccineDetails: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#636E72',
    marginLeft: 4,
  },
  notificationStatus: {
    marginTop: 8,
  },
  reminderIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  reminderText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  markButton: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  markButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#636E72',
  },
  appointmentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appointmentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  appointmentDetails: {
    gap: 6,
  },
  notesSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#636E72',
    fontStyle: 'italic',
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 8,
  },
  recordDate: {
    fontSize: 14,
    color: '#636E72',
  },
  recordContent: {
    gap: 6,
  },
  recordDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordLabel: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  recordValue: {
    fontSize: 14,
    color: '#2D3436',
    flex: 1,
    textAlign: 'right',
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

export default HealthScreen;