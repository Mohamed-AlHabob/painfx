import { apiSlice } from "@/redux/services/apiSlice";
import { likeSchema, createUpdateLikeSchema } from "@/schemas/Social"; // Assuming you have schemas for validation

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch likes for a specific content type and object ID
    getLikes: builder.query({
      query: ({ content_type, object_id }) => `likes/?content_type=${content_type}&object_id=${object_id}`,
      transformResponse: (response) => {
        likeSchema.parse(response); // Validate the response
        return response;
      },
    }),

    // Create a like for a specific content type and object ID
    createLike: builder.mutation({
      query: ({ content_type, object_id }) => ({
        url: 'likes/',
        method: 'POST',
        body: { content_type, object_id },
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateLikeSchema.parse(data); // Validate the input data
        await queryFulfilled;
      },
    }),

    // Delete a like by ID
    deleteLike: builder.mutation({
      query: (id) => ({
        url: `likes/${id}/`,
        method: 'DELETE',
      }),
    }),

    // Toggle a like (create or delete based on existence)
    toggleLike: builder.mutation({
      query: ({ content_type, object_id }) => ({
        url: 'likes/toggle/',
        method: 'POST',
        body: { content_type, object_id },
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateLikeSchema.parse(data); // Validate the input data
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