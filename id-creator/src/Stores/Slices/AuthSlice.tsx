import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ILoginUser from "Types/ILoginUser";


const initialState : {user: ILoginUser | undefined} = {user: undefined};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserReducer: (state, action: PayloadAction<ILoginUser>)=>{
            state.user = action.payload;
        },
        clearUserReducer: () => {
            initialState.user = undefined;
        }
    }
})

export const { setUserReducer, clearUserReducer } = AuthSlice.actions;
export const AuthReducer = AuthSlice.reducer;