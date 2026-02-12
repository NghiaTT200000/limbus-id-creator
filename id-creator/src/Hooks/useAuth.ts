import { useAppDispatch, useAppSelector } from "Stores/AppStore";
import { clearUserReducer, setUserReducer } from "Stores/Slices/AuthSlice";
import ILoginUser from "Types/ILoginUser";

export default function useAuth(){
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const setUser = (user: ILoginUser) => dispatch(setUserReducer(user));
    const clearUser = () => dispatch(clearUserReducer());
   return { user, setUser, clearUser };
}