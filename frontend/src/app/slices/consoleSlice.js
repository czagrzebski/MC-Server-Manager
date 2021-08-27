import { createSlice } from "@reduxjs/toolkit";

const consoleSlice = createSlice({
  name: "console",
  initialState: {
    logs: [],
  },
  reducers: {
    consoleLogAdded: {
      reducer(state, action) {
        action.payload.logs.forEach((log) => state.logs.push(log));
      },
      prepare(consoleLogBuffer) {
        return {
          payload: {
            logs: consoleLogBuffer.flat(),
          },
        };
      },
    },
    consoleCleared: {
      reducer(state, action) {
        state.logs = [];
      },
    },
  },
});

export default consoleSlice.reducer;

export const { consoleLogAdded, consoleCleared } = consoleSlice.actions;
