import {z} from "zod";

export const createProjectSchema = z.object({
  body: z
    .object({
      name: z.string().min(2),
      clientName: z.string().min(2),
      status: z.enum(["planned", "active", "on-hold", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high", "critical"]).optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      managerId: z.string().optional(),
    })
    .refine((data) => !data.endDate || new Date(data.endDate) >= new Date(data.startDate), {
      message: "endDate must be after startDate",
      path: ["endDate"],
    }),
});

export const updateProjectSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),
      clientName: z.string().min(2).optional(),
      status: z.enum(["planned", "active", "on-hold", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high", "critical"]).optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      managerId: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.endDate) >= new Date(data.startDate);
      },
      {message: "endDate must be after startDate", path: ["endDate"]}
    ),
});
