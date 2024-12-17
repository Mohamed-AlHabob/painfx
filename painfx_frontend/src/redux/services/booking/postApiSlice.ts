import { apiSlice } from '../../services/apiSlice';
import { Post, postListResponseSchema, postSchema } from '../../../schemas/Social/post';

export interface PostListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[] | [];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tags?: number[];
  video_file?: File;
  video_url?: string;
  thumbnail_url?: string;
}

// New Interfaces for Update and Delete
export interface UpdatePostRequest {
  id: string;
  title?: string;
  content?: string;
  tags?: number[];
  video_file?: File;
  video_url?: string;
  thumbnail_url?: string;
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
        postSchema.parse(response);
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
        postSchema.parse(response);
        return response;
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    updatePost: builder.mutation<Post, UpdatePostRequest>({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: (response: Post) => {
        postSchema.parse(response);
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
