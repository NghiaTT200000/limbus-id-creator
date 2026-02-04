import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css"
import { useLoginUserContext } from "Context/LoginUserContext";
import KofiIcon from "Assets/Icons/KofiIcon";
import { useLoginMenuContext } from "Components/LoginMenu/LoginMenu";


export default function SideBar({isActive,setActiveSideBar}:{isActive:boolean,setActiveSideBar:(a:boolean)=>void}){
    const {isLoginMenuActive,setIsLoginMenuActive} = useLoginMenuContext()
    const {loginUser} = useLoginUserContext()

    return <div className={`side-bar-container ${isActive?"":"hidden"}`}>
        <div className="side-bar-background" onClick={()=>setActiveSideBar(!isActive)}></div>
        <div className="side-bar-outline">
            <div className="side-bar">
                <Link to={"/"}>
                    <img src="/Images/SiteLogo.webp" alt="site-logo" className="site-logo" onClick={()=>setActiveSideBar(!isActive)}/>
                </Link>
                <div className="side-bar-nav">
                    <Link to={"/creator/identity"}>
                        <button onClick={()=>setActiveSideBar(!isActive)} className="main-button nav-button">
                            Create Id
                        </button>
                    </Link>
                    <Link to={"/creator/ego"}>
                        <button onClick={()=>setActiveSideBar(!isActive)} className="main-button nav-button">
                            Create Ego
                        </button>
                    </Link>            
                    <Link to={"/forum"}>
                        <button onClick={()=>setActiveSideBar(!isActive)} className="main-button nav-button">
                            Forum
                        </button>
                    </Link>
                    {loginUser?<Link to={"/user/"+loginUser.id}>
                        <button onClick={()=>setActiveSideBar(!isActive)} className="main-button">My account</button>
                    </Link>:
                    <button className={"main-button nav-button"} onClick={()=>setIsLoginMenuActive(!isLoginMenuActive)}>Login</button>}
                    {loginUser&&<Link to={"/new-post"}><button className="main-button">Post</button></Link>}
                    <Link to="https://ko-fi.com/johnlimbusidmaker" target="_blank">
                        <button style={{justifyContent:"center"}} className="main-button center-element">
                            <KofiIcon width="16px" height="16px"/>
                            <p>Support me</p>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
}