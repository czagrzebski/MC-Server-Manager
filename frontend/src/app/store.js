import { configureStore } from "@reduxjs/toolkit"

import consoleReducer from './consoleSlice';
import minecraftServerSlice from "./minecraftServerSlice";

export default configureStore({
    reducer: {
        console: consoleReducer,
        minecraftServer: minecraftServerSlice
    }
})