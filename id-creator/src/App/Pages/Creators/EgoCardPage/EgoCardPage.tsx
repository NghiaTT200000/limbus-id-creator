import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'Styles/reset.css'
import 'Styles/style.css'
import '../Shared/Styles/EditorPage.css'
import { indexDB } from 'Features/CardCreator/Utils/IndexDB';
import DragAndDroppableSkillPreviewLayer from 'Features/CardCreator/Components/Card/components/DragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import { EgoCard } from 'Features/CardCreator/Components/Card/EgoCard';
import InputTabContainer from 'Features/CardCreator/Components/InputTab/InputTabContainer/InputTabContainer';
import ResetMenu from 'Features/CardCreator/Components/ResetMenu/ResetMenu';
import SettingMenu from 'Features/CardCreator/Components/SettingMenu/SettingMenu';
import { EgoInfo } from 'Features/CardCreator/Types/IEgoInfo';
import CardMakerFooter from 'Features/CardCreator/Components/CardMakerFooter/CardMakerFooter';
import { registerDomRef } from 'Stores/Slices/ImgDomRefSlice';
import { useAppDispatch, useAppSelector } from 'Stores/AppStore';
import { setEgoInfo, resetEgoInfo } from 'Features/CardCreator/Stores/EgoInfoSlice';
import { setSettingMenuSaveMode } from 'Stores/Slices/UiSlice';
import CardModeContext from 'Features/CardCreator/Contexts/CardModeContext';


export default function EgoCardPage():ReactElement{
    const dispatch = useAppDispatch()
    const egoInfoValue = useAppSelector(state => state.egoInfo.value)
    const domRef=useRef(null)
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
                dispatch(setEgoInfo(lastSave))
            }
            //Setting the save menu
            dispatch(setSettingMenuSaveMode("EGO"))
            //Setting the domref for downloading
            registerDomRef(domRef)
        })
    },[])

    useEffect(()=>{
        //Save the last change
        indexDB.currEgoSave.put(new EgoInfo(egoInfoValue), 1)
    },[JSON.stringify(egoInfoValue)])

    return <CardModeContext.Provider value="ego">
        <SettingMenu saveMode="EGO"/>
        <DragAndDroppableSkillPreviewLayer/>
        <div className={`editor-container`}>
            <InputTabContainer
                resetBtnHandler={()=>setResetMenuActive(!isResetMenuActive)}
                activeTab={activeTab}
                changeActiveTab={changeActiveTab} />
            <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={()=>dispatch(resetEgoInfo())} />
            <div className='preview-container'>
                <EgoCard ref={domRef} changeActiveTab={setActiveTab}/>
            </div>
        </div>
        <CardMakerFooter/>
    </CardModeContext.Provider>
}
