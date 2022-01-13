import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        username: null,
        id: null,
        accessToken: null,
        isLoading: true
    },
    reducers: {
        setToken(state, action){
            state.accessToken = action.payload;
        },

        setCurrentUser(state, action) {
            state.username = action.payload.username;
            state.id = action.payload.id;
        },

        setLoading(state, action){
            console.log(action)
            state.isLoading = action.payload;
        }
    }
});

export default userSlice.reducer;
export const { setToken, setCurrentUser, setLoading } = userSlice.actions;

