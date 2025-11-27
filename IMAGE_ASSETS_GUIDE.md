# 📸 DostAnne - Görsel Dosyaları Rehberi

## Gerekli Görseller

### 1. **icon.png** ⭐ ÖNEMLİ

**Konum:** `assets/images/icon.png`

**Amaç:**

- Ana uygulama ikonu
- App Store ve Google Play'de görünen ikon
- Telefon ana ekranındaki uygulama simgesi

**Gereksinimler:**

- Boyut: **1024x1024 px** (kare)
- Format: PNG (şeffaf arka plan olabilir)
- İçerik: DostAnne logosu - net ve basit olmalı
- Not: Küçük boyutlarda da anlaşılır olmalı

**Şu anki durum:** ✅ Mevcut (anne-bebek logosu)

---

### 2. **adaptive-icon.png** 🤖 ANDROID

**Konum:** `assets/images/adaptive-icon.png`

**Amaç:**

- Android Adaptive Icon (ön plan katmanı)
- Her Android cihazda farklı şekillere göre kesilebilir
- Arka plan rengi: `#E6F4FE` (app.json'da tanımlı)

**Gereksinimler:**

- Boyut: **1024x1024 px**
- Format: PNG (şeffaf arka plan ÖNEMLİ)
- İçerik: Logo merkezi %66'lık "güvenli alan"da olmalı
- Not: Kenarlar kesilebilir, önemli detayları ortada tutun

**Şu anki durum:** ✅ Mevcut

---

### 3. **splash-icon.png** 🚀 SPLASH SCREEN

**Konum:** `assets/images/splash-icon.png`

**Amaç:**

- Uygulama ilk açıldığında gösterilen splash screen'deki logo
- Beyaz arka plan üzerine gösterilir

**Gereksinimler:**

- Boyut: **1242x2436 px** (veya 1024x1024 merkez logo)
- Format: PNG
- İçerik: DostAnne logosu
- Arka plan: Beyaz (`#ffffff`)

**Şu anki durum:** ✅ Mevcut

---

### 4. **logo.png** 📱 ANA SAYFA

**Konum:** `assets/images/logo.png`

**Amaç:**

- Ana sayfa header'ında gösterilen logo
- Selamlama metninin yanında

**Gereksinimler:**

- Boyut: **500x500 px** (veya daha küçük)
- Format: PNG (şeffaf arka plan önerilen)
- İçerik: DostAnne logosu - app içinde 48x48 olarak gösteriliyor

**Şu anki durum:** ✅ Mevcut

---

### 5. **favicon.png** 🌐 WEB

**Konum:** `assets/images/favicon.png`

**Amaç:**

- Web versiyonu için favicon
- Tarayıcı sekmesinde görünen küçük ikon

**Gereksinimler:**

- Boyut: **48x48 px** veya **64x64 px**
- Format: PNG
- İçerik: Basitleştirilmiş logo

**Şu anki durum:** ✅ Mevcut

---

## 🎨 Tasarım Önerileri

### Renk Paleti (Magical Nursery)

```
Primary: #A78BFA (Soft Purple)
Secondary: #FCA5A5 (Soft Pink)
Accent: #34D399 (Soft Green)
Background: #F0F9FF (Very Light Blue)
```

### Logo Özellikleri

- ✨ **Ana Tema:** Anne-bebek bağı, sevgi, doğallık
- 🌿 **Simgeler:** Anne ve bebek figürü, yaprak/meyve motifi
- 🎨 **Renkler:** Yumuşak, pastel tonlar
- 📐 **Stil:** Modern, minimalist, 3D efektli

### Android Adaptive Icon Güvenli Alan

```
┌─────────────────┐
│                 │
│   ┌─────────┐   │ ← Kesilmeyecek alan
│   │         │   │   (merkez %66)
│   │  LOGO   │   │
│   │         │   │
│   └─────────┘   │
│                 │
└─────────────────┘
```

---

## 📋 Hangi Görselleri Güncellememiz Gerekiyor?

Bana yeni logoları/görselleri şu sırayla verebilirsin:

1. **Ana Logo** (icon.png için) - 1024x1024
2. **Adaptive Icon** (adaptive-icon.png için) - 1024x1024, şeffaf arka plan
3. **Splash Logo** (splash-icon.png için) - İsterseniz farklı veya aynı
4. **İçerik Logosu** (logo.png için) - Ana sayfada gösterilecek

Her birini ayrı ayrı mı yoksa tümü için aynı logoyu mu kullanmak istersin?
