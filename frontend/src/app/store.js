import { configureStore } from "@reduxjs/toolkit"

import consoleReducer from '../pages/Console/consoleSlice';

export default configureStore({
    reducer: {
        console: consoleReducer
    }
})