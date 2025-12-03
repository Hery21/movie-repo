import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    term: "",
  },
  reducers: {
    setStoredSearchTerm: (state, action) => {
      state.term = action.payload;
    },
    clearSearchTerm: (state) => {
      state.term = "";
    },
  },
});

export const { setStoredSearchTerm, clearSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
