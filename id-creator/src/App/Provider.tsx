import AlertPopUp from "Components/AlertPopUp/AlertPopUp";
import { LoginMenu } from "Components/LoginMenu/LoginMenu";
import { AlertContextProvider } from "Context/AlertContext";
import { RefDownloadProvider } from "Context/ImgUrlContext";
import { LoginUserContextProvider } from "Context/LoginUserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { EnvironmentVariables } from "Config/Environments";


export default function Provider({children}:{children: ReactNode}){
     return (
         <GoogleOAuthProvider clientId={EnvironmentVariables.REACT_APP_GOOGLE_CLIENT_ID!}>
             <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                 <AlertContextProvider>
                     <LoginUserContextProvider>
                         <RefDownloadProvider>
                             <LoginMenu>
                                 {children}
                                 <AlertPopUp />
                             </LoginMenu>
                         </RefDownloadProvider>
                     </LoginUserContextProvider>
                 </AlertContextProvider>
             </DndProvider>
         </GoogleOAuthProvider>
     );
}