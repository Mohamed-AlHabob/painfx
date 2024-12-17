import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdatePatientSchema, patientSchema } from "@/schemas/Patient";


export const patientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => 'patients/',
      transformResponse: (response) => {
        patientSchema.parse(response);
        return response;
      },
    }),
    createPatient: builder.mutation({
      query: (data) => ({
        url: 'patients/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdatePatientSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updatePatient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `patients/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({ ...data }, { queryFulfilled }) {
        createUpdatePatientSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `patients/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPatientsQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApiSlice;
