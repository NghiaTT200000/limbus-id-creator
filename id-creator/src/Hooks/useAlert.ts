import { useAppDispatch, useAppSelector } from "Stores/AppStore";
import { add } from "Stores/Slices/AlertSlice";

export default function useAlert() {
   const dispatch = useAppDispatch();
   const alertArr = useAppSelector(state => state.alert.value);
   const addAlert = (payload: {status: string, msg: string}) => dispatch(add({payload}));
   return { alertArr, addAlert };
}