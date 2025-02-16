import { apiSlice } from "@/redux/services/apiSlice";
import {advertisingCampaignListSchema} from "@/schemas";



export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdvertisingCampaigns: builder.query({
      query: () => 'advertising-campaigns/',
      transformResponse: (response) => {
        advertisingCampaignListSchema.parse(response);
        return response;
      },
    }),
    getAdvertisingCampaignById: builder.query({
      query: (id) => `advertising-campaigns/${id}/`,
      transformResponse: (response) => {
        advertisingCampaignListSchema.parse(response);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdvertisingCampaignsQuery,
  useGetAdvertisingCampaignByIdQuery,
} = categoryApiSlice;
