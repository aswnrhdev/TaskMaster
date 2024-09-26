import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slice/userSlice"


const store = configureStore({
    reducer:{
        userInfo:userSlice,
    }
})

export default store;