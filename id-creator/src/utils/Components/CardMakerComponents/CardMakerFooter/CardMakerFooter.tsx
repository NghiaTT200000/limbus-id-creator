import { useAlertContext } from "Utils/Context/AlertContext";
import { useRefDownloadContext } from "Utils/Context/ImgUrlContext";
import React, { useState } from "react";
import DownloadImg from "Utils/Functions/DownloadImg";
import CardMakerFooterDownloadComponent from "./CardMakerFooterComponents/CardMakerFooterDownloadComponent";
import "./CardMakerFooter.css"
import CardMakerFooterSettingComponent from "./CardMakerFooterComponents/CardMakerFooterSettingComponent";
import { useSettingMenuContext } from "Utils/Components/SettingMenu/SettingMenu";

export default function CardMakerFooter(){
    const {setIsActive} = useSettingMenuContext()
    const {setImgUrlState} = useRefDownloadContext()
    const [isLoading,setIsLoading] = useState(false)
    const {addAlert} = useAlertContext()

    
    const downloadImg = ()=>{
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

    return <div className="card-maker-footer">
        <div className="card-maker-footer-components">
            <CardMakerFooterDownloadComponent isLoading={isLoading} downloadImg={downloadImg}/>
            <CardMakerFooterSettingComponent setIsSaveMenuActive={setIsActive}/>
        </div>
    </div>
}