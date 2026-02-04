import React from "react";
import { ReactElement } from "react";
import "./SaveCloudMenu.css"

export default function SaveCloudTab({saveName,saveDate,previewUrl,deleteSave,loadSave,overwriteSave}:{saveName:string,saveDate:string,previewUrl:string,deleteSave:()=>void,loadSave:()=>void,overwriteSave:()=>void}):ReactElement{
    return <div className="save-cloud-tab">
        <div className="center-element save-cloud-tab-content">
            <img className="preview-img" src={previewUrl} alt="preview-img" />
            <div style={{textAlign:"left"}}>
                <p className="created-time">Updated: {saveDate}</p>
                <p>{saveName}</p>
            </div>
        </div>
        <div className="center-element save-cloud-tab-button-container">
            <button className="main-button" onClick={deleteSave}>
                Delete
            </button>
            <button className="main-button" onClick={overwriteSave}>
                Overwrite
            </button>
            <button className="main-button" onClick={loadSave}>
                Load
            </button>
        </div>
    </div>
}