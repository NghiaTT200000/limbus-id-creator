import ThumbDownIcon from "utils/icons/ThumbDownIcon";
import ThumbUpIcon from "utils/icons/ThumbUpIcon";
import React from "react";
import MainButton from "utils/components/MainButton/MainButton";

export default function ShowIdEgoRating({rating,ratingChoice}:{rating:number,ratingChoice:string}){
    return <div className="center-element">
        <MainButton btnClass={`main-button ${(ratingChoice==="Like")?" active":""}`} component={<p className="center-element"><ThumbUpIcon/>Like</p>} />
        {rating}
        <MainButton btnClass={`main-button ${(ratingChoice==="DiskLike")?" active":""}`} component={<p className="center-element"><ThumbDownIcon/>Dislike</p>} />
    </div>
}