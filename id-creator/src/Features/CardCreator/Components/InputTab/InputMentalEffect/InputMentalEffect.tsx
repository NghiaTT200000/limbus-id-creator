import { IMentalEffect } from "Features/CardCreator/Types/Skills/MentalEffect/IMentalEffect";
import React, { useEffect } from "react";
import { ReactElement } from "react";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import EditableAutoCorrect from "../Components/EditableAutoCorrectInput/EditableAutoCorrect";
import DeleteIcon from "Assets/Icons/DeleteIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import replaceKeyWord from "../Components/EditableAutoCorrectInput/Functions/replaceKeyWord";
import { useForm } from "react-hook-form";

export default function InputMentalEffect({
    mentalEffect,
    keyWordList,
    changeSkill,
    changeSkillType,
    deleteSkill,
    collaspPage}:{
        mentalEffect:IMentalEffect,
        keyWordList:{[key:string]:string},
        changeSkill:(newInput:{[type:string]:string|number})=>void,
        changeSkillType:(newVal:string)=>void,
        deleteSkill:(inputID:string)=>void,
        collaspPage:()=>void}):ReactElement{

    const { setValue, watch, reset } = useForm<IMentalEffect>({ defaultValues: mentalEffect })

    useEffect(() => { reset(mentalEffect) }, [mentalEffect.inputId])

    useEffect(() => {
        const sub = watch((values) => changeSkill(values as any))
        return () => sub.unsubscribe()
    }, [watch, changeSkill])

    const effect = watch("effect")
    const type = watch("type")
    const inputId = watch("inputId")

    return <div className="input-page">
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <ArrowDownIcon></ArrowDownIcon>
            </div>
            <div className="delete-icon" onClick={()=>deleteSkill(inputId)}>
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
            <EditableAutoCorrect inputId={"effect"} content={effect} changeHandler={(e)=>setValue("effect",replaceKeyWord(e.target.value,keyWordList))} matchList={keyWordList}/>
            </div>
        </div>
    </div>
}