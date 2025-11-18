import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GrowthChartComponent from '../components/charts/GrowthChartComponent';

const DevelopmentScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bebek Gelişimi</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Weight Growth Chart */}
      <GrowthChartComponent
        title="Kilo Gelişimi"
        type="weight"
      />

      {/* Height Growth Chart */}
      <GrowthChartComponent
        title="Boy Gelişimi"
        type="height"
      />

      {/* Combined Growth Chart */}
      <GrowthChartComponent
        title="Kombine Büyüme Grafiği"
        type="both"
      />

      {/* Milestones */}
      <View style={styles.milestonesContainer}>
        <Text style={styles.sectionTitle}>Gelişim Aşamaları</Text>
        
        <View style={styles.milestoneItem}>
          <View style={styles.milestoneIcon}>
            <Ionicons name="checkmark-circle" size={20} color="#48BB78" />
          </View>
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>Başını tutabilir</Text>
            <Text style={styles.milestoneDate}>2 ayda tamamlandı</Text>
          </View>
        </View>

        <View style={styles.milestoneItem}>
          <View style={styles.milestoneIcon}>
            <Ionicons name="checkmark-circle" size={20} color="#48BB78" />
          </View>
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>Yüzüstü dönebilir</Text>
            <Text style={styles.milestoneDate}>3 ayda tamamlandı</Text>
          </View>
        </View>

        <View style={styles.milestoneItem}>
          <View style={styles.milestoneIcon}>
            <Ionicons name="time" size={20} color="#F6AD55" />
          </View>
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>Oturma denemesi</Text>
            <Text style={styles.milestoneDate}>Devam ediyor</Text>
          </View>
        </View>

        <View style={styles.milestoneItem}>
          <View style={styles.milestoneIcon}>
            <Ionicons name="radio-button-off" size={20} color="#CBD5E0" />
          </View>
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>Emekleme</Text>
            <Text style={styles.milestoneDate}>Bekleniyor</Text>
          </View>
        </View>
      </View>

      {/* Development Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Gelişim İpuçları</Text>
        
        <View style={styles.tipItem}>
          <View style={[styles.tipIcon, { backgroundColor: '#FFF0F5' }]}>
            <Ionicons name="bulb" size={16} color="#FF6B9D" />
          </View>
          <Text style={styles.tipText}>
            Bebeğinizin karın üstü zamanını artırarak baş ve boyun kaslarını güçlendirin.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <View style={[styles.tipIcon, { backgroundColor: '#E6FFFA' }]}>
            <Ionicons name="eye" size={16} color="#48BB78" />
          </View>
          <Text style={styles.tipText}>
            Parlak renkli oyuncaklar ve aynalarla görsel uyarımı artırın.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <View style={[styles.tipIcon, { backgroundColor: '#F0E6FF' }]}>
            <Ionicons name="musical-notes" size={16} color="#9F7AEA" />
          </View>
          <Text style={styles.tipText}>
            Müzik ve konuşma ile dil gelişimini destekleyin.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <View style={[styles.tipIcon, { backgroundColor: '#FEF5E7' }]}>
            <Ionicons name="body" size={16} color="#F6AD55" />
          </View>
          <Text style={styles.tipText}>
            Hafif masajlar ile kas gelişimini ve bağ kurmayı teşvik edin.
          </Text>
        </View>
      </View>

      {/* Development Assessment */}
      <View style={styles.assessmentContainer}>
        <Text style={styles.sectionTitle}>Gelişim Değerlendirmesi</Text>
        
        <View style={styles.assessmentCard}>
          <View style={styles.assessmentHeader}>
            <Ionicons name="analytics" size={20} color="#4299E1" />
            <Text style={styles.assessmentTitle}>Motor Gelişim</Text>
          </View>
          <View style={styles.assessmentBar}>
            <View style={[styles.assessmentProgress, { width: '75%' }]} />
          </View>
          <Text style={styles.assessmentText}>Yaşına uygun gelişim gösteriyor</Text>
        </View>

        <View style={styles.assessmentCard}>
          <View style={styles.assessmentHeader}>
            <Ionicons name="chatbubble" size={20} color="#9F7AEA" />
            <Text style={styles.assessmentTitle}>Dil Gelişimi</Text>
          </View>
          <View style={styles.assessmentBar}>
            <View style={[styles.assessmentProgress, { width: '60%' }]} />
          </View>
          <Text style={styles.assessmentText}>Ses çıkarma ve gülümseme gelişiyor</Text>
        </View>

        <View style={styles.assessmentCard}>
          <View style={styles.assessmentHeader}>
            <Ionicons name="people" size={20} color="#48BB78" />
            <Text style={styles.assessmentTitle}>Sosyal Gelişim</Text>
          </View>
          <View style={styles.assessmentBar}>
            <View style={[styles.assessmentProgress, { width: '80%' }]} />
          </View>
          <Text style={styles.assessmentText}>İletişim kurma becerileri güçlü</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6B9D',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestonesContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  milestoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  milestoneDate: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  tipsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
  },
  assessmentContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 40,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assessmentCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
  },
  assessmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  assessmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  assessmentBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 8,
  },
  assessmentProgress: {
    height: '100%',
    backgroundColor: '#4299E1',
    borderRadius: 4,
  },
  assessmentText: {
    fontSize: 12,
    color: '#718096',
  },
});

export default DevelopmentScreen;