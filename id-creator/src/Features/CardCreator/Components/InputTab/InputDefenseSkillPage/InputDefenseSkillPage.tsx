import React from "react";
import { ReactElement } from "react";
import "../InputPage.css"
import useInputs from "Features/CardCreator/Hooks/useInputs";
import "../InputPage.css"
import { IDefenseSkill } from "Features/CardCreator/Types/Skills/DefenseSkill/IDefenseSkill";
import DeleteIcon from "Assets/Icons/DeleteIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import SinAffinityInput from "../Components/SinAffinityInput/SinAffinityInput";
import DamageTypeInput from "../Components/DamageTypeInput/DamageTypeInput";
import DefenseTypeInput from "../Components/DefenseTypeInput/DefenseTypeInput";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import EditableAutoCorrect from "../Components/EditableAutoCorrectInput/EditableAutoCorrect";
import UploadImgBtn from "../Components/UploadImgBtn/UploadImgBtn";

export default function InputDefenseSkillPage({
    defenseSkill,
    keyWordList,
    changeSkill,
    changeSkillType,
    deleteSkill,
    collaspPage}:{
        defenseSkill:IDefenseSkill,
        keyWordList:{[key:string]:string},
        changeSkill:(newInput:{[type:string]:string|number})=>void,
        changeSkillType:(newVal:string)=>void,
        deleteSkill:(inputID:string)=>void,
        collaspPage:()=>void}):ReactElement{
    const {onChangeFileWithName,onChangeDropDownMenu,onChangeInput,onChangeAutoCorrectInput}=useInputs(defenseSkill as any,changeSkill)

    const{
        skillLevel,
        skillAmt,
        skillImage,
        atkWeight,
        damageType,
        defenseType,
        name,
        skillAffinity,
        basePower,
        coinNo,
        coinPow,
        skillEffect,
        skillLabel,
        inputId,
        type
    }=defenseSkill


    

    return <div className="input-page input-defense-skill-page" style={{background:`var(--${skillAffinity}-input-page)`}}>
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <ArrowDownIcon></ArrowDownIcon>
            </div>
            <div className="delete-icon" onClick={()=>deleteSkill(inputId)}>
                <DeleteIcon></DeleteIcon>
            </div>
        </div>
        <ChangeInputType changeSkillType={changeSkillType} type={type}/>
        {skillImage?
            <div className="input-group-container">
                <div className="center-element-vertically">
                    <img className="preview-skill-image" src={skillImage} alt="custom-skill-img" />
                    <button className="main-button" onClick={()=>changeSkill({...defenseSkill,skillImage:""})}>
                        <p className="center-element delete-txt"><DeleteIcon/> Delete</p>
                    </button>
                </div>
            </div>
        :<></>}
        <div className="input-group-container">
            <UploadImgBtn onFileInputChange={onChangeFileWithName("skillImage")} btnTxt={"Upload skill img (<= 100kb)"} maxSize={100000}/>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <p className="input-label">Defense type:</p>
                <DefenseTypeInput onChangeDefenseType={onChangeDropDownMenu("defenseType")} activeDefenseType={defenseType}/>
            </div>
            <div className="input-container">
                <p className="input-label">Damage type:</p>
                <DamageTypeInput onChangeDamageType={onChangeDropDownMenu("damageType")} activeDamageType={damageType} disabled={defenseType!=="Counter"}/>
            </div>
        </div>

        <div className="input-group-container">
            <div className="input-container">
                <p className="input-label">Sin affinity:</p>
                <SinAffinityInput onChangeSinAffinity={onChangeDropDownMenu("skillAffinity")} activeSin={skillAffinity}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="basePower">Base power:</label>
                <input className="input block" type="number" name="basePower" id="basePower" value={basePower} onChange={onChangeInput()}/>
            </div>
            <div className="input-container">
                <label className="input-label" htmlFor="coinPow">Coin power:</label>
                <input className="input block" type="number" name="coinPow" id="coinPow" value={coinPow} onChange={onChangeInput()}/>
            </div>

        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="coinNo">Coin number:</label>
                <input className="input block" type="number" name="coinNo" id="coinNo" value={coinNo} onChange={onChangeInput()}/>
            </div>
            <div className="input-container">
                <label className="input-label" htmlFor="skillLevel">Offense level:</label>
                <input className="input block" type="number" name="skillLevel" id="skillLevel" value={skillLevel} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="skillAmt">Amt:</label>
                <input className="input block" type="number" name="skillAmt" id="skillAmt" value={skillAmt} onChange={onChangeInput()}/>
            </div>
            <div className="input-container">
                <label className="input-label" htmlFor="atkWeight">Atk weight:</label>
                <input className="input block" type="number" name="atkWeight" id="atkWeight" value={atkWeight} onChange={onChangeInput()}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="skillLabel">Skill label:</label>
                <input className="input block" type="text" name="skillLabel" id="skillLabel" value={skillLabel} onChange={onChangeInput()} />
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Skill name:</label>
                <input className="input block" type="text" name="name" id="name" value={name} onChange={onChangeInput()} />
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="skillEffect">Skill description:</label>
                <p className="effect-guide">To enter a status effect/coin effect/special coin(Unbreakable coin)/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[coin_1_unbreakable]/[heads_hit] -{">"} 
                    <span contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='/Images/status-effect/Sinking_Deluge.webp' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                    <span contentEditable={false}><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1' /></span>/
                    <span contentEditable={false} className='center-element'><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1-unbreakable' /> <span contentEditable={false} className='center-element' style={{color:"var(--Neutral-color)",textDecoration:"underline"}}><img className='status-icon' src='/Images/Unbreakable_Coin.webp' alt='unbreakable_coin_icon' />Unbreakable Coin</span></span>
                    <span contentEditable={false} style={{color:'#c7ff94'}}>[Heads Hit]</span>
                </p>
                <EditableAutoCorrect inputId={"skillEffect"} content={skillEffect} changeHandler={onChangeAutoCorrectInput(keyWordList,"skillEffect")} matchList={keyWordList}/>             
            </div>
        </div>
    </div>
}