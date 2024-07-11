import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './features/usersSlice';
import roleSlice from './features/roleSlice';
import propertySlice from './features/propertySlice';
import authSlice from './features/authSlice';
import loadingReducer from './features/loaderSlice';
import organizationSlice from "./features/organizationSlice";
import areaSlice from "./features/areasSlice";
import masterBusinessModelSlice from "./features/masterBusinessModelSlice";

const rootReducer = {
  users: usersSlice,
  role: roleSlice,
  property: propertySlice,
  organization: organizationSlice,
  area: areaSlice,
  auth: authSlice,
  loader: loadingReducer,
  masterBusinessModels: masterBusinessModelSlice,
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
