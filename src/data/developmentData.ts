/**
 * Comprehensive Baby Development Data
 * Based on research from WHO, CDC, Wonder Weeks, and pediatric guidelines
 * 
 * Wonder Weeks Leap Schedule:
 * Leap 1: 5 weeks - World of Changing Sensations
 * Leap 2: 8 weeks - World of Patterns
 * Leap 3: 12 weeks - World of Smooth Transitions
 * Leap 4: 19 weeks - World of Events
 * Leap 5: 26 weeks - World of Relationships
 * Leap 6: 37 weeks - World of Categories
 * Leap 7: 46 weeks - World of Sequences
 * Leap 8: 55 weeks - World of Programs
 * Leap 9: 64 weeks - World of Principles
 * Leap 10: 75 weeks - World of Systems
 */

export interface DevelopmentMilestone {
  id: string;
  week?: number;
  month?: number;
  category: 'physical' | 'cognitive' | 'social' | 'language' | 'play' | 'nutrition';
  title: string;
  description: string;
  ageRange: string;
  isLeap?: boolean; // Wonder Weeks leap
  leapNumber?: number;
}

export interface WeeklyDevelopment {
  week: number;
  month: number;
  title: string;
  subtitle: string;
  isLeap: boolean;
  leapInfo?: {
    number: number;
    name: string;
    description: string;
    signs: string[];
  };
  physical: string[];
  cognitive: string[];
  social: string[];
  language: string[];
  activities: string[];
  toys: string[];
  tips: string[];
  warnings: string[];
}

export interface MonthlyDevelopment {
  month: number;
  title: string;
  subtitle: string;
  summary: string;
  physical: string[];
  cognitive: string[];
  social: string[];
  language: string[];
  play: string[];
  nutrition: string[];
  activities: string[];
  toys: string[];
  tips: string[];
  warnings: string[];
  nextMonthPreview: string;
}

// Wonder Weeks Leaps Data
export const wonderWeeksLeaps = [
  {
    week: 5,
    leap: 1,
    name: 'Değişen Duyular Dünyası',
    description: 'Bebek duyularında büyük değişimler yaşıyor. Daha fazla göz teması kuruyor, seslere daha iyi tepki veriyor.',
    signs: [
      'Daha fazla ağlama',
      'Anne memesinde daha uzun kalma',
      'Daha az uyuma',
      'Parmak emme',
      'Daha huysuz olma'
    ],
    abilities: [
      'Sesler arasında fark anlama',
      'Yüzleri daha net görme',
      'Koku alma duyusunun gelişimi',
      'Dokunma hissinde artış'
    ]
  },
  {
    week: 8,
    leap: 2,
    name: 'Desenler Dünyası',
    description: 'Bebekler şekilleri ve desenleri tanımaya başlar. Hareketleri daha koordineli hale gelir.',
    signs: [
      'Ellerini keşfetme',
      'Seslerle oynama',
      'Kısa uyku periyotları',
      'İştahta değişim'
    ],
    abilities: [
      'Basit desenleri ayırt etme',
      'Elleriyle oynama',
      'Seslere farklı tepkiler verme',
      'Gülümseme'
    ]
  },
  {
    week: 12,
    leap: 3,
    name: 'Yumuşak Geçişler Dünyası',
    description: 'Bebekler hareketlerde akıcılık kazanır. Ses tonlarındaki değişiklikleri fark eder.',
    signs: [
      'Elleri açık tutma',
      'Nesneleri kavrama çabası',
      'Sesini daha çok kullanma',
      'Başını çevirme'
    ],
    abilities: [
      'Yumuşak hareketler yapma',
      'Ses tonlarını ayırt etme',
      'Nesneleri takip etme',
      'Yüzleri tercih etme'
    ]
  },
  {
    week: 19,
    leap: 4,
    name: 'Olaylar Dünyası',
    description: 'Bebek sebep-sonuç ilişkisini anlamaya başlar. Karmaşık aktiviteleri gözlemler.',
    signs: [
      'Her şeyi tutmaya çalışma',
      'Oyuncaklara uzanma',
      'Yemek zamanlarında huysuzluk',
      'Daha çok ilgi isteme'
    ],
    abilities: [
      'Sebep-sonuç anlama (çıngırak sallarsa ses çıkar)',
      'İki nesneyi karşılaştırma',
      'Mesafe algısı',
      'Ruh hali değişikliklerini anlama'
    ]
  },
  {
    week: 26,
    leap: 5,
    name: 'İlişkiler Dünyası',
    description: 'Bebekler nesneler arası ilişkileri ve mesafeleri anlamaya başlar.',
    signs: [
      'Ayrılık anksiyetesi başlangıcı',
      'Yabancı korkusu',
      'Daha tutungan olma',
      'Oyuncakları atmayı sevme'
    ],
    abilities: [
      'Mesafeleri değerlendirme',
      'Nesneleri kategorilere ayırma',
      'Sebep-sonuç ilişkilerini anlama',
      'Duygusal bağlar kurma'
    ]
  },
  {
    week: 37,
    leap: 6,
    name: 'Kategoriler Dünyası',
    description: 'Bebek nesneleri ve insanları gruplara ayırmayı öğrenir.',
    signs: [
      'Daha seçici olma',
      'Favori oyuncaklar',
      'Yemekte zorlanma',
      'Daha inatçı davranma'
    ],
    abilities: [
      'Hayvanları tanıma',
      'İnsanları gruplara ayırma',
      'Nesnelerin özelliklerini anlama',
      'Basit kelimeleri anlama'
    ]
  },
  {
    week: 46,
    leap: 7,
    name: 'Diziler Dünyası',
    description: 'Bebekler sıralı eylemleri ve ardışık olayları anlar.',
    signs: [
      'Daha fazla test etme',
      'Sınırları zorlama',
      'Huysuzluk artışı',
      'Uyku sorunları'
    ],
    abilities: [
      'Birden fazla adımı takip etme',
      'Sıralı hareketler yapma',
      'Plan yapma (oyuncağa ulaşmak için önce engeli kaldırma)',
      'Taklit etme'
    ]
  },
  {
    week: 55,
    leap: 8,
    name: 'Programlar Dünyası',
    description: 'Çocuklar amaçlı davranışlar sergiler ve kendi hedeflerini belirler.',
    signs: [
      'Daha bağımsız olma istegi',
      'Amaçlı itiraz etme',
      'Kıskançlık gösterme',
      'Güvensizlik'
    ],
    abilities: [
      'Kendi kararlarını verme',
      'Müzakere etmeye çalışma',
      'Empati gösterme',
      'Karmaşık oyunlar oynama'
    ]
  },
  {
    week: 64,
    leap: 9,
    name: 'Prensipler Dünyası',
    description: 'Çocuk değerleri, kuralları ve sosyal normları anlamaya başlar.',
    signs: [
      'Vicdanın ortaya çıkması',
      'Suçluluk duygusu',
      'Diğer çocuklarla ilgilenme',
      'Paylaşım konusunda zorluk'
    ],
    abilities: [
      'Kuralları anlama',
      'Doğru-yanlış kavramı',
      'Empati kurma',
      'Sosyal normları öğrenme'
    ]
  },
  {
    week: 75,
    leap: 10,
    name: 'Sistemler Dünyası',
    description: 'Çocuk büyük sistemi anlıyor, kuralları esnekleştirebiliyor.',
    signs: [
      'Daha olgun davranma',
      'Duygusal dalgalanmalar',
      'Bağımsızlık arayışı',
      'Arkadaşlık önem kazanır'
    ],
    abilities: [
      'Karmaşık sistemleri anlama',
      'Kuralları uyarlama',
      'Duygusal olgunluk',
      'Gelecek planlama'
    ]
  }
];

// Detailed Monthly Development (0-24 months)
export const monthlyDevelopments: MonthlyDevelopment[] = [
  {
    month: 0,
    title: 'Yenidoğan',
    subtitle: 'Dünyaya Hoş Geldin! 👶',
    summary: 'İlk ay, bebeğinizin dış dünyaya adapte olduğu dönemdir. Refleksler egemendir ve bebek çoğunlukla uyur.',
    physical: [
      'Başını desteksiz tutamaz',
      'Elleri yumruk halindedir',
      'Refleksler aktiftir (emme, kavrama, moro)',
      'Yüzüstü yatarken başını kısa süre kaldırabilir',
      'Günde 16-18 saat uyur'
    ],
    cognitive: [
      'Yüzlerden hoşlanır',
      '20-30 cm mesafeden odaklanabilir',
      'Yüksek kontrast görsellere ilgi duyar',
      'Tanıdık sesleri (anne, baba) ayırt eder',
      'Dokunma ve koku alma duyuları gelişmiştir'
    ],
    social: [
      'Anne-baba sesini tanır',
      'Göz teması kurmaya başlar',
      'Teselli edilmek ister',
      'Sarılmayı sever',
      'Ağlayarak ihtiyaçlarını belirtir'
    ],
    language: [
      'Ağlama tek iletişim aracıdır',
      'Farklı ağlama tipleri (acıkmış, uykulu, gazlı)',
      'Seslere başını çevirir',
      'Tanıdık seslere rahatlar'
    ],
    play: [
      'Henüz oyun dönemi başlamamıştır',
      'Yüzlere bakmaktan hoşlanır',
      'Yüksek kontrast kartlara ilgi gösterir',
      'Müzik dinlemeyi sever'
    ],
    nutrition: [
      'Sadece anne sütü veya formula',
      'Günde 8-12 kez beslenme',
      '2-3 saatte bir emzirme',
      'Emme refleksi çok güçlü',
      'Geğirtme önemli (hava yutma)'
    ],
    activities: [
      'Tummy time (kısa süreli)',
      'Yüz yüze konuşma',
      'Ninni söyleme',
      'Nazik masaj',
      'Yüksek kontrast resimler gösterme',
      'Yavaş sallanma'
    ],
    toys: [
      'Yüksek kontrast kitaplar (siyah-beyaz)',
      'Yumuşak müzik çalar',
      'Mobil (yatakın üstüne)',
      'Yumuşak peluşlar',
      'Ayna (kırılmaz bebek aynası)'
    ],
    tips: [
      'Bebeği sık sık kucağınıza alın',
      'Göz teması kurun ve konuşun',
      'Uyku düzenine alışması için zaman tanıyın',
      'Her ağlama hemen aç olması demek değildir',
      'Gaz sancıları normaldir',
      'Cilt temas önemlidir (ten tene)'
    ],
    warnings: [
      'Başı henüz desteksizdir, dikkatli tutun',
      'Sıcak su şişesi ile uyutmayın',
      'Yastık kullanmayın (SIDS riski)',
      'Sallanan beşikte başı serbest bırakmayın',
      'Ateş 38°C üzeri ise doktora gidin',
      'Sarılık takibi yapın'
    ],
    nextMonthPreview: 'Gelecek ay bebeğiniz daha fazla gülümseyecek, sesler çıkaracak ve başını daha iyi kontrol edecek!'
  },
  {
    month: 1,
    title: '1 Aylık Bebek',
    subtitle: 'İlk Gülücükler 😊',
    summary: 'Bebek daha uyanık kalır, etrafını keşfeder ve sosyal gülümseme başlar.',
    physical: [
      'Başını kısa süreli kaldırabilir',
      'Eller daha sık açılır',
      'Bacak hareketleri daha koordineli',
      'Yüzünü yavaşça sağa sola çevirir',
      'Göz hareketleri daha düzgün'
    ],
    cognitive: [
      '30-50 cm mesafeden odaklanır',
      'Hareketli nesneleri takip eder',
      'Tanıdık yüzleri hatırlar',
      'Sesle yönelme gelişir',
      'Renkli nesnelere ilgi artar'
    ],
    social: [
      '**İlk sosyal gülümseme!**',
      'Anne-babayı tanır',
      'Göz teması artar',
      'Sesle rahatlatılır',
      'Kucağa alınınca sakinleşir'
    ],
    language: [
      'Gırlak sesleri (cooing)',
      '"Ahh", "uhh" gibi sesler',
      'Farklı ağlama tonları',
      'Konuşmalara tepki verir',
      'Sesleri taklit etmeye çalışır'
    ],
    play: [
      'Yüzlere uzun süre bakar',
      'Mobili izler',
      'Müzikten hoşlanır',
      'Çıngırak sesine tepki verir',
      'Oyuncağa kısa süre bakar'
    ],
    nutrition: [
      'Emzirme rutini oturmaya başlar',
      '3-4 saatte bir emzirme',
      'Açlık işaretlerini daha iyi gösterir',
      'Emme süresi düzenli hale gelir',
      'Geğirtme hala önemli'
    ],
    activities: [
      'Tummy time artırın (günde 3-5 kez, 3-5 dakika)',
      'Yüz yüze konuşma ve şarkı söyleme',
      'Yavaşça oyuncakları gösterme',
      'Dış mekanda yürüyüş',
      'Bebek masajı',
      'Farklı müzikler dinletme'
    ],
    toys: [
      'Yumuşak çıngıraklar',
      'Kumaş kitaplar',
      'Bebek aynası',
      'Müzikli mobil',
      'Renkli kartlar',
      'Yumuşak top'
    ],
    tips: [
      'Gülümsemelere karşılık verin',
      'Sık sık konuşun, yorum yapın',
      'Tummy time sonrası ödüllendirin',
      'Uyku rutini oluşturun',
      'Fotoğraf çekin, gelişimi kaydedin',
      'Sakin ortam sağlayın'
    ],
    warnings: [
      'Başı hala desteklenmeli',
      'Çok fazla uyarıcı yorucu olabilir',
      'Aşırı ağlama (kolik) için doktor desteği',
      'Göz akıntısı varsa muayene',
      'Emzirmede sorun varsa danışman'
    ],
    nextMonthPreview: '2. ayda bebeğiniz ellerini keşfedecek, daha çok ses çıkaracak ve başını daha uzun süre tutabilecek!'
  },
  {
    month: 2,
    title: '2 Aylık Bebek',
    subtitle: 'Keşif Zamanı 🤲',
    summary: 'Bebek ellerini keşfeder, sosyal etkileşim artar, 8. hafta Wonder Weeks atağı yaşanabilir.',
    physical: [
      'Başını 45 derece kaldırır',
      'Ellerini açık tutar',
      'Elleriyle oynar',
      'Bacaklarını tekmeler',
      'Yüzüstü pozisyonda dirseklere dayanır'
    ],
    cognitive: [
      'Nesneleri 60 cm mesafeden takip eder',
      'Desenleri fark eder',
      'Sesleri kaynağıyla ilişkilendirir',
      'Yüz ifadelerini taklit eder',
      'Sebep-sonuç ilişkisi başlangıcı'
    ],
    social: [
      'Daha fazla gülümser',
      'Sosyal oyunlardan hoşlanır',
      'Göz teması uzar',
      'Yabancılarla etkileşim',
      'Duygusal bağ güçlenir'
    ],
    language: [
      'Gırlak sesleri artar (cooing)',
      '"Guu", "gaa" sesleri',
      'Konuşmalara ses çıkararak katılır',
      'Farklı tonlamalar',
      'Müziğe dans eder gibi hareket'
    ],
    play: [
      'Oyuncağa uzanır',
      'Elleriyle oynar',
      'Aynada kendini izler',
      'Müzikli oyuncakları sever',
      'Cilbir oyunu (peek-a-boo) başlangıcı'
    ],
    nutrition: [
      'Emzirme düzeni oturur',
      '3-4 saatte bir beslenme',
      'Büyüme atağı varsa daha sık emmek isteyebilir',
      'Geğirtme rutin olmalı'
    ],
    activities: [
      'Tummy time 5-10 dakika, günde 3-4 kez',
      'Cilbir (peek-a-boo) oynama',
      'Şarkı söyleme ve ritim',
      'Aynada kendini gösterme',
      'Farklı dokular hissettirme',
      'Bebek yoga (nazik esneme)'
    ],
    toys: [
      'Yumuşak dokulu oyuncaklar',
      'Çıngıraklı bileklikler',
      'Aktivite jimnastiği',
      'Kumaş kitaplar',
      'Yumuşak toplar',
      'Müzik çalar oyuncaklar'
    ],
    tips: [
      'Tummy time rutini oluşturun',
      'Bebeğin seslerine yanıt verin',
      'Gülümsemeleri teşvik edin',
      'Günlük rutinler oluşturun',
      'Uyku işaretlerini öğrenin',
      'Aşıları aksatmayın (8. hafta aşıları)'
    ],
    warnings: [
      '8. hafta Wonder Weeks atağı (huysuzluk normal)',
      'Başı hala yeterince güçlü değil',
      'Çok fazla ekran maruziyeti',
      'Gürültülü ortamdan kaçının',
      'Aşı sonrası ateş takibi'
    ],
    nextMonthPreview: '3. ayda bebek başını tam kontrol edecek, elleriyle oyuncak tutacak ve daha çok gülecek!'
  },
  {
    month: 3,
    title: '3 Aylık Bebek',
    subtitle: 'Baş Kontrolü ve İlk Kahkahalar 😄',
    summary: '12. hafta Wonder Weeks atağı yaşanabilir. Bebek başını tam kontrol eder, elleriyle oyuncak tutar.',
    physical: [
      '**Başını tam kontrol eder**',
      'Destekle oturabilir',
      'Nesneleri yakalar',
      'Her şeyi ağzına götürür',
      'Ayaklarını keşfeder'
    ],
    cognitive: [
      'Nesneleri uzun süre inceler',
      'Sebep-sonuç öğrenir (sallarsa ses çıkar)',
      'Tanıdık nesneleri hatırlar',
      'Mesafe algısı gelişir',
      'Renkleri ayırt eder'
    ],
    social: [
      '**İlk kahkahalar!**',
      'Yüzlere gülümser',
      'Anne-babayı seçer',
      'Etkileşimden hoşlanır',
      'Yüz ifadelerini taklit eder'
    ],
    language: [
      'Sesler çeşitlenir',
      '"Ba", "ga", "da" heceleri',
      'Kendi sesini keşfeder',
      'Konuşmalara "cevap verir"',
      'Farklı duygular farklı seslerle'
    ],
    play: [
      'Oyuncakları tutar ve sallar',
      'Ağzına götürür',
      'Aynada etkileşim',
      'Cilbir (peek-a-boo) çok sever',
      'Müzikle dans eder'
    ],
    nutrition: [
      'Sadece anne sütü/formula',
      'Düzenli beslenme (3-4 saat)',
      '12. hafta Wonder Weeks atağında emme artabilir',
      'Su veya ek gıda henüz gereksiz'
    ],
    activities: [
      'Tummy time 10-15 dakika',
      'Yuvarlanma pratiği',
      'Şarkı söyleme ve ritim',
      'Farklı sesler keşfi',
      'Kitap okuma',
      'Dış mekan gezintisi',
      'Bebek yüzme (havuz mümkünse)'
    ],
    toys: [
      'Diş kaşıyıcılar',
      'Aktivite jimnastiği',
      'Yumuşak toplar',
      'Müzikli oyuncaklar',
      'Dokulu kitaplar',
      'Çıngıraklı oyuncaklar',
      'Yumuşak bebek'
    ],
    tips: [
      'Bol bol konuşun ve okuyun',
      'Oyuncakları el değiştirin (görme alanı)',
      'Güvenli keşif ortamı yaratın',
      'Uyku eğitimi başlatabilirsiniz',
      'Fotoğraflar çekin, gelişimi kaydedin',
      'Kolik azalır, rahat dönem başlar'
    ],
    warnings: [
      '12. hafta Wonder Weeks atağı (huysuzluk)',
      'Her şeyi ağza götürme başlar (küçük parçalardan uzak)',
      'Henüz oturamaz, desteksiz bırakmayın',
      'Diş çıkarma yaklaşıyor (salyalama artabilir)',
      '3. ay kontrol muayenesi'
    ],
    nextMonthPreview: '4. ayda bebek yuvarlanabilir, nesnelere uzanır ve daha aktif hale gelir!'
  },
  {
    month: 4,
    title: '4 Aylık Bebek',
    subtitle: 'Yuvarlanma ve Keşif 🔄',
    summary: '19. hafta Wonder Weeks atağı yaklaşıyor. Bebek nesnelere uzanır, yuvarlanmaya başlar ve çok daha aktif hale gelir.',
    physical: [
      '**Yuvarlanma başlar** (sırt üstünden yan yatar)',
      'Nesneleri iki elle tutar',
      'Ayaklarını keşfeder, ağzına götürür',
      'Destekli oturma gelişir',
      'Başını her yöne çevirir',
      'Push-up pozisyonu (dirsekler üzerinde)',
      'Bacaklarını tekmeleyerek hareket eder'
    ],
    cognitive: [
      'Sebep-sonuç ilişkisini anlar (düğmeye bas-ses çıkar)',
      'Nesnelerin kalıcılığını kavramaya başlar',
      'Farklı yüzleri ayırt eder',
      'Renkleri daha net görür',
      'Oyuncağa uzanır ve yakalar',
      'İki nesneyi karşılaştırır',
      'Problem çözme girişimleri'
    ],
    social: [
      'Aynada kendini izler ve güler',
      'Tanıdık yüzlere farklı tepkiler',
      'Oyun oynarken etkileşim kurar',
      'Duygusal bağ güçlenir',
      'İlgi çekmek için ses çıkarır',
      'Yabancı korkusu başlangıcı',
      'Ebeveynleri taklit eder'
    ],
    language: [
      'Heceler daha belirgin ("ba", "ma", "ga")',
      'Sesleri taklit etmeye çalışır',
      'Konuşmalara "katılır"',
      'Farklı duygular için farklı sesler',
      'Kendi adına tepki vermeye başlar',
      'Müziğe karşı duyarlılık artar'
    ],
    play: [
      'Oyuncakları iki elle tutar',
      'Ağzına götürme devam eder',
      'Sebep-sonuç oyunları (çıngırak)',
      'Aynada kendini izler',
      'Ayak keşfi (ayaklarıyla oynar)',
      'Peek-a-boo çok sever'
    ],
    nutrition: [
      'Sadece anne sütü/formula (bazı doktorlar ek gıda önerebilir)',
      'Emzirme: 4-5 saatte bir',
      'Formula: 180-240 ml, günde 4-5 kez',
      'Geceleri 1-2 kez uyanma',
      'Ek gıda hazırlık dönemi (6. ay için)'
    ],
    activities: [
      'Yuvarlanma pratiği (güvenli yüzeyde)',
      'Tummy time 15-20 dakika',
      'Ayak masajı ve ayak oyunları',
      'Aynada kendini gösterme',
      'Müzikli oyunlar',
      'Farklı dokular hissettirme',
      'Su oyunları (banyo)',
      'Kitap okuma rutini'
    ],
    toys: [
      'Yumuşak toplar',
      'Diş kaşıyıcılar',
      'Aktivite küpleri',
      'Sesli kitaplar',
      'Oyun halısı (gym)',
      'Çıngıraklı bilezikler',
      'Yumuşak bloklar',
      'Aynalı oyuncaklar'
    ],
    tips: [
      'Yuvarlanma için güvenli alan yaratın',
      'Küçük nesneleri uzak tutun',
      'Tummy time sonrası ödüllendirin',
      'Ek gıda hazırlığı yapın (6. ay için)',
      'Uyku rutini pekiştirin',
      'Fotoğraf çekerek kayıt tutun',
      '19. hafta Wonder Weeks için hazırlıklı olun'
    ],
    warnings: [
      '19. hafta Wonder Weeks atağı (huysuzluk artabilir)',
      'Yuvarlanma başladı, yüksekten düşme riski',
      'Her şeyi ağza götürür (boğulma tehlikesi)',
      'Henüz oturamaz',
      'Diş çıkarma başlayabilir (salyalama)',
      '4. ay aşıları'
    ],
    nextMonthPreview: '5. ayda bebek emeklemeye hazırlık yapar, daha uzun süre oturur ve ek gıdaya geçiş yaklaşır!'
  },
  {
    month: 5,
    title: '5 Aylık Bebek',
    subtitle: 'Oturma Hazırlığı 🪑',
    summary: 'Bebek destekli oturma süresini uzatır, emekleme için kaslarını güçlendirir. 26. hafta Wonder Weeks atağı yaklaşıyor.',
    physical: [
      'Destekli oturma 5-10 dakika',
      'Tripod pozisyonu (ellerle destek)',
      'Yuvarlanma her iki yöne',
      'Ayakları ağzına götürür',
      'Planking pozisyonu (push-up)',
      'Geriye doğru emekleme denemeleri',
      'Objeleri bir elden diğerine aktarır'
    ],
    cognitive: [
      'Nesne kalıcılığı gelişir (saklanan oyuncağı arar)',
      'İsmiyle çağrılınca tepki verir',
      'Mesafe algısı gelişir',
      'Küçük objeleri inceleyerek keşfeder',
      'Amaçlı hareketler yapar',
      'Tercih göstermeye başlar',
      'Problem çözme becerileri gelişir'
    ],
    social: [
      'Ayrılık anksiyetesi başlangıcı',
      'Yabancı korkusu belirginleşir',
      'Anneyi odadan çıkarken izler',
      'Sosyal oyunlara katılır',
      'Duygusal tepkiler çeşitlenir',
      'Favori insanları belli eder',
      'Etkileşim arar'
    ],
    language: [
      'Babıldama (babbling) başlar',
      '"Ma-ma", "ba-ba" gibi tekrarlar',
      'Ses tonlarını taklit eder',
      'İsmine tepki verir',
      'Hayır/evet anlayışı başlar',
      'Duygularını sesle ifade eder',
      'Farklı sesleri dener'
    ],
    play: [
      'Oyuncakları iki elle manipüle eder',
      'Düşürme-alma oyunları',
      'Sebep-sonuç oyunlarından hoşlanır',
      'Peek-a-boo favorisi',
      'Ayaklarıyla oynar',
      'Nesneleri ağzına götürerek keşfeder',
      'Basit taklit oyunları'
    ],
    nutrition: [
      'Anne sütü/formula devam',
      '**6. ay için ek gıda hazırlığı**',
      'Emzirme: 4-5 saatte bir',
      'Formula: 200-240 ml, günde 4-5 kez',
      'Gece 1-2 uyanma',
      'Kaşık tanıtımı başlayabilir (oyun amaçlı)'
    ],
    activities: [
      'Destekli oturma egzersizleri',
      'Emekleme hazırlık (planking)',
      'Ayak-el koordinasyon oyunları',
      'Cilbir oyunu (peek-a-boo)',
      'Su oyunları (banyoda)',
      'Ayna oyunları',
      'Müzik ve dans',
      'Kitap okuma ve resim gösterme',
      'Doğa yürüyüşleri'
    ],
    toys: [
      'Diş kaşıyıcılar (önemli)',
      'Activity cube',
      'Ses çıkaran oyuncaklar',
      'Yumuşak bloklar',
      'Top (yuvarlanma)',
      'Dokulu kitaplar',
      'Çıngıraklı oyuncaklar',
      'Bebek aynası',
      'Stackable rings'
    ],
    tips: [
      'Ek gıdaya hazırlık yapın (6. ay için)',
      'Güvenli oturma alanı oluşturun',
      'Emekleme için yer hazırlayın',
      'Diş çıkarma belirtileri takip edin',
      'Uyku regresyonuna hazırlıklı olun',
      'Fotoğraf ve video kayıtları',
      '26. hafta Wonder Weeks için sabırlı olun'
    ],
    warnings: [
      '26. hafta Wonder Weeks atağı (ilişkiler dünyası)',
      'Ayrılık anksiyetesi başlar',
      'Diş çıkarma başlayabilir (ağrı, salyalama)',
      'Desteksiz oturamaz henüz',
      'Her şeyi ağza götürür (boğulma riski)',
      'Uyku regresyonu olabilir',
      '6. ay aşıları yaklaşıyor'
    ],
    nextMonthPreview: '6. ayda ek gıdaya geçiş, desteksiz oturma ve emekleme hazırlığı hız kazanır!'
  },
  {
    month: 6,
    title: '6 Aylık Bebek',
    subtitle: 'Ek Gıda ve Oturma 🍎',
    summary: '**Önemli Dönüm Noktası!** Ek gıdaya geçiş, desteksiz oturma başlar. Bebek daha bağımsız hale gelir.',
    physical: [
      '**Desteksiz oturma başlar** (5-10 dakika)',
      'Tripod pozisyondan bağımsız oturuşa geçiş',
      'İleri-geri sallanma (emekleme hazırlığı)',
      'Ayakları üzerinde zıplar (destekle)',
      'Objeleri iki elle tutar ve inceler',
      'Parmakları kullanarak tutma',
      'Yuvarlanma tüm yönlere'
    ],
    cognitive: [
      '**Nesne kalıcılığı tam gelişir**',
      'Saklanan oyuncağı arar ve bulur',
      'Sebep-sonuç tam anlar',
      'Kategorize etme başlar',
      'Problem çözme becerileri',
      'Amaçlı hareketler',
      'Keşif arzusu artar'
    ],
    social: [
      '**Yabancı korkusu pik yapar**',
      'Anne-babaya güçlü bağlanma',
      'Ayrılık anksiyetesi artar',
      'Favori oyuncaklar belli olur',
      'Sosyal oyunlara katılım',
      'Duygusal tepkiler zenginleşir',
      'Diğer bebeklere ilgi'
    ],
    language: [
      'Babıldama devam eder',
      '"Ma-ma-ma", "da-da-da" tekrarları',
      'Ses tonlarını çok iyi taklit eder',
      'İsmine hemen tepki verir',
      '"Hayır" kavramını anlar',
      'Basit komutları anlamaya başlar',
      'Sesinle iletişim kurar'
    ],
    play: [
      'Düşürme-alma favorisi',
      'Peek-a-boo uzmanı',
      'Sebep-sonuç oyunları',
      'Nesneleri vurma, çarpma',
      'Transfer oyunları (el-el)',
      'Emekleme taklit oyunları',
      'İnceleme ve keşif oyunları'
    ],
    nutrition: [
      '**EK GIDA BAŞLAR!** (En önemli)',
      'İlk kaşık maması: Sebze püreleri',
      'Tek tek gıda tanıtımı (3 gün aralıkla)',
      'Anne sütü/formula devam eder (ana besin)',
      'Öğün sayısı: 1-2 kaşık yemek',
      'Su verilmeye başlanır (az miktarda)',
      'Gece emzirme azalabilir'
    ],
    activities: [
      'Desteksiz oturma pratiği',
      'Emekleme hazırlık egzersizleri',
      'Ek gıda tanıtımı (eğlenceli)',
      'Peek-a-boo oyunları',
      'Ayna oyunları',
      'Müzik ve dans',
      'Kitap okuma (her gün)',
      'Park gezileri',
      'Baby sign language başlangıcı'
    ],
    toys: [
      '**Ek gıda araçları** (kaşık, tabak)',
      'Stackable cups',
      'Diş kaşıyıcılar',
      'Activity cube',
      'Yumuşak bloklar',
      'Toplar',
      'Dokulu kitaplar',
      'Müzikli oyuncaklar',
      'Push toys',
      'Ball pit topları'
    ],
    tips: [
      '**Ek gıdaya sabırlı başlayın**',
      'Alerjik reaksiyon takibi yapın',
      'Kaşıkla kendi yemeye izin verin',
      'Oturma için güvenli ortam',
      'Emekleme için engelleri kaldırın',
      'Diş çıkarma için buzluk/jel',
      'Uyku rutini pekiştirin',
      '6. ay muayenesi ve aşıları'
    ],
    warnings: [
      'Alerji riski (ek gıda)',
      'Boğulma riski (küçük parçalar)',
      'Desteksiz oturma henüz kısa süreli',
      'Emekleme başlamadı (normal)',
      'Diş çıkarma ağrısı',
      'Uyku regresyonu olabilir',
      'Ayrılık anksiyetesi zorlu olabilir'
    ],
    nextMonthPreview: '7. ayda emekleme başlar, iki kaşık mamas geçilir ve bebek çok daha mobil hale gelir!'
  },
  {
    month: 7,
    title: '7 Aylık Bebek',
    subtitle: 'Emekleme Başlangıcı 🐛',
    summary: 'Bebek emeklemeye başlar! Mobilitesi artar, bağımsızlık hissi gelişir. Ek gıda çeşitlenir.',
    physical: [
      '**Emekleme başlar** (eller-dizler)',
      'Oturur ve oturma pozisyonundan emeklemeye geçer',
      'Tutunarak ayağa kalkma denemeleri',
      'Parmak kontrolü gelişir (pincer grasp)',
      'İki parmakla küçük nesneleri tutar',
      'Ayakları üzerinde zıplar',
      'Sallanarak hareket eder'
    ],
    cognitive: [
      'Nesne kalıcılığı ustalaşır',
      'Saklanan nesneleri aktif arar',
      'Basit problemleri çözer',
      'Nesneleri karşılaştırır',
      'İçeri-dışarı oyunları anlar',
      'Taklit becerileri gelişir',
      'Mekanı keşfeder'
    ],
    social: [
      'Ayrılık anksiyetesi pik yapar',
      'Anneyi takip eder',
      'Yabancılardan çekinir',
      'Diğer çocuklara ilgi artar',
      'Oyuncak paylaşmak istemez',
      'Duygusal bağlar güçlenir',
      'Sosyal oyunlara katılır'
    ],
    language: [
      '**İlk kelime denemeleri başlar**',
      '"Ma-ma", "Da-da" anlamlı olabilir',
      'Jargon (gibberish konuşma)',
      'Basit komutları anlar ("gel", "ver")',
      'İşaret diliyle iletişim',
      'Seslerle iletişim çeşitlenir',
      'Hayvan seslerini taklit eder'
    ],
    play: [
      'Emekleme oyunları',
      'Kovalama oyunları',
      'Peek-a-boo',
      'Pat-a-cake (el şarkıları)',
      'Blok yığma (basit)',
      'İçine-dışına oyunları',
      'Taklit oyunları',
      'Top yuvarlama'
    ],
    nutrition: [
      'Ek gıda 2-3 öğüne çıkar',
      'Parmak yiyecekleri tanıtımı',
      'Yumuşak meyve parçaları',
      'Buharda pişmiş sebzeler',
      'Bebek makarna',
      'Yumurta sarısı',
      'Anne sütü/formula devam (ana)',
      'Bardaktan su içme pratiği'
    ],
    activities: [
      'Emekleme yarışları',
      'Tünel oyunları',
      'Top kovalama',
      'Müzikle dans',
      'Blok yığma',
      'Kitap okuma',
      'Park oyunları',
      'Duyusal oyunlar (kumhavuzu)',
      'Baby gym',
      'Yüzme dersleri'
    ],
    toys: [
      'Push & pull toys',
      'Yumuşak bloklar',
      'Toplar (çeşitli boyutlarda)',
      'Activity center',
      'Müzikli oyuncaklar',
      'Stackable toys',
      'Shape sorters (basit)',
      'Parmak yiyecek araçları',
      'Kitaplar (board books)',
      'Tünel'
    ],
    tips: [
      'Evi emeklemeye göre güvenli hale getirin',
      'Köşe koruyucuları takın',
      'Prizleri kapatın',
      'Basamaklara bariyer koyun',
      'Parmak yiyeceklere geçiş',
      'Kendi yemesine izin verin',
      'Bol bol konuşun ve okuyun',
      '37. hafta Wonder Weeks yaklaşıyor'
    ],
    warnings: [
      'Emekleme ile kazalar artar',
      'Boğulma riski (küçük nesneler)',
      'Elektrik prizleri tehlikeli',
      'Merdivenler riskli',
      'Mobilya kenarları keskin',
      'Kimyasal maddeler erişilebilir olmasın',
      'Ayrılık anksiyetesi zorlu olabilir'
    ],
    nextMonthPreview: '8. ayda bebek daha hızlı emekler, tutunarak ayağa kalkar ve ilk kelimeler yaklaşır!'
  },
  {
    month: 8,
    title: '8 Aylık Bebek',
    subtitle: 'Tutunarak Ayakta 🧍',
    summary: 'Bebek tutunarak ayağa kalkar! Emekleme ustalaşır, mobilitesi artar. İlk kelimeler yaklaşıyor.',
    physical: [
      '**Tutunarak ayağa kalkma**',
      'Mobilyalara tutunarak hareket',
      'Hızlı emekleme',
      'Oturma-emekleme geçişi kolay',
      'Pincer grasp ustalaşır',
      'İki elimle farklı işler',
      'Koordinasyon gelişir'
    ],
    cognitive: [
      'Nesne kalıcılığı tam',
      'Sebep-sonuç ustalaşır',
      'Basit problemleri çözer',
      'İki objeyi bir araya getirir',
      'İçinde-dışında kavramı',
      'Taklit becerileri güçlenir',
      'Hafıza gelişir'
    ],
    social: [
      'Sosyal referanslama başlar',
      'Anne-babanın yüzüne bakarak güven arar',
      'Ayrılık anksiyetesi devam',
      'Oyuncak paylaşmak istemez',
      'Diğer bebeklere ilgi',
      'Sosyal oyunları sever',
      'Duygusal bağlar derinleşir'
    ],
    language: [
      '**İlk anlamlı kelimeler yaklaşıyor**',
      '"Ma-ma" veya "Da-da" anlamlı kullanım',
      'Jargon (konuşma benzeri sesler)',
      'Basit komutları anlar',
      'İşaret ediyor',
      'El sallıyor (hoşça kal)',
      'Hayır başını sallayarak gösterir'
    ],
    play: [
      'Kovalama oyunları',
      'Peek-a-boo',
      'Pat-a-cake',
      'Blok yığma',
      'İçine-dışına oyunları',
      'Taklit oyunları',
      'Top oyunları',
      'Müzikle dans'
    ],
    nutrition: [
      'Ek gıda 3 öğün',
      'Parmak yiyecekleri artıyor',
      'Kendi yeme becerisi gelişiyor',
      'Bardaktan su içme',
      'Çeşitli sebze-meyve',
      'Et tanıtımı',
      'Yoğurt',
      'Anne sütü/formula azalabilir'
    ],
    activities: [
      'Emekleme oyunları',
      'Tutunarak yürüme pratiği',
      'Müzik ve dans',
      'Blok yığma',
      'Kitap okuma',
      'Park oyunları',
      'Havuz/banyo oyunları',
      'Duyusal aktiviteler',
      'Baby sign language'
    ],
    toys: [
      'Push walker',
      'Activity center',
      'Bloklar',
      'Top',
      'Müzikli oyuncaklar',
      'Shape sorter',
      'Stackable rings',
      'Board books',
      'Tünel',
      'Soft dolls'
    ],
    tips: [
      'Tutunma için güvenli mobilyalar',
      'Emekleme alanı genişletin',
      'Kendi yemesine izin verin',
      'Konuşma ve okuma artırın',
      'Baby-proofing kontrol edin',
      'Uyku rutinini koruyun',
      '8. ay muayenesi'
    ],
    warnings: [
      'Düşme riski artar',
      'Çekmeceler çekilebilir',
      'Mobilyalar devrilebilir',
      'Boğulma riski (parmak yiyecekler)',
      'Elektrik prizleri',
      'Köşe darbeleri',
      'Ayrılık anksiyetesi devam'
    ],
    nextMonthPreview: '9. ayda bebek daha bağımsız yürür, ilk kelimeler çıkar ve daha da keşifçi olur!'
  },
  {
    month: 9,
    title: '9 Aylık Bebek',
    subtitle: 'Keşifçi Dönem 🔍',
    summary: 'Bebek her yeri keşfeder! Tutunarak yürümeye başlar, ilk kelimeler çıkabilir. Çok aktif bir dönem.',
    physical: [
      'Tutunarak yürüme (cruising)',
      'Tek başına ayakta durma denemeleri',
      'Hızlı emekleme',
      'Merdiven çıkma denemeleri',
      'Parmak becerileri gelişir',
      'İki parmakla küçük nesneleri tutar',
      'Koordinasyon ileri seviye'
    ],
    cognitive: [
      'Problem çözme becerileri güçlenir',
      'Nesneleri kategorize eder',
      'Sebep-sonuç tam anlar',
      'Basit yönergeleri takip eder',
      'Hafıza güçlenir',
      'Keşif arzusu zirveye',
      'Amaçlı davranışlar'
    ],
    social: [
      'Ayrılık anksiyetesi pik yapar',
      'Sosyal referanslama gelişir',
      'Paylaşmak istemez',
      'Diğer çocuklarla paralel oyun',
      'Duygusal tepkiler çeşitlenir',
      'Bağlanma güçlenir',
      'Sosyal oyunları çok sever'
    ],
    language: [
      '**İlk kelimeler çıkabilir**',
      '"Ma-ma", "Da-da", "Baba"',
      'Basit komutları anlar ("gel", "ver")',
      'İşaret diliyle iletişim',
      'El sallar',
      'Hayır başıyla gösterir',
      'Jargon zenginleşir'
    ],
    play: [
      'Kovalama oyunları',
      'Saklı-saklı oyunları',
      'Blok yığma (3-4 blok)',
      'Shape sorter',
      'Müzikli oyunlar',
      'Taklit oyunları',
      'Top oyunları',
      'İçine-dışına oyunları'
    ],
    nutrition: [
      'Ek gıda 3 öğün + 2 atıştırma',
      'Aile sofrasına geçiş',
      'Kendi kaşığıyla yeme',
      'Bardaktan su içme',
      'Çeşitli yiyecekler',
      'Finger foods',
      'Anne sütü/formula azalıyor',
      'İnek sütü YOK (1 yaş sonrası)'
    ],
    activities: [
      'Tutunarak yürüme pratiği',
      'Müzik ve dans',
      'Blok aktiviteleri',
      'Kitap okuma',
      'Park oyunları',
      'Havuz',
      'Duyusal oyunlar (kum, su)',
      'Baby sign language',
      'Sosyal aktiviteler'
    ],
    toys: [
      'Push walker',
      'Ride-on toys',
      'Bloklar',
      'Shape sorter',
      'Müzikli oyuncaklar',
      'Board books',
      'Top',
      'Soft dolls',
      'Activity table',
      'Bath toys'
    ],
    tips: [
      'Evi tamamen güvenli hale getirin',
      'Merdiven bariyerleri önemli',
      'Kendi yemesine izin verin',
      'Bol bol konuşun',
      'Okuma rutinini sürdürün',
      '46. hafta Wonder Weeks yaklaşıyor',
      '9. ay muayenesi'
    ],
    warnings: [
      'Düşme riski çok yüksek',
      'Merdiven tehlikeli',
      'Mobilya devrilmesi',
      'Boğulma riski',
      'Ayrılık anksiyetesi zor olabilir',
      'Uyku regresyonu',
      'Diş çıkarma devam'
    ],
    nextMonthPreview: '10. ayda bebek daha bağımsız hareket eder, kelime hazinesi artar ve 1 yaşa hazırlanır!'
  },
  {
    month: 10,
    title: '10 Aylık Bebek',
    subtitle: 'Bağımsızlık Arayışı 🚶',
    summary: 'Bebek daha bağımsız! Tutunmadan ayakta durma, ilk adımlar yaklaşıyor. Kelime haziesi gelişiyor.',
    physical: [
      'Tutunmadan ayakta durma (birkaç saniye)',
      'Tutunarak yürüme ustalaşır',
      '**İlk adımlar yaklaşıyor**',
      'Eğilip alma',
      'Merdivenlerden inerken geri geri gider',
      'Parmak becerileri ileri seviye',
      'Kaşık kullanma denemeleri'
    ],
    cognitive: [
      'Problem çözme becerileri ileri',
      'Basit puzzle (2-3 parça)',
      'Nesneleri kategorize eder',
      'Hafıza güçlenir',
      'Amaçlı davranışlar',
      'Taklit becerileri gelişir',
      'Keşif arzusu devam'
    ],
    social: [
      'Bağımsızlık arzusu artar',
      'Ayrılık anksiyetesi azalmaya başlar',
      'Sosyal oyunlara katılır',
      'Paylaşmayı öğrenmeye başlar',
      'Duygusal bağlar güçlenir',
      'Empati gösterebilir',
      'Diğer çocuklarla etkileşim'
    ],
    language: [
      '**2-3 anlamlı kelime**',
      '"Ma-ma", "Da-da", "Baba", "Abi"',
      'Basit cümleleri anlar',
      'İşaret diliyle iletişim güçlenir',
      'Hayır/evet gösterir',
      'Basit yönergeleri takip eder',
      'Jargon konuşma devam'
    ],
    play: [
      'Push & pull toys',
      'Blok yığma (4-5 blok)',
      'Shape sorter',
      'Basit puzzle',
      'Taklit oyunları',
      'Müzikli oyunlar',
      'Top oyunları',
      'Saklı-saklı'
    ],
    nutrition: [
      'Aile yemekleri',
      '3 öğün + 2-3 atıştırma',
      'Kendi yeme becerileri gelişiyor',
      'Bardaktan su',
      'Çeşitli yiyecekler',
      'Anne sütü/formula azalıyor',
      'Gece emzirme azalabilir'
    ],
    activities: [
      'Yürüme pratiği',
      'Müzik ve dans',
      'Blok aktiviteleri',
      'Puzzle',
      'Kitap okuma',
      'Park oyunları',
      'Duyusal aktiviteler',
      'Sosyal aktiviteler',
      'Baby gym'
    ],
    toys: [
      'Push walker',
      'Ride-on toys',
      'Bloklar',
      'Puzzle (basit)',
      'Shape sorter',
      'Müzikli oyuncaklar',
      'Board books',
      'Soft dolls',
      'Activity toys',
      'Ball'
    ],
    tips: [
      'Yürüme için destek verin',
      'Düşmelere hazırlıklı olun',
      'Konuşmaya teşvik edin',
      'Okuma rutinini sürdürün',
      'Sosyal aktivitelere katılın',
      '10. ay muayenesi',
      '1 yaşa hazırlık başlayın'
    ],
    warnings: [
      'Düşme riski yüksek',
      'Yürüme sırasında dengeli değil',
      'Mobilya devrilmesi',
      'Boğulma riski',
      'Merdiven tehlikesi',
      'Keskin köşeler',
      'Uyku regresyonu'
    ],
    nextMonthPreview: '11. ayda bebek ilk adımlarını atabilir! 1 yaş yaklaşıyor, büyük bir dönüm noktası!'
  },
  {
    month: 11,
    title: '11 Aylık Bebek',
    subtitle: 'İlk Adımlar Yaklaşıyor 👣',
    summary: '1 yaşa hazırlık dönemi! İlk adımlar atılabilir, kelime haziesi genişler. Büyük bir dönüm noktası yaklaşıyor.',
    physical: [
      '**İlk bağımsız adımlar atılabilir**',
      'Tutunmadan ayakta durma',
      'Eğilip alma',
      'Merdivenlerden çıkma-inme',
      'Kaşık kullanma gelişiyor',
      'İnce motor becerileri ileri',
      'Koordinasyon güçleniyor'
    ],
    cognitive: [
      'Problem çözme ustalaşır',
      'Nesneleri kategorize eder',
      'Hafıza güçlenir',
      'Basit yönergeleri takip eder',
      'Taklit becerileri ileri',
      'Keşif arzusu devam',
      'Amaçlı davranışlar'
    ],
    social: [
      'Bağımsızlık arzusu güçlenir',
      'Sosyal oyunlara aktif katılır',
      'Paylaşmayı öğrenmeye devam',
      'Empati gösterebilir',
      'Duygusal bağlar derinleşir',
      'Diğer çocuklarla etkileşim artar',
      'Ayrılık anksiyetesi azalır'
    ],
    language: [
      '**3-5 anlamlı kelime**',
      'Kelime haziesi genişliyor',
      'Basit cümleleri anlar',
      'İşaret diliyle iletişim',
      'Hayır/evet sözel ifade',
      'Basit sorulara yanıt',
      'Jargon zenginleşir'
    ],
    play: [
      'Push & pull toys',
      'Blok yığma (5-6 blok)',
      'Puzzle (4-5 parça)',
      'Shape sorter',
      'Taklit oyunları',
      'Müzikli oyunlar',
      'Top oyunları',
      'Pretend play başlangıcı'
    ],
    nutrition: [
      'Aile yemekleri',
      '3 öğün + 2-3 atıştırma',
      'Kendi yeme becerileri iyi',
      'Bardaktan su içme',
      'Çeşitli yiyecekler',
      'Anne sütü/formula azalıyor',
      '**1 yaşta inek sütüne geçiş hazırlığı**'
    ],
    activities: [
      'Yürüme pratiği',
      'Müzik ve dans',
      'Blok aktiviteleri',
      'Puzzle',
      'Kitap okuma',
      'Park oyunları',
      'Sosyal aktiviteler',
      'Duyusal oyunlar',
      '1 yaş partisi hazırlığı'
    ],
    toys: [
      'Push walker',
      'Ride-on toys',
      'Bloklar',
      'Puzzle',
      'Shape sorter',
      'Müzikli oyuncaklar',
      'Board books',
      'Dolls',
      'Activity toys',
      'Ball'
    ],
    tips: [
      'İlk adımları destekleyin',
      'Düşmelere sakin yaklaşın',
      'Konuşmayı teşvik edin',
      'Okuma rutinini sürdürün',
      '1 yaş partisi planlayın',
      '11. ay muayenesi',
      '55. hafta Wonder Weeks yaklaşıyor'
    ],
    warnings: [
      'Düşme riski devam',
      'Yürüme dengesizlikleri',
      'Boğulma riski',
      'Merdiven',
      'Mobilya devrilmesi',
      'Uyku regresyonu',
      '1 yaş aşıları yaklaşıyor'
    ],
    nextMonthPreview: '12. ayda bebek 1 yaşına giriyor! Büyük bir kutlama ve yeni bir başlangıç!'
  },
  {
    month: 12,
    title: '1 Yaşına Geldi! 🎂',
    subtitle: 'Büyük Kutlama ve Yeni Başlangıç 🎉',
    summary: '**1 yaş dönüm noktası!** Bebek artık toddler! İlk kelimeler, ilk adımlar, büyük gelişimler. Harika bir yıl geçti!',
    physical: [
      '**Bağımsız yürüme başlar** (bazı bebekler)',
      'Tutunarak yürüme ustalaşır',
      'Merdivenlerden çıkma-inme',
      'Eğilip alma',
      'Kaşık kullanma gelişiyor',
      'Bardaktan içme',
      'İnce motor becerileri iyi'
    ],
    cognitive: [
      'Problem çözme becerileri ileri',
      'Basit puzzle (5-6 parça)',
      'Nesneleri kategorize eder',
      'Hafıza güçlenir',
      'Taklit becerileri ustalaşır',
      'Amaçlı davranışlar',
      'Keşif arzusu devam'
    ],
    social: [
      'Bağımsızlık arzusu güçlü',
      'Sosyal oyunlara katılır',
      'Paylaşmayı öğreniyor',
      'Empati gösterebilir',
      'Duygusal bağlar güçlü',
      'Diğer çocuklarla oyun',
      'Ayrılık anksiyetesi azaldı'
    ],
    language: [
      '**5-10 anlamlı kelime**',
      'Kelime haziesi genişliyor',
      'Basit cümleleri anlar',
      'İşaret diliyle iletişim',
      'Hayır/evet sözel',
      'Basit sorulara yanıt',
      'İlk iki kelimeli cümleler yaklaşıyor'
    ],
    play: [
      'Pretend play başlangıcı',
      'Blok yığma (6+ blok)',
      'Puzzle (6+ parça)',
      'Shape sorter',
      'Müzikli oyunlar',
      'Top oyunları',
      'Taklit oyunları',
      'Sosyal oyunlar'
    ],
    nutrition: [
      '**İnek sütü başlayabilir** (1 yaş sonrası)',
      'Aile yemekleri',
      '3 öğün + 2-3 atıştırma',
      'Kendi yeme becerileri iyi',
      'Çeşitli yiyecekler',
      'Anne sütü dilerse devam edebilir',
      'Formula kesilebi lir'
    ],
    activities: [
      'Yürüme pratiği',
      'Müzik ve dans',
      'Blok aktiviteleri',
      'Puzzle',
      'Kitap okuma',
      'Park oyunları',
      'Sosyal aktiviteler',
      'Duyusal oyunlar',
      'Toddler sınıfları'
    ],
    toys: [
      'Push & pull toys',
      'Ride-on toys',
      'Bloklar',
      'Puzzle',
      'Shape sorter',
      'Müzikli oyuncaklar',
      'Board books',
      'Dolls',
      'Pretend play toys',
      'Ball'
    ],
    tips: [
      '**1 yaş kutlaması!**',
      'İlk yaş fotoğrafları',
      'Gelişim değerlendirmesi',
      'Yürümeyi destekleyin',
      'Konuşmayı teşvik edin',
      'Toddler dönemi hazırlığı',
      '12. ay muayenesi ve aşıları'
    ],
    warnings: [
      'Düşme riski devam',
      'Boğulma riski',
      'Merdi ven',
      'Mobilya',
      '1 yaş aşıları önemli',
      'Toddler tantrum başlayabilir',
      '64. hafta Wonder Weeks yaklaşıyor'
    ],
    nextMonthPreview: '13. aydan sonra toddler dönemi başlıyor! Yeni maceralar, yeni beceriler, yeni keşifler!'
  },
  {
    month: 13,
    title: '13 Aylık Toddler',
    subtitle: 'Toddler Dönemi Başladı! 👶➡️🧒',
    summary: 'Bebek artık toddler! Bağımsızlık arzusu güçlenir, yürüme gelişir, kelime haziesi genişler.',
    physical: [
      'Bağımsız yürüme gelişiyor',
      'Hızlı hareket ediyor',
      'Merdivenlerden çıkıyor (tutunarak)',
      'Topla oynuyor (tekme, atma)',
      'Kaşık kullanma gelişiyor',
      'Bardaktan içme ustalaşıyor',
      'Küçük nesneleri parmakla tutuyor',
      'Dans ediyor müzikle'
    ],
    cognitive: [
      'Problem çözme becerileri ileri',
      'Basit yönergeleri takip ediyor',
      'Nesneleri kategorize ediyor',
      'Sebep-sonuç ustalaşıyor',
      'Hafıza güçleniyor',
      'Taklit becerileri gelişiyor',
      'Keşif arzusu çok yüksek',
      'Basit puzzle çözüyor (3-4 parça)'
    ],
    social: [
      'Bağımsızlık arzusu güçlü',
      '**İlk tantrum\'lar başlayabilir**',
      'Paylaşmayı öğreniyor (zor)',
      'Diğer çocuklarla paralel oyun',
      'Empati gösterebiliyor',
      'Duygusal bağlar derin',
      'Sosyal referanslama yapıyor'
    ],
    language: [
      '**5-10 kelime aktif kullanım**',
      'İki kelimeli cümleler başlangıcı',
      'Basit komutları anlıyor',
      'İşaret diliyle iletişim',
      'Hayır/evet sözel ifade',
      'Sorulara tepki veriyor',
      'Jargon zenginleşiyor',
      'İsimlerle çağırıyor'
    ],
    play: [
      'Pretend play başlıyor',
      'Telefonda konuşma taklidi',
      'Bebeği besleme oyunu',
      'Blok yığma (6-7 blok)',
      'Puzzle (4-5 parça)',
      'Top oyunları',
      'Müzikle dans',
      'Taklit oyunları'
    ],
    nutrition: [
      'İnek sütü devam (günde 2-3 bardak)',
      'Aile yemekleri',
      '3 öğün + 2-3 atıştırma',
      'Kendi yeme becerileri iyi',
      'Çatal-kaşık kullanma denemeleri',
      'Çeşitli yiyecekler',
      'Su içme düzenli',
      'Picky eating başlayabilir'
    ],
    activities: [
      'Yürüme egzersizleri',
      'Top oyunları',
      'Müzik ve dans',
      'Blok aktiviteleri',
      'Puzzle',
      'Kitap okuma',
      'Park oyunları',
      'Duyusal aktiviteler',
      'Pretend play',
      'Sosyal oyun grupları'
    ],
    toys: [
      'Push & pull toys',
      'Ride-on toys',
      'Bloklar',
      'Puzzle',
      'Pretend play setleri',
      'Müzikli oyuncaklar',
      'Board books',
      'Dolls/bebek',
      'Oyuncak telefon',
      'Top',
      'Art supplies (crayon)'
    ],
    tips: [
      'Tantrum\'lara sakin yaklaşın',
      'Sınırlar koyun ama nazik olun',
      'Seçenek sunun (2 şey)',
      'Konuşmayı teşvik edin',
      'Okuma rutinini sürdürün',
      'Sosyal aktivitelere katılın',
      'Güvenli keşif ortamı',
      'Pozitif disiplin'
    ],
    warnings: [
      'Tantrum\'lar başlıyor (normal)',
      'Düşme riski yüksek',
      'Boğulma riski',
      'Picky eating dönemi',
      'Uyku regresyonu olabilir',
      'Ayrılık anksiyetesi geri gelebilir',
      '64. hafta Wonder Weeks (prensipler)'
    ],
    nextMonthPreview: '14. ayda toddler daha bağımsız! Kelime haziesi genişliyor, motor becerileri gelişiyor!'
  },
  {
    month: 14,
    title: '14 Aylık Toddler',
    subtitle: 'Daha Bağımsız! 🎯',
    summary: 'Toddler daha bağımsız hareket ediyor, kelime haziesi genişliyor, motor becerileri gelişiyor.',
    physical: [
      'Yürüme ustalaşıyor',
      'Geriye yürüme',
      'Merdivenlerden inme (tutunarak)',
      'Topla oynama (tekme, fırlatma)',
      'Kaşık-çatal kullanımı gelişiyor',
      'Ayakkabı çıkarma',
      'Kapıları açma',
      'Dans ve müzik hareketleri'
    ],
    cognitive: [
      'Problem çözme ustalaşıyor',
      'Neden-sonuç anlıyor',
      'Nesneleri kategorize ediyor',
      'Hafıza güçlü',
      'İki-üç adımlı yönergeleri takip',
      'Taklit becerileri ileri',
      'Puzzle çözme (5-6 parça)',
      'Renkleri ayırt etmeye başlıyor'
    ],
    social: [
      'Bağımsızlık arzusu güçlü',
      'Tantrum\'lar devam',
      'Paylaşma zorluğu',
      'Paralel oyun',
      'Empati gösteriyor',
      'Sosyal oyunlara katılıyor',
      'Diğer çocuklara ilgi'
    ],
    language: [
      '**10-15 kelime**',
      'İki kelimeli cümleler',
      'Basit sorulara yanıt',
      'İsim-fiil kombinasyonları',
      'Hayır/evet net ifade',
      'Sorular soruyor ("Ne?", "Kim?")',
      'Jargon zengin',
      'Şarkı söyleme denemeleri'
    ],
    play: [
      'Pretend play gelişiyor',
      'Ev işleri taklidi',
      'Telefonda konuşma',
      'Bebeğe bakma oyunu',
      'Blok kuleler (7-8 blok)',
      'Puzzle',
      'Top oyunları',
      'Müzikle dans',
      'Boyama (scribbling)'
    ],
    nutrition: [
      'İnek sütü 2-3 bardak',
      'Aile yemekleri',
      '3 öğün + atıştırma',
      'Kendi yeme',
      'Çatal kullanma',
      'Picky eating devam',
      'Yeni tatlar sunma',
      'Aile sofrasında yeme'
    ],
    activities: [
      'Dış mekan oyunları',
      'Park',
      'Top oyunları',
      'Müzik ve dans',
      'Blok aktiviteleri',
      'Puzzle',
      'Boyama',
      'Kitap okuma',
      'Pretend play',
      'Playdate\'ler'
    ],
    toys: [
      'Ride-on toys',
      'Bloklar',
      'Puzzle',
      'Pretend play setleri',
      'Oyuncak mutfak',
      'Bebekler',
      'Müzik aletleri',
      'Top',
      'Crayon/boyalar',
      'Board books'
    ],
    tips: [
      'Tantrum\'lara sakin kalın',
      'Rutin oluşturun',
      'Seçenek sunun',
      'Konuşmayı teşvik edin',
      'Bol bol okuyun',
      'Outdoor activities',
      'Pozitif disiplin',
      'Sosyalleşme'
    ],
    warnings: [
      'Tantrum\'lar şiddetlenebilir',
      'Picky eating zorlu',
      'Uyku direnci',
      'Düşme riski',
      'Boğulma',
      'Ayrılık anksiyetesi',
      'Diş çıkarma devam'
    ],
    nextMonthPreview: '15. ayda cümle kurma başlıyor, motor becerileri gelişiyor, daha sosyal!'
  },
  {
    month: 15,
    title: '15 Aylık Toddler',
    subtitle: 'Cümle Kurma Başlıyor! 💬',
    summary: 'Toddler iki-üç kelimeli cümleler kuruyor, koşma denemeleri, sosyal becerileri gelişiyor.',
    physical: [
      'Koşma denemeleri',
      'Merdivenlerde ustalaşma',
      'Topla oynama gelişiyor',
      'Çatal-kaşık kullanımı iyi',
      'Giyinme yardım ediyor',
      'Kapıları açma-kapama',
      'Küçük nesneleri tutma',
      'Dans becerileri gelişiyor'
    ],
    cognitive: [
      'İki-üç adımlı yönergeleri takip',
      'Problem çözme ustalaşıyor',
      'Renkleri tanımaya başlıyor',
      'Şekilleri ayırt ediyor',
      'Hafıza güçlü',
      'Sebep-sonuç tam',
      'Puzzle (6-8 parça)',
      'Sayma girişimleri'
    ],
    social: [
      'Sosyal oyunlara katılım',
      'Paylaşma öğreniyor (hala zor)',
      'Empati gösteriyor',
      'Tantrum\'lar devam',
      'Bağımsızlık arzusu',
      'Diğer çocuklarla oyun',
      'Sosyal kuralları öğreniyor'
    ],
    language: [
      '**15-20 kelime**',
      '**İlk iki-üç kelimeli cümleler**',
      '"Mama gel", "Baba araba"',
      'Sorulara yanıt veriyor',
      'Hayvan seslerini taklit',
      'Şarkı söylüyor',
      'Basit sorular soruyor',
      'İsim bilgisi artıyor'
    ],
    play: [
      'Pretend play zenginleşiyor',
      'Role play başlangıcı',
      'Ev işleri taklidi',
      'Blok kuleler (8-10 blok)',
      'Puzzle',
      'Boyama-çizim',
      'Top oyunları',
      'Müzik ve dans',
      'Sosyal oyunlar'
    ],
    nutrition: [
      'İnek sütü 2 bardak',
      'Aile yemekleri',
      '3 öğün + atıştırma',
      'Kendi yeme ustalaşıyor',
      'Çeşitli yiyecekler',
      'Picky eating devam',
      'Bardaktan su',
      'Aile sofrasında'
    ],
    activities: [
      'Park oyunları',
      'Top oyunları',
      'Koşma-yürüme',
      'Müzik ve dans',
      'Boyama',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Playdate',
      'Toddler sınıfları'
    ],
    toys: [
      'Ride-on toys',
      'Bloklar',
      'Puzzle',
      'Oyuncak mutfak',
      'Bebekler',
      'Araçlar',
      'Müzik aletleri',
      'Boyama malzemeleri',
      'Top',
      'Pretend play setleri'
    ],
    tips: [
      'Dil gelişimini destekleyin',
      'Cümle kurmasını teşvik edin',
      'Bol bol okuyun',
      'Sosyal aktiviteler',
      'Outdoor oyunlar',
      'Rutin sürdürün',
      'Pozitif disiplin',
      '15. ay muayenesi'
    ],
    warnings: [
      'Tantrum\'lar devam',
      'Koşarken düşme',
      'Boğulma riski',
      'Picky eating',
      'Uyku sorunları',
      'Diş çıkarma',
      '75. hafta Wonder Weeks yaklaşıyor'
    ],
    nextMonthPreview: '16. ayda toddler daha sosyal, kelime patlaması yaklaşıyor!'
  },
  {
    month: 16,
    title: '16 Aylık Toddler',
    subtitle: 'Sosyal Gelişim 👫',
    summary: 'Toddler daha sosyal, kelime haziesi hızla artıyor, motor becerileri gelişiyor.',
    physical: [
      'Koşma gelişiyor',
      'Merdivenlerde bağımsız',
      'Topla oyun gelişiyor',
      'Giyinme-soyunma yardım',
      'Çatal-kaşık ustalaşıyor',
      'Tırmanma',
      'Dans becerileri',
      'İnce motor gelişimi'
    ],
    cognitive: [
      'Renkleri tanıyor (bazıları)',
      'Şekilleri ayırt ediyor',
      'Sayma 1-3',
      'Problem çözme ileri',
      'Hafıza güçlü',
      'Puzzle (8-10 parça)',
      'Kategorilendirme',
      'Sebep-sonuç ustalaşıyor'
    ],
    social: [
      'Sosyal oyunlar artıyor',
      'Paylaşma gelişiyor',
      'Empati güçleniyor',
      'Tantrum\'lar devam',
      'Arkadaşlık kavramı',
      'Sıra bekleme öğreniyor',
      'Sosyal kurallar'
    ],
    language: [
      '**20-30 kelime**',
      'Üç-dört kelimeli cümleler',
      'Kelime patlaması başlıyor',
      'Sorular soruyor',
      'Hayvan isimlerini biliyor',
      'Vücut parçalarını gösteriyor',
      'Şarkı söylüyor',
      'Basit hikayeler anlatıyor'
    ],
    play: [
      'Role play',
      'Pretend play zengin',
      'Sosyal oyunlar',
      'Blok yapılar (10+ blok)',
      'Puzzle',
      'Boyama-çizim',
      'Top oyunları',
      'Müzik',
      'İmaginative play'
    ],
    nutrition: [
      'İnek sütü 2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Kendi yeme',
      'Çeşitli yiyecekler',
      'Picky eating azalıyor',
      'Sağlıklı atıştırmalıklar',
      'Aile sofrası'
    ],
    activities: [
      'Park',
      'Playdate\'ler',
      'Müzik dersleri',
      'Spor aktiviteleri',
      'Boyama',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Outdoor oyunlar',
      'Toddler grupları'
    ],
    toys: [
      'Ride-on toys',
      'Trike (üç tekerlekli)',
      'Bloklar',
      'Puzzle',
      'Pretend play setleri',
      'Bebekler',
      'Araçlar',
      'Boyama malzemeleri',
      'Müzik aletleri',
      'Top'
    ],
    tips: [
      'Kelime öğretmeye devam',
      'Sosyal aktiviteler',
      'Paylaşmayı öğretin',
      'Bol bol okuyun',
      'Outdoor oyunlar',
      'Rutin sürdürün',
      'Pozitif disiplin',
      '16. ay kontrolü'
    ],
    warnings: [
      'Tantrum\'lar devam',
      'Tırmanma kazaları',
      'Düşme riski',
      'Boğulma',
      'Uyku sorunları',
      '75. hafta Wonder Weeks (sistemler)',
      'Picky eating'
    ],
    nextMonthPreview: '17. ayda kelime patlaması devam, bağımsızlık artıyor!'
  },
  {
    month: 17,
    title: '17 Aylık Toddler',
    subtitle: 'Kelime Patlaması Devam Ediyor 📚',
    summary: 'Kelime haziesi hızla artıyor, bağımsızlık arzusu güçleniyor, pretend play zenginleşiyor.',
    physical: [
      'Koşma gelişiyor',
      'Merdivenlerden inme-çıkma (tutunarak)',
      'Topla oyun (tekme, atma, yakalama)',
      'Tırmanma becerileri',
      'Çatal-kaşık ustalaşıyor',
      'Giyinme-soyunma yardım ediyor',
      'Dans becerileri gelişiyor',
      'İnce motor becerileri ileri'
    ],
    cognitive: [
      'Renkleri tanımaya başlıyor',
      'Şekilleri ayırt ediyor',
      'Sayma 1-3 (bazıları 1-5)',
      'Problem çözme becerileri',
      'Puzzle (10-12 parça)',
      'Kategorilendirme yapıyor',
      'Hafıza güçlü',
      'Sebep-sonuç ilişkileri anlıyor'
    ],
    social: [
      'Sosyal oyunlar artıyor',
      'Paylaşma gelişiyor (hala zor)',
      'Empati gösteriyor',
      'Tantrum\'lar devam ediyor',
      'Arkadaşlık kavramı gelişiyor',
      'Sıra beklemeyi öğreniyor',
      'Sosyal kuralları öğreniyor'
    ],
    language: [
      '**25-35 kelime**',
      'Üç-dört kelimeli cümleler',
      'Kelime öğrenme hızlanıyor',
      'Sorular soruyor ("Ne?", "Kim?")',
      'Hayvan isimlerini biliyor',
      'Vücut parçalarını gösteriyor',
      'Şarkı söylüyor',
      'Basit hikayeler anlatmaya çalışıyor'
    ],
    play: [
      'Role play gelişiyor',
      'Pretend play zengin',
      'Sosyal oyunlar',
      'Blok kuleler (10+ blok)',
      'Puzzle aktiviteleri',
      'Boyama-çizim',
      'Top oyunları',
      'Müzik ve dans',
      'İmaginative play başlıyor'
    ],
    nutrition: [
      'İnek sütü 2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Kendi yeme ustalaşıyor',
      'Çeşitli yiyecekler deneyin',
      'Picky eating azalıyor',
      'Sağlıklı atıştırmalıklar',
      'Aile sofrasında oturuyor'
    ],
    activities: [
      'Park oyunları',
      'Playdate\'ler',
      'Müzik dersleri',
      'Spor aktiviteleri',
      'Boyama etkinlikleri',
      'Puzzle yapma',
      'Pretend play',
      'Kitap okuma',
      'Outdoor keşif',
      'Toddler grupları'
    ],
    toys: [
      'Ride-on toys',
      'Trike (üç tekerlekli bisiklet)',
      'Bloklar (LEGO Duplo)',
      'Puzzle (10-15 parça)',
      'Pretend play setleri',
      'Bebekler',
      'Araçlar',
      'Boyama malzemeleri',
      'Müzik aletleri',
      'Top',
      'Shape sorter'
    ],
    tips: [
      'Kelime öğretmeye devam edin',
      'Sosyal aktivitelere katılın',
      'Paylaşmayı öğretin',
      'Bol bol kitap okuyun',
      'Outdoor oyunlar',
      'Rutininizi sürdürün',
      'Pozitif disiplin uygulayın',
      '17. ay kontrolü'
    ],
    warnings: [
      'Tantrum\'lar devam ediyor',
      'Tırmanma kazaları riski',
      'Düşme riski',
      'Boğulma riski',
      'Uyku sorunları olabilir',
      'Picky eating',
      'Diş çıkarma devam'
    ],
    nextMonthPreview: '18. ayda kelime patlaması pik yapıyor! 50+ kelime, önemli muayene dönemi!'
  },
  {
    month: 18,
    title: '18 Aylık Toddler',
    subtitle: 'Kelime Patlaması! 🗣️💥',
    summary: '**Önemli Dönüm Noktası!** Kelime patlaması, bağımsızlık artıyor, 1.5 yaş muayenesi.',
    physical: [
      'Koşma ustalaşıyor',
      'Merdivenlerde bağımsız',
      'Topla oyun iyi',
      'Tırmanma',
      'Çatal-kaşık kullanımı',
      'Giyinme-soyunma yardım',
      'Dans',
      'Tuvalet eğitimi hazırlığı başlayabilir'
    ],
    cognitive: [
      'Renkleri tanıyor',
      'Şekilleri biliyor',
      'Sayma 1-5',
      'Problem çözme ileri',
      'Puzzle (12+ parça)',
      'Kategorilendirme',
      'Hafıza güçlü',
      'Sebep-sonuç ustalaşıyor'
    ],
    social: [
      '**Bağımsızlık arzusu pik**',
      'Tantrum\'lar şiddetli olabilir',
      'Paylaşma gelişiyor',
      'Empati güçlü',
      'Arkadaşlıklar',
      'Sosyal oyunlar',
      'Sıra bekleme'
    ],
    language: [
      '**50+ kelime (Kelime Patlaması!)**',
      'Dört-beş kelimeli cümleler',
      'Sorular soruyor ("Ne?", "Nerede?")',
      'Basit konuşmalar',
      'Şarkı söylüyor',
      'Hikayeleri anlatıyor',
      'İki dilli gelişim hızlanıyor',
      'Zamirler kullanmaya başlıyor'
    ],
    play: [
      'İmaginative play',
      'Role play zengin',
      'Pretend play ustalaşıyor',
      'Sosyal oyunlar',
      'Blok yapılar karmaşık',
      'Puzzle',
      'Boyama-çizim',
      'Müzik ve dans',
      'Outdoor oyunlar'
    ],
    nutrition: [
      'İnek sütü 1-2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Kendi yeme bağımsız',
      'Çeşitli yiyecekler',
      'Sağlıklı atıştırmalıklar',
      'Su içme',
      'Aile sofrası'
    ],
    activities: [
      'Park oyunları',
      'Playdate\'ler',
      'Müzik/dans dersleri',
      'Gym/spor',
      'Boyama',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Outdoor keşif',
      'Toddler sınıfları'
    ],
    toys: [
      'Trike',
      'Ride-on toys',
      'Bloklar (LEGO Duplo)',
      'Puzzle',
      'Pretend play setleri',
      'Oyuncak mutfak',
      'Bebekler',
      'Araçlar',
      'Art supplies',
      'Müzik aletleri'
    ],
    tips: [
      '**18 ay muayenesi ÖNEMLİ**',
      'Kelime öğretimine devam',
      'Tantrum yönetimi',
      'Bağımsızlık destekleyin',
      'Sosyal aktiviteler',
      'Bol bol okuyun',
      'Rutin sürdürün',
      'Tuvalet eğitimi hazırlığı'
    ],
    warnings: [
      'Tantrum\'lar şiddetli',
      'Tırmanma kazaları',
      'Düşme riski',
      'Boğulma',
      '18 ay aşıları',
      'Uyku regresyonu',
      'Picky eating'
    ],
    nextMonthPreview: '19. ayda toddler daha bağımsız, kelime haziesi 70+ kelime!'
  },
  {
    month: 19,
    title: '19 Aylık Toddler',
    subtitle: 'Bağımsızlık Artıyor 🚀',
    summary: 'Toddler daha bağımsız, kelime haziesi hızla artıyor, sosyal becerileri gelişiyor.',
    physical: [
      'Koşma ustalaşıyor',
      'Zıplama denemeleri',
      'Tek ayak üstünde duruyor',
      'Merdivenlerde bağımsız',
      'Topla oyun gelişiyor',
      'Tırmanma becerileri ileri',
      'Çatal-kaşık kullanımı iyi',
      'Giyinme-soyunmaya aktif katılım'
    ],
    cognitive: [
      'Renkleri tanıyor (4-5 renk)',
      'Şekilleri eşleştiriyor',
      'Sayma 1-5',
      'Problem çözme ileri seviye',
      'Puzzle (15+ parça)',
      'Kategorilendirme yapıyor',
      'Hafıza çok güçlü',
      'Sebep-sonuç ustalaşıyor',
      'Basit planlar yapıyor'
    ],
    social: [
      'Bağımsızlık arzusu çok güçlü',
      'Tantrum\'lar devam (ama yönetilebilir)',
      'Paylaşma gelişiyor',
      'Empati güçleniyor',
      'Arkadaşlıklar önemli',
      'Sosyal oyunlar artıyor',
      'Sıra bekleme öğreniyor'
    ],
    language: [
      '**70-100 kelime**',
      'Dört-beş kelimeli cümleler',
      'Sorular soruyor ("Ne?", "Nerede?", "Kim?")',
      'Basit konuşmalar yapıyor',
      'Şarkı söylüyor',
      'Hikayeleri anlatıyor',
      'Zamir kullanımı ("ben", "benim")',
      'İki dilli gelişim hızlanıyor'
    ],
    play: [
      'İmaginative play gelişiyor',
      'Role play zengin',
      'Pretend play ustalaşıyor',
      'Sosyal oyunlar',
      'Blok yapılar karmaşıklaşıyor',
      'Puzzle',
      'Boyama-çizim gelişiyor',
      'Müzik ve dans',
      'Outdoor oyunlar'
    ],
    nutrition: [
      'İnek sütü 1-2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Bağımsız yeme',
      'Çeşitli yiyecekler',
      'Sağlıklı atıştırmalıklar',
      'Su içme düzenli',
      'Aile sofrası'
    ],
    activities: [
      'Park oyunları',
      'Playdate\'ler',
      'Müzik/dans dersleri',
      'Spor aktiviteleri',
      'Boyama-el işleri',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Outdoor keşif',
      'Toddler sınıfları'
    ],
    toys: [
      'Trike (üç tekerlekli)',
      'Ride-on toys',
      'LEGO Duplo',
      'Puzzle (15-20 parça)',
      'Pretend play setleri',
      'Oyuncak mutfak',
      'Bebekler',
      'Araçlar',
      'Art supplies',
      'Müzik aletleri',
      'Top'
    ],
    tips: [
      'Bağımsızlık destekleyin',
      'Tantrum yönetimi',
      'Kelime öğretimine devam',
      'Sosyal aktiviteler',
      'Bol bol okuyun',
      'Rutin sürdürün',
      'Pozitif disiplin',
      '19. ay kontrolü'
    ],
    warnings: [
      'Tantrum\'lar devam',
      'Tırmanma kazaları',
      'Düşme riski',
      'Boğulma riski',
      'Uyku sorunları',
      'Picky eating',
      'Bağımsızlık-güvenlik dengesi'
    ],
    nextMonthPreview: '20. ayda toddler daha sosyal, kelime haziesi 100+ kelime yaklaşıyor!'
  },
  {
    month: 20,
    title: '20 Aylık Toddler',
    subtitle: 'Sosyal Beceriler Gelişiyor 👫',
    summary: 'Toddler daha sosyal, kelime haziesi 100+ kelime, pretend play zengin, arkadaşlıklar önemli.',
    physical: [
      'Koşma ve zıplama',
      'Topla oyun ustalaşıyor',
      'Merdivenlerde bağımsız',
      'Tırmanma',
      'Çatal-kaşık kullanımı iyi',
      'Giyinme-soyunma yardım',
      'Dans becerileri',
      'İnce motor becerileri ileri',
      'Tuvalet eğitimi hazırlığı (bazıları)'
    ],
    cognitive: [
      'Renkleri tanıyor (5-6 renk)',
      'Şekilleri biliyor',
      'Sayma 1-5 (bazıları 1-10)',
      'Problem çözme ileri',
      'Puzzle (20+ parça)',
      'Kategorilendirme',
      'Hafıza güçlü',
      'Sebep-sonuç ustalaşıyor',
      'Basit oyun kurallarını anlıyor'
    ],
    social: [
      'Sosyal oyunlar artıyor',
      'Paylaşma gelişiyor',
      'Empati güçlü',
      'Tantrum\'lar azalmaya başlıyor',
      'Arkadaşlıklar önemli',
      'Sıra bekleme',
      'Sosyal kuralları öğreniyor',
      'Grup aktivitelerine katılıyor'
    ],
    language: [
      '**100-150 kelime**',
      'Beş-altı kelimeli cümleler',
      'Sorular soruyor ("Ne?", "Nerede?", "Kim?", "Ne zaman?")',
      'Konuşmalar yapıyor',
      'Hikayeleri anlatıyor',
      'Şarkı söylüyor',
      'Zamir kullanımı iyi',
      'İki dilli tam gelişiyor'
    ],
    play: [
      'İmaginative play zengin',
      'Role play ustalaşıyor',
      'Sosyal oyunlar',
      'Pretend play karmaşık',
      'Blok yapılar ileri',
      'Puzzle',
      'Boyama-çizim-el işleri',
      'Müzik ve dans',
      'Outdoor oyunlar',
      'İlk grup oyunları'
    ],
    nutrition: [
      'İnek sütü 1-2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Bağımsız yeme',
      'Çeşitli yiyecekler',
      'Sağlıklı atıştırmalıklar',
      'Su içme',
      'Aile sofrası',
      'Kendi tercihleri var'
    ],
    activities: [
      'Park oyunları',
      'Playdate\'ler',
      'Müzik/dans dersleri',
      'Spor aktiviteleri',
      'Sanat etkinlikleri',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Outdoor keşif',
      'Toddler sınıfları'
    ],
    toys: [
      'Trike',
      'Ride-on toys',
      'LEGO Duplo',
      'Puzzle (20+ parça)',
      'Pretend play setleri',
      'Oyuncak mutfak',
      'Bebekler',
      'Araçlar',
      'Art supplies',
      'Müzik aletleri',
      'Top',
      'Board games (basit)'
    ],
    tips: [
      'Sosyal aktiviteler',
      'Paylaşmayı öğretin',
      'Kelime öğretimine devam',
      'Bol bol okuyun',
      'Outdoor oyunlar',
      'Rutin sürdürün',
      'Pozitif disiplin',
      '20. ay kontrolü',
      'Tuvalet eğitimi hazırlığı'
    ],
    warnings: [
      'Tantrum\'lar azalıyor ama devam',
      'Tırmanma kazaları',
      'Düşme riski',
      'Boğulma riski',
      'Uyku sorunları',
      'Picky eating',
      'Bağımsızlık-güvenlik dengesi'
    ],
    nextMonthPreview: '21. ayda toddler daha bağımsız, kelime haziesi 150+ kelime!'
  },
  {
    month: 21,
    title: '21 Aylık Toddler',
    subtitle: 'Bağımsızlık ve İletişim 🗣️',
    summary: 'Toddler daha bağımsız, iletişim becerileri gelişiyor, pretend play zengin.',
    physical: [
      'Koşma ve zıplama ustalaşıyor',
      'Topla oyun iyi',
      'Merdivenlerde bağımsız',
      'Tırmanma becerileri',
      'Çatal-kaşık kullanımı',
      'Giyinme-soyunma aktif katılım',
      'Dans ve müzik',
      'İnce motor becerileri ileri',
      'Tuvalet eğitimi hazırlığı'
    ],
    cognitive: [
      'Renkleri tanıyor (6-8 renk)',
      'Şekilleri biliyor',
      'Sayma 1-10',
      'Problem çözme ileri',
      'Puzzle (20-25 parça)',
      'Kategorilendirme',
      'Hafıza güçlü',
      'Sebep-sonuç ustalaşıyor',
      'Oyun kurallarını anlıyor'
    ],
    social: [
      'Bağımsızlık güçlü',
      'Tantrum\'lar azalıyor',
      'Paylaşma gelişiyor',
      'Empati güçlü',
      'Arkadaşlıklar önemli',
      'Sosyal oyunlar zengin',
      'Sıra bekleme',
      'Sosyal kuralları öğreniyor',
      'Grup aktivitelerine katılıyor'
    ],
    language: [
      '**150-200 kelime**',
      'Karmaşık cümleler',
      'Sorular soruyor ("Neden?")',
      'Konuşmalar yapıyor',
      'Hikayeler anlatıyor',
      'Şarkı söylüyor',
      'Zamir kullanımı iyi',
      'İki dilli tam gelişiyor',
      'Geçmiş-gelecek zaman anlıyor'
    ],
    play: [
      'İmaginative play zengin',
      'Role play ustalaşıyor',
      'Sosyal oyunlar',
      'Pretend play karmaşık',
      'Blok yapılar ileri',
      'Puzzle',
      'Boyama-çizim-el işleri',
      'Müzik ve dans',
      'Outdoor oyunlar',
      'Grup oyunları'
    ],
    nutrition: [
      'İnek sütü 1-2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Bağımsız yeme',
      'Çeşitli yiyecekler',
      'Sağlıklı atıştırmalıklar',
      'Su içme',
      'Aile sofrası',
      'Kendi tercihlerini söylüyor'
    ],
    activities: [
      'Park oyunları',
      'Playdate\'ler',
      'Müzik/dans dersleri',
      'Spor aktiviteleri',
      'Sanat etkinlikleri',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Outdoor keşif',
      'Toddler sınıfları',
      'Preschool hazırlığı'
    ],
    toys: [
      'Trike',
      'Ride-on toys',
      'LEGO Duplo',
      'Puzzle (20-25 parça)',
      'Pretend play setleri karmaşık',
      'Oyuncak mutfak',
      'Bebekler',
      'Araçlar',
      'Art supplies',
      'Müzik aletleri',
      'Top',
      'Board games'
    ],
    tips: [
      'İletişimi destekleyin',
      'Sosyal aktiviteler',
      'Kelime öğretimine devam',
      'Bol bol okuyun',
      'Outdoor oyunlar',
      'Rutin sürdürün',
      'Pozitif disiplin',
      '21. ay kontrolü',
      'Tuvalet eğitimi hazırlığı',
      'Preschool araştırması'
    ],
    warnings: [
      'Tantrum\'lar azaldı',
      'Tırmanma kazaları',
      'Düşme riski',
      'Boğulma riski',
      'Uyku sorunları',
      'Picky eating azalıyor',
      'Bağımsızlık-güvenlik dengesi'
    ],
    nextMonthPreview: '22. ayda toddler 2 yaşa yaklaşıyor, kelime haziesi 200+ kelime yakında!'
  },
  {
    month: 22,
    title: '22 Aylık Toddler',
    subtitle: '2 Yaşa Yaklaşıyoruz! 🎂',
    summary: '2 yaş yaklaşıyor! Toddler daha büyük çocuk, iletişim güçlü, sosyal becerileri ileri.',
    physical: [
      'Koşma ve zıplama ustalaşıyor',
      'Topla oyun iyi',
      'Merdivenlerde bağımsız',
      'Tırmanma',
      'Çatal-kaşık kullanımı',
      'Giyinme-soyunma yardım',
      'Dans ve müzik',
      'İnce motor becerileri ileri',
      'Tuvalet eğitimi başlayabilir'
    ],
    cognitive: [
      'Renkleri tanıyor (8+ renk)',
      'Şekilleri biliyor',
      'Sayma 1-10',
      'Problem çözme ileri',
      'Puzzle (25+ parça)',
      'Kategorilendirme',
      'Hafıza güçlü',
      'Sebep-sonuç ustalaşıyor',
      'Oyun kurallarını anlıyor',
      'Basit planlar yapıyor'
    ],
    social: [
      'Bağımsızlık güçlü',
      'Tantrum\'lar azaldı',
      'Paylaşma gelişiyor',
      'Empati güçlü',
      'Arkadaşlıklar önemli',
      'Sosyal oyunlar zengin',
      'Sıra bekleme iyi',
      'Sosyal kuralları biliyor',
      'Grup aktivitelerine katılıyor'
    ],
    language: [
      '**180-200 kelime**',
      'Karmaşık cümleler',
      'Sorular soruyor ("Neden?", "Nasıl?")',
      'Konuşmalar yapıyor',
      'Hikayeler anlatıyor',
      'Şarkı söylüyor',
      'Zamir kullanımı iyi ("ben", "sen", "o")',
      'İki dilli tam gelişiyor',
      'Geçmiş-gelecek zaman anlıyor'
    ],
    play: [
      'İmaginative play zengin',
      'Role play ustalaşıyor',
      'Sosyal oyunlar',
      'Pretend play karmaşık',
      'Blok yapılar ileri',
      'Puzzle',
      'Boyama-çizim-el işleri',
      'Müzik ve dans',
      'Outdoor oyunlar',
      'Grup oyunları',
      'İlk kurallar olan oyunlar'
    ],
    nutrition: [
      'İnek sütü 1-2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Bağımsız yeme',
      'Çeşitli yiyecekler',
      'Sağlıklı atıştırmalıklar',
      'Su içme',
      'Aile sofrası',
      'Kendi tercihlerini söylüyor'
    ],
    activities: [
      'Park oyunları',
      'Playdate\'ler',
      'Müzik/dans dersleri',
      'Spor aktiviteleri',
      'Sanat etkinlikleri',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Outdoor keşif',
      'Toddler sınıfları',
      'Preschool hazırlığı'
    ],
    toys: [
      'Trike',
      'Ride-on toys',
      'LEGO Duplo',
      'Puzzle (25+ parça)',
      'Pretend play setleri karmaşık',
      'Oyuncak mutfak',
      'Bebekler',
      'Araçlar',
      'Art supplies',
      'Müzik aletleri',
      'Top',
      'Board games',
      'İlk bisiklet (training wheels)'
    ],
    tips: [
      '2 yaşa hazırlık',
      'İletişimi destekleyin',
      'Sosyal aktiviteler',
      'Bol bol okuyun',
      'Outdoor oyunlar',
      'Rutin sürdürün',
      'Pozitif disiplin',
      '22. ay kontrolü',
      'Tuvalet eğitimi',
      'Preschool araştırması'
    ],
    warnings: [
      'Tantrum\'lar azaldı (ama olabilir)',
      'Tırmanma kazaları',
      'Düşme riski',
      'Boğulma riski',
      'Uyku sorunları',
      'Picky eating azalıyor',
      'Bağımsızlık-güvenlik dengesi',
      '2 yaşa hazırlık'
    ],
    nextMonthPreview: '23. ayda 2 yaş çok yakın! Son ay, büyük çocuk oluyor!'
  },
  {
    month: 23,
    title: '23 Aylık Toddler',
    subtitle: '2 Yaşın Eşiğinde! 🎉',
    summary: '2 yaşa son ay! Toddler artık büyük çocuk, iletişim çok güçlü, sosyal becerileri ileri.',
    physical: [
      'Koşma ve zıplama ustalaşıyor',
      'Topla oyun ustalaşıyor',
      'Merdivenlerde bağımsız',
      'Tırmanma becerileri',
      'Çatal-kaşık kullanımı',
      'Giyinme-soyunma yardım',
      'Dans ve müzik',
      'İnce motor becerileri ileri',
      'Tuvalet eğitimi devam (bazıları)'
    ],
    cognitive: [
      'Renkleri tanıyor (tüm temel renkler)',
      'Şekilleri biliyor',
      'Sayma 1-10 (bazıları 1-15)',
      'Problem çözme ileri',
      'Puzzle (25-30 parça)',
      'Kategorilendirme',
      'Hafıza çok güçlü',
      'Sebep-sonuç ustalaşıyor',
      'Oyun kurallarını anlıyor',
      'Basit planlar yapıyor'
    ],
    social: [
      'Bağımsızlık çok güçlü',
      'Tantrum\'lar azaldı (ama 2 yaşta artabilir)',
      'Paylaşma gelişiyor',
      'Empati güçlü',
      'Arkadaşlıklar çok önemli',
      'Sosyal oyunlar zengin',
      'Sıra bekleme iyi',
      'Sosyal kuralları biliyor',
      'Grup aktivitelerine katılıyor'
    ],
    language: [
      '**200+ kelime (2 yaşa yakın)**',
      'Karmaşık cümleler',
      'Sorular soruyor ("Neden?", "Nasıl?", "Ne zaman?")',
      'Konuşmalar yapıyor',
      'Hikayeler anlatıyor',
      'Şarkı söylüyor',
      'Zamir kullanımı iyi',
      'İki dilli tam gelişiyor',
      'Geçmiş-gelecek zaman anlıyor',
      'İlk "ben" dönemi başlıyor'
    ],
    play: [
      'İmaginative play zengin',
      'Role play ustalaşıyor',
      'Sosyal oyunlar',
      'Pretend play karmaşık',
      'Blok yapılar ileri',
      'Puzzle',
      'Boyama-çizim-el işleri',
      'Müzik ve dans',
      'Outdoor oyunlar',
      'Grup oyunları',
      'Kurallar olan oyunlar'
    ],
    nutrition: [
      'İnek sütü 1-2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Bağımsız yeme',
      'Çeşitli yiyecekler',
      'Sağlıklı atıştırmalıklar',
      'Su içme',
      'Aile sofrası',
      'Kendi tercihlerini söylüyor'
    ],
    activities: [
      'Park oyunları',
      'Playdate\'ler',
      'Müzik/dans dersleri',
      'Spor aktiviteleri',
      'Sanat etkinlikleri',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Outdoor keşif',
      'Preschool hazırlığı',
      '2 yaş partisi hazırlığı'
    ],
    toys: [
      'Bisiklet (training wheels)',
      'Ride-on toys',
      'LEGO Duplo',
      'Puzzle (25-30 parça)',
      'Pretend play setleri karmaşık',
      'Oyuncak mutfak',
      'Bebekler',
      'Araçlar',
      'Art supplies',
      'Müzik aletleri',
      'Top',
      'Board games'
    ],
    tips: [
      '**2 yaşa son ay!**',
      '2 yaş partisi planlayın',
      'İletişimi destekleyin',
      'Sosyal aktiviteler',
      'Bol bol okuyun',
      'Outdoor oyunlar',
      'Rutin sürdürün',
      'Pozitif disiplin',
      '23. ay kontrolü',
      'Tuvalet eğitimi',
      'Preschool hazırlığı'
    ],
    warnings: [
      '2 yaşa hazırlık (terrible twos yaklaşıyor)',
      'Tantrum\'lar artabilir',
      'Tırmanma kazaları',
      'Düşme riski',
      'Boğulma riski',
      'Uyku sorunları',
      'Picky eating',
      'Bağımsızlık-güvenlik dengesi'
    ],
    nextMonthPreview: '24. ayda 2 yaş kutlaması! Büyük çocuk oldun! 🎂'
  },
  {
    month: 24,
    title: '2 Yaşına Geldi! 🎂🎉',
    subtitle: 'Büyük Çocuk Oldun! 👦👧',
    summary: '**2 yaş dönüm noktası!** Toddler artık büyük çocuk! Konuşuyor, koşuyor, hayal kuruyor!',
    physical: [
      'Koşma ustalaşıyor',
      'Zıplama',
      'Topla oynama iyi',
      'Merdivenlerde bağımsız',
      'Tırmanma',
      'Çatal-kaşık kullanımı',
      'Giyinme-soyunma yardım',
      'Dans ve müzik',
      '**Tuvalet eğitimi başlayabilir**'
    ],
    cognitive: [
      'Renkleri tanıyor',
      'Şekilleri biliyor',
      'Sayma 1-10',
      'Problem çözme ileri',
      'Puzzle (20+ parça)',
      'Kategorilendirme',
      'Hafıza güçlü',
      'Basit oyunların kurallarını anlıyor',
      'Sebep-sonuç ustalaşıyor'
    ],
    social: [
      'Bağımsızlık güçlü',
      'Tantrum\'lar devam (terrible twos)',
      'Paylaşma gelişiyor',
      'Empati güçlü',
      'Arkadaşlıklar önemli',
      'Sosyal oyunlar zengin',
      'Sıra bekleme',
      'Sosyal kuralları öğreniyor'
    ],
    language: [
      '**200+ kelime**',
      'Karmaşık cümleler',
      'Sorular soruyor ("Neden?")',
      'Konuşmalar yapıyor',
      'Hikayeler anlatıyor',
      'Şarkı söylüyor',
      'İki dilli tam gelişiyor',
      'Zamir kullanımı iyi ("ben", "sen")'
    ],
    play: [
      'İmaginative play zengin',
      'Role play ustalaşıyor',
      'Sosyal oyunlar',
      'Pretend play karmaşık',
      'Blok yapılar ileri',
      'Puzzle',
      'Boyama-çizim-el işleri',
      'Müzik ve dans',
      'Outdoor oyunlar',
      'İlk grup oyunları'
    ],
    nutrition: [
      'İnek sütü 1-2 bardak',
      'Aile yemekleri',
      'Dengeli beslenme',
      'Bağımsız yeme',
      'Çeşitli yiyecekler',
      'Sağlıklı atıştırmalıklar',
      'Su içme',
      'Aile sofrası',
      'Kendi tercihlerini söylüyor'
    ],
    activities: [
      'Park oyunları',
      'Playdate\'ler',
      'Müzik/dans dersleri',
      'Spor aktiviteleri',
      'Sanat etkinlikleri',
      'Puzzle',
      'Pretend play',
      'Kitap okuma',
      'Outdoor keşif',
      'Preschool hazırlığı'
    ],
    toys: [
      'Bisiklet (training wheels)',
      'Ride-on toys',
      'LEGO Duplo',
      'Puzzle',
      'Pretend play setleri karmaşık',
      'Oyuncak mutfak',
      'Bebekler',
      'Araçlar',
      'Art supplies',
      'Müzik aletleri',
      'Board games (basit)'
    ],
    tips: [
      '**2 yaş kutlaması!**',
      '2 yaş fotoğrafları',
      'Gelişim değerlendirmesi',
      'Tantrum yönetimi',
      'Pozitif disiplin',
      'Tuvalet eğitimi başlatabilirsiniz',
      'Preschool araştırması',
      'Sosyal aktiviteler',
      'Bol bol okuyun',
      '2 yaş muayenesi'
    ],
    warnings: [
      'Terrible twos (tantrum\'lar)',
      'Bağımsızlık-güvenlik dengesi',
      'Düşme-çarpma',
      'Boğulma riski',
      '2 yaş aşıları',
      'Uyku direnci',
      'Picky eating devam edebilir',
      'Kardeş kıskançlığı (varsa)'
    ],
    nextMonthPreview: '2 yaşından sonra preschool dönemi yaklaşıyor! Yeni maceralar başlıyor!'
  }
];

// Quick reference for Wonder Weeks timing
export const getWonderWeeksInfo = (weekAge: number): typeof wonderWeeksLeaps[0] | null => {
  const tolerance = 1; // 1 week tolerance
  return wonderWeeksLeaps.find(leap => 
    Math.abs(leap.week - weekAge) <= tolerance
  ) || null;
};

// Calculate baby's age in weeks from birthdate
export const calculateAgeInWeeks = (birthDate: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
};

// Calculate baby's age in months from birthdate
export const calculateAgeInMonths = (birthDate: Date): number => {
  const now = new Date();
  const months = (now.getFullYear() - birthDate.getFullYear()) * 12 +
                 (now.getMonth() - birthDate.getMonth());
  return Math.max(0, months);
};

// Get current development info based on age
export const getCurrentDevelopmentInfo = (birthDate: Date) => {
  const weeks = calculateAgeInWeeks(birthDate);
  const months = calculateAgeInMonths(birthDate);
  const leapInfo = getWonderWeeksInfo(weeks);
  
  return {
    weeks,
    months,
    isLeapWeek: leapInfo !== null,
    leapInfo,
    monthlyInfo: monthlyDevelopments.find(m => m.month === months)
  };
};
