import React, { useEffect } from "react"
import { useState } from "react"
import {MapInteractionCSS} from "react-map-interaction"
import "./ViewImagePopUp.css"
import ArrowUpIcon from "Utils/Icons/ArrowUpIcon"
import ArrowDownIcon from "Utils/Icons/ArrowDownIcon"
import CloseIcon from "Utils/Icons/CloseIcon"


export default function ViewImagePopUp({images,index=0,isActive,closeFn}:{images:string[],index:number,isActive:boolean,closeFn:()=>void}){
    const [currChoice,setCurrChoice] = useState(index)
    
    useEffect(()=>{setCurrChoice(index)},[index])

    return <>
        {isActive?<div className="image-pop-up-container">
            <MapInteractionCSS>
                {images.map((image,i)=><img key={i} src={image} alt="view-img" className={`image-pop-up ${i!==currChoice?"hidden":""}`} />)}
            </MapInteractionCSS>
            <div className="image-pop-up-close" onClick={()=>{
                    setCurrChoice(index)
                    closeFn()
                }}>
            <CloseIcon/>
            </div>
            {currChoice>0?<div className="image-pop-up-arrow left" onClick={()=>setCurrChoice(currChoice-1)}>
                <ArrowDownIcon/>
            </div>:<></>}
            {currChoice<images.length-1?<div className="image-pop-up-arrow right" onClick={()=>setCurrChoice(currChoice+1)}>
                <ArrowUpIcon/>
            </div>:<></>}
        </div>
        :<></>}
    </>
}