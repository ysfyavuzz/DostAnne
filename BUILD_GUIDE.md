# 🚀 APK Build Adımları

## Hızlı Başlangıç

### 1. EAS CLI Kurulumu

```bash
npm install -g eas-cli
```

### 2. Expo Hesabı ile Giriş

```bash
eas login
```

Expo hesabınız yoksa: <https://expo.dev/signup>

### 3. Proje Yapılandırması (İlk Kez)

```bash
eas build:configure
```

### 4. Preview APK Build (Telefona Kurulabilir)

```bash
eas build -p android --profile preview
```

Bu komut:

- ✅ Kodu derler
- ✅ APK oluşturur
- ✅ Bulutta build yapar (yerel Android SDK gerekmez)
- ✅ İndirme linki verir

### 5. APK İndirme

Build tamamlandığında:

- 📱 QR kod ile telefona direkt indir
- 💻 Link ile bilgisayara indir

### 6. Telefona Kurulum

1. APK dosyasını telefona aktarın
2. **Ayarlar > Güvenlik > Bilinmeyen kaynaklardan yüklemeye izin ver** açın
3. APK dosyasını açıp kurun

## Alternative: Local Build (Android Studio Gerektirir)

Eğer bilgisayarınızda Android Studio varsa:

```bash
# Release APK oluştur
npx expo run:android --variant release
```

APK konumu: `android/app/build/outputs/apk/release/app-release.apk`

## Build Profilleri

### Preview (Önerilen)

- APK formatı
- Direkt telefona kurulur
- Test için ideal

```bash
eas build -p android --profile preview
```

### Production

- AAB formatı (Google Play Store için)
- Optimize edilmiş

```bash
eas build -p android --profile production
```

### Development

- Development client
- Hot reload desteği

```bash
eas build -p android --profile development
```

## Sorun Giderme

### "EAS CLI bulunamadı"

```bash
npm install -g eas-cli
```

### "Expo hesabı bulunamadı"

```bash
eas login
# veya
eas register
```

### "Build başarısız"

- Internet bağlantısını kontrol edin
- `eas build:list` ile önceki build'leri kontrol edin
- `eas build -p android --profile preview --clear-cache` ile cache temizleyin

## Tahmini Süreler

- İlk build: ~10-15 dakika
- Sonraki build'ler: ~5-10 dakika
- Local build: ~5 dakika (Android Studio varsa)

## APK Boyutu

- Beklenen boyut: ~40-60 MB
- Optimizasyon sonrası: ~30-40 MB

## Güvenlik Notları

- APK production için signing gerektirmez
- Play Store için AAB ve signing gerekli
- Development build'ler daha büyük olabilir
