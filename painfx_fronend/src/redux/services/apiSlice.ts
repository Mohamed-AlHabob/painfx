import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { logout, setAuth } from '../services/auth/authSlice';


const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"}/api`,
  credentials: 'include',
});

interface ExtraOptions {
  [key: string]: any;
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ExtraOptions
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error('API Request Error:', result.error);

    if (result.error.status === 401) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await baseQuery(
            { url: '/jwt/refresh/', method: 'POST' },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            api.dispatch(setAuth());
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      console.error('Unhandled API Error:', result.error);
    }
  }

  return result;
};
export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Post', 'Like', 'Comment'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
