import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'Styles/reset.css'
import 'Styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from 'Utils/Context/StatusEffectContext';
import { useRefDownloadContext } from 'Utils/Context/ImgUrlContext';
import { EgoInfoProvider, useEgoInfoContext } from 'Utils/Context/EgoInfoContext';
import { EgoCard } from 'Utils/Components/CardMakerComponents/Card/EgoCard';
import InputTabEgoInfoContainer from 'Utils/Components/CardMakerComponents/InputTab/InputTabContainer/InputTabEgoInfoContainer/InputTabEgoInfoContainer';
import { useSearchParams } from 'react-router-dom';
import ResetMenu from 'Utils/Components/ResetMenu/ResetMenu';
import CardMakerFooter from 'Utils/Components/CardMakerComponents/CardMakerFooter/CardMakerFooter';
import { useSettingMenuContext } from 'Utils/Components/SettingMenu/SettingMenu';
import { indexDB } from 'Utils/IndexDB';
import { EgoInfo } from 'Interfaces/IEgoInfo';



export default function EgoCardPage():ReactElement{

    return <EgoInfoProvider>
            <EgoCardContent/>
        </EgoInfoProvider>
    
}

function EgoCardContent():ReactElement{
    const [isResetMenuActive,setResetMenuActive] = useState(false)
    const {EgoInfoValue,setEgoInfoValue,reset} = useEgoInfoContext()
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
            <>
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
                <CardMakerFooter/>
            </>
    </StatusEffectProvider>
}