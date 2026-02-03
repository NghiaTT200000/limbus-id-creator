import { useIdInfoContext } from "@/Context/IdInfoContext";
import React from "react";
import { ReactElement } from "react";
import "./RarityIconInput.css"
import { IIdInfo } from "Types/IIdInfo";

export default function SinnerRarityIconInput():ReactElement{
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()

    
    return <div className="rarity-icon-container">
        <img onClick={()=>setIdInfoValue((idInfo:IIdInfo)=>({...idInfo,rarity:"/Images/rarity/IDNumber1.webp"}))} className={`rarity-icon ${idInfoValue.rarity==="/Images/rarity/IDNumber1.webp"?"active":""}`} src="/Images/rarity/IDNumber1.webp" alt="rarity-icon-1.webp" />
        <img onClick={()=>setIdInfoValue((idInfo:IIdInfo)=>({...idInfo,rarity:"/Images/rarity/IDNumber2.webp"}))} className={`rarity-icon ${idInfoValue.rarity==="/Images/rarity/IDNumber2.webp"?"active":""}`} src="/Images/rarity/IDNumber2.webp" alt="rarity-icon-2.webp" />
        <img onClick={()=>setIdInfoValue((idInfo:IIdInfo)=>({...idInfo,rarity:"/Images/rarity/IDNumber3.webp"}))} className={`rarity-icon ${idInfoValue.rarity==="/Images/rarity/IDNumber3.webp"?"active":""}`} src="/Images/rarity/IDNumber3.webp" alt="rarity-icon-3.webp" />
    </div>
}