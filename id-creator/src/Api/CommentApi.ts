import { BaseApi } from "./BaseApi";
import IResponse from "Types/IResponse";
import { IComment } from "Types/IPost/IComment";

interface IGetCommentsParams {
    postId: string
    page: number
    limit: number
}

interface ICreateCommentBody {
    userId: string
    postId: string
    comment: string
}

const CommentApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getComments: builder.query<IComment[], IGetCommentsParams>({
            query: ({ postId, page, limit }) => `/Comment?PostId=${postId}&page=${page}&limit=${limit}`,
            transformResponse: (response: IResponse<IComment[]>) => response.response,
            serializeQueryArgs: ({ queryArgs }) => queryArgs.postId,
            merge: (currentCache, newItems) => {
                currentCache.push(...newItems)
            },
            forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
            providesTags: (result, error, { postId }) => [{ type: 'Comment', id: postId }],
        }),

        createComment: builder.mutation<IComment, ICreateCommentBody>({
            query: (body) => ({
                url: '/Comment/create',
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body,
            }),
            transformResponse: (response: IResponse<IComment>) => response.response,
            invalidatesTags: (result, error, { postId }) => [{ type: 'Comment', id: postId }],
        }),
    }),
})

export const { useGetCommentsQuery, useCreateCommentMutation } = CommentApi