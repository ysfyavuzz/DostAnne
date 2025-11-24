import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { 
  createBabyProfile,
  loadBabyProfiles,
  loadCurrentBaby,
  createActivity,
  loadActivities,
  createHealthRecord,
  loadHealthRecords,
  createGrowthRecord,
  loadGrowthRecords,
  createSleepSession,
  updateSleepSession,
  loadSleepSessions,
  createFeedingSession,
  updateFeedingSession,
  loadFeedingSessions,
  loadTodayStats,
  setCurrentBaby,
  clearError,
  updateLocalStats,
} from '../store/databaseSlice';
import { useEffect } from 'react';
import { BabyProfile, ActivityRecord, HealthRecord, GrowthRecord, SleepSession, FeedingSession } from '../database/DatabaseService';

export const useDatabase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const database = useSelector((state: RootState) => state.database);

  // Initialize database data
  const initializeData = () => {
    dispatch(loadBabyProfiles());
    dispatch(loadCurrentBaby());
  };

  // Baby Profile Actions
  const addBabyProfile = (baby: Omit<BabyProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    return dispatch(createBabyProfile(baby));
  };

  const selectCurrentBaby = (baby: BabyProfile | null) => {
    dispatch(setCurrentBaby(baby));
  };

  // Activity Actions
  const addActivity = (activity: Omit<ActivityRecord, 'id' | 'createdAt'>) => {
    return dispatch(createActivity(activity));
  };

  const loadActivitiesForBaby = (babyId: number, limit?: number) => {
    return dispatch(loadActivities({ babyId, limit }));
  };

  // Health Record Actions
  const addHealthRecord = (record: Omit<HealthRecord, 'id' | 'createdAt'>) => {
    return dispatch(createHealthRecord(record));
  };

  const loadHealthRecordsForBaby = (babyId: number) => {
    return dispatch(loadHealthRecords(babyId));
  };

  // Growth Record Actions
  const addGrowthRecord = (record: Omit<GrowthRecord, 'id' | 'createdAt'>) => {
    return dispatch(createGrowthRecord(record));
  };

  const loadGrowthRecordsForBaby = (babyId: number) => {
    return dispatch(loadGrowthRecords(babyId));
  };

  // Sleep Actions
  const startSleepSession = (session: Omit<SleepSession, 'id' | 'createdAt' | 'endTime' | 'duration'>) => {
    return dispatch(createSleepSession(session));
  };

  const endSleepSession = (id: number, endTime: string, duration: number, quality: SleepSession['quality']) => {
    return dispatch(updateSleepSession({ id, updates: { endTime, duration, quality } }));
  };

  const loadSleepSessionsForBaby = (babyId: number, limit?: number) => {
    return dispatch(loadSleepSessions({ babyId, limit }));
  };

  // Feeding Actions
  const startFeedingSession = (session: Omit<FeedingSession, 'id' | 'createdAt' | 'endTime' | 'duration'>) => {
    return dispatch(createFeedingSession(session));
  };

  const endFeedingSession = (id: number, endTime: string, duration: number, amount?: number) => {
    return dispatch(updateFeedingSession({ id, updates: { endTime, duration, amount } }));
  };

  const loadFeedingSessionsForBaby = (babyId: number, limit?: number) => {
    return dispatch(loadFeedingSessions({ babyId, limit }));
  };

  // Stats Actions
  const refreshTodayStats = (babyId: number) => {
    return dispatch(loadTodayStats(babyId));
  };

  // Utility Actions
  const clearDatabaseError = () => {
    dispatch(clearError());
  };

  const updateStats = (stats: Partial<typeof database.todayStats>) => {
    dispatch(updateLocalStats(stats));
  };

  // Auto-load data when current baby changes
  useEffect(() => {
    if (database.currentBaby?.id) {
      loadActivitiesForBaby(database.currentBaby.id, 10);
      loadHealthRecordsForBaby(database.currentBaby.id);
      loadGrowthRecordsForBaby(database.currentBaby.id);
      loadSleepSessionsForBaby(database.currentBaby.id, 5);
      loadFeedingSessionsForBaby(database.currentBaby.id, 10);
      refreshTodayStats(database.currentBaby.id);
    }
  }, [database.currentBaby?.id]);

  return {
    // State
    ...database,
    
    // Initialization
    initializeData,
    
    // Baby Profile
    addBabyProfile,
    selectCurrentBaby,
    
    // Activities
    addActivity,
    loadActivitiesForBaby,
    
    // Health Records
    addHealthRecord,
    loadHealthRecordsForBaby,
    
    // Growth Records
    addGrowthRecord,
    loadGrowthRecordsForBaby,
    
    // Sleep
    startSleepSession,
    endSleepSession,
    loadSleepSessionsForBaby,
    
    // Feeding
    startFeedingSession,
    endFeedingSession,
    loadFeedingSessionsForBaby,
    
    // Stats
    refreshTodayStats,
    
    // Utilities
    clearDatabaseError,
    updateStats,
  };
};

// Custom hooks for specific data
export const useCurrentBaby = () => {
  const database = useSelector((state: RootState) => state.database);
  return database.currentBaby;
};

export const useTodayStats = () => {
  const database = useSelector((state: RootState) => state.database);
  return database.todayStats;
};

export const useSleepSessions = () => {
  const database = useSelector((state: RootState) => state.database);
  return database.sleepSessions;
};

export const useFeedingSessions = () => {
  const database = useSelector((state: RootState) => state.database);
  return database.feedingSessions;
};

export const useActivities = () => {
  const database = useSelector((state: RootState) => state.database);
  return database.activities;
};

export const useHealthRecords = () => {
  const database = useSelector((state: RootState) => state.database);
  return database.healthRecords;
};

export const useGrowthRecords = () => {
  const database = useSelector((state: RootState) => state.database);
  return database.growthRecords;
};