import { apiSlice } from "@/redux/services/apiSlice";
import { notificationSchema } from "@/schemas/Notification";


export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => 'notifications/',
      transformResponse: (response) => {
        notificationSchema.parse(response);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery } = notificationApiSlice;
