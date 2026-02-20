import {z} from "zod";

export const upsertAvailabilitySchema = z.object({
  body: z.object({
    employeeId: z.string().min(2),
    capacityPercent: z.number().min(0).max(100).optional(),
    availablePercent: z.number().min(0).max(100).optional(),
    workloadStatus: z.enum(["available", "partial", "overloaded"]).optional(),
  }),
});

export const updateAvailabilitySchema = z.object({
  body: z.object({
    capacityPercent: z.number().min(0).max(100).optional(),
    availablePercent: z.number().min(0).max(100).optional(),
    workloadStatus: z.enum(["available", "partial", "overloaded"]).optional(),
  }),
});
