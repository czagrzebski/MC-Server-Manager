import { configureStore } from "@reduxjs/toolkit";

import consoleReducer from "./slices/consoleSlice";
import minecraftServerSlice from "./slices/minecraftServerSlice";
import userSlice from "./slices/userSlice";

export default configureStore({
  reducer: {
    console: consoleReducer,
    minecraftServer: minecraftServerSlice,
    user: userSlice,
  },
});
