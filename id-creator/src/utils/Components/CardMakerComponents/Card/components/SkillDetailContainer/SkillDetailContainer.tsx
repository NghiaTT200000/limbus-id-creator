import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import "./SkillDetailContainer.css"
import { ICustomEffect } from "interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "interfaces/MentalEffect/IMentalEffect";
import { IOffenseSkill } from "interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "interfaces/PassiveSkill/IPassiveSkill";
import CustomSinnerEffect from "utils/components/CardMakerComponents/Card/sections/CustomSinnerEffect/CustomSinnerEffect";
import DefenseSinnerSkill from "utils/components/CardMakerComponents/Card/sections/DefenseSinnerSkill/DefenseSinnerSkill";
import MentalSinnerEffect from "utils/components/CardMakerComponents/Card/sections/MentalSinnerEffect/MentalSinnerEffect";
import OffenseSinnerSkill from "utils/components/CardMakerComponents/Card/sections/OffenseSinnerSkill/OffenseSinnerSkill";
import PassiveSinnerSkill from "utils/components/CardMakerComponents/Card/sections/PassiveSinnerSkill/PassiveSinnerSkill";
import DragAndDroppableSkill from "../DragAndDroppableSkill/DragAndDroppableSkill";
import DragAndDroppableSkillPreviewLayer from "../DragAndDroppableSkill/DragAndDroppableSkillPreviewLayer";


export default function SkillDetailContainer({skillDetails,draggingHandler,changeActiveTab,moveSkill}:{
        skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[],
        draggingHandler:(isDragging:boolean)=>void,
        changeActiveTab:(i:number)=>void,
        moveSkill:(fromSkillID:string,toSkillID:string)=>void
    }):ReactElement{
    const containerRef=useRef<HTMLDivElement>(null)    
    const [currentWidth,setCurrentWidth]=useState(700)
    
    
    const printSinnerSkill = useCallback((
        skill: IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect | never): ReactElement => {
        const skillType = {
            OffenseSkill: <OffenseSinnerSkill offenseSkill={skill as IOffenseSkill} />,
            DefenseSkill: <DefenseSinnerSkill defenseSkill={skill as IDefenseSkill} />,
            PassiveSkill: <PassiveSinnerSkill passiveSkill={skill as IPassiveSkill} />,
            CustomEffect: <CustomSinnerEffect customEffect={skill as ICustomEffect} />,
            MentalEffect: <MentalSinnerEffect mentalEffect={skill as ICustomEffect} />
        };
        return (
            <DragAndDroppableSkill
                skill={skill}
                dropHandler={(item) => moveSkill(item.skill.inputId, skill.inputId)}
                isDraggingHandler={draggingHandler}
            >
                {skillType[skill.type]}
            </DragAndDroppableSkill>
        );
    }, [moveSkill, skillDetails, draggingHandler])

    //For some reason the div doesn't expan when the children wrap
    //So i have to manually expand it
    useEffect(()=>{
        if(containerRef.current){
            let currentColHeight=0
            let colNo=1
            containerRef.current.childNodes.forEach((child:HTMLDivElement)=>{
                currentColHeight+=child.clientHeight
                //Move on to the next col
                if(currentColHeight>containerRef.current.clientHeight-5){
                    colNo++
                    currentColHeight=child.clientHeight
                }
                //Add gap
                currentColHeight+=25
            })
            setCurrentWidth(colNo*500+(colNo-1)*25)
        }
    },[JSON.stringify(skillDetails)])

    return(
        <div className="skill-detail-container" ref={containerRef} style={{minWidth:Math.max(currentWidth,700)}}>
            {skillDetails.map((skill:((IOffenseSkill|IDefenseSkill|IPassiveSkill|IMentalEffect|ICustomEffect|never)),i:number)=>
                <div key={skill.inputId} onClick={()=>changeActiveTab(i)}>
                    {(printSinnerSkill(skill))}
                </div>
            )}
        </div>
    )
}