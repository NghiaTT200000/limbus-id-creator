import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./DragAndDroppableSkill.css"
import { ICustomEffect } from "Types/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Types/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Types/MentalEffect/IMentalEffect";
import { IOffenseSkill } from "Types/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Types/PassiveSkill/IPassiveSkill";


export default function DragAndDroppableSkill({skill,isDraggingHandler,dropHandler,children}:{
        skill:IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect,
        isDraggingHandler:(isDragging:boolean)=>void,
        dropHandler:(item:any)=>void,
        children:ReactNode
    }){
    const ref = useRef<HTMLDivElement>()

    const [dimensions,setDimensions] = useState({ width: 0, height: 0 })

    const [{isDragging},drag] = useDrag(()=>({
        type:"SinnerSkill",
        item:{
            skill,
            skillWidth: dimensions.width,
            skillHeight: dimensions.height
        },
        collect(monitor){
            return {
                isDragging:monitor.isDragging()
            }
        }
    }),[skill,dimensions]) 
    const [{isOver},drop] = useDrop(()=>({
        accept:"SinnerSkill",
        drop:dropHandler,
        collect(monitor) {
            return {
                isOver:monitor.isOver()
            }
        },
    }),[dropHandler])

    useEffect(()=>{
        isDraggingHandler(isDragging)
    },[isDragging])


    useEffect(() => {
        if (ref.current) {
            const width = ref.current.clientWidth
            const height = ref.current.clientHeight
            setDimensions({ width, height })
            drag(drop(ref))
        }
    }, [ref, drag, drop])

    useEffect(()=>{
        if (ref.current) {
            const width = ref.current.clientWidth
            const height = ref.current.clientHeight
            setDimensions({ width, height })
        }
    },[ ref?.current?.clientWidth, ref?.current?.clientHeight])

    
    return (
        <div ref={ref}
            onMouseDown={()=>isDraggingHandler(true)}
            onMouseUp={()=>isDraggingHandler(false)}
            className={isOver?"hover-border":""}
        >
            {children}
        </div>
    )
}
