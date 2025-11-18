import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setBaby, updateSettings } from '../store/store';

const { width } = Dimensions.get('window');

const RegistrationScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { baby, settings } = useSelector((state: RootState) => state.activities);

  // Ana kullanıcı bilgileri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'parent' | 'preparing'>('preparing');

  // Ebeveyn bilgileri
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthYear, setPartnerBirthYear] = useState('');
  const [partnerAnniversary, setPartnerAnniversary] = useState('');
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState('0');

  // Bebek bilgileri (varsa)
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl'>('boy');
  const [babyBirthDate, setBabyBirthDate] = useState('');

  // Sağlık ve astroloji bilgileri (isteğe bağlı)
  const [healthIssues, setHealthIssues] = useState('');
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  // İzinler
  const [allowHealthAnalysis, setAllowHealthAnalysis] = useState(false);
  const [allowAstrologyAnalysis, setAllowAstrologyAnalysis] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);

  const handleRegistration = () => {
    // Email ve password validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'Email ve şifre zorunludur.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    // Baby bilgilerini kaydet (varsa)
    if (babyName.trim() && babyBirthDate.trim()) {
      const babyData = {
        id: Date.now().toString(),
        name: babyName,
        birthDate: babyBirthDate,
        weight: 3500, // default
        height: 50, // default
      };
      dispatch(setBaby(babyData));
    }

    // Settings'i kaydet
    dispatch(updateSettings({
      notifications: allowNotifications,
      allowHealthAnalysis,
      allowAstrologyAnalysis,
    }));

    // Registration complete
    Alert.alert(
      'Kayıt Başarılı!',
      'DostAnne ailesine hoş geldiniz! Profil bilgilerinizi daha sonra düzenleyebilirsiniz.',
      [
        {
          text: 'Tamam',
          onPress: () => navigation.replace('tabs'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kayıt Ol</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Email Adresi</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@email.com"
            placeholderTextColor="#A0AEC0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleRegistration}>
          <Text style={styles.saveButtonText}>Kayıt Ol</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
    backgroundColor: '#F7FAFC',
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default RegistrationScreen;