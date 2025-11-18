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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addActivity } from '../store/store';

const { width } = Dimensions.get('window');

const PlannerScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [activeTab, setActiveTab] = useState<'routine' | 'meal'>('routine');
  const [routineName, setRoutineName] = useState('');
  const [routineTime, setRoutineTime] = useState('');
  const [routineDuration, setRoutineDuration] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [mealName, setMealName] = useState('');
  const [mealPortion, setMealPortion] = useState('');
  const [mealIngredients, setMealIngredients] = useState('');
  const [mealAllergens, setMealAllergens] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Sabit rutin slotları
  const routineSlots = [
    { id: 'morning', name: 'Sabah Rutini', time: '07:00', icon: 'sunny' },
    { id: 'breakfast', name: 'Kahvaltı', time: '08:00', icon: 'restaurant' },
    { id: 'morning-nap', name: 'Sabah Uykusu', time: '09:00', icon: 'bed' },
    { id: 'lunch', name: 'Öğle', time: '12:00', icon: 'restaurant' },
    { id: 'afternoon-nap', name: 'Öğle Uykusu', time: '14:00', icon: 'bed' },
    { id: 'play', name: 'Oyun Zamanı', time: '16:00', icon: 'game-controller' },
    { id: 'dinner', name: 'Akşam Yemeği', time: '18:00', icon: 'restaurant' },
    { id: 'bath', name: 'Banyo', time: '19:00', icon: 'water' },
    { id: 'bedtime', name: 'Uyku Saati', time: '20:00', icon: 'moon' },
  ];

  // Öğün şablonları
  const mealTemplates = [
    { id: 'breakfast', name: 'Kahvaltı', portion: '200ml', icon: 'sunny' },
    { id: 'lunch', name: 'Öğle Yemeği', portion: '250ml', icon: 'partly-sunny' },
    { id: 'dinner', name: 'Akşam Yemeği', portion: '200ml', icon: 'moon' },
    { id: 'snack', name: 'Ara Öğün', portion: '150ml', icon: 'cafe' },
  ];

  const daysOfWeek = [
    { id: 'mon', label: 'Pzt' },
    { id: 'tue', label: 'Sal' },
    { id: 'wed', label: 'Çar' },
    { id: 'thu', label: 'Per' },
    { id: 'fri', label: 'Cum' },
    { id: 'sat', label: 'Cmt' },
    { id: 'sun', label: 'Paz' },
  ];

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleAddRoutine = () => {
    if (!routineName.trim() || !routineTime.trim() || !routineDuration.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    const activity = {
      id: Date.now().toString(),
      type: 'note' as const,
      actor: 'baby' as const,
      startTime: new Date().toISOString(),
      notes: `⏰ ${routineName}: ${routineTime} - ${routineDuration} (${selectedDays.length > 0 ? selectedDays.map(d => daysOfWeek.find(day => day.id === d)?.label).join(', ') : 'Tek seferlik'})`,
    };

    dispatch(addActivity(activity));
    
    Alert.alert('Başarılı', 'Rutin planlandı!');
    setRoutineName('');
    setRoutineTime('');
    setRoutineDuration('');
    setSelectedDays([]);
  };

  const handleAddMeal = () => {
    if (!mealName.trim() || !mealPortion.trim() || !mealIngredients.trim()) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun.');
      return;
    }

    const activity = {
      id: Date.now().toString(),
      type: 'feeding' as const,
      actor: 'baby' as const,
      startTime: new Date().toISOString(),
      quantity: parseInt(mealPortion),
      unit: 'ml',
      notes: `🍽️ ${mealName}: ${mealPortion} - Malzemeler: ${mealIngredients}${mealAllergens ? ' - Alerjenler: ' + mealAllergens : ''}${isFavorite ? ' ⭐' : ''}`,
    };

    dispatch(addActivity(activity));
    
    Alert.alert('Başarılı', 'Beslenme planı eklendi!');
    setMealName('');
    setMealPortion('');
    setMealIngredients('');
    setMealAllergens('');
    setIsFavorite(false);
  };

  const selectRoutineSlot = (slot: typeof routineSlots[0]) => {
    setRoutineName(slot.name);
    setRoutineTime(slot.time);
    setRoutineDuration('30');
  };

  const selectMealTemplate = (template: typeof mealTemplates[0]) => {
    setMealName(template.name);
    setMealPortion(template.portion);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Planlayıcı</Text>
        <Text style={styles.headerSubtitle}>Rutin ve beslenme planları</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'routine' && styles.activeTab]}
          onPress={() => setActiveTab('routine')}
        >
          <Ionicons 
            name="calendar" 
            size={20} 
            color={activeTab === 'routine' ? '#FF6B9D' : '#718096'} 
          />
          <Text style={[styles.tabText, activeTab === 'routine' && styles.activeTabText]}>
            Rutin Planlayıcı
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'meal' && styles.activeTab]}
          onPress={() => setActiveTab('meal')}
        >
          <Ionicons 
            name="restaurant" 
            size={20} 
            color={activeTab === 'meal' ? '#FF6B9D' : '#718096'} 
          />
          <Text style={[styles.tabText, activeTab === 'meal' && styles.activeTabText]}>
            Beslenme Günlüğü
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'routine' ? (
          // Rutin Planlayıcı
          <View style={styles.routineSection}>
            <Text style={styles.sectionTitle}>⏰ Rutin Planlayıcı</Text>
            
            {/* Quick Slot Selection */}
            <View style={styles.quickSlotContainer}>
              <Text style={styles.subTitle}>Hızlı Seçim</Text>
              <View style={styles.slotGrid}>
                {routineSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={styles.slotButton}
                    onPress={() => selectRoutineSlot(slot)}
                  >
                    <Ionicons name={slot.icon as any} size={24} color="#667eea" />
                    <Text style={styles.slotName}>{slot.name}</Text>
                    <Text style={styles.slotTime}>{slot.time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Routine Form */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Rutin Adı</Text>
              <TextInput
                style={styles.textInput}
                value={routineName}
                onChangeText={setRoutineName}
                placeholder="Rutin adını girin..."
                placeholderTextColor="#A0AEC0"
              />
              
              <View style={styles.rowInput}>
                <View style={styles.inputHalf}>
                  <Text style={styles.formLabel}>Başlangıç Saati</Text>
                  <TextInput
                    style={styles.textInput}
                    value={routineTime}
                    onChangeText={setRoutineTime}
                    placeholder="08:00"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
                
                <View style={styles.inputHalf}>
                  <Text style={styles.formLabel}>Süre (dakika)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={routineDuration}
                    onChangeText={setRoutineDuration}
                    placeholder="30"
                    placeholderTextColor="#A0AEC0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <Text style={styles.formLabel}>Tekrarlama Günleri</Text>
              <View style={styles.daysContainer}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day.id) && styles.activeDay
                    ]}
                    onPress={() => toggleDay(day.id)}
                  >
                    <Text style={[
                      styles.dayText,
                      selectedDays.includes(day.id) && styles.activeDayText
                    ]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleAddRoutine}>
                <Ionicons name="calendar" size={20} color="white" />
                <Text style={styles.saveButtonText}>Rutin Planla</Text>
              </TouchableOpacity>
            </View>

            {/* Active Routines */}
            <View style={styles.activeSection}>
              <Text style={styles.subTitle}>Aktif Planlanan Rutinler</Text>
              <Text style={styles.emptyText}>Henüz planlanmış rutin yok</Text>
            </View>
          </View>
        ) : (
          // Beslenme Günlüğü
          <View style={styles.mealSection}>
            <Text style={styles.sectionTitle}>🍽️ Beslenme Günlüğü</Text>
            
            {/* Meal Templates */}
            <View style={styles.templateContainer}>
              <Text style={styles.subTitle}>Hızlı Tarif Şablonları</Text>
              <View style={styles.templateGrid}>
                {mealTemplates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={styles.templateButton}
                    onPress={() => selectMealTemplate(template)}
                  >
                    <Ionicons name={template.icon as any} size={24} color="#FF6B9D" />
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templatePortion}>{template.portion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Meal Form */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Yemek Adı</Text>
              <TextInput
                style={styles.textInput}
                value={mealName}
                onChangeText={setMealName}
                placeholder="Yemek adını girin..."
                placeholderTextColor="#A0AEC0"
              />
              
              <Text style={styles.formLabel}>Porsiyon (ml)</Text>
              <TextInput
                style={styles.textInput}
                value={mealPortion}
                onChangeText={setMealPortion}
                placeholder="200"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
              />
              
              <Text style={styles.formLabel}>Malzemeler</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={mealIngredients}
                onChangeText={setMealIngredients}
                placeholder="Malzemeleri virgülle ayırarak girin..."
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              <Text style={styles.formLabel}>Alerjenler</Text>
              <TextInput
                style={styles.textInput}
                value={mealAllergens}
                onChangeText={setMealAllergens}
                placeholder="Alerjen notları..."
                placeholderTextColor="#A0AEC0"
              />
              
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Favorilere Ekle</Text>
                <Switch
                  value={isFavorite}
                  onValueChange={setIsFavorite}
                  trackColor={{ false: '#E2E8F0', true: '#FFB6C1' }}
                  thumbColor={isFavorite ? '#FF6B9D' : '#F7FAFC'}
                />
              </View>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleAddMeal}>
                <Ionicons name="restaurant" size={20} color="white" />
                <Text style={styles.saveButtonText}>Beslenme Planı Ekle</Text>
              </TouchableOpacity>
            </View>

            {/* Favorite Meals */}
            <View style={styles.favoriteSection}>
              <Text style={styles.subTitle}>⭐ Favori Tarifler</Text>
              <Text style={styles.emptyText}>Henüz favori tarif yok</Text>
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
  routineSection: {
    flex: 1,
  },
  mealSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 15,
  },
  quickSlotContainer: {
    marginBottom: 30,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotButton: {
    width: (width - 50) / 3,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2D3748',
    marginTop: 5,
  },
  slotTime: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2,
  },
  templateContainer: {
    marginBottom: 30,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  templateButton: {
    width: (width - 50) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    marginTop: 5,
  },
  templatePortion: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  formSection: {
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
    height: 80,
  },
  rowInput: {
    flexDirection: 'row',
    gap: 15,
  },
  inputHalf: {
    flex: 1,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDay: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A5568',
  },
  activeDayText: {
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
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
  activeSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

export default PlannerScreen;