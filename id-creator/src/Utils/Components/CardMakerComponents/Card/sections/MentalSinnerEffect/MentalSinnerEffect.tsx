import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import React, { forwardRef, ReactElement } from "react";
import "../SinnerSkill.css"
import "./MentalSinnerEffect.css"
import SkillEffect from "Utils/Components/CardMakerComponents/Card/components/SkillEffect/SkillEffect";
import SkillTitle from "Utils/Components/CardMakerComponents/Card/components/SkillTitle/SkillTitle";

const MentalSinnerEffect = forwardRef<HTMLDivElement, { mentalEffect: IMentalEffect }>(({ mentalEffect }, ref) => {
    const { effect } = mentalEffect;

    return (
        <div className="skill-section-container" ref={ref}>
            <p className="skill-label">SANITY</p>
            <div className="skill-section">
                <div>
                    <img className="sanity-img" src="Images/Sanity.png" alt="sanity-icon" />
                </div>
                <div>
                    <div className="mental-skill-header">
                        <SkillTitle skillAffinity="None" skillTitle={"Sanity Effects"} />
                    </div>
                    <div>
                        <SkillEffect effect={effect} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MentalSinnerEffect;