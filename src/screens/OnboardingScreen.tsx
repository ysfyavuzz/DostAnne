import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../hooks/useDatabase';
import { useNotifications } from '../hooks/useNotifications';

interface BabyFormData {
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  weight: string;
  height: string;
  bloodType: string;
}

const OnboardingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { addBabyProfile, loading } = useDatabase();
  const { 
    scheduleFeeding, 
    scheduleSleep, 
    permissionGranted, 
    requestNotificationPermissions 
  } = useNotifications();

  const [currentStep, setCurrentStep] = useState(1);
  const [babyData, setBabyData] = useState<BabyFormData>({
    name: '',
    birthDate: '',
    gender: 'male',
    weight: '',
    height: '',
    bloodType: '',
  });

  const onboardingSteps = [
    {
      step: 1,
      title: 'Hoş Geldiniz! 👋',
      subtitle: 'DostAnne ile bebek bakımınızı kolaylaştırın',
      description: 'Size özel bebek takip uygulamasına hoş geldiniz. Bebeğinizin tüm bilgilerini güvenle kaydedebilirsiniz.',
      icon: 'leaf',
    },
    {
      step: 2,
      title: 'Bebeğinizin Adı 👶',
      subtitle: 'Bebeğinizin ismini girin',
      description: 'Bebeğinizin ismi uygulama içinde kullanılacak ve tüm kayıtlar bu isme yapılacak.',
      icon: 'person',
    },
    {
      step: 3,
      title: 'Doğum Bilgileri 📅',
      subtitle: 'Bebeğinizin doğum tarihini ve cinsiyetini belirtin',
      description: 'Doğum tarihi ve cinsiyet, gelişim takibi ve öneriler için önemlidir.',
      icon: 'calendar',
    },
    {
      step: 4,
      title: 'Büyüme Bilgileri 📏',
      subtitle: 'Bebeğinizin kilo ve boy bilgileri',
      description: 'İlk ölçüm değerleri gelişim takibinizin başlangıç noktası olacak.',
      icon: 'fitness',
    },
    {
      step: 5,
      title: 'Tebrikler! 🎉',
      subtitle: 'Profil oluşturma tamamlandı',
      description: 'Artık DostAnne uygulamasını kullanmaya hazırsınız! Tüm özellikler hizmetinizde.',
      icon: 'checkmark-circle',
    },
  ];

  const bloodTypes = [
    'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 
    'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-', 'Bilmiyorum'
  ];

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 2:
        return babyData.name.trim().length >= 2;
      case 3:
        return babyData.birthDate.trim().length > 0;
      case 4:
        return babyData.weight.trim().length > 0 && 
               babyData.height.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 4 && validateCurrentStep()) {
      // Create baby profile
      const profileData = {
        name: babyData.name,
        birthDate: babyData.birthDate,
        gender: babyData.gender,
        weight: parseFloat(babyData.weight),
        height: parseFloat(babyData.height),
        bloodType: babyData.bloodType || undefined,
      };

      addBabyProfile(profileData)
        .unwrap()
        .then(async () => {
          setCurrentStep(5);
          
          // Try to schedule notifications with proper error handling
          try {
            if (permissionGranted) {
              await scheduleFeeding(babyData.name, 3);
              await scheduleSleep(babyData.name);
            } else {
              // Request permissions first, then schedule
              const granted = await requestNotificationPermissions();
              if (granted) {
                await scheduleFeeding(babyData.name, 3);
                await scheduleSleep(babyData.name);
              }
            }
          } catch (error) {
            console.error('Failed to schedule notifications:', error);
            // Don't show error to user - onboarding should continue
          }
        })
        .catch((error) => {
          Alert.alert('Hata', 'Profil oluşturulamadı. Lütfen bilgileri kontrol edin.');
          console.error('Failed to create baby profile:', error);
        });
    } else if (validateCurrentStep()) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      Alert.alert('Uyarı', 'Lütfen tüm gerekli alanları doldurun');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    navigation.replace('(tabs)');
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setBabyData({ ...babyData, gender });
  };

  const handleBloodTypeSelect = (bloodType: string) => {
    setBabyData({ ...babyData, bloodType });
  };

  const renderStepContent = () => {
    const step = onboardingSteps.find(s => s.step === currentStep);
    
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.welcomeContainer}>
              <Ionicons name={step?.icon as any} size={80} color="#22C55E" />
              <Text style={styles.welcomeTitle}>{step?.title}</Text>
              <Text style={styles.welcomeSubtitle}>{step?.subtitle}</Text>
              <Text style={styles.welcomeDescription}>{step?.description}</Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bebeğinizin Adı</Text>
              <TextInput
                style={styles.textInput}
                value={babyData.name}
                onChangeText={(text) => setBabyData({ ...babyData, name: text })}
                placeholder="Bebeğinizin adını girin"
                placeholderTextColor="#8E8E93"
                autoFocus
              />
              <Text style={styles.inputHelper}>En az 2 karakter</Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Doğum Tarihi</Text>
              <TextInput
                style={styles.textInput}
                value={babyData.birthDate}
                onChangeText={(text) => setBabyData({ ...babyData, birthDate: text })}
                placeholder="GG.AA.YYYY"
                placeholderTextColor="#8E8E93"
                keyboardType="numbers-and-punctuation"
              />
              <Text style={styles.inputHelper}>Örn: 15.01.2024</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cinsiyet</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    babyData.gender === 'male' && styles.genderOptionSelected
                  ]}
                  onPress={() => handleGenderSelect('male')}
                >
                  <Ionicons 
                    name="male" 
                    size={24} 
                    color={babyData.gender === 'male' ? 'white' : '#007AFF'} 
                  />
                  <Text style={[
                    styles.genderText,
                    babyData.gender === 'male' && styles.genderTextSelected
                  ]}>
                    Erkek
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    babyData.gender === 'female' && styles.genderOptionSelected
                  ]}
                  onPress={() => handleGenderSelect('female')}
                >
                  <Ionicons 
                    name="female" 
                    size={24} 
                    color={babyData.gender === 'female' ? 'white' : '#FF3B30'} 
                  />
                  <Text style={[
                    styles.genderText,
                    babyData.gender === 'female' && styles.genderTextSelected
                  ]}>
                    Kız
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Kilo (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  value={babyData.weight}
                  onChangeText={(text) => setBabyData({ ...babyData, weight: text })}
                  placeholder="3.5"
                  placeholderTextColor="#8E8E93"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Boy (cm)</Text>
                <TextInput
                  style={styles.textInput}
                  value={babyData.height}
                  onChangeText={(text) => setBabyData({ ...babyData, height: text })}
                  placeholder="50"
                  placeholderTextColor="#8E8E93"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kan Grubu (İsteğe Bağlı)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.bloodTypeContainer}>
                  {bloodTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.bloodTypeOption,
                        babyData.bloodType === type && styles.bloodTypeSelected
                      ]}
                      onPress={() => handleBloodTypeSelect(type)}
                    >
                      <Text style={[
                        styles.bloodTypeText,
                        babyData.bloodType === type && styles.bloodTypeTextSelected
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <View style={styles.completionContainer}>
              <Ionicons name={step?.icon as any} size={80} color="#34C759" />
              <Text style={styles.completionTitle}>{step?.title}</Text>
              <Text style={styles.completionSubtitle}>{step?.subtitle}</Text>
              <Text style={styles.completionDescription}>{step?.description}</Text>
              
              <View style={styles.babySummary}>
                <Text style={styles.summaryTitle}>Bebeğinizin Profili:</Text>
                <Text style={styles.summaryItem}>👶 {babyData.name}</Text>
                <Text style={styles.summaryItem}>📅 {babyData.birthDate}</Text>
                <Text style={styles.summaryItem}>⚧️ {babyData.gender === 'male' ? 'Erkek' : 'Kız'}</Text>
                <Text style={styles.summaryItem}>⚖️ {babyData.weight} kg</Text>
                <Text style={styles.summaryItem}>📏 {babyData.height} cm</Text>
                {babyData.bloodType && (
                  <Text style={styles.summaryItem}>🩸 {babyData.bloodType}</Text>
                )}
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentStep / 5) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{currentStep}/5</Text>
      </View>

      {/* Step Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>
            {onboardingSteps.find(s => s.step === currentStep)?.title}
          </Text>
          <Text style={styles.stepSubtitle}>
            {onboardingSteps.find(s => s.step === currentStep)?.subtitle}
          </Text>
        </View>

        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 1 && currentStep < 5 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrevious}
          >
            <Ionicons name="arrow-back" size={20} color="#8E8E93" />
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            currentStep === 5 && styles.finishButton,
            !validateCurrentStep() && currentStep < 5 && styles.disabledButton
          ]}
          onPress={currentStep === 5 ? handleFinish : handleNext}
          disabled={loading || (!validateCurrentStep() && currentStep < 5)}
        >
          {loading ? (
            <Text style={styles.nextButtonText}>Yükleniyor...</Text>
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {currentStep === 5 ? 'Uygulamaya Başla' : 'Devam Et'}
              </Text>
              {currentStep < 5 && (
                <Ionicons name="arrow-forward" size={20} color="white" />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 20,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3436',
  },
  inputHelper: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
  },
  genderOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 8,
  },
  genderTextSelected: {
    color: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  bloodTypeOption: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bloodTypeSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  bloodTypeText: {
    fontSize: 14,
    color: '#2D3436',
    fontWeight: '500',
  },
  bloodTypeTextSelected: {
    color: 'white',
  },
  completionContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 20,
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 18,
    color: '#2D3436',
    fontWeight: '600',
    marginBottom: 16,
  },
  completionDescription: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  babySummary: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 16,
    color: '#636E72',
    marginBottom: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 8,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  finishButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#E9ECEF',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
});

export default OnboardingScreen;