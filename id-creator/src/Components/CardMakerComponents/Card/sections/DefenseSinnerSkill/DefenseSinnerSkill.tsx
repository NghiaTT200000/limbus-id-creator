import React, { forwardRef } from "react";
import { ReactElement } from "react";
import "../SinnerSkill.css"
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import SkillEffect from "Components/CardMakerComponents/Card/components/SkillEffect/SkillEffect";
import DefenseSkillSplash from "Components/CardMakerComponents/Card/components/SkillSplash/DefenseSkillSplash/DefenseSkillSplash";
import SkillTitle from "Components/CardMakerComponents/Card/components/SkillTitle/SkillTitle";

const DefenseSinnerSkill = forwardRef<HTMLDivElement, { defenseSkill: IDefenseSkill }>(({ defenseSkill }, ref) => {
    const {
        defenseType,
        damageType,
        name,
        skillAffinity,
        basePower,
        coinNo,
        coinPow,
        skillImage,
        skillEffect,
        skillLabel,
        skillLevel,
        skillAmt,
        atkWeight,
    } = defenseSkill;

    const printCoins = function (coinNo: number,skillEffect:string): (ReactElement | never)[] {
        if (coinNo > 10) return [<img key={0} src={"Images/Coin.webp"} alt="coin_icon" />];

        const arr = [];

        for (let i = 0; i < coinNo; i++) {
            console.log(skillEffect)
            if(skillEffect.includes(`alt="coin-effect-${i+1}-unbreakable"`)){
                arr.push(<img key={i} src={"Images/Unbreakable_Coin.webp"} alt="unbreakable_coin_icon" />);
            }
            else if(skillEffect.includes(`alt="coin-effect-${i+1}-excision"`)){
                arr.push(<img key={i} src={"Images/Excision_Coin.webp"} alt="excision_coin_icon" />);
            }
            else arr.push(<img key={i} src={"Images/Coin.webp"} alt="coin_icon" />);
        }
        return arr;
    };

    return (
        <div ref={ref} className="skill-section-container active-skill-container">
            <p className="skill-label">{skillLabel}</p>
            <div className="skill-section">
                <div>
                    <div className="coin-splash-container">
                        <DefenseSkillSplash skillAffinity={skillAffinity} skillImage={skillImage} defenseType={defenseType} />
                        <div className="skill-power">
                            {basePower}
                            {defenseType === "Counter" ? (
                                <img className="damage-type" src={`Images/attack/attackt_${damageType}.webp`} alt="" />
                            ) : (
                                <img className="damage-type" src={`Images/defense/defense_${defenseType}.webp`} alt="" />
                            )}
                            {(coinPow < 0 ? "" : "+") + coinPow}
                        </div>
                        <div className="skill-level">
                            {defenseType === "Counter" ? (
                                <img src="Images/stat/stat_attack.webp" className="skill-level-icon" alt="defense_icon" />
                            ) : (
                                <img src={"Images/stat/stat_defense.webp"} className="skill-level-icon" alt="attack_icon" />
                            )}

                            <div>
                                <p>Id level</p>
                                <p>{skillLevel < 0 ? skillLevel : "+" + skillLevel}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="sinner-skill-header">
                        {skillAffinity === "None"?<></>:<img className={`sinner-skill-affinity-icon`} src={`Images/sin-affinity/affinity_${skillAffinity}_big.webp`} alt={`sinner-skill-${skillAffinity}-icon`} />}
                        <div>
                            <div className="coin-container">
                                {printCoins(coinNo,skillEffect)}
                                {coinNo > 5 ? `x ${coinNo}` : ""}
                            </div>
                            <div className="active-skill-title-container">
                                <div className="active-skill-title">
                                    <SkillTitle skillAffinity={skillAffinity} skillTitle={name} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="skill-description">
                        <div className="atk-weight-skill-label-section">
                            <div className="attack-weight">
                                <p>Atk Weight: {atkWeight}</p>
                            </div>
                        </div>
                        <div>
                            <p><span className="skill-amount">Amt.</span> x{skillAmt}</p>
                        </div>
                        <SkillEffect effect={skillEffect} />
                    </div>
                </div>
            </div>
        </div>
    );
});
DefenseSinnerSkill.displayName = "DefenseSinnerSkill";
export default DefenseSinnerSkill;
