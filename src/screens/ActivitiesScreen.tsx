import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const ActivitiesScreen = () => {
  const { activities } = useSelector((state: RootState) => state.activities);

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'Hepsi' },
    { id: 'baby', label: 'Bebek' },
    { id: 'mother', label: 'Anne' },
  ];

  // Sort options
  const sortOptions = [
    { id: 'recent', label: 'En Son' },
    { id: 'oldest', label: 'En Eski' },
  ];

  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [selectedSort, setSelectedSort] = React.useState('recent');

  // Filter and sort activities
  const filteredActivities = activities
    .filter(activity => {
      if (selectedFilter === 'all') return true;
      return activity.actor === selectedFilter;
    })
    .sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return selectedSort === 'recent' ? timeB - timeA : timeA - timeB;
    });

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

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'feeding': return 'Beslenme';
      case 'sleep': return 'Uyku';
      case 'diaper': return 'Bez';
      case 'medication': return 'İlaç';
      case 'note': return 'Not';
      default: return 'Diğer';
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = end.getTime() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const renderActivity = ({ item }: { item: any }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: getActivityColor(item.type) }]}>
        <Ionicons name={getActivityIcon(item.type) as any} size={20} color="white" />
      </View>
      
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityType}>{getActivityLabel(item.type)}</Text>
          <Text style={styles.activityActor}>
            {item.actor === 'baby' ? 'Bebek' : 'Anne'}
          </Text>
        </View>
        
        <View style={styles.activityDetails}>
          <Text style={styles.activityTime}>
            {new Date(item.startTime).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          
          {item.quantity && (
            <Text style={styles.activityQuantity}>
              {item.quantity} {item.unit || ''}
            </Text>
          )}
        </View>
        
        {item.endTime && (
          <Text style={styles.activityDuration}>
            Süre: {formatDuration(item.startTime, item.endTime)}
          </Text>
        )}
        
        {item.notes && (
          <Text style={styles.activityNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#718096" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aktiviteler</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterTab,
              selectedFilter === option.id && styles.activeFilterTab,
            ]}
            onPress={() => setSelectedFilter(option.id)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === option.id && styles.activeFilterText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sırala:</Text>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => setSelectedSort(option.id)}
          >
            <Text
              style={[
                styles.sortOption,
                selectedSort === option.id && styles.activeSortOption,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activities List */}
      {filteredActivities.length > 0 ? (
        <FlatList
          data={filteredActivities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.activitiesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-text" size={64} color="#CBD5E0" />
          <Text style={styles.emptyStateText}>
            Henüz aktivite kaydedilmemiş
          </Text>
          <Text style={styles.emptyStateSubtext}>
            İlk aktiviteyi eklemek için + butonuna tıklayın
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6B9D',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: '#FF6B9D',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
  },
  activeFilterText: {
    color: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  sortLabel: {
    fontSize: 14,
    color: '#718096',
    marginRight: 10,
  },
  sortOption: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 15,
  },
  activeSortOption: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  activitiesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  activityActor: {
    fontSize: 12,
    color: '#718096',
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityTime: {
    fontSize: 14,
    color: '#4A5568',
  },
  activityQuantity: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B9D',
  },
  activityDuration: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  activityNotes: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 18,
  },
  moreButton: {
    marginLeft: 10,
    padding: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#718096',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ActivitiesScreen;