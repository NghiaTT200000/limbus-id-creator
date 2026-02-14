import { BaseApi } from "./BaseApi";
import IResponse from "Types/IResponse";
import { IUserProfile } from "Types/API/OAuth/IUserProfile";

const UserApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IUserProfile, string>({
            query: (userId) => `/User/${userId}`,
            transformResponse: (response: IResponse<IUserProfile>) => response.response,
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
        }),

        changeName: builder.mutation<string, { userId: string, name: string }>({
            query: ({ userId, name }) => ({
                url: `/User/change/name/${userId}`,
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(name),
            }),
            transformResponse: (response: IResponse<string>) => response.response,
            invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
        }),

        changeProfileImg: builder.mutation<string, { userId: string, form: FormData }>({
            query: ({ userId, form }) => ({
                url: `/User/change/profile/${userId}`,
                method: 'POST',
                body: form,
            }),
            transformResponse: (response: IResponse<string>) => response.response,
            invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
        }),
    }),
})

export const { useGetUserQuery, useChangeNameMutation, useChangeProfileImgMutation } = UserApi