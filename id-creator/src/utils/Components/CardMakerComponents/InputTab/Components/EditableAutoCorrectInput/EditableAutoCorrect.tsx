import React, { useMemo, useState } from "react";
import { ReactElement, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import SuggestBox from "./SuggestBox/SuggestBox";
import useKeyPress from "Utils/Hooks/useKeyPress";
import "./EditableAutoCorrect.css"
import getCaretCharacterOffsetWithin from "Utils/Components/CardMakerComponents/InputTab/Components/EditableAutoCorrectInput/Functions/getCaretCharacterOffsetWithin";
import getCaretHTMLCharacterOffSet from "Utils/Components/CardMakerComponents/InputTab/Components/EditableAutoCorrectInput/Functions/getCaretHTMLCharacterOffSet";
import ecapeRegExp from "Utils/Components/CardMakerComponents/InputTab/Components/EditableAutoCorrectInput/Functions/ecapeRegExp";
import setEditableCaretPos from "Utils/Components/CardMakerComponents/InputTab/Components/EditableAutoCorrectInput/Functions/setEditableCaretPos";
import getTextInTag from "Utils/Components/CardMakerComponents/InputTab/Components/EditableAutoCorrectInput/Functions/getTextInTag";


export default function EditableAutoCorrect({inputId,content,matchList,changeHandler}:{inputId:string,content:string,changeHandler:(e:React.ChangeEvent<HTMLInputElement>)=>void,matchList:{[key:string]:string}}):ReactElement{
    const contentEditableRef=useRef<HTMLDivElement>(null)
    const suggestionBoxRef = useRef<HTMLDivElement>(null)
    const [activeSuggestBox,setActiveSuggestBox]=useState(false)
    const [suggestBoxPos,setSuggestBoxPos] = useState({left:0,top:15})
    const [currentActiveChoice,setCurrentActiveChoice] = useState(0)
    const [itemList,setItemList] = useState<((string|ReactElement)[])[]>([])
    const [caretPos,setCaretPos] = useState(0)
    //The contenteditable div keep reseting to the last character
    //This is a state to track if a suggestion has been selected
    //Then set the caret position to the correct position
    const [hasSelectedSuggestion,setHasSelectedSuggestion] = useState(false)

    const enterKeyPress=useKeyPress("Enter",contentEditableRef)
    const arrowUpKeyPress = useKeyPress("ArrowUp",contentEditableRef)
    const arrowDownKeyPress = useKeyPress("ArrowDown",contentEditableRef)
    const tabDownKeyPress = useKeyPress("Tab",contentEditableRef)
    
    const regex = /(?<=\[)([\-+\w]*)$/g


    //Run when user click on one of the suggestion or if they press enter/tab
    const selectSuggestion = useMemo(() => {
        //The item is an array. The first element is the keyword. The second is the html element
        return function(item) {
            if(contentEditableRef.current){
                const addInItem =`${item[0]}] ` 
                
                //The index of the current carret including html tags and attributes
                const innerHTMLIndex = getCaretHTMLCharacterOffSet(contentEditableRef.current.innerHTML,caretPos)
                //The word that been detected by auto correct
                const foundWord=contentEditableRef.current.innerHTML.substring(0,innerHTMLIndex+1).match(regex)

                //This include all word from the begining of the bracket to the end of the bracket
                //Ex: if the text is [si then when the user press Sinking then the firstHalf = [Sinking]
                const firstHalf = contentEditableRef.current.innerHTML.substring(0,innerHTMLIndex+1).replace(regex,addInItem)

                //This is the rest of the contenteditable text from the end of the bracket
                const secondHalf =  contentEditableRef.current.innerHTML.substring(innerHTMLIndex+1)

                contentEditableRef.current.innerHTML = firstHalf + secondHalf
                const event = new Event("input", { bubbles: true })
                contentEditableRef.current.dispatchEvent(event)

                setActiveSuggestBox(false)
                setItemList([])
                setCaretPos(caretPos-foundWord[0].length+getTextInTag(item[1]).length)
                setHasSelectedSuggestion(true)
            }
        };
    }, [contentEditableRef, regex, setActiveSuggestBox, caretPos]);

    //Update the position of the box based on the carret
    const updateSuggestBoxPos = useMemo(() => {
        return function() {
            const sel = window.getSelection && window.getSelection();
            if(suggestionBoxRef.current && sel && sel.rangeCount > 0){
                const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
                const parentRect = contentEditableRef.current.getBoundingClientRect();
                let left = rect.left - parentRect.left + window.scrollX;
                let top = rect.top - parentRect.top + window.scrollY + 20;
                
                setSuggestBoxPos({left, top});
            }
        };
    }, [suggestionBoxRef, contentEditableRef, setSuggestBoxPos]);

    //Check if the editableTav has a carret at the end and update the suggestions based on the text enter
    const updateItemList = useMemo(()=>()=>{
        
        const textNoLine = (contentEditableRef.current.innerText as string).replace(/(\r\n|\n|\r)/gm,"").substring(0,caretPos+1).toLowerCase()
        const newItemList = Object.keys(matchList).map(key=>[key,matchList[key]]).filter(value=>{
            const searchIndex=textNoLine.search(regex)
            if(searchIndex<0) return false
            const matchSubString = textNoLine.substring(searchIndex)
            
            return value[0].match(ecapeRegExp(matchSubString))}
        )
        if(newItemList.length>0){
            setActiveSuggestBox(true)
            updateSuggestBoxPos()
            setCurrentActiveChoice(0)
        }
        else setActiveSuggestBox(false)
        setItemList(newItemList)
    },[caretPos,matchList,contentEditableRef])

    const handleKeyUp=useMemo(()=>()=>{
        const position = getCaretCharacterOffsetWithin(contentEditableRef.current);
        setCaretPos(position)
    },[])

    useEffect(()=>{
        updateItemList()
        if(hasSelectedSuggestion){
            setHasSelectedSuggestion(false)
            setEditableCaretPos(contentEditableRef.current,caretPos+1)
        }
    },[caretPos])
    
    useEffect(()=>{
        //Some user are experience bug when pressing enter here
        //Using try catch as a temp fix
        try {
            if((enterKeyPress)&&itemList.length>0&&activeSuggestBox) selectSuggestion(itemList[currentActiveChoice])
        } catch (error) {
            console.log(error)            
        }
    },[enterKeyPress])

    useEffect(()=>{
        if((arrowDownKeyPress||tabDownKeyPress)&&itemList.length>0&&activeSuggestBox) setCurrentActiveChoice((currentActiveChoice+1>itemList.length-1)?0:currentActiveChoice+1)
    },[arrowDownKeyPress,tabDownKeyPress])

    useEffect(()=>{
        if(arrowUpKeyPress&&itemList.length>0&&activeSuggestBox) setCurrentActiveChoice((currentActiveChoice-1<0)?itemList.length-1:currentActiveChoice-1)
    },[arrowUpKeyPress])

    useEffect(()=>{
        //So the suggestion box dissappear when click on another tab
        setActiveSuggestBox(false)
    },[inputId])

    useEffect(()=>{
        const {left,top} = suggestBoxPos
        const newLeft = ((left+suggestionBoxRef.current.clientWidth)>=contentEditableRef.current.clientWidth)?left-suggestionBoxRef.current.clientWidth:left
        const newTop = ((top+suggestionBoxRef.current.clientHeight)>=contentEditableRef.current.clientHeight)?top - suggestionBoxRef.current.clientHeight - 20:top
        setSuggestBoxPos({left:newLeft,top:newTop})
    },[JSON.stringify(suggestBoxPos)])

    useEffect(()=>{
        //For some reason the contenteditable component doesn't change the itemList and activeSuggestBox dependencies
        //when putting it as a prop
        if(contentEditableRef.current) contentEditableRef.current.onkeydown=((e)=>{
            if(((itemList.length>0||activeSuggestBox)&&(e.key==="Enter"||e.key==="ArrowUp"||e.key==="ArrowDown"||e.key==="Tab"))){
                e.preventDefault()
            }
        })
    },[JSON.stringify(itemList),activeSuggestBox])

    return <div style={{position:"relative"}}>
        <ContentEditable id={inputId}
            className="input editable-auto-correct"
            innerRef={contentEditableRef}
            html={content}
            onChange={changeHandler}
            onKeyUp={handleKeyUp}
            contentEditable={true}
        />
        <SuggestBox ref={suggestionBoxRef} 
            isActive={activeSuggestBox} 
            items={itemList} 
            template={(item) => <div dangerouslySetInnerHTML={{ __html: item[1] }}></div>} 
            selectFunc={(item) => selectSuggestion(item)} 
            position={suggestBoxPos}
            currentActiveChoice={currentActiveChoice} />
    </div> 
}