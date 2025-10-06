import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from 'utils/context/StatusEffectContext';
import { IdCard } from 'utils/components/CardMakerComponents/Card/IdCard';
import { IdInfoProvider, useIdInfoContext } from 'utils/context/IdInfoContext';
import InputTabIdInfoContainer from 'utils/components/CardMakerComponents/InputTab/InputTabContainer/InputTabIdInfoContainer/InputTabIdInfoContainer';
import {  useRefDownloadContext } from 'utils/context/ImgUrlContext';
import {  useSearchParams } from 'react-router-dom';
import ResetMenu from 'utils/components/ResetMenu/ResetMenu';
import { IdInfo } from 'interfaces/IIdInfo';
import CardMakerFooter from 'utils/components/CardMakerComponents/CardMakerFooter/CardMakerFooter';
import { useSettingMenuContext } from 'utils/components/SettingMenu/SettingMenu';
import { indexDB } from 'utils/indexDB';




export default function IdCardPage():ReactElement{
    
    return <IdInfoProvider>
        <IdCardContext/>
    </IdInfoProvider>
}


function IdCardContext():ReactElement{
    const [isResetMenuActive,setResetMenuActive] = useState(false)
    const {idInfoValue,setIdInfoValue,reset} = useIdInfoContext()
    const {setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb} = useSettingMenuContext() 
    const domRef=useRef(null)
    const [query] = useSearchParams()
    const {setDomRef} = useRefDownloadContext()
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
        <>
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
        </>
    </StatusEffectProvider>
}