import { configureStore } from "@reduxjs/toolkit";

import consoleReducer from "./slices/consoleSlice";
import minecraftServerSlice from "./slices/minecraftServerSlice";

export default configureStore({
  reducer: {
    console: consoleReducer,
    minecraftServer: minecraftServerSlice,
  },
});
