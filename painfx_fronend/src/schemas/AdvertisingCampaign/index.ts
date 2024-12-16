import { z } from 'zod';
import { clinicSchema } from '../Clinic';


export const CampaignStatusEnum = z.enum(['active', 'paused', 'completed']);

export const advertisingCampaignSchema = z.object({
  id: z.string().uuid(),
  clinic: clinicSchema,
  campaignName: z.string().min(1, 'Campaign name is required'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  budget: z.number().nonnegative(),
  status: CampaignStatusEnum,
});

export const advertisingCampaignListSchema = z.array(advertisingCampaignSchema);

export type AdvertisingCampaign = z.infer<typeof advertisingCampaignSchema>;
