import HeaderLayout from "App/Pages/Layout/Header/HeaderLayout";
import FooterLayout from "App/Pages/Layout/Footer/FooterLayout";
import EgoCardPage from "./Pages/Creators/EgoCardPage/EgoCardPage";
import ForumPage from "./Pages/ForumPage/ForumPage";
import HomePage from "./Pages/HomePage/HomePage";
import IdCardPage from "./Pages/Creators/IdCardPage/IdCardPage";
import NewPostPage from "./Pages/NewPostPage/NewPostPage";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import PostPage from "./Pages/PostPage/PostPage";
import UserPage from "./Pages/UserPage/UserPage";
import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div className="site-layout">
            <HeaderLayout/>
            <div className="site-content">
                <Outlet/>
            </div>
            <FooterLayout/>
        </div>
    );
}

function CreatorLayout() {
    return (
        <div className="site-layout">
            <HeaderLayout/>
            <div className="site-content">
                <Outlet/>
            </div>
        </div>
    );
}

export const router = createBrowserRouter([
    {
        path:'/',
        element:<MainLayout/>,
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
    },
    {
        path:'/creator',
        element:<CreatorLayout/>,
        children:[
            {
                path:"identity",
                element:<IdCardPage/>
            },
            {
                path:'ego',
                element:<EgoCardPage/>
            }
        ],
    }
])