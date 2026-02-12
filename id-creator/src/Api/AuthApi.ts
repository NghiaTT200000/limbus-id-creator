import { ILoginUser } from "Types/API/OAuth/ILoginUser";
import { BaseApi } from "./BaseApi";
import IResponse from "Types/IResponse";


export const AuthApi = BaseApi.injectEndpoints({
    endpoints: (builder)=>({
        login: builder.mutation<ILoginUser,void>({
            query: ()=>({
                url: '/OAuth/oauth2/login',
                method: 'POST',
                credentials: "include",
            }),
            transformResponse: (response: IResponse<ILoginUser>) => response.response,
        }),
        register: builder.mutation<ILoginUser,string>({
            query: (accessToken)=>({
                url: '/OAuth/oauth2/register',
                method: "POST",
                credentials: "include",
                headers:{
                    "Content-type":"application/json"
                },
                body: accessToken,
            }),
            transformResponse: (response: IResponse<ILoginUser>) => response.response,
        }),
        logOut: builder.mutation<void,void>({
            query: ()=>({
                url: '/OAuth/oauth2/logout',
                method: "POST",
                credentials: "include",
            }),
        })
    })
})

export const {useLoginMutation,useRegisterMutation,useLogOutMutation} = AuthApi