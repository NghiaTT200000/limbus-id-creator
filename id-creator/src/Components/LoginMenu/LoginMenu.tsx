import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import React from "react";
import "./LoginMenu.css"
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "Assets/Icons/GoogleIcon";
import PopUpMenu from "../PopUpMenu/PopUpMenu";
import useAlert from "Hooks/useAlert";
import { useRegisterMutation } from "Api/AuthApi";

interface LoginMenuContextProps{
    setIsLoginMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const loginMenuContext = createContext<LoginMenuContextProps>({
    setIsLoginMenuActive: ()=>{},
});

function LoginMenu({children}:{children:ReactNode}){
    const [isLoginMenuActive,setIsLoginMenuActive] = useState(false)
    const [user,setUser] = useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>()
    const {addAlert} = useAlert();
    const [ register, {isLoading} ] = useRegisterMutation();


    const login = useGoogleLogin({
        onSuccess: (codeRes)=>{
            setUser(codeRes)
        },
        onError:(error)=>console.log("Error: "+error),
    })


    useEffect(
        () => {
            if (user) {
                try{
                    register(JSON.stringify(user.access_token));
                    addAlert("Success","Login successfully");
                }
                catch(err){
                    console.log(err);
                    addAlert("Failure","Login failed");
                }
            }
        },
        [ user ]
    );

    return <loginMenuContext.Provider value={{setIsLoginMenuActive}}>
        <div className={isLoginMenuActive?"login-menu-popup":"hidden"}>
            <PopUpMenu setIsActive={()=>setIsLoginMenuActive(!isLoginMenuActive)}>
                <div className="login-menu">
                    <h1 className="login-menu-header">Login/Register</h1>
                    {isLoading?
                    <button className="main-button active center-element">
                        Logging in...
                        <GoogleIcon/>
                    </button>:
                    <button onClick={() => login()} className="main-button center-element">
                        Login/Register with Google
                        <GoogleIcon/>
                    </button>}
                </div>
            </PopUpMenu>
        </div>
        {children}

    </loginMenuContext.Provider>
}

const useLoginMenuContext = ()=>useContext(loginMenuContext)

export {LoginMenu,useLoginMenuContext}