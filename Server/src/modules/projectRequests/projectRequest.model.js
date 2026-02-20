import mongoose from "mongoose";

const projectRequestSchema = new mongoose.Schema(
  {
    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true},
    allocationId: {type: mongoose.Schema.Types.ObjectId, ref: "Allocation"},
    reason: {type: String, required: true},
    status: {type: String, enum: ["pending", "approved", "rejected"], default: "pending"},
    reviewedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reviewedAt: {type: Date},
  },
  {timestamps: true}
);

const ProjectRequest = mongoose.model("ProjectRequest", projectRequestSchema);

export default ProjectRequest;
