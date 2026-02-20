import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {type: String, required: true, trim: true},
    description: {type: String, default: ""},
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "blocked", "done"],
      default: "todo",
    },
    startDate: {type: Date},
    dueDate: {type: Date},
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true},
    assigneeId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  },
  {timestamps: true}
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
