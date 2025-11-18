import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  gender: 'male' | 'female';
  birthWeight?: number;
  birthHeight?: number;
  bloodType?: string;
  photo?: string;
  allergies?: string[];
  medications?: string[];
  healthNotes?: string;
  createdAt: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: 'mother' | 'father' | 'guardian';
  babyIds: string[];
}

export interface Settings {
  theme: 'light' | 'dark' | 'automatic';
  language: 'tr' | 'en';
  notifications: {
    feeding: boolean;
    sleeping: boolean;
    health: boolean;
    milestones: boolean;
  };
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'inches';
    temperature: 'celsius' | 'fahrenheit';
  };
}

interface ProfileState {
  currentBaby: Baby | null;
  babies: Baby[];
  currentParent: Parent | null;
  parents: Parent[];
  settings: Settings;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentBaby: null,
  babies: [],
  currentParent: null,
  parents: [],
  settings: {
    theme: 'light',
    language: 'tr',
    notifications: {
      feeding: true,
      sleeping: true,
      health: true,
      milestones: true,
    },
    units: {
      weight: 'kg',
      height: 'cm',
      temperature: 'celsius',
    },
  },
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentBaby: (state, action: PayloadAction<Baby | null>) => {
      state.currentBaby = action.payload;
    },
    addBaby: (state, action: PayloadAction<Baby>) => {
      state.babies.push(action.payload);
      if (!state.currentBaby) {
        state.currentBaby = action.payload;
      }
    },
    updateBaby: (state, action: PayloadAction<Baby>) => {
      const index = state.babies.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.babies[index] = action.payload;
        if (state.currentBaby?.id === action.payload.id) {
          state.currentBaby = action.payload;
        }
      }
    },
    deleteBaby: (state, action: PayloadAction<string>) => {
      state.babies = state.babies.filter(b => b.id !== action.payload);
      if (state.currentBaby?.id === action.payload) {
        state.currentBaby = state.babies[0] || null;
      }
    },
    setBabies: (state, action: PayloadAction<Baby[]>) => {
      state.babies = action.payload;
    },
    setCurrentParent: (state, action: PayloadAction<Parent | null>) => {
      state.currentParent = action.payload;
    },
    addParent: (state, action: PayloadAction<Parent>) => {
      state.parents.push(action.payload);
      if (!state.currentParent) {
        state.currentParent = action.payload;
      }
    },
    updateParent: (state, action: PayloadAction<Parent>) => {
      const index = state.parents.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.parents[index] = action.payload;
        if (state.currentParent?.id === action.payload.id) {
          state.currentParent = action.payload;
        }
      }
    },
    setParents: (state, action: PayloadAction<Parent[]>) => {
      state.parents = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    },
    toggleNotification: (state, action: PayloadAction<keyof Settings['notifications']>) => {
      state.settings.notifications[action.payload] = !state.settings.notifications[action.payload];
    },
    updateUnits: (state, action: PayloadAction<Partial<Settings['units']>>) => {
      state.settings.units = { ...state.settings.units, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentBaby,
  addBaby,
  updateBaby,
  deleteBaby,
  setBabies,
  setCurrentParent,
  addParent,
  updateParent,
  setParents,
  updateSettings,
  setSettings,
  toggleNotification,
  updateUnits,
} = profileSlice.actions;

export default profileSlice.reducer;

// Selectors
export const selectCurrentBaby = (state: { profile: ProfileState }) => state.profile.currentBaby;
export const selectBabies = (state: { profile: ProfileState }) => state.profile.babies;
export const selectCurrentParent = (state: { profile: ProfileState }) => state.profile.currentParent;
export const selectParents = (state: { profile: ProfileState }) => state.profile.parents;
export const selectSettings = (state: { profile: ProfileState }) => state.profile.settings;
export const selectLoading = (state: { profile: ProfileState }) => state.profile.loading;
export const selectError = (state: { profile: ProfileState }) => state.profile.error;

// Async thunks
export const loadBabies = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      // Veritabanından bebekleri yükle
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error as string));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const saveBaby = (baby: Baby) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      // Veritabanına bebek kaydet
      dispatch(addBaby(baby));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error as string));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateBabyProfile = (baby: Baby) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      // Veritabanında bebek güncelle
      dispatch(updateBaby(baby));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error as string));
    } finally {
      dispatch(setLoading(false));
    }
  };
};