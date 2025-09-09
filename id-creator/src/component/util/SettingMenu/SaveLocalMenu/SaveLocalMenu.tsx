import React, { useEffect, useState } from "react";
import "../SettingMenu.css"
import { ISaveFile, SaveFile } from "Interfaces/ISaveFile";
import MainButton from "utils/MainButton/MainButton";
import { IIdInfo } from "Interfaces/IIdInfo";
import { IEgoInfo } from "Interfaces/IEgoInfo";
import useSaveLocal from "utils/Hooks/useSaveLocal";
import uuid from "react-uuid";
import PopUpMenu from "utils/PopUpMenu/PopUpMenu";



const SaveLocalMenu=({localSaveName,saveObjInfoValue,loadObjInfoValueCb,isActive,setIsActive}:{localSaveName:string, saveObjInfoValue:ISaveFile<IIdInfo|IEgoInfo>, loadObjInfoValueCb:React.Dispatch<React.SetStateAction<IIdInfo|IEgoInfo>>,isActive:boolean,setIsActive:(a:boolean)=>void})=>{
    const {saveData,isLoading,deleteSave,createSave,loadSave,overwriteSave} = useSaveLocal<IIdInfo|IEgoInfo>(localSaveName)
    const [namePopup,setNamePopup] = useState(false)
    const [newSaveName,setNewSaveName] = useState("Save "+new Date().toISOString())

    const openPopup = ()=>{
        setNamePopup(true)
        setNewSaveName("Save "+new Date().toISOString())
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
            <PopUpMenu setIsActive={()=>setNamePopup(false)}>
                <div className="save-cloud-name-popup">
                    <label htmlFor="saveName">Enter the name of the new save:</label>
                    <input className="input save-cloud-name-input" name="saveName" id="saveName" type="text" placeholder="Save name" 
                    value={newSaveName} 
                    onChange={(e)=>{
                        setNewSaveName(e.target.value)
                    }}/>
                    <MainButton component={"Create"} btnClass={"main-button create-new-save-btn"} clickHandler={()=>{
                        saveObjInfoValue.id = uuid()
                        saveObjInfoValue.saveName = newSaveName
                        saveObjInfoValue.saveTime = new Date().toLocaleString()
                        createSave(saveObjInfoValue)
                        setNamePopup(false)
                    }}/>
                </div>
            </PopUpMenu>
        </div>
        <div className="save-menu-list local">
            {saveData.length>0?<>
                {saveData.map((data)=>
                    <div className={`save-tab center-element-vertically`} key={data.id}>
                        {data.previewImg?<img className="save-preview-img" src={data.previewImg} alt="preview-save" />:<></>}
                        <p className="created-time">Last updated: {data.saveTime}</p>
                        <div className="center-element save-tab-input-container">
                            <p>{data.saveName}</p>
                        </div>
                        <div className="center-element">
                            <MainButton component={"Delete"} clickHandler={()=>{
                                deleteSave(data.id)
                            }} btnClass={"main-button"}/>
                            <MainButton component={"Overwrite"} clickHandler={()=>{
                                saveObjInfoValue.saveTime = new Date().toLocaleString()
                                overwriteSave(data.id,saveObjInfoValue.saveInfo)
                            }} btnClass={"main-button"}/>
                            <MainButton component={"Load"} clickHandler={async ()=>{
                                const save = await loadSave(data.id)
                                loadObjInfoValueCb(save.saveInfo)
                                setIsActive(!isActive)
                            }} btnClass={"main-button"}/>
                        </div>
                    </div>
                )}
            </>:<p style={{fontFamily:"'Mikodacs' , 'Rubik', sans-serif"}}></p>}
        </div>
        <p>Current local save: {saveData.length}/{process.env.REACT_APP_LOCAL_SAVE_MAX_LEN??10}</p>
        {isLoading?<MainButton component={"Loading..."} btnClass="main-button create-new-save-btn"/>:<MainButton component={"Create a new save"} clickHandler={()=>{
                const maxLenStr = process.env.REACT_APP_LOCAL_SAVE_MAX_LEN
                const maxLen = Number(maxLenStr)??10
                if(saveData.length<maxLen){
                    openPopup()
                }
            }
        } btnClass={"main-button create-new-save-btn"}/>}
    </>
}

export {SaveLocalMenu}