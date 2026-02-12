import React, { ReactElement } from "react";
import "./CardHeader.css"
import { useEgoInfoContext } from "Features/CardCreator/Stores/EgoInfoContext";

export default function EgoHeader():ReactElement{
    const {EgoInfoValue} = useEgoInfoContext()

    function egoLevel(egoLevel:string){
        switch(egoLevel){
            case "ZAYIN":{
                return "/Images/ego-level/ZAYIN_level.webp"
            }
            case "HE":{
                return "/Images/ego-level/HE_level.webp"
            }
            case "TETH":{
                return "/Images/ego-level/TETH_level.webp"
            }
            case "WAW":{
                return "/Images/ego-level/WAW_level.webp"
            }
            case "ALEPH":{
                return "/Images/ego-level/ALEPH_level.webp"
            }
            case "UNDEFINED":{
                return "/Images/ego-level/undef.webp"
            }
        }
    }

    return(
        <div className="header-container">
            <div className="center-element">
                <div className="title-field" style={{background:EgoInfoValue.sinnerColor}}>
                    <p>{EgoInfoValue.title}</p>
                </div>
                <img className="ego-level-icon" src={egoLevel(EgoInfoValue.egoLevel)} alt={`${EgoInfoValue.egoLevel}-level-icon`} />

            </div>
            
            <div className="center-element">
                <div className="name-field" style={{background:EgoInfoValue.sinnerColor}}>
                    <p>{EgoInfoValue.name}</p>
                </div>
                <div className="center-element sanity-cost-container">
                    <img className="sanity-cost-img" src="/Images/Sanity.webp" alt="sanity-cost-icon" />
                    <p>Sanity cost </p>
                    <p className="sanity-cost">{EgoInfoValue.sanityCost}</p>
                </div>  
            </div>
        </div>
    )
}