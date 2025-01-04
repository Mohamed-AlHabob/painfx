import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdateUserProfileSchema, userProfileSchema } from "@/schemas/user-profile";


export const userProfileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfiles: builder.query({
      query: () => 'users/',
      transformResponse: (response) => {
        userProfileSchema.parse(response);
        return response;
      },
    }),
    createUserProfile: builder.mutation({
      query: (data) => ({
        url: 'users/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateUserProfileSchema.parse(data);
        await queryFulfilled;
      },
    }),
    updateUserProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted({ ...data }, { queryFulfilled }) {
        createUpdateUserProfileSchema.parse(data);
        await queryFulfilled;
      },    }),
    deleteUserProfile: builder.mutation({
      query: (id) => ({
        url: `users/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserProfilesQuery,
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
} = userProfileApiSlice;
