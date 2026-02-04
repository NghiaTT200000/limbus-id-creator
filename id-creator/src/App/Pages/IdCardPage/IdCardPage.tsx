import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'Styles/reset.css'
import 'Styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from 'Features/CardCreator/Stores/StatusEffectContext';
import { IdInfoProvider, useIdInfoContext } from 'Features/CardCreator/Stores/IdInfoContext';
import {  useRefDownloadContext } from 'Context/ImgUrlContext';
import {  useSearchParams } from 'react-router-dom';
import { indexDB } from 'Features/CardCreator/Utils/IndexDB';
import DragAndDroppableSkillPreviewLayer from 'Features/CardCreator/Components/Card/components/DragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import CardMakerFooter from 'Features/CardCreator/Components/CardMakerFooter/CardMakerFooter';
import { SettingMenu, useSettingMenuContext } from 'Features/CardCreator/Components/SettingMenu/SettingMenu';
import { IdCard } from 'Features/CardCreator/Components/Card/IdCard';
import InputTabIdInfoContainer from 'Features/CardCreator/Components/InputTab/InputTabContainer/InputTabIdInfoContainer/InputTabIdInfoContainer';
import ResetMenu from 'Features/CardCreator/Components/ResetMenu/ResetMenu';
import { IdInfo } from 'Features/CardCreator/Types/IIdInfo';




export default function IdCardPage():ReactElement{
    
    return <IdInfoProvider>
        <SettingMenu>
            <IdCardContext/>
        </SettingMenu>
    </IdInfoProvider>
}


function IdCardContext():ReactElement{
    const {idInfoValue,setIdInfoValue,reset} = useIdInfoContext()
    const {setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb} = useSettingMenuContext() 
    const domRef=useRef(null)
    const [query] = useSearchParams()
    const {setDomRef} = useRefDownloadContext()
    const [isResetMenuActive,setResetMenuActive] = useState(false)
    const [activeTab,setActiveTab]=useState(-1)

    function changeActiveTab(i:number){
        if(activeTab===i) setActiveTab(-2)
        else setActiveTab(i)
    }

    useEffect(()=>{
        //Get the last save id
        indexDB.currIdSave.toArray().then(arr=>{
            const lastSave = arr[0]
            if(lastSave){
                setIdInfoValue(lastSave)
            }
            //Get local save id based on the url
            const id = parseInt(query.get('id'))
            if(query.get('saveMode')==="local"){
                const save = JSON.parse(localStorage.getItem("IdLocalSaves"))
                if(save && save[id] && id!==undefined){
                    setIdInfoValue(save[id].saveInfo)
                }
            }
            //Setting the save menu
            setLocalSaveName("IdLocalSaves")
            changeSaveInfo(idInfoValue)
            setLoadObjInfoValueCb(()=>{return setIdInfoValue})
            //Setting the domref for downloading
            setDomRef(domRef)
        })
    },[])

    useEffect(()=>{
        changeSaveInfo(new IdInfo(idInfoValue))
        //Save the last change
        indexDB.currIdSave.put(new IdInfo(idInfoValue),1)
    },[JSON.stringify(idInfoValue)])

    return <StatusEffectProvider skillDetails={idInfoValue.skillDetails}>
        <DragAndDroppableSkillPreviewLayer/>
        <div className={`editor-container`}>
            <InputTabIdInfoContainer 
                resetBtnHandler={()=>setResetMenuActive(!isResetMenuActive)}
                activeTab={activeTab}
                changeActiveTab={changeActiveTab} />
            <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={reset} />
            <div className='preview-container'>
                <IdCard ref={domRef} changeActiveTab={setActiveTab}/>
            </div>
        </div>
        <CardMakerFooter/>
    </StatusEffectProvider>
}