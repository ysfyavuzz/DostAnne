import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';
import { createView } from '@/src/components/ThemedView';
import { useNotifications } from '@/src/hooks/useNotifications';
import DateTimePicker from '@react-native-community/datetimepicker';

const ThemedText = createText();
const ThemedView = createView();

interface NotificationSettings {
  feeding: {
    enabled: boolean;
    interval: number;
    startTime: string;
    endTime: string;
  };
  sleep: {
    enabled: boolean;
    bedtime: string;
  };
  health: {
    enabled: boolean;
    vaccines: boolean;
    checkups: boolean;
  };
  development: {
    enabled: boolean;
    milestones: boolean;
    tips: boolean;
  };
  emergency: {
    enabled: boolean;
    urgent: boolean;
  };
}

export default function NotificationSettingsScreenFixed() {
  const { colors } = useTheme();
  const { requestPermissions, checkPermissions } = useNotifications();
  
  const [settings, setSettings] = useState<NotificationSettings>({
    feeding: {
      enabled: true,
      interval: 3,
      startTime: '08:00',
      endTime: '22:00',
    },
    sleep: {
      enabled: true,
      bedtime: '20:00',
    },
    health: {
      enabled: true,
      vaccines: true,
      checkups: true,
    },
    development: {
      enabled: true,
      milestones: true,
      tips: true,
    },
    emergency: {
      enabled: true,
      urgent: true,
    },
  });

  const [hasPermission, setHasPermission] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerConfig, setTimePickerConfig] = useState<{
    type: string;
    field: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    checkNotificationPermissions();
    loadSettings();
  }, []);

  const checkNotificationPermissions = async () => {
    const permission = await checkPermissions();
    setHasPermission(permission);
  };

  const requestNotificationPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      setHasPermission(true);
      Alert.alert('Başarılı', 'Bildirim izinleri verildi');
    } else {
      Alert.alert('Hata', 'Bildirim izinleri verilmedi');
    }
  };

  const loadSettings = () => {
    // Burada gerçek settings yükleme mantığı olacak
    // Şimdilik default değerleri kullanıyoruz
  };

  const saveSettings = () => {
    // Burada gerçek settings kaydetme mantığı olacak
    Alert.alert('Başarılı', 'Bildirim ayarları kaydedildi');
  };

  const updateSetting = (category: keyof NotificationSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    
    if (selectedDate && timePickerConfig) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      updateSetting(
        timePickerConfig.type as keyof NotificationSettings,
        timePickerConfig.field,
        timeString
      );
    }
    
    setTimePickerConfig(null);
  };

  const showTimePickerModal = (type: keyof NotificationSettings, field: string, currentValue: string) => {
    const [hours, minutes] = currentValue.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    
    setTimePickerConfig({ type, field, value: currentValue });
    setShowTimePicker(true);
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange,
    type = 'switch'
  }: {
    title: string;
    subtitle?: string;
    value: any;
    onValueChange: (value: any) => void;
    type?: 'switch' | 'time' | 'number';
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
        )}
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#ccc', true: colors.primary }}
        />
      )}
      {type === 'time' && (
        <TouchableOpacity
          style={[styles.timeButton, { backgroundColor: colors.card }]}
          onPress={() => {
            const category = Object.keys(settings).find(key => 
              Object.values(settings[key as keyof NotificationSettings]).includes(value)
            ) as keyof NotificationSettings;
            const field = Object.keys(settings[category]).find(key => 
              settings[category][key as keyof typeof settings[typeof category]] === value
            );
            if (field) {
              showTimePickerModal(category, field, value);
            }
          }}
        >
          <ThemedText style={styles.timeButtonText}>{value}</ThemedText>
        </TouchableOpacity>
      )}
      {type === 'number' && (
        <View style={styles.numberInput}>
          <TextInput
            style={[styles.numberInputText, { color: colors.text }]}
            value={value.toString()}
            onChangeText={(text) => onValueChange(parseInt(text) || 0)}
            keyboardType="numeric"
            textAlign="center"
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Bildirim Ayarları</ThemedText>
      </View>

      {!hasPermission ? (
        <View style={[styles.permissionCard, { backgroundColor: colors.card }]}>
          <Ionicons name="notifications-off-outline" size={48} color={colors.primary} />
          <ThemedText style={styles.permissionTitle}>
            Bildirim İzni Gerekli
          </ThemedText>
          <ThemedText style={styles.permissionSubtitle}>
            Bildirimleri alabilmek için izin vermeniz gerekiyor
          </ThemedText>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={requestNotificationPermissions}
          >
            <ThemedText style={styles.permissionButtonText}>İzin Ver</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Beslenme Bildirimleri */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
              <ThemedText style={styles.sectionTitle}>Beslenme Hatırlatıcıları</ThemedText>
            </View>
            
            <SettingRow
              title="Beslenme Bildirimleri"
              subtitle="Beslenme zamanlarında hatırlat"
              value={settings.feeding.enabled}
              onValueChange={(value) => updateSetting('feeding', 'enabled', value)}
            />
            
            {settings.feeding.enabled && (
              <>
                <SettingRow
                  title="Hatırlatma Aralığı"
                  subtitle="Saat cinsinden aralık"
                  value={settings.feeding.interval}
                  onValueChange={(value) => updateSetting('feeding', 'interval', value)}
                  type="number"
                />
                
                <SettingRow
                  title="Başlangıç Saati"
                  subtitle="Gündüz bildirimleri başlangıcı"
                  value={settings.feeding.startTime}
                  onValueChange={() => showTimePickerModal('feeding', 'startTime', settings.feeding.startTime)}
                  type="time"
                />
                
                <SettingRow
                  title="Bitiş Saati"
                  subtitle="Gündüz bildirimleri sonu"
                  value={settings.feeding.endTime}
                  onValueChange={() => showTimePickerModal('feeding', 'endTime', settings.feeding.endTime)}
                  type="time"
                />
              </>
            )}
          </View>

          {/* Uyku Bildirimleri */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="moon-outline" size={20} color={colors.primary} />
              <ThemedText style={styles.sectionTitle}>Uyku Hatırlatıcıları</ThemedText>
            </View>
            
            <SettingRow
              title="Uyku Bildirimleri"
              subtitle="Uyku zamanlarında hatırlat"
              value={settings.sleep.enabled}
              onValueChange={(value) => updateSetting('sleep', 'enabled', value)}
            />
            
            {settings.sleep.enabled && (
              <SettingRow
                title="Yatma Zamanı"
                subtitle="Her gece yatma hatırlatıcısı"
                value={settings.sleep.bedtime}
                onValueChange={() => showTimePickerModal('sleep', 'bedtime', settings.sleep.bedtime)}
                type="time"
              />
            )}
          </View>

          {/* Sağlık Bildirimleri */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart-outline" size={20} color={colors.primary} />
              <ThemedText style={styles.sectionTitle}>Sağlık Hatırlatıcıları</ThemedText>
            </View>
            
            <SettingRow
              title="Sağlık Bildirimleri"
              subtitle="Sağlık kontrolleri ve hatırlatıcılar"
              value={settings.health.enabled}
              onValueChange={(value) => updateSetting('health', 'enabled', value)}
            />
            
            {settings.health.enabled && (
              <>
                <SettingRow
                  title="Aşı Hatırlatıcıları"
                  subtitle="Aşı takvimi hatırlatmaları"
                  value={settings.health.vaccines}
                  onValueChange={(value) => updateSetting('health', 'vaccines', value)}
                />
                
                <SettingRow
                  title="Kontrol Hatırlatıcıları"
                  subtitle="Doktor kontrolleri hatırlatmaları"
                  value={settings.health.checkups}
                  onValueChange={(value) => updateSetting('health', 'checkups', value)}
                />
              </>
            )}
          </View>

          {/* Gelişim Bildirimleri */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trending-up-outline" size={20} color={colors.primary} />
              <ThemedText style={styles.sectionTitle}>Gelişim Hatırlatıcıları</ThemedText>
            </View>
            
            <SettingRow
              title="Gelişim Bildirimleri"
              subtitle="Gelişim takibi ve ipuçları"
              value={settings.development.enabled}
              onValueChange={(value) => updateSetting('development', 'enabled', value)}
            />
            
            {settings.development.enabled && (
              <>
                <SettingRow
                  title="Gelişim Kilometre Taşları"
                  subtitle="Bebek gelişim kilometre taşları"
                  value={settings.development.milestones}
                  onValueChange={(value) => updateSetting('development', 'milestones', value)}
                />
                
                <SettingRow
                  title="Ebeveyn İpuçları"
                  subtitle="Ebeveynlik ipuçları ve öneriler"
                  value={settings.development.tips}
                  onValueChange={(value) => updateSetting('development', 'tips', value)}
                />
              </>
            )}
          </View>

          {/* Acil Durum Bildirimleri */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning-outline" size={20} color="#FF6B6B" />
              <ThemedText style={styles.sectionTitle}>Acil Durum Bildirimleri</ThemedText>
            </View>
            
            <SettingRow
              title="Acil Durum Bildirimleri"
              subtitle="Acil durum uyarıları"
              value={settings.emergency.enabled}
              onValueChange={(value) => updateSetting('emergency', 'enabled', value)}
            />
            
            {settings.emergency.enabled && (
              <SettingRow
                title="Acil Bildirimler"
                subtitle="Sadece acil durum bildirimleri"
                value={settings.emergency.urgent}
                onValueChange={(value) => updateSetting('emergency', 'urgent', value)}
              />
            )}
          </View>

          {/* Kaydet Butonu */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={saveSettings}
          >
            <ThemedText style={styles.saveButtonText}>Ayarları Kaydet</ThemedText>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}

      {/* Zaman Seçici */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  permissionCard: {
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    margin: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  permissionButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  timeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  numberInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
  },
  numberInputText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});