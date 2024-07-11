import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../instance/axios';
import { AreaI } from '../../interfaces/areaInterface';
import { toast } from 'react-toastify';

import { showLoadingImage } from './loaderSlice';

interface AreaInterfaceData {
  masterBusinessModelsGettingState: AreaI[];
  isLoading: boolean;
  error: string | null;
  getEditData: any;
}

const initialState: AreaInterfaceData = {
  masterBusinessModelsGettingState: [],
  isLoading: false,
  error: null,
  getEditData: {},
};
``
export const getMasterBusinessModels = createAsyncThunk('getMasterBusinessModels', async (_, { dispatch }) => {
  try {
    dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'GET',
      url: 'api/master-business-models',
    });
    dispatch(showLoadingImage(false));
    console.log('business model data', data);
    return data ? data : [];
  } catch (err) {
    setTimeout(() => dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});


export const createMasterBusinessModel = createAsyncThunk('createMasterBusinessModel', async (masterBusinessModelData: any, thunkApi) => {
  console.log('createMasterBusinessModel',masterBusinessModelData)
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'POST',
      url: `api/areas`,
      data: masterBusinessModelData,
    });
    toast.success('MasterBusinessModel Create Successfully');
    thunkApi.dispatch(showLoadingImage(false));
    return data ? true : false;
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

const masterBusinessModelSlice = createSlice({
  name: 'Organization Reducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getMasterBusinessModels.fulfilled, (state, action) => {
      state.masterBusinessModelsGettingState = action.payload;
    });
    builder.addCase(createMasterBusinessModel.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createMasterBusinessModel.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createMasterBusinessModel.rejected, (state, action) => {
      state.isLoading = false;
      state.error = typeof action.payload === 'string' ? action.payload : null;
    });
  },
});

export default masterBusinessModelSlice.reducer;
