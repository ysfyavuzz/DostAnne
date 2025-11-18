import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'tr' | 'en';

interface Translations {
  [key: string]: {
    tr: string;
    en: string;
  };
}

const translations: Translations = {
  // General
  'app.name': { tr: 'DostAnne', en: 'DostAnne' },
  'ok': { tr: 'Tamam', en: 'OK' },
  'cancel': { tr: 'İptal', en: 'Cancel' },
  'save': { tr: 'Kaydet', en: 'Save' },
  'delete': { tr: 'Sil', en: 'Delete' },
  'edit': { tr: 'Düzenle', en: 'Edit' },
  'add': { tr: 'Ekle', en: 'Add' },
  'loading': { tr: 'Yükleniyor...', en: 'Loading...' },
  'error': { tr: 'Hata', en: 'Error' },
  'success': { tr: 'Başarılı', en: 'Success' },
  'warning': { tr: 'Uyarı', en: 'Warning' },
  'retry': { tr: 'Tekrar Dene', en: 'Retry' },
  'close': { tr: 'Kapat', en: 'Close' },
  'back': { tr: 'Geri', en: 'Back' },
  'next': { tr: 'Sonraki', en: 'Next' },
  'done': { tr: 'Bitti', en: 'Done' },
  'yes': { tr: 'Evet', en: 'Yes' },
  'no': { tr: 'Hayır', en: 'No' },

  // Navigation
  'nav.home': { tr: 'Ana Sayfa', en: 'Home' },
  'nav.emergency': { tr: 'Acil Durumlar', en: 'Emergency' },
  'nav.development': { tr: 'Gelişim', en: 'Development' },
  'nav.health': { tr: 'Sağlık', en: 'Health' },
  'nav.sleep': { tr: 'Uyku Takibi', en: 'Sleep Tracking' },
  'nav.nutrition': { tr: 'Beslenme', en: 'Nutrition' },
  'nav.feeding': { tr: 'Emzirme', en: 'Feeding' },
  'nav.menstrual': { tr: 'Adet Takvimi', en: 'Menstrual' },
  'nav.notifications': { tr: 'Bildirimler', en: 'Notifications' },
  'nav.astronomy': { tr: 'Burçlar', en: 'Astronomy' },
  'nav.activities': { tr: 'Aktiviteler', en: 'Activities' },
  'nav.motherworld': { tr: 'Anne Dünyası', en: "Mother's World" },
  'nav.calendar': { tr: 'Takvim', en: 'Calendar' },
  'nav.planner': { tr: 'Planlayıcı', en: 'Planner' },
  'nav.statistics': { tr: 'İstatistikler', en: 'Statistics' },
  'nav.profile': { tr: 'Profil', en: 'Profile' },

  // Home Screen
  'home.welcome': { tr: 'Hoş Geldiniz', en: 'Welcome' },
  'home.quickActions': { tr: 'Hızlı İşlemler', en: 'Quick Actions' },
  'home.todaySummary': { tr: 'Bugün', en: 'Today' },
  'home.recentActivity': { tr: 'Son Aktiviteler', en: 'Recent Activity' },

  // Feeding
  'feeding.title': { tr: 'Beslenme Takibi', en: 'Feeding Tracking' },
  'feeding.addRecord': { tr: 'Beslenme Ekle', en: 'Add Feeding' },
  'feeding.type': { tr: 'Beslenme Türü', en: 'Feeding Type' },
  'feeding.breast': { tr: 'Anne Sütü', en: 'Breast Milk' },
  'feeding.bottle': { tr: 'Mama', en: 'Bottle' },
  'feeding.solid': { tr: 'Ek Gıda', en: 'Solid Food' },
  'feeding.amount': { tr: 'Miktar (ml)', en: 'Amount (ml)' },
  'feeding.duration': { tr: 'Süre (dakika)', en: 'Duration (minutes)' },
  'feeding.notes': { tr: 'Notlar', en: 'Notes' },
  'feeding.records': { tr: 'Beslenme Kayıtları', en: 'Feeding Records' },
  'feeding.analysis': { tr: 'Beslenme Analizi', en: 'Feeding Analysis' },
  'feeding.todayStats': { tr: 'Bugün', en: 'Today' },
  'feeding.totalAmount': { tr: 'Toplam Miktar', en: 'Total Amount' },
  'feeding.totalFeedings': { tr: 'Beslenme Sayısı', en: 'Feedings Count' },
  'feeding.lastFeeding': { tr: 'Son Beslenme', en: 'Last Feeding' },
  'feeding.tips': { tr: 'Beslenme Önerileri', en: 'Feeding Tips' },

  // Health
  'health.title': { tr: 'Sağlık Takibi', en: 'Health Tracking' },
  'health.addRecord': { tr: 'Sağlık Kaydı Ekle', en: 'Add Health Record' },
  'health.type': { tr: 'Kayıt Türü', en: 'Record Type' },
  'health.temperature': { tr: 'Vücut Isısı', en: 'Temperature' },
  'health.weight': { tr: 'Kilo', en: 'Weight' },
  'health.height': { tr: 'Boy', en: 'Height' },
  'health.checkup': { tr: 'Kontrol', en: 'Checkup' },
  'health.value': { tr: 'Değer', en: 'Value' },
  'health.unit': { tr: 'Birim', en: 'Unit' },
  'health.records': { tr: 'Sağlık Kayıtları', en: 'Health Records' },
  'health.analysis': { tr: 'Sağlık Analizi', en: 'Health Analysis' },
  'health.vaccinations': { tr: 'Aşılar', en: 'Vaccinations' },
  'health.score': { tr: 'Sağlık Skoru', en: 'Health Score' },
  'health.metrics': { tr: 'Sağlık Metrikleri', en: 'Health Metrics' },
  'health.tips': { tr: 'Sağlık Önerileri', en: 'Health Tips' },
  'health.vaccination': { tr: 'Aşı', en: 'Vaccination' },
  'health.completed': { tr: 'Tamamlandı', en: 'Completed' },
  'health.pending': { tr: 'Bekliyor', en: 'Pending' },
  'health.overdue': { tr: 'Gecikmiş', en: 'Overdue' },

  // Sleep
  'sleep.title': { tr: 'Uyku Takibi', en: 'Sleep Tracking' },
  'sleep.addRecord': { tr: 'Uyku Kaydı Ekle', en: 'Add Sleep Record' },
  'sleep.startTime': { tr: 'Başlangıç', en: 'Start Time' },
  'sleep.endTime': { tr: 'Bitiş', en: 'End Time' },
  'sleep.duration': { tr: 'Süre', en: 'Duration' },
  'sleep.quality': { tr: 'Kalite', en: 'Quality' },
  'sleep.records': { tr: 'Uyku Kayıtları', en: 'Sleep Records' },
  'sleep.analysis': { tr: 'Uyku Analizi', en: 'Sleep Analysis' },
  'sleep.tonight': { tr: 'Bu Gece', en: 'Tonight' },
  'sleep.totalSleep': { tr: 'Toplam Uyku', en: 'Total Sleep' },
  'sleep.lastSleep': { tr: 'Son Uyku', en: 'Last Sleep' },
  'sleep.tips': { tr: 'Uyku Önerileri', en: 'Sleep Tips' },
  'sleep.excellent': { tr: 'Mükemmel', en: 'Excellent' },
  'sleep.good': { tr: 'İyi', en: 'Good' },
  'sleep.fair': { tr: 'Orta', en: 'Fair' },
  'sleep.poor': { tr: 'Zayıf', en: 'Poor' },

  // Development
  'development.title': { tr: 'Bebek Gelişimi', en: 'Baby Development' },
  'development.growth': { tr: 'Büyüme', en: 'Growth' },
  'development.weight': { tr: 'Kilo', en: 'Weight' },
  'development.height': { tr: 'Boy', en: 'Height' },
  'development.headCircumference': { tr: 'Baş Çevresi', en: 'Head Circumference' },
  'development.percentile': { tr: 'Persentil', en: 'Percentile' },
  'development.milestones': { tr: 'Gelişim Aşamaları', en: 'Milestones' },
  'development.recent': { tr: 'Son Gelişmeler', en: 'Recent Development' },
  'development.tips': { tr: 'Gelişim Önerileri', en: 'Development Tips' },

  // Statistics
  'statistics.title': { tr: 'İstatistikler', en: 'Statistics' },
  'statistics.period': { tr: 'Periyot', en: 'Period' },
  'statistics.last7Days': { tr: 'Son 7 Gün', en: 'Last 7 Days' },
  'statistics.last30Days': { tr: 'Son 30 Gün', en: 'Last 30 Days' },
  'statistics.last90Days': { tr: 'Son 90 Gün', en: 'Last 90 Days' },
  'statistics.feeding': { tr: 'Beslenme', en: 'Feeding' },
  'statistics.sleep': { tr: 'Uyku', en: 'Sleep' },
  'statistics.health': { tr: 'Sağlık', en: 'Health' },
  'statistics.growth': { tr: 'Büyüme', en: 'Growth' },
  'statistics.patterns': { tr: 'Patternler', en: 'Patterns' },

  // Notifications
  'notifications.title': { tr: 'Bildirim Ayarları', en: 'Notification Settings' },
  'notifications.enabled': { tr: 'Bildirimler Açık', en: 'Notifications Enabled' },
  'notifications.feeding': { tr: 'Beslenme Bildirimleri', en: 'Feeding Notifications' },
  'notifications.sleep': { tr: 'Uyku Bildirimleri', en: 'Sleep Notifications' },
  'notifications.health': { tr: 'Sağlık Bildirimleri', en: 'Health Notifications' },
  'notifications.reminders': { tr: 'Hatırlatıcılar', en: 'Reminders' },
  'notifications.permission': { tr: 'Bildirim İzni', en: 'Notification Permission' },

  // Profile
  'profile.title': { tr: 'Profil', en: 'Profile' },
  'profile.babyInfo': { tr: 'Bebek Bilgileri', en: 'Baby Information' },
  'profile.name': { tr: 'İsim', en: 'Name' },
  'profile.birthDate': { tr: 'Doğum Tarihi', en: 'Birth Date' },
  'profile.gender': { tr: 'Cinsiyet', en: 'Gender' },
  'profile.male': { tr: 'Erkek', en: 'Male' },
  'profile.female': { tr: 'Kadın', en: 'Female' },
  'profile.settings': { tr: 'Ayarlar', en: 'Settings' },
  'profile.theme': { tr: 'Tema', en: 'Theme' },
  'profile.language': { tr: 'Dil', en: 'Language' },
  'profile.export': { tr: 'Veri Dışa Aktar', en: 'Export Data' },

  // Export
  'export.title': { tr: 'Veri Dışa Aktar', en: 'Export Data' },
  'export.format': { tr: 'Format', en: 'Format' },
  'export.pdf': { tr: 'PDF', en: 'PDF' },
  'export.excel': { tr: 'Excel', en: 'Excel' },
  'export.download': { tr: 'İndir', en: 'Download' },
  'export.share': { tr: 'Paylaş', en: 'Share' },
  'export.success': { tr: 'Dışa aktarma başarılı', en: 'Export successful' },

  // AI Recommendations
  'ai.title': { tr: 'AI Önerileri', en: 'AI Recommendations' },
  'ai.personalized': { tr: 'Kişiselleştirilmiş', en: 'Personalized' },
  'ai.category': { tr: 'Kategori', en: 'Category' },
  'ai.priority': { tr: 'Öncelik', en: 'Priority' },
  'ai.high': { tr: 'Yüksek', en: 'High' },
  'ai.medium': { tr: 'Orta', en: 'Medium' },
  'ai.low': { tr: 'Düşük', en: 'Low' },
  'ai.actions': { tr: 'Önerilen Eylemler', en: 'Recommended Actions' },

  // Theme
  'theme.title': { tr: 'Tema Ayarları', en: 'Theme Settings' },
  'theme.light': { tr: 'Açık Tema', en: 'Light Theme' },
  'theme.dark': { tr: 'Koyu Tema', en: 'Dark Theme' },
  'theme.auto': { tr: 'Otomatik', en: 'Auto' },
  'theme.accent': { tr: 'Ana Renk', en: 'Accent Color' },
  'theme.preview': { tr: 'Önizleme', en: 'Preview' },

  // Common messages
  'message.noData': { tr: 'Veri bulunamadı', en: 'No data found' },
  'message.noRecords': { tr: 'Kayıt bulunamadı', en: 'No records found' },
  'message.addFirstRecord': { tr: 'İlk kaydı ekleyin', en: 'Add your first record' },
  'message.pullToRefresh': { tr: 'Yenilemek için çekin', en: 'Pull to refresh' },
  'message.loadingData': { tr: 'Veriler yükleniyor', en: 'Loading data' },
  'message.operationSuccess': { tr: 'İşlem başarılı', en: 'Operation successful' },
  'message.operationFailed': { tr: 'İşlem başarısız', en: 'Operation failed' },
  'message.confirmDelete': { tr: 'Silmek istediğinizden emin misiniz?', en: 'Are you sure you want to delete?' },
  'message.requiredField': { tr: 'Bu alan zorunludur', en: 'This field is required' },
  'message.invalidInput': { tr: 'Geçersiz giriş', en: 'Invalid input' },
  'message.networkError': { tr: 'Ağ hatası', en: 'Network error' },
  'message.tryAgain': { tr: 'Tekrar deneyin', en: 'Please try again' },
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('tr');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const saveLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].tr || key;
    }
    return key;
  };

  const changeLanguage = (lang: Language) => {
    saveLanguage(lang);
  };

  return {
    language,
    t,
    changeLanguage,
    isRTL: language === 'ar', // For future Arabic support
  };
}

export type TranslationKey = keyof typeof translations;