import { apiSlice } from "@/redux/services/apiSlice";
import { commentSchema,Comment, createUpdateCommentSchema } from "@/schemas/Social";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], void>({
      query: () => 'comments/',
      transformResponse: (response: unknown) => {
        const parsedResponse = commentSchema.array().parse(response);
        return parsedResponse;
      },
    }),
    createComment: builder.mutation<Comment, Partial<Comment>>({
      query: (data) => ({
        url: 'comments/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateCommentSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `comments/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentApiSlice;
