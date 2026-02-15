import { ICustomEffect } from "Features/CardCreator/Types/Skills/CustomEffect/ICustomEffect";
import React, { useEffect } from "react";
import { ReactElement } from "react";
import "../InputPage.css"
import DeleteIcon from "Assets/Icons/DeleteIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import ChangeInputType from "../Components/ChangeInputType/ChangeInputType";
import TipTapEditor from "../Components/TipTapEditor/TipTapEditor";
import UploadImgBtn from "../Components/UploadImgBtn/UploadImgBtn";
import { compressAndReadImage } from "Features/CardCreator/Utils/CompressAndReadImage";
import { useForm } from "react-hook-form";

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

    const { register, setValue, watch, reset } = useForm<ICustomEffect>({ defaultValues: structuredClone(customEffect) })

    useEffect(() => { reset(structuredClone(customEffect)) }, [customEffect.inputId])

    useEffect(() => {
        const sub = watch((values) => changeSkill(structuredClone(values) as any))
        return () => sub.unsubscribe()
    }, [watch, changeSkill])

    const effectColor = watch("effectColor")
    const customImg = watch("customImg")
    const type = watch("type")
    const inputId = watch("inputId")
    const effect = watch("effect")

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
                    <button className="main-button" onClick={()=>setValue("customImg","")}>
                        <p className="center-element delete-txt"><DeleteIcon/> Delete</p>
                    </button>
                </div>
            </div>
        :<></>}
        <div className="input-group-container">
            <div className="input-container center-element">
                <UploadImgBtn onFileInputChange={async(e)=>{
                    if(e.currentTarget.files && e.currentTarget.files.length>0){
                        const url = await compressAndReadImage(e.currentTarget.files[0])
                        setValue("customImg",url)
                    }
                }} btnTxt={"Upload custom img (<= 100kb)"} maxSize={100000}/>
            </div>
            <div className="input-container center-element">
                <label htmlFor="effectColor">Choose the effect color: </label>
                <input type="color" id="effectColor" {...register("effectColor")}/>
            </div>
        </div>


        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Effect name:</label>
                <input className="input block" style={{color:effectColor}} type="text" id="name" {...register("name")} />
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
                <TipTapEditor inputId={"effect"} content={effect} changeHandler={(html)=>setValue("effect",html)} matchList={keyWordList}/>
            </div>
        </div>
    </div>
}