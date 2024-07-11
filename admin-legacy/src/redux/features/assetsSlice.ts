import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../instance/axios';
import { toast } from 'react-toastify';

import { showLoadingImage } from './loaderSlice';

interface AssetInterfaceData {
  isLoading: boolean;
  error: string | null;
  propertyList: any[];
}

const initialState: AssetInterfaceData = {
  isLoading: false,
  error: null,
  propertyList: [],
};

export const uploadAssetsList = createAsyncThunk('uploadAssetsList', async (assetData: any, thunkApi) => {
  console.log('assetData',assetData)
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'POST',
      url: `api/assets/upload`,
      data: assetData,
    });
    toast.success('File Uploaded Successfully');
    thunkApi.dispatch(showLoadingImage(false));
    return data ? true : false;
  } catch (err:any) {
    console.log('err', err);
    toast.error(err?.response?.data?.message ? err?.response?.data?.message : '');
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

const assetSlice = createSlice({
  name: 'Assets Reducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(uploadAssetsList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(uploadAssetsList.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(uploadAssetsList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = typeof action.payload === 'string' ? action.payload : null;
    });
  },
});

export default assetSlice.reducer;
