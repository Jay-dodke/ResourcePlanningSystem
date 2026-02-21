import {z} from "zod";

export const createProjectRequestSchema = z.object({
  body: z.object({
    projectId: z.string().min(2),
    allocationId: z.string().optional(),
    reason: z.string().min(5),
  }),
});

export const exitProjectRequestSchema = z.object({
  body: z.object({
    projectId: z.string().min(2),
    reason: z.string().min(5),
  }),
});
