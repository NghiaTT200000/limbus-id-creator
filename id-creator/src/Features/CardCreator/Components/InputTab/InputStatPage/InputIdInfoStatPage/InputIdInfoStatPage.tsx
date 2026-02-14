import React, { useEffect } from "react";
import { ReactElement } from "react";
import "../../InputPage.css"
import "../InputStatPage.css"
import DeleteIcon from "Assets/Icons/DeleteIcon";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import SinnerIconInput from "../SinnerIconInput/SinnerIconInput";
import SinnerRarityIconInput from "../SinnerRarityInput/SinnerRarityInput";
import SinnerSplashArtRepositionInput from "../SinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import UploadImgBtn from "../../Components/UploadImgBtn/UploadImgBtn";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setIdInfo } from "Features/CardCreator/Stores/IdInfoSlice";
import { compressAndReadImage } from "Features/CardCreator/Utils/CompressAndReadImage";
import { useForm } from "react-hook-form";
import { IIdInfo } from "Features/CardCreator/Types/IIdInfo";

export default function InputIdInfoStatPage({collaspPage}:{collaspPage:()=>void}):ReactElement{
    const idInfoValue = useAppSelector(state => state.idInfo.value)
    const dispatch = useAppDispatch()

    const { register, setValue, watch, reset } = useForm<IIdInfo>({ defaultValues: structuredClone(idInfoValue) })

    useEffect(() => { reset(structuredClone(idInfoValue)) }, [JSON.stringify(idInfoValue)])

    useEffect(() => {
        const sub = watch((values) => dispatch(setIdInfo(structuredClone(values) as any)))
        return () => sub.unsubscribe()
    }, [watch, dispatch])

    const splashArt = watch("splashArt")
    const splashArtScale = watch("splashArtScale")
    const splashArtTranslation = watch("splashArtTranslation")
    const slashResistant = watch("slashResistant")
    const pierceResistant = watch("pierceResistant")
    const bluntResistant = watch("bluntResistant")

    function changeResistantColor(value:number):string{
        if(value<1) return "var(--Endure)"
        if(value>=1.5) return "var(--Fatal)"

        return"var(--Normal)"
    }

    function changeResistantText(value:number):string{
        if(value<=0.5) return "Ineff"
        if(value<=0.75) return "Endure"
        if(value>=1.5) return "Weak"
        if(value>=2.0) return "Fatal"
        return "Normal"
    }

    return <div className="input-page input-stat-page">
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <ArrowDownIcon></ArrowDownIcon>
            </div>
        </div>
        <div className="sinner-icon-input-container">
            <p>Pick the sinner icon: </p>
            <SinnerIconInput/>
            <UploadImgBtn onFileInputChange={async(e)=>{
                if(e.currentTarget.files && e.currentTarget.files.length>0){
                    const url = await compressAndReadImage(e.currentTarget.files[0])
                    setValue("sinnerIcon",url)
                }
            }} btnTxt={"Upload sinner icon (<= 100kb)"} maxSize={100000}/>
        </div>
        <div className="sinner-color-input-container">
            <p>Pick a color for your sinner: </p>
            <input className="sinner-color-input" type="color" id="sinnerColor" {...register("sinnerColor")}/>
        </div>
        {splashArt?
            <>
                <div className="input-group-container">
                    <p style={{textAlign:"center"}}>Control the position of the splash art by dragging and zooming on this circle:</p>
                    <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value:{scale:number,translation:{x:number,y:number}})=>{
                        setValue("splashArtScale",value.scale)
                        setValue("splashArtTranslation",value.translation)
                    }}/>
                </div>
                <div className="input-group-container">
                    <button onClick={()=>setValue("splashArt","")} className="main-button">
                        <p className="center-element delete-txt"><DeleteIcon/> Delete splash art</p>
                    </button>
                </div>
            </>
           :<></>}

        <UploadImgBtn onFileInputChange={async(e)=>{
            if(e.currentTarget.files && e.currentTarget.files.length>0){
                const url = await compressAndReadImage(e.currentTarget.files[0])
                setValue("splashArt",url)
            }
        }} btnTxt={"Upload splash art (<= 4mb)"} maxSize={4000000}/>

        <div>
            <p>Pick the sinner rarity: </p>
            <SinnerRarityIconInput/>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="title">Title: </label>
                <input type="text" className="input stat-page-input-border block" id="title" {...register("title")}/>
            </div>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="name">Name: </label>
                <input type="text" className="input stat-page-input-border" id="name" {...register("name")}/>
            </div>
        </div>
        <div className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="minSpeed"><img className="stat-icon" src="/Images/stat/stat_speed.webp" alt="speed_icon" /></label>
                <div>
                    <input className="input stat-page-input-border input-number" type="number" id="minSpeed" {...register("minSpeed")}/> -
                    <input className="input stat-page-input-border input-number" type="number" id="maxSpeed" {...register("maxSpeed")}/>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="hp"><img className="stat-icon" src="/Images/stat/stat_hp.webp" alt="hp_icon" /></label>
                <input type="number" className="input stat-page-input-border input-number" id="hp" {...register("hp")}/>
            </div>
            <div className="stat-input-container">
                <label htmlFor="defenseLevel"><img className="stat-icon" src="/Images/stat/stat_def.webp" alt="def_icon" /></label>
                <input type="number" className="input stat-page-input-border input-number" id="defenseLevel" {...register("defenseLevel")}/>
            </div>
            <div className="stat-input-container">
                <label htmlFor="staggerResist">Stagger Threshold:</label>
                <input type="text" className="input stat-page-input-border" id="staggerResist" {...register("staggerResist")}/>
            </div>
        </div>
        <div  className="sinner-stat-inputs">
            <div className="stat-input-container">
                <label htmlFor="slashResistant"><img className="stat-icon" src="/Images/attack/attackt_slash.webp" alt="attackt_slash" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(slashResistant)}}>{changeResistantText(slashResistant)}</p>
                        <input style={{color:changeResistantColor(slashResistant)}} type="number" className="input stat-page-input-border input-number" {...register("slashResistant")} id="slashResistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="pierceResistant"><img className="stat-icon" src="/Images/attack/attackt_pierce.webp" alt="attackt_pierce" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(pierceResistant)}}>{changeResistantText(pierceResistant)}</p>
                        <input style={{color:changeResistantColor(pierceResistant)}} type="number" className="input stat-page-input-border input-number" {...register("pierceResistant")} id="pierceResistant"/>
                    </div>
                </div>
            </div>
            <div className="stat-input-container">
                <label htmlFor="bluntResistant"><img className="stat-icon" src="/Images/attack/attackt_blunt.webp" alt="attackt_blunt" /></label>
                <div className="resistant-content">
                    <div>
                        <p style={{color:changeResistantColor(bluntResistant)}}>{changeResistantText(bluntResistant)}</p>
                        <input style={{color:changeResistantColor(bluntResistant)}} type="number" className="input stat-page-input-border input-number" {...register("bluntResistant")} id="bluntResistant"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}