import {z} from "zod";

const baseTask = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  status: z.enum(["todo", "in-progress", "blocked", "done"]).optional(),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  projectId: z.string().min(2),
  assigneeId: z.string().optional(),
});

export const createTaskSchema = z.object({
  body: baseTask.refine(
    (data) => {
      if (!data.startDate || !data.dueDate) return true;
      return new Date(data.dueDate) >= new Date(data.startDate);
    },
    {message: "dueDate must be after startDate", path: ["dueDate"]}
  ),
});

export const updateTaskSchema = z.object({
  body: baseTask
    .partial()
    .refine(
      (data) => {
        if (!data.startDate || !data.dueDate) return true;
        return new Date(data.dueDate) >= new Date(data.startDate);
      },
      {message: "dueDate must be after startDate", path: ["dueDate"]}
    ),
});
