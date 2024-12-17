import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdatePaymentMethodSchema, paymentMethodSchema } from "@/schemas/Payment";


export const paymentMethodApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query({
      query: () => 'payment-methods/',
      transformResponse: (response) => {
        paymentMethodSchema.parse(response);
        return response;
      },
    }),
    createPaymentMethod: builder.mutation({
      query: (data) => ({
        url: 'payment-methods/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdatePaymentMethodSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updatePaymentMethod: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payment-methods/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({ ...data }, { queryFulfilled }) {
        createUpdatePaymentMethodSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `payment-methods/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodApiSlice;
