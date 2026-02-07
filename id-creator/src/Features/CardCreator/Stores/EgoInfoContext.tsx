import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { EgoInfo, IEgoInfo } from 'Features/CardCreator/Types/IEgoInfo';
import { PassiveSkill } from 'Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill';

const egoInfo = createContext(null)

const EgoInfoProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [EgoInfoValue,changeEgoInfoValue]=useState<IEgoInfo>(new EgoInfo())


    function reset(){
        changeEgoInfoValue(new EgoInfo())
    }

    function setEgoInfoValue(newEgoInfo:IEgoInfo|((prevEgoInfo:IEgoInfo)=>IEgoInfo)){
        //Have to this to because ownCost and resCost can be undefined and cause error
        let setToChangedEgoInfo:IEgoInfo

        if(typeof newEgoInfo === "function"){
            setToChangedEgoInfo = newEgoInfo(EgoInfoValue)
        }
        else setToChangedEgoInfo = newEgoInfo

        for (let i = 0; i < setToChangedEgoInfo.skillDetails.length; i++) {
            if(setToChangedEgoInfo.skillDetails[i].type==="PassiveSkill")
                setToChangedEgoInfo.skillDetails[i] = {...new PassiveSkill(),...setToChangedEgoInfo.skillDetails[i]}
        }
        changeEgoInfoValue(newEgoInfo)
    }

    useEffect(()=>{
        // Backward compatibility
        const oldSinnerIconPath = EgoInfoValue.sinnerIcon.startsWith("Images");
        const sinnerIconPng = (EgoInfoValue.sinnerIcon.startsWith("Images") || EgoInfoValue.sinnerIcon.startsWith("/Images")) && EgoInfoValue.sinnerIcon.endsWith(".png");
        if(oldSinnerIconPath || sinnerIconPng){
            const newEgoInfo = {...EgoInfoValue};
            if(oldSinnerIconPath) newEgoInfo.sinnerIcon = "/" + EgoInfoValue.sinnerIcon;
            if(sinnerIconPng) newEgoInfo.sinnerIcon = newEgoInfo.sinnerIcon.replace(/\.png$/, ".webp");
            changeEgoInfoValue(newEgoInfo);
        }
    },[EgoInfoValue?.sinnerIcon])

    return <egoInfo.Provider value={{EgoInfoValue,setEgoInfoValue,reset}}>
            {children}
        </egoInfo.Provider>;
}

const useEgoInfoContext = () => useContext(egoInfo)

export {EgoInfoProvider,useEgoInfoContext}
