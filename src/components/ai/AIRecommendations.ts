import React from 'react';

export interface BabyProfile {
  birthDate: string;
  weight: number;
  height: number;
  gender: 'male' | 'female';
}

export interface Recommendation {
  id: string;
  category: 'feeding' | 'sleep' | 'health' | 'development' | 'safety';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  ageRange: string;
  actionItems: string[];
}

export class AIRecommendationService {
  static getBabyAgeInMonths(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    const monthsDiff = (today.getFullYear() - birth.getFullYear()) * 12 + 
                      (today.getMonth() - birth.getMonth());
    return Math.max(0, monthsDiff);
  }

  static getAgeCategory(months: number): string {
    if (months <= 1) return 'Yenidoğan (0-1 ay)';
    if (months <= 3) return 'Bebek (1-3 ay)';
    if (months <= 6) return 'Bebek (3-6 ay)';
    if (months <= 9) return 'Bebek (6-9 ay)';
    if (months <= 12) return 'Bebek (9-12 ay)';
    if (months <= 18) return 'Toddler (12-18 ay)';
    if (months <= 24) return 'Toddler (18-24 ay)';
    return 'Çocuk (24+ ay)';
  }

  static generateRecommendations(
    profile: BabyProfile,
    recentData: {
      feeding?: any[];
      sleep?: any[];
      health?: any[];
    }
  ): Recommendation[] {
    const months = this.getBabyAgeInMonths(profile.birthDate);
    const recommendations: Recommendation[] = [];

    // Beslenme önerileri
    recommendations.push(...this.getFeedingRecommendations(months, profile, recentData.feeding));
    
    // Uyku önerileri
    recommendations.push(...this.getSleepRecommendations(months, recentData.sleep));
    
    // Sağlık önerileri
    recommendations.push(...this.getHealthRecommendations(months, profile, recentData.health));
    
    // Gelişim önerileri
    recommendations.push(...this.getDevelopmentRecommendations(months));
    
    // Güvenlik önerileri
    recommendations.push(...this.getSafetyRecommendations(months));

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private static getFeedingRecommendations(
    months: number, 
    profile: BabyProfile, 
    feedingData?: any[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Anne sütü önerileri
    if (months <= 6) {
      recommendations.push({
        id: 'feeding_breastmilk',
        category: 'feeding',
        title: 'Anne Sütü Önceliği',
        description: '6 aya kadar bebeğiniz sadece anne sütü veya mama ile beslenmelidir.',
        priority: 'high',
        ageRange: '0-6 ay',
        actionItems: [
          'Günde 8-12 kez emzirin',
          'Açlık ve tokluk belirtilerini öğrenin',
          'Emzirme pozisyonlarını deneyin'
        ]
      });
    }

    // Ek gıda önerileri
    if (months >= 4 && months <= 6) {
      recommendations.push({
        id: 'feeding_solid_intro',
        category: 'feeding',
        title: 'Ek Gıda Başlangıcı',
        description: 'Bebeğiniz ek gıdaya hazır olabilir. Doktorunuza danışın.',
        priority: 'medium',
        ageRange: '4-6 ay',
        actionItems: [
          'Tek tek yeni yiyecekler deneyin',
          '3 gün bekleneri alerji kontrolü',
          'Püren kıvamında başlayın'
        ]
      });
    }

    if (months >= 6) {
      recommendations.push({
        id: 'feeding_water',
        category: 'feeding',
        title: 'Su Tüketimi',
        description: '6 aydan sonra bebeğiniz su içebilir.',
        priority: 'medium',
        ageRange: '6+ ay',
        actionItems: [
          'Özellikle sıcak havalarda su sunun',
          'Bardak kullanmayı öğretin',
          'Öğün aralarında su verin'
        ]
      });
    }

    // Yaşa göre miktar önerileri
    if (months <= 1) {
      recommendations.push({
        id: 'feeding_amount_newborn',
        category: 'feeding',
        title: 'Yenidoğan Miktarı',
        description: 'Yenidoğan günde 30-90 ml süt tüketir.',
        priority: 'high',
        ageRange: '0-1 ay',
        actionItems: [
          'Frekans önemlidir, miktar değil',
          'Her 2-3 saatte besleyin',
          'İştahı takip edin'
        ]
      });
    }

    if (months > 1 && months <= 6) {
      const dailyMilk = 600 + (months * 50);
      recommendations.push({
        id: 'feeding_amount_infant',
        category: 'feeding',
        title: 'Süt Miktarı',
        description: `Günde yaklaşık ${dailyMilk}-${dailyMilk + 100} ml süt tüketmelidir.`,
        priority: 'medium',
        ageRange: '1-6 ay',
        actionItems: [
          'Beslenmeleri takip edin',
          'Kilo alımını gözlemleyin',
          'Düzenli aralıklarla besleyin'
        ]
      });
    }

    return recommendations;
  }

  private static getSleepRecommendations(
    months: number, 
    sleepData?: any[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (months <= 3) {
      recommendations.push({
        id: 'sleep_newborn',
        category: 'sleep',
        title: 'Yenidoğan Uykusu',
        description: 'Yenidoğanlar günde 14-17 saat uyur.',
        priority: 'high',
        ageRange: '0-3 ay',
        actionItems: [
          'Gündüz ve gece uykusunu ayırt etmeyin',
          'Uyku sırasında sessiz ortam sağlayın',
          'Güvenli uyku pozisyonu (sırt üstü)'
        ]
      });
    }

    if (months > 3 && months <= 6) {
      recommendations.push({
        id: 'sleep_infant',
        category: 'sleep',
        title: 'Bebek Uykusu',
        description: '3-6 aylık bebekler günde 12-16 saat uyur.',
        priority: 'medium',
        ageRange: '3-6 ay',
        actionItems: [
          'Uyku düzeni oluşturmaya başlayın',
          'Uyku ritüelleri geliştirin',
          'Kendi kendine uyumayı teşvik edin'
        ]
      });
    }

    if (months > 6) {
      recommendations.push({
        id: 'sleep_toddler',
        category: 'sleep',
        title: 'Uyku Düzeni',
        description: 'Düzenli uyku saatleri önemlidir.',
        priority: 'medium',
        ageRange: '6+ ay',
        actionItems: [
          'Her gün aynı saatte uyandırın',
          'Öğleden sonra uykusunu kısaltın',
          'Uyku öncesi sakinleştirici aktiviteler'
        ]
      });
    }

    return recommendations;
  }

  private static getHealthRecommendations(
    months: number, 
    profile: BabyProfile, 
    healthData?: any[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Aşı takvimi hatırlatmaları
    const vaccineSchedule: { [key: number]: string } = {
      0: 'Hepatit B (doğum)',
      2: 'BCG, DaBT-IPA-Hib, Prevenar',
      4: 'DaBT-IPA-Hib, Prevenar (2. doz)',
      6: 'DaBT-IPA-Hib, Prevenar (3. doz), Hepatit B',
      12: 'KKK, Su Çiçeği, DaBT-IPA-Hib (pekiştirme)',
    };

    Object.keys(vaccineSchedule).forEach(month => {
      const monthNum = parseInt(month);
      if (Math.abs(months - monthNum) <= 1) {
        recommendations.push({
          id: `vaccine_${month}`,
          category: 'health',
          title: 'Aşı Takvimi Hatırlatması',
          description: `${monthNum}. ay için: ${vaccineSchedule[monthNum]}`,
          priority: 'high',
          ageRange: `${monthNum}. ay`,
          actionItems: [
            'Doktor randevusu alın',
            'Aşı kartını kontrol edin',
            'Aşı sonrası yan etkileri izleyin'
          ]
        });
      }
    });

    // Genel sağlık
    recommendations.push({
      id: 'health_checkup',
      category: 'health',
      title: 'Düzenli Kontroller',
      description: 'Bebek gelişimini düzenli kontrol ettirin.',
      priority: 'medium',
      ageRange: 'Tüm yaşlar',
      actionItems: [
        'Aylık doktor kontrolleri',
        'Kilo ve boy takibi',
        'Gelişim milestones kontrolü'
      ]
    });

    return recommendations;
  }

  private static getDevelopmentRecommendations(months: number): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (months <= 3) {
      recommendations.push({
        id: 'dev_newborn',
        category: 'development',
        title: 'Yenidoğan Gelişimi',
        description: 'Yenidoğan periodunda duyusal gelişim önemlidir.',
        priority: 'high',
        ageRange: '0-3 ay',
        actionItems: [
          'Yüz teması ve göz teması',
          'Sesli oyuncaklar sunun',
          'Karnınıza yüzüstü yatırın (supervizyonla)'
        ]
      });
    }

    if (months > 3 && months <= 6) {
      recommendations.push({
        id: 'dev_infant',
        category: 'development',
        title: 'Bebek Gelişimi',
        description: 'Motor beceriler ve sosyal gelişim hızlanır.',
        priority: 'medium',
        ageRange: '3-6 ay',
        actionItems: [
          'Oturmayı teşvik edin',
          'Nesnelere ulaşması için fırsat verin',
          'Konuşmaya teşvik edin'
        ]
      });
    }

    if (months > 6 && months <= 12) {
      recommendations.push({
        id: 'dev_crawler',
        category: 'development',
        title: 'Emekleme ve Hareket',
        description: 'Hareket becerileri gelişir.',
        priority: 'medium',
        ageRange: '6-12 ay',
        actionItems: [
          'Güvenli emekleme alanı oluşturun',
          'Mobilyaları sabitleyin',
          'Merdivenlere güvenlik kapısı takın'
        ]
      });
    }

    return recommendations;
  }

  private static getSafetyRecommendations(months: number): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Genel güvenlik
    recommendations.push({
      id: 'safety_general',
      category: 'safety',
      title: 'Güvenli Ortam',
      description: 'Bebeğiniz için güvenli bir ortam oluşturun.',
      priority: 'high',
      ageRange: 'Tüm yaşlar',
      actionItems: [
        'Prizleri kapatin',
        'Kesici aletleri uzak tutun',
        'Kimyasalları erişim dışına alın'
      ]
    });

    // Yaşa özel güvenlik
    if (months > 4) {
      recommendations.push({
        id: 'safety_mobility',
        category: 'safety',
        title: 'Hareket Güvenliği',
        description: 'Bebeğiniz hareket etmeye başladığında ek güvenlik önlemleri alın.',
        priority: 'high',
        ageRange: '4+ ay',
        actionItems: [
          'Köşe koruyucular takın',
          'Yer seviyesindeki nesneleri kaldırın',
          'Pencereleri güvenlikli hale getirin'
        ]
      });
    }

    if (months > 6) {
      recommendations.push({
        id: 'safety_eating',
        category: 'safety',
        title: 'Beslenme Güvenliği',
        description: 'Ek gıda döneminde boğma riskine dikkat edin.',
        priority: 'high',
        ageRange: '6+ ay',
        actionItems: [
          'Küçük parçalar vermekten kaçının',
          'Yemek yerinde denetim sağlayın',
          'Boğmaz gıdalar seçin'
        ]
      });
    }

    return recommendations;
  }

  // Memoized helper functions with cached results
  private static readonly PRIORITY_COLORS: Record<string, string> = {
    high: '#FF6B6B',
    medium: '#FFA500',
    low: '#4ECDC4',
    default: '#ccc',
  };

  private static readonly CATEGORY_ICONS: Record<string, string> = {
    feeding: '🍼',
    sleep: '😴',
    health: '🏥',
    development: '🧠',
    safety: '🛡️',
    default: '📋',
  };

  private static readonly CATEGORY_LABELS: Record<string, string> = {
    feeding: 'Beslenme',
    sleep: 'Uyku',
    health: 'Sağlık',
    development: 'Gelişim',
    safety: 'Güvenlik',
    default: 'Genel',
  };

  static getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
    return this.PRIORITY_COLORS[priority] || this.PRIORITY_COLORS.default;
  }

  static getCategoryIcon(category: string): string {
    return this.CATEGORY_ICONS[category] || this.CATEGORY_ICONS.default;
  }

  static getCategoryLabel(category: string): string {
    return this.CATEGORY_LABELS[category] || this.CATEGORY_LABELS.default;
  }
}