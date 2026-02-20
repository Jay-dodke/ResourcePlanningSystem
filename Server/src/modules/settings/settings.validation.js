import {z} from "zod";

export const updateSettingsSchema = z.object({
  body: z.object({
    companyName: z.string().min(2).optional(),
    workHoursPerDay: z.number().min(1).max(24).optional(),
    timezone: z.string().optional(),
    currency: z.string().optional(),
    logo: z.string().url().optional(),
  }),
});
