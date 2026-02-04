import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "./DropDown.css"
import ArrowDownIcon from "Assets/Icons/ArrowDownIcon";

export interface dropDownEl{
    el:ReactElement,
    style?:{[key:string]:string},
    value:string,
    cb?:(newVal:string)=>void
}

export default function DropDown({dropDownEl,propVal,disabled,cb}:{dropDownEl:{[key:string]:dropDownEl},propVal?:string,disabled?:boolean,cb:(newVal:string)=>void}):ReactElement{
    const [currVal,setCurrVal]=useState((propVal)?dropDownEl[propVal]:Object.values(dropDownEl)[0])
    const [isActive,setIsActive]=useState(false)

    useEffect(()=>{
        if(propVal) setCurrVal(dropDownEl[propVal])
    },[propVal])

    return(
        <div className="drop-down-container">
            {disabled && <div className="disabled-block"></div>}
            <div className="curr-el" onClick={()=>setIsActive(!isActive)}>
                {currVal.el}
                <span className="arrow-down">
                    <ArrowDownIcon/>
                </span>    
            </div>
            {isActive && 
                <ul className={`drop-down`}>
                    {Object.keys(dropDownEl).map((key,i)=>
                        <li key={i} onClick={()=>{
                                if(dropDownEl[key].cb)dropDownEl[key].cb(dropDownEl[key].value)
                                else cb(dropDownEl[key].value)
                                setCurrVal(dropDownEl[key])
                                setIsActive(!isActive)
                            }} className="drop-down-el" style={dropDownEl[key].style}>
                            {dropDownEl[key].el}
                        </li>
                    )}
                </ul>
            }
        </div>
    )
}