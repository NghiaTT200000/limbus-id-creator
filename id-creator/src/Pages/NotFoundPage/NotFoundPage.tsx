import MainButton from "components/MainButton/MainButton";
import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css"

export default function NotFoundPage(){
    return <div className="page-container not-found-page-container">
        <div className="page-content not-found-page-content">
            <h1 className="not-found-code">404</h1>
            <p>The page you were looking for does not exist</p>
            <div>
                <Link to={""}><MainButton component={'Home'} btnClass={"main-button nav-button"} /></Link>
            </div>
        </div>
    </div>
}