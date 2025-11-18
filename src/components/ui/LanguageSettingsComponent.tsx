import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';
import { useTranslation, Language } from '@/src/hooks/useTranslation';

const ThemedText = createText();

interface LanguageSettingsComponentProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSettingsComponent({
  visible,
  onClose,
}: LanguageSettingsComponentProps) {
  const { colors } = useTheme();
  const { language, t, changeLanguage } = useTranslation();

  const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
    {
      code: 'tr',
      name: 'Turkish',
      nativeName: 'Türkçe',
      flag: '🇹🇷',
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
    },
  ];

  const benefits = [
    {
      icon: 'globe-outline',
      title: t('language.benefitAccessibility'),
      description: t('language.benefitAccessibilityDesc'),
    },
    {
      icon: 'people-outline',
      title: t('language.benefitFamily'),
      description: t('language.benefitFamilyDesc'),
    },
    {
      icon: 'medical-outline',
      title: t('language.benefitHealthcare'),
      description: t('language.benefitHealthcareDesc'),
    },
  ];

  if (!visible) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>{t('profile.language')}</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Language */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>{t('language.current')}</ThemedText>
          <View style={styles.currentLanguage}>
            <Text style={styles.currentFlag}>
              {languages.find(l => l.code === language)?.flag}
            </Text>
            <View style={styles.currentLanguageInfo}>
              <ThemedText style={styles.currentLanguageName}>
                {languages.find(l => l.code === language)?.nativeName}
              </ThemedText>
              <ThemedText style={styles.currentLanguageCode}>
                {language.toUpperCase()}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Language Selection */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>{t('language.select')}</ThemedText>
          <View style={styles.languageList}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor: language === lang.code ? colors.primary : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <View style={styles.languageInfo}>
                  <ThemedText
                    style={[
                      styles.languageName,
                      {
                        color: language === lang.code ? 'white' : colors.text,
                      },
                    ]}
                  >
                    {lang.nativeName}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.languageSubtitle,
                      {
                        color: language === lang.code ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
                      },
                    ]}
                  >
                    {lang.name}
                  </ThemedText>
                </View>
                {language === lang.code && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Benefits */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>{t('language.benefits')}</ThemedText>
          <View style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={benefit.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.benefitContent}>
                  <ThemedText style={styles.benefitTitle}>{benefit.title}</ThemedText>
                  <ThemedText style={styles.benefitDescription}>
                    {benefit.description}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>{t('language.tips')}</ThemedText>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="information-circle-outline" size={16} color={colors.info} />
              <ThemedText style={styles.tipText}>
                {t('language.tipRestart')}
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="download-outline" size={16} color={colors.primary} />
              <ThemedText style={styles.tipText}>
                {t('language.tipOffline')}
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="language-outline" size={16} color={colors.warning} />
              <ThemedText style={styles.tipText}>
                {t('language.tipFuture')}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.sectionTitle}>{t('language.about')}</ThemedText>
          <ThemedText style={styles.aboutText}>
            {t('language.aboutText')}
          </ThemedText>
          <View style={styles.languageStats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>2</ThemedText>
              <ThemedText style={styles.statLabel}>{t('language.languages')}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>100+</ThemedText>
              <ThemedText style={styles.statLabel}>{t('language.translations')}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>100%</ThemedText>
              <ThemedText style={styles.statLabel}>{t('language.coverage')}</ThemedText>
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
  currentLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  currentFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  currentLanguageInfo: {
    flex: 1,
  },
  currentLanguageName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentLanguageCode: {
    fontSize: 14,
    opacity: 0.7,
  },
  languageList: {
    gap: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  languageSubtitle: {
    fontSize: 12,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 18,
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
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  languageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  bottomPadding: {
    height: 20,
  },
});