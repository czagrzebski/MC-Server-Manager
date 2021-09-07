import { createSlice } from "@reduxjs/toolkit";

const minecraftServerSlice = createSlice({
  name: "minecraftServer",
  initialState: {
    status: "SERVER_STOPPED",
  },
  reducers: {
    setServerStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export default minecraftServerSlice.reducer;

export const { setServerStatus } = minecraftServerSlice.actions;
