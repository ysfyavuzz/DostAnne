import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeType, AccentColor } from '@/src/hooks/useTheme';

const ThemedText = Text;

interface ThemeSettingsComponentProps {
  visible: boolean;
  onClose: () => void;
}

export default function ThemeSettingsComponent({
  visible,
  onClose,
}: ThemeSettingsComponentProps) {
  const {
    colors,
    themeType,
    accentColor,
    updateTheme,
    updateAccent,
    isDark,
    isSystemDark,
  } = useTheme();

  const themes: { type: ThemeType; label: string; description: string; icon: string }[] = [
    {
      type: 'light',
      label: 'Açık Tema',
      description: 'Gündüz kullanımı için parlak tema',
      icon: 'sunny-outline',
    },
    {
      type: 'dark',
      label: 'Koyu Tema',
      description: 'Gece kullanımı için karanlık tema',
      icon: 'moon-outline',
    },
    {
      type: 'auto',
      label: 'Otomatik',
      description: `Sistem ayarını takip eder(${isSystemDark ? 'Koyu' : 'Açık'})`,
      icon: 'settings-outline',
    },
  ];

  const accentColors: { color: AccentColor; label: string; preview: string }[] = [
    { color: 'blue', label: 'Mavi', preview: '#4A90E2' },
    { color: 'green', label: 'Yeşil', preview: '#34C759' },
    { color: 'purple', label: 'Mor', preview: '#AF52DE' },
    { color: 'pink', label: 'Pembe', preview: '#FF2D92' },
    { color: 'orange', label: 'Turuncu', preview: '#FF9500' },
  ];

  const getThemeIcon = (type: ThemeType, isActive: boolean) => {
    const icon = themes.find(t => t.type === type)?.icon || 'settings-outline';
    return (
      <Ionicons
        name={icon as any}
        size={20}
        color={isActive ? colors.text : colors.textSecondary}
      />
    );
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Tema Ayarları</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selection */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>Tema Modu</ThemedText>
          <View style={styles.themeOptions}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.type}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: themeType === theme.type ? colors.primary : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => updateTheme(theme.type)}
              >
                {getThemeIcon(theme.type, themeType === theme.type)}
                <View style={styles.themeOptionContent}>
                  <ThemedText
                    style={[
                      styles.themeOptionLabel,
                      {
                        color: themeType === theme.type ? 'white' : colors.text,
                      },
                    ]}
                  >
                    {theme.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.themeOptionDescription,
                      {
                        color: themeType === theme.type ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
                      },
                    ]}
                  >
                    {theme.description}
                  </ThemedText>
                </View>
                {themeType === theme.type && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Accent Color Selection */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>Ana Renk</ThemedText>
          <View style={styles.colorGrid}>
            {accentColors.map((color) => (
              <TouchableOpacity
                key={color.color}
                style={[
                  styles.colorOption,
                  {
                    borderColor: accentColor === color.color ? color.preview : colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                onPress={() => updateAccent(color.color)}
              >
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: color.preview },
                  ]}
                />
                <ThemedText style={styles.colorLabel}>{color.label}</ThemedText>
                {accentColor === color.color && (
                  <View style={[styles.selectedIndicator, { backgroundColor: color.preview }]}>
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>Önizleme</ThemedText>
          <View style={styles.previewContainer}>
            {/* Header Preview */}
            <View style={[styles.previewHeader, { backgroundColor: colors.header }]}>
              <ThemedText style={styles.previewHeaderText}>DostAnne</ThemedText>
              <View style={styles.previewHeaderIcons}>
                <View style={[styles.previewIcon, { backgroundColor: colors.primary }]} />
                <View style={[styles.previewIcon, { backgroundColor: colors.primary }]} />
              </View>
            </View>

            {/* Content Preview */}
            <View style={styles.previewContent}>
              <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.previewCardHeader}>
                  <View style={[styles.previewAvatar, { backgroundColor: colors.primary }]} />
                  <View style={styles.previewCardText}>
                    <View style={[styles.previewLine, { backgroundColor: colors.text }]} />
                    <View style={[styles.previewLine, { backgroundColor: colors.textSecondary }]} />
                  </View>
                </View>
                <View style={styles.previewCardBody}>
                  <View style={[styles.previewButton, { backgroundColor: colors.primary }]} />
                  <View style={[styles.previewButton, { backgroundColor: colors.success }]} />
                  <View style={[styles.previewButton, { backgroundColor: colors.warning }]} />
                </View>
              </View>
            </View>

            {/* Tab Bar Preview */}
            <View style={[styles.previewTabBar, { backgroundColor: colors.tabBar, borderTopColor: colors.border }]}>
              <View style={styles.previewTabItem}>
                <View style={[styles.previewTabIcon, { backgroundColor: colors.tabBarActive }]} />
                <View style={[styles.previewTabText, { backgroundColor: colors.tabBarActive }]} />
              </View>
              <View style={styles.previewTabItem}>
                <View style={[styles.previewTabIcon, { backgroundColor: colors.textSecondary }]} />
                <View style={[styles.previewTabText, { backgroundColor: colors.textSecondary }]} />
              </View>
              <View style={styles.previewTabItem}>
                <View style={[styles.previewTabIcon, { backgroundColor: colors.textSecondary }]} />
                <View style={[styles.previewTabText, { backgroundColor: colors.textSecondary }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>İpuçları</ThemedText>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="bulb-outline" size={16} color={colors.primary} />
              <ThemedText style={styles.tipText}>
                Karanlık mod gece kullanımında göz yorgunluğunu azaltır
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="battery-charging-outline" size={16} color={colors.success} />
              <ThemedText style={styles.tipText}>
                Karanlık mod pil ömrünü uzatabilir
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="color-palette-outline" size={16} color={colors.warning} />
              <ThemedText style={styles.tipText}>
                Ana rengi kişiselleştirerek uygulamayı kendinize yapın
              </ThemedText>
            </View>
          </View>
        </View>

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
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeOptionContent: {
    flex: 1,
    marginLeft: 12,
  },
  themeOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeOptionDescription: {
    fontSize: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    position: 'relative',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  previewHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  previewHeaderIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  previewIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  previewContent: {
    padding: 16,
  },
  previewCard: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  previewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  previewCardText: {
    flex: 1,
  },
  previewLine: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  previewCardBody: {
    flexDirection: 'row',
    gap: 8,
  },
  previewButton: {
    flex: 1,
    height: 24,
    borderRadius: 12,
  },
  previewTabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  previewTabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  previewTabIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  previewTabText: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});