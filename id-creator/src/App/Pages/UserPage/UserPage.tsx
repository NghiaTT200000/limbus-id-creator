import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { IUserProfile, UserProfileRes } from "Types/API/OAuth/IUserProfile";
import { useLoginUserContext } from "Stores/LoginUserContext";
import PaginatedPost from "Components/PaginatedPost/PaginatedPost";
import { IPostDisplayCard } from "Types/IPostDisplayCard/IPostDisplayCard";
import { UserProfile } from "Features/User/Components/UserProfile/UserProfile";
import UserProfileLoading from "Components/UserProfileLoading/UserProfileLoading";
import "../Shared/Styles/PageLayout.css"
import "./User.css"
import { EnvironmentVariables } from "Config/Environments";
import useAlert from "Hooks/useAlert";



export default function UserPage():ReactElement{
    const [isLoadingPosts,setIsLoadingPosts] = useState(false)
    const [currPage,setCurrPage] = useState(0)
    const [maxCount,setMaxCount] = useState(0)
    const [postList,setPostList] = useState<IPostDisplayCard[]>([])
    const [isFetchingUser,setIsFetchingUser] = useState(true)
    const [isLoggingOut,setIsLoggingOut] = useState(false)
    const {logOut,loginUser} = useLoginUserContext()
    const [user,setUser] = useState<IUserProfile>(new UserProfileRes("","","","","",false))
    const {userId} = useParams()
    const {addAlert} = useAlert()
    const navigate = useNavigate()

    async function getPosts(page:number){
        setIsLoadingPosts(true)
        try {
            const response = await fetch(`${EnvironmentVariables.REACT_APP_SERVER_URL}/API/Post?page=${page}&UserId=${userId}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok){
                addAlert("Failure",result.msg)
                setPostList([])
            }
            else{ 
                const newList = result.response.list.map((p)=>({
                    ...p,
                    cardImg:p.imagesAttach[0]
                }))
                setPostList(newList)
                setMaxCount(result.response.total)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
            setPostList([])
        }
        setIsLoadingPosts(false)
    }


    async function logout(){
        setIsLoggingOut(true)
        try {
            const res=await fetch(`${EnvironmentVariables.REACT_APP_SERVER_URL}/API/OAuth/oauth2/logout`,{
                method:"POST",
                credentials: "include",
            })
            const result = await res.json()
            if(399<res.status&&res.status<500){
                addAlert("Failure",result.msg)
            }
            else{
                addAlert("Success",result.msg)
                logOut()
                navigate("/Forum")
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
        finally{ 
            setIsLoggingOut(false)
        }
    }


    useEffect(()=>{
        fetch(`${EnvironmentVariables.REACT_APP_SERVER_URL}/API/User/${userId}`,{
            credentials: "include",
        })
        .then(res=>res.json())
        .then((res) => {
            if(res.response)setUser(res.response)
            else{setUser(null)}
        })
        .catch((err) => {
            console.log(err)
            setUser(null)
        })
        .finally(()=>setIsFetchingUser(false))
    },[JSON.stringify(loginUser)])

    useEffect(()=>{
        getPosts(currPage)
    },[currPage])

    return <div className="page-container">
        {user?
            <>
                <div className="page-content">
                    
                    <div className="user-container">
                        <p className="user-meta-txt">Created at: {user.createdAt.split(" ")[0]}</p>
                        {isFetchingUser?<UserProfileLoading/>:<UserProfile userProfile={user} setUserProfile={setUser} />}
                        <div className="user-log-out-container">
                            {user.owned && <button className={isLoggingOut?"main-button active":"main-button"} onClick={logout}>{isLoggingOut?"Logging out...":"Logout"}</button>}
                        </div>
                    </div>
                    
                </div>
                <div className="page-content">
                    <PaginatedPost currPage={currPage}
                        maxCount={maxCount}
                        pageLimit={10}
                        postList={postList}
                        fetchPost={setCurrPage}
                        isLoading={isLoadingPosts}/>
                </div>
            </>
        :<p>User not found</p>}
    </div>
}