import {z} from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    permissions: z.array(z.string()).optional(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    permissions: z.array(z.string()).optional(),
  }),
});
