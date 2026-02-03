import React, { useEffect, useRef, useState } from "react";
import { ReactElement } from "react";
import "../PageLayout.css"
import "./PostPage.css"
import Post from "./Post/Post";
import { useAlertContext } from "@/Context/AlertContext";
import { Link, useParams } from "react-router-dom";
import { IPost } from "Types/IPost/IPost";
import { useLoginUserContext } from "@/Context/LoginUserContext";
import { useLoginMenuContext } from "components/LoginMenu/LoginMenu";
import { IComment } from "Types/IPost/IComment";
import { Editor } from "react-simple-wysiwyg";

function Comment({comment}:{comment:IComment}){
    return <div className="post-comment-container post-page-element-container">
    <div className="center-element post-comment-content">
        <div className="center-element post-comment-header">
            <div className="center-element">
                <Link to={"/User/"+comment.userId}><img className="post-author-icon-small" src={comment.userIcon} alt="author-icon" /></Link>
                <Link to={"/User/"+comment.userId}><p className="post-author-name">{comment.userName}</p></Link>
            </div>
        </div>
        <p className="post-date">Posted: {comment.date.split(" ")[0]}</p>
        <p className="description-txt" dangerouslySetInnerHTML={{__html:comment.comment}}></p>
    </div>
</div>
}

function CommentContainer({comments,getComments}:{comments:IComment[],getComments:(page:number,limit:number)=>Promise<void>}){
    const [isLoading,setIsLoading] = useState(false)
    const [page,setPage] = useState(0)
    const [limit] = useState(10)
    const loaderRef = useRef(null)

    useEffect(()=>{
        const observer = new IntersectionObserver((entries)=>{
            const target = entries[0]
            if(target.isIntersecting&&isLoading)
            {
                setPage(page+1)
            }
        })

        if(loaderRef.current){
            observer.observe(loaderRef.current)
        }
        return () => {
            if (loaderRef.current) {
              observer.unobserve(loaderRef.current);
            }
          };
    },[getComments])

    useEffect(()=>{
        if(!isLoading){
            setIsLoading(true)
            getComments(page,limit).finally(()=>setIsLoading(false))
        }
    },[page])
    
    return <>
        {comments.map((comment,i)=><Comment key={i} comment={comment}/>)}
        <div ref={loaderRef}>{isLoading&&<div className="loader"></div>}</div>
    </>
}

function PostCommentInput({authorIcon,authorName,createComment}:{authorIcon:string,authorName:string,createComment:(comment:string)=>Promise<void>}){
    const [commentValue,setCommentValue] = useState("")
    const [isPosting,setIsPosting] = useState(false)

    const postFnc = ()=>{
        if(!isPosting){
            setIsPosting(true)
            createComment(commentValue).finally(()=>{
                setIsPosting(false)
                setCommentValue("")
            })
        }
    }

    return<div className="center-element post-comment-content post-page-element-container">
        <div className="center-element">
            <img className="post-author-icon-small" src={authorIcon} alt="author-icon" />
            <p className="post-author-name">{authorName}</p>
        </div>
        <Editor className="input comment-input" name="comment" id="comment" value={commentValue} onChange={(e)=>setCommentValue(e.target.value)}/>
        <button className={`main-button ${isPosting && "active"}`} onClick={postFnc}>
            {isPosting ? "Posting...": "Post"}
        </button>
    </div>
}

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
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Post/${postId}`,{
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
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Comment/create`,{
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
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/API/Comment?PostId=${postId}&page=${page}&limit=${limit}`,{
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