import { Table } from "dexie";
import { ISaveFile } from "Interfaces/ISaveFile";
import { useCallback, useEffect, useState } from "react";
import { db } from "utils/IndexDB/db";


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
           setSaveData([...saveData, { ...saveObj}])
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    },[saveData, saveDataTable])

    const getAllSaves = useCallback(async () => {
        if (!saveDataTable) return null
        return await saveDataTable?.toArray()
    }, [saveDataTable])

    const loadSave = useCallback(async (id: string)=>{
        if(!saveDataTable) return null
        return await saveDataTable?.get(id) as ISaveFile<SaveObj>
    },[saveData, saveDataTable])

    const overwriteSave = useCallback(async (id: string,saveObj:ISaveFile<SaveObj>)=>{
        if(!saveDataTable) return null
        try {
            setIsLoading(true)
            await saveDataTable.update(id, saveObj)            
            setSaveData(saveData.map(item=>item.id===id?{...saveObj}:item))
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    },[saveData])


    useEffect(()=>{
        if(LocalSaveDataName)setSaveDataTable(db.table(LocalSaveDataName))
    },[LocalSaveDataName])

    useEffect(()=>{
        if(saveDataTable)getAllSaves().then(saves=>{
            if(saves) setSaveData(saves)
        })
    },[saveDataTable])

    return {saveData,isLoading,deleteSave,createSave,getAllSaves,loadSave,overwriteSave}
}