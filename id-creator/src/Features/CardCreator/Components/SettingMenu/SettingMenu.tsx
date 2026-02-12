import React, { createContext, ReactNode, useContext, useState } from "react";
import "./SettingMenu.css"
import { ISaveFile, SaveFile } from "Types/ISaveFile";
import CloseIcon from "Assets/Icons/CloseIcon";
import CustomKeywordMenu from "./CustomKeywordMenu/CustomKeywordMenu";
import SaveCloudMenu from "./SaveCloudMenu/SaveCloudMenu";
import { SaveLocalMenu } from "./SaveLocalMenu/SaveLocalMenu";
import { IEgoInfo } from "Features/CardCreator/Types/IEgoInfo";
import { IIdInfo } from "Features/CardCreator/Types/IIdInfo";



const settingMenuContext = createContext(null)

const SettingMenu: React.FC<{children:ReactNode}>=({children})=>{
    const [displayMode,setDisplayMode] = useState("Local")
    const [isActive,setIsActive] = useState(false)
    const [localSaveName,setLocalSaveName] = useState("")
    const [saveObjInfoValue,setSaveObjInfoValue] = useState<ISaveFile<IIdInfo|IEgoInfo>>()
    const [loadObjInfoValueCb,setLoadObjInfoValueCb] = useState<(objInfo:IIdInfo|IEgoInfo)=>void>()

    const changeSaveInfo=(saveInfo:IIdInfo|IEgoInfo)=>setSaveObjInfoValue(new SaveFile(saveInfo,"New save file"))

    const displaySettings = ()=>{
        if(displayMode==="Local")
            return <SaveLocalMenu localSaveName={localSaveName} saveObjInfoValue={saveObjInfoValue} loadObjInfoValueCb={loadObjInfoValueCb} isActive={isActive} setIsActive={setIsActive} />
        else if(displayMode==="Cloud") 
            return <SaveCloudMenu setIsActive={setIsActive} saveObjInfoValue={saveObjInfoValue} setSaveObjInfoValue={setSaveObjInfoValue} loadObjInfoValueCb={loadObjInfoValueCb} saveMode={localSaveName==="IdLocalSaves"?"ID":"Ego"}/>
        else if(displayMode==="Custom keywords")
            return <CustomKeywordMenu/>
    }

    return<settingMenuContext.Provider value={{isActive,setIsActive,setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb}}>
        {isActive &&
            <div className={`setting-menu-container`}>
                <div className={`setting-menu-background`} onClick={()=>setIsActive(false)}></div>
                <div className={`setting-menu-outline`}>
                    <div className="setting-menu-slide-in">
                        <span className="close-setting-menu" onClick={()=>setIsActive(false)}><CloseIcon/></span>
                        <h1 className="setting-header">Settings</h1>
                        <div className="center-element">
                            <button className={`main-button ${displayMode==="Cloud"?"active":""}`} onClick={()=>setDisplayMode("Cloud")}>
                                Cloud saves
                            </button>
                            <button className={`main-button ${displayMode==="Local"?"active":""}`} onClick={()=>setDisplayMode("Local")}>
                                Local saves
                            </button>
                            <button className={`main-button ${displayMode==="Custom keywords"?"active":""}`} onClick={()=>setDisplayMode("Custom keywords")}>
                                Custom keywords
                            </button>
                        </div>
                        <div className="setting-menu-content center-element-vertically">
                            {displaySettings()}
                        </div>
                    </div>
                </div>
            </div>
        }
        
        {children}
    </settingMenuContext.Provider>
}

const useSettingMenuContext =()=> useContext(settingMenuContext)

export {SettingMenu,useSettingMenuContext}