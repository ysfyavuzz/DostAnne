import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';
import { useNotifications } from '@/src/hooks/useNotifications';
import { notificationService } from '@/src/services/NotificationService';

const ThemedText = createText();

interface SmartReminder {
  id: string;
  type: 'feeding' | 'sleep' | 'health' | 'activity' | 'custom';
  title: string;
  description: string;
  time: string;
  days: string[];
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
  autoAdjust: boolean; // Akıllı ayar özelliği
}

interface SmartRecommendation {
  id: string;
  category: 'routine' | 'health' | 'development' | 'safety';
  title: string;
  description: string;
  confidence: number; // 0-100 arası güven skoru
  actionable: boolean;
  actions: string[];
}

export default function SmartReminderSystem() {
  const { colors } = useTheme();
  const notifications = useNotifications();
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'reminders' | 'recommendations'>('reminders');
  const [smartMode, setSmartMode] = useState(true);

  useEffect(() => {
    loadSmartReminders();
    generateSmartRecommendations();
  }, []);

  const loadSmartReminders = async () => {
    // Mock data - gerçek uygulamada database'den gelecek
    const mockReminders: SmartReminder[] = [
      {
        id: '1',
        type: 'feeding',
        title: 'Beslenme Zamanı',
        description: 'Bebeği her 3 saatte besleyin',
        time: '09:00',
        days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        enabled: true,
        priority: 'high',
        autoAdjust: true,
      },
      {
        id: '2',
        type: 'sleep',
        title: 'Uyku Rutini',
        description: 'Her gün aynı saatte yatırmaya çalışın',
        time: '20:00',
        days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        enabled: true,
        priority: 'medium',
        autoAdjust: true,
      },
      {
        id: '3',
        type: 'health',
        title: 'İlaç Hatırlatıcısı',
        description: 'D vitamini zamanı',
        time: '10:00',
        days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'],
        enabled: false,
        priority: 'medium',
        autoAdjust: false,
      },
    ];
    
    setReminders(mockReminders);
  };

  const generateSmartRecommendations = async () => {
    // AI-based recommendation generation
    const mockRecommendations: SmartRecommendation[] = [
      {
        id: '1',
        category: 'routine',
        title: 'Beslenme Sıklığı Artırılmalı',
        description: 'Son 3 günde beslenme sıklığı düştü. Artırmayı düşünün.',
        confidence: 85,
        actionable: true,
        actions: ['Beslenme takvimini kontrol et', 'Doktora danış', 'Ek gıda başlatmayı düşün'],
      },
      {
        id: '2',
        category: 'health',
        title: 'Su Tüketimi Artırın',
        description: 'Hava sıcaklığı arttığı için bebek daha fazla su ihtiyaç duyabilir.',
        confidence: 72,
        actionable: true,
        actions: ['Gün içi su teklif et', 'İslak bez kontrolü yap', 'İştah değişikliğini izle'],
      },
      {
        id: '3',
        category: 'development',
        title: 'Yeni Oyuncaklar Deneyin',
        description: 'Bebeğiniz 6 aylık - yeni dokusal oyuncaklar gelişimine yardımcı olabilir.',
        confidence: 65,
        actionable: true,
        actions: ['Farklı dokulu oyuncaklar al', 'Etkileşimli oyunlar oyna', 'Gelişim milestones kontrol et'],
      },
    ];
    
    setRecommendations(mockRecommendations);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const toggleSmartAdjustment = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, autoAdjust: !reminder.autoAdjust } : reminder
    ));
  };

  const scheduleSmartReminder = (reminder: SmartReminder) => {
    Alert.alert(
      'Akıllı Hatırlatıcı',
      `"${reminder.title}" hatırlatıcısı ayarlansın mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ayarla',
          onPress: async () => {
            // Burada gerçek bildirim planlama mantığı
            try {
              const scheduledTime = new Date();
              // Parse time string (e.g., "09:00") and set it
              const [hours, minutes] = reminder.time.split(':').map(Number);
              scheduledTime.setHours(hours, minutes, 0, 0);
              
              // Map reminder type to notification type
              let notificationType: 'feeding' | 'sleep' | 'vaccine' | 'diaper' | 'medical' = 'feeding';
              if (reminder.type === 'sleep') notificationType = 'sleep';
              else if (reminder.type === 'health') notificationType = 'medical';
              
              await notificationService.scheduleNotification({
                id: reminder.id,
                title: reminder.title,
                body: reminder.description,
                scheduledTime: scheduledTime,
                type: notificationType,
              });
              Alert.alert('Başarılı', 'Hatırlatıcı ayarlandı');
            } catch (error) {
              Alert.alert('Hata', 'Hatırlatıcı ayarlanamadı');
            }
          },
        },
      ]
    );
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'feeding': return 'restaurant-outline';
      case 'sleep': return 'moon-outline';
      case 'health': return 'medical-outline';
      case 'activity': return 'bicycle-outline';
      default: return 'notifications-outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA500';
      case 'low': return '#4ECDC4';
      default: return '#ccc';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'routine': return 'repeat-outline';
      case 'health': return 'heart-outline';
      case 'development': return 'brain-outline';
      case 'safety': return 'shield-checkmark-outline';
      default: return 'bulb-outline';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4ECDC4';
    if (confidence >= 60) return '#FFA500';
    return '#FF6B6B';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>🧠 Akıllı Asistan</ThemedText>
        <View style={styles.smartModeToggle}>
          <ThemedText style={styles.smartModeLabel}>Akıllı Mod</ThemedText>
          <Switch
            value={smartMode}
            onValueChange={setSmartMode}
            trackColor={{ false: '#ccc', true: colors.primary }}
          />
        </View>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            { backgroundColor: activeTab === 'reminders' ? colors.primary : 'transparent' },
          ]}
          onPress={() => setActiveTab('reminders')}
        >
          <Ionicons
            name="notifications-outline"
            size={16}
            color={activeTab === 'reminders' ? 'white' : colors.text}
          />
          <ThemedText
            style={[
              styles.tabText,
              { color: activeTab === 'reminders' ? 'white' : colors.text },
            ]}
          >
            Hatırlatıcılar ({reminders.filter(r => r.enabled).length})
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            { backgroundColor: activeTab === 'recommendations' ? colors.primary : 'transparent' },
          ]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Ionicons
            name="bulb-outline"
            size={16}
            color={activeTab === 'recommendations' ? 'white' : colors.text}
          />
          <ThemedText
            style={[
              styles.tabText,
              { color: activeTab === 'recommendations' ? 'white' : colors.text },
            ]}
          >
            Öneriler ({recommendations.length})
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'reminders' ? (
          <View style={styles.remindersContainer}>
            {reminders.map((reminder) => (
              <View
                key={reminder.id}
                style={[styles.reminderCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.reminderHeader}>
                  <View style={styles.reminderHeaderLeft}>
                    <View
                      style={[
                        styles.reminderIconContainer,
                        { backgroundColor: getPriorityColor(reminder.priority) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getReminderIcon(reminder.type) as any}
                        size={20}
                        color={getPriorityColor(reminder.priority)}
                      />
                    </View>
                    <View style={styles.reminderInfo}>
                      <ThemedText style={styles.reminderTitle}>{reminder.title}</ThemedText>
                      <ThemedText style={styles.reminderDescription}>
                        {reminder.description}
                      </ThemedText>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(reminder.priority) },
                    ]}
                  >
                    <ThemedText style={styles.priorityText}>
                      {reminder.priority === 'high' ? 'Yüksek' :
                       reminder.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.reminderDetails}>
                  <View style={styles.reminderSchedule}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <ThemedText style={styles.reminderTime}>{reminder.time}</ThemedText>
                    <ThemedText style={styles.reminderDays}>
                      {reminder.days.join(', ')}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.reminderActions}>
                  <View style={styles.toggleContainer}>
                    <ThemedText style={styles.toggleLabel}>Aktif</ThemedText>
                    <Switch
                      value={reminder.enabled}
                      onValueChange={() => toggleReminder(reminder.id)}
                      trackColor={{ false: '#ccc', true: colors.primary }}
                    />
                  </View>

                  {reminder.enabled && (
                    <View style={styles.toggleContainer}>
                      <ThemedText style={styles.toggleLabel}>Akıllı Ayar</ThemedText>
                      <Switch
                        value={reminder.autoAdjust}
                        onValueChange={() => toggleSmartAdjustment(reminder.id)}
                        trackColor={{ false: '#ccc', true: colors.success }}
                      />
                    </View>
                  )}
                </View>

                {reminder.autoAdjust && (
                  <View style={styles.smartInfo}>
                    <Ionicons name="sparkles-outline" size={14} color={colors.primary} />
                    <ThemedText style={styles.smartInfoText}>
                      Bebeğinizin rutinine göre otomatik ayarlanacak
                    </ThemedText>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.recommendationsContainer}>
            {recommendations.map((recommendation) => (
              <View
                key={recommendation.id}
                style={[styles.recommendationCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationHeaderLeft}>
                    <View
                      style={[
                        styles.recommendationIconContainer,
                        { backgroundColor: getConfidenceColor(recommendation.confidence) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getCategoryIcon(recommendation.category) as any}
                        size={20}
                        color={getConfidenceColor(recommendation.confidence)}
                      />
                    </View>
                    <View style={styles.recommendationInfo}>
                      <ThemedText style={styles.recommendationTitle}>
                        {recommendation.title}
                      </ThemedText>
                      <ThemedText style={styles.recommendationDescription}>
                        {recommendation.description}
                      </ThemedText>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.confidenceBadge,
                      { backgroundColor: getConfidenceColor(recommendation.confidence) },
                    ]}
                  >
                    <ThemedText style={styles.confidenceText}>
                      %{recommendation.confidence}
                    </ThemedText>
                  </View>
                </View>

                {recommendation.actionable && recommendation.actions.length > 0 && (
                  <View style={styles.actionsContainer}>
                    <ThemedText style={styles.actionsTitle}>Önerilen Eylemler:</ThemedText>
                    {recommendation.actions.map((action, index) => (
                      <TouchableOpacity key={index} style={styles.actionItem}>
                        <Ionicons name="checkmark-circle-outline" size={14} color={colors.success} />
                        <ThemedText style={styles.actionText}>{action}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.applyButton}>
                  <Ionicons name="checkmark-outline" size={16} color="white" />
                  <ThemedText style={styles.applyButtonText}>Uygula</ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  smartModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smartModeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  remindersContainer: {
    gap: 16,
  },
  reminderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reminderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  reminderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  reminderDetails: {
    marginBottom: 12,
  },
  reminderSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  reminderDays: {
    fontSize: 12,
    opacity: 0.7,
  },
  reminderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  smartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 8,
  },
  smartInfoText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#4A90E2',
  },
  recommendationsContainer: {
    gap: 16,
  },
  recommendationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  actionsContainer: {
    marginBottom: 12,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  bottomPadding: {
    height: 20,
  },
});