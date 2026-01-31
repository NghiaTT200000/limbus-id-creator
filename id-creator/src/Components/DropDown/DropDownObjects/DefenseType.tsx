import React from "react";
import { dropDownEl } from "Components/DropDown/DropDown";


export const DefenseType:{[key:string]:dropDownEl}={
    Block:{
        el:
        <div className="defense-type-drop-down">
            <img src="Images/defense/defense_Block.webp" alt="block-defense" />
        </div>,
        value:"Block"
    },
    Dodge:{
        el:
        <div className="defense-type-drop-down">
            <img src="Images/defense/defense_Dodge.webp" alt="dodge-defense" />
        </div>,
        value:"Dodge"
    },
    Counter:{
        el:
        <div className="defense-type-drop-down">
            <img src="Images/defense/defense_Counter.webp" alt="counter-defense" />
        </div>,
        value:"Counter"
    }}
