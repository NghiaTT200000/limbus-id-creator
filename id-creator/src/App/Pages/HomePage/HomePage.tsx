import React from "react";
import "./HomePage.css"
import "../PageLayout.css";
import { Link } from "react-router-dom";

export default function HomePage(){
    return <div className="page-container home-page-container">
        <div className="page-content home-page-content">
            <img src="/Images/SiteLogo.webp" alt="limbus-id-maker-logog" className="hero-site-logo"></img>
            <h1 className="home-page-hero-text">Hello, welcome to the Limbus ID creator. A fan project for those who want to create custom characters from the game <a href="https://limbuscompany.com/" className="home-page-link" target="_blank" rel="noreferrer">Limbus Company</a></h1>
            <div className="action-button-container">
                <Link to={"/creator/identity"}>
                    <button className="main-button nav-button">
                        Create Id
                    </button>
                </Link>
                <Link to={"/creator/ego"}>
                    <button className="main-button nav-button">
                        Create Ego
                    </button>
                </Link>            
                <Link to={"/forum"}>
                    <button className="main-button nav-button">
                        Forum
                    </button>
                </Link>
            </div>
        </div>
    </div>
}