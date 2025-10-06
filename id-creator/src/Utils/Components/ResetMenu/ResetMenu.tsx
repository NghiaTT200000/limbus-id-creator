import React from "react";
import PopUpMenu from "Utils/Components/PopUpMenu/PopUpMenu";
import "./ResetMenu.css"
import MainButton from "Utils/Components/MainButton/MainButton";
import CheckIcon from "Utils/Icons/CheckIcon";

export default function ResetMenu({isActive,setIsActive,confirmFn}:{isActive:boolean,setIsActive:(isActive:boolean)=>void,confirmFn:()=>void}){
    return <div className={`${isActive?"":"hidden"}`}>
        <PopUpMenu setIsActive={()=>setIsActive(!isActive)}>
            <div className="reset-menu">
                <h1>Do you want to reset your progess</h1>
                <div className="center-element">
                    <MainButton component={<>
                        <CheckIcon/>
                        <p>Confirm</p>
                    </>} btnClass={"main-button center-element"} clickHandler={()=>{
                            confirmFn()
                            setIsActive(!isActive)
                        }}/>
                    <MainButton component={<>
                        <CheckIcon/>
                        <p>Cancel</p>
                    </>} btnClass={"main-button center-element"} clickHandler={()=>setIsActive(!isActive)} />
                </div>
            </div>
        </PopUpMenu>
    </div>
}