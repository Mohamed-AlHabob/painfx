import { apiSlice } from '../../services/apiSlice';
import {PostSchema,postListResponseSchema,Post} from "@/schemas"

export interface PostListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[] | [];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tags?: { name: string }[]; // Array of objects with a `name` field
  media_attachments?: { media_type: string; file?: File; url?: string }[];
}

export interface UpdatePostRequest {
  id: string;
  title?: string;
  content?: string;
  tags?: number[];
  media_attachments?: { media_type: string; file?: File; url?: string }[]; // Updated field name
}

export interface DeletePostRequest {
  id: string;
}

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PostListResponse, { page?: number }>({
      query: ({ page = 1 }) => `posts/?page=${page}`,
      transformResponse: (response: PostListResponse) => {
        postListResponseSchema.parse(response);
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    getPost: builder.query<Post, string>({
      query: (id) => `posts/${id}/`,
      transformResponse: (response: Post) => {
        PostSchema.parse(response); // Validate the response
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (data) => ({
        url: 'posts/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: Post) => {
        PostSchema.parse(response); // Validate the response
        return response;
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation<Post, UpdatePostRequest>({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}/`,
        method: 'PATCH',
        body: {
          ...patch,
          media_attachments: patch.media_attachments, // Updated field name
        },
      }),
      transformResponse: (response: Post) => {
        PostSchema.parse(response); // Validate the response
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    deletePost: builder.mutation<{ success: boolean; id: string }, DeletePostRequest>({
      query: ({ id }) => ({
        url: `posts/${id}/`,
        method: 'DELETE',
      }),
      transformResponse: (response: { success: boolean; id: string }) => {
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApiSlice;