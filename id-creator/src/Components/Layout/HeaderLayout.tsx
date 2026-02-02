import React, { useState } from "react";
import { ReactElement } from "react";
import {Link} from "react-router-dom";
import "./HeaderLayout.css"
import MainButton from "components/MainButton/MainButton";
import { useLoginMenuContext } from "components/LoginMenu/LoginMenu";
import {  useLoginUserContext } from "context/LoginUserContext";
import KofiIcon from "Utils/Icons/KofiIcon";
import SideBar from "./SideBar/SideBar";

export default function HeaderLayout():ReactElement{
    const [isSideBarActive,setActiveSideBar] = useState(false)
    const {isLoginMenuActive,setIsLoginMenuActive} = useLoginMenuContext()
    const {loginUser} = useLoginUserContext()

    return <>
        <nav className="site-header">
            <div className="hamburger-icon-container" onClick={()=>setActiveSideBar(!isSideBarActive)}>
                <img src="/Images/HamburgerIconActive.webp" alt="hamburg-icon-active" className="hamburger-icon-active"/>
                <img src="/Images/HamburgerIcon.webp" alt="hamburg-icon" className="hamburger-icon"/>
            </div>
            <div className="site-header-content center-element">
                <Link to={"/"}>
                    <img src="/Images/SiteLogo.webp" alt="site-logo" className="site-logo"/>
                </Link>
                <Link to={"/creator/identity"}><MainButton component={'Create Id'} btnClass={"main-button nav-button"} /></Link>
                <Link to={"/creator/ego"}><MainButton component={'Create Ego'} btnClass={"main-button nav-button"} /></Link>            
                <Link to={"/forum"}><MainButton component={'Forum'} btnClass={"main-button nav-button"} /></Link>
                {loginUser?<Link to={"/user/"+loginUser.id}><MainButton component={"My account"} btnClass="main-button"></MainButton></Link>:
                <MainButton component={'Login'} btnClass={"main-button nav-button"} clickHandler={()=>setIsLoginMenuActive(!isLoginMenuActive)}/>}
                {loginUser&&<Link to={"/new-post"}><MainButton component={"Post"} btnClass="main-button"></MainButton></Link>}
                <a href="https://ko-fi.com/johnlimbusidmaker" target="_blank" rel="noreferrer">
                    <button className="main-button center-element">
                        <KofiIcon width="16px" height="16px"/>
                        <p>Support me</p>
                    </button>
                </a>
            </div>
        </nav>
        <SideBar isActive={isSideBarActive} setActiveSideBar={setActiveSideBar}/>
    </>
}