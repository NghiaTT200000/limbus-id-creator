import { RouterProvider } from "react-router-dom";
import Provider from "./Provider";
import { router } from "./Router";
import React, { useEffect } from "react";
import { indexDB } from "Features/CardCreator/Utils/IndexDB";
import { ISaveFile } from "Types/ISaveFile";

export default function App(){
    useEffect(()=>{
        // Migrating from local storage to indexDB
        const idLocalSaves = localStorage.getItem("IdLocalSaves")
        const egoLocalSaves = localStorage.getItem("EgoLocalSaves")
        const currIdSave = localStorage.getItem("currIdSave")
        const currEgoSave = localStorage.getItem("currEgoSave")

        if(idLocalSaves){
            const saveArr:ISaveFile<any>[] = JSON.parse(idLocalSaves)
            if(saveArr.length>0){
                indexDB.IdLocalSaves.bulkPut(saveArr)
            }
            localStorage.removeItem("IdLocalSaves")
        }
        if(egoLocalSaves){
            const saveArr:ISaveFile<any>[] = JSON.parse(egoLocalSaves)
            if(saveArr.length>0){
                indexDB.EgoLocalSaves.bulkPut(saveArr)
            }
            localStorage.removeItem("EgoLocalSaves")
        }
        if(currIdSave){
            indexDB.currIdSave.put(JSON.parse(currIdSave), 1)
            localStorage.removeItem("currIdSave")
        }
        if(currEgoSave){
            indexDB.currEgoSave.put(JSON.parse(currEgoSave), 1)
            localStorage.removeItem("currEgoSave")
        }
    },[])

    return <Provider>
        <RouterProvider router={router}/>
    </Provider>
}