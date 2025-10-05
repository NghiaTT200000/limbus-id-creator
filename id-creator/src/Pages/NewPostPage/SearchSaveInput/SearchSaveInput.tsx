import { IEgoInfo } from "Interfaces/IEgoInfo";
import { IIdInfo } from "Interfaces/IIdInfo";
import { ISaveFile } from "Interfaces/ISaveFile";
import React, { useEffect, useRef, useState } from "react";
import { ReactElement } from "react";
import "./SearchSaveInput.css"
import useKeyPress from "Utils/Hooks/useKeyPress";

export default function SearchSaveInput({saveList,chooseSave,searchSave}:{saveList:ISaveFile<IIdInfo|IEgoInfo>[],chooseSave:(saveUrl:string)=>void,searchSave:(name:string)=>void}):ReactElement{
    const [searchName,setSearchName] = useState("")
    const [currChoice,setCurrChoice] = useState(0)
    const [isActive,setIsActive] = useState(false)
    const searchSaveInputRef = useRef(null)
    const enterKeyPress=useKeyPress("Enter",searchSaveInputRef)
    const arrowUpKeyPress = useKeyPress("ArrowUp",searchSaveInputRef)
    const arrowDownKeyPress = useKeyPress("ArrowDown",searchSaveInputRef)
    const tabDownKeyPress = useKeyPress("Tab",searchSaveInputRef)
    const selectRef = useRef(null)
    const containerRef = useRef(null)

    const handleKeyDown=(e:React.KeyboardEvent<HTMLInputElement>)=>{
        if((isActive&&(e.key==="Enter"||e.key==="ArrowUp"||e.key==="ArrowDown"||e.key==="Tab"))){
            e.preventDefault()
        }
    }

    const scrollToView = ()=>{
        const selected = selectRef?.current?.querySelector(".post-save-found-tab.active")
        if(selected){
            selected?.scrollIntoView({
                block: 'nearest', 
                inline: 'start' 
            });
        } 
    }
    
    useEffect(()=>{
        searchSave(searchName)
        setCurrChoice(0)
    },[searchName])

    useEffect(()=>{
        if((enterKeyPress)&&isActive) {
            if(saveList[currChoice]){
                chooseSave(saveList[currChoice].previewImg)
            }
            setIsActive(false)
            setSearchName("")
        }
    },[enterKeyPress])

    useEffect(()=>{
        if((arrowDownKeyPress||tabDownKeyPress)&&isActive){ 
            setCurrChoice((currChoice+1>saveList.length-1)?0:currChoice+1)
        }
    },[arrowDownKeyPress,tabDownKeyPress])

    useEffect(()=>{
        if(arrowUpKeyPress&&isActive) {
            setCurrChoice((currChoice-1<0)?saveList.length-1:currChoice-1)
        }
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

    return <div className="post-save-mode-input-container" ref={containerRef}>
        <input ref={searchSaveInputRef} type="text" className="input post-save-input" placeholder="ID/EGO name" value={searchName} 
            onFocus={()=>{
                setIsActive(true)
            }}
            onKeyDown={handleKeyDown}
            onChange={(e)=>{
                setSearchName(e.target.value)
                setIsActive(true)
            }}
            autoComplete="off"/>
        <div className="post-save-found-outer-container">
            <div ref={selectRef} className="post-save-found-container">
                {isActive&&<>{saveList.map((save,i)=>{
                    scrollToView()
                    return <div key={save.id} className={`center-element post-save-found-tab ${currChoice===i?"active":""}`} onClick={()=>{
                        chooseSave(save.previewImg)
                        setSearchName("")
                        setIsActive(false)
                    }}>
                        <img src={save.previewImg} className="search-save-preview-img" alt="preview-img" />
                        <div>
                            <p>Updated: {save.saveTime}</p>
                            <p>{save.saveName}</p>
                        </div>
                    </div>
                })}</>}
                
            </div>
        </div>
    </div>
}