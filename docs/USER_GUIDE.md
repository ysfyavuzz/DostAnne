# 📚 DostAnne Kullanım Kılavuzu

## 📖 İçindekiler
1. [Kurulum ve Başlangıç](#kurulum-ve-başlangıç)
2. [Profil Oluşturma](#profil-oluşturma)
3. [Özellik Kılavuzu](#özellik-kılavuzu)
4. [Ayarlama ve Özelleştirme](#ayarlama-ve-özelleştirme)
5. [Sıkça Sorulan Sorular](#sıkça-sorulan-sorular)
6. [Sorun Giderme](#sorun-giderme)

---

## 🚀 Kurulum ve Başlangıç

### Sistem Gereksinimleri
- **iOS**: iPhone 6s ve üzeri, iOS 12.0+
- **Android**: Android 7.0+ (API seviyesi 24+)
- **Depolama**: Minimum 500MB boş alan
- **RAM**: Minimum 2GB RAM

### Kurulum Adımları

#### App Store / Google Play'den
1. "DostAnne" yazarak aratın
2. "Yükle" butonuna tıklayın
3. Kurulum tamamlandıktan sonra açın

#### Expo ile Geliştirme
```bash
# Geliştirme ortamını kurun
npm install -g expo-cli

# Projeyi klonlayın
git clone https://github.com/dostanne/dostanne.git
cd dostanne

# Bağımlılıkları kurun
npm install

# Başlatın
npm start
```

---

## 👤 Profil Oluşturma

### İlk Kullanım
1. **Açılış Ekranı**: Uygulamayı açtığınızda karşılama ekranı görüntülenir
2. **Dil Seçimi**: Türkçe veya İngilizce dilini seçin
3. **Onboarding**: 4 adımlık tanıtımı tamamlayın

### Bebek Profili Oluşturma

#### Temel Bilgiler
```
İsim: Bebeğinizin adı
Doğum Tarihi: GG.AA.YYYY formatında
Cinsiyet: Erkek / Kadın
Kilo: Doğum kilosu (gram)
Boy: Doğum boyu (cm)
```

#### Fotoğraf Ekleme
- Galeri'den fotoğraf seçin
- Kamera ile yeni fotoğraf çekin
- Fotoğraf kırpma ve düzenleme

### Aile Profili
- Ebeveyn bilgileri
- Acil durum kontakları
- Tercihler ve ayarlar

---

## 📱 Özellik Kılavuzu

### 🏠 Ana Dashboard

#### Widget'lar
**Hızlı İstatistikler Widget'ı**
- Bugünkü beslenme sayısı
- Toplam uyku süresi
- Sağlık skoru

**Büyüme Grafiği Widget'ı**
- Son 7 günlük kilo artışı
- Trend göstergesi
- WHO standartları karşılaştırması

**Sıradaki Eylemler Widget'ı**
- Bir sonraki beslenme zamanı
- Yaklaşan randevular
- Hatırlatıcılar

#### Widget Yönetimi
- **Boyutlandırma**: Küçük, orta, büyük
- **Yeniden düzenleme**: Sürükle bırak
- **Ekleme/Kaldırma**: + butonu

### 🍼 Beslenme Takibi

#### Hızlı Ekleme
```
🤱 Anne Sütü: Otomatik 15 dakika ayar
🍼 Mama: 120ml varsayılan
🥄 Ek Gıda: 50ml varsayılan
```

#### Detaylı Kayıt
**Zamanlama**
- Manuel zaman seçimi
- Şimdi seçeneği
- Son 24 saat içinde

**Notlar Ekleme**
- Bebeğin durumu
- Tepkiler
- Özel gözlemler

#### Analiz Ekranı
**Periyot Seçimi**
- Son 7 gün
- Son 30 gün  
- Son 90 gün

**Grafik Türleri**
- Çizgi grafik: Zaman içindeki değişim
- Bar grafik: Türlere göre dağılım
- Pasta grafik: Yüzdelik oranlar

### 🏥 Sağlık Takibi

#### Kayıt Türleri
**Vücut Isısı**
- Derece cinsinden
- Ateşli/normal takibi
- Trend analizi

**Kilo ve Boy**
- Hassas ölçüm
- Persentil hesaplama
- WHO standartları

#### Aşı Takvimi
**Aşı Durumları**
- ✅ Tamamlandı
- ⏳ Bekliyor
- ⚠️ Gecikmiş
- 📅 Yaklaşan

**Aşı Bilgileri**
- Aşı adı
- Önerilen yaş
- Yan etkiler
- Hatırlatıcılar

### 😴 Uyku Takibi

#### Uyku Kaydı
**Başlat/Durdur**
- Otomatik zamanlayıcı
- Manuel giriş
- Kalite değerlendirmesi

**Uyku Kalitesi**
- Mükemmel: Huzurlu uyku
- İyi: Ara sıra uyanma
- Orta: Sık uyanma
- Zayıf: Huzursuz uyku

#### Uyku Analizi
**Pattern'ler**
- En iyi uyku saatleri
- Ortalama uyku süresi
- Uyku düzeni

**Öneriler**
- Yatma zamanı optimizasyonu
- Uyku ortamı iyileştirmeleri
- Rutin önerileri

### 📊 İstatistikler

#### Karşılaştırmalı Analiz
- Haftalar arası karşılaştırma
- Aylık trendler
- Yıllık özet

#### İhracat
- PDF rapor formatı
- Excel veri formatı
- Paylaşım seçenekleri

---

## ⚙️ Ayarlama ve Özelleştirme

### 🎨 Tema Ayarları

#### Tema Modları
**Açık Tema**
- Gündüz kullanım için
- Yüksek kontrast
- Parlak renkler

**Koyu Tema**
- Gece kullanım için
- Göz yorgunluğunu azaltır
- Pil tasarrufu

**Otomatik**
- Sistem ayarlarını takip eder
- Gün batımında geçiş yapar
- Akıllı adaptasyon

#### Renk Seçenekleri
```
🔵 Mavi: Sakin ve profesyonel
🟢 Yeşil: Doğal ve taze
🟣 Mor: Kraliyet ve yaratıcılık
🌸 Pembe: Tatlı ve sevgi dolu
🟠 Turuncu: Enerjik ve canlı
```

### 🌍 Dil Ayarları

#### Desteklenen Diller
- **Türkçe**: Tam yerelleştirme
- **İngilizce**: Uluslararası standart

#### Dil Değiştirme
1. Profil → Dil Ayarları
2. Dil seçin
3. Uygulama yeniden başlatılır

### 🔔 Bildirimler

#### Bildirim Türleri
**Beslenme Hatırlatıcıları**
- 3 saatlik aralıklar
- Özelleştirilebilir zaman
- Akıllı ayarlama

**Uyku Hatırlatıcıları**
- Yatma zamanları
- Uyku düzeni
- Güncel öneriler

**Sağlık Hatırlatıcıları**
- Aşı takvimi
- Doktor randevuları
- İlaç hatırlatıcıları

#### Bildirim Ayarları
- Zamanlama
- Ses seviyesi
- Titreşim
- Kategori filtreleme

---

## 🤖 AI Öneri Sistemi

### Nasıl Çalışır?
**Veri Analizi**
- Kayıtlarınızı işler
- Pattern'leri识别 eder
- Kişiselleştirir

**Yaş Bazlı Öneriler**
- 0-3 ay: Yenidoğan dönemi
- 3-6 ay: Bebek dönemi
- 6-12 ay: Gelişim dönemi
- 12+ ay: Toddler dönemi

### Öneri Kategorileri

#### 🍼 Beslenme Önerileri
**Örnekler:**
- "5 aylık bebeğiniz günde 600-800ml süt tüketmelidir"
- "Ek gıda başlangıcı için doktorunuza danışın"
- "Su tüketimini artırmayı düşünün"

#### 😴 Uyku Önerileri
**Örnekler:**
- "Bebeğinizin uyku düzeni stabil görünüyor"
- "Yatma zamanını 30 dakika erkene almayı deneyin"
- "Uyku öncesi rutini güçlendirin"

#### 🏥 Sağlık Önerileri
**Örnekler:**
- "Vücut ısısı normal aralıkta"
- "Kilo artışı iyi seyredeyor"
- "Bir sonraki kontrol için hazır"

#### 🧠 Gelişim Önerileri
**Örnekler:**
- "Emekleme için hazır olabilir"
- "Yeni oyuncaklar deneyin"
- "Sosyal etkileşimi artırın"

---

## ❓ Sıkça Sorulan Sorular

### Genel Sorular

**S: Verilerim güvende mi?**
C: Evet, tüm veriler cihazınızda yerel olarak saklanır ve hiçbir yere gönderilmez.

**S: Uygulama ücretli mi?**
C: Temel özellikler tamamen ücretsizdir. AI öneri sistemi de ücretsizdir.

**S: Çoklu bebek desteği var mı?**
C: Şu anda tek bebek desteği mevcut, çoklu bebek desteği yakında gelecek.

### Teknik Sorular

**S: Uygulama çöküyor, ne yapmalıyım?**
C: Uygulamayı yeniden başlatın. Sorun devam ederse support@dostanne.com'a yazın.

**S: Verilerimi başka bir cihaza nasıl aktarırım?**
C: Dışa aktar özelliğini kullanarak PDF/Excel olarak aktarabilirsiniz.

**S: Bildirimler gelmiyor, neden?**
C: Ayarlar → Bildirimler → İzinleri kontrol edin ve açın.

### Özellik Soruları

**S: AI önerileri nasıl çalışıyor?**
C: Bebeğinizin yaşına ve kayıtlarınıza göre genel gelişim önerileri sunar. Tıbbi teşhis değildir.

**S: Tema nasıl değiştirilir?**
C: Profil → Tema Ayarları → İstediğiniz temayı seçin.

**S: Widget'ları nasıl özelleştiririm?**
C: Ana ekranda widget'a uzun basın ve sürükleyin.

---

## 🔧 Sorun Giderme

### Yaygın Sorunlar

#### Uygulama Açılmıyor
**Çözümler:**
1. Uygulamayı yeniden başlatın
2. Telefonunuzu yeniden başlatın
3. Uygulamayı güncelleyin
4. Depolama alanını kontrol edin

#### Veri Kaybolması
**Çözümler:**
1. İnternet bağlantısını kontrol edin
2. Dışa aktar özelliğini kullanın
3. Yedekleme oluşturun

#### Bildirim Sorunları
**Çözümler:**
1. Ayarlar → Bildirimler → İzinleri açın
2. "Rahatsız Etme" modunu kapatın
3. Telefon bildirim ayarlarını kontrol edin

### İletişim ve Destek

**E-posta:** support@dostanne.com
**Twitter:** [@dostanne](https://twitter.com/dostanne)
**Web Sitesi:** [dostanne.com](https://dostanne.com)

### Geri Bildirim
Önerileriniz ve hata bildirimleriniz bizim için değerlidir:
- Uygulama içi geri bildirim formu
- GitHub Issues
- E-posta yoluyla

---

## 📞 İletişim

**Acil Durumlar:** 112 ( Türkiye için )
**Teknik Destek:** support@dostanne.com
**Genel Sorular:** info@dostanne.com

**Sosyal Medya:**
- [Facebook](https://facebook.com/dostanne)
- [Instagram](https://instagram.com/dostanne)
- [Twitter](https://twitter.com/dostanne)

---

**© 2024 DostAnne - Tüm hakları saklıdır**

*Tüm tıbbi bilgiler genel amaçlıdır. Bebeğinizin sağlığı ile ilgili endişelerinizde mutlaka pediatricianınıza danışın.*