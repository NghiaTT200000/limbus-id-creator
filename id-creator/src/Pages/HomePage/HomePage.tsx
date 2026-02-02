import React from "react";
import "./HomePage.css"
import "../PageLayout.css";
import { Link } from "react-router-dom";
import MainButton from "components/MainButton/MainButton";

export default function HomePage(){
    return <div className="page-container home-page-container">
        <div className="page-content home-page-content">
            <img src="/Images/SiteLogo.webp" alt="limbus-id-maker-logog" className="hero-site-logo"></img>
            <h1 className="home-page-hero-text">Hello, welcome to the Limbus ID creator. A fan project for those who want to create custom characters from the game <a href="https://limbuscompany.com/" className="home-page-link" target="_blank" rel="noreferrer">Limbus Company</a></h1>
            <div className="action-button-container">
                <Link to={"/creator/identity"}><MainButton component={'Create Id'} btnClass={"main-button nav-button"} /></Link>
                <Link to={"/creator/ego"}><MainButton component={'Create Ego'} btnClass={"main-button nav-button"} /></Link>            
                <Link to={"/forum"}><MainButton component={'Forum'} btnClass={"main-button nav-button"} /></Link>
            </div>
        </div>
    </div>
}