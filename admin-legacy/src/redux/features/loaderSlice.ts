import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit';

interface LoadingState {
  loader: boolean;
}

const initialState: LoadingState = {
  loader: false,
};

const loadingSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoadingImage: (state, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
  },
});

export const { showLoadingImage } = loadingSlice.actions;

const loadingReducer = loadingSlice.reducer;
export default loadingReducer;
