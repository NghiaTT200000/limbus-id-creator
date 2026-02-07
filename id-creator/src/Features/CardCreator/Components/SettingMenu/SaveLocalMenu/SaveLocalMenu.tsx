import React, { useEffect, useState } from "react";
import "../SettingMenu.css"
import { ISaveFile } from "Types/ISaveFile";
import useSaveLocal from "Features/CardCreator/Hooks/useSaveLocal";
import uuid from "react-uuid";
import PopUpMenu from "Components/PopUpMenu/PopUpMenu";
import EditIcon from "Assets/Icons/EditIcon";
import { IEgoInfo } from "Features/CardCreator/Types/IEgoInfo";
import { IIdInfo } from "Features/CardCreator/Types/IIdInfo";
import { EnvironmentVariables } from "Config/Environments";



const SaveLocalMenu=({localSaveName,saveObjInfoValue,loadObjInfoValueCb,isActive,setIsActive}:{localSaveName:string, saveObjInfoValue:ISaveFile<IIdInfo|IEgoInfo>, loadObjInfoValueCb:React.Dispatch<React.SetStateAction<IIdInfo|IEgoInfo>>,isActive:boolean,setIsActive:(a:boolean)=>void})=>{
    const {saveData,isLoading,deleteSave,createSave,changeSaveName,loadSave,overwriteSave} = useSaveLocal<IIdInfo|IEgoInfo>(localSaveName)
    const [namePopup,setNamePopup] = useState(false)
    const [popupMode,setPopupMode] = useState<"create"|"overwrite">("create")
    const [nameChangingSaveId,setNameChangingSaveId] = useState<string|null>(null)
    const [newSaveName,setNewSaveName] = useState("Save "+new Date().toISOString())

    const openPopup = (newSaveName?:string)=>{
        setNamePopup(true)
        setNewSaveName(newSaveName || "Save "+new Date().toISOString())
    }

    const closePopup = () => {
        setNamePopup(false)
        setPopupMode("create")
    }

    const createNewSave = ()=>{
        if(!isLoading){
            const maxLenStr = EnvironmentVariables.REACT_APP_LOCAL_SAVE_MAX_LEN
            const maxLen = Number(maxLenStr ?? 10)
            if(saveData.length<maxLen){
                openPopup()
            }
        }
    }

    const saveSubmit = ()=>{
        if(popupMode==="overwrite"){
            if(nameChangingSaveId) changeSaveName(nameChangingSaveId,newSaveName)
        }
        else{
            saveObjInfoValue.id = uuid()
            saveObjInfoValue.saveName = newSaveName
            const createdDate = new Date().toLocaleString()
            createSave({...saveObjInfoValue, updateTime:createdDate, saveTime: createdDate})
        }
        closePopup()
    }

    //Some of the save can have the same id
    //This is to create new save for some 
    //of the save with same id
    useEffect(()=>{
        saveData.map(save=>{
            if(saveData.some(s=>s.id===save.id)||!save.id) save.id = uuid()
            return save
        })
    },[localSaveName])

    return<>
        <div className={`${namePopup?"":"hidden"}`}>
            <PopUpMenu setIsActive={()=>{
                    closePopup()
                }}>
                <div className="save-cloud-name-popup">
                    <label htmlFor="saveName">Enter the name of the new save:</label>
                    <input className="input save-cloud-name-input" name="saveName" id="saveName" type="text" placeholder="Save name" 
                    value={newSaveName} 
                    onChange={(e)=>{
                        setNewSaveName(e.target.value)
                    }}/>
                    <button className="main-button create-new-save-btn" onClick={saveSubmit}>{popupMode==="overwrite"?"Update":"Create"}</button>
                </div>
            </PopUpMenu>
        </div>
        <div className="save-local-warning">
            <strong>&#9888; Important:</strong> This site will be moving from  <a href="https://limbus-company-id-creator.netlify.app" target="_blank" rel="noreferrer">limbus-company-id-creator.netlify.app</a> to{" "}
            <a href="https://limbus-company-id-creator.com" target="_blank" rel="noreferrer">limbus-company-id-creator.com</a>
            {" "}on February 13th, 5:00 PM KST. Local saves will not transfer to the new domain. Please move your saves to the cloud before then.
        </div>
        <div className="save-menu-list local">
            {saveData.length>0?<>
                {saveData.sort((a,b)=>{
                    const prevDate = new Date(a.saveTime)
                    const nextDate = new Date(b.saveTime)

                    return prevDate < nextDate ? 1 : -1
                }).map((data)=>
                    <div className={`save-tab center-element-vertically`} key={data.id}>
                        {data.previewImg?<img className="save-preview-img" src={data.previewImg} alt="preview-save" />:<></>}
                        <p className="created-time">Last updated: {data.updateTime}</p>
                        <p className="created-time">Created: {data.saveTime}</p>
                        <div className="center-element save-tab-input-container">
                            <p>{data.saveName}</p>
                            <div onClick={()=>{
                                setPopupMode("overwrite")
                                setNameChangingSaveId(data.id)
                                openPopup(data.saveName)
                            }}>
                                <EditIcon/>
                            </div>
                        </div>
                        <div className="center-element">
                            <button className="main-button" onClick={()=>deleteSave(data.id)}>
                                Delete
                            </button>
                            <button className="main-button" onClick={()=>{
                                saveObjInfoValue.saveTime = new Date().toLocaleString()
                                overwriteSave(data.id,saveObjInfoValue.saveInfo)
                            }}>
                                Overwrite
                            </button>
                            <button className="main-button" onClick={async ()=>{
                                const save = await loadSave(data.id)
                                loadObjInfoValueCb(save.saveInfo)
                                setIsActive(!isActive)
                            }}>
                                Load
                            </button>
                        </div>
                    </div>
                )}
            </>:<p style={{fontFamily:"'Mikodacs' , 'Rubik', sans-serif"}}></p>}
        </div>
        <p>Current local save: {saveData.length}/{EnvironmentVariables.REACT_APP_LOCAL_SAVE_MAX_LEN??10}</p>
        <button className="main-button create-new-save-btn" onClick={createNewSave}>{isLoading?"Loading...":"Create a new save"}</button>
    </>
}

export {SaveLocalMenu}