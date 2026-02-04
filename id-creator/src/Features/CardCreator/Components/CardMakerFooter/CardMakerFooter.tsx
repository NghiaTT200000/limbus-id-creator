import { useAlertContext } from "Context/AlertContext";
import { useRefDownloadContext } from "Context/ImgUrlContext";
import React, { useState } from "react";
import DownloadImg from "Utils/DownloadImg";
import "./CardMakerFooter.css"
import { useSettingMenuContext } from "../SettingMenu/SettingMenu";
import DownloadIcon from "Assets/Icons/DownloadIcon";
import SettingIcon from "Assets/Icons/SettingIcon";

export default function CardMakerFooter(){
    const {setIsActive} = useSettingMenuContext()
    const {setImgUrlState} = useRefDownloadContext()
    const [isLoading,setIsLoading] = useState(false)
    const {addAlert} = useAlertContext()

    
    const downloadImg = ()=>{
        if(!isLoading){
            setIsLoading(true)
            setImgUrlState()
                .then((imgUrl:string)=>{
                    addAlert("Success","Download successful")
                    DownloadImg(imgUrl,"Custom")
                })
                .catch((err)=>{
                    console.log(err)
                    addAlert("Failure","Error: Cannot download")
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
            <div className="center-element card-maker-footer-component" onClick={()=>setIsActive(true)}>
                <SettingIcon width="16px" height="16px"/>
                <p>Setting/Saves</p>
            </div>
        </div>
    </div>
}