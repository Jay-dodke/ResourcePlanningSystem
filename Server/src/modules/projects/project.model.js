import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    clientName: {type: String, required: true, trim: true},
    status: {type: String, enum: ["planned", "active", "on-hold", "completed"], default: "planned"},
    priority: {type: String, enum: ["low", "medium", "high", "critical"], default: "medium"},
    startDate: {type: Date, required: true},
    endDate: {type: Date},
    managerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  },
  {timestamps: true}
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
