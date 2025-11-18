import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AppHeader } from '../components/ui/AppHeader';

type ThemeMode = 'light' | 'dark' | 'auto';
type AccentColor = 'pink' | 'blue' | 'green' | 'purple' | 'orange';

const ProfileScreenNew = () => {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useThemedStyles();
  const systemColorScheme = useColorScheme();
  
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [accentColor, setAccentColor] = useState<AccentColor>('pink');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const accentColors = [
    { id: 'pink', color: colors.primary[500], gradient: colors.gradients.primary },
    { id: 'blue', color: colors.secondary[500], gradient: colors.gradients.secondary },
    { id: 'green', color: colors.success[500], gradient: colors.gradients.success },
    { id: 'purple', color: '#A855F7', gradient: colors.gradients.purple },
    { id: 'orange', color: colors.warning[500], gradient: colors.gradients.sunset },
  ];

  const calculateAge = useCallback(() => {
    if (!currentBaby) return '';
    const birthDate = new Date(currentBaby.birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} günlük`;
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return `${months} ay ${days} günlük`;
  }, [currentBaby]);

  const handleThemeChange = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem('themeMode', mode);
    // Note: Actual theme change would require app restart or state management
    Alert.alert('Tema Değiştirildi', 'Yeni tema ayarı uygulandı');
  };

  const handleAccentColorChange = async (colorId: AccentColor) => {
    setAccentColor(colorId);
    await AsyncStorage.setItem('accentColor', colorId);
    Alert.alert('Renk Değiştirildi', 'Yeni renk ayarı uygulandı');
  };

  const handleExportData = () => {
    Alert.alert(
      'Veri Dışa Aktar',
      'Hangi formatta dışa aktarmak istersiniz?',
      [
        { text: 'PDF', onPress: () => Alert.alert('PDF', 'PDF export yakında...') },
        { text: 'Excel', onPress: () => Alert.alert('Excel', 'Excel export yakında...') },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => {
            // Clear data and redirect to onboarding
            Alert.alert('Çıkış yapıldı');
          }
        },
      ]
    );
  };

  const stylesObj = styles(colors, typography, spacing, borderRadius, shadows, isDark);

  return (
    <SafeAreaView style={stylesObj.safeArea} edges={['bottom']}>
      <AppHeader title="Profil" />
      <ScrollView style={stylesObj.container}>
      {/* Baby Profile Card */}
      {currentBaby && (
        <View style={stylesObj.profileSection}>
          <LinearGradient
            colors={colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={stylesObj.profileCard}
          >
            <View style={stylesObj.avatarContainer}>
              {currentBaby.photo ? (
                <Image source={{ uri: currentBaby.photo }} style={stylesObj.avatar} />
              ) : (
                <View style={stylesObj.avatarPlaceholder}>
                  <Ionicons name="person" size={48} color="white" />
                </View>
              )}
              <TouchableOpacity style={stylesObj.editAvatarButton}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={stylesObj.profileInfo}>
              <Text style={stylesObj.babyName}>{currentBaby.name}</Text>
              <Text style={stylesObj.babyAge}>
                {currentBaby.gender === 'male' ? '👦' : '👧'} {calculateAge()}
              </Text>
              <View style={stylesObj.statsRow}>
                <View style={stylesObj.statItem}>
                  <Text style={stylesObj.statValue}>{currentBaby.weight} kg</Text>
                  <Text style={stylesObj.statLabel}>Kilo</Text>
                </View>
                <View style={stylesObj.statDivider} />
                <View style={stylesObj.statItem}>
                  <Text style={stylesObj.statValue}>{currentBaby.height} cm</Text>
                  <Text style={stylesObj.statLabel}>Boy</Text>
                </View>
                {currentBaby.bloodType && (
                  <>
                    <View style={stylesObj.statDivider} />
                    <View style={stylesObj.statItem}>
                      <Text style={stylesObj.statValue}>{currentBaby.bloodType}</Text>
                      <Text style={stylesObj.statLabel}>Kan Grubu</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Theme Settings */}
      <View style={stylesObj.section}>
        <Text style={stylesObj.sectionTitle}>🎨 Tema Ayarları</Text>
        <View style={stylesObj.card}>
          <TouchableOpacity
            style={[stylesObj.themeOption, themeMode === 'light' && stylesObj.themeOptionActive]}
            onPress={() => handleThemeChange('light')}
          >
            <Ionicons 
              name="sunny" 
              size={24} 
              color={themeMode === 'light' ? colors.primary[500] : colors.neutral[500]} 
            />
            <Text style={[stylesObj.themeOptionText, themeMode === 'light' && stylesObj.themeOptionTextActive]}>
              Açık Tema
            </Text>
            {themeMode === 'light' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[stylesObj.themeOption, themeMode === 'dark' && stylesObj.themeOptionActive]}
            onPress={() => handleThemeChange('dark')}
          >
            <Ionicons 
              name="moon" 
              size={24} 
              color={themeMode === 'dark' ? colors.primary[500] : colors.neutral[500]} 
            />
            <Text style={[stylesObj.themeOptionText, themeMode === 'dark' && stylesObj.themeOptionTextActive]}>
              Koyu Tema
            </Text>
            {themeMode === 'dark' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[stylesObj.themeOption, themeMode === 'auto' && stylesObj.themeOptionActive]}
            onPress={() => handleThemeChange('auto')}
          >
            <Ionicons 
              name="phone-portrait" 
              size={24} 
              color={themeMode === 'auto' ? colors.primary[500] : colors.neutral[500]} 
            />
            <Text style={[stylesObj.themeOptionText, themeMode === 'auto' && stylesObj.themeOptionTextActive]}>
              Otomatik
            </Text>
            {themeMode === 'auto' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Accent Color */}
      <View style={stylesObj.section}>
        <Text style={stylesObj.sectionTitle}>🎨 Ana Renk</Text>
        <View style={stylesObj.card}>
          <View style={stylesObj.colorGrid}>
            {accentColors.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={stylesObj.colorOption}
                onPress={() => handleAccentColorChange(item.id as AccentColor)}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    stylesObj.colorCircle,
                    accentColor === item.id && stylesObj.colorCircleActive
                  ]}
                >
                  {accentColor === item.id && (
                    <Ionicons name="checkmark" size={24} color="white" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={stylesObj.section}>
        <Text style={stylesObj.sectionTitle}>⚙️ Ayarlar</Text>
        <View style={stylesObj.card}>
          <View style={stylesObj.settingItem}>
            <View style={stylesObj.settingLeft}>
              <Ionicons name="notifications" size={24} color={colors.primary[500]} />
              <Text style={stylesObj.settingText}>Bildirimler</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
              thumbColor={notificationsEnabled ? colors.primary[500] : colors.neutral[100]}
            />
          </View>

          <TouchableOpacity style={stylesObj.settingItem}>
            <View style={stylesObj.settingLeft}>
              <Ionicons name="language" size={24} color={colors.secondary[500]} />
              <Text style={stylesObj.settingText}>Dil</Text>
            </View>
            <View style={stylesObj.settingRight}>
              <Text style={stylesObj.settingValue}>Türkçe</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={stylesObj.settingItem}>
            <View style={stylesObj.settingLeft}>
              <Ionicons name="person" size={24} color={colors.success[500]} />
              <Text style={stylesObj.settingText}>Bebek Profilini Düzenle</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={stylesObj.settingItem} onPress={handleExportData}>
            <View style={stylesObj.settingLeft}>
              <Ionicons name="download" size={24} color={colors.warning[500]} />
              <Text style={stylesObj.settingText}>Veri Dışa Aktar</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={stylesObj.settingItem}>
            <View style={stylesObj.settingLeft}>
              <Ionicons name="information-circle" size={24} color={colors.neutral[500]} />
              <Text style={stylesObj.settingText}>Hakkında</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout */}
      <View style={stylesObj.section}>
        <TouchableOpacity style={stylesObj.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={colors.error[500]} />
          <Text style={stylesObj.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={stylesObj.appInfo}>
        <Text style={stylesObj.appInfoText}>DostAnne v1.1.0</Text>
        <Text style={stylesObj.appInfoText}>© 2024 DostAnne Team</Text>
      </View>

      <View style={{ height: spacing['4xl'] }} />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = (colors: any, typography: any, spacing: any, borderRadius: any, shadows: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? colors.background.dark : colors.background.light,
  },
  container: {
    flex: 1,
  },
  profileSection: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  profileCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    alignItems: 'center',
    ...shadows.lg,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    alignItems: 'center',
  },
  babyName: {
    ...typography.h2,
    color: 'white',
    marginBottom: spacing.xs,
  },
  babyAge: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  statValue: {
    ...typography.h4,
    color: 'white',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.sm,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  themeOptionActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  themeOptionText: {
    ...typography.labelLarge,
    color: colors.text.secondary,
    flex: 1,
    marginLeft: spacing.md,
  },
  themeOptionTextActive: {
    color: colors.primary[500],
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  colorOption: {
    padding: spacing.xs,
  },
  colorCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: colors.neutral[800],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    ...typography.body,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.error[500],
  },
  logoutText: {
    ...typography.button,
    color: colors.error[500],
    marginLeft: spacing.sm,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  appInfoText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
});

export default React.memo(ProfileScreenNew);
