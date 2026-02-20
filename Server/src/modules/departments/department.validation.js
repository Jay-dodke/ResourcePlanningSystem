import {z} from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    code: z.string().optional(),
    description: z.string().optional(),
    managerId: z.string().optional(),
    parentId: z.string().optional(),
  }),
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    code: z.string().optional(),
    description: z.string().optional(),
    managerId: z.string().optional(),
    parentId: z.string().optional(),
  }),
});
