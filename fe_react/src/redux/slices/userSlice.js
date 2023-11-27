import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
};

const userReducer = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = userReducer.actions;
export default userReducer.reducer;
