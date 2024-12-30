import { apiSlice } from "@/redux/services/apiSlice";
import { createUpdateEventScheduleSchema, eventScheduleSchema } from "@/schemas/EventSchedule";

export const eventScheduleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEventSchedules: builder.query({
      query: () => 'event-schedules/',
      transformResponse: (response) => {
        eventScheduleSchema.parse(response);
        return response;
      },
    }),
    createEventSchedule: builder.mutation({
      query: (data) => ({
        url: 'event-schedules/',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(data, { queryFulfilled }) {
        createUpdateEventScheduleSchema.parse(data);
        await queryFulfilled;
      },
    }),
    deleteEventSchedule: builder.mutation({
      query: (id) => ({
        url: `event-schedules/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEventSchedulesQuery,
  useCreateEventScheduleMutation,
  useDeleteEventScheduleMutation,
} = eventScheduleApiSlice;
