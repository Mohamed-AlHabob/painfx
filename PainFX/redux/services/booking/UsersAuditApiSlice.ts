import { apiSlice } from "@/redux/services/apiSlice";
import { usersAuditSchema } from "@/schemas/UsersAudit";

export const usersAuditApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserAudits: builder.query({
      query: () => 'users-audit/',
      transformResponse: (response) => {
        usersAuditSchema.parse(response);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserAuditsQuery } = usersAuditApiSlice;
