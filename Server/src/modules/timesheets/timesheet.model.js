import mongoose from "mongoose";

const timesheetSchema = new mongoose.Schema(
  {
    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true},
    taskId: {type: mongoose.Schema.Types.ObjectId, ref: "Task"},
    workDate: {type: Date, required: true},
    hours: {type: Number, required: true, min: 0, max: 24},
    notes: {type: String, default: ""},
    status: {
      type: String,
      enum: ["submitted", "approved", "rejected"],
      default: "submitted",
    },
    approvedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    approvedAt: {type: Date},
  },
  {timestamps: true}
);

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

export default Timesheet;
