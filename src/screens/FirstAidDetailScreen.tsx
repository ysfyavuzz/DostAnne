import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getFirstAidGuide, FirstAidGuide, FirstAidStep } from '../data/firstAidData';

type RouteParams = {
  FirstAidDetail: {
    guideId: string;
  };
};

/**
 * First Aid Detail Screen - Step-by-step emergency guide
 * 
 * Features:
 * - Step-by-step instructions with numbering
 * - Critical warnings highlighted
 * - Emergency contact quick dial
 * - Expandable sections (recognition, steps, prevention)
 * - Color-coded severity indicators
 */

const FirstAidDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'FirstAidDetail'>>();
  const { guideId } = route.params;

  const guide = getFirstAidGuide(guideId);

  const [expandedSections, setExpandedSections] = useState({
    recognition: true,
    steps: true,
    doNots: false,
    whenToSeekHelp: true,
    afterCare: false,
    prevention: false,
  });

  if (!guide) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#DC2626" />
          <Text style={styles.errorText}>Rehber bulunamadı</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEmergencyCall = (number: string, service: string) => {
    Alert.alert(
      'Acil Arama',
      `${service} (${number}) numarasını aramak istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ara',
          style: 'destructive',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          },
        },
      ]
    );
  };

  const renderStepCard = (step: FirstAidStep, index: number) => (
    <View key={step.stepNumber} style={styles.stepCard}>
      {/* Step Number Badge */}
      <View
        style={[
          styles.stepNumberBadge,
          step.criticalStep && styles.stepNumberBadgeCritical,
        ]}
      >
        <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
      </View>

      {/* Step Content */}
      <View style={styles.stepContent}>
        {/* Title */}
        <Text style={styles.stepTitle}>
          {step.title}
          {step.criticalStep && (
            <Text style={styles.criticalLabel}> ⚠️ KRİTİK</Text>
          )}
        </Text>

        {/* Duration */}
        {step.duration && (
          <View style={styles.durationTag}>
            <Ionicons name="time-outline" size={14} color="#6366F1" />
            <Text style={styles.durationText}>{step.duration}</Text>
          </View>
        )}

        {/* Instruction */}
        <Text style={styles.stepInstruction}>{step.instruction}</Text>

        {/* Warnings */}
        {step.warnings && step.warnings.length > 0 && (
          <View style={styles.warningsContainer}>
            <View style={styles.warningsHeader}>
              <Ionicons name="warning" size={16} color="#DC2626" />
              <Text style={styles.warningsHeaderText}>DİKKAT</Text>
            </View>
            {step.warnings.map((warning, idx) => (
              <Text key={idx} style={styles.warningText}>
                {warning}
              </Text>
            ))}
          </View>
        )}

        {/* Tips */}
        {step.tips && step.tips.length > 0 && (
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={16} color="#F59E0B" />
              <Text style={styles.tipsHeaderText}>İPUÇLARI</Text>
            </View>
            {step.tips.map((tip, idx) => (
              <Text key={idx} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={[guide.color, guide.color + 'DD']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name={guide.icon as any} size={40} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{guide.title}</Text>
            <Text style={styles.headerSubtitle}>{guide.subtitle}</Text>
            <Text style={styles.headerAgeRange}>{guide.ageRange}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Contacts */}
        {guide.emergencyContacts && guide.emergencyContacts.length > 0 && (
          <View style={styles.emergencyContactsSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="call" size={18} color="#DC2626" /> ACİL NUMARALAR
            </Text>
            <View style={styles.emergencyContactsGrid}>
              {guide.emergencyContacts.map((contact, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.emergencyContactCard}
                  onPress={() =>
                    handleEmergencyCall(contact.number, contact.service)
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.emergencyContactNumber}>
                    {contact.number}
                  </Text>
                  <Text style={styles.emergencyContactService}>
                    {contact.service}
                  </Text>
                  <Text style={styles.emergencyContactWhen} numberOfLines={2}>
                    {contact.when}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quick Summary */}
        <View style={styles.quickSummarySection}>
          <View style={styles.quickSummaryBadge}>
            <Text style={styles.quickSummaryBadgeText}>
              {guide.quickSummary}
            </Text>
          </View>
        </View>

        {/* Recognition Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('recognition')}
          >
            <Text style={styles.sectionTitle}>
              <Ionicons name="eye" size={18} color="#6366F1" /> BELİRTİLER
            </Text>
            <Ionicons
              name={expandedSections.recognition ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {expandedSections.recognition && (
            <View style={styles.sectionContent}>
              <Text style={styles.subSectionTitle}>Ana Belirtiler:</Text>
              {guide.recognition.mainSymptoms.map((symptom, idx) => (
                <Text key={idx} style={styles.listItem}>
                  • {symptom}
                </Text>
              ))}

              <Text style={[styles.subSectionTitle, { marginTop: 12 }]}>
                Hemen Müdahale Et:
              </Text>
              {guide.recognition.whenToActImmediately.map((action, idx) => (
                <Text key={idx} style={styles.emergencyListItem}>
                  {action}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Steps Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('steps')}
          >
            <Text style={styles.sectionTitle}>
              <Ionicons name="list" size={18} color="#10B981" /> ADIM ADIM
              REHBERİ
            </Text>
            <Ionicons
              name={expandedSections.steps ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {expandedSections.steps && (
            <View style={styles.stepsContainer}>
              {guide.steps.map((step, idx) => renderStepCard(step, idx))}
            </View>
          )}
        </View>

        {/* Don'ts Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('doNots')}
          >
            <Text style={styles.sectionTitle}>
              <Ionicons name="close-circle" size={18} color="#DC2626" /> ASLA
              YAPMAYACAKLAR
            </Text>
            <Ionicons
              name={expandedSections.doNots ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {expandedSections.doNots && (
            <View style={styles.sectionContent}>
              {guide.doNots.map((dont, idx) => (
                <Text key={idx} style={styles.dontItem}>
                  {dont}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* When to Seek Help */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('whenToSeekHelp')}
          >
            <Text style={styles.sectionTitle}>
              <Ionicons name="medkit" size={18} color="#F59E0B" /> NE ZAMAN
              YARDIM İSTENMELİ
            </Text>
            <Ionicons
              name={
                expandedSections.whenToSeekHelp ? 'chevron-up' : 'chevron-down'
              }
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {expandedSections.whenToSeekHelp && (
            <View style={styles.sectionContent}>
              {guide.whenToSeekHelp.call112Immediately.length > 0 && (
                <>
                  <Text style={[styles.subSectionTitle, { color: '#DC2626' }]}>
                    🚨 HEMEN 112 ARA:
                  </Text>
                  {guide.whenToSeekHelp.call112Immediately.map((item, idx) => (
                    <Text key={idx} style={styles.emergencyHelpItem}>
                      {item}
                    </Text>
                  ))}
                </>
              )}

              {guide.whenToSeekHelp.goToER.length > 0 && (
                <>
                  <Text style={[styles.subSectionTitle, { marginTop: 12 }]}>
                    ⚠️ ACİL SERVİSE GİT:
                  </Text>
                  {guide.whenToSeekHelp.goToER.map((item, idx) => (
                    <Text key={idx} style={styles.urgentHelpItem}>
                      {item}
                    </Text>
                  ))}
                </>
              )}
            </View>
          )}
        </View>

        {/* Prevention */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('prevention')}
          >
            <Text style={styles.sectionTitle}>
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />{' '}
              ÖNLEME
            </Text>
            <Ionicons
              name={expandedSections.prevention ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {expandedSections.prevention && (
            <View style={styles.sectionContent}>
              {guide.prevention.map((item, idx) => (
                <Text key={idx} style={styles.preventionItem}>
                  {item}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Metadata Footer */}
        <View style={styles.metadataFooter}>
          <Text style={styles.metadataText}>
            <Ionicons name="calendar" size={12} color="#9CA3AF" /> Son
            güncelleme: {guide.metadata.lastUpdated}
          </Text>
          <Text style={styles.metadataText}>
            <Ionicons name="document-text" size={12} color="#9CA3AF" /> Kaynak:{' '}
            {guide.metadata.source}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backIconButton: {
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  headerAgeRange: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emergencyContactsSection: {
    padding: 20,
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
  },
  emergencyContactsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  emergencyContactCard: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emergencyContactNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  emergencyContactService: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  emergencyContactWhen: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  quickSummarySection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  quickSummaryBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickSummaryBadgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  section: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionContent: {
    padding: 16,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 6,
  },
  emergencyListItem: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
    marginBottom: 6,
    fontWeight: '600',
  },
  stepsContainer: {
    padding: 16,
    gap: 16,
  },
  stepCard: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberBadgeCritical: {
    backgroundColor: '#DC2626',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  criticalLabel: {
    fontSize: 12,
    color: '#DC2626',
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  stepInstruction: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  warningsContainer: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  warningsHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  warningText: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
    marginBottom: 4,
  },
  tipsContainer: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    padding: 12,
    borderRadius: 8,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipsHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    marginBottom: 4,
  },
  dontItem: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  emergencyHelpItem: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
    marginBottom: 6,
    fontWeight: '600',
  },
  urgentHelpItem: {
    fontSize: 14,
    color: '#D97706',
    lineHeight: 20,
    marginBottom: 6,
    fontWeight: '500',
  },
  preventionItem: {
    fontSize: 14,
    color: '#059669',
    lineHeight: 20,
    marginBottom: 6,
  },
  metadataFooter: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  metadataText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FirstAidDetailScreen;
