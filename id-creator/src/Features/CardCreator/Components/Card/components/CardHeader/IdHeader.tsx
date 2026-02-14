import React, { ReactElement } from "react";
import "./CardHeader.css"

interface IdHeaderProps {
    title: string
    name: string
    sinnerColor: string
    rarity: string
}

export default function IdHeader({title, name, sinnerColor, rarity}: IdHeaderProps):ReactElement{
    return(
        <div className="header-container">
            <div className="title-field" style={{background:sinnerColor}}>
                <p>{title}</p>
            </div>
            <div className="center-element">
                <div className="name-field" style={{background:sinnerColor}}>
                    <p>{name}</p>
                </div>
                <img className="sinner-rarity-icon" src={rarity} alt="sinner-rarity-icon" />
            </div>

        </div>
    )
}
