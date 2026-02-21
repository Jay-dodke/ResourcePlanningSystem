import {z} from "zod";

const segmentSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    allocationPercent: z.number().min(0).max(100),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "segment endDate must be after startDate",
    path: ["endDate"],
  });

export const createAllocationSchema = z.object({
  body: z
    .object({
      employeeId: z.string().min(2),
      projectId: z.string().min(2),
      role: z.string().min(2),
      allocationPercent: z.number().min(0).max(100),
      segments: z.array(segmentSchema).optional(),
      billable: z.boolean().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
      message: "endDate must be after startDate",
      path: ["endDate"],
    }),
});

export const updateAllocationSchema = z.object({
  body: z
    .object({
      role: z.string().min(2).optional(),
      allocationPercent: z.number().min(0).max(100).optional(),
      segments: z.array(segmentSchema).optional(),
      billable: z.boolean().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.endDate) >= new Date(data.startDate);
      },
      {message: "endDate must be after startDate", path: ["endDate"]}
    ),
});
