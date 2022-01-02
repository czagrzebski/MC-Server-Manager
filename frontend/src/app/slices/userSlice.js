import { createSlice } from "@reduxjs/toolkit";
import jwt from "jwt-decode";

const userSlice = createSlice({
    name: "user",
    initialState: {
        username: null,
        id: null,
        accessToken: "",
        isLoading: true
    },
    reducers: {
        setToken(state, action){
            state.accessToken = action.payload;
            state.username = jwt(action.payload).username;
        },

        setCurrentUser(state, action) {
            state.username = action.payload.user.username;
            state.id = action.payload.user.id;
        }
    }
});

export default userSlice.reducer;
export const { setToken } = userSlice.actions;

