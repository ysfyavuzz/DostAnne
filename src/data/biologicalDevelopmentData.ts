/**
 * Biological Development Data
 * Comprehensive organ systems and biological development tracking for 0-24 months
 * 
 * Includes:
 * - 10 Organ Systems
 * - Normal value ranges
 * - Growth metrics (height, weight, head circumference)
 * - Warning signs
 * - Checkup recommendations
 */

export interface BiologicalDevelopmentData {
  month: number;
  ageRange: string;
  
  // Average Growth Metrics
  growth: {
    weight: {
      male: { average: number; min: number; max: number; unit: string };
      female: { average: number; min: number; max: number; unit: string };
    };
    height: {
      male: { average: number; min: number; max: number; unit: string };
      female: { average: number; min: number; max: number; unit: string };
    };
    headCircumference: {
      male: { average: number; min: number; max: number; unit: string };
      female: { average: number; min: number; max: number; unit: string };
    };
  };
  
  // Cardiovascular System
  cardiovascular: {
    heartRate: { min: number; max: number; average: number; unit: string };
    bloodPressure?: { systolic: number; diastolic: number; unit: string };
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
    checkpoints: string[];
  };
  
  // Respiratory System
  respiratory: {
    breathingRate: { min: number; max: number; average: number; unit: string };
    oxygenSaturation: { normal: string; warning: string };
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
    checkpoints: string[];
  };
  
  // Digestive System
  digestive: {
    feedingFrequency: string;
    feedingAmount: string;
    stomachCapacity: string;
    digestionTime: string;
    stoolFrequency: string;
    stoolCharacteristics: string[];
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
    checkpoints: string[];
    commonIssues: string[];
    solutions: string[];
  };
  
  // Renal (Kidney) System
  renal: {
    urineOutput: string;
    wetDiapersPerDay: { min: number; max: number };
    urineColor: string[];
    hydrationSigns: string[];
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
    checkpoints: string[];
  };
  
  // Nervous System
  nervous: {
    reflexes: string[];
    sleepPattern: string;
    sleepHoursPerDay: { min: number; max: number };
    brainDevelopment: string[];
    sensoryDevelopment: string[];
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
    checkpoints: string[];
  };
  
  // Immune System
  immune: {
    vaccinations: {
      name: string;
      ageRecommended: string;
      protection: string;
    }[];
    immunityLevel: string;
    commonIllnesses: string[];
    preventionMeasures: string[];
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
  };
  
  // Musculoskeletal System
  musculoskeletal: {
    boneGrowthRate: string;
    muscleStrength: string;
    posture: string[];
    motorMilestones: string[];
    fontanelles: {
      anterior: string;
      posterior: string;
    };
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
    checkpoints: string[];
  };
  
  // Sensory System
  sensory: {
    vision: {
      development: string;
      range: string;
      capabilities: string[];
    };
    hearing: {
      development: string;
      capabilities: string[];
    };
    touch: {
      development: string;
      sensitivity: string;
    };
    taste: {
      development: string;
      preferences: string[];
    };
    smell: {
      development: string;
      capabilities: string[];
    };
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
    checkpoints: string[];
  };
  
  // Integumentary System (Skin, Hair, Nails)
  integumentary: {
    skinType: string;
    skinConditions: string[];
    hairGrowth: string;
    nailGrowth: string;
    careRecommendations: string[];
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
  };
  
  // Dental Development
  dental: {
    teethCount: number;
    expectedTeeth: string[];
    teethingStage: string;
    teethingSigns: string[];
    oralCare: string[];
    description: string[];
    normalSigns: string[];
    warningSigns: string[];
  };
  
  // Overall Health Checklist
  healthChecklist: {
    category: string;
    items: {
      check: string;
      normal: string;
      concern: string;
    }[];
  }[];
}

export const biologicalMonthlyData: BiologicalDevelopmentData[] = [
  {
    month: 0,
    ageRange: 'Yenidoğan (0-1 ay)',
    
    growth: {
      weight: {
        male: { average: 3.5, min: 2.5, max: 4.5, unit: 'kg' },
        female: { average: 3.4, min: 2.4, max: 4.2, unit: 'kg' },
      },
      height: {
        male: { average: 50, min: 46, max: 54, unit: 'cm' },
        female: { average: 49, min: 45, max: 53, unit: 'cm' },
      },
      headCircumference: {
        male: { average: 35, min: 33, max: 37, unit: 'cm' },
        female: { average: 34.5, min: 32.5, max: 36.5, unit: 'cm' },
      },
    },
    
    cardiovascular: {
      heartRate: { min: 120, max: 160, average: 140, unit: 'atım/dakika' },
      bloodPressure: { systolic: 65, diastolic: 40, unit: 'mmHg' },
      description: [
        'Yenidoğan kalp hızı yetişkinlere göre 2 kat daha hızlı',
        'İlk 24 saatte kalp hızı 120-160 arası normal',
        'Foramen ovale (kalp deliği) kapanma süreci başlıyor',
        'Fetal dolaşımdan yetişkin dolaşıma geçiş',
        'Umbilikal kordon kesildikten sonra plasenta dolaşımı sona eriyor',
      ],
      normalSigns: [
        'Düzenli kalp atışları',
        'Pembe cilt rengi',
        'Normal kapiller dolum (<2 saniye)',
        'Güçlü nabız',
        'Aktif ve uyanık',
      ],
      warningSigns: [
        '⚠️ Kalp hızı 100\'ün altında → Acil doktor',
        '🚨 Mavi renk (siyanoz) → Acil 112',
        '⚠️ Soluk/gri cilt → Hemen doktor',
        '🚨 Nefes almada zorluk + kalp hızı → Acil',
        '⚠️ Çok hızlı kalp atışı (>180) → Doktor kontrolü',
      ],
      checkpoints: [
        '✓ Doğumda kalp muayenesi',
        '✓ İlk 24 saat pulse oksimetre',
        '✓ Kalp üfürümü kontrolü',
        '✓ Kapiller dolum testi',
        '✓ Cilt rengi takibi',
      ],
    },
    
    respiratory: {
      breathingRate: { min: 30, max: 60, average: 40, unit: 'nefes/dakika' },
      oxygenSaturation: { normal: '95-100%', warning: '<92%' },
      description: [
        'İlk nefes alış hayati önem taşır',
        'Akciğerler doğumdan sonra ilk 24 saatte tamamen açılır',
        'Periyodik solunum normal (düzensiz aralıklar)',
        'Burun solunumu tercih edilir',
        'Göğüs ve karın birlikte hareket eder',
      ],
      normalSigns: [
        'Düzenli nefes alıp verme',
        'Sessiz solunum (inleme yok)',
        'Normal göğüs hareketi',
        'Pembe dudak ve tırnaklar',
        'Rahat besleniyor',
      ],
      warningSigns: [
        '🚨 Dakikada 60\'tan fazla nefes → Acil doktor',
        '🚨 Nefeste inleme sesi → Acil 112',
        '🚨 Göğüs kafesinde çekilme → Acil',
        '🚨 Mavi dudak/tırnaklar → Acil 112',
        '⚠️ 10 saniyeden uzun nefes duraklaması → Acil',
      ],
      checkpoints: [
        '✓ Nefes sayısı (1 dakika)',
        '✓ Göğüs hareketi simetrisi',
        '✓ Ses ve inleme kontrolü',
        '✓ Cilt rengi',
        '✓ Beslenme sırasında nefes',
      ],
    },
    
    digestive: {
      feedingFrequency: '8-12 kez/gün',
      feedingAmount: '30-90 ml/emzirme',
      stomachCapacity: 'İlk gün: 5-7 ml → 1 hafta: 60 ml',
      digestionTime: '2-3 saat',
      stoolFrequency: '1-10 kez/gün (değişken)',
      stoolCharacteristics: [
        'İlk 1-2 gün: Mekonyum (siyah, yapışkan)',
        '3-5 gün: Geçiş dışkısı (yeşil-kahverengi)',
        '5+ gün: Normal dışkı (sarı, tohumlu)',
        'Anne sütü: Yumuşak, sarı',
        'Mama: Daha koyu, kıvamlı',
      ],
      description: [
        'Mide kapasitesi çok küçük, sık besleme gerekli',
        'Gastrokolik refleks aktif (emzirme sonrası dışkı)',
        'Mekonyum ilk 24-48 saatte çıkmalı',
        'Fizyolojik sarılık 2-3. günde başlayabilir',
        'Kusma vs regürjitasyon farkını bilin',
      ],
      normalSigns: [
        'Düzenli besleniyor',
        'Kusma yok (hafif regürjitasyon normal)',
        'Mekonyum 24-48 saatte çıktı',
        'Sarı dışkı (5. günden sonra)',
        'Aktif ve tok görünüyor',
      ],
      warningSigns: [
        '🚨 Fıskiye kusma → Acil doktor',
        '⚠️ Yeşil/safra renkli kusma → Acil',
        '🚨 Şişkin karın + ağlama → Acil doktor',
        '⚠️ 24 saatte mekonyum yok → Doktor',
        '🚨 Kanlı dışkı → Hemen doktor',
      ],
      checkpoints: [
        '✓ Mekonyum çıkışı (24-48 saat)',
        '✓ Besleme sayısı',
        '✓ Kilo alımı kontrolü',
        '✓ Dışkı rengi ve sıklığı',
        '✓ Karın muayenesi',
      ],
      commonIssues: [
        'Gaz sancısı (kolik)',
        'Regürjitasyon',
        'Hıçkırık',
        'Fizyolojik sarılık',
        'İdrar yolu enfeksiyonu riski',
      ],
      solutions: [
        'Sık gaz çıkarma',
        'Dik tutma (emzirme sonrası)',
        'Karın masajı (saat yönünde)',
        'Sıcak kompres',
        'Anne diyeti düzenlemesi',
      ],
    },
    
    renal: {
      urineOutput: '15-25 ml/saat',
      wetDiapersPerDay: { min: 6, max: 8 },
      urineColor: [
        'İlk günler: Konsantre (koyu sarı)',
        'Normal: Açık sarı/berrak',
        'Ürat kristalleri: Pembe-kırmızı leke (normal)',
      ],
      hydrationSigns: [
        'Yeterli ıslak bez (6-8/gün)',
        'Açık sarı idrar',
        'Nemli mukoza',
        'Gözyaşı var',
        'Normal cilt turgoru',
      ],
      description: [
        'İlk idrar genellikle 24 saat içinde',
        'Konsantre idrar ilk günlerde normal',
        'Ürat kristalleri görülebilir (pembe leke - zararsız)',
        'Böbrekler olgunlaşmaya devam ediyor',
        'Su dengesi kritik, anne sütü ile sağlanır',
      ],
      normalSigns: [
        '6-8 ıslak bez/gün',
        'Açık sarı idrar',
        'Ağrısız idrar yapma',
        'Düzenli idrar',
        'Normal koku',
      ],
      warningSigns: [
        '🚨 24 saatte idrar yok → Acil doktor',
        '⚠️ <6 ıslak bez/gün → Dehidrasyon riski',
        '🚨 Kanlı idrar → Acil doktor',
        '⚠️ Ağrılı idrar → Doktor kontrolü',
        '⚠️ Çok koyu idrar + kuru mukoza → Doktor',
      ],
      checkpoints: [
        '✓ İlk idrar zamanı (24 saat)',
        '✓ Günlük ıslak bez sayısı',
        '✓ İdrar rengi',
        '✓ Hidrasyon belirtileri',
        '✓ Genital muayene',
      ],
    },
    
    nervous: {
      reflexes: [
        '✓ Moro refleksi (irkilme)',
        '✓ Emme refleksi',
        '✓ Arama refleksi (rooting)',
        '✓ Palmar grasp (avuç sıkma)',
        '✓ Plantar refleks (ayak)',
        '✓ Tonic neck refleks',
        '✓ Stepping refleks',
      ],
      sleepPattern: 'Düzensiz, 16-18 saat/gün',
      sleepHoursPerDay: { min: 16, max: 18 },
      brainDevelopment: [
        'Beyin doğumda yetişkin beyninin %25\'i kadar',
        'Nöronal bağlantılar hızla gelişiyor',
        'Miyelin kılıf oluşumu başlıyor',
        'Duyusal uyaranlar kritik öneme sahip',
        'Uyku sırasında büyük gelişim',
      ],
      sensoryDevelopment: [
        'Dokunma en gelişmiş duyu',
        'İşitme iyi, seslere tepki',
        'Görme sınırlı (20-30 cm)',
        'Koku duyusu güçlü (anneyi tanır)',
        'Tat duyusu (tatlıyı tercih)',
      ],
      description: [
        'Uyku-uyanıklık döngüsü düzenlenmedi',
        'REM uykusu fazla',
        'Gece-gündüz ayırımı yok',
        'Kısa uyku periyotları (2-3 saat)',
        'Primordial refleksler aktif',
      ],
      normalSigns: [
        'Aktif refleksler',
        '16-18 saat uyku',
        'Seslere tepki',
        'Göz teması (kısa)',
        'Normal uyanıklık',
      ],
      warningSigns: [
        '🚨 Refleks yok → Acil nöroloji',
        '🚨 Çok letarjik → Acil doktor',
        '🚨 Nöbet geçiriyor → Acil 112',
        '⚠️ Seslere tepki yok → İşitme testi',
        '⚠️ Aşırı sinirli/huzursuz → Doktor',
      ],
      checkpoints: [
        '✓ Refleks muayenesi',
        '✓ Uyku düzeni',
        '✓ Duyusal tepkiler',
        '✓ Kas tonusu',
        '✓ Fontanel muayenesi',
      ],
    },
    
    immune: {
      vaccinations: [
        {
          name: 'Hepatit B',
          ageRecommended: 'Doğumda (0-24 saat)',
          protection: 'Hepatit B virüsü',
        },
        {
          name: 'BCG (Tüberküloz)',
          ageRecommended: '0-2 ay',
          protection: 'Tüberküloz',
        },
      ],
      immunityLevel: 'Pasif bağışıklık (anneden)',
      commonIllnesses: [
        'Sarılık (fizyolojik)',
        'Pişik',
        'Konjunktivit',
        'Monilya (pamukçuk)',
        'Göbek enfeksiyonu riski',
      ],
      preventionMeasures: [
        'Anne sütü (en önemli)',
        'El hijyeni (ziyaretçiler dahil)',
        'Kalabalık yerlerden uzak',
        'Hasta kişilerden uzak',
        'Temiz ortam',
        'Göbek bakımı',
      ],
      description: [
        'Anneden gelen antikorlar ilk 6 ay korur',
        'Doğuştan bağışıklık zayıf',
        'Anne sütü bağışıklık için kritik (IgA)',
        'Timus bezi aktif',
        'Enfeksiyonlara duyarlı dönem',
      ],
      normalSigns: [
        'Fizyolojik sarılık (2-3. gün)',
        'Düzenli besleniyor',
        'Aktif',
        'Normal vücut ısısı',
        'Göbek temiz',
      ],
      warningSigns: [
        '🚨 Ateş >38°C → Acil doktor',
        '🚨 Letarji + beslenememe → Acil',
        '⚠️ Uzayan sarılık (>2 hafta) → Doktor',
        '🚨 Göbek kızarık/akıntılı → Acil',
        '⚠️ Sürekli ağlama + huzursuzluk → Doktor',
      ],
    },
    
    musculoskeletal: {
      boneGrowthRate: 'Çok hızlı (1.5-2 cm/ay)',
      muscleStrength: 'Çok zayıf, gelişmekte',
      posture: [
        'Fetal pozisyon (C-şekli omurga)',
        'Baş kontrolü yok',
        'Ekstremiteler fleksiyonda',
        'Kemikler yumuşak (kıkırdak)',
      ],
      motorMilestones: [
        'Yüzüstü: Başını kısa süre kaldırma',
        'Refleksler: Güçlü grasp',
        'Ekstremiteler: Rasgele hareketler',
      ],
      fontanelles: {
        anterior: 'Açık (2.5-3 cm) - 18 aya kadar kapanır',
        posterior: 'Küçük (0.5-1 cm) - 2-3 aya kadar kapanır',
      },
      description: [
        'Kemikler çoğunlukla kıkırdak',
        'Fontaneller (bıngıldak) açık',
        'Anterior fontanel nabız hissi normal',
        'Kemik uçları yumuşak',
        'Kas tonusu gelişiyor',
      ],
      normalSigns: [
        'Fontanel seviyesi normal',
        'Simetrik hareketler',
        'Normal kas tonusu',
        'Aktif ekstremite hareketi',
        'Düz omurga (yatarken)',
      ],
      warningSigns: [
        '🚨 Çökük fontanel → Dehidrasyon',
        '🚨 Şişkin fontanel → İntrakranyal basınç',
        '⚠️ Asimetrik hareketler → Doktor',
        '⚠️ Çok gevşek/çok sert → Doktor',
        '🚨 Ekstremite hareketsizliği → Acil',
      ],
      checkpoints: [
        '✓ Fontanel muayenesi',
        '✓ Kas tonusu',
        '✓ Simetri kontrolü',
        '✓ Kalça muayenesi (displazi)',
        '✓ Omurga muayenesi',
      ],
    },
    
    sensory: {
      vision: {
        development: 'Sınırlı, gelişmekte',
        range: '20-30 cm (yüz mesafesi)',
        capabilities: [
          'Işığa tepki',
          'Yüzleri tercih ediyor',
          'Kontrast görebiliyor',
          'Takip sınırlı',
          'Bulanık görüş',
        ],
      },
      hearing: {
        development: 'İyi gelişmiş',
        capabilities: [
          'Seslere tepki veriyor',
          'Tanıdık sesleri tercih',
          'İrkilme refleksi',
          'Annenin sesini tanıyor',
          'Yüksek seslerde irkiliyor',
        ],
      },
      touch: {
        development: 'En gelişmiş duyu',
        sensitivity: 'Çok yüksek, özellikle yüz ve eller',
      },
      taste: {
        development: 'İyi gelişmiş',
        preferences: [
          'Tatlıyı tercih',
          'Acıdan kaçınma',
          'Anne sütü tadını tanıyor',
        ],
      },
      smell: {
        development: 'Güçlü',
        capabilities: [
          'Anneyi kokusundan tanıyor',
          'Hoş kokular sakinleştiriyor',
          'Anne sütü kokusuna tepki',
        ],
      },
      description: [
        'Görme: En az gelişmiş, zamanla iyileşir',
        'İşitme: Doğumda iyi',
        'Dokunma: En önemli iletişim aracı',
        'Tat: Tatlı-acı ayırımı',
        'Koku: Anne tanıma',
      ],
      normalSigns: [
        'Işığa tepki',
        'Seslere dönüyor',
        'Dokunmadan hoşlanıyor',
        'İyi emme',
        'Anneyi tercih ediyor',
      ],
      warningSigns: [
        '⚠️ Işığa tepki yok → Göz muayenesi',
        '🚨 Seslere hiç tepki yok → İşitme testi',
        '⚠️ Göz teması kurmaz → Nöroloji',
        '⚠️ Emme problemi → Doktor',
        '🚨 Çok hassas/tepkisiz → Değerlendirme',
      ],
      checkpoints: [
        '✓ Kırmızı refleks testi',
        '✓ İşitme tarama (ilk ay)',
        '✓ Göz muayenesi',
        '✓ Ses tepkileri',
        '✓ Görsel takip',
      ],
    },
    
    integumentary: {
      skinType: 'Çok hassas, ince',
      skinConditions: [
        'Vernix caseosa (beyaz tabaka - koruyucu)',
        'Lanugo (ince tüyler)',
        'Milya (beyaz noktalar - normal)',
        'Eritema toksikum (kırmızı lekeler - normal)',
        'Nevus simplex (salmon patches)',
        'Mongol lekesi',
      ],
      hairGrowth: 'Değişken, dökülme normal',
      nailGrowth: 'Hızlı, yumuşak',
      careRecommendations: [
        'İlk banyo 24-48 saat sonra',
        'Vernix kendiliğinden emer, silmeyin',
        'Parfümsüz ürünler',
        'Günde 1 kez banyo yeterli',
        'Pişik önleme (sık bez)',
        'Tırnak kesimi dikkatli',
      ],
      description: [
        'Vernix: Doğal koruyucu, silmeyin',
        'Lanugo: Birkaç haftada döküler',
        'Deri hassas ve kuru olabilir',
        'Benign döküntüler normal',
        'Pişik riski yüksek',
      ],
      normalSigns: [
        'Pembe/hafif kırmızı',
        'Yumuşak ve elastik',
        'Vernix kalıntıları',
        'Hafif soyulma (normal)',
        'Milya (beyaz noktalar)',
      ],
      warningSigns: [
        '🚨 Sarılık hızla artıyor → Acil',
        '⚠️ Döküntü + ateş → Doktor',
        '🚨 Kabarcıklar/lezyonlar → Acil',
        '⚠️ Şiddetli pişik → Doktor',
        '⚠️ Cilt enfeksiyonu belirtileri → Doktor',
      ],
    },
    
    dental: {
      teethCount: 0,
      expectedTeeth: [],
      teethingStage: 'Henüz yok - Diş tomurcukları çenede mevcut',
      teethingSigns: [],
      oralCare: [
        'Emzirme sonrası ıslak bezle dişeti silme',
        'Diş eti masajı (temiz parmak)',
        'Şeker vermeyin',
        'Ağız hijyeni başlangıcı',
      ],
      description: [
        'Diş tomurcukları çenede hazır',
        'İlk diş 4-7. ayda çıkar (ortalama 6. ay)',
        'Bazı bebekler dişle doğabilir (natal teeth)',
        'Oral hijyen emzirme ile başlar',
        'Diş sağlığı anne sütü ile korunur',
      ],
      normalSigns: [
        'Diş yok',
        'Normal dişeti',
        'İyi emme refleksi',
        'Ağız mukozası sağlıklı',
      ],
      warningSigns: [
        '⚠️ Natal teeth (doğumda diş) → Diş hekimi',
        '⚠️ Ağız içi beyaz lekeler (pamukçuk) → Doktor',
        '⚠️ Dişeti şişliği/kızarıklık → Doktor',
      ],
    },
    
    healthChecklist: [
      {
        category: 'Beslenme',
        items: [
          { check: 'Günde 8-12 kez emziriyor musunuz?', normal: 'Evet', concern: 'Hayır veya az' },
          { check: 'Bebek tok görünüyor mu?', normal: 'Evet', concern: 'Sürekli aç' },
          { check: 'Kilo alımı düzenli mi?', normal: 'Evet (15-30g/gün)', concern: 'Kilo kaybı' },
        ],
      },
      {
        category: 'Dışkılama',
        items: [
          { check: 'Mekonyum çıktı mı (1-2 gün)?', normal: 'Evet', concern: '48 saatte yok' },
          { check: 'Dışkı rengi normal mi?', normal: 'Sarı (5. günden sonra)', concern: 'Beyaz/siyah/kanlı' },
          { check: 'Dışkı sıklığı nasıl?', normal: '1-10 kez/gün', concern: 'Hiç yok veya çok sert' },
        ],
      },
      {
        category: 'İdrar',
        items: [
          { check: 'Günde 6-8 ıslak bez oluyor mu?', normal: 'Evet', concern: '<6 bez' },
          { check: 'İdrar rengi normal mi?', normal: 'Açık sarı', concern: 'Çok koyu/kırmızı' },
          { check: 'Ağrısız idrar yapıyor mu?', normal: 'Evet', concern: 'Ağlıyor' },
        ],
      },
      {
        category: 'Uyku',
        items: [
          { check: 'Günde 16-18 saat uyuyor mu?', normal: 'Evet', concern: 'Çok az/çok fazla' },
          { check: 'Uyandığında aktif mi?', normal: 'Evet', concern: 'Letarjik' },
          { check: 'Nefes düzeni normal mi?', normal: 'Evet', concern: 'Duraklamalar' },
        ],
      },
      {
        category: 'Genel Durum',
        items: [
          { check: 'Cilt rengi normal mi?', normal: 'Pembe', concern: 'Mavi/soluk/sarı' },
          { check: 'Ateş normal mi?', normal: '36.5-37.5°C', concern: '<36°C veya >38°C' },
          { check: 'Aktif ve uyanık mı?', normal: 'Evet', concern: 'Çok uyuşuk' },
        ],
      },
    ],
  },
  {
    month: 1,
    ageRange: '1 Aylık',
    growth: {
      weight: {
        male: { average: 4.5, min: 3.4, max: 5.8, unit: 'kg' },
        female: { average: 4.2, min: 3.2, max: 5.5, unit: 'kg' },
      },
      height: {
        male: { average: 54.7, min: 50.8, max: 58.6, unit: 'cm' },
        female: { average: 53.7, min: 49.8, max: 57.6, unit: 'cm' },
      },
      headCircumference: {
        male: { average: 37.3, min: 35, max: 39.5, unit: 'cm' },
        female: { average: 36.5, min: 34.2, max: 38.8, unit: 'cm' },
      },
    },
    cardiovascular: {
      heartRate: { min: 110, max: 160, average: 135, unit: 'atım/dakika' },
      bloodPressure: { systolic: 70, diastolic: 45, unit: 'mmHg' },
      description: [
        'Kalp hızı hafifçe yavaşlıyor ama hala yüksek',
        'Fetal dolaşım tamamen kapandı',
        'Kalp üfürümü varsa çoğu kendiliğinden geçer',
        'Dolaşım sistemi olgunlaşıyor',
      ],
      normalSigns: ['Düzenli kalp atışı', 'Pembe cilt', 'Aktif', 'İyi beslenme'],
      warningSigns: ['🚨 Kalp hızı <100 veya >180', '⚠️ Siyanoz', '⚠️ Nefes darlığı'],
      checkpoints: ['✓ Kalp dinleme', '✓ Nabız kontrolü', '✓ Cilt rengi'],
    },
    respiratory: {
      breathingRate: { min: 30, max: 50, average: 40, unit: 'nefes/dakika' },
      oxygenSaturation: { normal: '95-100%', warning: '<92%' },
      description: [
        'Solunum düzeni iyileşiyor',
        'Periyodik solunum azalıyor',
        'Akciğer kapasitesi artıyor',
      ],
      normalSigns: ['Sessiz solunum', 'Düzenli nefes', 'Normal göğüs hareketi'],
      warningSigns: ['🚨 Hızlı nefes >60/dk', '🚨 İnleme', '⚠️ Göğüs çekilmesi'],
      checkpoints: ['✓ Nefes sayısı', '✓ Göğüs hareketi', '✓ Ses kontrolü'],
    },
    digestive: {
      feedingFrequency: '8-12 kez/gün (azalmaya başlıyor)',
      feedingAmount: '80-120 ml/emzirme',
      stomachCapacity: '80-150 ml',
      digestionTime: '2.5-3 saat',
      stoolFrequency: '1-8 kez/gün',
      stoolCharacteristics: ['Anne sütü: Sarı, yumuşak', 'Mama: Daha koyu', 'Günde 1 kez de normal'],
      description: [
        'Mide kapasitesi büyüyor',
        'Emzirme sıklığı azalabilir',
        'Dışkı sıklığı azalıyor (normal)',
        'Regürjitasyon devam edebilir',
      ],
      normalSigns: ['Düzenli kilo alımı', 'Tok ve mutlu', 'Normal dışkı'],
      warningSigns: ['🚨 Fıskiye kusma', '⚠️ Kilo alamama', '🚨 Kanlı dışkı'],
      checkpoints: ['✓ Kilo kontrolü', '✓ Besleme sayısı', '✓ Dışkı takibi'],
      commonIssues: ['Gaz sancısı', 'Regürjitasyon', 'Kabızlık başlangıcı'],
      solutions: ['Gaz çıkarma', 'Dik tutma', 'Karın masajı'],
    },
    renal: {
      urineOutput: '20-30 ml/saat',
      wetDiapersPerDay: { min: 6, max: 8 },
      urineColor: ['Açık sarı/berrak'],
      hydrationSigns: ['6-8 ıslak bez', 'Nemli mukoza', 'Gözyaşı'],
      description: ['Böbrek fonksiyonu gelişiyor', 'İdrar daha konsantre olabilir', 'Hidrasyon önemli'],
      normalSigns: ['Düzenli idrar', 'Açık renk', 'Ağrısız'],
      warningSigns: ['⚠️ <6 bez/gün', '🚨 Kanlı idrar', '⚠️ Koyu idrar + kuru ağız'],
      checkpoints: ['✓ Bez sayısı', '✓ İdrar rengi', '✓ Hidrasyon'],
    },
    nervous: {
      reflexes: ['Moro', 'Emme', 'Grasp (güçlü)', 'Primordial refleksler aktif'],
      sleepPattern: 'Düzensiz, 15-17 saat/gün',
      sleepHoursPerDay: { min: 15, max: 17 },
      brainDevelopment: [
        'Görme gelişiyor (30-40 cm)',
        'Yüz tanıma başlıyor',
        'Seslere tepki artıyor',
        'İlk sosyal gülümseme (4-6 hafta)',
      ],
      sensoryDevelopment: ['Görme iyileşiyor', 'İşitme gelişiyor', 'Dokunma hassas'],
      description: ['Beyin hızla büyüyor', 'Nöronal bağlantılar artıyor', 'Uyku düzeni gelişiyor'],
      normalSigns: ['Aktif refleksler', '15-17 saat uyku', 'Seslere dönüyor'],
      warningSigns: ['🚨 Refleks kaybı', '🚨 Aşırı uyuşukluk', '⚠️ Seslere tepkisiz'],
      checkpoints: ['✓ Refleks testi', '✓ Görsel takip', '✓ İşitme tepkileri'],
    },
    immune: {
      vaccinations: [
        { name: 'Hepatit B', ageRecommended: '1 ay (2. doz)', protection: 'Hepatit B virüsü' },
      ],
      immunityLevel: 'Maternal antikorlar hala koruyucu',
      commonIllnesses: ['Kolik', 'Göz akıntısı', 'Pişik', 'İshal'],
      preventionMeasures: ['Anne sütü', 'El hijyeni', 'Temiz ortam', 'Kalabalıktan uzak'],
      description: ['Anne antikorları korumaya devam', 'Bağışıklık gelişiyor', 'Anne sütü kritik'],
      normalSigns: ['Aktif', 'İyi beslenme', 'Normal ısı'],
      warningSigns: ['🚨 Ateş >38°C', '🚨 Letarji', '⚠️ Sürekli ağlama'],
    },
    musculoskeletal: {
      boneGrowthRate: 'Hızlı (3-4 cm/ay)',
      muscleStrength: 'Güçleniyor',
      posture: ['Baş kontrolü başlangıcı', 'Yüzüstü baş kaldırma (45°)', 'Simetrik hareketler'],
      motorMilestones: ['Baş 45° kaldırma', 'Güçlü grasp refleksi', 'Bacakları tekmeleme'],
      fontanelles: { anterior: 'Açık (2-3 cm)', posterior: 'Kapanmakta' },
      description: ['Baş kontrolü gelişmeye başlıyor', 'Kas tonusu artıyor', 'Kemikler güçleniyor'],
      normalSigns: ['Simetrik hareketler', 'Baş kaldırma', 'Aktif ekstremiteler'],
      warningSigns: ['⚠️ Baş kontrolü yok', '⚠️ Asimetri', '🚨 Çok gevşek'],
      checkpoints: ['✓ Baş kontrolü', '✓ Kas tonusu', '✓ Fontanel', '✓ Kalça'],
    },
    sensory: {
      vision: {
        development: 'Gelişiyor',
        range: '30-40 cm',
        capabilities: ['Yüzleri tercih', 'Kontrast takip', 'Göz teması artıyor', 'Kırmızı-siyah tercih'],
      },
      hearing: {
        development: 'İyi',
        capabilities: ['Sesleri tanıyor', 'Seslere dönüyor', 'Anneyi tanıyor', 'Müziğe tepki'],
      },
      touch: { development: 'Hassas', sensitivity: 'Yüksek, özellikle yüz ve eller' },
      taste: { development: 'İyi', preferences: ['Tatlı tercih', 'Acıdan kaçınma'] },
      smell: { development: 'Güçlü', capabilities: ['Anneyi tanıma', 'Koku ayrımı'] },
      description: ['Görme hızla gelişiyor', 'Duyular keskinleşiyor', 'Sosyal gülümseme başlıyor'],
      normalSigns: ['Yüzlere bakıyor', 'Seslere tepki', 'Dokunmadan hoşlanıyor'],
      warningSigns: ['⚠️ Göz teması yok', '⚠️ Seslere tepkisiz', '🚨 Çok hassas/tepkisiz'],
      checkpoints: ['✓ Göz muayenesi', '✓ İşitme testi', '✓ Görsel takip'],
    },
    integumentary: {
      skinType: 'Hassas',
      skinConditions: ['Bebek aknes (normal)', 'Seboreik dermatit (beşik kepi)', 'Pişik'],
      hairGrowth: 'Değişken, yenidoğan saçı dökülüyor',
      nailGrowth: 'Hızlı',
      careRecommendations: ['Günlük banyo', 'Parfümsüz ürünler', 'Nemlendirici', 'Pişik kremi'],
      description: ['Cilt daha kalın', 'Yağ bezleri aktif', 'Pişik riski var'],
      normalSigns: ['Temiz cilt', 'Hafif soyulma', 'Bebek aknesi'],
      warningSigns: ['🚨 Enfeksiyon belirtisi', '⚠️ Şiddetli pişik', '⚠️ Sarılık devam'],
    },
    dental: {
      teethCount: 0,
      expectedTeeth: [],
      teethingStage: 'Henüz yok',
      teethingSigns: [],
      oralCare: ['Dişeti silme', 'Temiz ağız', 'Şeker yok'],
      description: ['Diş tomurcukları gelişiyor', 'İlk diş 4-7 ayda çıkar'],
      normalSigns: ['Normal dişeti', 'İyi emme'],
      warningSigns: ['⚠️ Ağız içi lekeler (pamukçuk)'],
    },
    healthChecklist: [
      {
        category: 'Besleme & Kilo',
        items: [
          { check: 'Günde 8-12 kez emzirme?', normal: 'Evet', concern: 'Az' },
          { check: 'Haftalık kilo alımı 150-200g?', normal: 'Evet', concern: 'Hayır' },
          { check: 'Tok görünüyor?', normal: 'Evet', concern: 'Sürekli aç' },
        ],
      },
      {
        category: 'Gelişim',
        items: [
          { check: 'Baş 45° kaldırıyor?', normal: 'Evet', concern: 'Hiç kaldırmıyor' },
          { check: 'Seslere dönüyor?', normal: 'Evet', concern: 'Hayır' },
          { check: 'Sosyal gülümseme (4-6 hafta)?', normal: 'Evet', concern: '6 haftada yok' },
        ],
      },
      {
        category: 'Uyku',
        items: [
          { check: '15-17 saat uyuyor?', normal: 'Evet', concern: 'Çok az/fazla' },
          { check: 'Gece 4-5 saat uyuyor?', normal: 'Evet', concern: '2 saatten az' },
        ],
      },
    ],
  },
  // Months 2-24 will be added progressively...
];

/**
 * Get biological development data for a specific month
 */
export const getBiologicalDevelopmentData = (month: number): BiologicalDevelopmentData | undefined => {
  return biologicalMonthlyData.find(data => data.month === month);
};

/**
 * Get growth percentile category
 */
export const getGrowthCategory = (value: number, min: number, max: number): {
  category: string;
  color: string;
  description: string;
} => {
  if (value < min) {
    return {
      category: 'Düşük',
      color: '#EF4444',
      description: 'Normal aralığın altında - Doktora danışın',
    };
  } else if (value > max) {
    return {
      category: 'Yüksek',
      color: '#F59E0B',
      description: 'Normal aralığın üstünde - Doktora danışın',
    };
  } else {
    return {
      category: 'Normal',
      color: '#10B981',
      description: 'Normal aralıkta',
    };
  }
};

/**
 * Calculate baby's age in months from birthdate
 */
export const calculateAgeInMonths = (birthDate: Date): number => {
  const now = new Date();
  const months = (now.getFullYear() - birthDate.getFullYear()) * 12 +
                 (now.getMonth() - birthDate.getMonth());
  return Math.max(0, months);
};
