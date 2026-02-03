import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from '@/Context/StatusEffectContext';
import { useRefDownloadContext } from '@/Context/ImgUrlContext';
import { EgoInfoProvider, useEgoInfoContext } from '@/Context/EgoInfoContext';
import { EgoCard } from 'components/CardMakerComponents/Card/EgoCard';
import InputTabEgoInfoContainer from 'components/CardMakerComponents/InputTab/InputTabContainer/InputTabEgoInfoContainer/InputTabEgoInfoContainer';
import { useSearchParams } from 'react-router-dom';
import ResetMenu from 'components/ResetMenu/ResetMenu';
import { useSettingMenuContext } from 'components/SettingMenu/SettingMenu';
import { indexDB } from '@/Lib/IndexDB';
import { EgoInfo } from 'Types/IEgoInfo';



export default function EgoCardPage():ReactElement{

    return <EgoInfoProvider>
        <EgoCardContent/>
    </EgoInfoProvider>
    
}

function EgoCardContent():ReactElement{
    const {EgoInfoValue,setEgoInfoValue,reset} = useEgoInfoContext()
    const {setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb} = useSettingMenuContext() 
    const domRef=useRef(null)
    const {setDomRef} = useRefDownloadContext()
    const [query] = useSearchParams()
    const [isResetMenuActive,setResetMenuActive] = useState(false)
    const [activeTab,setActiveTab]=useState(-1)
    function changeActiveTab(i:number){
        if(activeTab===i) setActiveTab(-2)
        else setActiveTab(i)
    }


    useEffect(()=>{
        //Get the last save id
        indexDB.currEgoSave.toArray().then(arr=>{
            const lastSave = arr[0]
            if(lastSave){
                setEgoInfoValue(lastSave)
            }
            //Get local save id based on the url
            const id = parseInt(query.get('id'))
            if(query.get('saveMode')==="local"){
                const save = JSON.parse(localStorage.getItem("EgoLocalSaves"))
                if(save && save[id] && id!==undefined){
                    setEgoInfoValue(save[id].saveInfo)
                }
            }
            //Setting the save menu
            setLocalSaveName("EgoLocalSaves")
            changeSaveInfo(EgoInfoValue)
            setLoadObjInfoValueCb(()=>{return setEgoInfoValue})
            //Setting the domref for downloading
            setDomRef(domRef)
        })
    },[])

    useEffect(()=>{
        changeSaveInfo(new EgoInfo(EgoInfoValue))
        //Save the last change
        indexDB.currEgoSave.put(new EgoInfo(EgoInfoValue), 1)
    },[JSON.stringify(EgoInfoValue)])

    return <StatusEffectProvider skillDetails={EgoInfoValue.skillDetails}>
        <div className={`editor-container`}>
            <InputTabEgoInfoContainer
                resetBtnHandler={()=>setResetMenuActive(!isResetMenuActive)}
                activeTab={activeTab}
                changeActiveTab={changeActiveTab} />
            <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={reset} />
            <div className='preview-container'>
                <EgoCard ref={domRef} changeActiveTab={setActiveTab}/>
            </div>
        </div>
    </StatusEffectProvider>
}