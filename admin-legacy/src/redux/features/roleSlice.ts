import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../instance/axios';
import { RoleI } from '../../interfaces/roleInterface';
import { toast } from 'react-toastify';

import { showLoadingImage } from './loaderSlice';

interface RoleInterfaceData {
  roleGettingState: RoleI[];
  isLoading: boolean;
  error: string | null;
  getEditData: any;
  typesListing: any[];
}

const initialState: RoleInterfaceData = {
  roleGettingState: [],
  isLoading: false,
  error: null,
  getEditData: {},
  typesListing: [],
};

export const getRole = createAsyncThunk('getroles', async (_, { dispatch }) => {
  try {
    dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'GET',
      url: 'api/roles',
    });
    dispatch(showLoadingImage(false));
    return data ? data.roles : [];
  } catch (err) {
    setTimeout(() => dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

export const deleteRoles = createAsyncThunk('deleteRole', async (id: any, thunkApi) => {
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'DELETE',
      url: `v1/webadmin/roles/${id}`,
    });
    toast.success('Role Delete Successfully');
    await thunkApi.dispatch(getRole());
    thunkApi.dispatch(showLoadingImage(false));
  } catch (err) {
    thunkApi.dispatch(showLoadingImage(false));
    return [];
  }
});


export const createRole = createAsyncThunk('createRole', async (roleData: any, thunkApi) => {
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'POST',
      url: `api/roles`,
      data: roleData,
    });
    toast.success('Role Create Successfully');
    thunkApi.dispatch(showLoadingImage(false));
    return data ? true : false;
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

export const getRoleById = createAsyncThunk('getRoleById', async (id: any, thunkApi) => {
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'GET',
      url: `api/roles/${id}`,
    });
    thunkApi.dispatch(showLoadingImage(false));
    return data ? data : {};
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

export const editRole = createAsyncThunk('editRole', async (editData: any, thunkApi) => {
  try {
    thunkApi.dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'PATCH',
      url: `api/roles/${editData?.id}`,
      data: editData,
    });
    toast.success('Edit Role Successfully');
    thunkApi.dispatch(showLoadingImage(false));
    return data ? true : false;
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    setTimeout(() => thunkApi.dispatch(showLoadingImage(false)), 7000);
    return [];
  }
});

export const getTypes = createAsyncThunk('getTypes', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(showLoadingImage(true));
    const { data } = await instance({
      method: 'GET',
      url: 'api/roles/types',
    });
    dispatch(showLoadingImage(false));

    const modifiedData = data.map((item:any) => ({
      id: item.value,
      name: item.value,
    }));

    return modifiedData ? modifiedData : [];
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    setTimeout(() => dispatch(showLoadingImage(false)), 7000);
    return rejectWithValue([]);
  }
});

const roleSlice = createSlice({
  name: 'Role Reducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getRole.fulfilled, (state, action) => {
      state.roleGettingState = action.payload;
    });
    builder.addCase(createRole.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createRole.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createRole.rejected, (state, action) => {
      state.isLoading = false;
      state.error = typeof action.payload === 'string' ? action.payload : null;
    });
    builder.addCase(getRoleById.fulfilled, (state, action) => {
      state.isLoading = true;
      state.getEditData = action.payload;
    });
    builder.addCase(editRole.fulfilled, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTypes.fulfilled, (state, action) => {
      state.typesListing = action.payload;
    });
    builder.addCase(getTypes.rejected, (state, action) => {
      state.error = typeof action.payload === 'string' ? action.payload : null;
    });
  },
});

export default roleSlice.reducer;
