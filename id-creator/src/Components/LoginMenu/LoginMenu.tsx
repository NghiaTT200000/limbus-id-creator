import { createContext, ReactElement, useContext, useEffect, useState } from "react";
import React from "react";
import "./LoginMenu.css"
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import PopUpMenu from "components/PopUpMenu/PopUpMenu";
import { useAlertContext } from "@/Context/AlertContext";
import { useLoginUserContext } from "@/Context/LoginUserContext";
import IResponse from "Types/IResponse";
import ILoginUser from "Types/ILoginUser";
import GoogleIcon from "@/Assets/Icons/GoogleIcon";

const loginMenuContext = createContext(null)

function LoginMenu({children}:{children:ReactElement}){
    const [isLoginMenuActive,setIsLoginMenuActive] = useState(false)
    const [isLoggingIn,setIsLogginIn] = useState(false)
    const [user,setUser] = useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>()
    const {addAlert} = useAlertContext()
    const {setLoginUser} = useLoginUserContext()


    const login = useGoogleLogin({
        onSuccess: (codeRes)=>{
            setUser(codeRes)
        },
        onError:(error)=>console.log("Error: "+error),
    })


    useEffect(
        () => {
            if (user) {
                setIsLogginIn(true)
                fetch(`${process.env.REACT_APP_SERVER_URL}/API/OAuth/oauth2/register`, {
                        method: "POST",
                        credentials: "include",
                        headers:{
                            "Content-type":"application/json"
                        },
                        body:JSON.stringify(user.access_token)
                    })
                    .then(res=>res.json())
                    .then((res:IResponse<ILoginUser>) => {
                        if(res.response){
                            setLoginUser(res.response)
                            setIsLoginMenuActive(false)
                            addAlert("Success","Login successfully")
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        addAlert("Failure","Login failed")
                    })
                    .finally(()=>setIsLogginIn(false))
            }
        },
        [ user ]
    );

    return <loginMenuContext.Provider value={{isLoginMenuActive,setIsLoginMenuActive}}>
        <div className={isLoginMenuActive?"login-menu-popup":"hidden"}>
            <PopUpMenu setIsActive={()=>setIsLoginMenuActive(!isLoginMenuActive)}>
                <div className="login-menu">
                    <h1 className="login-menu-header">Login/Register</h1>
                    {isLoggingIn?
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