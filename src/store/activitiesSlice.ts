import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Activity {
  id: string;
  babyId: string;
  type: 'feeding' | 'sleep' | 'health' | 'milestone' | 'diaper' | 'medication';
  actor: 'baby' | 'parent';
  startTime: string;
  endTime?: string;
  duration?: number;
  quantity?: number;
  unit?: string;
  notes?: string;
  temperature?: number;
  mood?: string;
  location?: string;
  createdAt: string;
}

interface ActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  currentActivity?: Activity;
  baby?: {
    id: string;
    name: string;
    birthDate: string;
    ageInMonths: number;
  } | null;
}

const initialState: ActivitiesState = {
  activities: [],
  loading: false,
  error: null,
  baby: null,
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.push(action.payload);
    },
    updateActivity: (state, action: PayloadAction<Activity>) => {
      const index = state.activities.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.activities[index] = action.payload;
      }
    },
    deleteActivity: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter(a => a.id !== action.payload);
    },
    setActivities: (state, action: PayloadAction<Activity[]>) => {
      state.activities = action.payload;
    },
    setCurrentActivity: (state, action: PayloadAction<Activity | undefined>) => {
      state.currentActivity = action.payload;
    },
    clearActivities: (state) => {
      state.activities = [];
    },
    setBaby: (state, action: PayloadAction<ActivitiesState['baby']>) => {
      state.baby = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  addActivity,
  updateActivity,
  deleteActivity,
  setActivities,
  setCurrentActivity,
  clearActivities,
  setBaby,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;

// Selectors
export const selectActivities = (state: { activities: ActivitiesState }) => state.activities.activities;
export const selectLoading = (state: { activities: ActivitiesState }) => state.activities.loading;
export const selectError = (state: { activities: ActivitiesState }) => state.activities.error;
export const selectCurrentActivity = (state: { activities: ActivitiesState }) => state.activities.currentActivity;

// Async thunks için
export const loadActivitiesForBaby = (babyId: string) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      // Burada veritabanı işlemleri yapılacak
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error as string));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const saveActivity = (activity: Activity) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      // Burada veritabanı kayıt işlemi yapılacak
      dispatch(addActivity(activity));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error as string));
    } finally {
      dispatch(setLoading(false));
    }
  };
};