import { z } from 'zod';
import { clinicSchema } from '../Clinic';


export const CampaignStatusEnum = z.enum(['active', 'paused', 'completed']);

export const advertisingCampaignSchema = z.object({
  id: z.string().uuid(),
  clinic: z.string().nullable().optional(),
  campaign_name: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  // start_date: z.string().datetime().nullable().optional(),
  // end_date: z.string().datetime().nullable().optional(),
  budget: z.string().nullable().optional(),
  goto: z.string().nullable().optional(),
  status: CampaignStatusEnum.nullable().optional(),
});

export const advertisingCampaignListSchema = z.array(advertisingCampaignSchema);

export type AdvertisingCampaign = z.infer<typeof advertisingCampaignSchema>;
