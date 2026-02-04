import React from "react";
import { ReactElement } from "react";
import { ITag } from "Utils/TagList";
import "./TagsContainer.css"
import CloseIcon from "Assets/Icons/CloseIcon";

export default function TagsContainer({tags,customClass="",deleteTag}:{tags:ITag[],customClass?:string,deleteTag:(i:number)=>void}):ReactElement{
    return <div className={`tags-container  ${customClass}`}>
        
        {tags.map((tag:ITag,i)=><div className={`keyword-tag`} key={i}>
            {tag?.icon&&<img className="status-icon" src={tag?.icon} alt={tag?.tagName+"_icon"}></img>}
            {tag?.tagName}
            <span className="tag-close-icon" onClick={()=>deleteTag(i)}><CloseIcon></CloseIcon></span>
        </div>)}
    </div>
}