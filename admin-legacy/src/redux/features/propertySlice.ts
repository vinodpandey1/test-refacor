import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {instance} from '../../instance/axios'
import {PropertyI} from '../../interfaces/propertyInterface'
import {toast} from 'react-toastify'

interface PropertyInterfaceData {
  propertyGettingState: PropertyI
  isModalOpen: boolean
  propertyId: any
  modalCloseData: boolean
}

const initialState = {
  propertyGettingState: [],
  getAmenetiesState: [],
  getRoomTypeState: [],
  getOffersState: [],
  isLoading: false,
  error: '',
  isModalOpen: false,
  propertyId: 0,
  lifecycleStage: [],
  primaryOwner:[],
  accountManager:[],
  getChannelList:[],
  propertyAddressAreaList:[],
  businessModelList: [],
  organizationModelList: [],
} as unknown as PropertyInterfaceData[]

export const getProperty = createAsyncThunk('getProperty', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: 'api/properties?limit=100',
    })
    return data ? data.properties : []
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
})

export const deleteProperty = createAsyncThunk('deleteProperty', async (id: any, thunkApi) => {
  try {
    const { data } = await instance({
      method: 'DELETE',
      url: `v1/webadmin/propertys/${id}`,
    })
    toast.success('Property Delete Successfully')
    await thunkApi.dispatch(getProperty())
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
})

export const getAmeneties = createAsyncThunk('getAmeneties', async (id: any, thunkApi) => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `v1/webadmin/propertys/ameneties`,
    })
    return data ? data : []
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
})

export const getRoomType = createAsyncThunk('getRoomType', async (id: any, thunkApi) => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `v1/webadmin/propertys/roomtypes`,
    })
    return data ? data : []
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
})

export const getOffers = createAsyncThunk('offers', async (id: any, thunkApi) => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `v1/webadmin/propertys/offers`,
    })
    return data ? data : []
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
})

export const createProperty = createAsyncThunk('createProperty', async (propertyData: any, { dispatch }) => {
  try {
    const { data } = await instance({
      method: 'POST',
      url: 'api/properties',
      data: propertyData,
    });

    if (data && data.data && data.data.insert_properties_one) {
      const id = data.data.insert_properties_one.id;
      localStorage.setItem('propertyId',id)
      // if (id) {
      //   const addressData = {
      //     city,
      //     area,
      //     pincode,
      //     id,
      //   };

      //   await dispatch(addAddress(addressData));
      // }
      toast.success('Property Create Successfully');
      return data ? true : false
    }
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
});

export const addAddress = createAsyncThunk('addAddress', async (addressData: any) => {
  try {
    const { id, ...newAddressData } = addressData;
    const { data } = await instance({
      method: 'POST',
      url: `api/properties/${id}/addresses`,
      data: newAddressData,
    });

    toast.success('Address Create Successfully');
    return data ? true : false;
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
});

export const addJotformPropertyMapping = createAsyncThunk('addJotformPropertyMapping', async (jotformPropertyMappingData: any) => {
  try {
    console.log('jotformPropertyMappingData', jotformPropertyMappingData);
    const { data } = await instance({
      method: 'POST',
      url: `api/property-forms-mapping`,
      data: jotformPropertyMappingData,
    });

    toast.success('Mapping Create Successfully');
    return data ? true : false;
  } catch (err:any) {
    toast.error(err?.message ? err.message : '');

    return [];
  }
});

export const getPropertiesId = createAsyncThunk('getPropertiesId', async (id: any, thunkApi) => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/properties/${id}`,
    });

    const property = data?.properties?.[0];

    if (property) {
      const keyAccountManager = property.KeyAccountManager?.User;
      const primaryOwner = property.PrimaryOwner?.User;
      const lifecycleStageName = property.LifecycleStage?.name;
      const propertyBusinessModel = property.PropertyBusinessModel;
      const businessModel = propertyBusinessModel?.MasterBusinessModel?.payout_percentage
      const organizationModel = propertyBusinessModel?.organization_id
      if(businessModel) {
        property.PropertyBusinessModelId = propertyBusinessModel?.MasterBusinessModel?.id
        property.PropertyBusinessModel = businessModel + ' %'
      }
      else {
        property.PropertyBusinessModel = ""
      }
      if(organizationModel) {
        property.organizationModel = organizationModel
        property.OrganizationModelName = propertyBusinessModel?.BusinessModelOrganization?.name
        // property.OrganizationModel = propertyBusinessModel?.BusinessModelOrganization?.registered_name
        console.log('zzzzz' ,propertyBusinessModel?.BusinessModelOrganization)
        console.log('zzzzz111' ,propertyBusinessModel)

      }
      else {
        property.organizationModel = ""
        property.organizationModelName = ""
      }
      property.keyAccountManager_full_name = `${keyAccountManager?.first_name || ''} ${keyAccountManager?.last_name || ''}`;
      property.primaryOwner_full_name = `${primaryOwner?.first_name || ''} ${primaryOwner?.last_name || ''}`;
      property.lifecycleStageName = lifecycleStageName || '';
    }

    return data || {};
  } catch (err: any) {
    toast.error(err?.message || '');
    return [];
  }
});

export const editProperties = createAsyncThunk('editProperties', async (editData: any, thunkApi) => {
  const { id, ...dataWithoutId } = editData // Destructure the id property from editData

  try {
    const { data } = await instance({
      method: 'PATCH',
      url: `api/properties/${id}`, // Use the id property here if needed
      data: dataWithoutId, // Use the modified data without the id property
    })
    toast.success('Property Update Successfully');
    return data ? data : {}
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
})

export const searchPropertyByNameandOwner = createAsyncThunk(
    'searchPropertyByName',
    async ({ propertyName, ownerName }: { propertyName: string; ownerName: string }, thunkApi) => {
      console.log('propertyName', propertyName);
      console.log('ownerName', ownerName);

      try {
        const { data } = await instance({
          method: 'GET',
          url: `api/properties?limit=100&propertyNameSearchText=${propertyName}&ownerNameSearchText=${ownerName}`,
        });

        return Array.isArray(data?.properties) ? data?.properties : []; // Check if data is an array, otherwise return an empty array
      } catch (err : any) {
        toast.error(err?.message ? err.message : '');
        return [];
      }
    }
);



export const searchProperty = createAsyncThunk(
  'property/search',
  async ({ propertyValue, ownerValue }: { propertyValue: string; ownerValue: string }, { dispatch }) => {
    // Dispatch the appropriate actions based on the propertyValue and ownerValue values
    if (propertyValue || ownerValue) {
      const response = await dispatch(searchPropertyByNameandOwner({ propertyName: `${propertyValue}`, ownerName: `${ownerValue}` }));

      return response.payload
    }
    // Return a default value if neither propertyValue nor ownerValue is provided
    return null
  }
)

export const detailsModalOpen = createAsyncThunk(
  'details/Modal',
  async ({ propertyValue, ownerValue }: { propertyValue: string; ownerValue: string }, { dispatch }) => {
    // Dispatch the appropriate actions based on the propertyValue and ownerValue values
    if (propertyValue || ownerValue) {
      const response = await dispatch(searchPropertyByNameandOwner({ propertyName: `${propertyValue}`, ownerName: `${ownerValue}` }));
      return response.payload
    }
    // Return a default value if neither propertyValue nor ownerValue is provided
    return null
  }
)

export const propertyUpload = createAsyncThunk('propertyUpload', async (propertyUploadData: any, thunkApi) => {
  try {
    const { data } = await instance({
      method: 'POST',
      url: 'v1/webadmin/propertys/upload',
      data: propertyUploadData,
    })
    toast.success('Property Image Upload Successfully')
    return data ? true : false
  } catch (err) {
    return []
  }
})

export const lifecycleStages = createAsyncThunk('lifecycleStages', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/properties/lifecycleStages`,
    })
    return Array.isArray(data) ? data : []
  } catch (err) {
    return []
  }
})

export const selectPrimaryOwner = createAsyncThunk('selectPrimaryOwner', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/roles/${'PROPERTY_OWNER'}/pms_users`,
    })
    const convertedData = data.pms_users.map((pmsUser:any) => ({
      id: pmsUser.id,
      name: `${pmsUser.User.first_name} ${' '} ${pmsUser.User.last_name}`
    }));
    return Array.isArray(convertedData) ? convertedData : []
  } catch (err) {
    return []
  }
})

export const keyAccountManager = createAsyncThunk('keyAccountManager', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/roles/${'KEY_ACCOUNT_MANAGER'}/pms_users`,
    })
    const convertedData = data.pms_users.map((user:any) => ({
      id: user.id,
      name: `${user.User.first_name} ${' '} ${user.User.last_name}`
    }));
    return Array.isArray(convertedData) ? convertedData : []
  } catch (err) {
    return []
  }
})

export const getChannelList = createAsyncThunk('getChannelList', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: 'api/channels',
    })
    return data ? data.channels : []
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
})

export const addChannel = createAsyncThunk('addChannel', async (travellAgentData: any, thunkApi) => {
  const { id, ...requestData } = travellAgentData;
  try {
    const { data } = await instance({
      method: 'POST',
      url: `api/properties/${id}/channels/multiple`,
      data: requestData,
    });
    toast.success('Channel saved successfully');
    return data ? true : false;
  } catch (err) {
    return [];
  }
});

export const getPropertyAddressArea = createAsyncThunk('getPropertyAddressArea', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: 'api/properties/addresses/areas',
    })
    return data ? data?.areas : []
  } catch (err : any) {
    toast.error(err?.message ? err.message : '');
    return [];
  }
})

export const businessModels = createAsyncThunk('businessModels', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/properties/businessModels`,
    })
    console.log(data)
    return data?data:[]
    // return Array.isArray(convertedData) ? convertedData : []
  } catch (err) {
    return []
  }
})

export const organizationModels = createAsyncThunk('organizationModels', async () => {
  try {
    const { data } = await instance({
      method: 'GET',
      url: `api/organizations`,
    })
    console.log('aaaa' ,data)
    return data?data:[]
    // return Array.isArray(convertedData) ? convertedData : []
  } catch (err) {
    return []
  }
})


const propertySlice = createSlice({
  name: 'Property Reducer',
  initialState,
  reducers: {
    openModal: (state, id) => {
      state.isModalOpen = true
      state.propertyId = id.payload
    },
    closeModal: (state) => {
      state.isModalOpen = false
    },
  },
  extraReducers: (builder:any) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getProperty.fulfilled, (state:any, action:any) => {
      // Add user to the state array
      state.propertyGettingState = action.payload
    }),
      builder.addCase(getAmeneties.fulfilled, (state:any, action:any) => {
        // Add user to the state array
        state.getAmenetiesState = action.payload
      }),
      builder.addCase(getRoomType.fulfilled, (state:any, action:any) => {
        // Add user to the state array
        state.getRoomTypeState = action.payload
      }),
      builder.addCase(getOffers.fulfilled, (state:any, action:any) => {
        // Add user to the state array
        state.getOffersState = action.payload
      }),
      builder.addCase(createProperty.pending, (state:any, action:any) => {
        state.isLoading = false
      }),
      builder.addCase(createProperty.fulfilled, (state:any, action:any) => {
        state.isLoading = true
      }),
      builder.addCase(createProperty.rejected, (state:any, action:any) => {
        ;(state.isLoading = false), (state.error = action.payload)
      }),
      builder.addCase(editProperties.fulfilled, (state:any, action:any) => {
        state.isLoading = true
      }),
      builder.addCase(searchProperty.fulfilled, (state:any, action:any) => {
        state.propertyGettingState = action.payload
      }),
      builder.addCase(lifecycleStages.fulfilled, (state:any, action:any) => {
        state.lifecycleStage = action.payload
      }),
      builder.addCase(selectPrimaryOwner.fulfilled, (state:any, action:any) => {
        state.primaryOwner = action.payload
      }),
      builder.addCase(keyAccountManager.fulfilled, (state:any, action:any) => {
        state.accountManager = action.payload
      }),
      builder.addCase(getChannelList.fulfilled, (state:any, action:any) => {
        state.getChannelList = action.payload
      }),
      builder.addCase(getPropertyAddressArea.fulfilled, (state:any, action:any) => {
        state.propertyAddressAreaList = action.payload
      }),
        builder.addCase(businessModels.fulfilled, (state:any, action:any) => {
          // Add user to the state array
          state.businessModelList = action.payload
        })
    builder.addCase(organizationModels.fulfilled, (state:any, action:any) => {
      // Add user to the state array
      state.organizationModelList = action.payload
    })
  },
})
export const { openModal, closeModal } = propertySlice.actions
export default propertySlice.reducer
