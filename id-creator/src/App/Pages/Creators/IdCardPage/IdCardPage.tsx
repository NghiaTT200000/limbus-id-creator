import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'Styles/reset.css'
import 'Styles/style.css'
import '../Shared/Styles/EditorPage.css'
import { indexDB } from 'Features/CardCreator/Utils/IndexDB';
import DragAndDroppableSkillPreviewLayer from 'Features/CardCreator/Components/Card/components/DragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import CardMakerFooter from 'Features/CardCreator/Components/CardMakerFooter/CardMakerFooter';
import SettingMenu from 'Features/CardCreator/Components/SettingMenu/SettingMenu';
import { IdCard } from 'Features/CardCreator/Components/Card/IdCard';
import InputTabIdInfoContainer from 'Features/CardCreator/Components/InputTab/InputTabContainer/InputTabIdInfoContainer/InputTabIdInfoContainer';
import ResetMenu from 'Features/CardCreator/Components/ResetMenu/ResetMenu';
import { IdInfo } from 'Features/CardCreator/Types/IIdInfo';
import { registerDomRef } from 'Stores/Slices/ImgDomRefSlice';
import { useAppDispatch, useAppSelector } from 'Stores/AppStore';
import { setIdInfo, resetIdInfo } from 'Features/CardCreator/Stores/IdInfoSlice';
import { setSettingMenuSaveMode } from 'Stores/Slices/UiSlice';


export default function IdCardPage():ReactElement{
    const dispatch = useAppDispatch()
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const domRef=useRef(null)
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
                dispatch(setIdInfo(lastSave))
            }
            //Setting the save menu
            dispatch(setSettingMenuSaveMode("ID"))
            //Setting the domref for downloading
            registerDomRef(domRef)
        })
    },[])

    useEffect(()=>{
        //Save the last change
        indexDB.currIdSave.put(new IdInfo(idInfoValue),1)
    },[JSON.stringify(idInfoValue)])

    return <>
        <SettingMenu saveMode="ID"/>
        <DragAndDroppableSkillPreviewLayer/>
        <div className={`editor-container`}>
            <InputTabIdInfoContainer
                resetBtnHandler={()=>setResetMenuActive(!isResetMenuActive)}
                activeTab={activeTab}
                changeActiveTab={changeActiveTab} />
            <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={()=>dispatch(resetIdInfo())} />
            <div className='preview-container'>
                <IdCard ref={domRef} changeActiveTab={setActiveTab}/>
            </div>
        </div>
        <CardMakerFooter/>
    </>
}
