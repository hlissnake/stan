import { configureStore } from '@reduxjs/toolkit';
import programsReducer from './slices/programsSlice';

export const store = configureStore({
  reducer: {
    programs: programsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 