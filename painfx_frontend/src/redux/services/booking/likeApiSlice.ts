import { apiSlice } from "@/redux/services/apiSlice";
import { likeSchema, createUpdateLikeSchema } from "@/schemas/Social"; // Assuming you have schemas for validation

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLikes: builder.query({
      query: ({ post }) => `likes/?post_id=${post}`,
      transformResponse: (response) => {
        likeSchema.parse(response); 
        return response;
      },
    }),

    createLike: builder.mutation({
      query: ({ post }) => ({
        url: 'likes/',
        method: 'POST',
        body: { post },
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateLikeSchema.parse(data);
        await queryFulfilled;
      },
    }),

    deleteLike: builder.mutation({
      query: (id) => ({
        url: `likes/${id}/`,
        method: 'DELETE',
      }),
    }),

    toggleLike: builder.mutation({
      query: ({ post }) => ({
        url: 'likes/toggle/',
        method: 'POST',
        body: { post },
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateLikeSchema.parse(data);
        await queryFulfilled;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLikesQuery,
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useToggleLikeMutation,
} = likeApiSlice;