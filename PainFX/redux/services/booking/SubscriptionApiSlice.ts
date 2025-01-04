import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdateSubscriptionSchema, subscriptionSchema } from "@/schemas/Payment";


export const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query({
      query: () => 'subscriptions/',
      transformResponse: (response) => {
        subscriptionSchema.parse(response);
        return response;
      },
    }),
    createSubscription: builder.mutation({
      query: (data) => ({
        url: 'subscriptions/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateSubscriptionSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updateSubscription: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `subscriptions/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({ ...data }, { queryFulfilled }) {
        createUpdateSubscriptionSchema.parse(data);
        await queryFulfilled;
      },    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `subscriptions/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApiSlice;
