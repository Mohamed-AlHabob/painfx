import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdateDoctorSchema, doctorSchema } from "@/schemas/Doctor";


export const doctorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: () => 'doctors/',
      transformResponse: (response) => {
        doctorSchema.parse(response);
        return response;
      },
    }),
    getDoctorById: builder.query({
      query: (user) => `doctors/${user}/`,
      transformResponse: (response) => {
        doctorSchema.parse(response);
        return response;
      },
    }),
    createDoctor: builder.mutation({
      query: (data) => ({
        url: 'doctors/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateDoctorSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `doctors/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({...data }, { queryFulfilled }) {
        createUpdateDoctorSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `doctors/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),  overrideExisting: false,
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApiSlice;
