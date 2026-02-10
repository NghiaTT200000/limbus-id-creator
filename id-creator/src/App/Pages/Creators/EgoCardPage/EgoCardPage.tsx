import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'Styles/reset.css'
import 'Styles/style.css'
import '../Shared/Styles/EditorPage.css'
import { StatusEffectProvider } from 'Features/CardCreator/Stores/StatusEffectContext';
import { EgoInfoProvider, useEgoInfoContext } from 'Features/CardCreator/Stores/EgoInfoContext';
import { useSearchParams } from 'react-router-dom';
import { indexDB } from 'Features/CardCreator/Utils/IndexDB';
import DragAndDroppableSkillPreviewLayer from 'Features/CardCreator/Components/Card/components/DragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import { EgoCard } from 'Features/CardCreator/Components/Card/EgoCard';
import InputTabEgoInfoContainer from 'Features/CardCreator/Components/InputTab/InputTabContainer/InputTabEgoInfoContainer/InputTabEgoInfoContainer';
import ResetMenu from 'Features/CardCreator/Components/ResetMenu/ResetMenu';
import { SettingMenu, useSettingMenuContext } from 'Features/CardCreator/Components/SettingMenu/SettingMenu';
import { EgoInfo } from 'Features/CardCreator/Types/IEgoInfo';
import CardMakerFooter from 'Features/CardCreator/Components/CardMakerFooter/CardMakerFooter';
import PopUpMenu from 'Components/PopUpMenu/PopUpMenu';
import { registerDomRef } from 'Stores/Slices/ImgDomRefSlice';



export default function EgoCardPage():ReactElement{

    return <EgoInfoProvider>
        <SettingMenu>
            <EgoCardContent/>
        </SettingMenu>
    </EgoInfoProvider>
    
}

function EgoCardContent():ReactElement{
    const {EgoInfoValue,setEgoInfoValue,reset} = useEgoInfoContext()
    const {setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb} = useSettingMenuContext() 
    const domRef=useRef(null)
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
            registerDomRef(domRef)
        })
    },[])

    useEffect(()=>{
        changeSaveInfo(new EgoInfo(EgoInfoValue))
        //Save the last change
        indexDB.currEgoSave.put(new EgoInfo(EgoInfoValue), 1)
    },[JSON.stringify(EgoInfoValue)])

    const [showMigrationWarning, setShowMigrationWarning] = useState(()=>{
        return !sessionStorage.getItem("migrationWarningDismissed")
    })

    return <StatusEffectProvider skillDetails={EgoInfoValue.skillDetails}>
        <DragAndDroppableSkillPreviewLayer/>
        {showMigrationWarning && <PopUpMenu setIsActive={()=>{
            sessionStorage.setItem("migrationWarningDismissed","true")
            setShowMigrationWarning(false)
        }}>
            <div className="migration-warning-popup">
                <h2>&#9888; Site Migration Notice</h2>
                <p>This site will be moving fom  <a href="https://limbus-company-id-creator.netlify.app" target="_blank" rel="noreferrer">limbus-company-id-creator.netlify.app</a> to a new domain on <strong>February 13th, 5:00 PM KST</strong>.</p>
                <p>Local saves are stored in your browser and <strong>will not transfer</strong> to the new domain. Please move your local saves to the cloud before then.</p>
                <p>New domain: <a href="https://limbus-company-id-creator.com" target="_blank" rel="noreferrer">limbus-company-id-creator.com</a></p>
            </div>
        </PopUpMenu>}
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
    </StatusEffectProvider>
}