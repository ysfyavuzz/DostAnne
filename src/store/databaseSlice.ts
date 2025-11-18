import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { databaseService, BabyProfile, ActivityRecord, HealthRecord, GrowthRecord, SleepSession, FeedingSession } from '../database/DatabaseService';

interface DatabaseState {
  currentBaby: BabyProfile | null;
  babies: BabyProfile[];
  activities: ActivityRecord[];
  healthRecords: HealthRecord[];
  growthRecords: GrowthRecord[];
  sleepSessions: SleepSession[];
  feedingSessions: FeedingSession[];
  todayStats: {
    feedingCount: number;
    sleepDuration: number;
    diaperChanges: number;
    playTime: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: DatabaseState = {
  currentBaby: null,
  babies: [],
  activities: [],
  healthRecords: [],
  growthRecords: [],
  sleepSessions: [],
  feedingSessions: [],
  todayStats: {
    feedingCount: 0,
    sleepDuration: 0,
    diaperChanges: 0,
    playTime: 0,
  },
  loading: false,
  error: null,
};

// Async thunks for database operations
export const createBabyProfile = createAsyncThunk(
  'database/createBabyProfile',
  async (baby: Omit<BabyProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await databaseService.createBabyProfile(baby);
    return { ...baby, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  }
);

export const loadBabyProfiles = createAsyncThunk(
  'database/loadBabyProfiles',
  async () => {
    const babies = await databaseService.getBabyProfiles();
    return babies;
  }
);

export const loadCurrentBaby = createAsyncThunk(
  'database/loadCurrentBaby',
  async () => {
    const baby = await databaseService.getCurrentBabyProfile();
    return baby;
  }
);

export const createActivity = createAsyncThunk(
  'database/createActivity',
  async (activity: Omit<ActivityRecord, 'id' | 'createdAt'>) => {
    const id = await databaseService.createActivity(activity);
    return { ...activity, id, createdAt: new Date().toISOString() };
  }
);

export const loadActivities = createAsyncThunk(
  'database/loadActivities',
  async ({ babyId, limit }: { babyId: number; limit?: number }) => {
    const activities = await databaseService.getActivities(babyId, limit);
    return activities;
  }
);

export const createHealthRecord = createAsyncThunk(
  'database/createHealthRecord',
  async (record: Omit<HealthRecord, 'id' | 'createdAt'>) => {
    const id = await databaseService.createHealthRecord(record);
    return { ...record, id, createdAt: new Date().toISOString() };
  }
);

export const loadHealthRecords = createAsyncThunk(
  'database/loadHealthRecords',
  async (babyId: number) => {
    const records = await databaseService.getHealthRecords(babyId);
    return records;
  }
);

export const createGrowthRecord = createAsyncThunk(
  'database/createGrowthRecord',
  async (record: Omit<GrowthRecord, 'id' | 'createdAt'>) => {
    const id = await databaseService.createGrowthRecord(record);
    return { ...record, id, createdAt: new Date().toISOString() };
  }
);

export const loadGrowthRecords = createAsyncThunk(
  'database/loadGrowthRecords',
  async (babyId: number) => {
    const records = await databaseService.getGrowthRecords(babyId);
    return records;
  }
);

export const createSleepSession = createAsyncThunk(
  'database/createSleepSession',
  async (session: Omit<SleepSession, 'id' | 'createdAt'>) => {
    const id = await databaseService.createSleepSession(session);
    return { ...session, id, createdAt: new Date().toISOString() };
  }
);

export const updateSleepSession = createAsyncThunk(
  'database/updateSleepSession',
  async ({ id, updates }: { id: number; updates: Partial<SleepSession> }) => {
    const success = await databaseService.updateSleepSession(id, updates);
    if (success) {
      return { id, updates };
    }
    throw new Error('Failed to update sleep session');
  }
);

export const loadSleepSessions = createAsyncThunk(
  'database/loadSleepSessions',
  async ({ babyId, limit }: { babyId: number; limit?: number }) => {
    const sessions = await databaseService.getSleepSessions(babyId, limit);
    return sessions;
  }
);

export const createFeedingSession = createAsyncThunk(
  'database/createFeedingSession',
  async (session: Omit<FeedingSession, 'id' | 'createdAt'>) => {
    const id = await databaseService.createFeedingSession(session);
    return { ...session, id, createdAt: new Date().toISOString() };
  }
);

export const updateFeedingSession = createAsyncThunk(
  'database/updateFeedingSession',
  async ({ id, updates }: { id: number; updates: Partial<FeedingSession> }) => {
    const success = await databaseService.updateFeedingSession(id, updates);
    if (success) {
      return { id, updates };
    }
    throw new Error('Failed to update feeding session');
  }
);

export const loadFeedingSessions = createAsyncThunk(
  'database/loadFeedingSessions',
  async ({ babyId, limit }: { babyId: number; limit?: number }) => {
    const sessions = await databaseService.getFeedingSessions(babyId, limit);
    return sessions;
  }
);

export const loadTodayStats = createAsyncThunk(
  'database/loadTodayStats',
  async (babyId: number) => {
    const stats = await databaseService.getTodayStats(babyId);
    return stats;
  }
);

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    setCurrentBaby: (state, action: PayloadAction<BabyProfile | null>) => {
      state.currentBaby = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLocalStats: (state, action: PayloadAction<Partial<DatabaseState['todayStats']>>) => {
      state.todayStats = { ...state.todayStats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Baby Profile
    builder
      .addCase(createBabyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBabyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.babies.unshift(action.payload);
        state.currentBaby = action.payload;
      })
      .addCase(createBabyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create baby profile';
      })
      .addCase(loadBabyProfiles.fulfilled, (state, action) => {
        state.babies = action.payload;
      })
      .addCase(loadCurrentBaby.fulfilled, (state, action) => {
        state.currentBaby = action.payload;
      });

    // Activities
    builder
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
      })
      .addCase(loadActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
      });

    // Health Records
    builder
      .addCase(createHealthRecord.fulfilled, (state, action) => {
        state.healthRecords.unshift(action.payload);
      })
      .addCase(loadHealthRecords.fulfilled, (state, action) => {
        state.healthRecords = action.payload;
      });

    // Growth Records
    builder
      .addCase(createGrowthRecord.fulfilled, (state, action) => {
        state.growthRecords.unshift(action.payload);
      })
      .addCase(loadGrowthRecords.fulfilled, (state, action) => {
        state.growthRecords = action.payload;
      });

    // Sleep Sessions
    builder
      .addCase(createSleepSession.fulfilled, (state, action) => {
        state.sleepSessions.unshift(action.payload);
      })
      .addCase(updateSleepSession.fulfilled, (state, action) => {
        const index = state.sleepSessions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sleepSessions[index] = { ...state.sleepSessions[index], ...action.payload.updates };
        }
      })
      .addCase(loadSleepSessions.fulfilled, (state, action) => {
        state.sleepSessions = action.payload;
      });

    // Feeding Sessions
    builder
      .addCase(createFeedingSession.fulfilled, (state, action) => {
        state.feedingSessions.unshift(action.payload);
      })
      .addCase(updateFeedingSession.fulfilled, (state, action) => {
        const index = state.feedingSessions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.feedingSessions[index] = { ...state.feedingSessions[index], ...action.payload.updates };
        }
      })
      .addCase(loadFeedingSessions.fulfilled, (state, action) => {
        state.feedingSessions = action.payload;
      });

    // Today Stats
    builder.addCase(loadTodayStats.fulfilled, (state, action) => {
      state.todayStats = action.payload;
    });
  },
});

export const { setCurrentBaby, clearError, updateLocalStats } = databaseSlice.actions;
export default databaseSlice.reducer;