import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../instance/axios';
import { AreaI } from '../../interfaces/areaInterface';
import { toast } from 'react-toastify';

import { showLoadingImage } from './loaderSlice';

interface AreaInterfaceData {
  areasGettingState: AreaI[];
  isLoading: boolean;
  error: string | null;
  getEditData: any;
  organizationTypesListing: any[];
}

const initialState: AreaInterfaceData = {
  areasGettingState: [],
  isLoading: false,
  error: null,
  getEditData: {},
  organizationTypesListing: [],
};
``
export const getAreas = createAsyncThunk('getAreas', async (_, { dispatch }) => {
  try {
    dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'GET',
      url: 'api/areas',
    });
    dispatch(showLoadingImage(false));
    console.log('area data', data);
    return data ? data : [];
  } catch (err) {
    setTimeout(() => dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

export const deleteArea = createAsyncThunk('deleteArea', async (id: any, thunkApi) => {
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'DELETE',
      url: `api/areas/${id}`,
    });
    toast.success('Area Delete Successfully');
    await thunkApi.dispatch(getAreas());
    thunkApi.dispatch(showLoadingImage(false));
  } catch (err) {
    thunkApi.dispatch(showLoadingImage(false));
    return [];
  }
});


export const createArea = createAsyncThunk('createArea', async (areaData: any, thunkApi) => {
  console.log('areaData',areaData)
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'POST',
      url: `api/areas`,
      data: areaData,
    });
    toast.success('Area Create Successfully');
    thunkApi.dispatch(showLoadingImage(false));
    return data ? true : false;
  } catch (err:any) {
    toast.error(err?.response?.data?.message ? err?.response?.data?.message : err?.message);
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

const areaSlice = createSlice({
  name: 'Organization Reducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getAreas.fulfilled, (state, action) => {
      state.areasGettingState = action.payload;
    });
    builder.addCase(createArea.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createArea.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createArea.rejected, (state, action) => {
      state.isLoading = false;
      state.error = typeof action.payload === 'string' ? action.payload : null;
    });
  },
});

export default areaSlice.reducer;
