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
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EmergencyScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const emergencyContacts = [
    {
      id: 1,
      title: '112 Acil Çağrı Merkezi',
      phone: '112',
      description: 'Tüm acil durumlar için',
      icon: 'call',
      color: '#FF3B30',
    },
    {
      id: 2,
      title: '112 Ambulans',
      phone: '112',
      description: 'Medikal acil durumlar',
      icon: 'medkit',
      color: '#FF9500',
    },
    {
      id: 3,
      title: '112 Yangın',
      phone: '112',
      description: 'Yangın ve kurtarma',
      icon: 'flame',
      color: '#FF3B30',
    },
    {
      id: 4,
      title: '112 Polis',
      phone: '112',
      description: 'Güvenlik ve asayiş',
      icon: 'shield',
      color: '#007AFF',
    },
    {
      id: 5,
      title: 'Alo 183 Sosyal Destek',
      phone: '183',
      description: 'Sosyal Yardım ve Destek',
      icon: 'people',
      color: '#34C759',
    },
  ];

  const babyEmergencies = [
    {
      id: 1,
      title: 'Yüksek Ateş',
      temperature: '38°C ve üzeri',
      action: 'Hemen doktora başvurun',
      icon: 'thermometer',
      color: '#FF3B30',
    },
    {
      id: 2,
      title: 'Nefes Darlığı',
      description: 'Hızlı veya zorlu nefes alma',
      action: 'Ambulans çağırın (112)',
      icon: 'lungs',
      color: '#FF3B30',
    },
    {
      id: 3,
      title: 'Sürekli Ağlama',
      description: 'Normalden farklı, can sıkıcı ağlama',
      action: 'Doktora danışın',
      icon: 'sad',
      color: '#FF9500',
    },
    {
      id: 4,
      title: 'Bilinç Kaybı',
      description: 'Bayılma veya tepkisizlik',
      action: 'Acil ambulans çağırın (112)',
      icon: 'alert-circle',
      color: '#FF3B30',
    },
    {
      id: 5,
      title: 'Kusma/İshal',
      description: 'Sürekli kusma veya kanlı dışkı',
      action: 'Hemen doktora başvurun',
      icon: 'warning',
      color: '#FF9500',
    },
  ];

  const firstAidSteps = [
    {
      id: 1,
      title: 'Bebek Bezi Pişiği',
      steps: [
        'Bebeği sık sık kontrol et',
        'Bezi sık sık değiştir',
        'Bölgeyi temiz ve kuru tut',
        'Koruyici krem sür',
      ],
      icon: 'water',
    },
    {
      id: 2,
      title: 'Hafif Ateş Düşürme',
      steps: [
        'Ilık duş aldırın',
        'Hafif giysiler giydirin',
        'Sıvı takviyesi yapın',
        'Doktora danışın',
      ],
      icon: 'thermometer',
    },
    {
      id: 3,
      title: 'Hıçkırık Geçirme',
      steps: [
        'Bebeği emzirin',
        'Su içirin',
        'Gazını çıkarın',
        'Sakinleştirin',
      ],
      icon: 'happy',
    },
  ];

  const handleEmergencyCall = (phone: string) => {
    Alert.alert(
      'Acil Durum Çağrısı',
      `${phone} numarasını aramak istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Ara',
          onPress: () => {
            // In a real app, this would make a phone call
            Alert.alert('Bilgi', 'Telefon arama özelliği geliştiriliyor');
          },
        },
      ]
    );
  };

  const EmergencyContactCard = ({ contact }: any) => (
    <TouchableOpacity
      style={[styles.emergencyCard, { backgroundColor: contact.color }]}
      onPress={() => handleEmergencyCall(contact.phone)}
    >
      <View style={styles.cardHeader}>
        <Ionicons name={contact.icon as any} size={24} color="white" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{contact.title}</Text>
          <Text style={styles.cardDescription}>{contact.description}</Text>
        </View>
        <Ionicons name="call" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );

  const BabyEmergencyCard = ({ emergency }: any) => (
    <View style={styles.babyEmergencyCard}>
      <View style={styles.cardHeader}>
        <Ionicons 
          name={emergency.icon as any} 
          size={24} 
          color={emergency.color} 
        />
        <View style={styles.cardText}>
          <Text style={styles.babyEmergencyTitle}>{emergency.title}</Text>
          {emergency.temperature && (
            <Text style={styles.emergencyInfo}>{emergency.temperature}</Text>
          )}
          {emergency.description && (
            <Text style={styles.emergencyInfo}>{emergency.description}</Text>
          )}
        </View>
      </View>
      <View style={styles.actionSection}>
        <Text style={styles.actionText}>{emergency.action}</Text>
      </View>
    </View>
  );

  const FirstAidCard = ({ aid }: any) => (
    <View style={styles.firstAidCard}>
      <View style={styles.firstAidHeader}>
        <Ionicons name={aid.icon as any} size={24} color="#34C759" />
        <Text style={styles.firstAidTitle}>{aid.title}</Text>
      </View>
      <View style={styles.stepsContainer}>
        {aid.steps.map((step: string, index: number) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Acil Durumlar</Text>
        <Text style={styles.subtitle}>Anne ve Bebek Güvenliği</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Acil İletişim Numaraları</Text>
        {emergencyContacts.map((contact) => (
          <EmergencyContactCard key={contact.id} contact={contact} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👶 Bebek Acil Durumları</Text>
        {babyEmergencies.map((emergency) => (
          <BabyEmergencyCard key={emergency.id} emergency={emergency} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏥 İlk Yardım Bilgileri</Text>
        {firstAidSteps.map((aid) => (
          <FirstAidCard key={aid.id} aid={aid} />
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Bu bilgiler acil durum yönlendirmesi içindir. Her durumda sağlık profesyoneline başvurun.
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
  },
  emergencyCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  babyEmergencyCard: {
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
  babyEmergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  emergencyInfo: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 2,
  },
  actionSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  firstAidCard: {
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
  firstAidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  firstAidTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 8,
  },
  stepsContainer: {
    paddingLeft: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
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

export default EmergencyScreen;