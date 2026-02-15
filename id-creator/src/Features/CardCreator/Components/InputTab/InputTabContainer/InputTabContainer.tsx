import React, { ReactElement } from "react";
import "./InputTabContainer.css"
import { IOffenseSkill } from "Features/CardCreator/Types/Skills/OffenseSkill/IOffenseSkill";
import { ICustomEffect } from "Features/CardCreator/Types/Skills/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Features/CardCreator/Types/Skills/MentalEffect/IMentalEffect";
import { IPassiveSkill } from "Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill";
import InputCustomEffectPage from "../InputCustomEffectPage/InputCustomEffectPage";
import InputDefenseSkillPage from "../InputDefenseSkillPage/InputDefenseSkillPage";
import InputMentalEffect from "../InputMentalEffect/InputMentalEffect";
import InputOffenseSkillPage from "../InputOffenseSkillPage/InputOffenseSkillPage";
import InputPassivePage from "../InputPassivePage/InputPassivePage";
import InputIdInfoStatPage from "../InputStatPage/InputIdInfoStatPage/InputIdInfoStatPage";
import InputEgoInfoStatPage from "../InputStatPage/InputEgoInfoStatPage/InputEgoInfoStatPage";
import InputTabSide from "../InputTabSide/InputTabSide";
import useAlert from "Hooks/useAlert";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { addIdInfoSkill } from "Features/CardCreator/Stores/IdInfoSlice";
import { addEgoInfoSkill } from "Features/CardCreator/Stores/EgoInfoSlice";
import { useCardMode } from "Features/CardCreator/Contexts/CardModeContext";
import { SkillDetail } from "Features/CardCreator/Types/SkillDetail";


export default function InputTabContainer({
        resetBtnHandler,
        activeTab,
        changeActiveTab,
    }:{
        resetBtnHandler:()=>void,
        activeTab:number,
        changeActiveTab:(i:number)=>void}):ReactElement{
    const mode = useCardMode()
    const dispatch = useAppDispatch()
    const skillDetails = useAppSelector(state =>
        mode === "id" ? state.idInfo.value.skillDetails : state.egoInfo.value.skillDetails
    )
    const sinnerIcon = useAppSelector(state =>
        mode === "id" ? state.idInfo.value.sinnerIcon : state.egoInfo.value.sinnerIcon
    )
    const {addAlert} = useAlert()

    function addTab(skill: IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect){
        if(skillDetails.length>=20) addAlert("Failure","There can only be 20 or less skill/effects")
        else dispatch(mode === "id" ? addIdInfoSkill(skill as SkillDetail) : addEgoInfoSkill(skill as SkillDetail))
    }

    function renderSkillPage(skill: IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never, index: number){
        if(!skill) return;
        const shared = { index, collaspPage: () => changeActiveTab(-2) }
        switch(skill.type){
            case "OffenseSkill":
                return <InputOffenseSkillPage {...shared} />
            case "DefenseSkill":
                return <InputDefenseSkillPage {...shared} />
            case "PassiveSkill":
                return <InputPassivePage {...shared} />
            case "CustomEffect":
                return <InputCustomEffectPage {...shared} />
            case "MentalEffect":
                return <InputMentalEffect {...shared} />
        }
    }

    return <div className="input-tab-container">
        <InputTabSide sinnerIcon={sinnerIcon} skillDetails={skillDetails} changeTab={changeActiveTab}
        activeTab={activeTab} addTab={addTab} resetBtnHandler={resetBtnHandler}></InputTabSide>
        {(activeTab!==-2)
            ? (activeTab===-1)
                ? (mode === "id" ? <InputIdInfoStatPage collaspPage={()=>changeActiveTab(-2)}/> : <InputEgoInfoStatPage collaspPage={()=>changeActiveTab(-2)}/>)
                : renderSkillPage(skillDetails[activeTab], activeTab)
            : <></>}
    </div>
}
