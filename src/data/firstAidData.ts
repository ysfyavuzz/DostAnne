/**
 * First Aid Data - Comprehensive Emergency and First Aid Guides
 * 
 * ⚠️ CRITICAL: This data is for emergency guidance only
 * ⚠️ Always call 112 for life-threatening emergencies
 * ⚠️ Medical information verified by pediatric emergency guidelines
 * 
 * Categories:
 * - Life-threatening emergencies (choking, CPR, breathing)
 * - Urgent situations (high fever, seizures, head trauma)
 * - Common injuries (burns, cuts, falls)
 * - Poisoning (household, medications, plants)
 * - Preventive measures
 */

export type EmergencyLevel = 'life-threatening' | 'urgent' | 'non-urgent';

export interface FirstAidStep {
  stepNumber: number;
  title: string;
  instruction: string;
  duration?: string; // e.g., "30 seconds", "2 minutes"
  criticalStep: boolean;
  warnings: string[]; // What NOT to do
  image?: string; // Path to illustration
  video?: string; // Path to video demonstration
  tips?: string[];
}

export interface FirstAidGuide {
  id: string;
  category: 'acil' | 'yaralanma' | 'zehirlenme' | 'hastalik' | 'onlem';
  emergency: EmergencyLevel;
  title: string;
  subtitle: string;
  ageRange: string; // e.g., "0-12 ay", "Tüm yaşlar"
  
  // Quick identification
  quickSummary: string; // 3-5 words for emergency button
  icon: string; // Ionicons name
  color: string; // Alert color
  
  // Recognition - How to identify the emergency
  recognition: {
    mainSymptoms: string[];
    whenToActImmediately: string[];
    severityIndicators: {
      mild: string[];
      moderate: string[];
      severe: string[];
    };
  };
  
  // Step-by-step instructions
  steps: FirstAidStep[];
  
  // Critical DON'Ts
  doNots: string[];
  
  // When to seek medical help
  whenToSeekHelp: {
    call112Immediately: string[]; // Life-threatening
    goToER: string[]; // Urgent
    callDoctor: string[]; // Same day
    monitor: string[]; // Watch at home
  };
  
  // After care
  afterCare?: {
    nextSteps: string[];
    monitoring: string[];
    followUp: string[];
  };
  
  // Prevention
  prevention: string[];
  
  // Additional resources
  resources?: {
    videoUrl?: string;
    externalLinks?: string[];
    relatedGuides?: string[]; // IDs of related guides
  };
  
  // Emergency contacts
  emergencyContacts: {
    service: string;
    number: string;
    when: string;
  }[];
  
  // Last updated and source
  metadata: {
    lastUpdated: string;
    source: string;
    reviewedBy?: string;
  };
}

/**
 * First Aid Guides Database
 */
export const firstAidGuides: FirstAidGuide[] = [
  {
    id: 'choking-infant-0-12',
    category: 'acil',
    emergency: 'life-threatening',
    title: 'Bebek Boğulması (0-12 Ay)',
    subtitle: 'Acil Müdahale Gereken Durum',
    ageRange: '0-12 ay',
    quickSummary: 'BOĞULMA',
    icon: 'warning',
    color: '#DC2626',
    
    recognition: {
      mainSymptoms: [
        'Öksüremiyor veya çok zayıf öksürük',
        'Ses çıkaramıyor, ağlayamıyor',
        'Nefes alamıyor',
        'Elleriyle boğazını tutuyor (daha büyük bebekler)',
        'Yüzü morarmaya başladı',
        'Bilinci kapanıyor',
      ],
      whenToActImmediately: [
        '🚨 Bebek ses çıkaramıyorsa → HEMEN BAŞLA',
        '🚨 Güçlü öksürük varsa → BEKLE ama hazır ol',
        '🚨 Zayıf öksürük → HEMEN MÜDAHALEye geç',
        '🚨 Yüz rengi değişiyorsa → ACİL',
      ],
      severityIndicators: {
        mild: [
          'Güçlü öksürük var',
          'Ağlayabiliyor',
          'Nefes alabiliyor',
          'Cilt rengi normal',
        ],
        moderate: [
          'Zayıf öksürük',
          'Kısmi hava yolu tıkanıklığı',
          'Hırıltılı nefes',
          'Panikle',
        ],
        severe: [
          'Öksüremiyor',
          'Ses çıkaramıyor',
          'Nefes alamıyor',
          'Siyanoz (mavi/mor renk)',
          'Bilinç kaybı',
        ],
      },
    },
    
    steps: [
      {
        stepNumber: 1,
        title: '112\'yi Ara veya Birisini Ara',
        instruction: 'Yanınızda biri varsa 112\'yi aramasını söyleyin. Yalnızsanız, 2 dakika müdahale ettikten sonra telefonu açık bırakarak 112\'yi arayın.',
        criticalStep: true,
        warnings: [
          '❌ Bebeği bırakmayın',
          '❌ Panik yapmayın',
          '❌ Zaman kaybetmeyin',
        ],
        tips: [
          'Telefonu hoparlöre alın',
          'Operatör rehberlik edecektir',
          'Adresi net söyleyin',
        ],
      },
      {
        stepNumber: 2,
        title: 'Bebeği Doğru Pozisyona Getir',
        instruction: 'Bebeği kendi önkolunuzun üzerine YÜZÜSTÜ yatırın. Bebeğin başı, vücudundan DÜŞÜK olmalı (45 derece eğim). Başını ve boynu elinizle destekleyin.',
        duration: '5 saniye',
        criticalStep: true,
        warnings: [
          '❌ Baş aşağı tutmayın (boyun hasarı riski)',
          '❌ Başı yukarıda tutmayın (etkisiz)',
          '❌ Boynu desteklemeyin (yaralanma)',
        ],
        tips: [
          'Önkolunuzu uyluğunuza koyarak destekleyin',
          'Bebeğin çenesi kapalı el arasında',
          'Başı vücuttan 45° aşağıda',
        ],
        image: '/guides/choking-position-infant.png',
        video: '/videos/choking-infant-position.mp4',
      },
      {
        stepNumber: 3,
        title: 'Sırt Vuruşları (5 Kez)',
        instruction: 'Elinizin topuğu ile bebeğin kürek kemikleri arasına (sırt ortası) 5 kez HIZLI ve SERT vurun. Her vuruş ayrı ayrı, net olmalı.',
        duration: '5-10 saniye',
        criticalStep: true,
        warnings: [
          '❌ Başa VURMAYIN (beyin hasarı)',
          '❌ Boyuna VURMAYIN',
          '❌ Çok hafif vurmayın (etkisiz)',
          '❌ Çok sert vurmayın (iç organ yaralanması)',
          '❌ Alt sırta vurmayın (böbrek hasarı)',
        ],
        tips: [
          'Her vuruş yabancı cismi çıkarmayı amaçlar',
          'Vuruşlar arasında durup kontrol edin',
          'Güçlü ama kontrollü olmalı',
        ],
        image: '/guides/back-blows-infant.png',
        video: '/videos/back-blows-infant-demo.mp4',
      },
      {
        stepNumber: 4,
        title: 'Ağız Kontrolü',
        instruction: 'Bebeğin ağzını açın ve içine bakın. Yabancı cisim GÖRÜNÜYORsa, parmağınızla DİKKATLİCE çıkarın. Görmüyorsanız körlemesine parmak sokmayın.',
        duration: '5 saniye',
        criticalStep: false,
        warnings: [
          '❌ Görmeden parmak sokmayın (cismi daha derine iter)',
          '❌ Körlemesine arama yapmayın',
          '❌ Zorlamayın',
        ],
        tips: [
          'İyi aydınlatın',
          'Sadece gördüğünüz cismi çıkarın',
          'Parmakla süpürme yapmayın',
        ],
      },
      {
        stepNumber: 5,
        title: 'Göğüs Basıları (5 Kez)',
        instruction: 'Bebeği SIRTÜSTÜ çevirin (başı hala destekli). İki parmağınızı (işaret ve orta) göğüs kemiğinin ORTASINA, meme başlarının hemen ALTINA yerleştirin. 5 kez, 4 cm derinliğinde, HIZLI basın.',
        duration: '5-10 saniye',
        criticalStep: true,
        warnings: [
          '❌ Karın bölgesine BASMAYIN (iç organ hasarı - kritik)',
          '❌ Göğsün üst kısmına basmayın',
          '❌ Göğüs kemiğinin ucuna basmayın (kırık riski)',
          '❌ Çok sert basmayın (kaburga kırılabilir)',
          '❌ Tek el ile basmayın (fazla kuvvet)',
        ],
        tips: [
          'Ritim: Dakikada 100-120 basış hızında',
          'Her basışta göğüs 1/3 çökmelı (4 cm)',
          'Basışlar arasında göğüs tamamen yükselsin',
        ],
        image: '/guides/chest-thrusts-infant.png',
        video: '/videos/chest-thrusts-infant-demo.mp4',
      },
      {
        stepNumber: 6,
        title: 'Döngüyü Tekrarla',
        instruction: 'Cisim çıkana veya bebek bilinçsiz olana kadar: 5 sırt vuruşu → Ağız kontrolü → 5 göğüs basısı → Tekrar',
        duration: 'Devam et',
        criticalStep: true,
        warnings: [
          '❌ Vazgeçmeyin',
          '❌ Farklı yöntemler denemeyin',
          '❌ Suya tutmayın',
        ],
        tips: [
          'Her döngü yaklaşık 30 saniye',
          'Yardım gelene kadar devam',
          'Bebek öksürüyorsa → DUR ve izle',
        ],
      },
      {
        stepNumber: 7,
        title: 'BİLİNÇ KAYBI → CPR',
        instruction: 'Bebek bilinçsiz olursa HEMEN CPR (Kalp-Akciğer Canlandırma) başlatın. 30 göğüs basısı + 2 suni solunum döngüsü.',
        duration: 'Yardım gelene kadar',
        criticalStep: true,
        warnings: [
          '❌ CPR\'ı bilmiyorsanız 112 operatörü rehberlik eder',
          '❌ Sadece göğüs basısı da yapabilirsiniz',
        ],
        tips: [
          'CPR rehberine bakın (ayrı bölüm)',
          'Yardım gelene kadar durmayın',
        ],
        image: '/guides/infant-cpr-transition.png',
        video: '/videos/infant-cpr-full.mp4',
      },
    ],
    
    doNots: [
      '❌ Bebeği baş aşağı tutup sallamayın (boyun hasarı riski)',
      '❌ Parmağınızı körkömesine boğaza sokmayın (cismi daha derine iter)',
      '❌ Bebeğe su içirmeyin',
      '❌ Sırtına rastgele vurmayın',
      '❌ Karın bölgesine Heimlich manevrası yapmayın (bebeklerde YASAK - iç organ hasarı)',
      '❌ Bebeği ters çevirip sallamayın',
      '❌ Panik yapıp vakit kaybetmeyin',
      '❌ Yardım gelene kadar durmayın',
    ],
    
    whenToSeekHelp: {
      call112Immediately: [
        '🚨 Bebek nefes alamıyorsa → HEMEN 112',
        '🚨 Bilinç kaybı → HEMEN 112 + CPR',
        '🚨 Yüzü mor/mavi → HEMEN 112',
        '🚨 Cisim çıkmıyor → HEMEN 112',
      ],
      goToER: [
        '⚠️ Cisim çıktı ama hala öksürüyor → Acil servis',
        '⚠️ Nefes darlığı var → Acil servis',
        '⚠️ Göğüste ağrı şikayeti → Acil servis',
        '⚠️ Hırıltılı solunum → Acil servis',
      ],
      callDoctor: [
        '⚠️ Olay sonrası kontrol için doktora gidin',
        '⚠️ Kusma/öksürük devam ediyorsa',
      ],
      monitor: [
        'Cisim çıktı ve bebek normal → Yine de doktor kontrolü',
      ],
    },
    
    afterCare: {
      nextSteps: [
        'Cisim çıktı bile olsa mutlaka doktora gidin',
        'Yabancı cisim parçaları kalabilir',
        'Göğüs basısı yapıldıysa çocuk kardiyolojisi kontrolü',
      ],
      monitoring: [
        'Sonraki 24 saat nefes takibi',
        'Öksürük devam ediyor mu?',
        'Ateş çıktı mı?',
        'Göğüs ağrısı var mı?',
      ],
      followUp: [
        'Doktor kontrolü (24-48 saat içinde)',
        'Göğüs röntgeni gerekebilir',
        'Kemik kırığı kontrolü',
      ],
    },
    
    prevention: [
      '✓ Küçük parçalı oyuncaklar vermeyin (3 cm\'den küçük)',
      '✓ Sert yiyecekler vermeyin: Fındık, fıstık, çiğ havuç, üzüm (bütün)',
      '✓ Balon parçalarından uzak tutun',
      '✓ Yemek yerken gözetim altında olsun',
      '✓ Yatarken/ağlarken yemek yedirmeyin',
      '✓ Küçük nesneleri (düğme, pil, bozuk para) erişemeyecekleri yerde saklayın',
      '✓ Ağabeyi/ablasının küçük oyuncaklarını ayırın',
      '✓ Evde İlk Yardım eğitimi alın',
    ],
    
    emergencyContacts: [
      {
        service: '112 Acil Çağrı',
        number: '112',
        when: 'Nefes alamıyor, bilinç kaybı, mavi renk',
      },
      {
        service: '110 İtfaiye',
        number: '110',
        when: 'Ek destek gerekirse',
      },
    ],
    
    resources: {
      videoUrl: '/videos/choking-infant-full-guide.mp4',
      relatedGuides: ['cpr-infant', 'breathing-problems'],
    },
    
    metadata: {
      lastUpdated: '2024-11-16',
      source: 'American Heart Association, Türk Pediatri Derneği',
      reviewedBy: 'Pediatrik Acil Uzmanı',
    },
  },
  
  {
    id: 'cpr-infant-0-12',
    category: 'acil',
    emergency: 'life-threatening',
    title: 'Bebek CPR (0-12 Ay)',
    subtitle: 'Kalp-Akciğer Canlandırma',
    ageRange: '0-12 ay',
    quickSummary: 'CPR',
    icon: 'heart-circle',
    color: '#DC2626',
    
    recognition: {
      mainSymptoms: [
        'Tepkisiz, uyandıramıyorsunuz',
        'Nefes almıyor veya normal nefes yok',
        'Öksürmüyor, hareket etmiyor',
        'Rengi soluk veya mavi/mor',
        'Nabız yok (opsiyonel kontrol)',
      ],
      whenToActImmediately: [
        '🚨 Bebeği uyandıramıyorsanız → HEMEN BAŞLA',
        '🚨 Nefes almıyorsa → CPR',
        '🚨 Boğulma sonrası bilinç kaybı → CPR',
        '🚨 Suda boğulma → CPR',
        '🚨 Elektrik çarpması → CPR (tehlike geçtikten sonra)',
      ],
      severityIndicators: {
        mild: [
          'Bu bir acil durumdur - "hafif" yok',
        ],
        moderate: [
          'Bu bir acil durumdur - "orta" yok',
        ],
        severe: [
          'Tepkisizlik',
          'Nefes almama',
          'Nabız yok',
          'Siyanoz (mavi/mor renk)',
          'Bilinç kaybı',
        ],
      },
    },
    
    steps: [
      {
        stepNumber: 1,
        title: 'Güvenlik ve Tepki Kontrolü',
        instruction: 'ÖNEMLİ: İlk olarak ortamın güvenli olduğundan emin olun (elektrik, yangın, trafik). Bebeğin ayak tabanına hafifçe vurun ve yüksek sesle "Bebeğim! Uyan!" diye seslerin. TEPKI YOKSA → Adım 2',
        duration: '5-10 saniye',
        criticalStep: true,
        warnings: [
          '❌ Sert sarsmayin (beyin hasarı)',
          '❌ Tehlikeli ortamda CPR yapmayın (önce güvenli yere taşıyın)',
          '❌ Panik yapıp zaman kaybetmeyin',
        ],
        tips: [
          'Bebeği sert, düz zemine yatırın',
          'Sırtüstü pozisyon',
          'Hızlı ama dikkatli davranın',
        ],
      },
      {
        stepNumber: 2,
        title: '112\'yi ARA - HEMEN!',
        instruction: 'Yanınızda biri varsa 112\'yi HEMEN aramasını söyleyin. Yalnızsanız, ÖNCE 2 DAKİKA (5 döngü) CPR yapın, SONRA telefonu hoparlöre alarak 112\'yi arayın ve CPR\'a devam edin.',
        duration: '5 saniye (biri varsa) veya 2 dakika CPR sonrası',
        criticalStep: true,
        warnings: [
          '❌ Bebeği bırakıp telefon aramakla 2 dakika kaybetmeyin',
          '❌ Yalnızsanız: Önce 2 dk CPR → Sonra ara',
          '❌ Operatörün talimatlarını dinleyin',
        ],
        tips: [
          'Telefonu hoparlöre alın',
          'Operatör yol gösterir',
          'CPR\'ı kesmeden konuşun',
          'Eğer DEFİBRİLATÖR (AED) varsa getirmeleri için söyleyin',
        ],
      },
      {
        stepNumber: 3,
        title: 'Hava Yolu Açma (Head Tilt-Chin Lift)',
        instruction: 'Bebeği sırtüstü düz yüzeye yatırın. Bir elinizi bebeğin alnına koyun ve hafifçe arkaya itin. Diğer elinizin 1-2 parmağıyla çeneyi yukarı kaldırın (boyun altına değil, çene kemiğine). Bu başı geriye yatırarak hava yolunu açar.',
        duration: '3-5 saniye',
        criticalStep: true,
        warnings: [
          '❌ Başı fazla geriye yatırmayın (hava yolunu tıkayabilir)',
          '❌ Yumuşak dokuya basmayın (sadece çene kemiğine)',
          '❌ Boynu aşırı eğmeyin',
          '🚨 TRAVMA ŞÜPHESİ varsa (düşme, kaza) → Sadece çene kaldır, başı geriye yatırma',
        ],
        tips: [
          'Bebeklerde başı nötr pozisyonda (çok az geriye)',
          'Çene yukarı, boyun düz',
          'Ağızda yabancı cisim varsa çıkar',
        ],
        image: '/guides/infant-head-tilt-chin-lift.png',
        video: '/videos/infant-airway-opening.mp4',
      },
      {
        stepNumber: 4,
        title: 'Nefes Kontrolü (5-10 Saniye)',
        instruction: 'Kulağınızı bebeğin ağzına yaklaştırın. BAK-DİNLE-HİSSET: Göğsü yükseliyor mu? (BAK) - Nefes sesi geliyor mu? (DİNLE) - Yanağınızda hava hissediyor musunuz? (HİSSET). 5-10 saniye kontrol edin.',
        duration: '5-10 saniye',
        criticalStep: true,
        warnings: [
          '❌ 10 saniyeden fazla beklemeyin',
          '❌ Agonal nefes (gasping) = Nefes ALMAMA sayılır → CPR yapın',
          '❌ Göğüs hafif kıpırdasa da düzenli nefes yoksa → CPR',
        ],
        tips: [
          'Agonal breathing: Seyrek, düzensiz, zor nefes (CPR gerekir)',
          'Normal nefes: Düzenli, göğüs yükselir',
          'Şüphede kaldıysanız → CPR yapın',
        ],
      },
      {
        stepNumber: 5,
        title: '30 GÖĞÜS BASISI',
        instruction: 'İKİ PARMAK TEKNİĞİ: İşaret ve orta parmağınızı göğüs kemiğinin ORTASINA (meme başları hizasının hemen altı) yerleştirin. 30 kez HIZLI ve SERT basın. Derinlik: Göğsün 1/3\'ü (yaklaşık 4 cm). Hız: Dakikada 100-120 (saniyede 2 basış ritmi).',
        duration: '18-20 saniye (30 basış)',
        criticalStep: true,
        warnings: [
          '❌ KARNI BASMAYIN (iç organ hasarı - ölümcül)',
          '❌ Göğüs kemiğinin ucuna (xiphoid) basmayın (karaciğer hasarı)',
          '❌ Çok hafif basmayın (etkisiz)',
          '❌ Basışlar arasında ellerinizi kaldırmayın',
          '❌ Her basış arasında göğüs tamamen yükselsin',
          '❌ Yavaş basmayın (etkisiz)',
        ],
        tips: [
          'Ritim: "Staying Alive" şarkısının ritmi (100-120 bpm)',
          'Düz, sert zemine basın',
          'Dirseklerinizi kilitleyin',
          'Vücut ağırlığınızı kullanın',
          'Her basışta göğsü 4 cm çökmeli',
          'İki parmak: Bebeklerde yeterli',
          'Alternatif: İki başparmak tekniği (daha etkili ama eğitim gerekir)',
        ],
        image: '/guides/infant-chest-compressions.png',
        video: '/videos/infant-cpr-compressions.mp4',
      },
      {
        stepNumber: 6,
        title: '2 SUNİ SOLUNUM (Rescue Breaths)',
        instruction: 'Hava yolunu açın (baş geriye, çene yukarı). Derin nefes alın. Ağzınızla bebeğin AĞIZ ve BURNUNU tamamen kapatın. 1 SANİYE boyunca üfleyin (göğsün yükseldiğini görene kadar). 1 saniye bekleyin (göğüs insin). İkinci nefesi verin. TOPLAM 2 NEFES.',
        duration: '5-6 saniye (2 nefes)',
        criticalStep: true,
        warnings: [
          '❌ Çok sert üflemeyin (mide şişmesi, akciğer hasarı)',
          '❌ Sadece göğüs yükselene kadar üfleyin',
          '❌ Hava yolu açık değilse nefes girmez → Başı tekrar ayarlayın',
          '❌ 2 nefesten fazla denemeyin (zaman kaybı)',
          '❌ Ağız-burun kapatmazsa hava kaçar',
        ],
        tips: [
          'Bebeklerde: Ağız VE burun birlikte kapatılır',
          'Yavaş ve sakin üfleyin (1 saniye)',
          'Göğsü yükselirse DOĞRU',
          'Yükselmezse → Başı tekrar ayarla → 1 kez daha dene → Sonra göğüs basısına dön',
          'Mide şişmesi normaldir (kusma riski)',
        ],
        image: '/guides/infant-rescue-breaths.png',
        video: '/videos/infant-cpr-breaths.mp4',
      },
      {
        stepNumber: 7,
        title: 'DÖNGÜ: 30 Basış + 2 Nefes',
        instruction: 'Şimdi döngüyü tekrarlayın: 30 göğüs basısı → 2 suni solunum → 30 basış → 2 nefes... Yardım gelene veya bebek hareket edene kadar DURMADAN devam edin.',
        duration: 'Yardım gelene kadar',
        criticalStep: true,
        warnings: [
          '❌ DURMAK YOK - Yorulsanız bile devam',
          '❌ Başka teknikler denemeyin',
          '❌ "Ölmüş" diye vazgeçmeyin',
          '❌ Suni solunum yapamıyorsanız → Sadece göğüs basısı bile yapın',
        ],
        tips: [
          'Her 2 dakikada kontrol edin (tepki var mı?)',
          'Yorulursanız biri varsa değişin',
          '5 döngü = yaklaşık 2 dakika',
          'Telefon açık tutun (operatör yardımcı olur)',
          'AED/DEFİBRİLATÖR gelirse HEMEN kullanın',
        ],
      },
      {
        stepNumber: 8,
        title: 'Tepki Kontrolü (Her 2 Dakikada)',
        instruction: 'Her 5 döngü (yaklaşık 2 dakika) sonra hızlıca kontrol edin: Nefes almaya başladı mı? Hareket ediyor mu? Öksürüyor mu? EVET ise → İyileşme pozisyonu. HAYIR ise → CPR devam.',
        duration: '5 saniye kontrol',
        criticalStep: false,
        warnings: [
          '❌ Uzun süre durmayın (max 10 saniye)',
          '❌ Çok sık kontrol etmeyin (CPR kesilir)',
        ],
        tips: [
          'Nefes alıyorsa → Yan yatır (iyileşme pozisyonu)',
          'Hala tepkisizse → CPR devam',
          'AED varsa → Her 2 dakikada analiz',
        ],
      },
    ],
    
    doNots: [
      '❌ KARNI BASMAYIN (ölümcül iç organ hasarı)',
      '❌ Göğüs kemiğinin ucuna basmayın (karaciğer yaralanması)',
      '❌ CPR\'ı bilmiyorum diye yapmayın → Sadece göğüs basısı bile yeterli',
      '❌ Çok hafif basmayın (etkisiz olur)',
      '❌ Çok sert üflemeyin (akciğer patlaması)',
      '❌ İlk 2 dakikada telefon aramakla zaman kaybetmeyin (önce CPR)',
      '❌ Bebeği sarsarak uyandırmayı denemeyin',
      '❌ Yoruldum diye durmayın → Yardım gelene kadar devam',
      '❌ Nabız kontrol etmekle vakit kaybetmeyin (profesyoneller bile zor bulur)',
    ],
    
    whenToSeekHelp: {
      call112Immediately: [
        '🚨 Bebeği uyandıramıyorsanız → HEMEN 112 (veya 2 dk CPR sonrası)',
        '🚨 Nefes almıyorsa → HEMEN 112 + CPR',
        '🚨 Bilinçsizse → HEMEN 112 + CPR',
        '🚨 Boğulma, suda boğulma, elektrik çarpması → 112 + CPR',
      ],
      goToER: [
        '⚠️ CPR sonrası kendine geldi ama → Mutlaka acil servise',
        '⚠️ Nefes almaya başladı ama hala bilinçsiz → Acil',
      ],
      callDoctor: [
        'CPR sonrası mutlaka hastane kontrolü gerekir',
      ],
      monitor: [
        'CPR gerektiren durumlar için ev takibi YOK - mutlaka hastane',
      ],
    },
    
    afterCare: {
      nextSteps: [
        'Bebek kendine geldi bile olsa MUTLAKA hastaneye',
        'CPR sırasında kaburga kırılması olabilir (normal)',
        'Nörolojik değerlendirme gerekir',
        'Göğüs röntgeni çekilecek',
      ],
      monitoring: [
        'Nefes takibi (sonraki 24-48 saat)',
        'Bilinç durumu',
        'Kusma var mı?',
        'Nöbet geçirdi mi?',
      ],
      followUp: [
        'Kardiyoloji kontrolü',
        'Nöroloji kontrolü',
        'Olay sonrası psikolojik destek',
      ],
    },
    
    prevention: [
      '✓ Güvenli uyku ortamı (sırtüstü, sert yatak, yorgan/yastık yok)',
      '✓ SIDS (Ani Bebek Ölümü) riskini azaltın',
      '✓ Boğulma risklerini ortadan kaldırın',
      '✓ Banyo sırasında gözetimsiz bırakmayın',
      '✓ Havuz/deniz kenarında sürekli gözetim',
      '✓ İlk Yardım ve CPR eğitimi alın (her ebeveyn bilmeli)',
      '✓ Acil numaraları telefona kaydedin',
      '✓ En yakın hastane yolunu bilin',
    ],
    
    emergencyContacts: [
      {
        service: '112 Acil Sağlık',
        number: '112',
        when: 'HER BİLİNÇSİZ BEBEK durumu',
      },
      {
        service: 'Ambulans',
        number: '112',
        when: 'Acil ulaşım',
      },
    ],
    
    resources: {
      videoUrl: '/videos/infant-cpr-complete-guide.mp4',
      externalLinks: [
        'https://www.heart.org/en/cpr',
        'https://www.cocukacil.org',
      ],
      relatedGuides: ['choking-infant-0-12', 'breathing-problems', 'drowning'],
    },
    
    metadata: {
      lastUpdated: '2024-11-16',
      source: 'American Heart Association (AHA) 2020 Guidelines, Türk Pediatri Derneği',
      reviewedBy: 'Pediatrik Acil Uzmanı, Kardiyoloji Uzmanı',
    },
  },
  
  {
    id: 'high-fever-infant-0-24',
    category: 'hastalik',
    emergency: 'urgent',
    title: 'Yüksek Ateş Yönetimi (0-24 Ay)',
    subtitle: 'Ateş Düşürme ve Acil Durum Tanıma',
    ageRange: '0-24 ay',
    quickSummary: 'YÜKSEK ATEŞ',
    icon: 'thermometer',
    color: '#F59E0B',
    
    recognition: {
      mainSymptoms: [
        'Rektal ölçümde 38°C ve üzeri',
        'Koltuk altı ölçümde 37.5°C ve üzeri',
        'Alnından ölçümde 37.8°C ve üzeri',
        'Bebeğin vücudu çok sıcak',
        'Kızarıklık, terleme',
        'Huzursuzluk, ağlama',
      ],
      whenToActImmediately: [
        '🚨 3 ayın altında HERHANGI bir ateş (38°C+) → HEMEN doktora',
        '🚨 40°C ve üzeri ateş → Acil servis',
        '🚨 Nöbet geçirdi → 112 ara',
        '🚨 Bilinç değişikliği → 112 ara',
        '⚠️ 38.5°C üzeri ateş → Ateş düşürücü ver + izle',
      ],
      severityIndicators: {
        mild: [
          '37.5-38°C (Subfebril - hafif ateş)',
          'Oyun oynayabiliyor',
          'İyi su içiyor',
          'Uyku düzeni normal',
        ],
        moderate: [
          '38-39.5°C (Orta şiddette ateş)',
          'Huzursuz ama oyun oynayabiliyor',
          'Az su içiyor',
          'Uyku bölünmüş',
          'Kıyafetleri ıslatan terleme',
        ],
        severe: [
          '39.5-40°C+ (Yüksek ateş)',
          'Çok huzursuz, sürekli ağlıyor',
          'Su içmiyor',
          'Uyuyamıyor',
          'Titreme, nöbet riski',
          'Dehidratasyon belirtileri',
        ],
      },
    },
    
    steps: [
      {
        stepNumber: 1,
        title: 'Ateş Ölçümü (Doğru Yöntem)',
        instruction: '0-3 ay: REKTAL ölçüm en doğrudur (termometre ucunu 1-2 cm sokin). 3+ ay: Koltuk altı veya alından ölçülebilir. Kulak ölçümü 6 ay altında güvenilir değil. Ölçümü kaydedin.',
        duration: '2-3 dakika',
        criticalStep: true,
        warnings: [
          '❌ Ağız ölçümü bebeklerde YAPMAYIN',
          '❌ Cıva termometre KULLANMAYIN (zehirlenme riski)',
          '❌ Kıyafetleri üzerinde koltuk altı ölçmeyin',
          '❌ Rektal ölçümde zorlamayın',
        ],
        tips: [
          'Rektal: En doğru (ancak 3 ay üzeri için koltuk altı yeterli)',
          'Koltuk altı: 5 dakika bekle → 0.5°C ekle',
          'Alından: Hızlı ama biraz daha az doğru',
          'Dijital termometre tercih edin',
          'Ateş sabah daha düşük, akşam daha yüksek olabilir',
        ],
        image: '/guides/fever-measurement-infant.png',
      },
      {
        stepNumber: 2,
        title: 'ACİL DURUM DEĞERLENDİRMESİ',
        instruction: '🚨 3 AYIN ALTINDA 38°C+ → HEMEN DOKTORA / ACİL SERVİS. 🚨 40°C+ → Acil servis. 🚨 Nöbet/bilinç değişikliği → 112 ara. ⚠️ Diğer durumlar → Adım 3\'e geç.',
        duration: '30 saniye',
        criticalStep: true,
        warnings: [
          '🚨 3 ay altı bebekte ateş → CİDDİ ENFEKSİYON riski',
          '🚨 Bağışıklık sistemi henüz gelişmedi',
          '🚨 Menenjit, sepsis riski yüksek',
          '❌ Ateş düşürücü verip evde beklemeyin',
        ],
        tips: [
          '3 ay altı: Herhangi bir ateş acildir',
          '3-6 ay: 39°C+ acil',
          '6+ ay: 40°C+ acil',
          'Nöbet: Febrile seizure (ateşli havale) → 112',
        ],
      },
      {
        stepNumber: 3,
        title: 'Ateş Düşürücü İlaç (Parasetamol/İbuprofen)',
        instruction: 'PARASETAMOL (asetaminofen): Tüm yaşlar için güvenli. Doz: 10-15 mg/kg, 4-6 saatte bir. İBUPROFEN: 6 ay üzeri için. Doz: 5-10 mg/kg, 6-8 saatte bir. İlaç prospektüsündeki dozaj tablosuna uyun.',
        duration: '30-60 dakikada etki başlar',
        criticalStep: true,
        warnings: [
          '❌ ASPİRİN ASLA VERME (Reye sendromu riski - ölümcül)',
          '❌ Yetişkin ilaçları VERME',
          '❌ Doz aşımı yapma (karaciğer hasarı)',
          '❌ Parasetamol + İbuprofen karıştırma (doktor onayı olmadan)',
          '❌ Ateş 38.5°C altındaysa ilaç gereksiz',
          '❌ İlaç verip üstünü örtme (ateş yükselir)',
        ],
        tips: [
          'Parasetamol: Her 4-6 saatte, max 4 doz/gün',
          'İbuprofen: Her 6-8 saatte, max 3 doz/gün',
          'Şurup/damla: Kiloya göre doz ayarlayın',
          'Boş mideye verilebilir',
          'İlaç dozunu kiloya göre hesaplayın (yaşa değil)',
        ],
        image: '/guides/fever-medication-dosage.png',
      },
      {
        stepNumber: 4,
        title: 'Ilık Su İle Silme (Opsiyonel)',
        instruction: 'Ateş 39°C+ ve ilaç vermişseniz: Ilık su (29-32°C) ile bebeğin vücudunu silebilirsiniz. ALNINI soğuk su veya ıslak bez ile silebilirsiniz. 10-15 dakika uygulayın.',
        duration: '10-15 dakika',
        criticalStep: false,
        warnings: [
          '❌ SOĞUK SU KULLANMAYIN (titreme → ateş yükselir)',
          '❌ ALKOL SİLME ASLA (zehirlenme, koma riski)',
          '❌ SIRKE SİLME KULLANMAYIN (cilt tahriş)',
          '❌ Buz KULLANMAYIN (damar daralması)',
          '❌ İlaç vermeden sadece silme → Etkisiz',
        ],
        tips: [
          'Ilık su: El sıcaklığında (29-32°C)',
          'Alın, boyun, koltuk altı, kasıklara odaklan',
          'Bebek titrediyse HEMEN DURDUR',
          'İlaç + Ilık silme kombine daha etkili',
          'Ateş düşünce kurula',
        ],
      },
      {
        stepNumber: 5,
        title: 'Sıvı Alımını Artır (Dehidratasyon Önleme)',
        instruction: 'Bol bol anne sütü veya mama verin. 6 ay+: Su, seyreltilmiş meyve suyu verebilirsiniz. Ateş sıvı kaybını artırır. Sık sık emzirin/mama verin.',
        duration: 'Devam ediyor',
        criticalStep: true,
        warnings: [
          '❌ 6 ay altına su vermeyin (anne sütü/mama yeterli)',
          '❌ Şekerli içecek vermeyin (dehidratasyon kötüleşir)',
          '❌ Zorla içirmeyin (kusma riski)',
        ],
        tips: [
          'Sık sık az miktarda verin',
          'İçmiyorsa kaşık kaşık deneyin',
          'Dehidratasyon belirtileri: Kuru dudak, az idrar, çökük göz',
          'İdrar rengi açık sarı olmalı',
          'İdrar sayısı günde 6+ olmalı',
        ],
      },
      {
        stepNumber: 6,
        title: 'Rahat Kıyafet ve Oda Sıcaklığı',
        instruction: 'Bebeği GEREĞİNDEN FAZLA GIYDIRME. Tek kat, ince pamuklu kıyafet yeterli. Oda sıcaklığı 20-22°C ideal. Odayı havalandırın (pencere açın).',
        duration: 'Devam ediyor',
        criticalStep: false,
        warnings: [
          '❌ Battaniye ile ÖRTMEYİN (ateş yükselir)',
          '❌ Çok sıcak oda → Ateş düşmez',
          '❌ Aşırı soğuk oda → Titreme',
        ],
        tips: [
          'Tek kat ince kıyafet',
          'Başlık çıkarın',
          'Oda 20-22°C (klimayı 24-25°C yapın)',
          'Pencereyi açık bırakın (hava akımı olmalı)',
        ],
      },
      {
        stepNumber: 7,
        title: 'Ateş Takibi (Her 2-4 Saatte Ölç)',
        instruction: 'Ateşi her 2-4 saatte bir ölçün ve kaydedin. İlaç verdiğinizde saati not edin. Ateş düşmüyorsa veya 24 saat geçtiyse doktora gidin.',
        duration: '24-48 saat takip',
        criticalStep: true,
        warnings: [
          '⚠️ 24 saatten uzun süren ateş → Doktora',
          '⚠️ 48 saatten uzun süren ateş → Mutlaka doktor',
          '⚠️ Ateş düştükten sonra tekrar yükseldi → Doktor',
        ],
        tips: [
          'Ateş günlüğü tutun: Saat, derece, ilaç',
          'Gece ateşi daha yüksek olabilir',
          'Diğer semptomları da kaydedin',
          'Yemek yedi mi? İdrar yaptı mı?',
        ],
      },
      {
        stepNumber: 8,
        title: 'Diğer Semptomları İzle',
        instruction: 'Ateşle birlikte şu belirtiler var mı kontrol edin: Kusma, ishal, döküntü, öksürük, burun akıntısı, kulak çekme, huzursuzluk. Bunlar altta yatan hastalığın ipucudur.',
        duration: 'Devam ediyor',
        criticalStep: false,
        warnings: [],
        tips: [
          'Kulak çekme → Kulak enfeksiyonu',
          'Öksürük + burun → Soğuk algınlığı',
          'İshal + kusma → Gastroenterit',
          'Döküntü → Viral enfeksiyon veya kızamık',
          'Huzursuzluk + ateş → Diş çıkartma (düşük ateş)',
        ],
      },
    ],
    
    doNots: [
      '❌ ASPİRİN vermeyin (Reye sendromu - ölümcül)',
      '❌ 3 ay altı bebeğe ateş düşürücü verip evde KALMAYIN → Doktora',
      '❌ ALKOL ile silmeyin (zehirlenme riski)',
      '❌ SOĞUK su/buz kullanmayın (titreme → ateş yükselir)',
      '❌ Battaniye ile sarıp terletmeyin (tehlikeli)',
      '❌ Yetişkin ilaçlarını vermeyin',
      '❌ İlaç dozunu aşmayın (karaciğer hasarı)',
      '❌ Antibiyotik istemeyin (viral enfeksiyonlarda işe yaramaz)',
      '❌ 48 saatten uzun evde beklemeyin',
    ],
    
    whenToSeekHelp: {
      call112Immediately: [
        '🚨 Nöbet (febrile seizure) geçirdi',
        '🚨 Bilinç kaybı, aşırı uyuşukluk',
        '🚨 Nefes darlığı, siyanoz (mavi renk)',
        '🚨 Ense sertliği (menenjit şüphesi)',
        '🚨 Mor lekeli döküntü (menenjit/sepsis)',
      ],
      goToER: [
        '⚠️ 3 AY ALTINDA herhangi bir ateş (38°C+)',
        '⚠️ 40°C ve üzeri ateş',
        '⚠️ 24 saatten uzun devam eden yüksek ateş (39°C+)',
        '⚠️ Dehidratasyon belirtileri (idrar yok, ağlayınca gözyaşı yok)',
        '⚠️ Sürekli kusma (su tutamıyor)',
        '⚠️ Çok huzursuz, teselli edilemiyor',
        '⚠️ Aşırı uyuşuk, uyandıramıyorsunuz',
      ],
      callDoctor: [
        '⚠️ 48 saatten uzun devam eden ateş',
        '⚠️ Ateş düşürücü ile ateş düşmüyor',
        '⚠️ Yeni semptomlar eklendi (öksürük, ishal, döküntü)',
        '⚠️ Kulak çekme, huzursuzluk',
        '⚠️ İdrar yaparken ağlama (idrar yolu enfeksiyonu)',
      ],
      monitor: [
        'Ateş 38.5°C altında ve bebek iyi → Evde izle',
        'İlaç ile ateş düşüyor ve oyun oynayabiliyor → İzle',
        'Sıvı alıyor ve idrar yapıyor → İzle',
      ],
    },
    
    afterCare: {
      nextSteps: [
        'Ateş düştükten sonra 24 saat daha izleyin',
        'Altta yatan hastalığı tedavi edin (kulak enfeksiyonu, boğaz, vb.)',
        'Aşı sonrası ateş 24-48 saat normal olabilir',
      ],
      monitoring: [
        'Ateş tekrar yükseldi mi?',
        'Yeni semptomlar eklendi mi?',
        'Yemek yiyor mu?',
        'Sıvı alıyor mu?',
        'Oyun oynayabiliyor mu?',
      ],
      followUp: [
        'Ateş 3 günden uzun sürdüyse doktor kontrolü',
        'Antibiyotik tedavisi başladıysa kontrol',
      ],
    },
    
    prevention: [
      '✓ Aşı takvimine uyun (birçok enfeksiyonu önler)',
      '✓ Hijyen: Sık el yıkama',
      '✓ Hasta kişilerden uzak tutun',
      '✓ Kalabalık ortamlardan kaçının (özellikle 3 ay altı)',
      '✓ Bol sıvı verin (bağışıklık güçlendirir)',
      '✓ Yeterli uyku (bağışıklık için kritik)',
      '✓ Anne sütü (doğal bağışıklık)',
    ],
    
    emergencyContacts: [
      {
        service: '112 Acil Sağlık',
        number: '112',
        when: 'Nöbet, bilinç değişikliği, nefes darlığı',
      },
      {
        service: 'Aile Hekimi',
        number: '(Kendi numaranız)',
        when: 'Ateş devam ediyor, yeni semptomlar',
      },
      {
        service: 'Eczane Danışma',
        number: '(Yerel eczane)',
        when: 'İlaç dozu, yan etki soruları',
      },
    ],
    
    resources: {
      relatedGuides: ['seizures', 'dehydration', 'meningitis-signs'],
    },
    
    metadata: {
      lastUpdated: '2024-11-16',
      source: 'American Academy of Pediatrics (AAP), Türk Pediatri Derneği, WHO',
      reviewedBy: 'Pediatri Uzmanı, Enfeksiyon Hastalıkları Uzmanı',
    },
  },
  
  {
    id: 'head-trauma-falls-0-24',
    category: 'yaralanma',
    emergency: 'urgent',
    title: 'Düşme ve Kafa Travması (0-24 Ay)',
    subtitle: 'Baş Yaralanması Değerlendirme ve Müdahale',
    ageRange: '0-24 ay',
    quickSummary: 'DÜŞME / KAFA TRAVMASI',
    icon: 'alert-circle',
    color: '#DC2626',
    
    recognition: {
      mainSymptoms: [
        'Yüksekten düştü (masa, kanepe, değiştirme sehpası, merdiven)',
        'Başına darbe aldı',
        'Kafasında şişlik/morluk',
        'Kesik veya kanama (saçlı deride)',
        'Ağlama (düşme sonrası)',
      ],
      whenToActImmediately: [
        '🚨 Bilinç kaybı (1 saniye bile) → 112',
        '🚨 Nöbet geçirdi → 112',
        '🚨 Kusma (özellikle tekrarlayan) → Acil servis',
        '🚨 Aşırı uyuşukluk, uyandıramıyorsunuz → 112',
        '🚨 1 metre+ yükseklikten düştü → Acil servis',
        '🚨 Merdivenden düştü → Acil servis',
        '⚠️ Hafif düşme + normal davranış → İzle',
      ],
      severityIndicators: {
        mild: [
          'Kısa süre ağladı, sonra sakinleşti',
          'Oyun oynuyor, normal davranışlar',
          'Yerden düştü (30 cm altı)',
          'Bilinç kaybı yok',
          'Kusma yok',
          'Göz teması yapıyor',
        ],
        moderate: [
          'Orta yükseklikten düştü (30-60 cm: kanepe)',
          'Uzun süre ağladı',
          'Hafif uyuşukluk (az hareketli)',
          'Küçük şişlik/morluk var',
          '1 kez kusma',
        ],
        severe: [
          'Yüksekten düştü (1 metre+: masa, merdiven)',
          'Bilinç kaybı (anında veya sonradan)',
          'Tekrarlayan kusma',
          'Aşırı uyuşuk, tepkisiz',
          'Nöbet',
          'Gözden/kulaktan sıvı/kan geldi',
          'Pupiller farklı boyutlarda',
          'Nefes düzensizliği',
        ],
      },
    },
    
    steps: [
      {
        stepNumber: 1,
        title: 'SAKİN KAL ve GÜVENLİK KONTROLÜ',
        instruction: 'Panik yapmayın. Bebeği HAREKET ETTİRMEYİN (boyun/omurga yaralanması riski). Düştüğü yeri kontrol edin. Yükseklik ne kadar? Sert zemin mi? Keskin cisim var mıydı?',
        duration: '10 saniye',
        criticalStep: true,
        warnings: [
          '❌ Hemen kucağa almayın (omurga hasarı riski)',
          '❌ Sarsmayın',
          '❌ Zorla uyandırmayın',
          '🚨 Boyun/sırt yaralanması ŞÜPHESİ varsa → HAREKET ETTİRMEYİN → 112',
        ],
        tips: [
          'Yükseklik < 50 cm + sert zemin → Genelde güvenli',
          'Yükseklik > 1 metre → Riskli',
          'Merdiven düşmeleri → Çok riskli',
          'Halı/yumuşak zemin → Daha güvenli',
        ],
      },
      {
        stepNumber: 2,
        title: 'BİLİNÇ ve TEPKİ DEĞERLENDİRMESİ',
        instruction: 'Bebeğin bilinci açık mı? Göz teması yapıyor mu? Ağlıyor mu? Normal tepki veriyor mu? BİLİNÇ KAYBI varsa → HEMEN 112 ARA.',
        duration: '10-20 saniye',
        criticalStep: true,
        warnings: [
          '🚨 1 SANİYE bile bilinç kaybı → 112 + ACİL SERVİS',
          '🚨 Bayıldı sonra kendine geldi → Yine de acil servis',
          '🚨 Tepkisiz → 112',
        ],
        tips: [
          'Normal: Hemen ağlar, göz teması yapar',
          'Riskli: Ağlamıyor, tepkisiz, bakışlar boş',
          'İlk 5 dakika çok kritik',
        ],
      },
      {
        stepNumber: 3,
        title: 'KANAMA KONTROLÜ',
        instruction: 'Kafasında kesik/kanama var mı kontrol edin. Saçlı deride kanama çok fazla görünebilir (normal). TEMİZ BEZ ile 10 dakika baskı yapın. Kanama durmazsa → Acil servis.',
        duration: '10 dakika baskı',
        criticalStep: false,
        warnings: [
          '❌ Yarayı silmeyin (enfeksiyon)',
          '❌ Pamuk kullanmayın (yapışır)',
          '❌ Alkol/oksijenli su dökmeyin (acı verir)',
          '⚠️ 10 dakika baskıya rağmen kanama durmazsa → Acil',
        ],
        tips: [
          'Temiz bez/gazlı bezle baskı',
          'Saçlı deri: Çok kanar (damarlar yoğun)',
          'Kanama genelde 5-10 dakikada durur',
          'Kanama durdu + küçük kesik → Evde tedavi',
          'Derin kesik (1 cm+) → Dikiş gerekir → Acil',
        ],
        image: '/guides/head-wound-pressure.png',
      },
      {
        stepNumber: 4,
        title: 'SOĞUK UYGULAMA (Şişlik İçin)',
        instruction: 'Kafasında ŞİŞLİK varsa: Buz torbası veya soğuk kompres (havlu içinde) 15-20 dakika uygulayın. 1 saat ara verin, tekrarlayın. İlk 24-48 saat boyunca uygulayın.',
        duration: '15-20 dakika (her saat)',
        criticalStep: false,
        warnings: [
          '❌ Direkt buz cilte temas ettirmeyin (donma)',
          '❌ Aşırı sert baskı yapmayın',
        ],
        tips: [
          'Buz torbasını havluya sarın',
          'Alternatif: Soğuk kaşık, dondurulmuş bezelye paketi',
          'Şişlik normal → Kan toplanması',
          'İlk 24 saat en çok şişer',
          '48 saatten sonra sıcak kompres (kan dağılması için)',
        ],
        image: '/guides/cold-compress-head.png',
      },
      {
        stepNumber: 5,
        title: '24 SAAT YAKIN TAKİP (Kritik Dönem)',
        instruction: 'İLK 24 SAAT çok kritik. Bebeği sürekli gözlemleyin. İç kanama semptomları 24 saat içinde ortaya çıkabilir. Her 2 saatte bir kontrol edin. Gece uyurken 2-3 kez uyandırıp kontrol edin.',
        duration: '24-48 saat takip',
        criticalStep: true,
        warnings: [
          '🚨 TAKİP EDİLMESİ GEREKEN TEHLİKE BELİRTİLERİ:',
          '🚨 Kusma (özellikle tekrarlayan)',
          '🚨 Aşırı uyuşukluk (uyandıramıyorsunuz)',
          '🚨 İrritabilite (sürekli ağlama, teselli olmama)',
          '🚨 Nöbet',
          '🚨 Gözden/kulaktan sıvı gelmesi',
          '🚨 Pupiller farklı boyut',
          '🚨 Güçsüzlük (kol/bacak hareket ettiremiyor)',
          '🚨 Dengede bozukluk',
          '🚨 Konuşma/ses değişikliği',
          '🚨 Şiddetli baş ağrısı (daha büyük çocuklar)',
        ],
        tips: [
          'İlk 6 saat en kritik',
          'Gece: 2 saatte bir kontrol',
          'Semptom VARSA → Hemen acil',
          'Semptom YOKSA → İzlemeye devam',
        ],
      },
      {
        stepNumber: 6,
        title: 'NORMAL AKTİVİTE İZİN VER (Ama Dikkatli)',
        instruction: 'Bebek normal davranıyorsa: Oyun oynayabilir, yemek yiyebilir, uyuyabilir. Ancak ZORLU AKTİVİTELERDEN kaçının (zıplama, sallanma, koşma). İlk 24-48 saat sakin aktiviteler.',
        duration: '48 saat dikkat',
        criticalStep: false,
        warnings: [
          '❌ Zorlu oyunlar yapmayın (zıplama, sallanma)',
          '❌ Tekrar düşme riski olan yerlerden uzak tutun',
        ],
        tips: [
          'Normal yemek/içmek → İyi işaret',
          'Oyun oynama → İyi işaret',
          'Uyku → Normal (ama her 2 saatte kontrol)',
        ],
      },
      {
        stepNumber: 7,
        title: 'AĞRI KESİCİ (Gerekirse)',
        instruction: 'Ağrı varsa: PARASETAMOL verebilirsiniz (10-15 mg/kg). İBUPROFEN VERMEYİN (ilk 48 saat - kanama riskini artırır).',
        duration: 'Gerektiğinde',
        criticalStep: false,
        warnings: [
          '❌ İlk 48 saat İBUPROFEN VERMEYIN (kanama riski)',
          '❌ ASPİRİN ASLA (Reye sendromu)',
        ],
        tips: [
          'Parasetamol güvenli',
          '48 saat sonra ibuprofen verilebilir',
        ],
      },
      {
        stepNumber: 8,
        title: 'DOKTOR KONTROLÜ (Gerekli Durumlar)',
        instruction: 'Şu durumlarda MUTLAKA doktora gidin: Yüksekten düşme (1m+), bilinç kaybı oldu, kusma var, davranış değişikliği, şişlik giderek büyüyor, kanama durmuyor.',
        duration: 'Hemen veya 24 saat içinde',
        criticalStep: true,
        warnings: [],
        tips: [
          'Hafif düşme + normal → Doktor gerekmez',
          'Orta/yüksek düşme → Doktor kontrol',
          'Herhangi bir anormallik → Doktor',
        ],
      },
    ],
    
    doNots: [
      '❌ Boyun/omurga yaralanması şüphesinde HAREKET ETTİRMEYİN',
      '❌ Bebeği SARSMAYIN (beyin hasarı)',
      '❌ İlk 48 saat İBUPROFEN vermeyin (kanama riski)',
      '❌ ASPİRİN vermeyin (Reye sendromu)',
      '❌ Direkt BUZ cilte temas ettirmeyin',
      '❌ Kesik/yarayı silmeyin (enfeksiyon)',
      '❌ TEHLİKE BELİRTİLERİNİ görmezden gelmeyin',
      '❌ "Hafif düştü, bir şey olmaz" demeyin → 24 saat izleyin',
    ],
    
    whenToSeekHelp: {
      call112Immediately: [
        '🚨 BİLİNÇ KAYBI (1 saniye bile)',
        '🚨 NÖBET',
        '🚨 NEFES DARLIĞI',
        '🚨 AŞIRI UYUŞUK (uyandıramıyorsunuz)',
        '🚨 Gözden/kulaktan SIVI/KAN gelmesi',
        '🚨 Boyun/sırt yaralanması ŞÜPHESİ',
      ],
      goToER: [
        '⚠️ 1 METRE+ yükseklikten düştü',
        '⚠️ MERDİVENDEN düştü',
        '⚠️ TEKRARLAYAN KUSMA',
        '⚠️ ŞİDDETLİ AĞLAMA (teselli olmama)',
        '⚠️ DAVRANŞ DEĞİŞİKLİĞİ',
        '⚠️ PUPİLLER FARKLI BOYUT',
        '⚠️ GÜÇSÜZLük (kol/bacak hareket ettiremiyor)',
        '⚠️ KANAMA DURMUYOR (10 dk baskıdan sonra)',
        '⚠️ ŞİŞLİK giderek BÜYÜYOR',
      ],
      callDoctor: [
        '⚠️ Orta yükseklikten düşme (kanepe, yatak)',
        '⚠️ Davranışta hafif değişiklik',
        '⚠️ 1 kez kusma',
        '⚠️ Emin değilseniz',
      ],
      monitor: [
        'Yerden düştü (30 cm altı) + Normal davranış → 24 saat izle',
        'Küçük şişlik + Normal → Soğuk kompres + İzle',
      ],
    },
    
    afterCare: {
      nextSteps: [
        'İlk 24-48 saat dikkatli takip',
        'Zorlu aktivitelerden kaçının (1 hafta)',
        'Şişlik 2-3 günde azalır',
        'Morluk 1-2 haftada geçer',
      ],
      monitoring: [
        'Kusma var mı?',
        'Normal yiyor/içiyor mu?',
        'Oyun oynuyor mu?',
        'Uyku normal mi?',
        'Davranışı normal mi?',
      ],
      followUp: [
        'Ciddi düşme sonrası: 24-48 saat içinde doktor kontrolü',
        'Semptom gelişirse: Hemen acil',
      ],
    },
    
    prevention: [
      '✓ Değiştirme sehpasında ASLA yalnız bırakmayın',
      '✓ Kanepe/yatakta uyurken kenarları koruyun',
      '✓ Merdiven girişine güvenlik kapısı',
      '✓ Yüksek yerlere tırmanmasına izin vermeyin',
      '✓ Masa/sandalye kenarlarını köşe koruyucu ile kaplayın',
      '✓ Halı/yumuşak zemin kullanın',
      '✓ Pencere/balkon güvenliği (emniyet kilidi)',
      '✓ Mama sandalyesini her zaman kemerli kullanın',
      '✓ Yürüteçten (baby walker) kaçının (tehlikeli)',
    ],
    
    emergencyContacts: [
      {
        service: '112 Acil',
        number: '112',
        when: 'Bilinç kaybı, nöbet, ağır yaralanma',
      },
      {
        service: 'Zehir Danışma',
        number: '114',
        when: 'Zehirlenme şüphesi (düşme + ilaç/kimyasal)',
      },
    ],
    
    resources: {
      relatedGuides: ['cpr-infant-0-12', 'seizures', 'neck-spine-injury'],
    },
    
    metadata: {
      lastUpdated: '2024-11-16',
      source: 'American Academy of Pediatrics (AAP), Pediatric Trauma Guidelines, Türk Pediatri Derneği',
      reviewedBy: 'Pediatrik Acil Uzmanı, Nöroşirürji Uzmanı',
    },
  },
  
  {
    id: 'burns-treatment-0-24',
    category: 'yaralanma',
    emergency: 'urgent',
    title: 'Yanık Tedavisi (0-24 Ay)',
    subtitle: '1., 2., ve 3. Derece Yanık Müdahale',
    ageRange: '0-24 ay',
    quickSummary: 'YANIK',
    icon: 'flame',
    color: '#EF4444',
    
    recognition: {
      mainSymptoms: [
        'Sıcak sıvı/buhar teması (çay, kahve, çorba)',
        'Sıcak yüzey teması (ütü, fırın, soba)',
        'Elektrik teması',
        'Güneş yanığı',
        'Kimyasal temas',
        'Kızarıklık, ağrı',
        'Su toplama (blister)',
        'Cilt dökülmesi',
      ],
      whenToActImmediately: [
        '🚨 ELEKTRİK YANIĞI → 112 (kalp ritmi bozulabilir)',
        '🚨 YÜZ/AĞIZ/BOYUN yanığı → 112 (hava yolu tıkanması)',
        '🚨 GENIŞ ALAN yanığı (avuç içi+) → Acil servis',
        '🚨 3. DERECE yanık (beyaz/siyah cilt) → Acil',
        '🚨 KİMYASAL yanık → 20 dk su + Acil',
        '⚠️ Küçük 1. derece → Evde tedavi',
      ],
      severityIndicators: {
        mild: [
          '1. DERECE: Sadece kızarıklık',
          'Küçük alan (bozuk para boyutu)',
          'Ağrı var ama su toplama yok',
          'Yüzeysel',
        ],
        moderate: [
          '2. DERECE: Su toplama (blister)',
          'Orta alan (avuç içi boyutu)',
          'Şiddetli ağrı',
          'Parlak kırmızı/pembe cilt',
        ],
        severe: [
          '3. DERECE: Beyaz veya siyah yanmış cilt',
          'Derin, ağrı YOK (sinir hasarı)',
          'Geniş alan',
          'Yüz/boyun/el/genital bölge',
          'Elektrik yanığı',
          'Kimyasal yanık',
        ],
      },
    },
    
    steps: [
      {
        stepNumber: 1,
        title: 'GÜVENLİK - Isı Kaynağından Uzaklaştır',
        instruction: 'Bebeği ısı kaynağından (sıcak sıvı, ütü, soba) HEMEN uzaklaştırın. Elektrik yanığında: ÖNCe elektriği kesin, sonra dokunun. Kimyasal: Elbiseyi çıkarın (kimyasal temas etmesin).',
        duration: '5 saniye',
        criticalStep: true,
        warnings: [
          '❌ Elektrik yanığında dokunmadan önce ELEKTRİĞİ KESİN',
          '❌ Kimyasal yanıkta: Elbiseleri çıkarın (kimyasal yayılmasın)',
          '❌ Yanık bölgeyi örtmeyin (hemen soğutma gerekir)',
        ],
        tips: [
          'Sıcak sıvı: Hemen elbiseyi çıkarın (cilt yanmaya devam eder)',
          'Elektrik: Sigortayı at veya fişi çek',
          'Kimyasal: Su ile yıkamadan önce elbiseyi çıkar',
        ],
      },
      {
        stepNumber: 2,
        title: 'SOĞUK SU İLE SOĞUTMA (10-20 Dakika)',
        instruction: 'Yanık bölgeyi akan SOĞUK SU (15-25°C) altında 10-20 DAKİKA tutun. Akan su en iyisi. Soğutma ağrıyı azaltır ve doku hasarını durdurur.',
        duration: '10-20 dakika (kritik)',
        criticalStep: true,
        warnings: [
          '❌ BUZ KULLANMAYIN (doku hasarı, donma)',
          '❌ BUZ SUYU KULLANMAYIN (aşırı soğuk)',
          '❌ 10 dakikadan kısa tutmayın (yetersiz)',
          '❌ Krem, diş macunu, yoğurt SÜRMEYİN (enfeksiyon)',
          '❌ Yağ, tereyağı SÜRMEYİN (ısıyı tutar, kötüleştirir)',
        ],
        tips: [
          'Su sıcaklığı: Soğuk ama buz gibi değil (15-25°C)',
          'Akan su en etkili (çanak/kova değil)',
          'Soğutma ilk yardımın EN ÖNEMLİ adımı',
          '20 dakika ideal, min 10 dakika',
          'Ağrı azalırsa etkili oluyor demektir',
        ],
        image: '/guides/burn-cooling-water.png',
        video: '/videos/burn-cooling-technique.mp4',
      },
      {
        stepNumber: 3,
        title: 'YANIK DERECESİNİ BELİRLE',
        instruction: '1. DERECE: Sadece kızarıklık, su yok, hafif şişlik. 2. DERECE: Su toplama (blister), parlak kırmızı, şiddetli ağrı. 3. DERECE: Beyaz/siyah/kahverengi yanmış cilt, ağrı YOK (sinir ölmüş), derin.',
        duration: '30 saniye',
        criticalStep: true,
        warnings: [
          '⚠️ 2. DERECE (geniş alan) → Doktor',
          '🚨 3. DERECE → HEMEN acil servis',
          '🚨 YÜZ/Boyun/El/Genital → Acil',
        ],
        tips: [
          '1. Derece: Güneş yanığı gibi',
          '2. Derece: Su toplama (balon gibi)',
          '3. Derece: Deri yanmış (beyaz/siyah)',
          'Ağrı yok = 3. derece (kötü işaret)',
        ],
        image: '/guides/burn-degree-identification.png',
      },
      {
        stepNumber: 4,
        title: 'YANIĞI ÖRTME (Steril Gazlı Bez)',
        instruction: 'Soğutma bittikten sonra: STERİL veya TEMİZ, YAPIŞMAYAN gazlı bezle gevşekçe örtün. Hava alacak şekilde. Su toplamalarını (blister) PATLATMAYIN.',
        duration: '2-3 dakika',
        criticalStep: true,
        warnings: [
          '❌ PAMUK kullanmayın (yapışır, lif bırakır)',
          '❌ Su toplamalarını (blister) PATLATMAYIN (enfeksiyon)',
          '❌ Sıkı sarmayın (kan dolaşımı kesilir)',
          '❌ Bantla doğrudan yanığa yapıştırmayın',
          '❌ Yapışkan malzeme kullanmayın',
        ],
        tips: [
          'İdeal: Steril gazlı bez veya yanık örtüsü',
          'Alternatif: Temiz, ütülenmiş bez',
          'Yapışmaz yüzey (non-stick dressing) en iyi',
          'Gevşek örtün (hava alsın)',
          'Parmaklar arasına ayrı ayrı gazlı bez',
        ],
        image: '/guides/burn-dressing-application.png',
      },
      {
        stepNumber: 5,
        title: 'AĞRI YÖNETİMİ (İlaç)',
        instruction: 'Ağrı varsa: PARASETAMOL (10-15 mg/kg) veya İBUPROFEN (6 ay+, 5-10 mg/kg) verebilirsiniz. İbuprofen daha etkili (anti-inflamatuar).',
        duration: '30-60 dakika etki',
        criticalStep: false,
        warnings: [
          '❌ ASPİRİN VERMEYIN (Reye sendromu)',
          '❌ Yanık üzerine ilaç SÜRMEYİN (enfeksiyon)',
        ],
        tips: [
          'Parasetamol: Her yaş, ağrı kesici',
          'İbuprofen: 6 ay+, ağrı + iltihaplanma azaltır',
          'Soğuk kompres ağrıyı azaltır',
        ],
      },
      {
        stepNumber: 6,
        title: 'DOKTOR DEĞERLENDİRMESİ',
        instruction: 'ŞU DURUMLARDA MUTLAKA DOKTORA: 2. derece (avuç boyutundan büyük), 3. derece (herhangi boyut), yüz/boyun/el/ayak/genital, elektrik yanığı, kimyasal yanık, bebek 1 yaş altı.',
        duration: 'Hemen veya aynı gün',
        criticalStep: true,
        warnings: [
          '🚨 ELEKTRİK YANIĞI → Her zaman 112 (kalp kontrolü gerekir)',
          '🚨 YÜZ/BOYUN yanığı → Acil (hava yolu şişmesi riski)',
          '🚨 GENIŞ ALAN (vücut yüzeyinin %10+) → Acil',
        ],
        tips: [
          '1 yaş altı: Her yanıkta doktor',
          '1 yaş üstü: Küçük 1. derece evde tedavi',
          'Şüphe varsa → Doktora git',
        ],
      },
      {
        stepNumber: 7,
        title: 'EVDEKİ TAKİP ve BAKIM (1. Derece)',
        instruction: 'Küçük 1. derece yanıklar için: Günde 2-3 kez soğuk kompres. Yumuşak nemlendirici krem (aloe vera, panthenol). Güneşten koruyun. 3-7 gün içinde iyileşir.',
        duration: '3-7 gün',
        criticalStep: false,
        warnings: [],
        tips: [
          'Soğuk kompres: Günde 3-4 kez (10 dk)',
          'Nemlendirici: Yanık iyileşme kremi, aloe vera',
          'Güneşten koruma: 6-12 ay (pigmentasyon önleme)',
          'Kızarıklık 3-5 günde geçer',
        ],
      },
      {
        stepNumber: 8,
        title: 'ENFEKSİYON BELİRTİLERİNİ İZLE',
        instruction: 'Yanık bölgeyi günlük kontrol edin. Enfeksiyon belirtileri: Artan kızarıklık, şişlik, ısı artışı, sarı/yeşil akıntı, kötü koku, ateş. VARSA → Hemen doktora.',
        duration: '7-14 gün takip',
        criticalStep: true,
        warnings: [
          '⚠️ Enfeksiyon belirtisi → Hemen doktor',
          '⚠️ Ateş çıktı → Doktor',
        ],
        tips: [
          'Günlük bez değişimi (steril)',
          'Eller temiz olsun',
          'İyileşme: 1. derece 7 gün, 2. derece 2-3 hafta',
        ],
      },
    ],
    
    doNots: [
      '❌ BUZ veya BUZ SUYU kullanmayın (doku hasarı)',
      '❌ Diş macunu, yoğurt, yumurta, patates SÜRMEYİN (halk ilacı ama YANLIŞ)',
      '❌ Yağ, tereyağı, zeytinyağı SÜRMEYİN (ısıyı tutar)',
      '❌ Pamuk kullanmayın (yapışır)',
      '❌ Su toplamalarını PATLATMAYIN (enfeksiyon kapısı)',
      '❌ Yapışkan bantla yanığa dokunmayın',
      '❌ Merhem/krem sürmeden ÖNCE soğutun (önce su, sonra merhem)',
      '❌ Elektrik yanığında elektriği kesmeden dokunmayın',
      '❌ Kimyasal yanıkta su ile yıkamadan merhem sürmeyin',
    ],
    
    whenToSeekHelp: {
      call112Immediately: [
        '🚨 ELEKTRİK YANIĞI (kalp ritmi kontrolü gerekir)',
        '🚨 YÜZ, BOYUN, AĞIZ içi yanığı (hava yolu tıkanması riski)',
        '🚨 3. DERECE yanık (derin, beyaz/siyah)',
        '🚨 GENIŞ ALAN yanığı (vücut yüzeyinin %10+)',
        '🚨 Bebek nefes almakta zorlanıyor (duman inhalasyonu)',
      ],
      goToER: [
        '⚠️ 2. DERECE (avuç boyutundan büyük)',
        '⚠️ El, ayak, genital bölge yanığı',
        '⚠️ KİMYASAL yanık (20 dk su + acil)',
        '⚠️ Çevre yanık (kol/bacak çevresini sarıyor)',
        '⚠️ 1 yaş altı bebekte HERHANGI yanık',
      ],
      callDoctor: [
        '⚠️ 2. derece küçük alan (kontrol için)',
        '⚠️ Su toplaması çok büyüdü',
        '⚠️ Enfeksiyon belirtisi (kızarıklık, akıntı, ateş)',
        '⚠️ İyileşme yok (7 gün sonra)',
      ],
      monitor: [
        'Küçük 1. derece (bozuk para boyutu) → Evde tedavi',
        'Sadece kızarıklık, su yok → Evde',
      ],
    },
    
    afterCare: {
      nextSteps: [
        '1. derece: 3-7 gün evde bakım',
        '2. derece: Doktor kontrolü + 2-3 hafta bakım',
        '3. derece: Hastane tedavisi + uzun süre takip',
        'İz kalma riski var (güneş koruması önemli)',
      ],
      monitoring: [
        'Enfeksiyon var mı?',
        'İyileşiyor mu?',
        'Ağrı azalıyor mu?',
        'Yeni su toplaması oluştu mu?',
      ],
      followUp: [
        '2. derece: Haftalık doktor kontrolü',
        '3. derece: Plastik cerrahi takibi (iz tedavisi)',
        'Skar önleme kremleri (6 ay - 1 yıl)',
      ],
    },
    
    prevention: [
      '✓ Sıcak içecekleri bebeğin erişemeyeceği yerde tutun',
      '✓ Fincan/bardakları masa kenarına koymayın',
      '✓ Tencere saplarını ocağın içine çevirin',
      '✓ Bebek mama/süt sıcaklığını kontrol edin (37°C ideal)',
      '✓ Ütü/fırın/soba/şömine koruması',
      '✓ Elektrik prizlerine kapak',
      '✓ Sıcak su sıcaklığını 50°C altına ayarlayın',
      '✓ Güneş kremi kullanın (SPF 50+, 6 ay üstü)',
      '✓ Banyo suyu sıcaklığı 37-38°C (dirsekle test edin)',
    ],
    
    emergencyContacts: [
      {
        service: '112 Acil',
        number: '112',
        when: 'Elektrik, yüz/boyun, geniş alan, 3. derece',
      },
      {
        service: 'Zehir Danışma',
        number: '114',
        when: 'Kimyasal yanık',
      },
      {
        service: 'Yanık Merkezi',
        number: '(Yerel hastane)',
        when: 'Ciddi yanıklar için uzman tedavi',
      },
    ],
    
    resources: {
      relatedGuides: ['electrical-injury', 'chemical-burns', 'sun-protection'],
    },
    
    metadata: {
      lastUpdated: '2024-11-16',
      source: 'American Burn Association, WHO Burn Guidelines, Türk Yanık Derneği',
      reviewedBy: 'Yanık Uzmanı, Plastik Cerrahi Uzmanı',
    },
  },
  
  {
    id: 'poisoning-infant-0-24',
    category: 'zehirlenme',
    emergency: 'life-threatening',
    title: 'Zehirlenme (0-24 Ay)',
    subtitle: 'İlaç, Ev Ürünü ve Bitki Zehirlenmeleri',
    ageRange: '0-24 ay',
    quickSummary: 'ZEHİRLENME',
    icon: 'warning-outline',
    color: '#7C3AED',
    
    recognition: {
      mainSymptoms: [
        'Ağızda/dudaklarda kimyasal yanık izleri',
        'Anormal kokular (ağız, vücut)',
        'Ani kusma, ishal',
        'Aşırı tükürük',
        'Bilinç değişikliği (uyuşukluk veya ajitasyon)',
        'Nefes darlığı',
        'Konvülsiyon',
        'Açılmış ilaç kutusu/şişe',
      ],
      whenToActImmediately: [
        '🚨 BİLİNÇ KAYBI → 112 + Zehir Danışma 114',
        '🚨 NEFES DARLIĞI → 112',
        '🚨 NÖBET → 112',
        '🚨 YUTTU şüphesi → Hemen 114 ara (Zehir Danışma)',
        '⚠️ Cilt/göz teması → Su ile yıka + 114 ara',
      ],
      severityIndicators: {
        mild: [
          'Az miktarda zararsız madde',
          'Bilinç normal',
          'Hafif kusma (1-2 kez)',
        ],
        moderate: [
          'Orta miktarda toksik madde',
          'Kusma devam ediyor',
          'Hafif uyuşukluk',
          'Karın ağrısı',
        ],
        severe: [
          'Çok miktarda toksik madde',
          'Bilinç değişikliği',
          'Nöbet',
          'Nefes darlığı',
          'Kalp ritmi değişikliği',
          'Yanıklar (ağız/cilt)',
        ],
      },
    },
    
    steps: [
      {
        stepNumber: 1,
        title: 'SAKİN KAL - Durumu Değerlendir',
        instruction: 'Panik yapmayın. NE yuttuğunu belirleyin: İlaç mı? Temizlik ürünü mü? Bitki mi? Kutuyu/şişeyi bulun. NE KADAR yuttu? (tahmin). NE ZAMAN yuttu? (son 30 dk kritik).',
        duration: '30 saniye',
        criticalStep: true,
        warnings: [
          '❌ Panik yapıp zaman kaybetmeyin',
          '❌ Kendiniz müdahale etmeyin (114 talimat verecek)',
          '⚠️ Madde/ambalajı SAKLAYIN (hastaneye götürün)',
        ],
        tips: [
          'Ambalajı bulun (içerik listesi kritik)',
          'Miktarı tahmin edin',
          'Zamanı not edin',
          'Etrafta kusmuk var mı bakın',
        ],
      },
      {
        stepNumber: 2,
        title: 'ZEHİR DANIŞMA 114 ARA - HEMEN!',
        instruction: '114 ZEHİR DANIŞMA HATTINI arayın. 7/24 HİZMET. Maddenin ismini, miktarını, zamanını söyleyin. TALİMATLARI DİKKATLE DİNLEYİN. 112\'yi de aramamı söylerlerse arayın.',
        duration: '2-5 dakika',
        criticalStep: true,
        warnings: [
          '❌ 114\'ü aramadan müdahale etmeyin',
          '❌ İnternetten okuduğunuz yöntemi UYGULAMAYİN',
          '🚨 Bilinç kaybı/nöbet/nefes darlığı VARSA → 112 + 114',
        ],
        tips: [
          '114: Türkiye Zehir Danışma Merkezi',
          'Uzmanlar 5 dakika içinde yönlendirir',
          'Madde ismini net söyleyin',
          'Ambalajı okurun (içerik)',
          'Bebeğin kilosunu bilin',
        ],
      },
      {
        stepNumber: 3,
        title: 'KUSTURMA - SADECE 114 TALİMATI İLE',
        instruction: 'KUSTURMAYI SADece 114 uzmanı söylerse yapın. Bazı maddeler (asit, baz, petrol ürünleri) KUSTURULMAMALI. 114 talimat verirse: Parmakla kusturma, İpeka şurubu (varsa) verilebilir.',
        duration: 'Sadece talimatla',
        criticalStep: true,
        warnings: [
          '❌ KENDİ İNİSİYATİFİNİZLE KUSTURMAK YASAK',
          '❌ ASİT/BAZ (çamaşır suyu, tuvalet açıcı) → KUSTURMAYIN (özofagus yanar)',
          '❌ PETROL ÜRÜNLERİ (benzin, gaz yağı, tiner) → KUSTURMAYIN (akciğer hasarı)',
          '❌ BİLİNÇSİZ BEBEK → ASLA KUSTURMAK',
          '❌ NÖBET GEÇİRİYOR → KUSTURMAYIN',
        ],
        tips: [
          'Güvenli maddeler: İlaçlar (çoğu), bazı bitkiler',
          'Tehlikeli: Asit, baz, petrol, keskin madde',
          '114 her durumda doğru talimat verir',
        ],
      },
      {
        stepNumber: 4,
        title: 'SÜT/SU VERİLMESİ (Sadece Talimatla)',
        instruction: '114 uzmanı söylerse: Az miktarda SU verebilirsiniz (mideyi seyreltmek için). SÜT genelde VERILMEZ (bazı zehirler sütle daha iyi emilir). ASLA kendi kararınızla vermeyin.',
        duration: 'Sadece talimatla',
        criticalStep: false,
        warnings: [
          '❌ AKTİF KÖMÜR kendiniz vermeyin (sadece hastanede)',
          '❌ SÜT çoğu zehirlenme için YANLIŞ',
          '❌ Bilinçsiz bebeğe su vermeyin (boğulma)',
        ],
        tips: [
          'Su: Seyreltme amaçlı (az miktarda)',
          'Süt: Genelde önerilmez',
          'Aktif kömür: Hastane tedavisi',
        ],
      },
      {
        stepNumber: 5,
        title: 'CİLT/GÖZ TEMASI - Hemen Yıka',
        instruction: 'CİLT teması: Kirlı elbiseleri çıkarın. 15-20 DAKİKA bol su ile yıkayın. GÖZ teması: Göz kapağını açın, 15 dakika su akıtın. Sonra 114 arayın.',
        duration: '15-20 dakika yıkama',
        criticalStep: true,
        warnings: [
          '❌ Sabun KULLANMAYIN (kimyasal reaksiyon riski)',
          '❌ Ovmayın (kimyasal derinleşir)',
          '❌ Sıcak su kullanmayın',
        ],
        tips: [
          'Akan soğuk su en iyisi',
          'Gözde: Göz kapağını açık tut, su akıt',
          'Elbiseler: Çıkar (kimyasal yapışık)',
        ],
        image: '/guides/chemical-eye-wash.png',
      },
      {
        stepNumber: 6,
        title: 'MADDE/AMBALAJI SAKLA',
        instruction: 'Yuttuğu maddenin AMBALAJINI, KUTUSUNU veya KALINTI/KUSMUK örneğini saklayın. Hastaneye/ambulansa VERİN. İçerik analizi için gerekli.',
        duration: '1 dakika',
        criticalStep: true,
        warnings: [],
        tips: [
          'Ambalaj: İçerik, antidot bilgisi var',
          'Kusmuk örneği: Laboratuvar analizi',
          'Bitki ise: Bitkiyi/fotoğrafı getir',
        ],
      },
      {
        stepNumber: 7,
        title: 'ACİL SERVİSE GİT (Gerekirse)',
        instruction: '114 uzmanı söylerse HEMEN acil servise gidin. Toksik maddelerde: Aktif kömür, mide yıkama, antidot tedavisi hastanede yapılır. Ambalajı/örneği götürün.',
        duration: 'Hemen',
        criticalStep: true,
        warnings: [
          '⚠️ "Bebek iyi görünüyor" diye evde KALMAYIN',
          '⚠️ Bazı zehirler 6-24 saat sonra etki eder',
          '⚠️ Karaciğer/böbrek hasarı geç ortaya çıkar',
        ],
        tips: [
          'Çoğu zehirlenme hastane gerektirir',
          'Gözlem süresi: 4-24 saat',
          'Kan testi, EKG yapılır',
        ],
      },
      {
        stepNumber: 8,
        title: 'TAKİP ve İZLEM',
        instruction: '114 "evde izle" dediyse: 24-48 saat yakın takip. Kusma, ishal, uyuşukluk, nefes değişikliği izleyin. Değişiklik VARSA → Hemen acil.',
        duration: '24-48 saat',
        criticalStep: false,
        warnings: [],
        tips: [
          'Sık sık kontrol',
          'Normal aktivite varsa iyi işaret',
          'Kusma/ishal: Dehidratasyon riski',
        ],
      },
    ],
    
    doNots: [
      '❌ 114 ZEHİR DANIŞMA aramadan müdahale ETMEYİN',
      '❌ Kendi başınıza KUSTURMAYIN (bazı maddeler çok tehlikeli)',
      '❌ SÜT vermeyin (çoğu zehir için yanlış)',
      '❌ AKTİF KÖMÜR kendiniz vermeyin (yanlış doz tehlikeli)',
      '❌ ASİT/BAZ kusturulmaz (özofagus yanık)',
      '❌ PETROL ürünleri kusturulmaz (akciğer hasarı)',
      '❌ İnternetten tedavi UYGULAMAYIN',
      '❌ "Az yuttu, bir şey olmaz" DEMEYİN',
      '❌ Bilinçsiz bebeğe ağızdan bir şey vermeyin',
    ],
    
    whenToSeekHelp: {
      call112Immediately: [
        '🚨 BİLİNÇ KAYBI',
        '🚨 NÖBET',
        '🚨 NEFES DARLIĞI, siyanoz (mavi)',
        '🚨 KALP RİTMİ değişikliği',
        '🚨 ŞİDDETLİ YANIK (ağız, cilt)',
      ],
      goToER: [
        '⚠️ İLAÇ yuttu (herhangi biri)',
        '⚠️ TEMİZLİK ÜRÜNÜ yuttu (çamaşır suyu, tuvalet açıcı)',
        '⚠️ ZEHİRLİ BİTKİ yedi',
        '⚠️ PİL yuttu (düğme pil - ACİL)',
        '⚠️ MAGNET yuttu',
        '⚠️ 114 "Acile gidin" dedi',
      ],
      callDoctor: [
        '⚠️ Zararsız madde ama emin değilseniz',
        '⚠️ Hafif semptomlar var',
      ],
      monitor: [
        '114 "evde izle" dedi → 24-48 saat takip',
      ],
    },
    
    afterCare: {
      nextSteps: [
        'Hastaneden taburcu olduysa: 24-48 saat evde izlem',
        'Karaciğer/böbrek testleri (bazı zehirlerde)',
        'Takip randevusu',
      ],
      monitoring: [
        'Kusma/ishal var mı?',
        'İştah normal mi?',
        'Uyku normal mi?',
        'İdrar rengi/miktarı normal mi?',
      ],
      followUp: [
        '3-7 gün sonra doktor kontrolü',
        'Kan testleri (gerekirse)',
      ],
    },
    
    prevention: [
      '✓ TÜM ilaçları KİTLİ dolaba koyun (yüksekte)',
      '✓ Temizlik ürünleri ERİŞİLEMEZ yerde',
      '✓ İlaçları ORJİNAL ambalajında saklayın (içecek şişesine koymayın)',
      '✓ Çocuk kilidi olan kapaklar tercih edin',
      '✓ Zehir Danışma 114\'ü telefona kaydedin',
      '✓ Bebek/çocuk güvenlik kilitleri kullanın',
      '✓ Zehirli bitkileri evden uzaklaştırın',
      '✓ Kozmetik/parfüm ERİŞİLEMEZ',
      '✓ Alkol içecekleri KİTLİ',
      '✓ Sigara/sigara izmaritleri ERİŞİLEMEZ',
      '✓ Böcek ilaçları/fare zehiri GİZLİ',
      '✓ Düğme piller saklı (çok tehlikeli)',
    ],
    
    emergencyContacts: [
      {
        service: '114 Zehir Danışma',
        number: '114',
        when: 'HER zehirlenme şüphesinde - 7/24 hizmet',
      },
      {
        service: '112 Acil',
        number: '112',
        when: 'Bilinç kaybı, nöbet, nefes darlığı',
      },
    ],
    
    resources: {
      externalLinks: [
        'https://www.uzem.hacettepe.edu.tr',
        'https://www.who.int/topics/poisons',
      ],
      relatedGuides: ['cpr-infant-0-12', 'chemical-burns'],
    },
    
    metadata: {
      lastUpdated: '2024-11-16',
      source: 'Türkiye İlaç ve Zehir Bilgi Merkezi (UZEM), WHO Poison Guidelines, American Poison Control',
      reviewedBy: 'Toksikoloji Uzmanı, Acil Tıp Uzmanı',
    },
  },
  
  {
    id: 'febrile-seizure-0-24',
    category: 'hastalik',
    emergency: 'urgent',
    title: 'Ateşli Nöbet / Konvülsiyon (6 Ay - 5 Yaş)',
    subtitle: 'Febrile Seizure - Acil Müdahale',
    ageRange: '6 ay - 5 yaş',
    quickSummary: 'ATEŞLİ NÖBET',
    icon: 'pulse',
    color: '#DC2626',
    
    recognition: {
      mainSymptoms: [
        'Yüksek ateş var (38.5°C+)',
        'Ani bilinç kaybı',
        'Vücutta kasılma, sertleşme',
        'Ritimli kasılmalar (kollar/bacaklar)',
        'Gözler yukarı dönük veya kayma',
        'Ağızdan köpük gelmesi',
        'Nefes tutma, morarma (geçici)',
        'İdrar/gaita kaçırma',
      ],
      whenToActImmediately: [
        '🚨 İLK KEZ NÖBET → 112 ara',
        '🚨 5 DAKİKADAN UZUN → 112 ara',
        '🚨 NEFES ALAMIYOR → 112',
        '🚨 BİR GÜN İÇİNDE 2. NÖBET → 112',
        '⚠️ Daha önce ateşli nöbet geçirdi + 5 dk altı → Sakin ol, izle',
      ],
      severityIndicators: {
        mild: [
          'Basit ateşli nöbet',
          '1-3 dakika sürer',
          'Vücudun tamamında (jeneralize)',
          'Nöbet biter, sonra uyur',
          'Tek bir nöbet (24 saat içinde)',
        ],
        moderate: [
          'Orta süre (3-5 dakika)',
          'Nöbet sonrası uzun uyuşukluk (30+ dk)',
          'İkinci nöbet (aynı gün)',
        ],
        severe: [
          'Kompleks ateşli nöbet',
          '5 dakikadan uzun (Status epilepticus)',
          'Vücudun sadece bir tarafında (fokal)',
          'Aynı gün içinde 2+ nöbet',
          '6 ay altı veya 5 yaş üstü',
          'Nöbet sonrası uzun bilinçsizlik',
        ],
      },
    },
    
    steps: [
      {
        stepNumber: 1,
        title: 'SAKİN KAL - Zamanı Başlat',
        instruction: 'PANİK YAPMAYIN. Nöbetler korkutucu görünür ama çoğu 1-3 dakikada biter. SAATI KONTROL EDİN ve nöbet süresini ÖLÇÜN. 5 dakika sınırı kritik.',
        duration: '5 saniye',
        criticalStep: true,
        warnings: [
          '❌ Panik yapmayın (bebeğe zarar veremezsiniz)',
          '⚠️ Nöbet 5 dakikayı geçerse → 112 ARA',
        ],
        tips: [
          'Telefonda kronometre başlat',
          'Çoğu nöbet 1-3 dakikada biter',
          '5 dakika sınırı kritik',
          'Video çekin (doktora göstermek için)',
        ],
      },
      {
        stepNumber: 2,
        title: 'GÜVENLİK - Yaralanmayı Önle',
        instruction: 'Bebeği DÜZCE, yumuşak zemine yatırın (halı, yatak). Sert/keskin nesneleri uzaklaştırın. Kıyafetleri gevşetin (boyun/göğüs). BAŞI YAN ÇEVİRİN (kusma varsa boğulmayı önler).',
        duration: '10-20 saniye',
        criticalStep: true,
        warnings: [
          '❌ Bebeği TUTMAYIN/BASTIRMAYIN (kasılmayı durdurmaz)',
          '❌ AĞIZINA BIRŞEY KOYMAK YASAK (dil yutulmaz - mit)',
          '❌ Su/ilaç vermeyin (boğulur)',
          '❌ Sarsmayin',
          '❌ Soğuk su dökmeyin',
        ],
        tips: [
          'Yan yatış pozisyonu (recovery position)',
          'Başın altına yumuşak yastık',
          'Gözlük/takı varsa çıkarın',
          'Etrafı güvenli hale getirin',
        ],
        image: '/guides/seizure-recovery-position.png',
        video: '/videos/seizure-safety-positioning.mp4',
      },
      {
        stepNumber: 3,
        title: 'NEFES TAKİBİ',
        instruction: 'Nöbet sırasında nefes durabilir (10-20 saniye). BU NORMAL. Nöbet bitince nefes kendiliğinden başlar. Rengi morardı ama nöbet bitince normale döner.',
        duration: 'Devam eden',
        criticalStep: true,
        warnings: [
          '⚠️ Nöbet sırasında kısa nefes durması NORMAL',
          '🚨 Nöbet BİTTİ ama nefes yok → CPR BAŞLAT',
          '❌ Ağıza yapay solunum yapmayın (nöbet sırasında)',
        ],
        tips: [
          'Morarma geçici (nöbet bitince düzelir)',
          'Nefes nöbetle birlikte düzelir',
          'Panik yok - sadece izle',
        ],
      },
      {
        stepNumber: 4,
        title: '5 DAKİKA KURALI - 112 ARA',
        instruction: 'Nöbet 5 DAKİKAYI geçtiyse → HEMEN 112 arayın. İLK NÖBET ise → 112 arayın. Aynı gün İKİNCİ NÖBET → 112 arayın. 6 AY ALTI bebek → 112.',
        duration: '5 dakika sınır',
        criticalStep: true,
        warnings: [
          '🚨 5 dakikadan uzun nöbet → Status epilepticus → ACİL',
          '🚨 İlk kez nöbet → Mutlaka değerlendirme gerekir',
          '🚨 24 saat içinde 2+ nöbet → Kompleks nöbet → Acil',
        ],
        tips: [
          'İlk nöbet: Altta yatan sebep aranır',
          '5+ dakika: İlaç tedavisi gerekir (diazepam rektal)',
          'Tekrarlayan nöbet: Komplikasyon riski',
        ],
      },
      {
        stepNumber: 5,
        title: 'NÖBET BİTİŞİ - İyileşme Pozisyonu',
        instruction: 'Nöbet bitti (kasılma durdu). Bebeği YAN ÇEVİRİN (recovery position). Bilinçsiz/uyuşuksa → Bu normal (postictal dönem). 10-30 dakika sürebilir. Rahat etmesine izin verin.',
        duration: '10-30 dakika',
        criticalStep: false,
        warnings: [
          '❌ Hemen kaldırıp sarsmayın',
          '❌ Yemek/su vermeyin (bilinç tam açılana kadar)',
          '⚠️ Uzun uyuşukluk (1 saat+) → Doktor',
        ],
        tips: [
          'Yan pozisyon: Kusma varsa akmasını sağlar',
          'Normal: Nöbet sonrası uyku (1-2 saat)',
          'Konfüzyon normal (10-30 dk)',
          'Sakin ortam, sessiz oda',
        ],
        image: '/guides/recovery-position-infant.png',
      },
      {
        stepNumber: 6,
        title: 'ATEŞİ DÜŞÜR (Nöbet Bittikten Sonra)',
        instruction: 'Nöbet BİTTİKTEN ve bebek BİRAZ AYILIRKEN sonra: Ateş ölçün. PARASETAMOL veya İBUPROFEN verin. Ilık suyla silin. Ateşli nöbet tekrarı önlemek için.',
        duration: '30-60 dakika',
        criticalStep: true,
        warnings: [
          '❌ Nöbet SIRASINDA ilaç vermeyin (boğulur)',
          '❌ Bilinçsizken ilaç vermeyin',
          '⚠️ Bebek uyanıp yutkunabilirse → İlaç ver',
        ],
        tips: [
          'Ateş düşürücü: Nöbet tekrarını azaltır',
          'Soğuk su/buz: Titreme → ateş yükselir (YAPMA)',
          'Ilık su (29-32°C) idealdir',
        ],
      },
      {
        stepNumber: 7,
        title: 'ACİL SERVİSE GİT / DOKTOR MUAYENE',
        instruction: 'İLK NÖBET → Mutlaka acil servis (menenjit/ciddi enfeksiyon ekarte edilmeli). DAHA ÖNCE GEÇİRDİ + Kısa (1-3 dk) → Aile hekimi kontrolü yeterli. 5+ dakika veya 2+ nöbet → Acil.',
        duration: 'Hemen',
        criticalStep: true,
        warnings: [],
        tips: [
          'İlk nöbet: Lomber ponksiyon gerekebilir',
          'Tekrarlayan basit nöbet: Rutin kontrol',
          'EEG genelde gerekmez (basit ateşli nöbette)',
        ],
      },
      {
        stepNumber: 8,
        title: 'GELECEK İÇİN HAZIRLIK',
        instruction: 'Ateşli nöbet geçiren çocukların %30\'u tekrar geçirebilir. Doktor DİAZEPAM REKTAL (Stesolid) reçete edebilir. 5+ dakika süren nöbette evde kullanılır. Kullanımını öğrenin.',
        duration: 'Bilgilendirme',
        criticalStep: false,
        warnings: [],
        tips: [
          'Diazepam rektal: Nöbeti durdurur (5 dk+)',
          'Kullanımı basit (tüp, rektal)',
          'Son kullanma tarihini kontrol edin',
          'Acil çanta hazırlayın',
        ],
      },
    ],
    
    doNots: [
      '❌ AĞIZINA BİRŞEY KOKMAK YASAK (kaşık, parmak, dil tutucu - boğulma riski)',
      '❌ Bebeği TUTMAYIN/BASTIRMAYIN (kasılma durdurmaz, yaralanır)',
      '❌ Su/ilaç VERMEYİN (nöbet sırasında - boğulur)',
      '❌ SARSMAK YASAK',
      '❌ Soğuk su DÖKMEYİN (titreme → ateş yükselir)',
      '❌ Panik yapıp "dilini yutacak" DEMEYİN (mit - dil yutulamaz)',
      '❌ 5 dakikadan uzun nöbeti evde beklemeyin',
      '❌ İlk nöbeti hafife almayın (mutlaka doktor)',
    ],
    
    whenToSeekHelp: {
      call112Immediately: [
        '🚨 İLK KEZ NÖBET geçiriyor',
        '🚨 5 DAKİKADAN UZUN',
        '🚨 NÖBET BİTTİ ama NEFES ALMADI → CPR',
        '🚨 BİR GÜN İÇİNDE 2. NÖBET',
        '🚨 6 AY ALTINDA nöbet',
        '🚨 5 YAŞ ÜSTÜNDE ateşli nöbet (alışılmışı dışı)',
        '🚨 Vücudun sadece BİR TARAFINDA (fokal nöbet)',
      ],
      goToER: [
        '⚠️ Nöbet sonrası 1 SAAT+ bilinçsiz',
        '⚠️ Nöbet sonrası GÜÇSÜZLük (kol/bacak)',
        '⚠️ ENSE SERTLİĞİ var (menenjit şüphesi)',
        '⚠️ Çok yüksek ateş (40°C+)',
      ],
      callDoctor: [
        '⚠️ Daha önce ateşli nöbet geçirdi + Bu kez kısa (1-3 dk) → Kontrol',
        '⚠️ Nöbet bitti, iyileşti ama ateş devam ediyor → Randevu',
      ],
      monitor: [
        'Basit ateşli nöbet (1-3 dk, daha önce geçirdi) → 24 saat evde izle',
      ],
    },
    
    afterCare: {
      nextSteps: [
        'İlk nöbet: Hastanede tam muayene (lomber ponksiyon?)',
        'Tekrarlayan basit nöbet: Poliklinik kontrolü',
        'Diazepam rektal reçete (5+ dk nöbetler için)',
        'Ateş yönetimi eğitimi',
      ],
      monitoring: [
        'Ateş takibi (düzenli ölç)',
        'Tekrar nöbet geçirdi mi?',
        'Normal davranışa döndü mü?',
        'İlaç yan etkileri var mı?',
      ],
      followUp: [
        '1 hafta sonra pediatri kontrolü',
        'EEG genelde gereksiz (basit ateşli nöbette)',
        'Kompleks nöbet: Çocuk nöroloji',
      ],
    },
    
    prevention: [
      '✓ Ateşi 38.5°C\'de düşürün (nöbeti TAMAMEN önlemez ama yardımcı)',
      '✓ Ateş düşürücü ERKEN VERİN',
      '✓ Aşı takvimi: Tam yapın (enfeksiyon önleme)',
      '✓ Hasta çocuklardan uzak tutun',
      '✓ Diazepam rektal yanınızda taşıyın (doktor reçete ettiyse)',
      '✓ Aile/bakıcılara nöbet eğitimi verin',
      '✓ Acil numaraları hazır bulundurun',
      '⚠️ NOT: Ateş düşürücü nöbeti %100 ÖNLEMEZ (genetik yatkınlık)',
    ],
    
    emergencyContacts: [
      {
        service: '112 Acil',
        number: '112',
        when: 'İlk nöbet, 5+ dakika, tekrarlayan',
      },
      {
        service: 'Aile Hekimi',
        number: '(Numaranız)',
        when: 'Kısa, tekrarlayan basit nöbet - kontrol',
      },
    ],
    
    resources: {
      externalLinks: [
        'https://www.ilae.org',
        'https://www.epilepsy.com/living-epilepsy/first-aid',
      ],
      relatedGuides: ['high-fever-infant-0-24', 'cpr-infant-0-12'],
    },
    
    metadata: {
      lastUpdated: '2024-11-16',
      source: 'American Academy of Pediatrics (AAP), International League Against Epilepsy (ILAE), Türk Pediatri Derneği',
      reviewedBy: 'Çocuk Nöroloji Uzmanı, Pediatri Uzmanı',
    },
  },
  
  // Additional guides will be added...
];

/**
 * Get first aid guide by ID
 */
export const getFirstAidGuide = (id: string): FirstAidGuide | undefined => {
  return firstAidGuides.find(guide => guide.id === id);
};

/**
 * Get guides by category
 */
export const getFirstAidByCategory = (category: FirstAidGuide['category']): FirstAidGuide[] => {
  return firstAidGuides.filter(guide => guide.category === category);
};

/**
 * Get guides by emergency level
 */
export const getFirstAidByEmergencyLevel = (level: EmergencyLevel): FirstAidGuide[] => {
  return firstAidGuides.filter(guide => guide.emergency === level);
};

/**
 * Search guides
 */
export const searchFirstAidGuides = (query: string): FirstAidGuide[] => {
  const lowerQuery = query.toLowerCase();
  return firstAidGuides.filter(guide =>
    guide.title.toLowerCase().includes(lowerQuery) ||
    guide.subtitle.toLowerCase().includes(lowerQuery) ||
    guide.quickSummary.toLowerCase().includes(lowerQuery)
  );
};
