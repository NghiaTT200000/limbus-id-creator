import CheckIcon from "@/Assets/Icons/CheckIcon";
import DeleteIcon from "@/Assets/Icons/DeleteIcon";
import SettingIcon from "@/Assets/Icons/SettingIcon";
import { ICustomKeyword } from "Types/ICustomKeyword";
import React, { useState } from "react";


export default function CustomKeywordTab({keyword,changeKeyword,deleteKeyword}:{keyword:ICustomKeyword,changeKeyword:(id:string,newKeyword:string,newColor:string)=>void,deleteKeyword:(id:string)=>void}){
    const [isEditMode,setIsEditMode] = useState(false)
    const [edittingKeyword,setEdittingKeyword] = useState(keyword.keyword)
    const [edittingKeywordColor,setEdittingKeywordColor] = useState(keyword.color)

    return <div className="custom-keyword-tab">
        <div className="custom-keyword-tab-icons">
            {isEditMode?
            <span className="custom-keyword-tab-setting-icon" onClick={()=>{
                    setIsEditMode(false)
                    changeKeyword(keyword.customKeywordID,edittingKeyword,edittingKeywordColor)
                }}>
                <CheckIcon width="14px" height="14px"/>
            </span>:
            <span className="custom-keyword-tab-setting-icon" onClick={()=>setIsEditMode(true)}>
                <SettingIcon width="14px" height="14px"/>
            </span>}
            
            <span className="custom-keyword-tab-delete-icon" onClick={()=>deleteKeyword(keyword.customKeywordID)}>
                <DeleteIcon width="14px" height="14px"/>
            </span>
        </div>
        <div className="center-element">
            <input type="text" style={{color:edittingKeywordColor}} value={edittingKeyword} 
            onChange={(e)=>setEdittingKeyword(e.target.value)}
            disabled = {!isEditMode}
            className={`input editting-custom-keyword-input ${isEditMode?"active":""}`}/>
            {isEditMode?<input type="color" value={edittingKeywordColor} onChange={(e)=>setEdittingKeywordColor(e.target.value)}/>:<></>}
        </div>
    </div>
}