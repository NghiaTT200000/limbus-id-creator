import React, { useState } from "react";
import DownloadImg from "Utils/DownloadImg";
import "./CardMakerFooter.css"
import DownloadIcon from "Assets/Icons/DownloadIcon";
import SettingIcon from "Assets/Icons/SettingIcon";
import useAlert from "Hooks/useAlert";
import TurnRefToImg from "Utils/TurnRefToImg";
import { getDomRef } from "Stores/Slices/ImgDomRefSlice";
import { useAppDispatch } from "Stores/AppStore";
import { openSettingMenu } from "Stores/Slices/UiSlice";

export default function CardMakerFooter(){
    const dispatch = useAppDispatch()
    const [isLoading,setIsLoading] = useState(false)
    const {addAlert} = useAlert()


    const downloadImg = ()=>{
        if(!isLoading){
            setIsLoading(true)
            const imgDomRef = getDomRef();
            if(imgDomRef)
                TurnRefToImg(imgDomRef)
                    .then((imgUrl:string)=>{
                        addAlert("Success","Download successful")
                        DownloadImg(imgUrl,"Custom")
                    })
                    .catch((err)=>{
                        console.log(err)
                        addAlert("Failure","ERROR: Missing asset detected. Please look for and update the missing asset.")
                    })
                    .finally(()=>setIsLoading(false))
        }
    }

    return <div className="card-maker-footer">
        <div className="card-maker-footer-components">
            <div className="center-element card-maker-footer-component" onClick={downloadImg}>
                <DownloadIcon width="16px" height="16px"/>
                <p>{isLoading? "Downloading..." :"Download"}</p>
            </div>
            <div className="center-element card-maker-footer-component" onClick={()=>dispatch(openSettingMenu())}>
                <SettingIcon width="16px" height="16px"/>
                <p>Setting/Saves</p>
            </div>
        </div>
    </div>
}
