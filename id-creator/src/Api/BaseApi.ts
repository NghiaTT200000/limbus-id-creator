import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EnvironmentVariables } from 'Config/Environments';

export const BaseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: EnvironmentVariables.REACT_APP_SERVER_URL + "/API",
        credentials: 'include',
    }),
    tagTypes: ['Post', 'Posts', 'Comment', 'User', 'SaveIDInfo', 'SaveEGOInfo', 'Auth'],
    endpoints: ()=>({}),
});