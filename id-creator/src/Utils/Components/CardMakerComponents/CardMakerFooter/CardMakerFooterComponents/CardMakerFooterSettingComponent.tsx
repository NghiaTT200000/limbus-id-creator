import SettingIcon from "Utils/Icons/SettingIcon";
import React from "react";


export default function CardMakerFooterSettingComponent({setIsSaveMenuActive}:{setIsSaveMenuActive:(b:boolean)=>void}){
    return <div className="center-element card-maker-footer-component" onClick={()=>setIsSaveMenuActive(true)}>
            <SettingIcon width="16px" height="16px"/>
            <p>Setting/Saves</p>
        </div>
}