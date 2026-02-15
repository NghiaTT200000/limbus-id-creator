import { IMentalEffect } from "Features/CardCreator/Types/Skills/MentalEffect/IMentalEffect";
import React from "react";
import { ReactElement } from "react";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import TipTapEditor from "../Components/TipTapEditor/TipTapEditor";
import DeleteIcon from "Assets/Icons/DeleteIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import { useSkillForm } from "Features/CardCreator/Hooks/useSkillForm";

export default function InputMentalEffect({
    index,
    collaspPage}:{
        index:number,
        collaspPage:()=>void}):ReactElement{

    const { setValue, watch, deleteSkill, changeSkillType, keyWordList } = useSkillForm<IMentalEffect>(index)

    const effect = watch("effect")
    const type = watch("type")

    return <div className="input-page">
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <ArrowDownIcon></ArrowDownIcon>
            </div>
            <div className="delete-icon" onClick={()=>deleteSkill()}>
                <DeleteIcon></DeleteIcon>
            </div>
        </div>
        <ChangeInputType changeSkillType={changeSkillType} type={type}/>
        <div className="input-group-container">
            <div className="input-container">
            <label className="input-label" htmlFor="effect">Mental effect:</label>
            <p className="effect-guide">To enter a status effect/coin effect/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[heads_hit] -{">"}
                    <span className="center-element" contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='/Images/status-effect/Sinking_Deluge.webp' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                    <span className="center-element" contentEditable={false}><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1' /></span>/
                    <span className="center-element" contentEditable={false} style={{color:'#c7ff94'}}>[Heads Hit]</span>
                </p>
            <TipTapEditor inputId={"effect"} content={effect} changeHandler={(html)=>setValue("effect",html)} matchList={keyWordList}/>
            </div>
        </div>
    </div>
}
