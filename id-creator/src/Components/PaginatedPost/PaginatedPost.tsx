import React, { ReactElement, useRef } from "react";
import "./PaginatedPost.css"
import ReactPaginate from "react-paginate";
import { IPostDisplayCard } from "interfaces/IPostDisplayCard/IPostDisplayCard";
import { Link } from "react-router-dom";
import CommentIcon from "Utils/Icons/CommentIcon";
import ViewIcon from "Utils/Icons/ViewIcon";
import { TagList } from "Utils/TagList";

function PostDisplayCard({id,title,cardImg,userIcon,userName,userId,created,tags,viewCount,commentCount}:IPostDisplayCard){
    return <div className="post-display-card">
        <Link to={"/post/"+id}>
            <div className="post-display-card-img-container">
                <img className="post-display-card-img" src={cardImg} alt={title} />
            </div>
        </Link>
        <div className="post-display-card-footer">
            <p className="post-display-meta-txt">Posted: {created.split(" ")[0]}</p>
            <div className="post-display-tag-container">
                {tags.slice(0,3).map((t,i)=><div key={i} className="post-display-card-tag">
                    {TagList[t]?.icon&&<img className="post-display-card-tag-img" src={TagList[t]?.icon} alt={t+"_icon"} />}
                    <p>{TagList[t]?.tagName}</p>
                </div>)}
                {tags.length>3&&<p className="post-display-meta-txt">({tags.length-3} more)</p>}
            </div>
            <div className="center-element">
                <Link to={"/User/"+userId}>
                    <img className="post-display-card-footer-author-icon" src={userIcon} alt="author-icon" />
                </Link>
                <div className="post-display-card-footer-description">
                    <Link to={"/Post/"+id} className="post-display-card-title">
                        <p>{title}</p>
                    </Link>
                    <Link to={"/User/"+userId}>
                        <p className="post-display-card-footer-author-name">{userName}</p>
                    </Link>
                </div>
            </div>
            <div className="post-display-tag-container r">
                <div className="post-display-card-tag">
                    <ViewIcon width={12} height={12}/>
                    {viewCount}
                </div>
                <div className="post-display-card-tag">
                    <CommentIcon width={12} height={12}/>
                    {commentCount}
                </div>
            </div>
        </div>
    </div>
}

function PostDisplayCardLoading():ReactElement{
    return <div className="post-display-card-loading">
        <div className="loader"></div>
    </div>
}


function PostDisplayList({isLoading,cardList}:{cardList:IPostDisplayCard[],isLoading:boolean}):ReactElement{
    return <div className="post-display-list">
        {isLoading?
            <>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
                <PostDisplayCardLoading/>
            </>
            :
            <>
                {cardList.length<1?
                    "No posts found :(":
                    <>
                        {cardList.map((c,i)=><PostDisplayCard key={i} {...c}></PostDisplayCard>)}
                    </>
                }
            </>
        }        
    </div>
}

export default function PaginatedPost({currPage,maxCount,pageLimit,postList,fetchPost,isLoading}:{currPage:number,maxCount:number,pageLimit:number,postList:IPostDisplayCard[],fetchPost:(page:number)=>void,isLoading:boolean}){
    const headPost = useRef(null)
    
    function changePage(page:number){
        if(headPost) headPost.current.scrollIntoView()
        fetchPost(page)
    }

    
    return <div className="paginated-post-container">
        <div className="paginated-post-nav-container" ref={headPost} id="head-post">
            <ReactPaginate className="center-element paginated-bullet-point-container"
                pageCount={maxCount/pageLimit}
                forcePage={currPage} 
                onPageChange={(e)=>changePage(e.selected)}
                pageClassName="paginated-bullet-point"
                activeClassName="paginated-bullet-point active"
                breakLabel={"..."}
                previousLabel={<p className="paginated-bullet-point">PREV</p>}
                nextLabel={<p className="paginated-bullet-point">NEXT</p>}/>
        </div>
        <PostDisplayList isLoading={isLoading} cardList={postList}/>
        <div className="paginated-post-nav-container">
        <ReactPaginate className="center-element paginated-bullet-point-container"
            pageCount={maxCount/pageLimit}
            forcePage={currPage} 
            onPageChange={(e)=>changePage(e.selected)}
            pageClassName="paginated-bullet-point"
            activeClassName="paginated-bullet-point active"
            breakLabel={"..."}
            previousLabel={<p className="paginated-bullet-point">PREV</p>}
            nextLabel={<p className="paginated-bullet-point">NEXT</p>}/>
        </div>
    </div>
}