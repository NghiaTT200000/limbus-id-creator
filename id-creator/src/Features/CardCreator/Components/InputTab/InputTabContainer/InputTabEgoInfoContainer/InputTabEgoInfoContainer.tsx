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
import InputEgoInfoStatPage from "../../InputStatPage/InputEgoInfoStatPage/InputEgoInfoStatPage";
import InputTabSide from "../../InputTabSide/InputTabSide";
import useAlert from "Hooks/useAlert";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setEgoInfo } from "Features/CardCreator/Stores/EgoInfoSlice";


export default function InputTabEgoInfoContainer({
        resetBtnHandler,
        activeTab,
        changeActiveTab,
    }:{
        resetBtnHandler:()=>void,
        activeTab:number,
        changeActiveTab:(i:number)=>void}):ReactElement{
    const EgoInfoValue = useAppSelector(state => state.egoInfo.value)
    const dispatch = useAppDispatch()
    const statusEffect = useStatusEffect(EgoInfoValue.skillDetails)
    const {addAlert} = useAlert()


    function setEgoInfoValue(newVal: any) {
        if (typeof newVal === "function") {
            dispatch(setEgoInfo(newVal(EgoInfoValue)))
        } else {
            dispatch(setEgoInfo(newVal))
        }
    }

    function deleteHandler(id:string){
        for(let i = 0;i<EgoInfoValue.skillDetails.length;i++){
            if(EgoInfoValue.skillDetails[i].inputId===id){
                const newSkillDetails = [...EgoInfoValue.skillDetails]
                newSkillDetails.splice(i,1)

                setEgoInfoValue({...EgoInfoValue, skillDetails: newSkillDetails})
                if(i===activeTab&&i===EgoInfoValue.skillDetails.length) changeActiveTab(activeTab-1)
            }
        }
    }

    function addTab(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect){
        if(EgoInfoValue.skillDetails.length>=20)addAlert("Failure","There can only be 20 or less skill/effects in an ID")
        else setEgoInfoValue({...EgoInfoValue,skillDetails:[...EgoInfoValue.skillDetails,skill]})
    }


    function showInputPage(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never,index:number){
        if(!skill) return;
        function changeSkill(newSkill:any){
            const newSkillDetails = [...EgoInfoValue.skillDetails]
            newSkillDetails[index]=newSkill
            setEgoInfoValue({...EgoInfoValue, skillDetails: newSkillDetails})
        }

        function changeSkillType(newVal:string){
            const newSkillDetails = [...EgoInfoValue.skillDetails]

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
            setEgoInfoValue({...EgoInfoValue, skillDetails: newSkillDetails})
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
            <InputTabSide sinnerIcon={EgoInfoValue.sinnerIcon} skillDetails={EgoInfoValue.skillDetails} changeTab={changeActiveTab}
            activeTab={activeTab} addTab={addTab} resetBtnHandler={resetBtnHandler}></InputTabSide>
            {(activeTab!==-2)?(activeTab===-1)?<InputEgoInfoStatPage  collaspPage={()=>changeActiveTab(-2)}/>:showInputPage(EgoInfoValue.skillDetails[activeTab],activeTab):<></>}
        </div>
}
