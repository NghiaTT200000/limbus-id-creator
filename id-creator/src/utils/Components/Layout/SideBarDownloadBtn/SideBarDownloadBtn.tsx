import { useRefDownloadContext } from "utils/context/ImgUrlContext";
import DownloadIcon from "utils/icons/DownloadIcon";
import React, { ReactElement, useState } from "react";
import DownloadImg from "utils/functions/DownloadImg";
import MainButton from "utils/components/MainButton/MainButton";
import "./SideBarDownloadBtn.css"
import { useAlertContext } from "utils/context/AlertContext";

export default function SideBarDownloadBtn():ReactElement{
    const {setImgUrlState} = useRefDownloadContext()
    const [isLoading,setIsLoading] = useState(false)
    const {addAlert} = useAlertContext()

    
    const downloadImg = ()=>{
        setIsLoading(true)
        setImgUrlState()
            .then((imgUrl:string)=>{
                addAlert("Success","Download successful")
                DownloadImg(imgUrl,"Custom")
            })
            .catch((err)=>{
                console.log(err)
                addAlert("Failure","Error: Cannot download")
            })
            .finally(()=>setIsLoading(false))
    }
    
    return <>
        {isLoading?
        <MainButton component={<>
            <DownloadIcon/>
            <p>Downloading...</p>
        </>} btnClass={"main-button active center-element side-bar-download-btn"}/>:
        <MainButton component={<>
            <DownloadIcon/>
            <p>Download</p>
        </>} btnClass={"main-button center-element side-bar-download-btn"} clickHandler={downloadImg}/>}
    </>
}