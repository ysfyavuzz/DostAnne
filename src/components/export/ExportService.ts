import React from 'react';
import * as FileSystem from 'expo-file-system/build/legacy/FileSystem';
import { EncodingType } from 'expo-file-system/build/legacy/FileSystem.types';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export interface ExportData {
  title: string;
  date: string;
  sections: ExportSection[];
}

export interface ExportSection {
  title: string;
  data: any[];
  headers: string[];
}

export class ExportService {
  static async generatePDF(data: ExportData): Promise<string> {
    // HTML template for PDF generation
    const htmlContent = this.generateHTMLTemplate(data);
    
    try {
      // Create file in document directory
      const fileName = `${data.title}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Write HTML content to file
      await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
        encoding: EncodingType.UTF8,
      });
      
      return fileUri;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('PDF oluşturulamadı');
    }
  }

  static async generateExcel(data: ExportData): Promise<string> {
    try {
      // Generate CSV content (simple Excel format)
      let csvContent = '';
      
      data.sections.forEach(section => {
        csvContent += `\n\n${section.title}\n`;
        csvContent += section.headers.join(',') + '\n';
        
        section.data.forEach(row => {
          const rowData = section.headers.map(header => {
            const value = row[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
          });
          csvContent += rowData.join(',') + '\n';
        });
      });

      const fileName = `${data.title}_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: EncodingType.UTF8,
      });
      
      return fileUri;
    } catch (error) {
      console.error('Excel generation error:', error);
      throw new Error('Excel dosyası oluşturulamadı');
    }
  }

  static async shareFile(fileUri: string): Promise<void> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: fileUri.endsWith('.pdf') ? 'application/pdf' : 'text/csv',
          dialogTitle: 'DostAnne Verilerini Paylaş',
        });
      } else {
        Alert.alert('Hata', 'Paylaşım özelliği bu cihazda mevcut değil');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Hata', 'Dosya paylaşılamadı');
    }
  }

  private static generateHTMLTemplate(data: ExportData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${data.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4A90E2;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            color: #4A90E2;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .date {
            color: #666;
            font-size: 14px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            color: #333;
            font-size: 18px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #4A90E2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .summary {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${data.title}</h1>
        <p class="date">Oluşturulma Tarihi: ${data.date}</p>
    </div>
    
    ${data.sections.map(section => `
        <div class="section">
            <h2 class="section-title">${section.title}</h2>
            <table>
                <thead>
                    <tr>
                        ${section.headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${section.data.map(row => `
                        <tr>
                            ${section.headers.map(header => `<td>${row[header] || '-'}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `).join('')}
    
    <div class="footer">
        <p>Bu rapor DostAnne Bebek Bakım Uygulaması tarafından oluşturulmuştur.</p>
        <p>© 2024 DostAnne - Tüm hakları saklıdır.</p>
    </div>
</body>
</html>`;
  }
}

// Helper function to sort records by timestamp
const sortRecordsByTimestamp = (records: any[]): any[] => {
  return records.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const prepareFeedingData = (records: any[]): ExportData => {
  const sortedRecords = sortRecordsByTimestamp(records);

  const feedingByType = sortedRecords.reduce((acc, record) => {
    const type = record.type === 'breast' ? 'Anne Sütü' : 
                record.type === 'bottle' ? 'Mama' : 'Ek Gıda';
    if (!acc[type]) acc[type] = 0;
    acc[type] += record.amount || 1;
    return acc;
  }, {});

  return {
    title: 'Beslenme Raporu',
    date: new Date().toLocaleDateString('tr-TR'),
    sections: [
      {
        title: 'Beslenme Özeti',
        headers: ['Beslenme Türü', 'Toplam Miktar/Sayı'],
        data: Object.entries(feedingByType).map(([type, amount]) => ({
          'Beslenme Türü': type,
          'Toplam Miktar/Sayı': typeof amount === 'number' ? `${amount} ml` : `${amount} kez`,
        })),
      },
      {
        title: 'Beslenme Kayıtları',
        headers: ['Tarih', 'Tür', 'Miktar', 'Süre', 'Notlar'],
        data: sortedRecords.slice(0, 50).map(record => ({
          'Tarih': new Date(record.timestamp).toLocaleString('tr-TR'),
          'Tür': record.type === 'breast' ? 'Anne Sütü' : 
               record.type === 'bottle' ? 'Mama' : 'Ek Gıda',
          'Miktar': `${record.amount || '-'} ml`,
          'Süre': record.duration ? `${record.duration} dk` : '-',
          'Notlar': record.notes || '-',
        })),
      },
    ],
  };
};

export const prepareHealthData = (records: any[], vaccinations: any[]): ExportData => {
  const sortedRecords = sortRecordsByTimestamp(records);

  const healthStats = sortedRecords.reduce((acc, record) => {
    if (!acc[record.type]) acc[record.type] = [];
    acc[record.type].push(record.value);
    return acc;
  }, {});

  const getStats = (values: number[]) => {
    if (values.length === 0) return { min: '-', max: '-', avg: '-' };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    return { min, max, avg: avg.toFixed(1) };
  };

  return {
    title: 'Sağlık Raporu',
    date: new Date().toLocaleDateString('tr-TR'),
    sections: [
      {
        title: 'Sağlık İstatistikleri',
        headers: ['Ölçüm Türü', 'Minimum', 'Maksimum', 'Ortalama'],
        data: Object.entries(healthStats).map(([type, values]) => {
          const stats = getStats(values as number[]);
          const typeLabel = type === 'temperature' ? 'Vücut Isısı (°C)' :
                          type === 'weight' ? 'Kilo (kg)' :
                          type === 'height' ? 'Boy (cm)' : type;
          return {
            'Ölçüm Türü': typeLabel,
            'Minimum': stats.min,
            'Maksimum': stats.max,
            'Ortalama': stats.avg,
          };
        }),
      },
      {
        title: 'Sağlık Kayıtları',
        headers: ['Tarih', 'Tür', 'Değer', 'Birim', 'Notlar'],
        data: sortedRecords.slice(0, 50).map(record => ({
          'Tarih': new Date(record.timestamp).toLocaleString('tr-TR'),
          'Tür': record.type === 'temperature' ? 'Vücut Isısı' :
               record.type === 'weight' ? 'Kilo' :
               record.type === 'height' ? 'Boy' : record.type,
          'Değer': record.value,
          'Birim': record.unit,
          'Notlar': record.notes || '-',
        })),
      },
      {
        title: 'Aşı Takvimi',
        headers: ['Aşı Adı', 'Durum', 'Önerilen Yaş', 'Planlanan Tarih', 'Uygulama Tarihi'],
        data: vaccinations.map(vaccine => ({
          'Aşı Adı': vaccine.name,
          'Durum': vaccine.status === 'completed' ? 'Tamamlandı' :
                  vaccine.status === 'pending' ? 'Bekliyor' :
                  vaccine.status === 'overdue' ? 'Gecikmiş' : 'Yaklaşan',
          'Önerilen Yaş': vaccine.recommendedAge,
          'Planlanan Tarih': new Date(vaccine.dueDate).toLocaleDateString('tr-TR'),
          'Uygulama Tarihi': vaccine.administeredDate ? 
            new Date(vaccine.administeredDate).toLocaleDateString('tr-TR') : '-',
        })),
      },
    ],
  };
};

export const prepareSleepData = (records: any[]): ExportData => {
  const sortedRecords = sortRecordsByTimestamp(records);

  const sleepStats = {
    totalSessions: sortedRecords.length,
    avgDuration: sortedRecords.length > 0 ? 
      Math.round(sortedRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / sortedRecords.length) : 0,
    totalSleepHours: Math.round(sortedRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / 60),
  };

  return {
    title: 'Uyku Raporu',
    date: new Date().toLocaleDateString('tr-TR'),
    sections: [
      {
        title: 'Uyku İstatistikleri',
        headers: ['Metrik', 'Değer'],
        data: [
          { 'Metrik': 'Toplam Uyku Seansı', 'Değer': `${sleepStats.totalSessions} kez` },
          { 'Metrik': 'Ortalama Uyku Süresi', 'Değer': `${sleepStats.avgDuration} dakika` },
          { 'Metrik': 'Toplam Uyku Süresi', 'Değer': `${sleepStats.totalSleepHours} saat` },
        ],
      },
      {
        title: 'Uyku Kayıtları',
        headers: ['Tarih', 'Başlangıç', 'Bitiş', 'Süre', 'Kalite', 'Notlar'],
        data: sortedRecords.slice(0, 50).map(record => {
          const startTime = new Date(record.timestamp);
          const endTime = new Date(startTime.getTime() + (record.duration || 0) * 60000);
          
          return {
            'Tarih': startTime.toLocaleDateString('tr-TR'),
            'Başlangıç': startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            'Bitiş': endTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            'Süre': `${record.duration || 0} dakika`,
            'Kalite': record.quality || '-',
            'Notlar': record.notes || '-',
          };
        }),
      },
    ],
  };
};