import { apiSlice } from "@/redux/services/apiSlice";
import { Clinic, clinicSchema, createUpdateClinicSchema } from "@/schemas/Clinic";

export interface ClinicListResponse {
  length: number;
  count: number;
  next: string | null;
  previous: string | null;
  results: Clinic[] | [];
}

export const clinicApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClinics: builder.query<ClinicListResponse, { page?: number }>({
      query: ({ page = 1 }) => `clinics/?page=${page}`,
      transformResponse: (response: ClinicListResponse) => {
        clinicSchema.parse(response);
        return response;
      },
    }),
    getClinicById: builder.query({
      query: (id) => `clinics/${id}/`,
      transformResponse: (response) => {
        clinicSchema.parse(response);
        return response;
      },
    }),
    createClinic: builder.mutation({
      query: (data) => ({
        url: 'clinics/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateClinicSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updateClinic: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `clinics/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({ ...data }, { queryFulfilled }) {
        createUpdateClinicSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deleteClinic: builder.mutation({
      query: (id) => ({
        url: `clinics/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),  overrideExisting: false,
});

export const {
  useGetClinicsQuery,
  useGetClinicByIdQuery,
  useCreateClinicMutation,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
} = clinicApiSlice;
