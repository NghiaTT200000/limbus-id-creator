import useKeyPress from "utils/hooks/useKeyPress";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactElement } from "react";
import { ITag, TagList } from "utils/TagList";
import "./TagInput.css"

export default function TagInput({completeFn,customClass="",id}:{completeFn:(keyword:ITag)=>void,maxTag:number,customClass?:string,id:string}):ReactElement{
    const [text,setText] = useState("")
    const [tagList,setTagList] = useState<ITag[]>([])
    const [currChoice,setCurrChoice] = useState(0)
    const [isActive,setIsActive] = useState(false)
    const tagInputRef = useRef(null)
    const enterKeyPress=useKeyPress("Enter",tagInputRef)
    const arrowUpKeyPress = useKeyPress("ArrowUp",tagInputRef)
    const arrowDownKeyPress = useKeyPress("ArrowDown",tagInputRef)
    const tabDownKeyPress = useKeyPress("Tab",tagInputRef)
    const selectRef = useRef(null)
    const containerRef = useRef(null)

    const handleKeyDown=useCallback((e:React.KeyboardEvent<HTMLInputElement>)=>{
        if((isActive&&(e.key==="Enter"||e.key==="ArrowUp"||e.key==="ArrowDown"||e.key==="Tab"))){
            e.preventDefault()
        }
    },[tagList])

    const chooseOption = useCallback((choice:ITag)=>{
        completeFn(choice)
        setCurrChoice(0)
        setTagList(Object.keys(TagList).map(key=>TagList[key]))
        setText("")
        setIsActive(false)
    },[completeFn,setCurrChoice,setTagList,setText])

    const scrollToView = ()=>{
        const selected = selectRef?.current?.querySelector(".found-tag.active")
        if(selected){
            selected?.scrollIntoView({
                block: 'nearest', 
                inline: 'start' 
            });
        } 
    }

    useEffect(()=>{
        const foundTag = []
        for(const tag in TagList){
            if(tag.toLowerCase().match(text.replace(" ","_").toLowerCase())) foundTag.push(TagList[tag])
        }
        setTagList(foundTag)
        setCurrChoice(0)
    },[text])


    useEffect(()=>{
        if((enterKeyPress)&&isActive) chooseOption(tagList[currChoice])
    },[enterKeyPress])

    useEffect(()=>{
        if((arrowDownKeyPress||tabDownKeyPress)&&isActive) setCurrChoice((currChoice+1>tagList.length-1)?0:currChoice+1)
    },[arrowDownKeyPress,tabDownKeyPress])

    useEffect(()=>{
        if(arrowUpKeyPress&&isActive) setCurrChoice((currChoice-1<0)?tagList.length-1:currChoice-1)
    },[arrowUpKeyPress])

    useEffect(()=>{

        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsActive(false)
            }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[containerRef])
    
    return <div ref={containerRef} className="tag-input-container">
        <input ref={tagInputRef} type="text" id={id} className={`tag-input ${customClass}`} placeholder="Add tag" value={text} 
            onFocus={()=>{
                setIsActive(true)
            }} 
            onKeyDown={handleKeyDown} 
            onChange={(e)=>{
                setText(e.target.value)
                setIsActive(true)
            }} 
            autoComplete={"off"}/>
            <div className="found-tag-outer-container">
                <div className="found-tag-container" ref={selectRef}>
                    {isActive&&tagList.map((tag:ITag,i)=>{
                        scrollToView()
                        return <div className={`found-tag center-element ${currChoice===i?"active":""}`} onClick={()=>chooseOption(tag)} key={i}>
                        {tag.icon&&<img className="status-icon" src={tag.icon} alt={tag.tagName+"_icon"}></img>}
                        {tag.tagName}
                    </div>})}
                </div>
            </div>
    </div> 
}