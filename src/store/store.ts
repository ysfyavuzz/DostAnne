import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from './activitiesSlice';
import profileReducer from './profileSlice';
import databaseReducer from './databaseSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    profile: profileReducer,
    database: databaseReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for date serialization
        ignoredActions: ['database/createBabyProfile', 'database/createActivity'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export commonly used actions for convenience
export { 
  addActivity, 
  updateActivity, 
  deleteActivity,
  setActivities,
  clearActivities,
} from './activitiesSlice';

export {
  createBabyProfile,
  loadBabyProfiles,
  setCurrentBaby,
  createActivity,
  loadActivities,
} from './databaseSlice';

export {
  setProfile,
  updateProfile,
} from './profileSlice';

export {
  scheduleNotification,
  cancelNotification,
} from './notificationSlice';