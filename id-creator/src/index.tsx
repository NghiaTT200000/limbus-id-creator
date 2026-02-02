import { GoogleOAuthProvider } from '@react-oauth/google';
import HeaderLayout from 'components/Layout/HeaderLayout';
import EgoCardPage from 'Pages/EgoCardPage/EgoCardPage';
import ForumPage from 'Pages/ForumPage/ForumPage';
import IdCardPage from 'Pages/IdCardPage/IdCardPage';
import NewPostPage from 'Pages/NewPostPage/NewPostPage';
import PostPage from 'Pages/PostPage/PostPage';
import UserPage from 'Pages/UserPage/UserPage';
import React, { ReactElement, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import DragAndDroppableSkillPreviewLayer from 'components/CardMakerComponents/Card/components/DragAndDroppableSkill/DragAndDroppableSkillPreviewLayer';
import { indexDB } from 'Utils/IndexDB';
import { ISaveFile } from 'interfaces/ISaveFile';
import { LoginUserContextProvider } from 'context/LoginUserContext';
import { AlertContextProvider } from 'context/AlertContext';
import { RefDownloadProvider } from 'context/ImgUrlContext';
import { LoginMenu } from 'components/LoginMenu/LoginMenu';
import AlertPopUp from 'components/Layout/AlertPopUp/AlertPopUp';
import { SettingMenu } from 'components/SettingMenu/SettingMenu';
import CardMakerFooter from 'components/CardMakerFooter/CardMakerFooter';
import HomePage from 'Pages/HomePage/HomePage';

const root = createRoot(document.getElementById('root')!);

const router = createBrowserRouter([
    {
        path:'/',
        element:<div className="site-layout">
            <HeaderLayout/>
            <div className="site-content">
                <Outlet/>
            </div>
        </div>,
        children:[
            {
                path:"",
                element:<HomePage/>
            },
            {
                path:"user/:userId",
                element:<UserPage/>
            },
            {
                path: "creator",
                element: <SettingMenu>
                    <>
                        <Outlet/>
                        <CardMakerFooter/>
                    </>
                </SettingMenu>,
                children: [
                    {
                        path:"identity",
                        element:<IdCardPage/>
                    },
                    {
                        path:'ego',
                        element:<EgoCardPage/>
                    }
                ],
            },
            
            {
                path:'forum',
                element:<ForumPage/>
            },
            {
                path:"new-post",
                element:<NewPostPage/>
            },
            {
                path:"post/:postId",
                element: <PostPage/>
            }
        ]
    },
])


function App():ReactElement{
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
    return <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <DndProvider backend={TouchBackend}
            options={{ enableMouseEvents: true }}>
            <DragAndDroppableSkillPreviewLayer/>
            <AlertContextProvider>
                <LoginUserContextProvider>
                    <RefDownloadProvider>
                        <LoginMenu>
                            <RouterProvider router={router}/>
                            <AlertPopUp/>
                        </LoginMenu>
                    </RefDownloadProvider>
                </LoginUserContextProvider>
            </AlertContextProvider>
        </DndProvider>
    </GoogleOAuthProvider> 
}

root.render(
    <App/>
);
