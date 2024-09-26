import { createSlice } from "@reduxjs/toolkit";

const userInfo = localStorage.getItem('userInfo');

const initialState = {
    userInfo: userInfo ? JSON.parse(userInfo) : null
};

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        removeUserInfo:(state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo')
        }
    }
});

export const { setUserInfo,removeUserInfo } = userSlice.actions;

export default userSlice.reducer;