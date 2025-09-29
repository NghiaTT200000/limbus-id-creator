import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import { useRefDownloadContext } from 'component/context/ImgUrlContext';
import { EgoInfoProvider, useEgoInfoContext } from 'component/context/EgoInfoContext';
import { EgoCard } from 'component/CardMakerComponents/Card/EgoCard';
import InputTabEgoInfoContainer from 'component/CardMakerComponents/InputTab/InputTabContainer/InputTabEgoInfoContainer/InputTabEgoInfoContainer';
import { useSearchParams } from 'react-router-dom';
import ResetMenu from 'utils/ResetMenu/ResetMenu';
import CardMakerFooter from 'component/CardMakerComponents/CardMakerFooter/CardMakerFooter';
import { useSettingMenuContext } from 'component/util/SettingMenu/SettingMenu';
import { indexDB } from 'utils/IndexDB/indexDB';
import { EgoInfo } from 'Interfaces/IEgoInfo';



export default function EgoCardPage():ReactElement{

    return <EgoInfoProvider>
            <EgoCardContent/>
        </EgoInfoProvider>
    
}

function EgoCardContent():ReactElement{
    const [isResetMenuActive,setResetMenuActive] = useState(false)
    const [height,setHeight] = useState(0)
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
        setHeight(Math.floor(window.innerHeight)
        -Math.floor(document.querySelector(".site-header").clientHeight)
        -Math.floor(document.querySelector(".card-maker-footer").clientHeight)
        -4)    
    },[window.innerHeight,
        document.querySelector(".site-header")?.clientHeight,
        document.querySelector(".card-maker-footer")?.clientHeight])

    useEffect(()=>{
        changeSaveInfo(new EgoInfo(EgoInfoValue))
        //Save the last change
        indexDB.currEgoSave.put(new EgoInfo(EgoInfoValue), 1)
    },[JSON.stringify(EgoInfoValue)])

    return <StatusEffectProvider skillDetails={EgoInfoValue.skillDetails}>
            <>
                <div className={`editor-container`} style={{height:height}}>
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