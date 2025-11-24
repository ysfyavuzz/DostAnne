# 1. Aşama: Derleme (Build)
FROM node:18-alpine AS builder

WORKDIR /app

# Bağımlılıkları yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Web sürümü için build al (dist klasörüne çıkarır)
RUN npx expo export --platform web

# 2. Aşama: Sunum (Serve)
FROM node:18-alpine

WORKDIR /app

# Statik sunucu paketini global olarak yükle
RUN npm install -g serve

# Derlenen dosyaları önceki aşamadan kopyala
COPY --from=builder /app/dist ./dist

# Uygulamayı 8080 portunda sun (Cloud Run varsayılan portu)
ENV PORT=8080
EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
