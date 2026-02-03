import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { IEgoInfo } from "Types/IEgoInfo";
import { IIdInfo } from "Types/IIdInfo";
import { ISaveFile } from "Types/ISaveFile";
import { IOffenseSkill } from "Types/OffenseSkill/IOffenseSkill";
import { IDefenseSkill } from "Types/DefenseSkill/IDefenseSkill";
import { ICustomEffect } from "Types/CustomEffect/ICustomEffect";
import { IIsLoading } from "Types/Utils/IIsLoading";
import uuid from "react-uuid";
import SaveCloudTab from "./SaveCloudTab";
import PopUpMenu from "components/PopUpMenu/PopUpMenu";
import imageCompression from 'browser-image-compression';
import getImageDimensions from "@/Utils/getImageDimensions";
import { useLoginMenuContext } from "components/LoginMenu/LoginMenu";
import { useAlertContext } from "@/Context/AlertContext";
import { useRefDownloadContext } from "@/Context/ImgUrlContext";
import { useLoginUserContext } from "@/Context/LoginUserContext";
import base64ToFile from "@/Utils/base64ToFile";
import checkBase64Image from "@/Utils/checkBase64Image";
import "./SaveCloudMenu.css";
import "../SettingMenu.css";

export default function SaveCloudMenu({setIsActive,saveMode,saveObjInfoValue,loadObjInfoValueCb,setSaveObjInfoValue}:{
    setIsActive:(a:boolean)=>void,
    saveMode:string,
    saveObjInfoValue:ISaveFile<IIdInfo|IEgoInfo>,
    setSaveObjInfoValue:React.Dispatch<React.SetStateAction<ISaveFile<IIdInfo | IEgoInfo>>>,
    loadObjInfoValueCb:React.Dispatch<React.SetStateAction<IIdInfo|IEgoInfo>>}):ReactElement{
    const {setImgUrlState} = useRefDownloadContext()
    const [createSaveBtnLoadState,setCreateSaveBtnLoadState] = useState<IIsLoading>({loadingMessage:"",isLoading:false})
    const [isLoadingSaveData,setIsLoadingSaveData] = useState(false)
    const [saveList,setSaveList] = useState([])
    const [namePopup,setNamePopup] = useState(false)
    const [searchSaveName,setSearchSaveName] = useState("")
    const {loginUser} = useLoginUserContext()
    const {setIsLoginMenuActive} = useLoginMenuContext()
    const {addAlert} = useAlertContext()

    async function createForm (saveObjInfoValue:ISaveFile<IIdInfo|IEgoInfo>):Promise<FormData>{
        const form = new FormData()
        saveObjInfoValue.saveTime = (new Date()).toLocaleString('en-GB')
        //Deep copy
        const saveData = JSON.parse(JSON.stringify(saveObjInfoValue))
        const saveInfo = {...saveData.saveInfo}
        //Check all of the field that can contain base64 string and convert them to file
        //Then remove the string in the object to send them to the backend quicker
        if(checkBase64Image(saveInfo.sinnerIcon)){
            form.append("sinnerIcon",base64ToFile(saveInfo.sinnerIcon,"new file"))
            saveInfo.sinnerIcon = ""
        }

        if(checkBase64Image(saveInfo.splashArt)){
            form.append("splashArtImg",base64ToFile(saveInfo.splashArt,"new file"))
            saveInfo.splashArt = ""
        }

        const thumbnailImageFile = base64ToFile(await setImgUrlState(),"new file")
        const {width} = await getImageDimensions(thumbnailImageFile)
        form.append("thumbnailImage",await imageCompression(thumbnailImageFile,{
            maxSizeMB: 1,
            useWebWorker: true,                    
            maxWidthOrHeight: Math.max(1650,Math.floor(width*(2/3)))
        }))

        saveInfo.skillDetails.forEach((skill,i)=>{
            if(skill.type==="OffenseSkill"){
                if(checkBase64Image((skill as IOffenseSkill).skillImage)){
                    form.append("skillImages",base64ToFile((skill as IOffenseSkill).skillImage,"new file"))
                    form.append("imageIndex",i.toString());
                    (saveInfo.skillDetails[i] as IOffenseSkill).skillImage=""
                }
            }
            if(skill.type==="DefenseSkill"){
                if(checkBase64Image((skill as IDefenseSkill).skillImage)){
                    form.append("skillImages",base64ToFile((skill as IDefenseSkill).skillImage,"new file"))
                    form.append("imageIndex",i.toString());
                    (saveInfo.skillDetails[i] as IDefenseSkill).skillImage=""
                }
            }
            if(skill.type==="CustomEffect"){
                if(checkBase64Image((skill as ICustomEffect).customImg)){
                    form.append("skillImages",base64ToFile((skill as ICustomEffect).customImg,"new file"))
                    form.append("imageIndex",i.toString());
                    (saveInfo.skillDetails[i] as ICustomEffect).customImg=""
                }
            }
        })
        saveData.saveInfo=saveInfo
        form.append("SaveData",JSON.stringify(saveData))

        //Log all form data
        // for (let [key, value] of form.entries()) {
        //     console.log(key+":")
        //     console.log(value)
        // }

        return form
    }

    async function createNewSaveFile(){
        try {
            setIsLoadingSaveData(true)
            setCreateSaveBtnLoadState({loadingMessage:"Waiting for save image to load...",isLoading:true})
            saveObjInfoValue.id = uuid()
            const form = await createForm(saveObjInfoValue)
            setCreateSaveBtnLoadState({loadingMessage:"Creating new save",isLoading:true})
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}/create`,{
                method: "POST",
                credentials: "include",
                body:form
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else{
                addAlert("Success",result.msg)
                loadSaveList()
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        } 
        setCreateSaveBtnLoadState({loadingMessage:"",isLoading:false})
        setIsLoadingSaveData(false)
    }

    async function deleteSave(saveId:string){
        try {
            setIsLoadingSaveData(true)
            const req = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}/delete`,{
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify(saveId)
            })
            const res = await req.json()
            if(!req.ok) addAlert("Failure",res.msg)
            else{ 
                loadSaveList()
                addAlert("Success","Deleted")
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        setIsLoadingSaveData(false)
    }

    async function loadSaveList(){
        try {
            setIsLoadingSaveData(true)
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}?userId=${loginUser.id}&searchName=${searchSaveName}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else setSaveList(result.response)
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        setIsLoadingSaveData(false)
    }

    async function loadSave(SaveId:string){
        try{
            setIsLoadingSaveData(true)
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}/${SaveId}?includeSkill=true`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else{ 
                loadObjInfoValueCb(result.response.saveInfo)
                setIsActive(false)
            }
        }
        catch(error){
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        setIsLoadingSaveData(false)
    }

    async function overwriteSave(SaveId:string){
        try {
            setIsLoadingSaveData(true)
            setCreateSaveBtnLoadState({loadingMessage:"Waiting for save image to load...",isLoading:true})
            saveObjInfoValue.id = SaveId
            const form = await createForm(saveObjInfoValue)
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/${saveMode==="ID"?"SaveIDInfo":"SaveEGOInfo"}/update`,{
                credentials: "include",
                method: "POST",
                body:form
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else{ 
                loadSaveList()
                addAlert("Success",result.msg)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        setIsLoadingSaveData(false)
    }

    const loadCreateNewSaveButton = ()=>{
        if(!loginUser) return <button className="main-button create-new-save-btn" onClick={()=>{setIsLoginMenuActive(true)}}>Login</button>
        if(createSaveBtnLoadState.isLoading) return <button className="main-button active create-new-save-btn">{createSaveBtnLoadState.loadingMessage}</button>
        return <button className="main-button create-new-save-btn" onClick={()=>setNamePopup(true)}>Create a new save</button> 
    }

    useEffect(()=>{
        if(loginUser)loadSaveList()
    },[saveMode,loginUser,searchSaveName])


    return <div className="save-cloud-container">
        <div className={`${namePopup?"":"hidden"}`}>
            <PopUpMenu setIsActive={()=>setNamePopup(false)}>
                <div className="save-cloud-name-popup">
                    <label htmlFor="saveName">Enter the name of the new save:</label>
                    <input className="input save-cloud-name-input" name="saveName" id="saveName" type="text" placeholder="Save name" 
                    value={saveObjInfoValue.saveName} 
                    onChange={(e)=>{
                        setSaveObjInfoValue({...saveObjInfoValue,saveName:e.target.value})
                    }}/>
                    <button className="main-button create-new-save-btn" onClick={()=>{
                        createNewSaveFile()
                        setNamePopup(false)
                    }}>
                        Create
                    </button>
                </div>
            </PopUpMenu>
        </div>
        <div >
            <label htmlFor="saveName">Search: </label>
            <input className="input save-cloud-name-input" name="saveName" id="saveName" type="text" placeholder="Save name" value={searchSaveName} onChange={(e)=>setSearchSaveName(e.target.value)}/>
        </div>
        <div className="save-menu-list-container">
            {isLoadingSaveData?<div className="loading-cloud-tab"><div className="loader"></div></div>:<></>}
            <div className="save-menu-list">
                {loginUser?<>
                    {saveList.map(save=><SaveCloudTab key={save.id} saveDate={save.saveTime} saveName={save.saveName} previewUrl={save.previewImg}
                                    deleteSave={()=>deleteSave(save.id)} loadSave={()=>loadSave(save.id)} overwriteSave={()=>overwriteSave(save.id)}/>)}
                </>:
                    <div className="save-cloud-login-remainder">
                        <p>Please login to save to the cloud</p>
                        <button className="main-button" onClick={()=>{setIsLoginMenuActive(true)}}>Login</button>
                    </div>
                }
            </div>
        </div>
        {loadCreateNewSaveButton()}
    </div>
}