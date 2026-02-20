import {z} from "zod";

export const createTimesheetSchema = z.object({
  body: z.object({
    employeeId: z.string().optional(),
    projectId: z.string().min(2),
    taskId: z.string().optional(),
    workDate: z.coerce.date(),
    hours: z.number().min(0).max(24),
    notes: z.string().optional(),
  }),
});

export const updateTimesheetSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    taskId: z.string().optional(),
    workDate: z.coerce.date().optional(),
    hours: z.number().min(0).max(24).optional(),
    notes: z.string().optional(),
    status: z.enum(["submitted", "approved", "rejected"]).optional(),
  }),
});
