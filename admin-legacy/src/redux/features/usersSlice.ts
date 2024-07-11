import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../../instance/axios'
import { UserI } from '../../interfaces/userInterface'
import { toast } from 'react-toastify'

interface userInterfaceData {
  userState: UserI
  isLoading: boolean
  error: string
}

const initialState = { userState: [], isLoading: false, error: '' } as unknown as userInterfaceData[]

export const getUsers = createAsyncThunk('getusers', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: 'api/pms_users',
    })
    return data ? data.pms_users : []
  } catch (err:any) {
    toast.error(err?.response ? err?.response?.data?.message : '');    
    return []
  }
})

export const createUser = createAsyncThunk('createUser', async (userData: any, thunkApi: any) => {
  try {
    const { data } = await instance({
      method: 'POST',
      url: `api/users`,
      data: userData,
    })
    if (data && data.data && data.data.insert_users_one) {
      const id = data.data.insert_users_one.id
      sessionStorage.setItem('userId', id)
      toast.success('User Create Successfully')
      return data ? true : false
    }
    return data ? true : false
  } catch (err:any) {
    toast.error(err?.response ? err?.response?.data?.message : '');
    return []
  }
})

export const createUserByRole = createAsyncThunk('createUserByRole', async (userData: any, thunkApi: any) => {
  const { userId, role_id, ...data } = userData
  try {
    const response = await instance({
      method: 'PATCH',
      url: `api/pms_users/${userId}`,
      data: { role_id, ...data },
    })
    const { data: responseData } = response
    toast.success('Role Updated Successfully')
    return responseData ? true : false
  } catch (err:any) {
    toast.error(err?.response ? err?.response?.data?.message : '');
    return []
  }
})

export const deleteUser = createAsyncThunk('deleteUser', async (id: any, thunkApi: any) => {
  try {
    const { data } = await instance({
      method: 'DELETE',
      url: `api/pms_users/${id}`,
    })
    toast.success('User Delete Successfully')
    await thunkApi.dispatch(getUsers())
  } catch (err:any) {
    toast.error(err?.response ? err?.response?.data?.message : '');    
    return []
  }
})

export const getUsersById = createAsyncThunk('getUserById', async (id: any, thunkApi: any) => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/pms_users/${id}`,
    })
    return data ? data : {}
  } catch (err:any) {
    toast.error(err?.response ? err?.response?.data?.message : '');    
    return []
  }
})

export const editUser = createAsyncThunk('editUser', async (editData: any, thunkApi: any) => {
  try {
    const { data } = await instance({
      method: 'PATCH',
      url: `api/users/${editData?.id}`,
      data: editData,
    })
    toast.success('User Updated Successfully')
    return data ? true : false
  } catch (err:any) {
    toast.error(err?.response ? err?.response?.data?.message : '');    
    return []
  }
})

export const profileUploadOnServer = createAsyncThunk('profileUploadOnServer', async (imageType: any, thunkApi: any) => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/pms_users/profile_photo/presignedPutUrl?extension=${imageType.extension}`
    })
    return data 
  } catch (err:any) {
    toast.error(err?.response ? err?.response?.data?.message : '');    
    return []
  }
})

const usersSlice = createSlice({
  name: 'User Reducer',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getUsers.fulfilled, (state: any, action: any) => {
      // Add user to the state array
      state.userState = action.payload
    }),
      builder.addCase(createUser.pending, (state: any, action: any) => {
        state.isLoading = false
      }),
      builder.addCase(createUser.fulfilled, (state: any, action: any) => {
        state.isLoading = true
      }),
      builder.addCase(createUser.rejected, (state: any, action: any) => {
        ;(state.isLoading = false), (state.error = action.payload)
      })
  },
})

export default usersSlice.reducer
