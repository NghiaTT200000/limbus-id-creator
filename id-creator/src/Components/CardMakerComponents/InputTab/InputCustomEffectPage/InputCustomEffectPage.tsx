import useInputs from "Utils/Hooks/useInputs";
import { ICustomEffect } from "interfaces/CustomEffect/ICustomEffect";
import React from "react";
import { ReactElement } from "react";
import "../InputPage.css"
import DeleteIcon from "Utils/Icons/DeleteIcon";
import MainButton from "components/MainButton/MainButton";
import ArrowDownIcon from "Utils/Icons/ArrowDownIcon";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import EditableAutoCorrect from "../Components/EditableAutoCorrectInput/EditableAutoCorrect";
import UploadImgBtn from "../Components/UploadImgBtn/UploadImgBtn";

export default function InputCustomEffectPage({
    customEffect,
    keyWordList,
    changeSkill,
    changeSkillType,
    deleteSkill,
    collaspPage}:{
        customEffect:ICustomEffect,
        keyWordList:{[key:string]:string},
        changeSkill:(newInput:{[type:string]:string|number})=>void,
        changeSkillType:(newVal:string)=>void,
        deleteSkill:(inputID:string)=>void,
        collaspPage:()=>void}):ReactElement{
    const {onChangeInput,onChangeFileWithName,onChangeAutoCorrectInput}=useInputs(customEffect as any,changeSkill)

    const{
        name,
        effectColor,
        effect,
        customImg,
        type,
        inputId
    } = customEffect
    
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
        {customImg?
            <div className="input-group-container">
                <div className="input-container center-element">
                    <img className="status-icon" src={customImg} alt="custom-status-img" />
                    <MainButton component={<p className="center-element delete-txt"><DeleteIcon/> Delete</p>} clickHandler={()=>changeSkill({...customEffect,customImg:""})} btnClass="main-button"/>
                </div>
            </div>     
        :<></>}
        <div className="input-group-container">
            <div className="input-container center-element">
                <UploadImgBtn onFileInputChange={onChangeFileWithName("customImg")} btnTxt={"Upload custom img (<= 100kb)"} maxSize={100000}/>
            </div>
            <div className="input-container center-element">
                <label htmlFor="effectColor">Choose the effect color: </label>
                <input type="color" name="effectColor" id="effectColor" value={effectColor} onChange={onChangeInput()}/>
            </div>
        </div>
        
        
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Effect name:</label>
                <input className="input block" style={{color:effectColor}} type="text" name="name" id="name" value={name} onChange={onChangeInput()} />
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="effect">Effect description:</label>
                <p className="effect-guide">To enter a status effect/coin effect/attack effect, put them in square bracket with underscore instead of spacebar like [sinking_deluge]/[coin_1]/[heads_hit] -{">"} 
                    <span contentEditable={false} style={{color:"var(--Debuff-color)",textDecoration:"underline"}}><img className='status-icon' src='/Images/status-effect/Sinking_Deluge.webp' alt='sinking_deluge_icon' />Sinking Deluge</span>/
                    <span contentEditable={false}><img className='status-icon' src='/Images/status-effect/Coin_Effect_1.webp' alt='coin-effect-1' /></span>/
                    <span contentEditable={false} style={{color:'#c7ff94'}}>[Heads Hit]</span>
                </p>
                <EditableAutoCorrect inputId={"effect"} content={effect} changeHandler={onChangeAutoCorrectInput(keyWordList,"effect")} matchList={keyWordList}/>              
            </div>
        </div>
    </div>
}