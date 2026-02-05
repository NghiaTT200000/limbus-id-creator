import React, { useState } from "react";
import { ReactElement } from "react";
import Post from "Features/Post/Components/Post/Post";
import { useAlertContext } from "Context/AlertContext";
import { useParams } from "react-router-dom";
import { IPost } from "Types/IPost/IPost";
import { useLoginUserContext } from "Context/LoginUserContext";
import { useLoginMenuContext } from "Components/LoginMenu/LoginMenu";
import { IComment } from "Types/IPost/IComment";
import { CommentContainer, PostCommentInput } from "Features/Post/Components/Comment/Comment";
import "../Shared/Styles/PageLayout.css"
import { EnvironmentVariables } from "Config/Environments";

export default function PostPage():ReactElement{
    const {postId} = useParams()
    const [post,setPost] = useState<IPost>({
        id:"",
        title:"",
        imagesAttach:[],
        description:"",
        userIcon:"",
        userName:"",
        userId:"",
        tags:[],
        viewCount:0,
        commentCount:0,
        created: "",
    })
    const [comments,setComments] = useState<IComment[]>([])
    const {addAlert} = useAlertContext()
    const {loginUser} = useLoginUserContext()
    const {setIsLoginMenuActive} = useLoginMenuContext()

    async function getPost(){
        try {
            const response = await fetch(`${EnvironmentVariables.REACT_APP_SERVER_URL}/API/Post/${postId}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok){
                addAlert("Failure",result.msg)
                setPost(null)
            }
            else setPost(result.response)
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
            setPost(null)
        }
    }

    async function createNewComment(comment:string){
        try {
            if(!comment) return addAlert("Failure","Comment cannot be emptied")
            const response = await fetch(`${EnvironmentVariables.REACT_APP_SERVER_URL}/API/Comment/create`,{
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-type":"application/json"
                },
                body: JSON.stringify({
                    userId: loginUser.id,
                    postId: post.id,
                    comment,
                })})
            const result = await response.json()
            if(!response.ok||!result.response) addAlert("Failure",result.msg)
            else{ 
                setComments([...comments,result.response])
                addAlert("Success","Comment posted")
            }
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server")
        }
    }
    async function getComments(page:number,limit:number){
        try {
            const response = await fetch(`${EnvironmentVariables.REACT_APP_SERVER_URL}/API/Comment?PostId=${postId}&page=${page}&limit=${limit}`,{
                credentials: "include"
            })
            const result = await response.json()
            if(!response.ok) addAlert("Failure",result.msg)
            else setComments([...comments,...result.response])
        } catch (error) {
            console.log(error)
            addAlert("Failure","Something went wrong with the server. Cannot get comments")
        }
    }

    return <div className="page-container">
        <div className="page-content">
            <Post post={post} getPost={getPost}/>
        </div>
        <div className="page-content">
            <CommentContainer comments={comments} getComments={getComments}/>
        </div>
        <div className="page-content">
            {(()=>{
                if(loginUser && post) return <PostCommentInput authorIcon={loginUser.userIcon} authorName={loginUser.userName} createComment={createNewComment}/>
                if(post) return <button className="main-button" onClick={()=>setIsLoginMenuActive(true)}></button>
                return <></>
            })()}
        </div>
    </div>
}