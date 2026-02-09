import { createSlice } from '@reduxjs/toolkit'
import { Alert, IAlert } from 'Types/Utils/IAlert'

const initialState : {value: IAlert[]} = {value: []}; 

const AlertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        add: (state, actionPaylod)=>{
            const {status, msg} = actionPaylod.payload;
            const newAlert = new Alert(status,msg)
            state.value.push(newAlert);
            
            
            setTimeout(() => {
                state.value.filter(alert=>alert.alertId!==newAlert.alertId)
            }, 4000);
        }
    }
})

export const { add } = AlertSlice.actions;
export const AlertReducer = AlertSlice.reducer;