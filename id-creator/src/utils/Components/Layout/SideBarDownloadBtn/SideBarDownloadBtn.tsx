import { useRefDownloadContext } from "Utils/Context/ImgUrlContext";
import DownloadIcon from "Utils/Icons/DownloadIcon";
import React, { ReactElement, useState } from "react";
import DownloadImg from "Utils/Functions/DownloadImg";
import MainButton from "Utils/Components/MainButton/MainButton";
import "./SideBarDownloadBtn.css"
import { useAlertContext } from "Utils/Context/AlertContext";

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