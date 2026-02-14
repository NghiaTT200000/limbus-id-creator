import React, { ReactElement } from "react";
import "../InputTabContainer.css"
import { IOffenseSkill, OffenseSkill } from "Features/CardCreator/Types/Skills/OffenseSkill/IOffenseSkill";
import { CustomEffect, ICustomEffect } from "Features/CardCreator/Types/Skills/CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill";
import { IMentalEffect, MentalEffect } from "Features/CardCreator/Types/Skills/MentalEffect/IMentalEffect";
import { IPassiveSkill, PassiveSkill } from "Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill";
import { useStatusEffect } from "Features/CardCreator/Hooks/useStatusEffect";
import InputCustomEffectPage from "../../InputCustomEffectPage/InputCustomEffectPage";
import InputDefenseSkillPage from "../../InputDefenseSkillPage/InputDefenseSkillPage";
import InputMentalEffect from "../../InputMentalEffect/InputMentalEffect";
import InputOffenseSkillPage from "../../InputOffenseSkillPage/InputOffenseSkillPage";
import InputPassivePage from "../../InputPassivePage/InputPassivePage";
import InputIdInfoStatPage from "../../InputStatPage/InputIdInfoStatPage/InputIdInfoStatPage";
import InputTabSide from "../../InputTabSide/InputTabSide";
import useAlert from "Hooks/useAlert";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setIdInfo } from "Features/CardCreator/Stores/IdInfoSlice";


export default function InputTabIdInfoContainer({
        resetBtnHandler,
        activeTab,
        changeActiveTab,
    }:{
        resetBtnHandler:()=>void,
        activeTab:number,
        changeActiveTab:(i:number)=>void}):ReactElement{
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const dispatch = useAppDispatch()
    const statusEffect = useStatusEffect(idInfoValue.skillDetails)
    const {addAlert} = useAlert()


    function setIdInfoValue(newVal: any) {
        if (typeof newVal === "function") {
            dispatch(setIdInfo(newVal(idInfoValue)))
        } else {
            dispatch(setIdInfo(newVal))
        }
    }

    function deleteHandler(id:string){
        for(let i = 0;i<idInfoValue.skillDetails.length;i++){
            if(idInfoValue.skillDetails[i].inputId===id){
                const newSkillDetails = [...idInfoValue.skillDetails]
                newSkillDetails.splice(i,1)

                setIdInfoValue({...idInfoValue, skillDetails: newSkillDetails})
                if(i===activeTab&&i===idInfoValue.skillDetails.length) changeActiveTab(activeTab-1)
            }
        }
    }

    function addTab(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect){
        if(idInfoValue.skillDetails.length>=20)addAlert("Failure","There can only be 20 or less skill/effects in an ID")
        else setIdInfoValue({...idInfoValue,skillDetails:[...idInfoValue.skillDetails,skill]})
    }

    function showInputPage(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never,index:number){
        if(!skill) return;
        function changeSkill(newSkill:any){
            const newSkillDetails = [...idInfoValue.skillDetails]
            newSkillDetails[index]=newSkill
            setIdInfoValue({...idInfoValue, skillDetails: newSkillDetails})
        }

        function changeSkillType(newVal:string){
            const newSkillDetails = [...idInfoValue.skillDetails]

            switch(newVal){
                case "OffenseSkill":{
                    newSkillDetails.splice(index,1,new OffenseSkill())
                    break
                }
                case "DefenseSkill":{
                    newSkillDetails.splice(index,1,new DefenseSkill())
                    break
                }
                case "PassiveSkill":{
                    newSkillDetails.splice(index,1,new PassiveSkill())
                    break
                }
                case "CustomEffect":{
                    newSkillDetails.splice(index,1,new CustomEffect())
                    break
                }
                case "MentalEffect":{
                    newSkillDetails.splice(index,1,new MentalEffect())
                    break
                }
            }
            setIdInfoValue({...idInfoValue, skillDetails: newSkillDetails})
        }

        switch(skill.type){
            case "OffenseSkill":{
                return <InputOffenseSkillPage offenseSkill={skill as IOffenseSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
            case "DefenseSkill":{
                return <InputDefenseSkillPage defenseSkill={skill as IDefenseSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
            case "PassiveSkill":{
                return <InputPassivePage passiveSkill={skill as IPassiveSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
            case "CustomEffect":{
                return <InputCustomEffectPage customEffect={skill as ICustomEffect} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
            case "MentalEffect":{
                return <InputMentalEffect mentalEffect={skill as IMentalEffect} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
        }
    }

    return <div className="input-tab-container">
        <InputTabSide sinnerIcon={idInfoValue.sinnerIcon} skillDetails={idInfoValue.skillDetails} changeTab={changeActiveTab}
        activeTab={activeTab} addTab={addTab} resetBtnHandler={resetBtnHandler}></InputTabSide>
        {(activeTab!==-2)?(activeTab===-1)?<InputIdInfoStatPage  collaspPage={()=>changeActiveTab(-2)}/>:showInputPage(idInfoValue.skillDetails[activeTab],activeTab):<></>}
    </div>
}
