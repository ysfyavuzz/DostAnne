import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateSettings } from '../store/store';

const ProfileScreen = () => {
  const { baby, settings, activities } = useSelector((state: RootState) => state.activities);
  const dispatch = useDispatch<AppDispatch>();

  const handleSettingToggle = (key: keyof typeof settings) => {
    dispatch(updateSettings({ [key]: !settings[key] }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'DostAnne uygulamasından çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => {
          // TODO: Implement logout logic
          console.log('Logout');
        }},
      ]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      'Yedekleme',
      'Verileriniz buluta yedeklensin mi?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Yedekle', onPress: () => {
          // TODO: Implement backup logic
          console.log('Backup started');
        }},
      ]
    );
  };

  const menuItems = [
    {
      id: 'favorites',
      title: 'Favoriler',
      subtitle: 'Kaydedilen aktiviteler ve anılar',
      icon: 'heart',
      color: '#FF6B9D',
      onPress: () => console.log('Favorites'),
    },
    {
      id: 'backup',
      title: 'Yedekleme',
      subtitle: 'Verilerinizi yedekleyin',
      icon: 'cloud-upload',
      color: '#4299E1',
      onPress: handleBackup,
    },
    {
      id: 'export',
      title: 'Verileri Dışa Aktar',
      subtitle: 'PDF olarak indir',
      icon: 'download',
      color: '#48BB78',
      onPress: () => console.log('Export'),
    },
    {
      id: 'help',
      title: 'Yardım',
      subtitle: 'SSS ve destek',
      icon: 'help-circle',
      color: '#ED8936',
      onPress: () => console.log('Help'),
    },
    {
      id: 'about',
      title: 'Hakkında',
      subtitle: 'DostAnne v1.0.0',
      icon: 'information-circle',
      color: '#9F7AEA',
      onPress: () => console.log('About'),
    },
    {
      id: 'privacy',
      title: 'Gizlilik Politikası',
      subtitle: 'Veri güvenliğiniz',
      icon: 'shield-checkmark',
      color: '#38B2AC',
      onPress: () => console.log('Privacy'),
    },
  ];

  const advancedMenuItems = [
    {
      id: 'astronomy',
      title: 'Astronomi & Burçlar',
      subtitle: 'Günlük burç yorumları',
      icon: 'star',
      color: '#667eea',
      onPress: () => console.log('Astronomy'),
    },
    {
      id: 'mother-world',
      title: 'Anne Dünyası',
      subtitle: 'Anı defteri ve adet takibi',
      icon: 'flower',
      color: '#FF6B9D',
      onPress: () => console.log('Mother World'),
    },
    {
      id: 'planner',
      title: 'Planlayıcı',
      subtitle: 'Rutin ve beslenme planları',
      icon: 'calendar',
      color: '#9F7AEA',
      onPress: () => console.log('Planner'),
    },
    {
      id: 'health-center',
      title: 'Sağlık Merkezi',
      subtitle: 'Gelişim takibi ve aşılar',
      icon: 'medkit',
      color: '#48BB78',
      onPress: () => console.log('Health Center'),
    },
    {
      id: 'budget',
      title: 'Bütçe & Fırsatlar',
      subtitle: 'Masraf takibi ve indirimler',
      icon: 'wallet',
      color: '#ED8936',
      onPress: () => console.log('Budget'),
    },
    {
      id: 'shopping',
      title: 'Alışveriş Asistanı',
      subtitle: 'Ürün önerileri ve fiyatlar',
      icon: 'cart',
      color: '#4299E1',
      onPress: () => console.log('Shopping'),
    },
    {
      id: 'emergency',
      title: 'Acil Durumlar',
      subtitle: '112 ve ilk yardım bilgileri',
      icon: 'alert',
      color: '#DC3545',
      onPress: () => console.log('Emergency'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Merhaba Anne! 👋</Text>
            <Text style={styles.profileSubtitle}>
              {baby ? `${baby.name} için takip ediyorsunuz` : 'Bebek bilgisi ekleyin'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create" size={20} color="#FF6B9D" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{activities.length}</Text>
          <Text style={styles.statLabel}>Aktivite</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{baby ? getBabyAge(baby.birthDate) : '-'}</Text>
          <Text style={styles.statLabel}>Yaş</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>Özellik</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ayarlar</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={20} color="#667eea" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Karanlık Mod</Text>
              <Text style={styles.settingSubtitle}>Göz yorgunluğunu azaltır</Text>
            </View>
          </View>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={(value) => {
              dispatch(updateSettings({ theme: value ? 'dark' : 'light' }));
            }}
            trackColor={{ false: '#E2E8F0', true: '#FFB6C1' }}
            thumbColor={settings.theme === 'dark' ? '#FF6B9D' : '#F7FAFC'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={20} color="#667eea" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Bildirimler</Text>
              <Text style={styles.settingSubtitle}>Hatırlatıcılar ve uyarılar</Text>
            </View>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => handleSettingToggle('notifications')}
            trackColor={{ false: '#E2E8F0', true: '#FFB6C1' }}
            thumbColor={settings.notifications ? '#FF6B9D' : '#F7FAFC'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="language" size={20} color="#667eea" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dil</Text>
              <Text style={styles.settingSubtitle}>Türkçe</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
        </TouchableOpacity>
      </View>

      {/* Advanced Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gelişmiş Özellikler</Text>
        
        {advancedMenuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diğer</Text>
        
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#DC3545" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>DostAnne v1.0.0</Text>
        <Text style={styles.footerSubtext}>Harikasın anne! 💕</Text>
      </View>
    </ScrollView>
  );
};

// Helper function to calculate baby age
const getBabyAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} gün`;
  const months = Math.floor(diffDays / 30);
  return `${months} ay`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6B9D',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 15,
  },
  section: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 5,
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
    margin: 15,
    marginBottom: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC3545',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
  },
  footerSubtext: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginTop: 5,
  },
});

export default ProfileScreen;