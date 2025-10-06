import DownloadIcon from "utils/icons/DownloadIcon";
import React from "react";


export default function CardMakerFooterDownloadComponent({isLoading,downloadImg}:{isLoading:boolean,downloadImg:()=>void}){
    return<>
        {isLoading?
        <div className="center-element card-maker-footer-component">
            <DownloadIcon width="16px" height="16px"/>
            <p>Downloading...</p>
        </div>:
        <div className="center-element card-maker-footer-component" onClick={downloadImg}>
            <DownloadIcon width="16px" height="16px"/>
            <p>Download</p>
        </div>}
    </>  
}