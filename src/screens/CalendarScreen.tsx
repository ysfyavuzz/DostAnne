import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const { width } = Dimensions.get('window');

const CalendarScreen = () => {
  const { activities, baby } = useSelector((state: RootState) => state.activities);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'month' | 'week' | 'day'>('month');

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get activities for a specific date
  const getActivitiesForDate = (day: number) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    const dateString = date.toDateString();
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.startTime).toDateString();
      return activityDate === dateString;
    });
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  // Get today's activities
  const getTodayActivities = () => {
    const today = new Date().toDateString();
    return activities.filter(activity => {
      const activityDate = new Date(activity.startTime).toDateString();
      return activityDate === today;
    });
  };

  const weekDays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const todayActivities = getTodayActivities();
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'feeding': return 'restaurant';
      case 'sleep': return 'bed';
      case 'diaper': return 'color-wash';
      case 'medication': return 'medkit';
      case 'note': return 'create';
      default: return 'help';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'feeding': return '#FF6B9D';
      case 'sleep': return '#9F7AEA';
      case 'diaper': return '#48BB78';
      case 'medication': return '#ED8936';
      case 'note': return '#718096';
      default: return '#667eea';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => navigateMonth('prev')}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.monthYear}>
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          
          <TouchableOpacity onPress={() => navigateMonth('next')}>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.viewModeSelector}>
          {(['month', 'week', 'day'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.viewModeButton,
                viewMode === mode && styles.activeViewMode,
              ]}
              onPress={() => setViewMode(mode)}
            >
              <Text
                style={[
                  styles.viewModeText,
                  viewMode === mode && styles.activeViewModeText,
                ]}
              >
                {mode === 'month' ? 'Ay' : mode === 'week' ? 'Hafta' : 'Gün'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        {/* Week days header */}
        <View style={styles.weekDays}>
          {weekDays.map((day) => (
            <View key={day} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar days */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.emptyDay} />;
            }

            const dayActivities = getActivitiesForDate(day);
            const hasActivities = dayActivities.length > 0;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  isToday(day) && styles.todayCell,
                  hasActivities && styles.hasActivitiesCell,
                ]}
                onPress={() => {
                  // TODO: Show day details
                  console.log('Day pressed:', day);
                }}
              >
                <Text style={[
                  styles.dayText,
                  isToday(day) && styles.todayText,
                ]}>
                  {day}
                </Text>
                
                {hasActivities && (
                  <View style={styles.activityIndicators}>
                    {dayActivities.slice(0, 3).map((activity, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.activityDot,
                          { backgroundColor: getActivityColor(activity.type) }
                        ]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Today's Activities */}
      <View style={styles.todaySection}>
        <Text style={styles.sectionTitle}>Bugünün Aktiviteleri</Text>
        
        {todayActivities.length > 0 ? (
          todayActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]}>
                <Ionicons name={getActivityIcon(activity.type) as any} size={16} color="white" />
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
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={16} color="#718096" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#CBD5E0" />
            <Text style={styles.emptyStateText}>Bugün için aktivite yok</Text>
            <Text style={styles.emptyStateSubtext}>
              İlk aktiviteyi eklemek için Ana Sayfa'yı kullanın
            </Text>
          </View>
        )}
      </View>

      {/* Quick Add Button */}
      <TouchableOpacity style={styles.quickAddButton}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    backgroundColor: '#FF6B9D',
    padding: 20,
    paddingTop: 40,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeViewMode: {
    backgroundColor: 'white',
  },
  viewModeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activeViewModeText: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  calendarContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#718096',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 70) / 7,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    margin: 2,
  },
  todayCell: {
    backgroundColor: '#FFF5F7',
    borderColor: '#FF6B9D',
  },
  hasActivitiesCell: {
    backgroundColor: '#F0FFF4',
  },
  dayText: {
    fontSize: 14,
    color: '#2D3748',
  },
  todayText: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  emptyDay: {
    width: (width - 70) / 7,
    height: 60,
    margin: 2,
  },
  activityIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    gap: 2,
  },
  activityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  todaySection: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  activityTime: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
    textAlign: 'center',
  },
  quickAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default CalendarScreen;