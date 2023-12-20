import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refreshTableImage: null,
};

const refreshReducer = createSlice({
  name: "refreshReducer",
  initialState,
  reducers: {
    setRefreshTableImage: (state, action) => {
      state.refreshTableImage = action.payload;
    },
  },
});

export const { setRefreshRemoveFilm, setRefreshTableImage } = refreshReducer.actions;
export default refreshReducer.reducer;
