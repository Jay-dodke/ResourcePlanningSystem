import {z} from "zod";

const skillSchema = z.union([
  z.string().min(1),
  z.object({
    name: z.string().min(1),
    level: z.number().min(1).max(5).optional(),
  }),
]);

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    roleId: z.string().optional(),
    designation: z.string().optional(),
    departmentId: z.string().optional(),
    managerId: z.string().optional(),
    skills: z.array(skillSchema).optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    avatar: z.string().url().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    roleId: z.string().optional(),
    designation: z.string().optional(),
    departmentId: z.string().optional(),
    managerId: z.string().optional(),
    skills: z.array(skillSchema).optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    avatar: z.string().url().optional(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8).optional(),
  }),
});
