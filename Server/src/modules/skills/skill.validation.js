import {z} from "zod";

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const updateSkillSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    category: z.string().optional(),
    description: z.string().optional(),
  }),
});
