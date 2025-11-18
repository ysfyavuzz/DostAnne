# Q&A Özelliği Kullanım Kılavuzu

## Genel Bakış

DostAnne uygulamasının Soru & Cevap bölümü, annelerin birbirlerine sorular sorup yanıt verebildikleri bir topluluk alanıdır.

## Özellikler

### 1. Soru Listeleme ve Filtreleme

Ana ekranda tüm sorular listelenir. Kullanıcılar soruları şu filtrelere göre görüntüleyebilir:

- **Tümü**: Tüm sorular
- **Yeni**: En yeni sorular önce
- **Popüler**: En çok beğenilen sorular
- **Benim Sorularım**: Kullanıcının kendi soruları

### 2. Arama

Üst kısımdaki arama çubuğu ile sorular arasında arama yapılabilir. Arama, soru başlığı ve açıklamasında eşleşme arar.

### 3. Yeni Soru Ekleme

1. Sağ alt köşedeki yeşil + butonuna tıklayın
2. Açılan formda:
   - Başlık girin (zorunlu)
   - Açıklama ekleyin (isteğe bağlı)
   - Kategori seçin (Emzirme, Uyku, Sağlık, vb.)
3. "Gönder" butonuna basın

### 4. Soru Detayları ve Yanıtlar

Bir soruya tıklandığında:
- Soru detayları görüntülenir
- Mevcut yanıtlar listelenir
- Alt kısımdaki input alanından yeni yanıt eklenebilir

## Kategoriler

Sorular şu kategorilere ayrılmıştır:

- 🥗 **Emzirme & Beslenme**: Emzirme ve bebek beslenmesi ile ilgili sorular
- 🌙 **Uyku**: Bebek uyku düzeni ve sorunları
- 🏥 **Sağlık**: Sağlık ile ilgili genel sorular
- 📈 **Gelişim**: Bebek gelişimi ve kilometre taşları
- 🍽️ **Beslenme**: Ek gıda ve beslenme
- ❤️ **Bakım**: Bebek bakımı ve hijyen
- 👥 **Davranış**: Bebek davranışları ve alışkanlıklar
- ⋯ **Diğer**: Diğer konular

## Teknik Detaylar

### Bileşenler

- **QuestionCard**: Yeniden kullanılabilir soru kartı bileşeni
- **FilterTabs**: Filtre sekmeleri bileşeni
- **AppHeader**: Üst navigasyon başlığı
- **QuestionDetailScreen**: Soru detay ekranı

### Veri Yapısı

```typescript
interface Question {
  id: string;
  title: string;
  description: string;
  author: string;
  category: QuestionCategory;
  createdAt: string;
  views: number;
  answerCount: number;
  likes: number;
  isResolved: boolean;
  answers?: Answer[];
}

interface Answer {
  id: string;
  questionId: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  isAccepted?: boolean;
}
```

## Gelecek Geliştirmeler

- [ ] Backend entegrasyonu
- [ ] Gerçek zamanlı bildirimler
- [ ] Soru ve yanıtları beğenme sistemi
- [ ] Kabul edilen yanıt işaretleme
- [ ] Kullanıcı profil sayfaları
- [ ] Resim yükleme desteği
- [ ] Moderasyon araçları
