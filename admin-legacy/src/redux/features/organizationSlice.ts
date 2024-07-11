import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../instance/axios';
import { OrganizationI } from '../../interfaces/organizationInterface';
import { toast } from 'react-toastify';

import { showLoadingImage } from './loaderSlice';

interface OrganizationInterfaceData {
  organizationGettingState: OrganizationI[];
  isLoading: boolean;
  error: string | null;
  getEditData: any;
  organizationTypesListing: any[];
}

const initialState: OrganizationInterfaceData = {
  organizationGettingState: [],
  isLoading: false,
  error: null,
  getEditData: {},
  organizationTypesListing: [],
};

export const getOrganization = createAsyncThunk('getorganizations', async (_, { dispatch }) => {
  try {
    dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'GET',
      url: 'api/organizations',
    });
    dispatch(showLoadingImage(false));
    return data ? data : [];
  } catch (err) {
    setTimeout(() => dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

export const deleteOrganizations = createAsyncThunk('deleteOrganization', async (id: any, thunkApi) => {
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'DELETE',
      url: `v1/webadmin/organizations/${id}`,
    });
    toast.success('Organization Delete Successfully');
    await thunkApi.dispatch(getOrganization());
    thunkApi.dispatch(showLoadingImage(false));
  } catch (err) {
    thunkApi.dispatch(showLoadingImage(false));
    return [];
  }
});


export const createOrganization = createAsyncThunk('createOrganization', async (organizationData: any, thunkApi) => {
  console.log('organizationData',organizationData)
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'POST',
      url: `api/organizations`,
      data: organizationData,
    });
    toast.success('Organization Create Successfully');
    thunkApi.dispatch(showLoadingImage(false));
    return data ? true : false;
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

export const getOrganizationById = createAsyncThunk('getOrganizationById', async (id: any, thunkApi) => {
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'GET',
      url: `api/organizations/${id}`,
    });
    thunkApi.dispatch(showLoadingImage(false));
    return data ? data : {};
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

export const editOrganization = createAsyncThunk('editOrganization', async (editData: any, thunkApi) => {
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'PATCH',
      url: `api/organizations/${editData?.id}`,
      data: editData,
    });
    toast.success('Edit Organization Successfully');
    thunkApi.dispatch(showLoadingImage(false));
    return data ? true : false;
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});


export const selectOrganizationType = createAsyncThunk('selectOrganizationType', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/organizations/business-partnerships`,
    })
    // const convertedData = data.pms_users.map((pmsUser:any) => ({
    //   id: pmsUser.id,
    //   name: `${pmsUser.User.first_name} ${' '} ${pmsUser.User.last_name}`
    // }));
    console.log('data',data)
    return Array.isArray(data) ? data : []
  } catch (err) {
    return []
  }
})

export const organizationLogoUploadOnServer = createAsyncThunk('organizationLogoUploadOnServer', async (imageType: any, thunkApi: any) => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/organizations/logo/presignedPutUrl?extension=${imageType.extension}`
    })
    return data
  } catch (err:any) {
    toast.error(err?.response ? err?.response?.data?.message : '');
    return []
  }
})

const organizationSlice = createSlice({
  name: 'Organization Reducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getOrganization.fulfilled, (state, action) => {
      state.organizationGettingState = action.payload;
    });
    builder.addCase(createOrganization.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createOrganization.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createOrganization.rejected, (state, action) => {
      state.isLoading = false;
      state.error = typeof action.payload === 'string' ? action.payload : null;
    });
    builder.addCase(getOrganizationById.fulfilled, (state, action) => {
      state.isLoading = true;
      state.getEditData = action.payload;
    });
    builder.addCase(editOrganization.fulfilled, (state) => {
      state.isLoading = true;
    });
    builder.addCase(selectOrganizationType.fulfilled, (state, action) => {
      state.organizationTypesListing = action.payload;
    });
  },
});

export default organizationSlice.reducer;
