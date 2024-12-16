import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdatePaymentSchema, paymentSchema } from "@/schemas/Payment";


export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => 'payments/',
      transformResponse: (response) => {
        paymentSchema.parse(response);
        return response;
      },
    }),
    createPayment: builder.mutation({
      query: (data) => ({
        url: 'payments/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdatePaymentSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updatePayment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payments/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({  ...data }, { queryFulfilled }) {
        createUpdatePaymentSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `payments/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentApiSlice;
