import { apiSlice } from "@/redux/services/apiSlice";
import { commentSchema, Comment, createUpdateCommentSchema } from "@/schemas/Social";

export interface CommentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Comment[];
}

export interface CreateCommentRequest {
  content_type: string; // e.g., "post", "comment", "event"
  object_id: string; // ID of the object being commented on
  text: string;
  parent?: string; // For nested comments
}

export interface DeleteCommentRequest {
  id: string;
}

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<CommentListResponse, { content_type: string; object_id: string; page?: number }>({
      query: ({ content_type, object_id, page = 1 }) => `comments/?content_type=${content_type}&object_id=${object_id}&page=${page}`,
      transformResponse: (response: CommentListResponse) => {
        return commentSchema.array().parse(response.results);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment', id: 'LIST' },
            ]
          : [{ type: 'Comment', id: 'LIST' }],
    }),
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: (data) => ({
        url: 'comments/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: Comment) => {
        commentSchema.parse(response);
        return response;
      },
      invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
    }),
    deleteComment: builder.mutation<{ success: boolean; id: string }, DeleteCommentRequest>({
      query: ({ id }) => ({
        url: `comments/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) => result ? [{ type: 'Comment', id: result.id }] : [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentApiSlice;