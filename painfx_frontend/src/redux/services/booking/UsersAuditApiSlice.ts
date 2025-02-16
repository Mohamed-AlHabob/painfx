import { apiSlice } from "@/redux/services/apiSlice";
import { UsersAuditSchema } from "@/schemas";

export const usersAuditApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserAudits: builder.query({
      query: () => 'users-audit/',
      transformResponse: (response) => {
        UsersAuditSchema.parse(response);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserAuditsQuery } = usersAuditApiSlice;
