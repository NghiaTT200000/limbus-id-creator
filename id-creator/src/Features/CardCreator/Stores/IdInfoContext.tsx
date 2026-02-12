import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { PassiveSkill } from 'Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill';
import { IIdInfo, IdInfo } from 'Features/CardCreator/Types/IIdInfo';

const idInfoContext = createContext(null)

const IdInfoProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [idInfo,changeIdInfoValue] = useState<IIdInfo>(new IdInfo())

    function reset(){
        changeIdInfoValue(new IdInfo())
    }

    function setIdInfoValue(newIdInfo:IIdInfo|((prevIdInfo:IIdInfo)=>IIdInfo)){
        //Have to this to because ownCost and resCost can be undefined and cause error
        let setToChangedIdInfo:IIdInfo

        if(typeof newIdInfo === "function"){
            setToChangedIdInfo = newIdInfo(idInfo)
        }
        else setToChangedIdInfo = newIdInfo

        for (let i = 0; i < setToChangedIdInfo.skillDetails.length; i++) {
            if(setToChangedIdInfo.skillDetails[i].type==="PassiveSkill")
                setToChangedIdInfo.skillDetails[i] = {...new PassiveSkill(),...setToChangedIdInfo.skillDetails[i]}
        }
        changeIdInfoValue(newIdInfo)
    }


    useEffect(()=>{
        // Backward compatibility
        const oldSinnerIconPath = idInfo.sinnerIcon.startsWith("Images");
        const oldSinnerRarityPath = idInfo.rarity.startsWith("Images");
        const sinnerIconPng = (idInfo.sinnerIcon.startsWith("Images") || idInfo.sinnerIcon.startsWith("/Images")) && idInfo.sinnerIcon.endsWith(".png");
        const rarityPng = (idInfo.rarity.startsWith("Images") || idInfo.rarity.startsWith("/Images")) && idInfo.rarity.endsWith(".png");
        if(oldSinnerIconPath || oldSinnerRarityPath || sinnerIconPng || rarityPng){
            const newIdInfo = {...idInfo};
            if(oldSinnerIconPath) newIdInfo.sinnerIcon = "/" + idInfo.sinnerIcon
            if(oldSinnerRarityPath) newIdInfo.rarity = "/" + idInfo.rarity;
            if(sinnerIconPng) newIdInfo.sinnerIcon = newIdInfo.sinnerIcon.replace(/\.png$/, ".webp");
            if(rarityPng) newIdInfo.rarity = newIdInfo.rarity.replace(/\.png$/, ".webp");
            changeIdInfoValue(newIdInfo);
        }
    },[idInfo?.rarity, idInfo?.sinnerIcon])

    return <idInfoContext.Provider value={{idInfoValue:idInfo,setIdInfoValue,reset}}>
        {children}
    </idInfoContext.Provider>;
}

const useIdInfoContext = () => useContext(idInfoContext)

export {IdInfoProvider,useIdInfoContext}
