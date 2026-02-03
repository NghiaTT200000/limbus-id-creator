import React from "react";
import { ReactElement } from "react";
import "./SinnerEgoIconInput.css"
import { useEgoInfoContext } from "@/Context/EgoInfoContext";
import { IEgoInfo } from "Types/IEgoInfo";

export default function SinnerEgoIconInput():ReactElement{
    const {EgoInfoValue,setEgoInfoValue} = useEgoInfoContext()

    
    return <div className="sinner-ego-icon-container">
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Yi-Sang-color)",sinnerIcon:"/Images/sinner-icon/Yi_Sang_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Yi_Sang_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Yi_Sang_Icon.webp" alt="Yi_Sang_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Faust-color)",sinnerIcon:"/Images/sinner-icon/Faust_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Faust_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Faust_Icon.webp" alt="Faust_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Don-color)",sinnerIcon:"/Images/sinner-icon/Don_Quixote_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Don_Quixote_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Don_Quixote_Icon.webp" alt="Don_Quixote_icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Ryōshū-color)",sinnerIcon:"/Images/sinner-icon/Ryoshu_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Ryoshu_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Ryoshu_Icon.webp" alt="Ryoshu_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Meursault-color)",sinnerIcon:"/Images/sinner-icon/Meursault_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Meursault_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Meursault_Icon.webp" alt="Meursault_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Hong-Lu-color)",sinnerIcon:"/Images/sinner-icon/Hong_Lu_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Hong_Lu_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Hong_Lu_Icon.webp" alt="Hong_Lu_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Heathcliff-color)",sinnerIcon:"/Images/sinner-icon/Heathcliff_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Heathcliff_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Heathcliff_Icon.webp" alt="Heathcliff_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Ishmael-color)",sinnerIcon:"/Images/sinner-icon/Ishmael_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Ishmael_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Ishmael_Icon.webp" alt="Ishmael_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Sinclair-color)",sinnerIcon:"/Images/sinner-icon/Sinclair_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Sinclair_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Sinclair_Icon.webp" alt="Sinclair_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Rodya-color)",sinnerIcon:"/Images/sinner-icon/Rodion_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Rodion_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Rodion_Icon.webp" alt="Rodion_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Outis-color)",sinnerIcon:"/Images/sinner-icon/Outis_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Outis_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Outis_Icon.webp" alt="Outis_Icon.webp" />
        <img onClick={()=>setEgoInfoValue((egoInfo:IEgoInfo)=>({...egoInfo,sinnerColor:"var(--Gregor-color)",sinnerIcon:"/Images/sinner-icon/Gregor_Icon.webp"}))} className={`sinner-ego-icon ${EgoInfoValue.sinnerIcon==="/Images/sinner-icon/Gregor_Icon.webp"?"active":""}`} src="/Images/sinner-icon/Gregor_Icon.webp" alt="Gregor_Icon.webp" />
    </div>
}