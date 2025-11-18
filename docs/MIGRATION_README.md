# DostAnne - Yeni Depo İçin Hazırlanmış Dosyalar

Bu klasör, DostAnne mobil uygulaması projesinin yeni bir GitHub deposuna taşınması için gerekli tüm dosyaları içermektedir.

## 📦 İçerik

### Kaynak Kod
- **app/** - Expo Router tabanlı uygulama ekranları ve navigasyon yapısı
- **components/** - Yeniden kullanılabilir React bileşenleri
- **hooks/** - Özel React Hook'ları
- **src/** - Ana kaynak kod dizini
  - **components/** - Gelişmiş bileşenler (AI önerileri, grafikler vb.)
  - **services/** - Bildirim servisi ve diğer servisler
  - **store/** - Redux store yönetimi
  - **database/** - SQLite veritabanı yönetimi
  - **utils/** - Yardımcı fonksiyonlar
  - **constants/** - Sabitler ve konfigürasyonlar
  - **screens/** - Ekran bileşenleri
  - **navigation/** - Navigasyon yapılandırması
  - **hooks/** - Özel hook'lar
  - **data/** - Statik veri dosyaları
- **constants/** - Tema ve diğer global sabitler

### Statik Dosyalar
- **assets/** - Görseller ve klavuzlar
  - **images/** - Uygulama ikonları ve görseller
  - **guides/** - Kullanıcı rehberleri

### Test Dosyaları
- **__tests__/** - Jest test dosyaları ve test kurulumu

### Konfigürasyon Dosyaları
- **package.json** - NPM bağımlılıkları ve scriptler
- **package-lock.json** - Bağımlılık sürüm kilidi
- **tsconfig.json** - TypeScript konfigürasyonu
- **babel.config.js** - Babel transpiler ayarları
- **eslint.config.js** - ESLint kod kalitesi kuralları
- **app.json** - Expo uygulama konfigürasyonu
- **expo-env.d.ts** - TypeScript tip tanımlamaları
- **.gitignore** - Git tarafından yok sayılacak dosyalar

### Dokümantasyon
- **README.md** - Ana proje dokümantasyonu
- **docs/** - Detaylı dokümantasyon klasörü
  - **USER_GUIDE.md** - Kullanıcı kılavuzu
  - **BIOLOGICAL_DEVELOPMENT_TODO.md** - Biyolojik gelişim takibi özellikleri
  - **MASTER_PLAN.md** - Proje yol haritası ve vizyon
  - **COMPLETION_SUMMARY_2024-11-16.md** - Tamamlanan özellikler özeti
  - **TEST_REPORT.md** - Test raporları
  - **DEMO_PRESENTATION.md** - Demo sunum içeriği
  - **pitch_deck_content.md** - Yatırım sunumu
  - **demo_video_script.md** - Video demo senaryosu

### Yardımcı Scriptler
- **scripts/** - Proje yardımcı scriptleri
  - **reset-project.js** - Proje sıfırlama scripti

## 🚀 Yeni Depoda Kullanım

Bu klasördeki tüm dosyalar yeni depoya aşağıdaki şekilde aktarılabilir:

1. Yeni bir GitHub deposu oluşturun
2. Bu klasördeki tüm içeriği yeni deponun kök dizinine kopyalayın
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. Uygulamayı çalıştırın:
   ```bash
   npm start
   ```

## 📋 Gereksinimler

- Node.js 16+
- npm veya yarn
- Expo CLI
- iOS Simulator veya Android Emulator (test için)

## 🔧 Teknoloji Yığını

- **Framework:** React Native + Expo
- **Dil:** TypeScript
- **State Management:** Redux Toolkit
- **Routing:** Expo Router
- **Veritabanı:** SQLite
- **Test:** Jest + React Testing Library
- **UI Components:** React Native Elements, Custom Components
- **Bildirimler:** Expo Notifications

## 📱 Özellikler

DostAnne, anneler ve bebekleri için kapsamlı bir sağlık ve gelişim takip uygulamasıdır:

- 📊 Bebek gelişim takibi
- 🍼 Beslenme ve emzirme kaydı
- 💤 Uyku takibi
- 📅 Aşı ve randevu takvimi
- 👩‍⚕️ Sağlık kayıtları
- 🌙 Menstrüel döngü takibi
- 🤖 AI destekli öneriler
- 📈 İstatistik ve grafikler
- 🚨 Acil durum bilgileri
- 🌍 Anne toplulukları

## ⚠️ Önemli Notlar

1. `.env` dosyası dahil edilmemiştir - üretim ortamında gerekli environment değişkenlerini ayarlayın
2. `node_modules/` klasörü dahil edilmemiştir - `npm install` ile yüklenmelidir
3. `.expo/` klasörü dahil edilmemiştir - ilk çalıştırmada otomatik oluşturulacaktır
4. Build artifacts dahil edilmemiştir - `build/` ve `dist/` klasörleri .gitignore'da

## 📄 Lisans

Proje lisans bilgileri için yeni depoda LICENSE dosyası oluşturulmalıdır.

## 👥 Katkıda Bulunma

Yeni depoda katkı kuralları ve süreçleri belirlenmelidir.

---

**Not:** Bu klasör, temiz ve düzenli bir şekilde yeni depoya taşınmak üzere hazırlanmıştır. Tüm gereksiz dosyalar (backup raporları, geçici dosyalar vb.) hariç tutulmuştur.
