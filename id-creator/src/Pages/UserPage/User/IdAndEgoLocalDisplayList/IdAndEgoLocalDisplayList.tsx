import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import IdAndEgoLocalCard from "./IdAndEgoLocalCard";
import { ISaveFile } from "interfaces/ISaveFile";
import { IIdInfo } from "interfaces/IIdInfo";
import { IEgoInfo } from "interfaces/IEgoInfo";
import "./IdAndEgoLocalDisplayList.css"

export default function IdAndEgoLocalDisplayList({mode}:{mode:string}):ReactElement{
    const [localSaves,setLocalSaves] = useState<ISaveFile<IIdInfo>[]|ISaveFile<IEgoInfo>[]>([])
    
    useEffect(()=>{
        const saveItems = JSON.parse(localStorage.getItem(mode==="Identity"?"IdLocalSaves":"EgoLocalSaves"))
        if(saveItems){
            try {
                setLocalSaves(saveItems)
            } catch (error) {
                console.log(error)                
            }
        }
    },[mode])

    return <div className="id-ego-local-display-list">
        <div>
            {localSaves.map((save:(ISaveFile<IIdInfo>|ISaveFile<IEgoInfo>),i:number)=><IdAndEgoLocalCard key={i} saveName={save.saveName} saveTime={save.saveTime} mode={mode} saveId={i} />)}
        </div>
    </div>
}