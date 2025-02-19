import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdateLikeSchema, likeSchema } from "@/schemas";

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all likes for a specific post
    getLikesByPost: builder.query({
      query: (postId) => `likes/?post=${postId}`,
      transformResponse: (response) => {
        likeSchema.parse(response);
        return response;
      },
    }),

    // Like a post
    likePost: builder.mutation({
      query: (postId) => ({
        url: `likes/`,
        method: 'POST',
        body: { post: postId },
      }),
      transformResponse: (response) => {
        createUpdateLikeSchema.parse(response);
        return response;
      },
    }),

    // Unlike a post
    unlikePost: builder.mutation({
      query: (likeId) => ({
        url: `likes/${likeId}/unlike/`,
        method: 'POST',
      }),
      transformResponse: (response) => {
        createUpdateLikeSchema.parse(response);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLikesByPostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} = likeApiSlice;