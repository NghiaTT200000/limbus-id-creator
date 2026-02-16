import React, { useEffect } from "react";
import { ReactElement } from "react";
import "../../InputPage.css"
import "../InputStatPage.css"
import DropDown from "Components/DropDown/DropDown";
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";
import AccordionSection from "Components/AccordionSection/AccordionSection";
import { EgoLevelDropDown } from "../EgoLevelDropDown/EgoLevelDropDown";
import SinnerEgoIconInput from "../SinnerEgoIconInput/SinnerEgoIconInput";
import SinnerSplashArtRepositionInput from "../SinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import UploadImgBtn from "../../Components/UploadImgBtn/UploadImgBtn";
import { useAppSelector, useAppDispatch } from "Stores/AppStore";
import { setEgoInfo } from "Features/CardCreator/Stores/EgoInfoSlice";
import { compressAndReadImage } from "Features/CardCreator/Utils/CompressAndReadImage";
import { useForm } from "react-hook-form";
import { IEgoInfo } from "Features/CardCreator/Types/IEgoInfo";

export default function InputStatPage({collaspPage}:{collaspPage:()=>void}):ReactElement{
    const EgoInfoValue = useAppSelector(state => state.egoInfo.value)
    const dispatch = useAppDispatch()

    const { register, setValue, watch, reset } = useForm<IEgoInfo>({ defaultValues: structuredClone(EgoInfoValue) })

    const registerNumber = (name: string) => {
        const reg = register(name as any, { valueAsNumber: true })
        return {
            ...reg,
            onBlur: (e: any) => {
                reg.onBlur(e)
                if (isNaN(e.target.valueAsNumber) || e.target.value === '') {
                    setValue(name as any, 0)
                }
            }
        }
    }

    useEffect(() => { reset(structuredClone(EgoInfoValue)) }, [JSON.stringify(EgoInfoValue)])

    useEffect(() => {
        const sub = watch((values) => dispatch(setEgoInfo(structuredClone(values) as any)))
        return () => sub.unsubscribe()
    }, [watch, dispatch])

    const splashArt = watch("splashArt")
    const splashArtScale = watch("splashArtScale")
    const splashArtTranslation = watch("splashArtTranslation")
    const sinResistant = watch("sinResistant")

    function changeResistantColor(value:number):string{
        if(value<1) return "var(--Endure)"
        if(value>=2.0) return "var(--Fatal)"

        return"var(--Normal)"
    }

    function changeResistantText(value:number):string{
        if(value<=0.5) return "Ineff"
        if(value<1) return "Endure"
        if(value>=2.0) return "Fatal"
        return "Normal"
    }

    return <div className="input-page input-stat-page">
        <div className="input-page-icon-container">
            <div className="collasp-icon" onClick={collaspPage}>
                <ArrowDownIcon></ArrowDownIcon>
            </div>
        </div>

        <AccordionSection title="Ego General Info">
            <div className="sinner-icon-input-container">
                <p>Pick the sinner icon: </p>
                <SinnerEgoIconInput/>
                <UploadImgBtn name="sinner-icon-image-input" id="sinner-icon-image-input" onFileInputChange={async (e)=>{
                    if(e.currentTarget.files && e.currentTarget.files.length>0){
                        const url = await compressAndReadImage(e.currentTarget.files[0])
                        setValue("sinnerIcon",url)
                    }
                }} btnTxt={"Upload sinner icon (<= 80kb)"} maxSize={80000}/>
            </div>
            <div className="sinner-color-input-container">
                <p>Pick a color for your sinner: </p>
                <input className="sinner-color-input" type="color" id="sinnerColor" {...register("sinnerColor")}/>
            </div>
            {splashArt?<div className="input-group-container">
                    <p className="center-element">Delete the splash art? <span className="material-symbols-outlined delete-splash-art-btn" onClick={()=>setValue("splashArt","")}>
                        delete
                    </span></p>
                    <p style={{textAlign:"center"}}>Control the position of the splash art by dragging and zooming on this circle:</p>
                    <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value:{scale:number,translation:{x:number,y:number}})=>{
                        setValue("splashArtScale",value.scale)
                        setValue("splashArtTranslation",value.translation)
                    }}/>
                </div>:<></>}
            <UploadImgBtn name="splash-art-img-input" id="splash-art-img-input" onFileInputChange={async (e)=>{
                if(e.currentTarget.files && e.currentTarget.files.length>0){
                    const url = await compressAndReadImage(e.currentTarget.files[0])
                    setValue("splashArt",url)
                }
            }} btnTxt={"Upload splash art (<= 1.2mb)"} maxSize={1200000}/>
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
        </AccordionSection>

        <AccordionSection title="Ego Stats">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label">Ego level:</label>
                    <DropDown dropDownEl={EgoLevelDropDown} cb={(newVal)=>setValue("egoLevel",newVal)}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label htmlFor="sanityCost" className="input-label">Sanity cost:</label>
                    <input type="number" className="input stat-page-input-border" id="sanityCost" {...registerNumber("sanityCost")} />
                </div>
            </div>
            <p className="input-label">Sin cost:</p>
                <div className="sin-input-item input-container">
                    <label className="input-label" htmlFor="wrath_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" /> <span>Wrath</span></label>
                    <input type="number" className="input stat-page-input-border" {...registerNumber("sinCost.wrath_cost")} id="wrath_cost"/>
                </div>
                <div className="sin-input-item input-container">
                    <label className="input-label" htmlFor="lust_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-input-resistant-icon" /> <span>Lust</span></label>
                    <input type="number" className="input stat-page-input-border" {...registerNumber("sinCost.lust_cost")} id="lust_cost"/>
                </div>
                <div className="sin-input-item input-container">
                    <label className="input-label" htmlFor="sloth_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-input-resistant-icon" /> <span>Sloth</span></label>
                    <input type="number" className="input stat-page-input-border" {...registerNumber("sinCost.sloth_cost")} id="sloth_cost"/>
                </div>
                <div className="sin-input-item input-container">
                    <label className="input-label" htmlFor="gluttony_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-input-resistant-icon" /> <span>Gluttony</span></label>
                    <input type="number" className="input stat-page-input-border" {...registerNumber("sinCost.gluttony_cost")} id="gluttony_cost"/>
                </div>
                <div className="sin-input-item input-container">
                    <label className="input-label" htmlFor="gloom_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-input-resistant-icon" /> <span>Gloom</span></label>
                    <input type="number" className="input stat-page-input-border" {...registerNumber("sinCost.gloom_cost")} id="gloom_cost"/>
                </div>
                <div className="sin-input-item input-container">
                    <label className="input-label" htmlFor="pride_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-input-resistant-icon" /> <span>Pride</span></label>
                    <input type="number" className="input stat-page-input-border" {...registerNumber("sinCost.pride_cost")} id="pride_cost"/>
                </div>
                <div className="sin-input-item input-container">
                    <label className="input-label" htmlFor="envy_cost"><img className="stat-icon" src="/Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-input-resistant-icon" /> <span>Envy</span></label>
                    <input type="number" className="input stat-page-input-border" {...registerNumber("sinCost.envy_cost")} id="envy_cost"/>
                </div>
            <p className="input-label">Sin resistant:</p>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="wrath_resistant">
                        <img className="stat-icon" src="/Images/sin-affinity/affinity_Wrath_big.webp" alt="wrath-input-resistant-icon" />
                        <span>Wrath (<span style={{color:changeResistantColor(sinResistant?.wrath_resistant)}}>{changeResistantText(sinResistant?.wrath_resistant)}</span>)</span>
                    </label>
                    <input style={{color:changeResistantColor(sinResistant?.wrath_resistant)}} type="number" className="input stat-page-input-border" {...registerNumber("sinResistant.wrath_resistant")} id="wrath_resistant"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="lust_resistant">
                        <img className="stat-icon" src="/Images/sin-affinity/affinity_Lust_big.webp" alt="Lust-input-resistant-icon" />
                        <span>Lust (<span style={{color:changeResistantColor(sinResistant?.lust_resistant)}}>{changeResistantText(sinResistant?.lust_resistant)}</span>)</span>
                    </label>
                    <input style={{color:changeResistantColor(sinResistant?.lust_resistant)}} type="number" className="input stat-page-input-border" {...registerNumber("sinResistant.lust_resistant")} id="lust_resistant"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="sloth_resistant">
                        <img className="stat-icon" src="/Images/sin-affinity/affinity_Sloth_big.webp" alt="Sloth-input-resistant-icon" />
                        <span>Sloth (<span style={{color:changeResistantColor(sinResistant?.sloth_resistant)}}>{changeResistantText(sinResistant?.sloth_resistant)}</span>)</span>
                    </label>
                    <input style={{color:changeResistantColor(sinResistant?.sloth_resistant)}} type="number" className="input stat-page-input-border" {...registerNumber("sinResistant.sloth_resistant")} id="sloth_resistant"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="gluttony_resistant">
                        <img className="stat-icon" src="/Images/sin-affinity/affinity_Gluttony_big.webp" alt="Gluttony-input-resistant-icon" />
                        <span>Gluttony (<span style={{color:changeResistantColor(sinResistant?.gluttony_resistant)}}>{changeResistantText(sinResistant?.gluttony_resistant)}</span>)</span>
                    </label>
                    <input style={{color:changeResistantColor(sinResistant?.gluttony_resistant)}} type="number" className="input stat-page-input-border" {...registerNumber("sinResistant.gluttony_resistant")} id="gluttony_resistant"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="gloom_resistant">
                        <img className="stat-icon" src="/Images/sin-affinity/affinity_Gloom_big.webp" alt="Gloom-input-resistant-icon" />
                        <span>Gloom (<span style={{color:changeResistantColor(sinResistant?.gloom_resistant)}}>{changeResistantText(sinResistant?.gloom_resistant)}</span>)</span>
                    </label>
                    <input style={{color:changeResistantColor(sinResistant?.gloom_resistant)}} type="number" className="input stat-page-input-border" {...registerNumber("sinResistant.gloom_resistant")} id="gloom_resistant"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="pride_resistant">
                        <img className="stat-icon" src="/Images/sin-affinity/affinity_Pride_big.webp" alt="Pride-input-resistant-icon" />
                        <span>Pride (<span style={{color:changeResistantColor(sinResistant?.pride_resistant)}}>{changeResistantText(sinResistant?.pride_resistant)}</span>)</span>
                    </label>
                    <input style={{color:changeResistantColor(sinResistant?.pride_resistant)}} type="number" className="input stat-page-input-border" {...registerNumber("sinResistant.pride_resistant")} id="pride_resistant"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="envy_resistant">
                        <img className="stat-icon" src="/Images/sin-affinity/affinity_Envy_big.webp" alt="Envy-input-resistant-icon" />
                        <span>Envy (<span style={{color:changeResistantColor(sinResistant?.envy_resistant)}}>{changeResistantText(sinResistant?.envy_resistant)}</span>)</span>
                    </label>
                    <input style={{color:changeResistantColor(sinResistant?.envy_resistant)}} type="number" className="input stat-page-input-border" {...registerNumber("sinResistant.envy_resistant")} id="envy_resistant"/>
                </div>
            </div>
        </AccordionSection>
    </div>
}
