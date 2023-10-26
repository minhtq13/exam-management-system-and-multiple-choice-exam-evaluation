import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCollapse: false,
  selectedItem: null,
  chapters: [],
  questionItem: null
};

const appReducer = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsCollapse: (state, action) => {
      state.isCollapse = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setChapters: (state, action) => {
      state.chapters = action.payload;
    },
    setQuestionItem: (state, action) => {
      state.questionItem = action.payload
    }
  },
});

export const { setIsCollapse, setSelectedItem, setChapters, setQuestionItem } = appReducer.actions;
export default appReducer.reducer;
