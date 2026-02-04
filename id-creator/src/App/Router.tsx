import HeaderLayout from "Components/Layout/HeaderLayout";
import EgoCardPage from "./Pages/EgoCardPage/EgoCardPage";
import ForumPage from "./Pages/ForumPage/ForumPage";
import HomePage from "./Pages/HomePage/HomePage";
import IdCardPage from "./Pages/IdCardPage/IdCardPage";
import NewPostPage from "./Pages/NewPostPage/NewPostPage";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import PostPage from "./Pages/PostPage/PostPage";
import UserPage from "./Pages/UserPage/UserPage";
import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

export const router = createBrowserRouter([
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
            },
            {
                path: "*",
                element: <NotFoundPage/>
            }
        ],
    }
])