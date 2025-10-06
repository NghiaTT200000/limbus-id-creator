import { GoogleOAuthProvider } from '@react-oauth/google';
import HeaderLayout from 'utils/components/Layout/HeaderLayout';
import EgoCardPage from 'pages/egoCardPage';
import ForumPage from 'pages/forumPage';
import IdCardPage from 'pages/idCardPage';
import NewPostPage from 'pages/NewPostPage/NewPostPage';
import PostPage from 'pages/PostPage/PostPage';
import UserPage from 'pages/UserPage/UserPage';
import React, { ReactElement, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import DragAndDroppableSkillPreviewLayer from 'utils/components/CardMakerComponents/Card/components/DragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import { indexDB } from 'utils/indexDB';
import { ISaveFile } from 'interfaces/ISaveFile';

const root = createRoot(document.getElementById('root')!);

const router = createBrowserRouter([
    {
        path:'/',
        element:<HeaderLayout/>,
        children:[
            {
                path:"",
                element:<IdCardPage/>
            },
            {
                path:"User/:userId",
                element:<UserPage/>
            },
            {
                path:"IdCreator",
                element:<IdCardPage/>
            },
            {
                path:'EgoCreator',
                element:<EgoCardPage/>
            },
            {
                path:'Forum',
                element:<ForumPage/>
            },
            {
                path:"NewPost",
                element:<NewPostPage/>
            },
            {
                path:"Post/:postId",
                element: <PostPage/>
            }
        ]
    },
])


function App():ReactElement{
    useEffect(()=>{
        // const keyStorageName = ["currEgoSave","EgoLocalSaves","currIdSave","IdLocalSaves","customKeywords"]
        // for (let i = 0; i < localStorage.length; i++) {
        //     if(!keyStorageName.includes(localStorage.key(i))){
        //         localStorage.removeItem(localStorage.key(i))
        //     }
        // }
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
    return <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <DndProvider backend={TouchBackend}
            options={{ enableMouseEvents: true }}>
            <DragAndDroppableSkillPreviewLayer/>
            <RouterProvider router={router}/>
        </DndProvider>
    </GoogleOAuthProvider> 
}

root.render(
    <App/>
);
