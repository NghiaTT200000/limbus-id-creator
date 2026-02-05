import React, { useCallback, useState } from "react";
import { ReactElement } from "react";
import EditIcon from "Assets/Icons/EditIcon";
import CheckIcon from "Assets/Icons/CheckIcon";
import { useParams } from "react-router-dom";
import { IUserProfile } from "Types/API/OAuth/IUserProfile";
import IResponse from "Types/IResponse";
import { useAlertContext } from "Context/AlertContext";
import "./UserProfile.css";
import { EnvironmentVariables } from "Config/Environments";

export function UserProfile({userProfile,setUserProfile}:{userProfile:IUserProfile,setUserProfile:React.Dispatch<React.SetStateAction<IUserProfile>>}):ReactElement{
    const {userName,userIcon} = userProfile
    const [isChangeName,setIsChangeName] = useState(false)
    const [isChangingName,setIsChangingName] = useState(false)
    const [isChangingProfile,setIsChangingProfile] = useState(false)
    const [nameLenErr,setNameLenErr] = useState(false)
    const [name,setName] = useState(userName)
    const {userId} = useParams()
    const {addAlert} = useAlertContext()
    const [userError,setUserErr] = useState("")


    const changeName = useCallback(async()=>{
        if(!name||isChangingName) return
        setIsChangingName(true)
        try {
            console.log(name)
            const req = await fetch(`${EnvironmentVariables.REACT_APP_SERVER_URL}/API/User/change/name/${userId}`,{
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify(name)
            })
            const res:IResponse<string> = (await req.json())
            if(req.ok){
                setUserProfile({...userProfile,userName:res.response})
                addAlert("Success","Name changed")
                setIsChangeName(false)
            }
            else{
                addAlert("Failure",res.msg)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Can't change name")
        }
        setIsChangingName(false)
    },[name,setName,userId,setUserProfile,isChangingName,setIsChangeName,addAlert])

    const changeProfileImg=useCallback(async(e:React.ChangeEvent<HTMLInputElement>)=>{
        setIsChangingProfile(true)
        try {
            const form = new FormData()
            form.append('newProfile',e.currentTarget.files[0])
            console.log(e.currentTarget.files[0])
            const req = await fetch(`${EnvironmentVariables.REACT_APP_SERVER_URL}/API/User/change/profile/${userId}`,{
                method: "POST",
                credentials: "include",
                body:form
            })
            
            const res:IResponse<string> = (await req.json())
            if(!req.ok){
                addAlert("Failure",res.msg)
            }
            else{
                setUserProfile({...userProfile,userIcon:res.response})
                addAlert("Success","Profile changed")
                setIsChangeName(false)
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Can't change profile")
        }
        setIsChangingProfile(false)
    },[userId])

    const printProfileEditButton = ()=>{
        if (!userProfile.owned) return <></>

        return <div className="center-element warning-message">
            {isChangeName?
                <button className={`main-button ${isChangingName?"active":""} center-element user-name-edit`} onClick={()=>{
                    if(name.length<=65&&name.length>0){
                        changeName()
                    }
                    else{
                        setUserErr("(Username must have at least one character and less than or equal to 64 characters)")
                        setNameLenErr(true)
                    }
                }}>
                    <p>{isChangingName?"Editting":"Confirm"}</p>
                    <CheckIcon/>
                </button>:
                <button className={"main-button center-element user-name-edit"} onClick={()=>setIsChangeName(!isChangeName)}>
                    <p>Edit</p>
                    <EditIcon/>
                </button>
            }
            <p>{nameLenErr?userError:""}</p>
        </div>
    }

    return <div className="user-personal-container center-element">
        
        <div className="user-profile-img-container">
            <img className="user-personal-icon" src={userIcon} alt="user-icon" />
            {(isChangingProfile && userProfile.owned) &&
                <button className={`main-button ${isChangingProfile && "active"} center-element input-profile-img-button`}>
                    {isChangingProfile?
                        <p>Editing...</p>:
                        <>
                            <input className="input-profile-img" type="file" name="input-profile-img"  accept="image/png, image/jpeg" id="input-profile-img" onInput={changeProfileImg}/>
                            <p>Edit Profile</p>
                            <EditIcon/>
                        </>
                    }
                </button>
            }
        </div>
        <div className="user-name-container">
            {printProfileEditButton()}
            {isChangeName?<input className="input user-name" type="text" name="name" id="name" value={name} onChange={(e)=>{
                setName(e.target.value)
                setNameLenErr(false)
            }}/>
            :<p className="user-name">{userName}</p>}
        </div>
        
    </div>
}