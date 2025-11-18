import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addActivity } from '../store/store';

const { width } = Dimensions.get('window');

const MotherWorldScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [activeTab, setActiveTab] = useState<'memory' | 'cycle'>('memory');
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryContent, setMemoryContent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Anı defteri template'leri
  const memoryTemplates = [
    { id: 'first-smile', title: 'İlk Gülümseme', icon: 'happy' },
    { id: 'first-word', title: 'İlk Kelime', icon: 'chatbubble' },
    { id: 'first-step', title: 'İlk Adım', icon: 'walk' },
    { id: 'special-moment', title: 'Özel An', icon: 'star' },
  ];

  const symptomOptions = [
    { id: 'cramps', label: 'Kramplar', icon: 'warning' },
    { id: 'headache', label: 'Baş Ağrısı', icon: 'medical' },
    { id: 'mood-swing', label: 'Ruh Hali', icon: 'happy' },
    { id: 'fatigue', label: 'Yorgunluk', icon: 'battery-dead' },
    { id: 'nausea', label: 'Mide Bulantısı', icon: 'medkit' },
    { id: 'appetite', label: 'İştah', icon: 'restaurant' },
  ];

  const handleAddMemory = () => {
    if (!memoryTitle.trim() || !memoryContent.trim()) {
      Alert.alert('Hata', 'Lütfen başlık ve içerik girin.');
      return;
    }

    const activity = {
      id: Date.now().toString(),
      type: 'note' as const,
      actor: 'mother' as const,
      startTime: new Date().toISOString(),
      notes: `📝 ${memoryTitle}: ${memoryContent}`,
    };

    dispatch(addActivity(activity));
    
    Alert.alert('Başarılı', 'Anınız kaydedildi!');
    setMemoryTitle('');
    setMemoryContent('');
  };

  const handleCycleTrack = () => {
    if (symptoms.length === 0 && !notes.trim()) {
      Alert.alert('Hata', 'Lütfen en az bir semptom veya not girin.');
      return;
    }

    const activity = {
      id: Date.now().toString(),
      type: 'note' as const,
      actor: 'mother' as const,
      startTime: selectedDate.toISOString(),
      notes: `🌸 Adet Takibi: ${symptoms.join(', ')}${notes ? ' - ' + notes : ''}`,
    };

    dispatch(addActivity(activity));
    
    Alert.alert('Başarılı', 'Adet takibiniz kaydedildi!');
    setSymptoms([]);
    setNotes('');
  };

  const toggleSymptom = (symptomId: string) => {
    setSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const selectTemplate = (template: typeof memoryTemplates[0]) => {
    setMemoryTitle(template.title);
    setMemoryContent(`${new Date().toLocaleDateString('tr-TR')} tarihinde ${template.title.toLowerCase()} anı yaşandı...`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Anne Dünyası</Text>
        <Text style={styles.headerSubtitle}>Anılarınız ve sağlık takibiniz</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'memory' && styles.activeTab]}
          onPress={() => setActiveTab('memory')}
        >
          <Ionicons 
            name="book" 
            size={20} 
            color={activeTab === 'memory' ? '#FF6B9D' : '#718096'} 
          />
          <Text style={[styles.tabText, activeTab === 'memory' && styles.activeTabText]}>
            Anı Defteri
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cycle' && styles.activeTab]}
          onPress={() => setActiveTab('cycle')}
        >
          <Ionicons 
            name="calendar" 
            size={20} 
            color={activeTab === 'cycle' ? '#FF6B9D' : '#718096'} 
          />
          <Text style={[styles.tabText, activeTab === 'cycle' && styles.activeTabText]}>
            Adet Takibi
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'memory' ? (
          // Anı Defteri
          <View style={styles.memorySection}>
            <Text style={styles.sectionTitle}>📝 Anı Defteri</Text>
            
            {/* Template Buttons */}
            <View style={styles.templateContainer}>
              <Text style={styles.templateTitle}>Hızlı Başlangıç</Text>
              <View style={styles.templateGrid}>
                {memoryTemplates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={styles.templateButton}
                    onPress={() => selectTemplate(template)}
                  >
                    <Ionicons 
                      name={template.icon as any} 
                      size={24} 
                      color="#FF6B9D" 
                    />
                    <Text style={styles.templateButtonText}>{template.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Memory Form */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Başlık</Text>
              <TextInput
                style={styles.textInput}
                value={memoryTitle}
                onChangeText={setMemoryTitle}
                placeholder="Anınızın başlığı..."
                placeholderTextColor="#A0AEC0"
              />
              
              <Text style={styles.formLabel}>İçerik</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={memoryContent}
                onChangeText={setMemoryContent}
                placeholder="Bu özel anıyı detaylandırın..."
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              
              <TouchableOpacity style={styles.saveButton} onPress={handleAddMemory}>
                <Ionicons name="save" size={20} color="white" />
                <Text style={styles.saveButtonText}>Anıyı Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Adet Takibi
          <View style={styles.cycleSection}>
            <Text style={styles.sectionTitle}>🌸 Adet Takibi</Text>
            
            {/* Date Picker */}
            <View style={styles.dateContainer}>
              <Text style={styles.formLabel}>Tarih</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Ionicons name="calendar" size={20} color="#667eea" />
                <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Symptoms */}
            <View style={styles.symptomContainer}>
              <Text style={styles.formLabel}>Semptomlar</Text>
              <View style={styles.symptomGrid}>
                {symptomOptions.map((symptom) => (
                  <TouchableOpacity
                    key={symptom.id}
                    style={[
                      styles.symptomButton,
                      symptoms.includes(symptom.id) && styles.activeSymptom
                    ]}
                    onPress={() => toggleSymptom(symptom.id)}
                  >
                    <Ionicons 
                      name={symptom.icon as any} 
                      size={20} 
                      color={symptoms.includes(symptom.id) ? '#FF6B9D' : '#718096'} 
                    />
                    <Text style={[
                      styles.symptomText,
                      symptoms.includes(symptom.id) && styles.activeSymptomText
                    ]}>
                      {symptom.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={styles.notesContainer}>
              <Text style={styles.formLabel}>Notlar</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Eklemek istediğiniz notlar..."
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleCycleTrack}>
              <Ionicons name="save" size={20} color="white" />
              <Text style={styles.saveButtonText}>Takibi Kaydet</Text>
            </TouchableOpacity>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#667eea" />
              <Text style={styles.infoText}>
                Adet takibi, döngünüzü düzenli olarak izlemenize yardımcı olur. Semptomlarınızı ve ruh halinizi kaydederek doktorunuzla paylaşabileceğiniz detaylı raporlar oluşturabilirsiniz.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    backgroundColor: '#FF6B9D',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#FFF0F5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
  },
  activeTabText: {
    color: '#FF6B9D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  memorySection: {
    flex: 1,
  },
  cycleSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
  },
  templateContainer: {
    marginBottom: 30,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 15,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  templateButton: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    marginTop: 8,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
    backgroundColor: '#F7FAFC',
    marginBottom: 20,
  },
  textArea: {
    height: 120,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B9D',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  dateContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#2D3748',
  },
  symptomContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  symptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeSymptom: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FF6B9D',
  },
  symptomText: {
    fontSize: 14,
    color: '#4A5568',
  },
  activeSymptomText: {
    color: '#FF6B9D',
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EBF8FF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2C5282',
    lineHeight: 20,
  },
});

export default MotherWorldScreen;