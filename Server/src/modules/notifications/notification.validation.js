import {z} from "zod";

export const createNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    message: z.string().min(2),
    type: z.enum(["info", "warning", "success", "error"]).optional(),
    targetType: z.enum(["all", "role", "users"]).optional(),
    roleId: z.string().optional(),
    userIds: z.array(z.string()).optional(),
    userId: z.string().optional(),
  }),
});

export const updateNotificationSchema = z.object({
  body: z.object({
    read: z.boolean().optional(),
  }),
});
