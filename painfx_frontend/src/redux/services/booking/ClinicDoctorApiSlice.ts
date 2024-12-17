import { apiSlice } from "@/redux/services/apiSlice";
import { clinicDoctorSchema } from "@/schemas/Clinic";


export const clinicDoctorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClinicDoctors: builder.query({
      query: (clinicId) => `clinics/${clinicId}/doctors/`,
      transformResponse: (response) => {
        clinicDoctorSchema.parse(response);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetClinicDoctorsQuery } = clinicDoctorApiSlice;
