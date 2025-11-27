import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';

import { ExportService, ExportData, prepareFeedingData, prepareHealthData, prepareSleepData } from './ExportService';
import { LoadingOverlay } from '../ui/LoadingComponents';

const ThemedText = Text;

interface ExportComponentProps {
  visible: boolean;
  onClose: () => void;
  exportType: 'feeding' | 'health' | 'sleep' | 'all';
  data: {
    feeding?: any[];
    health?: any[];
    sleep?: any[];
    vaccinations?: any[];
  };
}

export default function ExportComponent({
  visible,
  onClose,
  exportType,
  data,
}: ExportComponentProps) {
  const { colors } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    
    try {
      let exportData: ExportData | null = null;
      
      switch (exportType) {
        case 'feeding':
          if (data.feeding) {
            exportData = prepareFeedingData(data.feeding);
          }
          break;
        case 'health':
          if (data.health && data.vaccinations) {
            exportData = prepareHealthData(data.health, data.vaccinations);
          }
          break;
        case 'sleep':
          if (data.sleep) {
            exportData = prepareSleepData(data.sleep);
          }
          break;
        case 'all':
          // Tüm verileri birleştir
          const allSections = [];
          if (data.feeding) {
            allSections.push(...prepareFeedingData(data.feeding).sections);
          }
          if (data.health && data.vaccinations) {
            allSections.push(...prepareHealthData(data.health, data.vaccinations).sections);
          }
          if (data.sleep) {
            allSections.push(...prepareSleepData(data.sleep).sections);
          }
          
          if (allSections.length > 0) {
            exportData = {
              title: 'DostAnne Tam Rapor',
              date: new Date().toLocaleDateString('tr-TR'),
              sections: allSections,
            };
          }
          break;
      }

      if (!exportData) {
        Alert.alert('Hata', 'Dışa aktarılacak veri bulunamadı');
        return;
      }

      const fileUri = format === 'pdf' 
        ? await ExportService.generatePDF(exportData)
        : await ExportService.generateExcel(exportData);

      await ExportService.shareFile(fileUri);
      
      Alert.alert(
        'Başarılı',
        `${format.toUpperCase()} dosyası başarıyla oluşturuldu ve paylaşıma hazır`,
        [
          { text: 'Tamam', onPress: onClose },
        ]
      );
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Hata', 'Dışa aktarma işlemi başarısız oldu');
    } finally {
      setIsExporting(false);
    }
  };

  const getExportTypeIcon = () => {
    switch (exportType) {
      case 'feeding': return '🍼';
      case 'health': return '🏥';
      case 'sleep': return '😴';
      case 'all': return '📊';
      default: return '📄';
    }
  };

  const getExportTypeTitle = () => {
    switch (exportType) {
      case 'feeding': return 'Beslenme Verileri';
      case 'health': return 'Sağlık Kayıtları';
      case 'sleep': return 'Uyku Takibi';
      case 'all': return 'Tüm Veriler';
      default: return 'Veri Dışa Aktar';
    }
  };

  const getExportDescription = () => {
    switch (exportType) {
      case 'feeding':
        return 'Beslenme kayıtlarınızı, istatistiklerinizi ve pattern analizlerinizi dışa aktarın';
      case 'health':
        return 'Sağlık ölçümlerinizi, aşı takviminizi ve sağlık skorunuzu dışa aktarın';
      case 'sleep':
        return 'Uyku kayıtlarınızı, kalite analizlerinizi ve uyku patternlerinizi dışa aktarın';
      case 'all':
        return 'Tüm bebek bakım verilerinizi kapsamlı bir rapor halinde dışa aktarın';
      default:
        return 'Verilerinizi dışa aktarın';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Veri Dışa Aktar</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {/* Export Type Info */}
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoIcon}>{getExportTypeIcon()}</Text>
              <ThemedText style={styles.infoTitle}>{getExportTypeTitle()}</ThemedText>
            </View>
            <ThemedText style={styles.infoDescription}>
              {getExportDescription()}
            </ThemedText>
          </View>

          {/* Format Selection */}
          <View style={[styles.formatCard, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.formatTitle}>Dışa Aktarma Formatı</ThemedText>
            <View style={styles.formatOptions}>
              <TouchableOpacity
                style={[
                  styles.formatOption,
                  {
                    backgroundColor: exportFormat === 'pdf' ? colors.primary : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setExportFormat('pdf')}
              >
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={exportFormat === 'pdf' ? 'white' : colors.text}
                />
                <View style={styles.formatOptionInfo}>
                  <ThemedText
                    style={[
                      styles.formatOptionText,
                      {
                        color: exportFormat === 'pdf' ? 'white' : colors.text,
                      },
                    ]}
                  >
                    PDF
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.formatOptionSubtext,
                      {
                        color: exportFormat === 'pdf' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                      },
                    ]}
                  >
                    Profesyonel rapor formatı
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  {
                    backgroundColor: exportFormat === 'excel' ? colors.primary : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setExportFormat('excel')}
              >
                <Ionicons
                  name="grid-outline"
                  size={24}
                  color={exportFormat === 'excel' ? 'white' : colors.text}
                />
                <View style={styles.formatOptionInfo}>
                  <ThemedText
                    style={[
                      styles.formatOptionText,
                      {
                        color: exportFormat === 'excel' ? 'white' : colors.text,
                      },
                    ]}
                  >
                    Excel
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.formatOptionSubtext,
                      {
                        color: exportFormat === 'excel' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                      },
                    ]}
                  >
                    Veri analizi için uygun
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features */}
          <View style={[styles.featuresCard, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.featuresTitle}>Özellikler</ThemedText>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                <ThemedText style={styles.featureText}>
                  Tüm kayıtların detaylı listesi
                </ThemedText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                <ThemedText style={styles.featureText}>
                  İstatistikler ve özet bilgiler
                </ThemedText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                <ThemedText style={styles.featureText}>
                  Grafikler ve görsel analizler (PDF)
                </ThemedText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                <ThemedText style={styles.featureText}>
                  Kolay paylaşım ve kaydetme
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Export Button */}
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: colors.primary }]}
            onPress={() => handleExport(exportFormat)}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="download-outline" size={20} color="white" />
            )}
            <ThemedText style={styles.exportButtonText}>
              {isExporting ? 'Oluşturuluyor...' : `${exportFormat.toUpperCase()} İndir`}
            </ThemedText>
          </TouchableOpacity>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <ThemedText style={styles.privacyText}>
              📝 Verileriniz sadece cihazınızda işlenir ve hiçbir yere gönderilmez.
            </ThemedText>
          </View>
        </View>

        <LoadingOverlay visible={isExporting} message="Rapor hazırlanıyor..." />
      </SafeAreaView>
    </Modal>
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
  infoCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  formatCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  formatOptions: {
    gap: 12,
  },
  formatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  formatOptionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  formatOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  formatOptionSubtext: {
    fontSize: 12,
  },
  featuresCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  privacyNote: {
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
});
