import { Table } from "dexie";
import { ISaveFile } from "interfaces/ISaveFile";
import { useCallback, useEffect, useState } from "react";
import { indexDB } from "Utils/IndexDB";


export default function useSaveLocal<SaveObj>(LocalSaveDataName:string){
    const [saveDataTable,setSaveDataTable] = useState<Table<any>|null>(null)
    const [saveData,setSaveData] = useState<ISaveFile<SaveObj>[]>([]) 
    const [isLoading, setIsLoading] = useState(false)

    const deleteSave = useCallback(async (id:string)=>{
        if(!saveDataTable) return null
        try {
           setIsLoading(true)
           await saveDataTable?.delete(id)
           setSaveData(saveData.filter((item)=>item.id!==id))
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    },[saveData, saveDataTable])

    const createSave = useCallback(async (saveObj: ISaveFile<SaveObj>)=>{
        if(!saveDataTable) return null
        try {
           setIsLoading(true)
           const id = await saveDataTable?.add(saveObj)
           console.log("Saved with id: ",id)
           setSaveData([{ ...saveObj},...saveData])
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    },[saveData, saveDataTable])

    const getAllSaves = useCallback(async () => {
        if (!saveDataTable) return null
        return await saveDataTable.toArray()
    }, [saveDataTable])

    const loadSave = useCallback(async (id: string)=>{
        if(!saveDataTable) return null
        return await saveDataTable.get(id) as ISaveFile<SaveObj>
    },[saveDataTable])

    const changeSaveName = useCallback(async(id:string,newName:string)=>{
        if(!saveDataTable) return null
        try{
            await saveDataTable.update(id, {saveName: newName, updateTime: new Date().toLocaleString()})
            setSaveData(saveData.map(item=>item.id===id?
                {...item, saveName: newName, updateTime: new Date().toLocaleString()}:
                item
            ))
        }
        catch(error){
            console.log(error)
        }
    },[saveData, saveDataTable])

    const overwriteSave = useCallback(async (id: string,saveObj:SaveObj)=>{
        if(!saveDataTable) return null
        try {
            setIsLoading(true)
            await saveDataTable.update(id, {saveInfo: saveObj, updateTime: new Date().toLocaleString()})            
            setSaveData(saveData.map(item=>item.id===id?
                {...item, saveInfo: saveObj, updateTime: new Date().toLocaleString()}:
                item
            ))
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    },[saveData,saveDataTable])


    useEffect(()=>{
        if(LocalSaveDataName)setSaveDataTable(indexDB.table(LocalSaveDataName))
    },[LocalSaveDataName])

    useEffect(()=>{
        if(saveDataTable)getAllSaves().then(saves=>{
            if(saves) setSaveData(saves)
        })
    },[saveDataTable,getAllSaves])

    return {saveData,isLoading,deleteSave,createSave,getAllSaves,changeSaveName,loadSave,overwriteSave}
}