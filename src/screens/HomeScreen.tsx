import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const activities = useSelector((state: RootState) => state.activities.activities);
  const baby = profile?.baby;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 18, condition: 'Parçalı Bulutlu' });

  // Safe guards to prevent crashes
  const babyName = baby?.name || 'Bebek';
  const babyAge = baby?.birthDate ? getBabyAge() : '0 aylık';

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  // Calculate baby age
  const getBabyAge = () => {
    if (!baby) return '';
    const birthDate = new Date(baby.birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} günlük`;
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return `${months} ay ${days} günlük`;
  };

  // Get today's activities summary
  const getTodaySummary = () => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(
      activity => new Date(activity.startTime).toDateString() === today
    );

    const sleepTime = todayActivities
      .filter(a => a.type === 'sleep')
      .reduce((total, a) => {
        if (a.endTime) {
          return total + (new Date(a.endTime).getTime() - new Date(a.startTime).getTime());
        }
        return total;
      }, 0);

    const feedingTime = todayActivities
      .filter(a => a.type === 'feeding')
      .reduce((total, a) => total + (a.quantity || 0), 0);

    const diaperCount = todayActivities.filter(a => a.type === 'diaper').length;

    return {
      sleepHours: Math.floor(sleepTime / (1000 * 60 * 60)),
      sleepMinutes: Math.floor((sleepTime % (1000 * 60 * 60)) / (1000 * 60)),
      feedingAmount: feedingTime,
      diaperCount,
    };
  };

  const summary = getTodaySummary();

  // Quick add buttons
  const quickAddButtons = [
    { type: 'feeding', icon: 'water', label: 'Emzirme', color: '#FF6B9D' },
    { type: 'bottle', icon: 'restaurant', label: 'Mama', color: '#4299E1' },
    { type: 'sleep', icon: 'bed', label: 'Uyku', color: '#9F7AEA' },
    { type: 'diaper', icon: 'color-wash', label: 'Bez', color: '#48BB78' },
    { type: 'medication', icon: 'medkit', label: 'İlaç', color: '#ED8936' },
    { type: 'note', icon: 'create', label: 'Not', color: '#718096' },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.greeting}>
          {getGreeting()} {baby?.name || 'Anne'} • Harikasın anne!
        </Text>
        
        {baby && (
          <Text style={styles.ageInfo}>
            {baby.name} • {getBabyAge()}
          </Text>
        )}

        <View style={styles.timeWeatherContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
            <Text style={styles.date}>{formatDate(currentTime)}</Text>
          </View>
          
          <View style={styles.weatherContainer}>
            <Ionicons name="partly-sunny" size={24} color="#FFA500" />
            <Text style={styles.weather}>{weather.temp}° • {weather.condition}</Text>
          </View>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="moon" size={24} color="#9F7AEA" />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Uyku</Text>
            <Text style={styles.summaryValue}>
              {summary.sleepHours}h {summary.sleepMinutes}m
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="restaurant" size={24} color="#FF6B9D" />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Beslenme</Text>
            <Text style={styles.summaryValue}>{summary.feedingAmount} ml</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="color-wash" size={24} color="#48BB78" />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Bez</Text>
            <Text style={styles.summaryValue}>{summary.diaperCount} adet</Text>
          </View>
        </View>
      </View>

      {/* Quick Add Section */}
      <View style={styles.quickAddSection}>
        <Text style={styles.sectionTitle}>Hızlı Ekle</Text>
        <View style={styles.quickAddGrid}>
          {quickAddButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickAddButton, { backgroundColor: button.color }]}
              onPress={() => {
                // TODO: Implement quick add functionality
                console.log(`Quick add: ${button.type}`);
              }}
            >
              <Ionicons name={button.icon as any} size={24} color="white" />
              <Text style={styles.quickAddLabel}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        {activities.slice(0, 6).map((activity, index) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons 
                name={
                  activity.type === 'feeding' ? 'restaurant' :
                  activity.type === 'sleep' ? 'bed' :
                  activity.type === 'diaper' ? 'color-wash' :
                  activity.type === 'medication' ? 'medkit' :
                  'create'
                } 
                size={20} 
                color="#667eea" 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityType}>
                {activity.type === 'feeding' ? 'Beslenme' :
                 activity.type === 'sleep' ? 'Uyku' :
                 activity.type === 'diaper' ? 'Bez' :
                 activity.type === 'medication' ? 'İlaç' : 'Not'}
              </Text>
              <Text style={styles.activityTime}>
                {new Date(activity.startTime).toLocaleTimeString('tr-TR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  headerSection: {
    backgroundColor: '#FF6B9D',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  ageInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  timeWeatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    alignItems: 'center',
  },
  time: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  weather: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContent: {
    marginLeft: 10,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#718096',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  quickAddSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickAddButton: {
    width: (width - 50) / 3,
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAddLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  recentSection: {
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  activityTime: {
    fontSize: 12,
    color: '#718096',
  },
});

export default HomeScreen;