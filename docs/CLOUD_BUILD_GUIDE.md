# Google Cloud Build Deployment Guide

## 📋 Genel Bakış

Bu rehber, DostAnne uygulamasının Google Cloud Build kullanılarak nasıl derleneceğini ve deploy edileceğini açıklar.

## 🔧 Ön Gereksinimler

### 1. Google Cloud Project
- Aktif bir Google Cloud Project'iniz olmalı
- Billing (Faturalama) aktif edilmiş olmalı
- Cloud Build API'si etkinleştirilmiş olmalı

### 2. Gerekli API'leri Etkinleştirin

```bash
# Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Container Registry API (imaj depolamak için)
gcloud services enable containerregistry.googleapis.com

# Cloud Run API (deploy için - opsiyonel)
gcloud services enable run.googleapis.com
```

### 3. gcloud CLI Kurulumu ve Yapılandırması

```bash
# gcloud CLI kurulumunu kontrol edin
gcloud version

# Projenizi ayarlayın
gcloud config set project YOUR_PROJECT_ID

# Kimlik doğrulama
gcloud auth login
gcloud auth configure-docker
```

## 🚀 Manuel Build Çalıştırma

### Temel Build Komutu

```bash
# Repository kök dizininde:
gcloud builds submit --config cloudbuild.yaml .
```

### Belirli Bir Tag ile Build

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=TAG_NAME=v1.0.0 \
  .
```

## 📝 cloudbuild.yaml Açıklaması

### Dosya Yapısı

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/dostanne:$COMMIT_SHA', '.']
```

**Önemli Değişkenler:**
- `$PROJECT_ID`: Google Cloud Project ID'niz (otomatik)
- `$COMMIT_SHA`: Git commit hash (otomatik)
- `$BUILD_ID`: Build ID (otomatik)

### Build Adımları

1. **Docker Image Build**: Dockerfile kullanarak imaj oluşturur
2. **Push to Registry**: Imajı Container Registry'ye yükler
3. **Deploy** (Opsiyonel): Cloud Run'a deploy eder

## 🔄 Otomatik Build (CI/CD)

### GitHub Entegrasyonu

1. Cloud Build Console'da GitHub repository'nizi bağlayın
2. Trigger oluşturun:

```bash
gcloud builds triggers create github \
  --repo-name=DostAnne \
  --repo-owner=ysfyavuzz \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Trigger Tipleri

- **Push to Branch**: Her push'ta otomatik build
- **Pull Request**: PR'larda test build
- **Tag**: Yeni tag'larda release build

## 🐛 Yaygın Hatalar ve Çözümleri

### Hata 1: "Dockerfile not found"

**Hata Mesajı:**
```
unable to prepare context: unable to evaluate symlinks in Dockerfile path: 
lstat /workspace/Dockerfile: no such file or directory
```

**Çözüm:**
- `cloudbuild.yaml` dosyasının repository root'unda olduğundan emin olun
- Dockerfile'ın repository root'unda olduğunu kontrol edin
- Build komutunu doğru dizinden çalıştırın

### Hata 2: "Permission Denied"

**Çözüm:**
```bash
# Cloud Build service account'a gerekli izinleri verin
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin
```

### Hata 3: "Quota Exceeded"

**Çözüm:**
- Google Cloud Console → IAM & Admin → Quotas
- Build dakika kotalarını kontrol edin ve artırın

### Hata 4: "npm ci fails"

**Çözüm:**
- `.gcloudignore` dosyasında `node_modules/` ignore edildiğinden emin olun
- `package-lock.json` dosyasının commit'lendiğini kontrol edin

## 📊 Build Süresini Optimize Etme

### 1. .gcloudignore Kullanın

Gereksiz dosyaların Cloud Build'e gönderilmesini önleyin:

```bash
# .gcloudignore dosyası zaten oluşturuldu
# İçeriğini projenize göre özelleştirin
```

### 2. Docker Layer Caching

```yaml
options:
  machineType: 'N1_HIGHCPU_8'
  diskSizeGb: 100
  # Kangaroo kullanarak cache
  volumes:
  - name: 'cache'
    path: '/cache'
```

### 3. Multi-stage Build Kullanın

Mevcut Dockerfile zaten multi-stage build kullanıyor:
- Stage 1: Build (node_modules, derleme)
- Stage 2: Runtime (sadece gerekli dosyalar)

## 🌐 Cloud Run'a Deploy

### Manuel Deploy

```bash
gcloud run deploy dostanne \
  --image gcr.io/YOUR_PROJECT_ID/dostanne:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080
```

### cloudbuild.yaml ile Otomatik Deploy

`cloudbuild.yaml` dosyasındaki Cloud Run deploy step'inin yorumunu kaldırın:

```yaml
- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  entrypoint: gcloud
  args:
    - 'run'
    - 'deploy'
    - 'dostanne'
    - '--image=gcr.io/$PROJECT_ID/dostanne:$COMMIT_SHA'
    - '--region=europe-west1'
    - '--platform=managed'
    - '--allow-unauthenticated'
    - '--port=8080'
```

## 🔒 Güvenlik İpuçları

### 1. Secrets Yönetimi

```bash
# Secret oluştur
echo -n "my-secret-value" | gcloud secrets create my-secret --data-file=-

# Build'de kullan
steps:
  - name: 'gcr.io/cloud-builders/docker'
    secretEnv: ['MY_SECRET']
    args: ['build', '--build-arg', 'SECRET=$MY_SECRET', '.']
availableSecrets:
  secretManager:
  - versionName: projects/$PROJECT_ID/secrets/my-secret/versions/latest
    env: 'MY_SECRET'
```

### 2. Private Dependencies

```bash
# SSH key secret olarak sakla
# Build sırasında kullan
```

## 📈 Build Monitoring

### Build Loglarını Görüntüleme

```bash
# En son build'in logları
gcloud builds list --limit=1

# Belirli bir build'in logları
gcloud builds log BUILD_ID
```

### Build History

```bash
# Tüm build'leri listele
gcloud builds list --limit=10

# Başarısız build'leri bul
gcloud builds list --filter="status=FAILURE"
```

## 💰 Maliyet Optimizasyonu

### Free Tier Limitleri (Şubat 2024)
- İlk 120 build-dakika/gün ücretsiz
- Sonrası: $0.003/build-dakika

### Optimizasyon İpuçları
1. `.gcloudignore` kullanarak upload süresini azaltın
2. Docker cache kullanın
3. Paralel olmayan build'leri batch'leyin
4. Küçük machine type kullanın (gerekmedikçe)

## 🔗 Faydalı Linkler

- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Container Registry Documentation](https://cloud.google.com/container-registry/docs)
- [Build Triggers Guide](https://cloud.google.com/build/docs/triggers)

## 📞 Destek

Sorun yaşarsanız:
1. Build loglarını kontrol edin: `gcloud builds log BUILD_ID`
2. Dockerfile'ı yerel olarak test edin: `docker build -t dostanne .`
3. Cloud Build status sayfasını kontrol edin
4. GitHub Issues'da sorun açın

## 📌 Önemli Notlar

- **Region Seçimi**: `europe-west1` (Frankfurt) Avrupa için önerilir
- **Port**: Uygulama 8080 portunda çalışır (Cloud Run varsayılanı)
- **Build Süresi**: İlk build ~5-10 dakika, cache ile ~2-3 dakika
- **Image Boyutu**: Multi-stage build sayesinde ~150-200MB
