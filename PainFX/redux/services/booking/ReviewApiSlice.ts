import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdateReviewSchema, reviewSchema } from "@/schemas/Review";


export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => 'reviews/',
      transformResponse: (response) => {
        reviewSchema.parse(response);
        return response;
      },
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: 'reviews/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateReviewSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `reviews/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({ ...data }, { queryFulfilled }) {
        createUpdateReviewSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `reviews/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApiSlice;
