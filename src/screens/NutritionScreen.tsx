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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NutritionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<'schedule' | 'recipes' | 'allergies' | 'tips'>('schedule');
  const [babyAge, setBabyAge] = useState('4');

  // Simüle edilmiş ek gıda takvimi
  const feedingSchedule = [
    {
      id: 1,
      age: '4-6 Ay',
      title: 'Ek Gıdaya Hazırlık',
      description: 'Tek tek tanıtmaya başlayın',
      allowedFoods: [
        'Pirinç püresi',
        'Sebzeli püreler (havuç, patates, kabak)',
        'Meyve püreleri (elma, armut, muz)',
        'Yoğurt',
      ],
      forbiddenFoods: [
        'Bal',
        'Sığır eti',
        'Yumurta beyazı',
        'Deniz ürünleri',
        'Fındık/fıstık',
      ],
      frequency: 'Günde 1-2 kez',
      quantity: '1-2 yemek kaşığı',
    },
    {
      id: 2,
      age: '6-8 Ay',
      title: 'Ek Gıda Başlangıcı',
      description: 'Yeni tatları keşfetme zamanı',
      allowedFoods: [
        'Tahıllar (pirinç, bulgur)',
        'Tüm sebzeler',
        'Tüm meyveler',
        'Tavuk eti',
        'Yumurta sarısı',
        'Bakliyatlar',
      ],
      forbiddenFoods: [
        'Bal',
        'İnek sütü',
        'Fındık/fıstık',
        'Cips ve şekerleme',
        'Çiğ sebze/meyve',
      ],
      frequency: 'Günde 3-4 kez',
      quantity: '3-4 yemek kaşığı',
    },
    {
      id: 3,
      age: '8-12 Ay',
      title: 'Çeşitlendirme Dönemi',
      description: 'Aile sofrasına katılım',
      allowedFoods: [
        'Her şey denenebilir',
        'Sığır eti',
        'Yumurta tamı',
        'Peynir',
        'Makarna',
        'Ekmek',
      ],
      forbiddenFoods: [
        'Bal',
        'Aşırı tuzlu ve baharatlı',
        'Kola ve gazlı içecekler',
        'Çok şekerli ürünler',
      ],
      frequency: 'Günde 5-6 kez',
      quantity: '5-6 yemek kaşığı',
    },
  ];

  // Bebek tarifleri
  const babyRecipes = [
    {
      id: 1,
      name: 'Elma Püresi',
      age: '4+ Ay',
      time: '10 dakika',
      difficulty: 'Kolay',
      ingredients: [
        '1 adet elma',
        '1/2 su bardağı su',
        '1 çay kaşığı tarçın (isteğe bağlı)',
      ],
      instructions: [
        'Elmayı yıkayıp kabuğunu soyun',
        'Küçük küpler halinde doğrayın',
        'Suyu ekleyerek haşlayın',
        'Çatal ile ezerek püre haline getirin',
        'Ilık olarak verin',
      ],
      nutrition: 'C vitamini, lif',
      icon: 'leaf',
      color: '#34C759',
    },
    {
      id: 2,
      name: 'Sebzeli Pirinç Püresi',
      age: '5+ Ay',
      time: '20 dakika',
      difficulty: 'Orta',
      ingredients: [
        '3 yemek kaşığı pirinç',
        '1 havuç',
        '1 patates',
        '2 su bardağı su',
      ],
      instructions: [
        'Sebzeleri yıkayıp doğrayın',
        'Pirinci yıkayın',
        'Tüm malzemeleri su ile pişirin',
        'Püre haline getirin',
        'Ilık olarak servis yapın',
      ],
      nutrition: 'A vitamini, karbonhidrat',
      icon: 'restaurant',
      color: '#FF9500',
    },
    {
      id: 3,
      name: 'Tavuklu Bulgur Pilavı',
      age: '8+ Ay',
      time: '30 dakika',
      difficulty: 'Orta',
      ingredients: [
        '100g tavuk fileto',
        '1/2 su bardağı bulgur',
        '1 soğan',
        '1 domates',
        '2 su bardağı su',
      ],
      instructions: [
        'Tavugu haşlayıp didikleyin',
        'Soğanı ve domatesi doğrayın',
        'Tüm malzemeleri pişirin',
        'Pilav kıvamına getirin',
        'Ilık olarak verin',
      ],
      nutrition: 'Protein, demir',
      icon: 'nutrition',
      color: '#007AFF',
    },
    {
      id: 4,
      name: 'Muz Yoğurt',
      age: '6+ Ay',
      time: '5 dakika',
      difficulty: 'Kolay',
      ingredients: [
        '1 adet olgun muz',
        '3 yemek kaşığı yoğurt',
        '1 çay kaşığı zeytinyağı',
      ],
      instructions: [
        'Muzu çatal ile ezin',
        'Yoğurt ile karıştırın',
        'Zeytinyağı ekleyin',
        'Hemen servis yapın',
      ],
      nutrition: 'Potasyum, kalsiyum',
      icon: 'heart',
      color: '#FF3B30',
    },
  ];

  // Alerji bilgileri
  const allergyInfo = [
    {
      id: 1,
      allergen: 'Yumurta',
      symptoms: [
        'Döküntü ve kaşıntı',
        'Mide bulantısı',
        'Nefes darlığı',
        'Yüz ve dilde şişme',
      ],
      whatToDo: [
        'Hemen yumurtayı kesin',
        'Doktora başvurun',
        'Acil durumda 112\'yi arayın',
      ],
      whenToTest: '8. aydan sonra',
      icon: 'egg',
      color: '#FF9500',
    },
    {
      id: 2,
      allergen: 'Fındık/Fıstık',
      symptoms: [
        'Cilt döküntüsü',
        'Boğazda kaşıntı',
        'Mide ağrısı',
        'Anafilaksi (ciddi reaksiyon)',
      ],
      whatToDo: [
        'Hemen kesin',
        'Acil doktor gerekli',
        'Adrenalın iğne gerekebilir',
      ],
      whenToTest: '1 yaşından sonra',
      icon: 'alert-circle',
      color: '#FF3B30',
    },
    {
      id: 3,
      allergen: 'Süt',
      symptoms: [
        'Gaz ve şişkinlik',
        'İshal',
        'Kusma',
        'Cilt döküntüsü',
      ],
      whatToDo: [
        'Süt ürünlerini kesin',
        'Laktoz intoleransı testi',
        'Diyisyen danışın',
      ],
      whenToTest: '1 yaşından sonra',
      icon: 'water',
      color: '#007AFF',
    },
  ];

  // Beslenme ipuçları
  const nutritionTips = [
    {
      id: 1,
      title: 'Yeni Gıda Tanıtma',
      description: 'Her yeni gıdayı 3 gün arayla tanıtın, alerjiyi izleyin',
      icon: 'time',
      color: '#34C759',
    },
    {
      id: 2,
      title: 'Püre Kıvamı',
      description: 'Başlangıçta çok kıvamlı, zamanla daha katı hale getirin',
      icon: 'restaurant',
      color: '#FF9500',
    },
    {
      id: 3,
      title: 'Sıcaklık Kontrolü',
      description: 'Yiyeceklerin sıcaklığını kontrol edin, yakabilecek kadar sıcak olmasın',
      icon: 'thermometer',
      color: '#FF3B30',
    },
    {
      id: 4,
      title: 'Su İhtiyacı',
      description: '6 aydan sonra yan bardaktan su vermeye başlayın',
      icon: 'water',
      color: '#007AFF',
    },
    {
      id: 5,
      title: 'Vitamin D',
      description: 'Doktor önerisine göre vitamin D damlası verin',
      icon: 'sunny',
      color: '#AF52DE',
    },
    {
      id: 6,
      title: 'Tuz ve Şeker',
      description: '1 yaşına kadar tuz ve şeker eklemeyin',
      icon: 'warning',
      color: '#8E8E93',
    },
  ];

  const ScheduleCard = ({ schedule }: any) => (
    <View style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <View style={styles.ageBadge}>
          <Text style={styles.ageText}>{schedule.age}</Text>
        </View>
        <Text style={styles.scheduleTitle}>{schedule.title}</Text>
      </View>
      <Text style={styles.scheduleDescription}>{schedule.description}</Text>
      
      <View style={styles.scheduleSection}>
        <Text style={styles.sectionLabel}>✅ İzin Verilen Gıdalar</Text>
        {schedule.allowedFoods.map((food: string, index: number) => (
          <View key={index} style={styles.foodItem}>
            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
            <Text style={styles.foodText}>{food}</Text>
          </View>
        ))}
      </View>

      <View style={styles.scheduleSection}>
        <Text style={styles.sectionLabel}>❌ Yasaklı Gıdalar</Text>
        {schedule.forbiddenFoods.map((food: string, index: number) => (
          <View key={index} style={styles.foodItem}>
            <Ionicons name="close-circle" size={16} color="#FF3B30" />
            <Text style={styles.foodText}>{food}</Text>
          </View>
        ))}
      </View>

      <View style={styles.scheduleFooter}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Sıklık:</Text>
          <Text style={styles.footerValue}>{schedule.frequency}</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Miktar:</Text>
          <Text style={styles.footerValue}>{schedule.quantity}</Text>
        </View>
      </View>
    </View>
  );

  const RecipeCard = ({ recipe }: any) => (
    <View style={styles.recipeCard}>
      <View style={styles.recipeHeader}>
        <View style={styles.recipeInfo}>
          <Ionicons name={recipe.icon as any} size={24} color={recipe.color} />
          <View style={styles.recipeDetails}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <View style={styles.recipeMeta}>
              <Text style={styles.recipeAge}>{recipe.age}</Text>
              <Text style={styles.recipeTime}>⏱ {recipe.time}</Text>
              <Text style={styles.recipeDifficulty}>{recipe.difficulty}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.recipeSection}>
        <Text style={styles.sectionLabel}>Malzemeler:</Text>
        {recipe.ingredients.map((ingredient: string, index: number) => (
          <Text key={index} style={styles.ingredientText}>• {ingredient}</Text>
        ))}
      </View>

      <View style={styles.recipeSection}>
        <Text style={styles.sectionLabel}>Yapılışı:</Text>
        {recipe.instructions.map((instruction: string, index: number) => (
          <View key={index} style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>

      <View style={styles.nutritionBadge}>
        <Ionicons name="nutrition" size={16} color="#34C759" />
        <Text style={styles.nutritionText}>{recipe.nutrition}</Text>
      </View>
    </View>
  );

  const AllergyCard = ({ allergy }: any) => (
    <View style={styles.allergyCard}>
      <View style={styles.allergyHeader}>
        <Ionicons name={allergy.icon as any} size={24} color={allergy.color} />
        <View style={styles.allergyInfo}>
          <Text style={styles.allergyName}>{allergy.allergen}</Text>
          <Text style={styles.allergyTest}>Test zamanı: {allergy.whenToTest}</Text>
        </View>
      </View>

      <View style={styles.allergySection}>
        <Text style={styles.sectionLabel}>Belirtiler:</Text>
        {allergy.symptoms.map((symptom: string, index: number) => (
          <View key={index} style={styles.symptomItem}>
            <Ionicons name="warning" size={16} color="#FF9500" />
            <Text style={styles.symptomText}>{symptom}</Text>
          </View>
        ))}
      </View>

      <View style={styles.allergySection}>
        <Text style={styles.sectionLabel}>Ne Yapmalı:</Text>
        {allergy.whatToDo.map((action: string, index: number) => (
          <View key={index} style={styles.actionItem}>
            <Ionicons name="medical" size={16} color="#007AFF" />
            <Text style={styles.actionText}>{action}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const NutritionTipCard = ({ tip }: any) => (
    <View style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Ionicons name={tip.icon as any} size={24} color={tip.color} />
        <Text style={styles.tipTitle}>{tip.title}</Text>
      </View>
      <Text style={styles.tipDescription}>{tip.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Beslenme Rehberi</Text>
        <Text style={styles.subtitle}>Ek gıda ve sağlıklı beslenme</Text>
      </View>

      <View style={styles.ageSelector}>
        <Text style={styles.ageLabel}>Bebeğinizin yaşı:</Text>
        <View style={styles.ageButtons}>
          {['4', '6', '8', '12'].map((age) => (
            <TouchableOpacity
              key={age}
              style={[
                styles.ageButton,
                babyAge === age && styles.ageButtonActive,
              ]}
              onPress={() => setBabyAge(age)}
            >
              <Text style={[
                styles.ageButtonText,
                babyAge === age && styles.ageButtonTextActive,
              ]}>
                {age} ay
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'schedule' && styles.activeTab]}
          onPress={() => setSelectedTab('schedule')}
        >
          <Ionicons 
            name="calendar" 
            size={20} 
            color={selectedTab === 'schedule' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'schedule' && styles.activeTabText]}>
            Takvim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'recipes' && styles.activeTab]}
          onPress={() => setSelectedTab('recipes')}
        >
          <Ionicons 
            name="restaurant" 
            size={20} 
            color={selectedTab === 'recipes' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'recipes' && styles.activeTabText]}>
            Tarifler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'allergies' && styles.activeTab]}
          onPress={() => setSelectedTab('allergies')}
        >
          <Ionicons 
            name="alert-circle" 
            size={20} 
            color={selectedTab === 'allergies' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'allergies' && styles.activeTabText]}>
            Alerjiler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'tips' && styles.activeTab]}
          onPress={() => setSelectedTab('tips')}
        >
          <Ionicons 
            name="bulb" 
            size={20} 
            color={selectedTab === 'tips' ? '#007AFF' : '#8E8E93'} 
          />
          <Text style={[styles.tabText, selectedTab === 'tips' && styles.activeTabText]}>
            İpuçları
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'schedule' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Ek Gıda Takvimi</Text>
          {feedingSchedule.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </View>
      )}

      {selectedTab === 'recipes' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍳 Bebek Tarifleri</Text>
          {babyRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      )}

      {selectedTab === 'allergies' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Alerji Bilgileri</Text>
          {allergyInfo.map((allergy) => (
            <AllergyCard key={allergy.id} allergy={allergy} />
          ))}
        </View>
      )}

      {selectedTab === 'tips' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Beslenme İpuçları</Text>
          {nutritionTips.map((tip) => (
            <NutritionTipCard key={tip.id} tip={tip} />
          ))}
        </View>
      )}

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Her bebek farklıdır. Bu bilgiler genel rehberlik içindir. Beslenme ile ilgili endişeleriniz için mutlaka doktorunuza danışın.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  ageSelector: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  ageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
  },
  ageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  ageButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  ageButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ageButtonText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '500',
  },
  ageButtonTextActive: {
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabText: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
  },
  scheduleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ageBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  ageText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 12,
  },
  scheduleSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodText: {
    fontSize: 14,
    color: '#2D3436',
    marginLeft: 8,
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  recipeCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeHeader: {
    marginBottom: 12,
  },
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recipeDetails: {
    flex: 1,
    marginLeft: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recipeAge: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
  recipeTime: {
    fontSize: 12,
    color: '#636E72',
  },
  recipeDifficulty: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '500',
  },
  recipeSection: {
    marginBottom: 12,
  },
  ingredientText: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 2,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 18,
  },
  nutritionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 8,
    borderRadius: 8,
  },
  nutritionText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    marginLeft: 4,
  },
  allergyCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  allergyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  allergyTest: {
    fontSize: 14,
    color: '#636E72',
  },
  allergySection: {
    marginBottom: 12,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  symptomText: {
    fontSize: 14,
    color: '#2D3436',
    marginLeft: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#2D3436',
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  infoSection: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    marginLeft: 8,
    lineHeight: 20,
  },
});

export default NutritionScreen;