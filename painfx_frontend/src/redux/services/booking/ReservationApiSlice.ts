import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdateReservationSchema, reservationSchema } from "@/schemas/Reservation";


export const reservationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReservations: builder.query({
      query: () => 'reservations/',
      transformResponse: (response: unknown) => {
        reservationSchema.parse(response);
        return (response as { results: unknown }).results;
      },    }),
    getReservation: builder.query({
      query: (id) => `reservations/${id}/`,
      transformResponse: (response) => {
        reservationSchema.parse(response);
        return response;
      },
    }),
    createReservation: builder.mutation({
      query: (data) => ({
        url: 'reservations/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateReservationSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updateReservation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `reservations/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({...data }, { queryFulfilled }) {
        createUpdateReservationSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deleteReservation: builder.mutation({
      query: (id) => ({
        url: `reservations/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReservationsQuery,
  useGetReservationQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useDeleteReservationMutation,
} = reservationApiSlice;
