#!/bin/bash

# DostAnne - Cloud Build Local Test Script
# Bu script, Cloud Build yapılandırmasını lokal olarak test eder

set -e  # Hata durumunda durdur

echo "🔍 DostAnne Cloud Build Test Script"
echo "===================================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Dockerfile kontrolü
echo "📝 Test 1: Dockerfile varlığı kontrol ediliyor..."
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✅ Dockerfile bulundu${NC}"
else
    echo -e "${RED}❌ Dockerfile bulunamadı!${NC}"
    echo "   Dockerfile, repository root'unda olmalıdır."
    exit 1
fi

# Test 2: cloudbuild.yaml kontrolü
echo ""
echo "📝 Test 2: cloudbuild.yaml varlığı kontrol ediliyor..."
if [ -f "cloudbuild.yaml" ]; then
    echo -e "${GREEN}✅ cloudbuild.yaml bulundu${NC}"
else
    echo -e "${RED}❌ cloudbuild.yaml bulunamadı!${NC}"
    echo "   cloudbuild.yaml, repository root'unda olmalıdır."
    exit 1
fi

# Test 3: .gcloudignore kontrolü
echo ""
echo "📝 Test 3: .gcloudignore varlığı kontrol ediliyor..."
if [ -f ".gcloudignore" ]; then
    echo -e "${GREEN}✅ .gcloudignore bulundu${NC}"
else
    echo -e "${YELLOW}⚠️  .gcloudignore bulunamadı (opsiyonel)${NC}"
    echo "   Bu dosya, build süresini optimize etmek için önerilir."
fi

# Test 4: package.json kontrolü
echo ""
echo "📝 Test 4: package.json ve package-lock.json kontrol ediliyor..."
if [ -f "package.json" ] && [ -f "package-lock.json" ]; then
    echo -e "${GREEN}✅ package.json ve package-lock.json bulundu${NC}"
else
    echo -e "${RED}❌ package.json veya package-lock.json eksik!${NC}"
    exit 1
fi

# Test 5: Docker daemon kontrolü
echo ""
echo "📝 Test 5: Docker daemon kontrol ediliyor..."
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker çalışıyor${NC}"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}⚠️  Docker çalışmıyor veya yüklü değil${NC}"
    echo "   Local build testi yapılamayacak."
    DOCKER_AVAILABLE=false
fi

# Test 6: gcloud CLI kontrolü
echo ""
echo "📝 Test 6: gcloud CLI kontrol ediliyor..."
if command -v gcloud &> /dev/null; then
    echo -e "${GREEN}✅ gcloud CLI yüklü${NC}"
    GCLOUD_VERSION=$(gcloud version --format="value(core)" 2>/dev/null)
    echo "   Versiyon: $GCLOUD_VERSION"
    GCLOUD_AVAILABLE=true
else
    echo -e "${YELLOW}⚠️  gcloud CLI yüklü değil${NC}"
    echo "   Cloud Build'e deploy etmek için gcloud CLI gereklidir."
    echo "   Kurulum: https://cloud.google.com/sdk/docs/install"
    GCLOUD_AVAILABLE=false
fi

# Test 7: gcloud authentication kontrolü
if [ "$GCLOUD_AVAILABLE" = true ]; then
    echo ""
    echo "📝 Test 7: gcloud authentication kontrol ediliyor..."
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
        ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
        echo -e "${GREEN}✅ gcloud authenticated: $ACTIVE_ACCOUNT${NC}"
    else
        echo -e "${YELLOW}⚠️  gcloud authentication gerekli${NC}"
        echo "   Komut: gcloud auth login"
    fi

    # Project ID kontrolü
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -n "$PROJECT_ID" ]; then
        echo -e "${GREEN}✅ Active project: $PROJECT_ID${NC}"
    else
        echo -e "${YELLOW}⚠️  Project ID ayarlanmamış${NC}"
        echo "   Komut: gcloud config set project YOUR_PROJECT_ID"
    fi
fi

# Test 8: Dockerfile syntax kontrolü (basit)
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    echo "📝 Test 8: Dockerfile syntax kontrol ediliyor..."
    # Basit syntax kontrolü - FROM komutunu kontrol et
    if grep -q "^FROM " Dockerfile; then
        echo -e "${GREEN}✅ Dockerfile syntax geçerli görünüyor${NC}"
        echo "   Not: Tam build testi için: docker build -t dostanne:test ."
    else
        echo -e "${RED}❌ Dockerfile syntax hatası!${NC}"
        echo "   FROM komutu bulunamadı."
        exit 1
    fi
fi

# Test 9: Expo web config kontrolü
echo ""
echo "📝 Test 9: Expo web yapılandırması kontrol ediliyor..."
if grep -q '"web"[[:space:]]*:[[:space:]]*{' app.json; then
    echo -e "${GREEN}✅ Expo web config bulundu${NC}"
else
    echo -e "${YELLOW}⚠️  app.json içinde web config bulunamadı${NC}"
    echo "   Expo web export çalışmayabilir. app.json'da 'web' bölümünü kontrol edin."
fi

# Özet
echo ""
echo "=================================="
echo "📊 Test Özeti"
echo "=================================="
echo ""

if [ "$DOCKER_AVAILABLE" = true ] && [ "$GCLOUD_AVAILABLE" = true ]; then
    echo -e "${GREEN}✅ Tüm testler başarılı!${NC}"
    echo ""
    echo "🚀 Sonraki adımlar:"
    echo "   1. Local build test: docker build -t dostanne:local ."
    echo "   2. Cloud Build submit: gcloud builds submit --config cloudbuild.yaml ."
    echo ""
elif [ "$GCLOUD_AVAILABLE" = true ]; then
    echo -e "${YELLOW}⚠️  Docker yok ama gcloud mevcut${NC}"
    echo ""
    echo "🚀 Sonraki adım:"
    echo "   Cloud Build submit: gcloud builds submit --config cloudbuild.yaml ."
    echo ""
else
    echo -e "${YELLOW}⚠️  Bazı araçlar eksik${NC}"
    echo ""
    echo "📋 Yapılması gerekenler:"
    if [ "$DOCKER_AVAILABLE" = false ]; then
        echo "   - Docker'ı yükleyin (local test için)"
    fi
    if [ "$GCLOUD_AVAILABLE" = false ]; then
        echo "   - gcloud CLI'yı yükleyin (deploy için)"
    fi
    echo ""
fi

echo "📚 Detaylı rehber için: docs/CLOUD_BUILD_GUIDE.md"
echo ""
