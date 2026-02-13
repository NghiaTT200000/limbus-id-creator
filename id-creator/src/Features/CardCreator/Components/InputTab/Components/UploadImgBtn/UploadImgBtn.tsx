import React from "react";
import { ReactElement } from "react";
import "./UploadImgBtn.css"
import UploadFileIcon from "Assets/Icons/UploadFileIcon";
import useAlert from "Hooks/useAlert";

export default function UploadImgBtn({onFileInputChange,btnTxt,btnClass,maxSize=100000}:{onFileInputChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,btnTxt:string|ReactElement,btnClass?:string,maxSize?:number}):ReactElement{
    const {addAlert} = useAlert()
    
    return(
        <button className={"upload-img-btn main-button fill-button-component "+btnClass}>
            <input className="upload-file-input" type="file" name="splashArt" accept="image/png, image/jpeg" onChange={(e)=>{
                    if(e.target.files && e.target.files[0].size<=maxSize) onFileInputChange(e)
                    else addAlert("Failure","That file is larger than the input limit")
                }} onClick={(e)=>{e.currentTarget.value = ""}}/>
            <span>
                <UploadFileIcon />
            </span>
            <p>{btnTxt}</p>
        </button> 
    )
}