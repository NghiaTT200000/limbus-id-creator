import AddIcon from "Utils/Icons/AddIcon";
import React, { useState } from "react";
import "./InputTabSide.css"
import ResetIcon from "Utils/Icons/ResetIcon";
import { IOffenseSkill, OffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { DefenseSkill, IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { CustomEffect, ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IMentalEffect, MentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IPassiveSkill, PassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";

export default function InputTabSide({sinnerIcon,
    skillDetails,
    changeTab,
    activeTab,
    addTab,
    resetBtnHandler}:{sinnerIcon:string,
        skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[],changeTab:(newTab:number)=>void,
        activeTab:number,
        addTab:(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect)=>void,
        resetBtnHandler:()=>void}
    ){
    
    const [isAdding,setIsAdding] = useState(false)

    function convertTabIcon(type:string):string{
        switch (type){
            case "OffenseSkill":{
                return "Images/stat/stat_attack.png"
            }
            case "DefenseSkill":{
                return "Images/stat/stat_defense.png"
            }
            case "PassiveSkill":{
                return "Images/status-effect/Aggro.png"
            }
            case "CustomEffect":{
                return "Images/status-effect/Discard.png"
            }
            case "MentalEffect":{
                return "Images/Sanity.png"
            }
        }
        return ""
    }

    return <ul className="input-tab-side-container">
        <li className="input-tab-side icon-side" onClick={()=>{
            if(skillDetails.length<20) setIsAdding(!isAdding)
        }}>
            <AddIcon/>
        </li>
        <ul className="input-tab-side-mini-container">
            <li className={`input-tab-side ${activeTab===-1?"active":""}`} onClick={()=>changeTab(-1)}
                style={{
                    background:'var(--None-input-page)'
                }}>
                <img src={sinnerIcon} alt="" />
            </li>
            {skillDetails.map((skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never,i:number)=>{
                let tabIcon = convertTabIcon(skill.type)
                
                if(skill.type==="CustomEffect"){
                    if((skill as ICustomEffect).customImg)tabIcon=(skill as ICustomEffect).customImg
                }

                return <li className={`input-tab-side ${activeTab===i?"active":""}`} key={skill.inputId} 
                onClick={()=>changeTab(i)} style={{
                        background:`var(--${skill.type==="DefenseSkill"||skill.type==="OffenseSkill"?(skill as IOffenseSkill|IDefenseSkill).skillAffinity:"None"}-input-page)`
                    }}>
                    <img src={tabIcon} alt="" />
                    {/* <span className="input-tab-delete-icon" >
                        <DeleteIcon/>
                    </span> */}
                </li>
            })}
        </ul>
        
        <li className="input-tab-side icon-side reset-icon-side"
            onClick={resetBtnHandler}>
            <ResetIcon/>
        </li>
        {isAdding?<ul className="input-tab-side-add-option-container">
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(new OffenseSkill())
                    setIsAdding(false)
                }}>
                Add offense skill <img src="Images/stat/stat_attack.png" alt="attk_icon" />
            </li>
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(new DefenseSkill())
                    setIsAdding(false)
                }}>
                Add defense skill <img src="Images/stat/stat_defense.png" alt="defense_icon" />
            </li>
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(new PassiveSkill())
                    setIsAdding(false)
                }}>
                Add passive skill <img src="Images/status-effect/Aggro.png" alt="passive_icon" />
            </li>
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(new CustomEffect())
                    setIsAdding(false)
                }}>
                Add custom effect <img src="Images/status-effect/Discard.png" alt="custom_icon" />
            </li>
            <li className="input-tab-side-add-option"
                onClick={()=>{
                    addTab(new MentalEffect())
                    setIsAdding(false)
                }}>
                    Add mental effect <img src="Images/Sanity.png" alt="mental_icon" />
            </li>
        </ul>:<></>}
    </ul>
}