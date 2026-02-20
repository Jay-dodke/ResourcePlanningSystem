import {z} from "zod";

export const createLeaveSchema = z.object({
  body: z
    .object({
      employeeId: z.string().optional(),
      type: z.enum(["annual", "sick", "unpaid", "other"]).optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      reason: z.string().optional(),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
      message: "endDate must be after startDate",
      path: ["endDate"],
    }),
});

export const updateLeaveSchema = z.object({
  body: z
    .object({
      type: z.enum(["annual", "sick", "unpaid", "other"]).optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      reason: z.string().optional(),
      status: z.enum(["pending", "approved", "rejected"]).optional(),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.endDate) >= new Date(data.startDate);
      },
      {message: "endDate must be after startDate", path: ["endDate"]}
    ),
});
